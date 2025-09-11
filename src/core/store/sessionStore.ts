import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { SessionStore, ChatSession, SessionStats } from '../types/session';

export const useSessionStore: () => SessionStore = create<SessionStore>()(
  devtools(
    persist(
      immer<SessionStore>((set, get) => ({
        // State
        sessions: [],
        currentSessionId: null,
        isLoading: false,
        error: null,
        hasError: false,
        lastSavedAt: null,
        maxSessions: 50,

        // Actions
        createSession: async sessionData => {
          set(state => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            const newSession: ChatSession = {
              ...sessionData,
              id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            };

            set(state => {
              state.sessions.push(newSession);
              state.currentSessionId = newSession.id;
              state.isLoading = false;
              state.lastSavedAt = Date.now();
            });
          } catch (error) {
            set(state => {
              state.error =
                error instanceof Error
                  ? error.message
                  : 'Failed to create session';
              state.isLoading = false;
            });
          }
        },

        switchSession: async (sessionId: string) => {
          set(state => {
            state.currentSessionId = sessionId;
            state.lastSavedAt = Date.now();
          });
        },

        deleteSession: async (sessionId: string) => {
          set(state => {
            state.sessions = state.sessions.filter(
              session => session.id !== sessionId
            );
            if (state.currentSessionId === sessionId) {
              state.currentSessionId =
                state.sessions.length > 0
                  ? (state.sessions[0]?.id ?? null)
                  : null;
            }
            state.lastSavedAt = Date.now();
          });
        },

        updateSession: async (
          sessionId: string,
          updates: Partial<ChatSession>
        ) => {
          set(state => {
            const sessionIndex = state.sessions.findIndex(
              session => session.id === sessionId
            );
            if (sessionIndex !== -1) {
              const existingSession = state.sessions[sessionIndex];
              if (existingSession) {
                state.sessions[sessionIndex] = {
                  ...existingSession,
                  ...updates,
                  updatedAt: Date.now(),
                };
              }
              state.lastSavedAt = Date.now();
            }
          });
        },

        clearSessions: async () => {
          set(state => {
            state.sessions = [];
            state.currentSessionId = null;
            state.lastSavedAt = Date.now();
          });
        },

        setCurrentSessionId: (sessionId: string | null) => {
          set(state => {
            state.currentSessionId = sessionId;
          });
        },

        setMaxSessions: (max: number) => {
          set(state => {
            state.maxSessions = max;
          });
        },

        batchUpdateSessions: async (
          updates: Array<{ id: string; updates: Partial<ChatSession> }>
        ) => {
          set(state => {
            updates.forEach(({ id, updates: sessionUpdates }) => {
              const sessionIndex = state.sessions.findIndex(
                session => session.id === id
              );
              if (sessionIndex !== -1) {
                const existingSession = state.sessions[sessionIndex];
                if (existingSession) {
                  state.sessions[sessionIndex] = {
                    ...existingSession,
                    ...sessionUpdates,
                    updatedAt: Date.now(),
                  };
                }
              }
            });
            state.lastSavedAt = Date.now();
          });
        },

        searchSessions: (query: string) => {
          const { sessions } = get();
          return sessions.filter(
            session =>
              session.name.toLowerCase().includes(query.toLowerCase()) ||
              session.providerType
                .toLowerCase()
                .includes(query.toLowerCase()) ||
              session.modelName.toLowerCase().includes(query.toLowerCase())
          );
        },

        getSessionsByProvider: (provider: string) => {
          const { sessions } = get();
          return sessions.filter(session => session.providerType === provider);
        },

        getSessionsByModel: (model: string) => {
          const { sessions } = get();
          return sessions.filter(session => session.modelName === model);
        },

        getSessionStats: (): SessionStats => {
          const { sessions } = get();
          const totalMessages = sessions.reduce(
            (sum, session) => sum + session.messages.length,
            0
          );
          const providerCounts = sessions.reduce(
            (counts, session) => {
              counts[session.providerType] =
                (counts[session.providerType] || 0) + 1;
              return counts;
            },
            {} as Record<string, number>
          );
          const modelCounts = sessions.reduce(
            (counts, session) => {
              counts[session.modelName] = (counts[session.modelName] || 0) + 1;
              return counts;
            },
            {} as Record<string, number>
          );

          return {
            totalSessions: sessions.length,
            totalMessages,
            averageMessagesPerSession:
              sessions.length > 0 ? totalMessages / sessions.length : 0,
            mostUsedProvider: Object.keys(providerCounts).reduce(
              (a, b) => (providerCounts[a]! > providerCounts[b]! ? a : b),
              ''
            ),
            mostUsedModel: Object.keys(modelCounts).reduce(
              (a, b) => (modelCounts[a]! > modelCounts[b]! ? a : b),
              ''
            ),
          };
        },
      })),
      {
        name: 'session-store',
        partialize: state => ({
          sessions: state.sessions,
          currentSessionId: state.currentSessionId,
          lastSavedAt: state.lastSavedAt,
        }),
      }
    ),
    {
      name: 'session-store',
    }
  )
);
