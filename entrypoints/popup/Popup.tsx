import { useEffect, useState } from "react";
import "./tailwind.css";
import { LoggedOut } from "./LoggedOut";
import { LoggedIn } from "./LoggedIn";
import { Loading } from "./Loading";
import { Errorred } from "./Errorred";
import { getLastFmAuthStatus } from "@/core/actions/getLastFmAuthStatus.ts";
import { logger, storage } from "@/core/dependencies/popup.ts";
import { Version } from "@/entrypoints/popup/Version.tsx";

export function Popup() {
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
    const response = await getLastFmAuthStatus(logger, storage);
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
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img
              src="/icon/32.png"
              alt="Tay Web Scrobbler - Logo"
              className="w-8 h-8"
            />
            <h1 className="text-2xl font-bold text-center">
              Tay Web Scrobbler
            </h1>
          </div>
          {authState.status === "error" && <Errorred error={authState.error} />}
          {authState.status === "loading" && <Loading />}
          {authState.status === "loggedIn" && (
            <LoggedIn reloadStateFn={reloadState} user={authState.user} />
          )}
          {authState.status === "loggedOut" && (
            <LoggedOut reloadStateFn={reloadState} />
          )}
          <Version />
        </div>
      </div>
    </>
  );
}
