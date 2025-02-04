import { LastFmAuthenticator } from "@/core/domain/LastFmAuthenticator.ts";
import { getSession } from "@alator21/lastfm";
import { ResponseType } from "@/core/domain/Communicator.ts";
import { Storage } from "@/core/domain/Storage.ts";
import { Logger } from "loglevel";

export async function authenticate(
  logger: Logger,
  lastFmAuthenticator: LastFmAuthenticator,
  storage: Storage,
): Promise<Extract<ResponseType, { type: "AUTHENTICATE" }>> {
  logger.info("Starting authentication...");
  try {
    const status = await storage.get("last_fm_session");
    logger.info(
      `Status is ${status === undefined ? "undefined" : JSON.stringify(status)}`,
    );
    if (status !== undefined) {
      return {
        type: "AUTHENTICATE",
        success: false,
        error: `You can't login when you are already logged in.`,
      };
    }
    logger.info(`Getting session...`);
    const session = await getLastFmSession(logger, lastFmAuthenticator);
    logger.info(`Session is ${JSON.stringify(session)}`);
    await storage.set("last_fm_session", {
      session_key: session.key,
      user: session.name,
    });
    logger.info(`Saved session key: ${session.key}`);
    return {
      type: "AUTHENTICATE",
      success: true,
      data: { user: session.name },
    };
  } catch (error) {
    logger.error(error);
    return {
      type: "AUTHENTICATE",
      success: false,
      error: `error while authenticating`,
    };
  }
}

async function getLastFmSession(
  logger: Logger,
  authenticator: LastFmAuthenticator,
) {
  const authToken = await authenticator.authenticate();
  try {
    const { session } = await getSession({ authToken });
    return session;
  } catch (error: unknown) {
    logger.error(error);
    throw new Error("Error while getting lastFmSession");
  }
}
