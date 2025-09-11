import { ReactNode, ChangeEvent, MouseEvent, FormEvent } from 'react';
import { Theme, Size, Variant, Status } from './common';
import { Message, ChatSession } from './session';
import { ProviderConfig } from './connection';

// Base component props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

// Button component props
export interface ButtonProps extends BaseComponentProps {
  variant?: Variant;
  size?: Size;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

// Input component props
export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  label?: string;
  helperText?: string;
}

// Select component props
export interface SelectProps extends BaseComponentProps {
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  multiple?: boolean;
  error?: boolean;
  label?: string;
  helperText?: string;
}

// Modal component props
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: Size;
  closable?: boolean;
  overlay?: boolean;
}

// Card component props
export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
}

// Chat component props
export interface ChatContainerProps extends BaseComponentProps {
  onMessageSent?: (message: Message) => void;
  onMessageReceived?: (message: Message) => void;
  onSessionChange?: (session: ChatSession | null) => void;
}

export interface MessageListProps extends BaseComponentProps {
  messages: Message[];
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onRetry?: (messageId: string) => void;
  virtualized?: boolean;
  maxHeight?: string;
}

export interface MessageItemProps extends BaseComponentProps {
  message: Message;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onRetry?: (messageId: string) => void;
  showActions?: boolean;
}

export interface ComposerProps extends BaseComponentProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  showToolbar?: boolean;
  onToolSelect?: (tool: string) => void;
}

// Dashboard component props
export interface DashboardContainerProps extends BaseComponentProps {
  onConnectionChange?: (isConnected: boolean) => void;
  onProviderChange?: (provider: ProviderConfig | null) => void;
}

export interface ConnectionFormProps extends BaseComponentProps {
  onConnect: (config: ProviderConfig) => void;
  onTest?: (config: ProviderConfig) => void;
  loading?: boolean;
  error?: string | null;
}

export interface ProviderSelectorProps extends BaseComponentProps {
  value?: string;
  onChange: (provider: string) => void;
  disabled?: boolean;
}

export interface ModelSelectorProps extends BaseComponentProps {
  provider: string;
  value?: string;
  onChange: (model: string) => void;
  disabled?: boolean;
}

// Layout component props
export interface AppLayoutProps extends BaseComponentProps {
  sidebar?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}

export interface NavigationProps extends BaseComponentProps {
  items?: Array<{
    label: string;
    href: string;
    icon?: ReactNode;
    active?: boolean;
  }>;
  onItemClick?: (href: string) => void;
}

export interface SidebarProps extends BaseComponentProps {
  collapsed?: boolean;
  onToggle?: () => void;
  items?: Array<{
    label: string;
    href: string;
    icon?: ReactNode;
    active?: boolean;
    children?: Array<{
      label: string;
      href: string;
      active?: boolean;
    }>;
  }>;
  onItemClick?: (href: string) => void;
}

// Theme component props
export interface ThemeProviderProps extends BaseComponentProps {
  defaultTheme?: Theme;
  theme?: Theme;
  onThemeChange?: (theme: Theme) => void;
}

export interface ThemeSwitcherProps extends BaseComponentProps {
  showLabel?: boolean;
  size?: Size;
}

// Form component props
export interface FormProps extends BaseComponentProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onReset?: (event: FormEvent<HTMLFormElement>) => void;
  loading?: boolean;
  disabled?: boolean;
}

export interface FormFieldProps extends BaseComponentProps {
  label: string;
  error?: string;
  required?: boolean;
  helperText?: string;
}

// Loading component props
export interface LoadingSpinnerProps extends BaseComponentProps {
  size?: Size;
  color?: string;
  text?: string;
}

// Error component props
export interface ErrorBoundaryProps extends BaseComponentProps {
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: { componentStack: string }) => void;
}

// Tooltip component props
export interface TooltipProps extends BaseComponentProps {
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
  disabled?: boolean;
}

// Badge component props
export interface BadgeProps extends BaseComponentProps {
  variant?: Variant;
  size?: Size;
  dot?: boolean;
}

// Alert component props
export interface AlertProps extends BaseComponentProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  closable?: boolean;
  onClose?: () => void;
}

// Progress component props
export interface ProgressProps extends BaseComponentProps {
  value: number;
  max?: number;
  size?: Size;
  variant?: 'default' | 'success' | 'warning' | 'error';
  showValue?: boolean;
  animated?: boolean;
}
