import React, { useEffect } from "react";
import { ChatPanel } from "./ChatPanel";
import { Navigation } from "./Navigation";
import { LoadingSpinner } from "./LoadingSpinner";
import { useApp } from "../contexts/AppContext";

export interface AppRoutesProps {
  className?: string;
}

export function AppRoutes({ className = "" }: AppRoutesProps) {
  const { state } = useApp();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        // Trigger theme switch
        const themeButton = document.querySelector(
          '[data-testid="theme-button"]'
        ) as HTMLButtonElement;
        if (themeButton) {
          themeButton.click();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!state.isInitialized) {
    return <LoadingSpinner message="Initializing..." />;
  }

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${className}`}>
      <Navigation />
      <main
        role="main"
        aria-label="Main content"
        className="flex-1 overflow-hidden"
      >
        <ChatPanel
          chatController={state.chatController!}
          model={state.selectedModel}
          className="h-full"
        />
      </main>
    </div>
  );
}
