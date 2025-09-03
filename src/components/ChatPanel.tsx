import React from "react";
import { MessageList } from "./MessageList";
import { Composer } from "./Composer";
import { ChatHeader } from "./ChatHeader";
import { useApp } from "../contexts/AppContext";
import type { ChatController } from "@buildlayer/ai-core";

export interface ChatPanelProps {
  chatController: ChatController;
  model?: string;
  className?: string;
}

export function ChatPanel({
  chatController,
  model,
  className = "",
}: ChatPanelProps) {
  const { state } = useApp();

  // Dynamic disabled logic - no hardcoded values
  const getDisabledState = () => {
    const reasons: string[] = [];

    if (!model || model.trim() === "") {
      reasons.push("Model not selected");
    }

    if (!state.isConnected) {
      reasons.push("Not connected to AI service");
    }

    if (state.error) {
      reasons.push(`Connection error: ${state.error}`);
    }

    return {
      isDisabled: reasons.length > 0,
      reasons,
    };
  };

  const disabledState = getDisabledState();

  const handleClearHistory = () => {
    chatController.clearHistory();
  };

  return (
    <div
      className={`flex flex-col h-full max-w-4xl mx-auto ${className}`}
      style={{ height: "100%" }}
    >
      <ChatHeader
        chatController={chatController}
        onClearHistory={handleClearHistory}
      />

      <div
        className="flex-1 overflow-hidden overflow-y-auto"
        style={{ minHeight: 0 }}
      >
        <MessageList chatController={chatController} />
      </div>

      <div className="p-4">
        <Composer
          chatController={chatController}
          model={model}
          disabled={disabledState.isDisabled}
          disabledReasons={disabledState.reasons}
        />
      </div>
    </div>
  );
}
