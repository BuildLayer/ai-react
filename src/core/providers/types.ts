import type {
  ProviderType,
  ProviderConfig,
  ProviderInfo,
} from '../types/connection';

export interface ProviderAdapter {
  connect(): Promise<void>;
  disconnect(): void;
  testConnection(): Promise<boolean>;
  sendMessage(message: string): Promise<string>;
  isConnected(): boolean;
}

export interface ProviderFactory {
  createAdapter(config: ProviderConfig): ProviderAdapter;
  getProviderInfo(type: ProviderType): ProviderInfo;
  validateConfig(config: ProviderConfig): ProviderValidationResult;
}

export interface ProviderValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export const PROVIDER_CONFIGS: Record<ProviderType, ProviderInfo> = {
  openai: {
    name: 'OpenAI',
    type: 'openai',
    apiKeyRequired: true,
    defaultModel: 'gpt-3.5-turbo',
    placeholder: 'sk-...',
    description: 'OpenAI GPT models',
    supportedModels: [
      'gpt-3.5-turbo',
      'gpt-3.5-turbo-16k',
      'gpt-4',
      'gpt-4-turbo',
      'gpt-4o',
      'gpt-4o-mini',
    ],
  },
  anthropic: {
    name: 'Anthropic',
    type: 'anthropic',
    apiKeyRequired: true,
    defaultModel: 'claude-3-haiku-20240307',
    placeholder: 'sk-ant-...',
    description: 'Anthropic Claude models',
    supportedModels: [
      'claude-3-haiku-20240307',
      'claude-3-sonnet-20240229',
      'claude-3-opus-20240229',
      'claude-3-5-sonnet-20241022',
    ],
  },
  mistral: {
    name: 'Mistral',
    type: 'mistral',
    apiKeyRequired: true,
    defaultModel: 'mistral-small-latest',
    placeholder: '...',
    description: 'Mistral AI models',
    supportedModels: [
      'mistral-tiny',
      'mistral-small-latest',
      'mistral-medium-latest',
      'mistral-large-latest',
    ],
  },
  grok: {
    name: 'Grok',
    type: 'grok',
    apiKeyRequired: true,
    defaultModel: 'grok-beta',
    placeholder: '...',
    description: 'Grok AI models',
    supportedModels: ['grok-beta'],
  },
  local: {
    name: 'Local LLM',
    type: 'local',
    apiKeyRequired: false,
    defaultModel: 'llama2',
    placeholder: 'http://localhost:11434',
    description: 'Local LLM models (Ollama, etc.)',
    supportedModels: ['llama2', 'llama3', 'codellama', 'mistral', 'phi'],
    customFields: [
      {
        name: 'baseURL',
        type: 'text',
        label: 'Base URL',
        placeholder: 'http://localhost:11434',
        required: true,
      },
    ],
  },
};
