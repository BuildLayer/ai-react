// Import Tailwind CSS
import "./tailwind.css";

// Hooks
export { useChat } from "./hooks/useChat";

// Components
export { LoadingSpinner } from "./components/LoadingSpinner";
export { ChatPanel } from "./components/ChatPanel";
export { MessageList } from "./components/MessageList";
export { Composer } from "./components/Composer";
export {
  ThemeProvider,
  useTheme,
  useThemeAwareStyle,
} from "./components/ThemeProvider";

// Types
export type { LoadingSpinnerProps } from "./components/LoadingSpinner";
export type { ChatPanelProps } from "./components/ChatPanel";
export type { MessageListProps } from "./components/MessageList";
export type { ComposerProps } from "./components/Composer";
export type {
  Theme,
  ThemeConfig,
  ThemeContextType,
  ThemeProviderProps,
} from "./components/ThemeProvider";
