import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type Theme = "dark" | "light";

export interface ThemeConfig {
  // Define any theme configuration properties here if needed
}

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "ai-ui-sdk-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem(storageKey) as Theme;
      return savedTheme || defaultTheme;
    }
    return defaultTheme;
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, newTheme);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;

      // Remove existing theme classes
      root.classList.remove("dark-theme", "light-theme");

      // Add new theme class
      root.classList.add(`${theme}-theme`);

      // Set data-theme attribute for CSS selectors
      root.setAttribute("data-theme", theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function useThemeAwareStyle() {
  const { theme } = useTheme();

  return {
    isDark: theme === "dark",
    isLight: theme === "light",
    theme,
  };
}
