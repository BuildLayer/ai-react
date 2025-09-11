import './index.css';

// Core exports
export * from './core';

// New hooks
export { useConnection } from './hooks/useConnection';
export { useSessions } from './hooks/useSessions';
export { useStorage } from './hooks/useStorage';

// Legacy hooks (to be deprecated)
export { useChat } from './hooks/useChat';
export { useChatWithSingleSession } from './hooks/useChatWithSingleSession';

// Legacy components (to be refactored)
export { App } from './components/App';
export { AppRoutes } from './components/AppRoutes';
export { Navigation } from './components/Navigation';
export { MobileNav } from './components/MobileNav';
export { ThemeSwitcher } from './components/ThemeSwitcher';
export { LoadingSpinner } from './components/LoadingSpinner';
export { ChatPanel } from './components/ChatPanel';
export { ChatHeader } from './components/ChatHeader';
export { MessageList } from './components/MessageList';
export { Composer } from './components/Composer';
export { ConnectionSettings } from './components/ConnectionSettings';
export {
  ThemeProvider,
  useTheme,
  useThemeAwareStyle,
} from './components/ThemeProvider';

// Legacy contexts (to be deprecated)
export { AppProvider, useApp } from './contexts/AppContext';
export {
  MobileNavProvider,
  useMobileNav,
  MobileNavContext,
} from './contexts/MobileNavContext';

// Legacy component props types (to be deprecated)
export type { AppProps } from './components/App';
export type { AppRoutesProps } from './components/AppRoutes';
export type { NavigationProps } from './components/Navigation';
export type { ThemeSwitcherProps } from './components/ThemeSwitcher';
export type { LoadingSpinnerProps } from './components/LoadingSpinner';
export type { ChatPanelProps } from './components/ChatPanel';
export type { ChatHeaderProps } from './components/ChatHeader';
export type { MessageListProps } from './components/MessageList';
export type { ComposerProps } from './components/Composer';
export type { ConnectionSettingsProps } from './components/ConnectionSettings';
export type { MobileNavProps } from './components/MobileNav';

// Legacy context types (to be deprecated)
export type {
  AppState,
  AppContextType,
  AppProviderProps,
} from './contexts/AppContext';
export type { MobileNavContextType } from './contexts/MobileNavContext';

// Legacy theme types (to be deprecated)
export type {
  Theme,
  ThemeConfig,
  ThemeContextType,
  ThemeProviderProps,
} from './components/ThemeProvider';
