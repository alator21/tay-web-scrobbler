import { ResponseType } from "@/core/domain/Communicator.ts";
import { Logger } from "loglevel";
import { Storage } from "@/core/domain/Storage.ts";

export async function getLastFmAuthStatus(
  logger: Logger,
  storage: Storage,
): Promise<Extract<ResponseType, { type: "GET_LAST_FM_AUTH_STATUS" }>> {
  try {
    const status = await storage.get("last_fm_session");
    logger.debug({ status });
    return {
      type: "GET_LAST_FM_AUTH_STATUS",
      success: true,
      data:
        status !== undefined
          ? { sessionKey: status.session_key, user: status.user }
          : undefined,
    };
  } catch (error) {
    logger.error(error);
    return {
      type: "GET_LAST_FM_AUTH_STATUS",
      success: false,
      error: `error while getting status`,
    };
  }
}
