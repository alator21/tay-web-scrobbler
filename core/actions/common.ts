import { StorageOptions } from "@/core/domain/Storage.ts";

export function defaultOptions(): StorageOptions {
  return {
    scrobblingEnabled: true,
    scrobbleThreshold: 0.7,
    logLevel: "info",
  };
}
