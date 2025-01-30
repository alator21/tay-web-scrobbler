import { ResponseType } from "@/core/domain/Communicator.ts";
import { Logger } from "loglevel";
import { Storage, StorageOptions } from "@/core/domain/Storage.ts";

export async function saveOptions(
  logger: Logger,
  storage: Storage,
  options: StorageOptions,
): Promise<Extract<ResponseType, { type: "SAVE_OPTIONS" }>> {
  logger.info(`Saving options`);
  logger.info({ options });
  await storage.set("options", options);
  return { type: "SAVE_OPTIONS", success: true };
}
