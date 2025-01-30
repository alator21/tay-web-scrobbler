import { ResponseType } from "@/core/domain/Communicator.ts";
import { defaultOptions } from "@/core/actions/common.ts";
import { Logger } from "loglevel";
import { Storage } from "@/core/domain/Storage.ts";

export async function getOptions(
  logger: Logger,
  storage: Storage,
): Promise<Extract<ResponseType, { type: "GET_OPTIONS" }>> {
  let options = await storage.get("options");
  logger.info({ options });
  if (options === undefined) {
    options = defaultOptions();
    await storage.set("options", options);
  }
  return { type: "GET_OPTIONS", success: true, options };
}
