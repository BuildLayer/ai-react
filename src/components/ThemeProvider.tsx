import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type Theme = "dark" | "light" | "custom";

export interface ThemeConfig {
  // Define any theme configuration properties here if needed
}

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  customTokens: Record<string, string>;
  setCustomTokens: (tokens: Record<string, string>) => void;
}

export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  customTokens?: Record<string, string>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "ai-react-theme",
  customTokens: initialCustomTokens = {},
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem(storageKey) as Theme;
      return savedTheme || defaultTheme;
    }
    return defaultTheme;
  });

  const [customTokens, setCustomTokensState] =
    useState<Record<string, string>>(initialCustomTokens);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, newTheme);
    }
  };

  const applyTokensToDocument = (tokens: Record<string, string>) => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      Object.entries(tokens).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;

      // Remove existing theme classes
      root.classList.remove("dark-theme", "light-theme", "custom-theme");

      // Add new theme class
      root.classList.add(`${theme}-theme`);

      // Set data-theme attribute for CSS selectors
      root.setAttribute("data-theme", theme);

      // Apply custom tokens
      applyTokensToDocument(customTokens);
    }
  }, [theme, customTokens]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        customTokens,
        setCustomTokens: setCustomTokensState,
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
    isCustom: theme === "custom",
    theme,
  };
}
