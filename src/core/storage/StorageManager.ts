import { createStorageAdapter, getAvailableAdapters } from './adapters';
import type {
  StorageAdapter,
  StorageConfig,
  StorageOptions,
  StorageError,
  StorageStats,
} from './types';

export class StorageManager {
  private adapters = new Map<string, StorageAdapter>();
  private debounceTimers = new Map<string, NodeJS.Timeout>();
  private config: StorageConfig;
  private defaultAdapter: string;

  constructor(config: StorageConfig = { adapter: 'localstorage' }) {
    this.config = {
      prefix: 'ai-react',
      version: '1.0.0',
      ...config,
    };
    this.defaultAdapter = config.adapter;
    this.initializeAdapters();
  }

  private initializeAdapters(): void {
    const availableAdapters = getAvailableAdapters();

    // Initialize default adapter
    if (availableAdapters.includes(this.defaultAdapter)) {
      this.adapters.set(
        this.defaultAdapter,
        createStorageAdapter(this.defaultAdapter)
      );
    } else {
      // Fallback to memory if default is not available
      this.adapters.set('memory', createStorageAdapter('memory'));
      this.defaultAdapter = 'memory';
    }
  }

  private getAdapter(adapterName?: string): StorageAdapter {
    const adapter = adapterName ?? this.defaultAdapter;
    const storageAdapter = this.adapters.get(adapter);

    if (!storageAdapter) {
      throw new Error(`Storage adapter '${adapter}' not found`);
    }

    return storageAdapter;
  }

  private getKey(key: string): string {
    const prefix = this.config.prefix ? `${this.config.prefix}:` : '';
    const version = this.config.version ? `:${this.config.version}` : '';
    return `${prefix}${key}${version}`;
  }

  private debounce<T extends unknown[]>(
    key: string,
    fn: (...args: T) => Promise<void>,
    delay: number
  ): (...args: T) => void {
    return (...args: T) => {
      const existingTimer = this.debounceTimers.get(key);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      const timer = setTimeout(() => {
        fn(...args).catch(error => {
          console.error(`Debounced operation failed for key ${key}:`, error);
        });
        this.debounceTimers.delete(key);
      }, delay);

      this.debounceTimers.set(key, timer);
    };
  }

  async save<T>(
    key: string,
    data: T,
    adapter?: string,
    debounceMs?: number
  ): Promise<void> {
    try {
      const storageAdapter = this.getAdapter(adapter);
      const fullKey = this.getKey(key);
      const serializedData = JSON.stringify({
        data,
        timestamp: Date.now(),
        version: this.config.version,
      });

      const saveOperation = async () => {
        await storageAdapter.setItem(fullKey, serializedData);
      };

      if (debounceMs && debounceMs > 0) {
        const debouncedSave = this.debounce(fullKey, saveOperation, debounceMs);
        debouncedSave();
      } else {
        await saveOperation();
      }
    } catch (error) {
      const storageError: StorageError = {
        name: 'StorageError',
        message: `Failed to save data for key '${key}': ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'STORAGE_ERROR',
        key,
        originalError: error instanceof Error ? error : undefined,
      };
      throw storageError;
    }
  }

  async load<T>(key: string, adapter?: string): Promise<T | null> {
    try {
      const storageAdapter = this.getAdapter(adapter);
      const fullKey = this.getKey(key);
      const serializedData = await storageAdapter.getItem(fullKey);

      if (!serializedData) {
        return null;
      }

      const parsed = JSON.parse(serializedData);

      // Check version compatibility
      if (parsed.version && parsed.version !== this.config.version) {
        console.warn(
          `Version mismatch for key '${key}': stored version ${parsed.version}, current version ${this.config.version}`
        );
      }

      return parsed.data as T;
    } catch (error) {
      const storageError: StorageError = {
        name: 'StorageError',
        message: `Failed to load data for key '${key}': ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'DESERIALIZATION_ERROR',
        key,
        originalError: error instanceof Error ? error : undefined,
      };
      throw storageError;
    }
  }

  async remove(key: string, adapter?: string): Promise<void> {
    try {
      const storageAdapter = this.getAdapter(adapter);
      const fullKey = this.getKey(key);

      // Clear any pending debounced saves
      const debounceKey = fullKey;
      const existingTimer = this.debounceTimers.get(debounceKey);
      if (existingTimer) {
        clearTimeout(existingTimer);
        this.debounceTimers.delete(debounceKey);
      }

      await storageAdapter.removeItem(fullKey);
    } catch (error) {
      const storageError: StorageError = {
        name: 'StorageError',
        message: `Failed to remove data for key '${key}': ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'STORAGE_ERROR',
        key,
        originalError: error instanceof Error ? error : undefined,
      };
      throw storageError;
    }
  }

  async clear(adapter?: string): Promise<void> {
    try {
      const storageAdapter = this.getAdapter(adapter);

      // Clear all debounce timers
      this.debounceTimers.forEach(timer => clearTimeout(timer));
      this.debounceTimers.clear();

      await storageAdapter.clear();
    } catch (error) {
      const storageError: StorageError = {
        name: 'StorageError',
        message: `Failed to clear storage: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'STORAGE_ERROR',
        originalError: error instanceof Error ? error : undefined,
      };
      throw storageError;
    }
  }

  async exists(key: string, adapter?: string): Promise<boolean> {
    try {
      const storageAdapter = this.getAdapter(adapter);
      const fullKey = this.getKey(key);
      const item = await storageAdapter.getItem(fullKey);
      return item !== null;
    } catch {
      return false;
    }
  }

  async keys(adapter?: string): Promise<string[]> {
    try {
      const storageAdapter = this.getAdapter(adapter);
      const allKeys = await storageAdapter.keys();
      const prefix = this.config.prefix ? `${this.config.prefix}:` : '';
      const version = this.config.version ? `:${this.config.version}` : '';
      const fullPrefix = `${prefix}${version}`;

      return allKeys
        .filter(key => key.startsWith(prefix))
        .map(key => key.replace(fullPrefix, ''));
    } catch (error) {
      const storageError: StorageError = {
        name: 'StorageError',
        message: `Failed to get keys: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'STORAGE_ERROR',
        originalError: error instanceof Error ? error : undefined,
      };
      throw storageError;
    }
  }

  async getStats(adapter?: string): Promise<StorageStats> {
    try {
      const storageAdapter = this.getAdapter(adapter);
      const keys = await this.keys(adapter);
      const length = await storageAdapter.length();

      return {
        totalKeys: keys.length,
        totalSize: length,
        lastAccessed: Date.now(),
        adapter: adapter ?? this.defaultAdapter,
      };
    } catch (error) {
      const storageError: StorageError = {
        name: 'StorageError',
        message: `Failed to get storage stats: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'STORAGE_ERROR',
        originalError: error instanceof Error ? error : undefined,
      };
      throw storageError;
    }
  }

  getAvailableAdapters(): string[] {
    return getAvailableAdapters();
  }

  getConfig(): StorageConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<StorageConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  destroy(): void {
    // Clear all debounce timers
    this.debounceTimers.forEach(timer => clearTimeout(timer));
    this.debounceTimers.clear();

    // Clear adapters
    this.adapters.clear();
  }
}
