import { ResponseType } from "@/core/domain/Communicator.ts";
import { Logger } from "loglevel";
import { Storage } from "@/core/domain/Storage.ts";

export async function logout(
  logger: Logger,
  storage: Storage,
): Promise<Extract<ResponseType, { type: "LOGOUT" }>> {
  try {
    const status = await storage.get("last_fm_session");
    if (status === undefined) {
      return {
        type: "LOGOUT",
        success: false,
        error: `You can't logout when you are not logged in.`,
      };
    }
    await Promise.all([
      storage.remove("last_fm_session"),
      storage.remove("current_player"),
    ]);
    return { type: "LOGOUT", success: true };
  } catch (error) {
    logger.error(error);
    return {
      type: "LOGOUT",
      success: false,
      error: `error while logging out`,
    };
  }
}
