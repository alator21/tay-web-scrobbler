import { ResponseType } from "@/core/domain/Communicator.ts";
import { logger, LogLevel } from "@/core/domain/implementation/Logger.ts";
import { Storage } from "@/core/domain/Storage.ts";

export async function saveOptions(
  storage: Storage,
  options: {
    scrobblingEnabled: boolean;
    scrobbleThreshold: number;
    logLevel: LogLevel;
  },
  sendResponse: (response: ResponseType) => void,
) {
  logger.info(`Saving options`);
  logger.info({ options });
  await storage.set("options", options);
  sendResponse({ type: "SAVE_OPTIONS", success: true });
}
