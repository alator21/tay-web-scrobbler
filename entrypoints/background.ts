import { BrowserStorage } from "@/core/domain/implementation/BrowserStorage.ts";
import { logger, LogLevel } from "@/core/domain/implementation/Logger.ts";
import { BrowserCommunicator } from "@/core/domain/implementation/BrowserCommunicator.ts";
import { BrowserLastFmAuthenticator } from "@/core/domain/implementation/BrowserLastFmAuthenticator.ts";
import { BrowserUrlManager } from "@/core/domain/implementation/BrowserUrlManager.ts";
import { SongListenedDetector } from "@/core/domain/implementation/SongListenedDetector.ts";
import { SongChangedDetector } from "@/core/domain/implementation/SongChangedDetector.ts";
import { CurrentSongPersistor } from "@/core/domain/CurrentSongPersistor.ts";
import { initializeLastFmApi } from "@alator21/lastfm";
import { Storage } from "@/core/domain/Storage.ts";
import { authenticate } from "@/core/domain/background/authenticate.ts";
import { logout } from "@/core/domain/background/logout.ts";
import { playerCurrentState } from "@/core/domain/background/playerCurrentState.ts";
import { getPlayerCurrentState } from "@/core/domain/background/getPlayerCurrentState.ts";
import { getOptionsPageUrl } from "@/core/domain/background/getOptionsPageUrl.ts";
import { getOptions } from "@/core/domain/background/getOptions.ts";
import { saveOptions } from "@/core/domain/background/saveOptions.ts";
import { resetOptionsToDefault } from "@/core/domain/background/resetOptionsToDefault.ts";
import { keepAlive } from "@/core/domain/background/keepAlive.ts";
import { getLastFmAuthStatus } from "@/core/domain/background/getLastFmAuthStatus.ts";
import { defaultOptions } from "@/core/domain/background/common";

export default defineBackground(() => {
  async function main() {
    logger.info("background.ts");
    const CLIENT_ID = import.meta.env.VITE_LAST_FM_API_KEY;
    const SHARED_SECRET = import.meta.env.VITE_LAST_FM_SHARED_SECRET;
    const storage: Storage = new BrowserStorage();
    const { logLevel, scrobblingEnabled, scrobbleThreshold } =
      await getOptionsFromStorageOrDefault(storage);
    logger.setLevel(logLevel);
    const communicator = new BrowserCommunicator();
    const lastFmAuthenticator = new BrowserLastFmAuthenticator(CLIENT_ID);
    const urlManager = new BrowserUrlManager();
    const songListenedDetector = new SongListenedDetector(
      scrobblingEnabled,
      scrobbleThreshold,
    );
    const songChangedDetector = new SongChangedDetector();
    const currentSongPersistor = new CurrentSongPersistor(5000);

    initializeLastFmApi(CLIENT_ID, SHARED_SECRET);
    storage.addChangeListener("options", (options) => {
      logger.info(`Options changed`);
      logger.info(options);
      updateDependenciesBasedOnOptions(options);
    });

    try {
      logger.info("Adding typed listener");
      communicator.addTypedListener(async (message, sendResponse) => {
        switch (message.type) {
          case "AUTHENTICATE": {
            await authenticate(storage, lastFmAuthenticator, sendResponse);
            break;
          }
          case "LOGOUT": {
            await logout(storage, sendResponse);
            break;
          }
          case "PLAYER_CURRENT_STATE": {
            await playerCurrentState(
              storage,
              currentSongPersistor,
              songChangedDetector,
              songListenedDetector,
              message.player,
              sendResponse,
            );
            break;
          }
          case "GET_CURRENT_PLAYER_STATE": {
            await getPlayerCurrentState(currentSongPersistor, sendResponse);
            break;
          }
          case "GET_OPTIONS_PAGE_URL": {
            await getOptionsPageUrl(urlManager, sendResponse);
            break;
          }
          case "GET_OPTIONS": {
            await getOptions(storage, sendResponse);
            break;
          }
          case "SAVE_OPTIONS": {
            await saveOptions(storage, message.options, sendResponse);
            break;
          }
          case "RESET_OPTIONS_TO_DEFAULT": {
            await resetOptionsToDefault(storage, sendResponse);
            break;
          }
          case "KEEP_ALIVE": {
            await keepAlive(sendResponse);
            break;
          }
          case "GET_LAST_FM_AUTH_STATUS": {
            await getLastFmAuthStatus(storage, sendResponse);
            break;
          }
        }
      });
    } catch (error) {
      logger.info(error);
    }

    function updateDependenciesBasedOnOptions(options: {
      scrobbleThreshold: number;
      scrobblingEnabled: boolean;
      logLevel: LogLevel;
    }) {
      const { logLevel, scrobbleThreshold } = options;

      songListenedDetector.modifyEnabledStatus(scrobblingEnabled);
      songListenedDetector.updateThreshold(scrobbleThreshold);
      logger.setLevel(logLevel);
    }
  }

  async function getOptionsFromStorageOrDefault(storage: Storage) {
    const options = await storage.get("options");
    return options === undefined ? defaultOptions() : options;
  }

  main();
});
