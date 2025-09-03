import React from "react";
import type { ChatController } from "@buildlayer/ai-core";

export interface ChatHeaderProps {
  chatController: ChatController;
  onClearHistory: () => void;
  className?: string;
}

export function ChatHeader({
  chatController,
  onClearHistory,
  className = "",
}: ChatHeaderProps) {
  return (
    <div className={`flex items-center justify-between p-4 ${className}`}>
      <div className="flex items-center gap-x-4">
        <span className="text-lg font-semibold">Chat</span>
        <span className="text-sm text-muted-foreground">
          {chatController.messages.length} messages
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onClearHistory}
          className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear Session
        </button>
      </div>
    </div>
  );
}
