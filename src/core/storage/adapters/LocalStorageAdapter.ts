import type { StorageAdapter } from '../types';

export class LocalStorageAdapter implements StorageAdapter {
  private isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  async getItem(key: string): Promise<string | null> {
    if (!this.isAvailable()) {
      throw new Error('localStorage is not available');
    }

    try {
      return localStorage.getItem(key);
    } catch (error) {
      throw new Error(
        `Failed to get item from localStorage: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('localStorage is not available');
    }

    try {
      localStorage.setItem(key, value);
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded');
      }
      throw new Error(
        `Failed to set item in localStorage: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async removeItem(key: string): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('localStorage is not available');
    }

    try {
      localStorage.removeItem(key);
    } catch (error) {
      throw new Error(
        `Failed to remove item from localStorage: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async clear(): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('localStorage is not available');
    }

    try {
      localStorage.clear();
    } catch (error) {
      throw new Error(
        `Failed to clear localStorage: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async keys(): Promise<string[]> {
    if (!this.isAvailable()) {
      throw new Error('localStorage is not available');
    }

    try {
      return Object.keys(localStorage);
    } catch (error) {
      throw new Error(
        `Failed to get keys from localStorage: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async length(): Promise<number> {
    if (!this.isAvailable()) {
      throw new Error('localStorage is not available');
    }

    try {
      return localStorage.length;
    } catch (error) {
      throw new Error(
        `Failed to get length from localStorage: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
