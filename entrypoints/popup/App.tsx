import { useEffect, useState } from "react";
import "./tailwind.css";
import { LoggedOut } from "./LoggedOut";
import { LoggedIn } from "./LoggedIn";
import { Loading } from "./Loading";
import { Errorred } from "./Errorred";
import { Communicator } from "@/core/domain/Communicator.ts";
import { logger } from "@/core/domain/implementation/Logger.ts";

type AppProps = {
  communicator: Communicator;
};
export function App({ communicator }: AppProps) {
  const [authState, setAuthState] = useState<
    | { status: "loading" }
    | { status: "loggedIn"; user: string }
    | { status: "loggedOut" }
    | { status: "error"; error: string }
  >({ status: "loading" });
  useEffect(() => {
    reloadState();
  }, []);

  async function reloadState() {
    const response = await communicator.sendTypedMessage({
      type: "GET_LAST_FM_AUTH_STATUS",
    });
    logger.info({ response });
    const { success } = response;
    if (!success) {
      setAuthState({ status: "error", error: response.error });
      return;
    }
    const { data } = response;
    logger.info({ data });
    if (data === undefined) {
      setAuthState({ status: "loggedOut" });
      return;
    }
    setAuthState({ status: "loggedIn", user: data.user });
  }

  return (
    <>
      <div className="w-80 p-6 bg-gray-900 text-white shadow-lg">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-center">Tay Web Scrobbler</h1>
          {authState.status === "error" && <Errorred error={authState.error} />}
          {authState.status === "loading" && <Loading />}
          {authState.status === "loggedIn" && (
            <LoggedIn
              communicator={communicator}
              reloadStateFn={reloadState}
              user={authState.user}
            />
          )}
          {authState.status === "loggedOut" && (
            <LoggedOut
              communicator={communicator}
              reloadStateFn={reloadState}
            />
          )}
        </div>
      </div>
    </>
  );
}
