import React, { useEffect, useRef, useState } from "react";
import type { ChatController } from "@buildlayer/ai-core";
import type { Message } from "@buildlayer/ai-core";

export interface MessageListProps {
  chatController: ChatController;
  className?: string;
}

export function MessageList({
  chatController,
  className = "",
}: MessageListProps) {
  const [messages, setMessages] = useState(chatController?.messages || []);
  const [status, setStatus] = useState(chatController?.status || "idle");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage
  useEffect(() => {
    if (!chatController) return;

    const updateState = () => {
      console.log("MessageList - updating state from ChatStore");
      const allMessages = chatController.messages;

      // Remove duplicates based on message ID
      const uniqueMessages = allMessages.filter(
        (message, index, self) =>
          index === self.findIndex((m) => m.id === message.id)
      );

      console.log(
        "MessageList - original messages:",
        allMessages.length,
        "unique messages:",
        uniqueMessages.length
      );
      setMessages(uniqueMessages);
      setStatus(chatController.status);
    };

    // Subscribe to changes (subscribe returns unsubscribe function)
    const unsubscribe = chatController.subscribe(updateState);

    return unsubscribe;
  }, [chatController]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={`flex-1 p-4 space-y-4 ${className}`}>
      {messages.map((message, index) => (
        <div
          key={index}
          className={`p-3 flex flex-col w-full ${
            message.role === "user" ? " items-start" : " items-end"
          }`}
        >
          <div className="text-sm font-medium mb-1 capitalize">
            {message.role}
          </div>
          <div className="text-sm">
            {message.content.map((part, partIndex) => (
              <div key={partIndex}>
                {part.type === "text" && <span>{part.text}</span>}
                {part.type === "tool_use" && (
                  <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded mt-2">
                    <div className="font-medium">Tool: {part.name}</div>
                    <div className="text-xs">{JSON.stringify(part.args)}</div>
                  </div>
                )}
                {part.type === "tool_result" && (
                  <div className="bg-green-100 dark:bg-green-900 p-2 rounded mt-2">
                    <div className="font-medium">Result:</div>
                    <div className="text-xs">{JSON.stringify(part.result)}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-xs text-muted mt-2">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      ))}

      {status === "streaming" && (
        <div className="flex justify-end">
          <div className="loading-dots px-4 py-2 rounded-lg">
            <div className="flex space-x-1">
              <div className="w-2 h-2 loading-dot rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 loading-dot rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 loading-dot rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
