import React from "react";
import { MessageList } from "./MessageList";
import { Composer } from "./Composer";
import type { ChatController } from "@buildlayer/ai-core";

export interface ChatPanelProps {
  chatController: ChatController;
  className?: string;
  title?: string;
}

export function ChatPanel({
  chatController,
  className = "",
  title = "Chat",
}: ChatPanelProps) {
  return (
    <div
      className={`flex flex-col h-full max-w-4xl mx-auto ${className}`}
      style={{ height: "100%" }}
    >
      {/* Simple header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-lg font-semibold">{title}</h1>
        <span className="text-sm text-gray-500">
          {chatController.messages.length} messages
        </span>
      </div>

      {/* Messages area */}
      <div
        className="flex-1 overflow-hidden overflow-y-auto"
        style={{ minHeight: 0 }}
      >
        <MessageList chatController={chatController} />
      </div>

      {/* Composer */}
      <div className="p-4">
        <Composer chatController={chatController} />
      </div>
    </div>
  );
}
