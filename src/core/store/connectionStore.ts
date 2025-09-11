import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { ConnectionStore, ProviderConfig } from '../types/connection';
import { createProviderAdapter } from '../providers';

export const useConnectionStore: () => ConnectionStore =
  create<ConnectionStore>()(
    devtools(
      persist(
        immer<ConnectionStore>((set, get) => ({
          // State
          isConnected: false,
          isConnecting: false,
          provider: null,
          error: null,
          hasError: false,
          isLoading: false,
          lastConnectedAt: null,
          connectionAttempts: 0,
          maxRetries: 3,

          // Actions
          connect: async (config: ProviderConfig) => {
            set(state => {
              state.isConnecting = true;
              state.error = null;
            });

            try {
              const adapter = createProviderAdapter(config);
              // Note: In a real implementation, you would use the adapter to create a ChatStore
              // const chatController = new ChatStore(adapter);

              set(state => {
                state.isConnected = true;
                state.provider = config;
                state.isConnecting = false;
                state.lastConnectedAt = Date.now();
                state.connectionAttempts = 0;
              });
            } catch (error) {
              set(state => {
                state.error =
                  error instanceof Error ? error.message : 'Connection failed';
                state.isConnecting = false;
                state.connectionAttempts += 1;
              });
            }
          },

          disconnect: () => {
            set(state => {
              state.isConnected = false;
              state.provider = null;
              state.error = null;
              state.lastConnectedAt = null;
            });
          },

          clearError: () => {
            set(state => {
              state.error = null;
            });
          },

          setConnecting: (loading: boolean) => {
            set(state => {
              state.isConnecting = loading;
            });
          },

          testConnection: async (config: ProviderConfig) => {
            try {
              const adapter = createProviderAdapter(config);
              // Test connection logic would go here
              return true;
            } catch {
              return false;
            }
          },

          retryConnection: async () => {
            const { provider, connectionAttempts, maxRetries } = get();
            if (provider && connectionAttempts < maxRetries) {
              await get().connect(provider);
            }
          },

          resetConnectionAttempts: () => {
            set(state => {
              state.connectionAttempts = 0;
            });
          },

          setMaxRetries: (max: number) => {
            set(state => {
              state.maxRetries = max;
            });
          },
        })),
        {
          name: 'connection-store',
          partialize: state => ({
            isConnected: state.isConnected,
            provider: state.provider,
            lastConnectedAt: state.lastConnectedAt,
          }),
        }
      ),
      {
        name: 'connection-store',
      }
    )
  );
