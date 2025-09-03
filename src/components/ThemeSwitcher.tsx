import React, { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";

type Theme = "dark" | "light";

export interface ThemeSwitcherProps {
  className?: string;
  showLabel?: boolean;
  size?: "small" | "medium" | "large";
}

export function ThemeSwitcher({
  className = "",
  showLabel = true,
  size = "medium",
}: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("ai-react-theme") as Theme;
    if (savedTheme && (savedTheme === "dark" || savedTheme === "light")) {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-5 w-5",
    large: "h-6 w-6",
  };

  const toggleTheme = async () => {
    setIsLoading(true);
    try {
      const newTheme: Theme = theme === "dark" ? "light" : "dark";
      setTheme(newTheme);
      localStorage.setItem("ai-react-theme", newTheme);
    } catch (error) {
      console.error("Failed to switch theme:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      data-testid="theme-button"
      onClick={toggleTheme}
      disabled={isLoading}
      className={`flex items-center space-x-2 px-3 py-2 text-sm transition-colors hover:bg-opacity-10 hover:bg-current disabled:opacity-50 ${className}`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      {isLoading ? (
        <div
          className={`animate-spin rounded-full border-b-2 border-current ${sizeClasses[size]}`}
        />
      ) : theme === "dark" ? (
        // Sun icon for light theme
        <svg
          className={sizeClasses[size]}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        // Moon icon for dark theme
        <svg
          className={sizeClasses[size]}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
      {showLabel && (
        <span className="hidden sm:inline">
          {theme === "dark" ? "Light" : "Dark"}
        </span>
      )}
    </button>
  );
}
