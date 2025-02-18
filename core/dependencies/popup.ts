import { BrowserStorage } from "@/core/domain/implementation/BrowserStorage.ts";
import log from "loglevel";
import { initializeLastFmApi } from "@alator21/lastfm";
import { BrowserUrlManager } from "@/core/domain/implementation/BrowserUrlManager.ts";
import { BrowserCommunicator } from "@/core/domain/implementation/BrowserCommunicator.ts";

initializeLastFmApi(
  import.meta.env.VITE_LAST_FM_API_KEY,
  import.meta.env.VITE_LAST_FM_SHARED_SECRET,
);
export const storage = new BrowserStorage();
export const urlManager = new BrowserUrlManager();
export const communicator = new BrowserCommunicator();
export const logger = log.getLogger("popup-logger");
logger.setLevel("info");
storage.addChangeListener("options", ({ logLevel }) => {
  logger.info(`Options changed`);
  logger.info({ logLevel });
  logger.setLevel(logLevel);
});
