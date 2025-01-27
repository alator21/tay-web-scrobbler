import { logger } from "@/core/domain/implementation/Logger.ts";
import { LastFmAuthenticator } from "@/core/domain/implementation/LastFmAuthenticator.ts";
import { getSession } from "@alator21/lastfm";
import { ResponseType } from "@/core/domain/Communicator.ts";
import { Storage } from "@/core/domain/Storage.ts";

export async function authenticate(
  storage: Storage,
  lastFmAuthenticator: LastFmAuthenticator,
  sendResponse: (response: ResponseType) => void,
): Promise<void> {
  try {
    const status = await storage.get("last_fm_session");
    if (status !== undefined) {
      sendResponse({
        type: "AUTHENTICATE",
        success: false,
        error: `You can't login when you are already logged in.`,
      });
      return;
    }
    const session = await getLastFmSession(lastFmAuthenticator);
    storage.set("last_fm_session", {
      session_key: session.key,
      user: session.name,
    });
    sendResponse({
      type: "AUTHENTICATE",
      success: true,
      data: { user: session.name },
    });
  } catch (error) {
    logger.error(error);
    sendResponse({
      type: "AUTHENTICATE",
      success: false,
      error: `error while authenticating`,
    });
  }
}

async function getLastFmSession(authenticator: LastFmAuthenticator) {
  const authToken = await authenticator.authenticate();
  const { session } = await getSession({ authToken });
  return session;
}
