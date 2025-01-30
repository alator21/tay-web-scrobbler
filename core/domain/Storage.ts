import { Player } from "@/core/sources/Player.ts";
import { LogLevelDesc } from "loglevel";

export type StorageOptions = {
  scrobblingEnabled: boolean;
  scrobbleThreshold: number;
  logLevel: LogLevelDesc;
};

export interface StorageSchema {
  last_fm_session: {
    session_key: string;
    user: string;
  };
  current_player: {
    player: Player | undefined;
    lastSongTickTime: number;
  };
  options: StorageOptions;
}

export interface Storage {
  get<K extends keyof StorageSchema>(
    key: K,
  ): Promise<StorageSchema[K] | undefined>;

  set<K extends keyof StorageSchema>(
    key: K,
    value: StorageSchema[K],
  ): Promise<void>;

  remove(key: keyof StorageSchema): Promise<void>;

  removeAll(): Promise<void>;

  addChangeListener<K extends keyof StorageSchema>(
    key: K,
    callback: (newValue: StorageSchema[K], oldValue: StorageSchema[K]) => void,
  ): void;

  removeChangeListener<K extends keyof StorageSchema>(
    key: K,
    callback: (newValue: StorageSchema[K], oldValue: StorageSchema[K]) => void,
  ): void;
}
