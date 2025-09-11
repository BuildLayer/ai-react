import type { ProviderConfig, ProviderType } from '../types/connection';
import type { ProviderValidationResult } from './types';

export const validateProviderConfig = (
  config: ProviderConfig
): ProviderValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required field validation
  if (!config.provider) {
    errors.push('Provider is required');
  }

  if (!config.model) {
    errors.push('Model is required');
  }

  // Note: apiKeyRequired check would need to be done based on provider type
  // This is a simplified validation
  if (!config.apiKey && config.provider !== 'local') {
    errors.push('API key is required for this provider');
  }

  // Provider-specific validation
  if (
    config.provider === 'openai' &&
    config.apiKey &&
    !config.apiKey.startsWith('sk-')
  ) {
    warnings.push('API key format may be incorrect for OpenAI');
  }

  if (
    config.provider === 'anthropic' &&
    config.apiKey &&
    !config.apiKey.startsWith('sk-ant-')
  ) {
    warnings.push('API key format may be incorrect for Anthropic');
  }

  if (config.provider === 'local' && !config.baseURL) {
    errors.push('Base URL is required for local providers');
  }

  if (
    config.provider === 'local' &&
    config.baseURL &&
    !config.baseURL.startsWith('http')
  ) {
    errors.push('Base URL must be a valid HTTP/HTTPS URL');
  }

  // Model validation
  if (config.model && config.model.length < 2) {
    errors.push('Model name must be at least 2 characters long');
  }

  // Timeout validation
  if (config.timeout && (config.timeout < 1000 || config.timeout > 300000)) {
    warnings.push('Timeout should be between 1 and 300 seconds');
  }

  // Retries validation
  if (config.retries && (config.retries < 0 || config.retries > 10)) {
    warnings.push('Retries should be between 0 and 10');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

export const validateProviderType = (type: string): type is ProviderType => {
  return ['openai', 'anthropic', 'mistral', 'grok', 'local'].includes(type);
};

export const validateApiKey = (
  apiKey: string,
  provider: ProviderType
): boolean => {
  if (!apiKey) return false;

  switch (provider) {
    case 'openai':
      return apiKey.startsWith('sk-');
    case 'anthropic':
      return apiKey.startsWith('sk-ant-');
    case 'mistral':
    case 'grok':
      return apiKey.length > 10; // Basic length check
    case 'local':
      return true; // No API key required
    default:
      return false;
  }
};
