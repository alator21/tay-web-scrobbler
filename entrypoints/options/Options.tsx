import { useEffect, useState } from "react";
import "./tailwind.css";
import { Communicator } from "@/core/domain/Communicator.ts";
import { logger, LogLevel } from "@/core/domain/implementation/Logger.ts";

type OptionsProps = {
  communicator: Communicator;
};
export function Options({ communicator }: OptionsProps) {
  const [options, setOptions] = useState<
    | {
        scrobblingEnabled: boolean;
        scrobbleThreshold: number;
        logLevel: LogLevel;
      }
    | undefined
  >(undefined);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchOptions();
  }, []);

  async function fetchOptions() {
    const response = await communicator.sendTypedMessage({
      type: "GET_OPTIONS",
    });
    const { success } = response;
    if (!success) {
      return;
    }
    const { options } = response;
    setOptions(options);
  }

  return (
    <div className="p-4 bg-gray-900 text-white shadow-lg space-y-6">
      <h1 className="text-xl font-bold text-center">
        Tay Web Scrobbler - Options
      </h1>
      {options === undefined ? (
        <div>Fetching options</div>
      ) : (
        <>
          <div className="space-y-2">
            <label
              htmlFor="log-level"
              className="block text-sm font-medium text-gray-300"
            >
              Log Level
            </label>
            <select
              id="log-level"
              value={options.logLevel}
              onChange={async (event) => {
                setOptions({
                  ...options,
                  logLevel: event.target.value as LogLevel,
                });
                setHasChanges(true);
              }}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="silent">Silent</option>
              <option value="info">Info</option>
              <option value="debug">Debug</option>
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="scrobble-threshold"
              className="block text-sm font-medium text-gray-300"
            >
              Percentage of song completed to scrobble:{" "}
              {options.scrobbleThreshold.toFixed(2)}
            </label>
            <input
              type="range"
              id="scrobble-threshold"
              min="0.1"
              max="1"
              step="0.01"
              value={options.scrobbleThreshold}
              onChange={async (event) => {
                setOptions({
                  ...options,
                  scrobbleThreshold: Number.parseFloat(event.target.value),
                });
                setHasChanges(true);
              }}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>0.1</span>
              <span>1.0</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label
              htmlFor="enable-scrobbling"
              className="text-sm font-medium text-gray-300"
            >
              {options.scrobblingEnabled
                ? "Scrobbling is enabled"
                : "Scrobbling is NOT enabled"}
            </label>
            <label
              htmlFor="enable-scrobbling"
              className="relative inline-block w-10 h-6 mr-2"
            >
              <input
                type="checkbox"
                id="enable-scrobbling"
                checked={options.scrobblingEnabled}
                onChange={async () => {
                  setOptions({
                    ...options,
                    scrobblingEnabled: !options.scrobblingEnabled,
                  });
                  setHasChanges(true);
                }}
                className="sr-only peer"
              />
              <div className="absolute inset-0 rounded-full bg-gray-600 transition peer-checked:bg-blue-500"></div>
              <div className="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full bg-white transition-all peer-checked:translate-x-4"></div>
            </label>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between space-x-2">
              <button
                onClick={async () => {
                  const response = await communicator.sendTypedMessage({
                    type: "RESET_OPTIONS_TO_DEFAULT",
                  });
                  logger.debug(response);
                  await fetchOptions();
                  setHasChanges(false);
                }}
                className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors text-sm"
              >
                Reset to Defaults
              </button>

              {/* <button */}
              {/*   onClick={async () => { */}
              {/*     await fetchOptions(); */}
              {/*     setHasChanges(false) */}
              {/*   }} */}
              {/*   disabled={!hasChanges} */}
              {/*   className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-md transition-colors text-sm" */}
              {/* > */}
              {/*   Discard changes(Fetch previous saved ones) */}
              {/* </button> */}
            </div>
            <button
              onClick={async () => {
                const response = await communicator.sendTypedMessage({
                  type: "SAVE_OPTIONS",
                  options,
                });
                logger.info(response);
                setHasChanges(false);
              }}
              disabled={!hasChanges}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-md transition-colors"
            >
              Save Changes
            </button>
          </div>
        </>
      )}
    </div>
  );
}
