import { ResponseType } from "@/core/domain/Communicator.ts";
import { logger } from "@/core/domain/implementation/Logger.ts";
import { Storage } from "@/core/domain/Storage.ts";
import { defaultOptions } from "@/core/domain/background/common.ts";

export async function getOptions(
  storage: Storage,
  sendResponse: (response: ResponseType) => void,
) {
  let options = await storage.get("options");
  logger.info({ options });
  if (options === undefined) {
    options = defaultOptions();
    await storage.set("options", options);
  }
  sendResponse({ type: "GET_OPTIONS", success: true, options });
}
