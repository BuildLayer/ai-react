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
    <div
      className={`flex items-center justify-between p-3 md:p-4 ${className}`}
    >
      <div className="flex items-center gap-x-2 md:gap-x-4 min-w-0 flex-1">
        <span className="text-base md:text-lg font-semibold">Chat</span>
        <span className="text-xs md:text-sm text-muted-foreground truncate">
          {chatController?.messages?.length || 0} messages
        </span>
      </div>

      <div className="flex items-center space-x-1 md:space-x-2 flex-shrink-0">
        <button
          onClick={onClearHistory}
          className="px-2 md:px-3 py-1 text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
        >
          <span className="hidden sm:inline">Clear Session</span>
          <span className="sm:hidden">Clear</span>
        </button>
      </div>
    </div>
  );
}
