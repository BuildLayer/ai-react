import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./ThemeProvider";
import { ChatPanel } from "./ChatPanel";
import { Navigation } from "./Navigation";
import { LoadingSpinner } from "./LoadingSpinner";
import { AppProvider, useApp } from "../contexts/AppContext";
import "../tailwind.css";
import "../themes/dark-theme.css";
import "../themes/light-theme.css";

export interface AppProps {
  className?: string;
}

function AppRoutes() {
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
    <div className="h-screen flex flex-col overflow-hidden">
      <Navigation />
      <main
        role="main"
        aria-label="Main content"
        className="flex-1 overflow-hidden"
      >
        <Routes>
          <Route
            path="/"
            element={
              <ChatPanel
                chatController={state.chatController!}
                model={state.selectedModel}
                className="h-full"
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export function App({ className = "" }: AppProps) {
  return (
    <div className={className}>
      <ThemeProvider defaultTheme="dark">
        <AppProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AppProvider>
      </ThemeProvider>
    </div>
  );
}
