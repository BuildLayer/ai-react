import { useCallback } from 'react';
import { useConnectionStore } from '../core/store/connectionStore';
import type { UseConnectionReturn, ProviderConfig } from '../core/types';

export const useConnection = (): UseConnectionReturn => {
  const store = useConnectionStore();

  const connect = useCallback(
    async (config: ProviderConfig): Promise<void> => {
      await store.connect(config);
    },
    [store]
  );

  const disconnect = useCallback(() => {
    store.disconnect();
  }, [store]);

  const clearError = useCallback(() => {
    store.clearError();
  }, [store]);

  const testConnection = useCallback(
    async (config: ProviderConfig): Promise<boolean> => {
      return store.testConnection(config);
    },
    [store]
  );

  const retryConnection = useCallback(async (): Promise<void> => {
    await store.retryConnection();
  }, [store]);

  return {
    isConnected: store.isConnected,
    isConnecting: store.isConnecting,
    error: store.error,
    provider: store.provider,
    connect,
    disconnect,
    clearError,
    testConnection,
    retryConnection,
  };
};
