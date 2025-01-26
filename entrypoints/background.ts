import { BrowserStorage } from "@/core/domain/implementation/BrowserStorage.ts";
import { logger, LogLevel } from "@/core/domain/implementation/Logger.ts";
import { BrowserCommunicator } from "@/core/domain/implementation/BrowserCommunicator.ts";
import { BrowserLastFmAuthenticator } from "@/core/domain/implementation/BrowserLastFmAuthenticator.ts";
import { BrowserUrlManager } from "@/core/domain/implementation/BrowserUrlManager.ts";
import { SongListenedDetector } from "@/core/domain/implementation/SongListenedDetector.ts";
import { SongChangedDetector } from "@/core/domain/implementation/SongChangedDetector.ts";
import { CurrentSongPersistor } from "@/core/domain/CurrentSongPersistor.ts";
import {
  getSession,
  initializeLastFmApi,
  scrobble,
  updateNowPlaying,
} from "@alator21/lastfm";
import { LastFmAuthenticator } from "@/core/domain/implementation/LastFmAuthenticator.ts";
import { Storage } from "@/core/domain/Storage.ts";

export default defineBackground(() => {
  const CLIENT_ID = import.meta.env.VITE_LAST_FM_API_KEY;
  const SHARED_SECRET = import.meta.env.VITE_LAST_FM_SHARED_SECRET;
  console.log({ CLIENT_ID, SHARED_SECRET });
  console.log(import.meta.env);

  async function main() {
    const storage = new BrowserStorage();
    const { logLevel, scrobbleThreshold } =
      await getOptionsFromStorageOrDefault(storage);
    logger.setLevel(logLevel);
    const communicator = new BrowserCommunicator();
    const lastFmAuthenticator = new BrowserLastFmAuthenticator(CLIENT_ID);
    const urlManager = new BrowserUrlManager();
    const songListenedDetector = new SongListenedDetector(scrobbleThreshold);
    const songChangedDetector = new SongChangedDetector();
    const currentSongPersistor = new CurrentSongPersistor(5000);

    function updateDependenciesBasedOnOptions(options: {
      scrobbleThreshold: number;
      scrobblingEnabled: boolean;
      logLevel: LogLevel;
    }) {
      const { logLevel, scrobbleThreshold } = options;

      songListenedDetector.updateThreshold(scrobbleThreshold);
      logger.setLevel(logLevel);
    }

    logger.info("chrome/background.ts");
    initializeLastFmApi(CLIENT_ID, SHARED_SECRET);
    //TODO: move this to core if possible
    storage.addChangeListener("options", (options) => {
      logger.info(`options changed`);
      logger.info(options);
      updateDependenciesBasedOnOptions(options);
    });
    try {
      logger.info("Adding typed listener");
      communicator.addTypedListener(async (message, sendResponse) => {
        switch (message.type) {
          case "AUTHENTICATE": {
            try {
              const status = await storage.get("last_fm_session");
              if (status !== undefined) {
                sendResponse({
                  type: "AUTHENTICATE",
                  success: false,
                  error: `You can't login when you are already logged in.`,
                });
                break;
              }
              const session = await getLastFmSession(lastFmAuthenticator);
              storage.set("last_fm_session", {
                session_key: session.key,
                user: session.name,
              });
              sendResponse({
                type: "AUTHENTICATE",
                success: true,
                data: { user: session.name },
              });
            } catch (error) {
              logger.error(error);
              sendResponse({
                type: "AUTHENTICATE",
                success: false,
                error: `error while authenticating`,
              });
            }
            break;
          }
          case "LOGOUT": {
            try {
              const status = await storage.get("last_fm_session");
              if (status === undefined) {
                sendResponse({
                  type: "LOGOUT",
                  success: false,
                  error: `You can't logout when you are not logged in.`,
                });
                break;
              }
              await storage.removeAll();
              sendResponse({ type: "LOGOUT", success: true });
            } catch (error) {
              logger.error(error);
              sendResponse({
                type: "LOGOUT",
                success: false,
                error: `error while logging out`,
              });
            }
            break;
          }
          case "PLAYER_CURRENT_STATE": {
            try {
              const { player } = message;
              logger.debug(`Current state of player`);
              logger.debug(player);
              const { artist, title, album, position } = player.song;
              currentSongPersistor.songTick(player);
              const songChanged = songChangedDetector.songTick(player);
              const shouldScrobbleSong = songListenedDetector.songTick(player);
              if (songChanged) {
                logger.info(`Song changed. Now playing: ${title} by ${artist}`);
                await updateCurrentSong(storage, title, artist, album);
              }
              if (shouldScrobbleSong) {
                logger.info(`Scrobbling song: ${title} by ${artist}`);
                await scrobbleSong(
                  storage,
                  title,
                  artist,
                  album,
                  getSongStartingTime(position),
                );
              }
              sendResponse({ type: "PLAYER_CURRENT_STATE" });
            } catch (error) {
              logger.info(error);
              sendResponse({ type: "PLAYER_CURRENT_STATE" });
            }
            break;
          }
          case "GET_CURRENT_PLAYER_STATE": {
            sendResponse({
              type: "GET_CURRENT_PLAYER_STATE",
              success: true,
              player: currentSongPersistor.getCurrentPlayer(),
            });
            break;
          }
          case "GET_OPTIONS_PAGE_URL": {
            sendResponse({
              type: "GET_OPTIONS_PAGE_URL",
              success: true,
              url: urlManager.optionsUrl(),
            });
            break;
          }
          case "GET_OPTIONS": {
            let options = await storage.get("options");
            logger.info({ options });
            if (options === undefined) {
              options = defaultOptions();
              await storage.set("options", options);
            }
            sendResponse({ type: "GET_OPTIONS", success: true, options });
            break;
          }
          case "SAVE_OPTIONS": {
            const { options } = message;
            logger.info(`Saving options`);
            logger.info({ options });
            await storage.set("options", options);
            sendResponse({ type: "SAVE_OPTIONS", success: true });
            break;
          }
          case "RESET_OPTIONS_TO_DEFAULT": {
            await storage.set("options", defaultOptions());
            sendResponse({ type: "RESET_OPTIONS_TO_DEFAULT", success: true });
            break;
          }
          case "KEEP_ALIVE": {
            sendResponse({ type: "KEEP_ALIVE" });
            break;
          }
          case "GET_LAST_FM_AUTH_STATUS": {
            try {
              const status = await storage.get("last_fm_session");
              logger.debug({ status });
              sendResponse({
                type: "GET_LAST_FM_AUTH_STATUS",
                success: true,
                data:
                  status !== undefined
                    ? { sessionKey: status.session_key, user: status.user }
                    : undefined,
              });
            } catch (error) {
              logger.error(error);
              sendResponse({
                type: "GET_LAST_FM_AUTH_STATUS",
                success: false,
                error: `error while getting status`,
              });
            }
            break;
          }
        }
      });
    } catch (error) {
      logger.info(error);
    }
  }

  main();
});

function getSongStartingTime(startedSecondsBefore: number): Date {
  const currentTime = new Date();
  return new Date(currentTime.getTime() - startedSecondsBefore * 1000);
}

async function getLastFmSession(authenticator: LastFmAuthenticator) {
  const authToken = await authenticator.authenticate();
  const { session } = await getSession({ authToken });
  return session;
}

async function scrobbleSong(
  storage: Storage,
  track: string,
  artist: string,
  album: string,
  timestamp: Date,
) {
  const sessionKey = await getSessionKeyOrThrow(storage);
  await scrobble({ sessionKey, artist, album, timestamp, track });
}

async function updateCurrentSong(
  storage: Storage,
  track: string,
  artist: string,
  album: string,
) {
  const sessionKey = await getSessionKeyOrThrow(storage);
  await updateNowPlaying({ sessionKey, artist, track, album });
}

async function getSessionKeyOrThrow(storage: Storage) {
  const session = await storage.get("last_fm_session");
  if (session === undefined) {
    throw new Error("Unauthorized");
  }
  return session.session_key;
}

export function defaultOptions(): {
  scrobblingEnabled: boolean;
  scrobbleThreshold: number;
  logLevel: LogLevel;
} {
  return {
    scrobblingEnabled: true,
    scrobbleThreshold: 0.7,
    logLevel: "silent",
  };
}

export async function getOptionsFromStorageOrDefault(storage: Storage) {
  const options = await storage.get("options");
  return options === undefined ? defaultOptions() : options;
}
