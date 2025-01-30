import { BrowserStorage } from "@/core/domain/implementation/BrowserStorage.ts";
import log from "loglevel";

export const storage = new BrowserStorage();
export const logger = log.getLogger("options-logger");
logger.setLevel("info");
storage.addChangeListener("options", ({ logLevel }) => {
  logger.info(`Options changed`);
  logger.info({ logLevel });
  logger.setLevel(logLevel);
});
