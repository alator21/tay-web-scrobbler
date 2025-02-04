import {
  communicator,
  lastFmAuthenticator,
  logger,
  storage,
} from "@/core/dependencies/background.ts";
import { authenticate } from "@/core/actions/authenticate.ts";

export default defineBackground(() => {
  communicator.addTypedListener(async (message, sendResponse) => {
    if (message.type === "AUTHENTICATE") {
      const response = await authenticate(logger, lastFmAuthenticator, storage);
      sendResponse(response);
    }
  });
});
