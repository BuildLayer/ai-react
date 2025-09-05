import React from "react";
import { useApp } from "../contexts/AppContext";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { ConnectionSettings } from "./ConnectionSettings";
import { MobileNav } from "./MobileNav";

export interface NavigationProps {
  className?: string;
}

export function Navigation({ className = "" }: NavigationProps) {
  const { state } = useApp();

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`w-full relative z-50 ${className}`}
      >
        <div className="w-full flex items-center justify-between px-4 lg:px-6 py-2">
          {/* Logo/Title */}
          <div className="flex items-center gap-x-2 lg:gap-x-3">
            <h1 className="text-lg lg:text-xl font-semibold">AI React</h1>
            {state.isConnected && (
              <span className="text-sm text-secondary">
                • {state.selectedProvider.name}
              </span>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-x-4">
            {/* Connection Settings */}
            <ConnectionSettings />
            {/* Theme Switcher */}
            <ThemeSwitcher />
          </div>

          {/* Mobile Navigation Button */}
          <div className="lg:hidden">
            <MobileNav showButton={true} showPanel={false} />
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Panel - outside nav for full screen coverage */}
      <div className="lg:hidden">
        <MobileNav showButton={false} showPanel={true} />
      </div>
    </>
  );
}
