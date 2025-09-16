// Mock implementation of @buildlayer/ai-core types
// This allows the SDK to work without the actual ai-core package

export interface ProviderConfig {
  provider: string;
  apiKey: string;
  model: string;
  baseURL?: string;
}

export interface ChatController {
  messages: Message[];
  status: 'idle' | 'loading' | 'error' | 'streaming';
  sessionId: string;
  error: string | null;
  send: (input: string | ContentPart[], opts?: SendOpts) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  stop: () => void;
  reset: () => void;
  clearMessages: () => void;
  clearHistory: () => void;
  importHistory: (messages: Message[]) => void;
  exportHistory: () => Message[];
  subscribe: (callback: (state: ChatController) => void) => () => void;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: ContentPart[];
  timestamp?: number;
  createdAt?: number;
}

export interface ChatRequest {
  message: string;
  provider: string;
  model: string;
  apiKey: string;
  baseURL?: string;
}

export interface Delta {
  content?: string;
  role?: string;
  type?: string;
}

export interface ProviderAdapter {
  sendMessage: (request: ChatRequest) => Promise<AsyncIterable<Delta>>;
}

export interface ContentPart {
  type: 'text' | 'image';
  text?: string;
  image_url?: string;
}

export interface SendOpts {
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  model?: string;
}

export class ChatStore {
  messages: Message[] = [];
  status: 'idle' | 'loading' | 'error' | 'streaming' = 'idle';
  error: string | null = null;
  sessionId: string = 'mock-session';

  constructor(adapter?: ProviderAdapter) {
    // Mock constructor - adapter is optional for now
  }

  send = async (input: string | ContentPart[], opts?: SendOpts) => {
    console.log('Mock send:', input, opts);
    // Mock implementation
  };

  sendMessage = async (message: string) => {
    console.log('Mock sendMessage:', message);
    // Mock implementation
  };

  stop = () => {
    console.log('Mock stop');
    // Mock implementation
  };

  reset = () => {
    console.log('Mock reset');
    this.messages = [];
    this.status = 'idle';
    this.error = null;
  };

  clearMessages = () => {
    this.messages = [];
  };

  clearHistory = () => {
    this.messages = [];
  };

  importHistory = (messages: Message[]) => {
    this.messages = messages;
  };

  exportHistory = () => {
    return this.messages;
  };

  subscribe = (callback: (state: ChatController) => void) => {
    console.log('Mock subscribe');
    return () => console.log('Mock unsubscribe');
  };
}

// Mock functions for provider management
export const createProviderAdapter = (
  config: ProviderConfig
): ProviderAdapter => {
  return {
    sendMessage: async (request: ChatRequest) => {
      console.log('Mock createProviderAdapter:', request);
      return (async function* () {
        yield { content: 'Mock response' };
      })();
    },
  };
};

export const validateProviderConfig = (
  config: ProviderConfig
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  if (!config.provider) errors.push('Provider is required');
  if (!config.model) errors.push('Model is required');
  return {
    valid: errors.length === 0,
    errors,
  };
};

export const getAvailableProviders = (): string[] => {
  return ['openai', 'anthropic', 'mistral', 'grok', 'local'];
};

export const getAvailableModels = (provider: string): string[] => {
  const models: Record<string, string[]> = {
    openai: ['gpt-4', 'gpt-3.5-turbo'],
    anthropic: ['claude-3-opus', 'claude-3-sonnet'],
    mistral: ['mistral-large', 'mistral-medium'],
    grok: ['grok-beta'],
    local: ['llama2', 'codellama'],
  };
  return models[provider] || [];
};
