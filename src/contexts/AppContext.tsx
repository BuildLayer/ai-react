import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  ChatStore,
  weatherTool,
  ProviderConfig,
  createProviderAdapter,
  validateProviderConfig,
  getAvailableProviders,
  getAvailableModels,
} from "@buildlayer/ai-core";

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
  chatController: ChatStore | null;
  error: string | null;
  availableProviders: string[];
  availableModels: any[];
}

export interface AppContextType {
  state: AppState;
  connect: (config: ProviderConfig) => Promise<void>;
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

const AppContext = createContext<AppContextType | undefined>(undefined);

export interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, setState] = useState<AppState>({
    isInitialized: false,
    isConnected: false,
    selectedProvider: {
      name: "",
      type: "",
    },
    selectedModel: "",
    selectedApiKey: undefined,
    selectedBaseURL: undefined,
    chatController: null,
    error: null,
    availableProviders: [],
    availableModels: [],
  });

  useEffect(() => {
    // Load available providers
    loadAvailableProviders();

    // Load saved settings
    const savedProvider = localStorage.getItem("ai-provider");
    const savedModel = localStorage.getItem("ai-model");
    const savedApiKey = localStorage.getItem("ai-api-key") || "";
    const savedBaseURL = localStorage.getItem("ai-base-url") || "";

    if (savedProvider && savedModel) {
      setState((prev) => ({
        ...prev,
        selectedProvider: JSON.parse(savedProvider),
        selectedModel: savedModel,
        selectedApiKey: savedApiKey,
        selectedBaseURL: savedBaseURL || undefined,
        isInitialized: true,
      }));

      // Auto-connect if we have saved settings
      const providerConfig: ProviderConfig = {
        provider: JSON.parse(savedProvider).type as
          | "openai"
          | "anthropic"
          | "mistral"
          | "grok"
          | "local",
        apiKey: savedApiKey,
        model: savedModel,
        baseURL: savedBaseURL || undefined,
      };
      connect(providerConfig).catch(console.error);
    } else {
      setState((prev) => ({
        ...prev,
        isInitialized: true,
      }));
    }
  }, []);

  const loadAvailableProviders = async () => {
    try {
      const providers = getAvailableProviders();
      setState((prev) => ({
        ...prev,
        availableProviders: providers,
      }));
    } catch (error) {
      console.error("Failed to load providers:", error);
    }
  };

  const loadAvailableModels = async (provider: string) => {
    // Don't load models for local LLM
    if (provider === "local") {
      setState((prev) => ({
        ...prev,
        availableModels: [],
      }));
      return;
    }

    try {
      const models = await getAvailableModels(provider);
      setState((prev) => ({
        ...prev,
        availableModels: models,
      }));
    } catch (error) {
      console.error("Failed to load models:", error);
      setState((prev) => ({
        ...prev,
        availableModels: [],
      }));
    }
  };

  const connect = async (config: ProviderConfig) => {
    try {
      setState((prev) => ({ ...prev, error: null }));

      // Validate configuration
      const validation = validateProviderConfig(config);
      if (!validation.valid) {
        throw new Error(
          `Invalid configuration: ${validation.errors.join(", ")}`
        );
      }

      // Create adapter using the new provider manager
      const adapter = createProviderAdapter(config);
      const chatController = new ChatStore(adapter);

      // Register tools
      chatController.registerTool(weatherTool);

      // Find provider info for display
      const providerNames: Record<string, string> = {
        openai: "OpenAI",
        anthropic: "Anthropic",
        mistral: "Mistral",
        grok: "Grok",
        local: "Local LLM",
      };

      const providerInfo = {
        name:
          providerNames[config.provider] ||
          config.provider.charAt(0).toUpperCase() + config.provider.slice(1),
        type: config.provider,
      };

      // Save settings
      localStorage.setItem("ai-provider", JSON.stringify(providerInfo));
      localStorage.setItem("ai-model", config.model);
      if (config.apiKey) {
        localStorage.setItem("ai-api-key", config.apiKey);
      }
      if (config.baseURL) {
        localStorage.setItem("ai-base-url", config.baseURL);
      }

      setState((prev) => ({
        ...prev,
        isConnected: true,
        selectedProvider: providerInfo,
        selectedModel: config.model,
        selectedApiKey: config.apiKey,
        selectedBaseURL: config.baseURL,
        chatController,
        error: null,
      }));

      // Load messages from localStorage after chatController is set in state
      const savedMessages = localStorage.getItem("ai-messages");
      if (savedMessages) {
        try {
          const messages = JSON.parse(savedMessages);

          // Use the proper importHistory method instead of direct manipulation
          chatController.importHistory(messages);
        } catch (error) {
          console.error("Failed to load messages from localStorage:", error);
        }
      }

      // Save messages to localStorage when they change
      let saveTimeout: NodeJS.Timeout | undefined;
      const unsubscribe = chatController.subscribe(() => {
        try {
          const messages = chatController.messages;
          const status = chatController.status;

          // Only save when not streaming or when streaming is complete
          if (status !== "streaming" || messages.length > 0) {
            // Clear previous timeout
            if (saveTimeout) {
              clearTimeout(saveTimeout);
            }

            // Use longer debounce during streaming to prevent too frequent writes
            const debounceDelay = status === "streaming" ? 500 : 100;

            saveTimeout = setTimeout(() => {
              localStorage.setItem("ai-messages", JSON.stringify(messages));
            }, debounceDelay);
          }
        } catch (error) {
          console.error("Failed to save messages to localStorage:", error);
        }
      });

      // Store unsubscribe function and timeout for cleanup
      (chatController as any)._unsubscribe = unsubscribe;
      (chatController as any)._saveTimeout = saveTimeout;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Connection failed",
      }));
    }
  };

  const connectLegacy = async (
    provider: string,
    model: string,
    apiKey?: string
  ) => {
    const config: ProviderConfig = {
      provider: provider as any,
      apiKey: apiKey || "",
      model: model,
      baseURL: provider === "local" ? "http://localhost:11434/v1" : undefined,
    };
    return connect(config);
  };

  const disconnect = () => {
    // Unsubscribe from chat controller if it exists
    if (state.chatController && (state.chatController as any)._unsubscribe) {
      (state.chatController as any)._unsubscribe();
    }

    // Clear any pending save timeout
    if ((state.chatController as any)?._saveTimeout) {
      clearTimeout((state.chatController as any)._saveTimeout);
    }

    setState((prev) => ({
      ...prev,
      isConnected: false,
      chatController: null,
      error: null,
    }));

    // Clear saved settings and messages
    localStorage.removeItem("ai-provider");
    localStorage.removeItem("ai-model");
    localStorage.removeItem("ai-api-key");
    localStorage.removeItem("ai-base-url");
    localStorage.removeItem("ai-messages");
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  return (
    <AppContext.Provider
      value={{
        state,
        connect,
        connectLegacy,
        disconnect,
        clearError,
        loadAvailableProviders,
        loadAvailableModels,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
