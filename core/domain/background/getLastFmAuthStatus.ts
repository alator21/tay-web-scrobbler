import { logger } from "@/core/domain/implementation/Logger.ts";
import { Storage } from "@/core/domain/Storage.ts";
import { ResponseType } from "@/core/domain/Communicator.ts";

export async function getLastFmAuthStatus(
  storage: Storage,
  sendResponse: (response: ResponseType) => void,
) {
  try {
    const status = await storage.get("last_fm_session");
    logger.debug({ status });
    sendResponse({
      type: "GET_LAST_FM_AUTH_STATUS",
      success: true,
      data:
        status !== undefined
          ? { sessionKey: status.session_key, user: status.user }
          : undefined,
    });
  } catch (error) {
    logger.error(error);
    sendResponse({
      type: "GET_LAST_FM_AUTH_STATUS",
      success: false,
      error: `error while getting status`,
    });
  }
}
