import { Storage, StorageSchema } from "../Storage.ts";

export class BrowserStorage implements Storage {
  private listeners: Map<
    keyof StorageSchema,
    Set<
      (
        newValue: StorageSchema[keyof StorageSchema],
        oldValue: StorageSchema[keyof StorageSchema],
      ) => void
    >
  > = new Map();

  get<K extends keyof StorageSchema>(
    key: K,
  ): Promise<StorageSchema[K] | undefined> {
    return new Promise((resolve) => {
      browser.storage.local.get(key, (result) => {
        if (Object.keys(result).length === 0) {
          resolve(undefined);
        }
        resolve(result[key] as StorageSchema[K]);
      });
    });
  }

  set<K extends keyof StorageSchema>(
    key: K,
    value: StorageSchema[K],
  ): Promise<void> {
    return new Promise((resolve) => {
      browser.storage.local.set({ [key]: value }, resolve);
    });
  }

  remove(key: keyof StorageSchema): Promise<void> {
    return new Promise((resolve) => {
      browser.storage.local.remove(key, resolve);
    });
  }

  async removeAll(): Promise<void> {
    const keys = await browser.storage.local.getKeys();
    const removePromises = (keys as Array<keyof StorageSchema>).map((key) => {
      return this.remove(key);
    });
    await Promise.all(removePromises);
  }

  addChangeListener<K extends keyof StorageSchema>(
    key: K,
    callback: (newValue: StorageSchema[K], oldValue: StorageSchema[K]) => void,
  ): void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners
      .get(key)!
      .add(
        callback as (
          newValue: StorageSchema[keyof StorageSchema],
          oldValue: StorageSchema[keyof StorageSchema],
        ) => void,
      );

    if (this.listeners.size === 1) {
      this.setupStorageListener();
    }
  }

  removeChangeListener<K extends keyof StorageSchema>(
    key: K,
    callback: (newValue: StorageSchema[K], oldValue: StorageSchema[K]) => void,
  ): void {
    const keyListeners = this.listeners.get(key);
    if (keyListeners) {
      keyListeners.delete(
        callback as (
          newValue: StorageSchema[keyof StorageSchema],
          oldValue: StorageSchema[keyof StorageSchema],
        ) => void,
      );
      if (keyListeners.size === 0) {
        this.listeners.delete(key);
      }
    }

    if (this.listeners.size === 0) {
      this.teardownStorageListener();
    }
  }

  private setupStorageListener(): void {
    browser.storage.onChanged.addListener(this.handleStorageChange);
  }

  private teardownStorageListener(): void {
    browser.storage.onChanged.removeListener(this.handleStorageChange);
  }

  private handleStorageChange = (
    changes: { [key: string]: chrome.storage.StorageChange },
    areaName: string,
  ): void => {
    if (areaName !== "local") return;

    for (const [key, change] of Object.entries(changes)) {
      const listeners = this.listeners.get(key as keyof StorageSchema);
      if (listeners) {
        listeners.forEach((callback) =>
          callback(change.newValue, change.oldValue),
        );
      }
    }
  };
}
