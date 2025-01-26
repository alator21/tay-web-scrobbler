import { initializeLastFmApi } from "@alator21/lastfm";
import { ChromeCommunicator } from "./ChromeCommunicator";
import { ChromeLastFmAuthenticator } from "./ChromeLastFmAuthenticator";
import { ChromeStorage } from "./ChromeStorage";
import { SongListenedDetector } from "../../core/SongListenedDetector";
import { logger, LogLevel } from "../../core/Logger";
import { SongChangedDetector } from "../../core/SongChangedDetector";
import { CurrentSongPersistor } from "../../core/CurrentSongPersistor";
import { ChromeUrlManager } from "./ChromeUrlManager";
import { doStuff, getOptionsFromStorageOrDefault } from "../../core/background";

const CLIENT_ID = import.meta.env.VITE_LAST_FM_API_KEY;
const SHARED_SECRET = import.meta.env.VITE_LAST_FM_SHARED_SECRET;

async function main() {
  const storage = new ChromeStorage();
  const { logLevel, scrobbleThreshold } =
    await getOptionsFromStorageOrDefault(storage);
  logger.setLevel(logLevel);
  const communicator = new ChromeCommunicator();
  const lastFmAuthenticator = new ChromeLastFmAuthenticator(CLIENT_ID);
  const urlManager = new ChromeUrlManager();
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
  doStuff(
    communicator,
    lastFmAuthenticator,
    storage,
    urlManager,
    songListenedDetector,
    songChangedDetector,
    currentSongPersistor,
  );

  //TODO: move this to core if possible
  storage.addChangeListener("options", (options) => {
    logger.info(`options changed`);
    logger.info(options);
    updateDependenciesBasedOnOptions(options);
  });
}

main();
