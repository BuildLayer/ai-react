import { LocalStorageAdapter } from './LocalStorageAdapter';
import { SessionStorageAdapter } from './SessionStorageAdapter';
import { MemoryStorageAdapter } from './MemoryStorageAdapter';
import type { StorageAdapter } from '../types';

export const createStorageAdapter = (type: string): StorageAdapter => {
  switch (type.toLowerCase()) {
    case 'localstorage':
    case 'local':
      return new LocalStorageAdapter();
    case 'sessionstorage':
    case 'session':
      return new SessionStorageAdapter();
    case 'memory':
      return new MemoryStorageAdapter();
    default:
      throw new Error(`Unknown storage adapter type: ${type}`);
  }
};

export const getAvailableAdapters = (): string[] => {
  const adapters = ['memory']; // Memory is always available

  try {
    localStorage.setItem('__test__', '__test__');
    localStorage.removeItem('__test__');
    adapters.push('localstorage', 'local');
  } catch {
    // localStorage not available
  }

  try {
    sessionStorage.setItem('__test__', '__test__');
    sessionStorage.removeItem('__test__');
    adapters.push('sessionstorage', 'session');
  } catch {
    // sessionStorage not available
  }

  return adapters;
};
