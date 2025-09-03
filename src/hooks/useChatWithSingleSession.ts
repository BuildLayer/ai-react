import { useEffect, useCallback, useRef, useState } from "react";
import type { ChatController, Message } from "@buildlayer/ai-core";

export interface SingleChatSession {
  id: string;
  name: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "ai-react-session";

export function useChatWithSingleSession(chatController: ChatController) {
  const [session, setSession] = useState<SingleChatSession | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Throttle updateSession calls to prevent infinite loops
  const lastUpdateRef = useRef<number>(0);
  const lastMessageCountRef = useRef<number>(0);
  const isImportingRef = useRef<boolean>(false);
  const UPDATE_THROTTLE_MS = 50; // Minimum 50ms between updates

  // Load session from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem(STORAGE_KEY);
    if (savedSession) {
      try {
        const parsedSession = JSON.parse(savedSession);
        setSession(parsedSession);
      } catch (error) {
        console.error("Failed to parse saved session:", error);
        setSession(null);
      }
    } else {
      // Create initial session if none exists
      const newSession: SingleChatSession = {
        id: "single-session",
        name: "Chat",
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setSession(newSession);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
    }
    setIsLoaded(true);
  }, []);

  // Load session messages when session is first loaded from localStorage
  useEffect(() => {
    if (isLoaded && session && session.messages.length > 0) {
      // Set importing flag to prevent save during import
      isImportingRef.current = true;
      // Import history into chat controller
      chatController.importHistory(session.messages);
      // Reset importing flag after a short delay
      setTimeout(() => {
        isImportingRef.current = false;
      }, 100);
    }
  }, [isLoaded, session, chatController]);

  // Auto-save messages when they change
  useEffect(() => {
    if (!session || !isLoaded) {
      return;
    }

    const unsubscribe = chatController.subscribe((state) => {
      // Skip save if we're currently importing history
      if (isImportingRef.current) {
        return;
      }

      const hasNewMessages =
        state.messages.length !== lastMessageCountRef.current;

      // Save messages when:
      // 1. Status is idle (streaming is complete)
      // 2. Status is error (to save any partial messages)
      // 3. We have new messages (message count changed)
      const shouldSave =
        state.status === "idle" || state.status === "error" || hasNewMessages;

      if (shouldSave) {
        const now = Date.now();
        const timeSinceLastUpdate = now - lastUpdateRef.current;

        // Only throttle if we don't have new messages
        if (!hasNewMessages && timeSinceLastUpdate < UPDATE_THROTTLE_MS) {
          return;
        }

        const messages = state.messages;
        const updatedSession: SingleChatSession = {
          ...session,
          messages,
          updatedAt: now,
        };

        lastUpdateRef.current = now;
        lastMessageCountRef.current = messages.length;

        setSession(updatedSession);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));
      }
    });

    return unsubscribe;
  }, [chatController, session, isLoaded]);

  const clearSession = useCallback(() => {
    const clearedSession: SingleChatSession = {
      ...session!,
      messages: [],
      updatedAt: Date.now(),
    };

    setSession(clearedSession);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clearedSession));
    chatController.clearHistory();
  }, [session, chatController]);

  const exportSession = useCallback(() => {
    if (!session) return null;

    const exportData = {
      session: {
        id: session.id,
        name: session.name,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      },
      messages: session.messages,
      exportedAt: Date.now(),
    };

    return exportData;
  }, [session]);

  return {
    session,
    isLoaded,
    clearSession,
    exportSession,
  };
}
