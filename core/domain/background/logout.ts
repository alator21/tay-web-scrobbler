import { logger } from "@/core/domain/implementation/Logger.ts";
import { Storage } from "@/core/domain/Storage.ts";
import { ResponseType } from "@/core/domain/Communicator.ts";

export async function logout(
  storage: Storage,
  sendResponse: (response: ResponseType) => void,
) {
  try {
    const status = await storage.get("last_fm_session");
    if (status === undefined) {
      sendResponse({
        type: "LOGOUT",
        success: false,
        error: `You can't logout when you are not logged in.`,
      });
      return;
    }
    await storage.removeAll();
    sendResponse({ type: "LOGOUT", success: true });
  } catch (error) {
    logger.error(error);
    sendResponse({
      type: "LOGOUT",
      success: false,
      error: `error while logging out`,
    });
  }
}
