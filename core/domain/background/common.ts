import { Storage } from "@/core/domain/Storage.ts";
import { LogLevel } from "@/core/domain/implementation/Logger.ts";

export async function getSessionKeyOrThrow(storage: Storage) {
  const session = await storage.get("last_fm_session");
  if (session === undefined) {
    throw new Error("Unauthorized");
  }
  return session.session_key;
}

export function defaultOptions(): {
  scrobblingEnabled: boolean;
  scrobbleThreshold: number;
  logLevel: LogLevel;
} {
  return {
    scrobblingEnabled: true,
    scrobbleThreshold: 0.7,
    logLevel: "info",
  };
}
