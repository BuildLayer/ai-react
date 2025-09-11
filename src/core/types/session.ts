import { BaseEntity, ErrorState, LoadingState } from './common';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: ContentPart[];
  createdAt: number;
  updatedAt?: number;
}

export interface ContentPart {
  type: 'text' | 'image' | 'tool_use' | 'tool_result';
  text?: string;
  image_url?: string;
  name?: string;
  args?: Record<string, unknown>;
  result?: unknown;
}

export interface ChatSession extends BaseEntity {
  name: string;
  providerType: string;
  modelName: string;
  messages: Message[];
}

export interface SessionState extends ErrorState, LoadingState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  lastSavedAt: number | null;
  maxSessions: number;
}

export interface SessionActions {
  createSession: (
    session: Omit<ChatSession, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  switchSession: (sessionId: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  updateSession: (
    sessionId: string,
    updates: Partial<ChatSession>
  ) => Promise<void>;
  clearSessions: () => Promise<void>;
  setCurrentSessionId: (sessionId: string | null) => void;
  setMaxSessions: (max: number) => void;
  batchUpdateSessions: (
    updates: Array<{ id: string; updates: Partial<ChatSession> }>
  ) => Promise<void>;
  searchSessions: (query: string) => ChatSession[];
  getSessionsByProvider: (provider: string) => ChatSession[];
  getSessionsByModel: (model: string) => ChatSession[];
  getSessionStats: () => SessionStats;
}

export interface SessionStats {
  totalSessions: number;
  totalMessages: number;
  averageMessagesPerSession: number;
  mostUsedProvider: string | null;
  mostUsedModel: string | null;
}

export type SessionStore = SessionState & SessionActions;
