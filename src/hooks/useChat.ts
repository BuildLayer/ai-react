import { useEffect, useRef, useCallback, useState } from "react";
import type {
  ChatController,
  Message,
  ContentPart,
  SendOpts,
} from "@buildlayer/ai-core";

export function useChat(chatController: ChatController) {
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // Subscribe to chat state changes
    unsubscribeRef.current = chatController.subscribe(() => {
      // Trigger re-render when state changes
      forceUpdate({});
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [chatController]);

  const send = useCallback(
    async (input: string | ContentPart[], opts?: SendOpts) => {
      await chatController.send(input, opts);
    },
    [chatController]
  );

  const runTool = useCallback(
    async (call: { name: string; args: any; id: string }) => {
      await chatController.runTool(call);
    },
    [chatController]
  );

  const stop = useCallback(() => {
    chatController.stop();
  }, [chatController]);

  const reset = useCallback(() => {
    chatController.reset();
  }, [chatController]);

  const importHistory = useCallback(
    (msgs: Message[]) => {
      chatController.importHistory(msgs);
    },
    [chatController]
  );

  const exportHistory = useCallback(() => {
    return chatController.exportHistory();
  }, [chatController]);

  const clearHistory = useCallback(() => {
    chatController.clearHistory();
  }, [chatController]);

  return {
    // State
    sessionId: chatController.sessionId,
    messages: chatController.messages,
    status: chatController.status,
    currentToolCall: chatController.currentToolCall,
    error: chatController.error,

    // Actions
    send,
    runTool,
    stop,
    reset,
    importHistory,
    exportHistory,
    clearHistory,
  };
}
