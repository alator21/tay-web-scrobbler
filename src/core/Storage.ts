export interface StorageSchema {
  last_fm_session: {
    session_key: string;
    user: string;
  },
}

export interface Storage {

  get<K extends keyof StorageSchema>(
    key: K
  ): Promise<StorageSchema[K] | undefined>

  set<K extends keyof StorageSchema>(
    key: K,
    value: StorageSchema[K]
  ): Promise<void>

  remove(key: keyof StorageSchema): Promise<void>

  removeAll(): Promise<void>;

}
