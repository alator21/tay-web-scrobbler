import { useEffect, useState } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { Communicator } from "@/core/domain/Communicator.ts";
import { Player } from "@/core/infrastructure/sources/Player.ts";
import { logger } from "@/core/domain/implementation/Logger.ts";

type LoggedInProps = {
  communicator: Communicator;
  reloadStateFn: () => void;
  user: string;
};
export function LoggedIn({ communicator, reloadStateFn, user }: LoggedInProps) {
  const [player, setPlayer] = useState<Player | undefined>();
  const [optionsUrl, setOptionsUrl] = useState<string | undefined>();
  useEffect(() => {
    getPlayer();
    fetchOptionsUrl();
  }, []);

  async function getPlayer() {
    const response = await communicator.sendTypedMessage({
      type: "GET_CURRENT_PLAYER_STATE",
    });
    logger.info({ response });
    const { success } = response;
    if (!success) {
      setPlayer(undefined);
      // setAuthState({ status: 'error', error: response.error });
      return;
    }
    const { player } = response;
    logger.info({ player });
    setPlayer(player);
  }

  async function fetchOptionsUrl() {
    const response = await communicator.sendTypedMessage({
      type: "GET_OPTIONS_PAGE_URL",
    });
    setOptionsUrl(response.url);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold">
              {user.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-lg font-medium">{user}</span>
        </div>
        <div className="flex items-center space-x-2">
          {optionsUrl !== undefined && (
            <button
              onClick={() => {
                window.open(optionsUrl);
              }}
              className="p-1 bg-gray-700 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              title="Options"
            >
              <Cog6ToothIcon className="h-5 w-5 text-gray-300" />
            </button>
          )}
          <button
            onClick={async () => {
              await communicator.sendTypedMessage({ type: "LOGOUT" });
              reloadStateFn();
            }}
            className="py-1 px-3 bg-red-600 hover:bg-red-700 transition-colors duration-200 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Logout
          </button>
        </div>
      </div>
      {player !== undefined ? (
        <div className="flex items-start space-x-3">
          <img
            src={player.song.coverUrl}
            alt="Song cover"
            className="w-10 h-10 object-cover rounded-md flex-shrink-0"
          />
          <div className="flex-grow min-w-0 space-y-1">
            <h2 className="text-sm font-semibold truncate">
              {player.song.title}
            </h2>
            <p className="text-xs text-gray-400 truncate">
              {player.song.artist}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {player.song.album}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-20 bg-gray-800 rounded-md">
          <p className="text-sm text-gray-400">No song currently playing</p>
        </div>
      )}
    </div>
  );
}
