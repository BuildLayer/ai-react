import { BaseEntity, ErrorState, LoadingState } from './common';

export type ProviderType =
  | 'openai'
  | 'anthropic'
  | 'mistral'
  | 'grok'
  | 'local';

export interface ProviderConfig {
  provider: ProviderType;
  apiKey: string;
  model: string;
  baseURL?: string;
  customHeaders?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

export interface ProviderInfo {
  name: string;
  type: ProviderType;
  apiKeyRequired: boolean;
  defaultModel: string;
  placeholder: string;
  description: string;
  supportedModels: string[];
  customFields?: ProviderField[];
}

export interface ProviderField {
  name: string;
  type: 'text' | 'password' | 'select' | 'number';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
}

export interface ConnectionState extends ErrorState, LoadingState {
  isConnected: boolean;
  isConnecting: boolean;
  provider: ProviderConfig | null;
  lastConnectedAt: number | null;
  connectionAttempts: number;
  maxRetries: number;
}

export interface ConnectionActions {
  connect: (config: ProviderConfig) => Promise<void>;
  disconnect: () => void;
  clearError: () => void;
  setConnecting: (loading: boolean) => void;
  testConnection: (config: ProviderConfig) => Promise<boolean>;
  retryConnection: () => Promise<void>;
  resetConnectionAttempts: () => void;
  setMaxRetries: (max: number) => void;
}

export type ConnectionStore = ConnectionState & ConnectionActions;
