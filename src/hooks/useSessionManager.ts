import { useState, useEffect, useCallback, useRef } from "react";
import type { Message } from "@buildlayer/ai-core";

export interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export function useSessionManager() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Throttle localStorage saves
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load sessions and current session from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem("chat-sessions");
    const savedCurrentSessionId = localStorage.getItem("current-session-id");

    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions);
      setSessions(parsedSessions);

      // Set current session to the saved one, or the most recent if none saved
      if (
        savedCurrentSessionId &&
        parsedSessions.find((s: ChatSession) => s.id === savedCurrentSessionId)
      ) {
        setCurrentSessionId(savedCurrentSessionId);
      } else if (parsedSessions.length > 0) {
        // Set to the most recently updated session
        const mostRecent = parsedSessions.reduce(
          (latest: ChatSession, current: ChatSession) =>
            current.updatedAt > latest.updatedAt ? current : latest
        );
        setCurrentSessionId(mostRecent.id);
      }
    }

    setIsLoaded(true);

    // Cleanup timeout on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Save sessions to localStorage with throttling
  useEffect(() => {
    if (!isLoaded) {
      console.log("useSessionManager - skipping save, not loaded yet");
      return;
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce the save operation
    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem("chat-sessions", JSON.stringify(sessions));
      } catch (error) {
        console.error(
          "useSessionManager - failed to save to localStorage:",
          error
        );
      }
    }, 100);

    // Cleanup timeout on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [sessions, isLoaded]);

  // Save current session ID to localStorage
  useEffect(() => {
    if (currentSessionId) {
      localStorage.setItem("current-session-id", currentSessionId);
    }
  }, [currentSessionId]);

  const createSession = useCallback(
    (name?: string) => {
      const newSession: ChatSession = {
        id: `session-${Date.now()}`,
        name: name || `Chat ${sessions.length + 1}`,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setSessions((prev) => {
        const newSessions = [...prev, newSession];

        return newSessions;
      });
      setCurrentSessionId(newSession.id);
      return newSession;
    },
    [sessions.length]
  );

  const updateSession = useCallback(
    (sessionId: string, messages: Message[]) => {
      setSessions((prev) => {
        // Check if session exists before updating
        const sessionExists = prev.some((s) => s.id === sessionId);
        if (!sessionExists) {
          console.warn(
            "useSessionManager - updateSession called for non-existent session:",
            sessionId
          );
          return prev; // Return unchanged state
        }

        return prev.map((session) =>
          session.id === sessionId
            ? { ...session, messages, updatedAt: Date.now() }
            : session
        );
      });
    },
    []
  );

  const deleteSession = useCallback(
    (sessionId: string) => {
      setSessions((prev) => prev.filter((session) => session.id !== sessionId));
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
      }
    },
    [currentSessionId]
  );

  const getCurrentSession = useCallback(() => {
    return sessions.find((session) => session.id === currentSessionId);
  }, [sessions, currentSessionId]);

  return {
    sessions,
    currentSessionId,
    isLoaded,
    createSession,
    updateSession,
    deleteSession,
    getCurrentSession,
    setCurrentSessionId,
  };
}
