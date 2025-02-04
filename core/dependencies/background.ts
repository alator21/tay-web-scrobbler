import { BrowserStorage } from "@/core/domain/implementation/BrowserStorage.ts";
import log from "loglevel";
import { BrowserCommunicator } from "@/core/domain/implementation/BrowserCommunicator.ts";
import { BrowserLastFmAuthenticator } from "@/core/domain/implementation/BrowserLastFmAuthenticator.ts";

export const communicator = new BrowserCommunicator();
export const lastFmAuthenticator = new BrowserLastFmAuthenticator(
  import.meta.env.VITE_LAST_FM_API_KEY,
);
export const storage = new BrowserStorage();
export const logger = log.getLogger("background-logger");
logger.setLevel("info");
storage.addChangeListener("options", ({ logLevel }) => {
  logger.info(`Options changed`);
  logger.info({ logLevel });
  logger.setLevel(logLevel);
});
