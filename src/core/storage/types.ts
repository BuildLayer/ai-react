// Storage types
export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<string[]>;
  length(): Promise<number>;
}

export interface StorageOptions {
  debounceMs?: number;
  maxRetries?: number;
  retryDelay?: number;
  compression?: boolean;
  encryption?: boolean;
}

export interface StorageConfig {
  adapter: string;
  options?: StorageOptions;
  prefix?: string;
  version?: string;
}

export interface StorageError extends Error {
  code:
    | 'STORAGE_ERROR'
    | 'SERIALIZATION_ERROR'
    | 'DESERIALIZATION_ERROR'
    | 'QUOTA_EXCEEDED';
  key?: string;
  originalError?: Error;
}

export interface StorageStats {
  totalKeys: number;
  totalSize: number;
  lastAccessed: number;
  adapter: string;
}
