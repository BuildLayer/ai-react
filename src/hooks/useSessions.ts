import { useCallback } from 'react';
import { useSessionStore } from '../core/store/sessionStore';
import type { UseSessionsReturn, ChatSession } from '../core/types';

export const useSessions = (): UseSessionsReturn => {
  const store = useSessionStore();

  const createSession = useCallback(
    async (name: string, providerType: string): Promise<void> => {
      const sessionData = {
        name,
        providerType,
        modelName: 'default',
        messages: [],
      };
      await store.createSession(sessionData);
    },
    [store]
  );

  const switchSession = useCallback(
    async (sessionId: string): Promise<void> => {
      await store.switchSession(sessionId);
    },
    [store]
  );

  const deleteSession = useCallback(
    async (sessionId: string): Promise<void> => {
      await store.deleteSession(sessionId);
    },
    [store]
  );

  const updateSession = useCallback(
    async (sessionId: string, updates: Partial<ChatSession>): Promise<void> => {
      await store.updateSession(sessionId, updates);
    },
    [store]
  );

  const clearSessions = useCallback(async (): Promise<void> => {
    await store.clearSessions();
  }, [store]);

  const searchSessions = useCallback(
    (query: string): ChatSession[] => {
      return store.searchSessions(query);
    },
    [store]
  );

  const getSessionsByProvider = useCallback(
    (provider: string): ChatSession[] => {
      return store.getSessionsByProvider(provider);
    },
    [store]
  );

  const getSessionsByModel = useCallback(
    (model: string): ChatSession[] => {
      return store.getSessionsByModel(model);
    },
    [store]
  );

  const getSessionStats = useCallback(() => {
    return store.getSessionStats();
  }, [store]);

  return {
    sessions: store.sessions,
    currentSession:
      store.sessions.find(s => s.id === store.currentSessionId) ?? null,
    currentSessionId: store.currentSessionId,
    createSession,
    switchSession,
    deleteSession,
    updateSession,
    clearSessions,
    searchSessions,
    getSessionsByProvider,
    getSessionsByModel,
    getSessionStats,
  };
};
