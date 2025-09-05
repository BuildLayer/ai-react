import React, { useState, useEffect } from "react";
import { useApp } from "../contexts/AppContext";
import type { ProviderConfig } from "@buildlayer/ai-core";

export interface ConnectionSettingsProps {
  className?: string;
}

export function ConnectionSettings({
  className = "",
}: ConnectionSettingsProps) {
  const { state, connect, disconnect, loadAvailableModels } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ProviderConfig>({
    provider: "openai",
    apiKey: "",
    model: "",
    baseURL: "",
  });

  useEffect(() => {
    if (state.isConnected) {
      setConfig({
        provider: state.selectedProvider.type as
          | "openai"
          | "anthropic"
          | "mistral"
          | "grok"
          | "local",
        apiKey: state.selectedApiKey || "",
        model: state.selectedModel,
        baseURL: state.selectedBaseURL || "",
      });
    }
  }, [
    state.isConnected,
    state.selectedProvider,
    state.selectedApiKey,
    state.selectedModel,
    state.selectedBaseURL,
  ]);

  useEffect(() => {
    if (config.provider && config.provider !== "local") {
      loadAvailableModels(config.provider);
    }
  }, [config.provider, loadAvailableModels]);

  const handleProviderChange = (provider: string) => {
    setConfig((prev) => ({
      ...prev,
      provider: provider as
        | "openai"
        | "anthropic"
        | "mistral"
        | "grok"
        | "local",
      model: "",
      baseURL: provider === "local" ? "http://localhost:11434/v1" : "",
    }));
  };

  const handleConnect = async () => {
    try {
      await connect(config);
      setIsOpen(false);
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setIsOpen(false);
  };

  const providerNames: Record<string, string> = {
    openai: "OpenAI",
    anthropic: "Anthropic",
    mistral: "Mistral",
    grok: "Grok",
    local: "Local LLM",
  };

  return (
    <div className={className}>
      {/* Connection Status */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-x-2">
        {state.isConnected ? (
          <>
            <div className="flex items-center gap-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">
                Connected to {state.selectedProvider.name}
              </span>
              <span className="text-xs text-muted-foreground">
                ({state.selectedModel})
              </span>
            </div>
            <button
              onClick={handleDisconnect}
              className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Disconnect
            </button>
          </>
        ) : (
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-x-2">
            <div className="flex items-center gap-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">
                Not connected
              </span>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              Connect
            </button>
          </div>
        )}
      </div>

      {/* Connection Modal */}
      {isOpen && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50">
          <div className="modal-content p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Connect to AI Provider
            </h3>

            <div className="space-y-4">
              {/* Provider Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Provider
                </label>
                <select
                  value={config.provider}
                  onChange={(e) => handleProviderChange(e.target.value)}
                  className="w-full p-2 modal-input"
                >
                  {state.availableProviders.map((provider) => (
                    <option key={provider} value={provider}>
                      {providerNames[provider] || provider}
                    </option>
                  ))}
                </select>
              </div>

              {/* API Key */}
              {config.provider !== "local" && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={config.apiKey}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, apiKey: e.target.value }))
                    }
                    placeholder="Enter your API key"
                    className="w-full p-2 modal-input"
                  />
                </div>
              )}

              {/* Model Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Model</label>
                {config.provider === "local" ? (
                  <input
                    type="text"
                    value={config.model}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, model: e.target.value }))
                    }
                    placeholder="Enter model name (e.g., llama2, codellama, mistral)"
                    className="w-full p-2 modal-input"
                  />
                ) : (
                  <select
                    value={config.model}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, model: e.target.value }))
                    }
                    className="w-full p-2 modal-input"
                  >
                    <option value="">Select a model</option>
                    {state.availableModels.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name} ({model.id})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Base URL (for local LLMs) */}
              {config.provider === "local" && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Base URL
                  </label>
                  <input
                    type="url"
                    value={config.baseURL}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        baseURL: e.target.value,
                      }))
                    }
                    placeholder="http://localhost:11434/v1"
                    className="w-full p-2 modal-input"
                  />
                </div>
              )}

              {/* Error Display */}
              {state.error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{state.error}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-x-2 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm modal-button-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConnect}
                disabled={
                  !config.model ||
                  (config.provider !== "local" && !config.apiKey)
                }
                className="px-4 py-2 text-sm modal-button-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
