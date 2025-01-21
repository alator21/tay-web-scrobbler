import { Storage, StorageSchema } from "../../core/Storage";

export class ChromeStorage implements Storage {

  get<K extends keyof StorageSchema>(key: K): Promise<StorageSchema[K] | undefined> {
    return new Promise((resolve) => {
      chrome.storage.local.get(key, (result) => {
        if (Object.keys(result).length === 0) { resolve(undefined); }
        resolve(result[key] as StorageSchema[K]);
      });
    });
  }
  set<K extends keyof StorageSchema>(key: K, value: StorageSchema[K]): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, resolve);
    });
  }
  remove(key: keyof StorageSchema): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.remove(key, resolve);
    });
  }

  removeAll(): Promise<void> {
    return new Promise(async (resolve) => {
      const keys = await chrome.storage.local.getKeys() as Array<keyof StorageSchema>;
      await Promise.all(keys.map(key => {
        return this.remove(key);
      }))
      resolve();
    });
  }
}
