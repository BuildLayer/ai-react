import { RefObject } from 'react';
import { Message, ChatSession } from './session';
import { ProviderConfig } from './connection';
import { PerformanceMetrics, Notification } from './common';

// Connection hook types
export interface UseConnectionReturn {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  provider: ProviderConfig | null;
  connect: (config: ProviderConfig) => Promise<void>;
  disconnect: () => void;
  clearError: () => void;
  testConnection: (config: ProviderConfig) => Promise<boolean>;
  retryConnection: () => Promise<void>;
}

// Session hook types
export interface UseSessionsReturn {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  currentSessionId: string | null;
  createSession: (name: string, providerType: string) => Promise<void>;
  switchSession: (sessionId: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  updateSession: (
    sessionId: string,
    updates: Partial<ChatSession>
  ) => Promise<void>;
  clearSessions: () => Promise<void>;
  searchSessions: (query: string) => ChatSession[];
  getSessionsByProvider: (provider: string) => ChatSession[];
  getSessionsByModel: (model: string) => ChatSession[];
  getSessionStats: () => {
    totalSessions: number;
    totalMessages: number;
    averageMessagesPerSession: number;
    mostUsedProvider: string | null;
    mostUsedModel: string | null;
  };
}

export interface UseChatReturn {
  messages: Message[];
  status: 'idle' | 'streaming' | 'error';
  error: string | null;
  send: (
    input: string | Array<{ type: 'text'; text: string }>,
    opts?: SendOptions
  ) => Promise<void>;
  stop: () => void;
  reset: () => void;
  importHistory: (messages: Message[]) => void;
  exportHistory: () => Message[];
  clearHistory: () => void;
}

export interface SendOptions {
  stream?: boolean;
  tools?: Array<{
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  }>;
  temperature?: number;
  maxTokens?: number;
}

// Storage hook types
export interface UseStorageReturn {
  save: <T>(
    key: string,
    data: T,
    adapter?: string,
    debounceMs?: number
  ) => Promise<void>;
  load: <T>(key: string, adapter?: string) => Promise<T | null>;
  remove: (key: string, adapter?: string) => Promise<void>;
  clear: (adapter?: string) => Promise<void>;
  exists: (key: string, adapter?: string) => Promise<boolean>;
  keys: (adapter?: string) => Promise<string[]>;
}

// Performance hook types
export interface UsePerformanceReturn {
  metrics: PerformanceMetrics;
  startMonitoring: () => () => void;
  measureRender: (name: string, fn: () => void) => void;
  measureAsync: <T>(name: string, fn: () => Promise<T>) => Promise<T>;
  getMemoryUsage: () => number;
  getBundleSize: () => number;
}

// UI hook types
export interface UseUIReturn {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  mobileNavOpen: boolean;
  toggleMobileNav: () => void;
  setMobileNavOpen: (open: boolean) => void;
  activeModal: string | null;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  notifications: Notification[];
  addNotification: (
    notification: Omit<Notification, 'id' | 'createdAt'>
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

// Utility hook types
export interface UseDebounceReturn<T> {
  value: T;
  setValue: (value: T) => void;
  debouncedValue: T;
  isPending: boolean;
}

export interface UseVirtualizationReturn {
  visibleItems: unknown[];
  startIndex: number;
  endIndex: number;
  totalHeight: number;
  offsetY: number;
  scrollToIndex: (index: number) => void;
  scrollToTop: () => void;
  scrollToBottom: () => void;
}

export interface UseAsyncReturn<T, E = Error> {
  data: T | null;
  error: E | null;
  loading: boolean;
  execute: (...args: unknown[]) => Promise<T>;
  reset: () => void;
}

export interface UseIntervalReturn {
  isActive: boolean;
  start: () => void;
  stop: () => void;
  toggle: () => void;
}

export interface UseTimeoutReturn {
  isActive: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export interface UsePreviousReturn<T> {
  previousValue: T | undefined;
  currentValue: T;
}

export interface UseToggleReturn {
  value: boolean;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
  setValue: (value: boolean) => void;
}

export interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: (count: number) => void;
}

export interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setError: <K extends keyof T>(field: K, error: string) => void;
  clearError: <K extends keyof T>(field: K) => void;
  setTouched: <K extends keyof T>(field: K, touched: boolean) => void;
  handleSubmit: (
    onSubmit: (values: T) => void | Promise<void>
  ) => (event: React.FormEvent) => void;
  reset: () => void;
  validate: () => boolean;
}

export interface UseClickOutsideReturn {
  ref: RefObject<HTMLElement>;
  isOutside: boolean;
}

export interface UseKeyPressReturn {
  key: string;
  pressed: boolean;
  event: KeyboardEvent | null;
}

export interface UseScrollPositionReturn {
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right' | null;
}

export interface UseWindowSizeReturn {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export interface UseMediaQueryReturn {
  matches: boolean;
  media: string;
}

export interface UseFocusTrapReturn {
  ref: RefObject<HTMLElement>;
  active: boolean;
  activate: () => void;
  deactivate: () => void;
}

export interface UseIdReturn {
  id: string;
  generateId: (prefix?: string) => string;
}
