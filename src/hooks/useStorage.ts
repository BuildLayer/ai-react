import { useCallback, useRef, useEffect } from 'react';
import { StorageManager } from '../core/storage';
import type { UseStorageReturn } from '../core/types/hooks';
import type { StorageConfig } from '../core/storage/types';

// Global storage manager instance
let globalStorageManager: StorageManager | null = null;

const getStorageManager = (config?: StorageConfig): StorageManager => {
  if (!globalStorageManager) {
    globalStorageManager = new StorageManager(config);
  }
  return globalStorageManager;
};

export const useStorage = (config?: StorageConfig): UseStorageReturn => {
  const storageManagerRef = useRef<StorageManager | null>(null);

  useEffect(() => {
    storageManagerRef.current = getStorageManager(config);

    return () => {
      // Cleanup on unmount if this was the last instance
      if (storageManagerRef.current) {
        storageManagerRef.current.destroy();
        globalStorageManager = null;
      }
    };
  }, [config]);

  const save = useCallback(
    async <T>(
      key: string,
      data: T,
      adapter?: string,
      debounceMs?: number
    ): Promise<void> => {
      if (!storageManagerRef.current) {
        throw new Error('Storage manager not initialized');
      }
      return storageManagerRef.current.save(key, data, adapter, debounceMs);
    },
    []
  );

  const load = useCallback(
    async <T>(key: string, adapter?: string): Promise<T | null> => {
      if (!storageManagerRef.current) {
        throw new Error('Storage manager not initialized');
      }
      return storageManagerRef.current.load<T>(key, adapter);
    },
    []
  );

  const remove = useCallback(
    async (key: string, adapter?: string): Promise<void> => {
      if (!storageManagerRef.current) {
        throw new Error('Storage manager not initialized');
      }
      return storageManagerRef.current.remove(key, adapter);
    },
    []
  );

  const clear = useCallback(async (adapter?: string): Promise<void> => {
    if (!storageManagerRef.current) {
      throw new Error('Storage manager not initialized');
    }
    return storageManagerRef.current.clear(adapter);
  }, []);

  const exists = useCallback(
    async (key: string, adapter?: string): Promise<boolean> => {
      if (!storageManagerRef.current) {
        throw new Error('Storage manager not initialized');
      }
      return storageManagerRef.current.exists(key, adapter);
    },
    []
  );

  const keys = useCallback(async (adapter?: string): Promise<string[]> => {
    if (!storageManagerRef.current) {
      throw new Error('Storage manager not initialized');
    }
    return storageManagerRef.current.keys(adapter);
  }, []);

  return {
    save,
    load,
    remove,
    clear,
    exists,
    keys,
  };
};
