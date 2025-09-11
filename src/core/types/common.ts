// Common types used across the application

export interface BaseEntity {
  id: string;
  createdAt: number;
  updatedAt: number;
}

export interface ErrorState {
  error: string | null;
  hasError: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface PerformanceMetrics {
  renderTime: number;
  apiResponseTime: number;
  memoryUsage: number;
  bundleSize: number;
  errorRate: number;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  createdAt: number;
}

export type Theme = 'light' | 'dark';
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive';
export type Status = 'idle' | 'loading' | 'success' | 'error';
