import type { StorageAdapter } from '../types';

export class SessionStorageAdapter implements StorageAdapter {
  private isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  async getItem(key: string): Promise<string | null> {
    if (!this.isAvailable()) {
      throw new Error('sessionStorage is not available');
    }

    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      throw new Error(
        `Failed to get item from sessionStorage: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('sessionStorage is not available');
    }

    try {
      sessionStorage.setItem(key, value);
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded');
      }
      throw new Error(
        `Failed to set item in sessionStorage: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async removeItem(key: string): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('sessionStorage is not available');
    }

    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      throw new Error(
        `Failed to remove item from sessionStorage: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async clear(): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('sessionStorage is not available');
    }

    try {
      sessionStorage.clear();
    } catch (error) {
      throw new Error(
        `Failed to clear sessionStorage: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async keys(): Promise<string[]> {
    if (!this.isAvailable()) {
      throw new Error('sessionStorage is not available');
    }

    try {
      return Object.keys(sessionStorage);
    } catch (error) {
      throw new Error(
        `Failed to get keys from sessionStorage: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async length(): Promise<number> {
    if (!this.isAvailable()) {
      throw new Error('sessionStorage is not available');
    }

    try {
      return sessionStorage.length;
    } catch (error) {
      throw new Error(
        `Failed to get length from sessionStorage: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
