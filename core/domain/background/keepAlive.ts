import { ResponseType } from "@/core/domain/Communicator.ts";

export async function keepAlive(
  sendResponse: (response: ResponseType) => void,
) {
  sendResponse({ type: "KEEP_ALIVE" });
}
