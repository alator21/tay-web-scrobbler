import { Communicator } from "@/core/domain/Communicator.ts";
import { logger } from "@/core/domain/implementation/Logger.ts";

type LoggedOutProps = { communicator: Communicator; reloadStateFn: () => void };
export function LoggedOut({ communicator, reloadStateFn }: LoggedOutProps) {
  return (
    <button
      onClick={async () => {
        const response = await communicator.sendTypedMessage({
          type: "AUTHENTICATE",
        });
        logger.info({ response });
        reloadStateFn();
      }}
      className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 transition-colors duration-200 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      Authenticate with Last.fm
    </button>
  );
}
