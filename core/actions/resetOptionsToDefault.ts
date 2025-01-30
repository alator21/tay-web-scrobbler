import { ResponseType } from "@/core/domain/Communicator.ts";
import { defaultOptions } from "./common.ts";
import { Storage } from "@/core/domain/Storage.ts";

export async function resetOptionsToDefault(
  storage: Storage,
): Promise<Extract<ResponseType, { type: "RESET_OPTIONS_TO_DEFAULT" }>> {
  await storage.set("options", defaultOptions());
  return { type: "RESET_OPTIONS_TO_DEFAULT", success: true };
}
