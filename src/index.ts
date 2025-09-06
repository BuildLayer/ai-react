import "./index.css";

// Hooks
export { useChat } from "./hooks/useChat";
export { useChatWithSingleSession } from "./hooks/useChatWithSingleSession";

// Components
export { App } from "./components/App";
export { AppRoutes } from "./components/AppRoutes";
export { Navigation } from "./components/Navigation";
export { ThemeSwitcher } from "./components/ThemeSwitcher";
export { LoadingSpinner } from "./components/LoadingSpinner";
export { ChatPanel } from "./components/ChatPanel";
export { ChatHeader } from "./components/ChatHeader";
export { MessageList } from "./components/MessageList";
export { Composer } from "./components/Composer";
export {
  ThemeProvider,
  useTheme,
  useThemeAwareStyle,
} from "./components/ThemeProvider";

// Contexts
export { AppProvider, useApp } from "./contexts/AppContext";
export { MobileNavProvider } from "./contexts/MobileNavContext";

// Types
export type { AppProps } from "./components/App";
export type { AppRoutesProps } from "./components/AppRoutes";
export type { NavigationProps } from "./components/Navigation";
export type { ThemeSwitcherProps } from "./components/ThemeSwitcher";
export type { LoadingSpinnerProps } from "./components/LoadingSpinner";
export type { ChatPanelProps } from "./components/ChatPanel";
export type { ChatHeaderProps } from "./components/ChatHeader";
export type { MessageListProps } from "./components/MessageList";
export type { ComposerProps } from "./components/Composer";
export type {
  AppState,
  AppContextType,
  AppProviderProps,
} from "./contexts/AppContext";
export type {
  Theme,
  ThemeConfig,
  ThemeContextType,
  ThemeProviderProps,
} from "./components/ThemeProvider";
