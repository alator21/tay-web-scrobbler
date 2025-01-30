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
  try {
    const status = await storage.get("last_fm_session");
    if (status !== undefined) {
      return {
        type: "AUTHENTICATE",
        success: false,
        error: `You can't login when you are already logged in.`,
      };
    }
    const session = await getLastFmSession(lastFmAuthenticator);
    storage.set("last_fm_session", {
      session_key: session.key,
      user: session.name,
    });
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

async function getLastFmSession(authenticator: LastFmAuthenticator) {
  const authToken = await authenticator.authenticate();
  const { session } = await getSession({ authToken });
  return session;
}
