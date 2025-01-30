import { SongListenedDetector } from "@/core/domain/implementation/SongListenedDetector.ts";
import { SongChangedDetector } from "@/core/domain/implementation/SongChangedDetector.ts";
import { CurrentSongPersistor } from "@/core/domain/implementation/CurrentSongPersistor.ts";
import { BrowserStorage } from "@/core/domain/implementation/BrowserStorage.ts";
import log from "loglevel";
import { initializeLastFmApi } from "@alator21/lastfm";

initializeLastFmApi(
  import.meta.env.VITE_LAST_FM_API_KEY,
  import.meta.env.VITE_LAST_FM_SHARED_SECRET,
);
export const storage = new BrowserStorage();
export const logger = log.getLogger("content-logger");
logger.setLevel("info");
export const songListenedDetector = new SongListenedDetector(true, 0.7);
export const songChangedDetector = new SongChangedDetector();
export const currentSongPersistor = new CurrentSongPersistor(5000);
storage.addChangeListener(
  "options",
  ({ scrobblingEnabled, scrobbleThreshold, logLevel }) => {
    logger.info(`Options changed`);
    logger.info({ scrobblingEnabled, scrobbleThreshold, logLevel });

    songListenedDetector.modifyEnabledStatus(scrobblingEnabled);
    songListenedDetector.updateThreshold(scrobbleThreshold);
    logger.setLevel(logLevel);
  },
);
