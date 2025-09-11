import type { ProviderConfig, ProviderType } from '../types/connection';
import type {
  ProviderAdapter,
  ProviderFactory,
  ProviderValidationResult,
} from './types';
import { PROVIDER_CONFIGS } from './types';
import { validateProviderConfig } from './validation';

// Mock adapter implementation - in real implementation, this would use @buildlayer/ai-core
class MockProviderAdapter implements ProviderAdapter {
  private config: ProviderConfig;
  private connected = false;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.connected = true;
  }

  disconnect(): void {
    this.connected = false;
  }

  async testConnection(): Promise<boolean> {
    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    } catch {
      return false;
    }
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.connected) {
      throw new Error('Not connected to provider');
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `Mock response to: ${message}`;
  }

  isConnected(): boolean {
    return this.connected;
  }
}

export const createProviderAdapter = (
  config: ProviderConfig
): ProviderAdapter => {
  return new MockProviderAdapter(config);
};

export const getProviderInfo = (type: ProviderType) => {
  return PROVIDER_CONFIGS[type];
};

export const validateConfig = (
  config: ProviderConfig
): ProviderValidationResult => {
  return validateProviderConfig(config);
};

export const providerFactory: ProviderFactory = {
  createAdapter: createProviderAdapter,
  getProviderInfo,
  validateConfig,
};
