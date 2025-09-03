import React from "react";
import { useApp } from "../contexts/AppContext";
import { ThemeSwitcher } from "./ThemeSwitcher";

export interface NavigationProps {
  className?: string;
}

export function Navigation({ className = "" }: NavigationProps) {
  const { state, disconnect } = useApp();

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className={`w-full ${className}`}
    >
      <div className="w-full flex items-center justify-between px-6 py-2">
        {/* Logo/Title */}
        <div className="flex items-center gap-x-3">
          <h1 className="text-xl font-semibold">AI React Demo</h1>
          {state.isConnected && (
            <span className="text-sm text-secondary">
              • {state.selectedProvider.name}
            </span>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-x-4">
          {/* Theme Switcher */}
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}
