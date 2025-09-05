import React from "react";
import { useApp } from "../contexts/AppContext";
import { useMobileNav } from "../contexts/MobileNavContext";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { ConnectionSettings } from "./ConnectionSettings";

export interface MobileNavProps {
  className?: string;
  showButton?: boolean;
  showPanel?: boolean;
}

export function MobileNav({
  className = "",
  showButton = true,
  showPanel = true,
}: MobileNavProps) {
  const { state, disconnect } = useApp();
  const { isOpen, toggleMenu, closeMenu } = useMobileNav();

  return (
    <>
      {/* Mobile menu button */}
      {showButton && (
        <button
          onClick={toggleMenu}
          className="md:hidden p-2"
          aria-label="Toggle mobile menu"
          aria-expanded={isOpen}
        >
          <div className="w-6 h-6 flex flex-col justify-center space-y-1">
            <span
              className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                isOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                isOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            />
          </div>
        </button>
      )}

      {/* Mobile menu panel - slides down from navigation */}
      {showPanel && (
        <div
          className={`fixed top-14 left-0 right-0 bottom-0 bg-primary border-b border-primary transform transition-transform duration-300 ease-in-out md:hidden z-40 ${
            isOpen ? "translate-y-0" : "-translate-y-full"
          } ${className}`}
        >
          <div className="h-full overflow-y-auto">
            <div className="p-4 space-y-6">
              {/* Connection Settings */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-secondary uppercase tracking-wide">
                  Connection
                </h3>
                <ConnectionSettings />
              </div>

              {/* Theme Settings */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-secondary uppercase tracking-wide">
                  Appearance
                </h3>
                <ThemeSwitcher />
              </div>

              {/* Disconnect button if connected */}
              {/* {state.isConnected && (
                <div className="pt-4 border-t border-primary">
                  <button
                    onClick={() => {
                      disconnect();
                      closeMenu();
                    }}
                    className="w-full px-4 py-2 text-sm text-error hover:bg-error hover:text-white transition-colors rounded-md border border-error"
                  >
                    Disconnect
                  </button>
                </div>
              )} */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
