import { ResponseType } from "@/core/domain/Communicator.ts";
import { Storage } from "@/core/domain/Storage.ts";
import { defaultOptions } from "./common.ts";

export async function resetOptionsToDefault(
  storage: Storage,
  sendResponse: (response: ResponseType) => void,
) {
  await storage.set("options", defaultOptions());
  sendResponse({ type: "RESET_OPTIONS_TO_DEFAULT", success: true });
}
