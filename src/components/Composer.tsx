import React, { useState, useRef, useEffect } from "react";
import type { ChatController } from "@buildlayer/ai-core";

export interface ComposerProps {
  chatController: ChatController;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function Composer({
  chatController,
  className = "",
  placeholder = "Type your message...",
  disabled = false,
}: ComposerProps) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState(chatController.status);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { stop } = chatController;

  const isStreaming = status === "streaming";

  // Subscribe to ChatStore status changes
  useEffect(() => {
    const updateStatus = () => {
      setStatus(chatController.status);
    };

    const unsubscribe = chatController.subscribe(updateStatus);
    return unsubscribe;
  }, [chatController]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const message = input.trim();
    setInput("");
    try {
      await chatController.send(message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const minHeight = 56; // minHeight from style
      textareaRef.current.style.height = `${Math.max(
        scrollHeight,
        minHeight
      )}px`;
    }
  }, [input]);

  return (
    <form onSubmit={handleSubmit} className={`${className}`}>
      <div
        style={{ position: "relative", display: "inline-block", width: "100%" }}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isStreaming}
          className="w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          rows={1}
          maxLength={4000}
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            padding: "20px 100px 20px 16px",
            minHeight: "56px",
            height: "auto",
            overflow: "hidden",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "12px",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            zIndex: 2,
          }}
        >
          {isStreaming && (
            <button
              type="button"
              onClick={() => stop()}
              className="px-3 py-1 text-xs bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Stop
            </button>
          )}

          <button
            type="submit"
            disabled={!input.trim() || isStreaming || disabled}
            className="px-3 py-1 text-xs text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor:
                !input.trim() || isStreaming || disabled
                  ? "#4d4d4d"
                  : "#00b894",
              border: "1px solid",
              borderColor:
                !input.trim() || isStreaming || disabled
                  ? "#4d4d4d"
                  : "#00b894",
            }}
            onMouseEnter={(e) => {
              if (!(!input.trim() || isStreaming || disabled)) {
                e.currentTarget.style.backgroundColor = "#00a085";
                e.currentTarget.style.borderColor = "#00a085";
              }
            }}
            onMouseLeave={(e) => {
              if (!(!input.trim() || isStreaming || disabled)) {
                e.currentTarget.style.backgroundColor = "#00b894";
                e.currentTarget.style.borderColor = "#00b894";
              }
            }}
            title={disabled ? "Input disabled" : undefined}
          >
            {isStreaming ? "..." : "Send"}
          </button>
        </div>
      </div>
    </form>
  );
}
