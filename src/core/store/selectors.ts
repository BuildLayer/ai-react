import { useConnectionStore } from './connectionStore';
import { useSessionStore } from './sessionStore';
import { useUIStore } from './uiStore';
import type { ConnectionStore, SessionStore, UIStore } from '../types';

// Connection selectors
export const useConnectionStatus = () => {
  const store = useConnectionStore();
  return {
    isConnected: store.isConnected,
    isConnecting: store.isConnecting,
    error: store.error,
  };
};

export const useConnectionProvider = () => {
  const store = useConnectionStore();
  return store.provider;
};

export const useConnectionActions = () => {
  const store = useConnectionStore();
  return {
    connect: store.connect,
    disconnect: store.disconnect,
    clearError: store.clearError,
    testConnection: store.testConnection,
    retryConnection: store.retryConnection,
  };
};

// Session selectors
export const useCurrentSession = () => {
  const store = useSessionStore();
  return {
    currentSession: store.sessions.find(s => s.id === store.currentSessionId),
    currentSessionId: store.currentSessionId,
  };
};

export const useSessionList = () => {
  const store = useSessionStore();
  return store.sessions;
};

export const useSessionActions = () => {
  const store = useSessionStore();
  return {
    createSession: store.createSession,
    switchSession: store.switchSession,
    deleteSession: store.deleteSession,
    updateSession: store.updateSession,
    clearSessions: store.clearSessions,
    searchSessions: store.searchSessions,
    getSessionsByProvider: store.getSessionsByProvider,
    getSessionsByModel: store.getSessionsByModel,
    getSessionStats: store.getSessionStats,
  };
};

export const useSessionStats = () => {
  const store = useSessionStore();
  return store.getSessionStats();
};

// UI selectors
export const useUIState = () => {
  const store = useUIStore();
  return {
    theme: store.theme,
    sidebarOpen: store.sidebarOpen,
    mobileNavOpen: store.mobileNavOpen,
    activeModal: store.activeModal,
  };
};

export const useNotifications = () => {
  const store = useUIStore();
  return store.notifications;
};

export const usePerformanceMetrics = () => {
  const store = useUIStore();
  return store.performanceMetrics;
};

export const useUIActions = () => {
  const store = useUIStore();
  return {
    setTheme: store.setTheme,
    toggleSidebar: store.toggleSidebar,
    setSidebarOpen: store.setSidebarOpen,
    toggleMobileNav: store.toggleMobileNav,
    setMobileNavOpen: store.setMobileNavOpen,
    openModal: store.openModal,
    closeModal: store.closeModal,
    addNotification: store.addNotification,
    removeNotification: store.removeNotification,
    clearNotifications: store.clearNotifications,
    updatePerformanceMetrics: store.updatePerformanceMetrics,
  };
};

// Combined selectors for common use cases
export const useAppState = () => ({
  connection: useConnectionStatus(),
  session: useCurrentSession(),
  ui: useUIState(),
});

export const useAppActions = () => ({
  connection: useConnectionActions(),
  session: useSessionActions(),
  ui: useUIActions(),
});
