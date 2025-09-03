import { useEffect, useCallback, useRef } from "react";
import { useSessionManager, type ChatSession } from "./useSessionManager";
import type { ChatController } from "@buildlayer/ai-core";

export function useChatWithSessions(chatController: ChatController) {
  const {
    sessions,
    currentSessionId,
    isLoaded,
    createSession,
    updateSession,
    getCurrentSession,
    setCurrentSessionId,
  } = useSessionManager();

  // Throttle updateSession calls to prevent infinite loops
  const lastUpdateRef = useRef<number>(0);
  const lastMessageCountRef = useRef<number>(0);
  const isImportingRef = useRef<boolean>(false);
  const UPDATE_THROTTLE_MS = 50; // Minimum 50ms between updates

  // Create initial session if none exists
  useEffect(() => {
    if (isLoaded && !currentSessionId && sessions.length === 0) {
      createSession("Chat 1");
    }
  }, [isLoaded, currentSessionId, sessions.length, createSession]);

  // Load session messages when sessions are first loaded from localStorage
  useEffect(() => {
    if (isLoaded && currentSessionId && sessions.length > 0) {
      const session = getCurrentSession();
      if (session && session.messages.length > 0) {
        // Set importing flag to prevent save during import
        isImportingRef.current = true;
        // Import history into chat controller
        chatController.importHistory(session.messages);
        // Reset importing flag after a short delay
        setTimeout(() => {
          isImportingRef.current = false;
        }, 100);
      }
    }
  }, [isLoaded, currentSessionId, sessions, getCurrentSession, chatController]);

  // Auto-save messages when they change
  useEffect(() => {
    if (!currentSessionId || !isLoaded) {
      return;
    }

    const unsubscribe = chatController.subscribe((state) => {
      // Skip save if we're currently importing history
      if (isImportingRef.current) {
        // console.log("useChatWithSessions - skipping save, importing history");
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

        if (currentSessionId) {
          lastUpdateRef.current = now;
          lastMessageCountRef.current = messages.length;
          updateSession(currentSessionId, messages);
        } else {
          console.warn(
            "useChatWithSessions - cannot update session, no currentSessionId"
          );
        }
      } else {
        console.log(
          "useChatWithSessions - skipping save, status is:",
          state.status
        );
      }
    });

    return unsubscribe;
  }, [chatController, currentSessionId, updateSession, isLoaded]);

  // Load session messages when session changes (after initial load)
  useEffect(() => {
    if (!isLoaded || !currentSessionId || sessions.length === 0) return;

    const session = getCurrentSession();
    if (session) {
      // Only import history if the chat controller has fewer messages than the session
      // This prevents overriding messages that are currently being updated
      if (
        session.messages.length > 0 &&
        chatController.messages.length < session.messages.length
      ) {
        chatController.importHistory(session.messages);
      } else if (
        session.messages.length === 0 &&
        chatController.messages.length > 0
      ) {
        // Clear chat controller if session has no messages
        chatController.clearHistory();
      }
    }
  }, [isLoaded, currentSessionId, sessions, getCurrentSession, chatController]);

  const startNewSession = useCallback(() => {
    // Save current session before creating new one
    if (currentSessionId && chatController.messages.length > 0) {
      // Force immediate save by updating the session
      updateSession(currentSessionId, chatController.messages);

      // Also force save to localStorage immediately to ensure it's persisted
      const currentSessions = JSON.parse(
        localStorage.getItem("chat-sessions") || "[]"
      );
      const updatedSessions = currentSessions.map((session: any) =>
        session.id === currentSessionId
          ? {
              ...session,
              messages: chatController.messages,
              updatedAt: Date.now(),
            }
          : session
      );
      localStorage.setItem("chat-sessions", JSON.stringify(updatedSessions));
    }

    const newSession = createSession();
    // chatController.reset();
    return newSession;
  }, [createSession, chatController, currentSessionId, updateSession]);

  const switchToSession = useCallback(
    (sessionId: string) => {
      // Save current session before switching
      if (
        currentSessionId &&
        currentSessionId !== sessionId &&
        chatController.messages.length > 0
      ) {
        // Force immediate save by updating the session
        updateSession(currentSessionId, chatController.messages);

        // Also force save to localStorage immediately to ensure it's persisted
        const currentSessions = JSON.parse(
          localStorage.getItem("chat-sessions") || "[]"
        );
        const updatedSessions = currentSessions.map((session: any) =>
          session.id === currentSessionId
            ? {
                ...session,
                messages: chatController.messages,
                updatedAt: Date.now(),
              }
            : session
        );
        localStorage.setItem("chat-sessions", JSON.stringify(updatedSessions));
      }

      setCurrentSessionId(sessionId);
      // The session loading will be handled by the useEffect above
      // when currentSessionId changes
    },
    [setCurrentSessionId, currentSessionId, chatController, updateSession]
  );

  const clearCurrentSession = useCallback(() => {
    if (currentSessionId) {
      updateSession(currentSessionId, []);
      chatController.clearHistory();
    }
  }, [currentSessionId, updateSession, chatController]);

  return {
    sessions,
    currentSessionId,
    currentSession: getCurrentSession(),
    startNewSession,
    switchToSession,
    clearCurrentSession,
  };
}
