import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

// Import types from the original AppContext
export interface AppState {
  isInitialized: boolean;
  isConnected: boolean;
  selectedProvider: {
    name: string;
    type: string;
  };
  selectedModel: string;
  selectedApiKey: string | undefined;
  selectedBaseURL?: string;
  chatController: any | null;
  error: string | null;
  availableProviders: string[];
  availableModels: any[];
}

export interface AppContextType {
  state: AppState;
  connect: (config: any) => Promise<void>;
  connectLegacy: (
    provider: string,
    model: string,
    apiKey?: string
  ) => Promise<void>;
  disconnect: () => void;
  clearError: () => void;
  loadAvailableProviders: () => Promise<void>;
  loadAvailableModels: (provider: string) => Promise<void>;
}

export interface AppProviderProps {
  children: ReactNode;
}

// Create a compatibility layer that bridges to the old context interface
const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: AppProviderProps) {
  // State for initialization
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState({
    name: '',
    type: '',
  });
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedApiKey, setSelectedApiKey] = useState<string | undefined>(
    undefined
  );
  const [selectedBaseURL, setSelectedBaseURL] = useState<string | undefined>(
    undefined
  );
  const [chatController, setChatController] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [availableProviders] = useState([
    'openai',
    'anthropic',
    'mistral',
    'grok',
    'local',
  ]);
  const [availableModels] = useState([]);

  // Initialize on mount
  useEffect(() => {
    // Load saved settings from localStorage (matching original behavior)
    const savedProvider = localStorage.getItem('ai-provider');
    const savedModel = localStorage.getItem('ai-model');
    const savedApiKey = localStorage.getItem('ai-api-key') || '';
    const savedBaseURL = localStorage.getItem('ai-base-url') || '';

    if (savedProvider && savedModel) {
      const providerInfo = JSON.parse(savedProvider);
      setSelectedProvider(providerInfo);
      setSelectedModel(savedModel);
      setSelectedApiKey(savedApiKey);
      setSelectedBaseURL(savedBaseURL || undefined);
      setIsConnected(true);

      // Create a mock chat controller
      const mockController = {
        messages: [],
        status: 'idle' as const,
        sendMessage: async (message: string) => {
          console.log('Mock sendMessage:', message);
        },
        clearMessages: () => {
          console.log('Mock clearMessages');
        },
        importHistory: (messages: any[]) => {
          console.log('Mock importHistory:', messages);
        },
        subscribe: (callback: () => void) => {
          console.log('Mock subscribe');
          return () => console.log('Mock unsubscribe');
        },
        registerTool: (tool: any) => {
          console.log('Mock registerTool:', tool);
        },
      };
      setChatController(mockController);
    }

    setIsInitialized(true);
  }, []);

  // Create connection functions
  const connect = async (config: any) => {
    try {
      setError(null);

      // Create provider name mapping
      const providerNames: Record<string, string> = {
        openai: 'OpenAI',
        anthropic: 'Anthropic',
        mistral: 'Mistral',
        grok: 'Grok',
        local: 'Local LLM',
      };

      const providerInfo = {
        name: providerNames[config.provider] || config.provider,
        type: config.provider,
      };

      // Save settings
      localStorage.setItem('ai-provider', JSON.stringify(providerInfo));
      localStorage.setItem('ai-model', config.model);
      if (config.apiKey) {
        localStorage.setItem('ai-api-key', config.apiKey);
      }
      if (config.baseURL) {
        localStorage.setItem('ai-base-url', config.baseURL);
      }

      setSelectedProvider(providerInfo);
      setSelectedModel(config.model);
      setSelectedApiKey(config.apiKey);
      setSelectedBaseURL(config.baseURL);
      setIsConnected(true);

      // Create a mock chat controller
      const mockController = {
        messages: [],
        status: 'idle' as const,
        sendMessage: async (message: string) => {
          console.log('Mock sendMessage:', message);
        },
        clearMessages: () => {
          console.log('Mock clearMessages');
        },
        importHistory: (messages: any[]) => {
          console.log('Mock importHistory:', messages);
        },
        subscribe: (callback: () => void) => {
          console.log('Mock subscribe');
          return () => console.log('Mock unsubscribe');
        },
        registerTool: (tool: any) => {
          console.log('Mock registerTool:', tool);
        },
      };
      setChatController(mockController);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Connection failed');
    }
  };

  const connectLegacy = async (
    provider: string,
    model: string,
    apiKey?: string
  ) => {
    const config = {
      provider: provider as any,
      model,
      apiKey: apiKey || '',
      baseURL: provider === 'local' ? 'http://localhost:11434/v1' : undefined,
    };
    await connect(config);
  };

  const disconnect = () => {
    setIsConnected(false);
    setChatController(null);
    setError(null);

    // Clear saved settings and messages
    localStorage.removeItem('ai-provider');
    localStorage.removeItem('ai-model');
    localStorage.removeItem('ai-api-key');
    localStorage.removeItem('ai-base-url');
    localStorage.removeItem('ai-messages');
  };

  const clearError = () => {
    setError(null);
  };

  const loadAvailableProviders = async () => {
    // Mock implementation
    console.log('Mock loadAvailableProviders');
  };

  const loadAvailableModels = async (provider: string) => {
    // Mock implementation
    console.log('Mock loadAvailableModels:', provider);
  };

  // Bridge state to old context interface
  const state: AppState = {
    isInitialized,
    isConnected,
    selectedProvider,
    selectedModel,
    selectedApiKey,
    selectedBaseURL,
    chatController,
    error,
    availableProviders,
    availableModels,
  };

  const contextValue: AppContextType = {
    state,
    connect,
    connectLegacy,
    disconnect,
    clearError,
    loadAvailableProviders,
    loadAvailableModels,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
