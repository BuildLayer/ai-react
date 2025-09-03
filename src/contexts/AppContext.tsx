import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  createLocalLLMAdapter,
  createOpenAIAdapter,
  createAnthropicAdapter,
  createMistralAdapter,
  createGrokAdapter,
  ChatStore,
  weatherTool,
} from "@buildlayer/ai-core";

export interface AppState {
  isInitialized: boolean;
  isConnected: boolean;
  selectedProvider: {
    name: string;
    type: string;
  };
  selectedModel: string;
  chatController: ChatStore | null;
  error: string | null;
}

export interface AppContextType {
  state: AppState;
  connect: (provider: string, model: string, apiKey?: string) => Promise<void>;
  disconnect: () => void;
  clearError: () => void;
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
    chatController: null,
    error: null,
  });

  useEffect(() => {
    // Load saved settings
    const savedProvider = localStorage.getItem("ai-provider");
    const savedModel = localStorage.getItem("ai-model");
    const savedApiKey = localStorage.getItem("ai-api-key") || "";

    if (savedProvider && savedModel) {
      setState((prev) => ({
        ...prev,
        selectedProvider: JSON.parse(savedProvider),
        selectedModel: savedModel,
        isInitialized: true,
      }));

      // Auto-connect if we have saved settings
      connect(JSON.parse(savedProvider).type, savedModel, savedApiKey).catch(
        console.error
      );
    } else {
      setState((prev) => ({
        ...prev,
        isInitialized: true,
      }));
    }
  }, []);

  const connect = async (provider: string, model: string, apiKey?: string) => {
    try {
      setState((prev) => ({ ...prev, error: null }));

      let adapter;

      switch (provider) {
        case "openai":
          if (!apiKey) throw new Error("API key is required for OpenAI");
          adapter = createOpenAIAdapter(apiKey);
          break;
        case "anthropic":
          if (!apiKey) throw new Error("API key is required for Anthropic");
          adapter = createAnthropicAdapter(apiKey);
          break;
        case "mistral":
          if (!apiKey) throw new Error("API key is required for Mistral");
          adapter = createMistralAdapter(apiKey);
          break;
        case "grok":
          if (!apiKey) throw new Error("API key is required for Grok");
          adapter = createGrokAdapter(apiKey);
          break;
        case "local":
          adapter = createLocalLLMAdapter({
            baseURL: "http://localhost:11434/v1",
            apiKey: apiKey || "ollama",
          });
          break;
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }

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
          providerNames[provider] ||
          provider.charAt(0).toUpperCase() + provider.slice(1),
        type: provider,
      };

      // Save settings
      localStorage.setItem("ai-provider", JSON.stringify(providerInfo));
      localStorage.setItem("ai-model", model);
      if (apiKey) {
        localStorage.setItem("ai-api-key", apiKey);
      }

      setState((prev) => ({
        ...prev,
        isConnected: true,
        selectedProvider: providerInfo,
        selectedModel: model,
        chatController,
        error: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Connection failed",
      }));
    }
  };

  const disconnect = () => {
    setState((prev) => ({
      ...prev,
      isConnected: false,
      chatController: null,
      error: null,
    }));

    // Clear saved settings
    localStorage.removeItem("ai-provider");
    localStorage.removeItem("ai-model");
    localStorage.removeItem("ai-api-key");
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  return (
    <AppContext.Provider value={{ state, connect, disconnect, clearError }}>
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
