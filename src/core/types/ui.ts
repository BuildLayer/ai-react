import { Theme, Notification, PerformanceMetrics } from './common';

export interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  mobileNavOpen: boolean;
  activeModal: string | null;
  notifications: Notification[];
  performanceMetrics: PerformanceMetrics;
}

export interface UIActions {
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileNav: () => void;
  setMobileNavOpen: (open: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  addNotification: (
    notification: Omit<Notification, 'id' | 'createdAt'>
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  updatePerformanceMetrics: (metrics: Partial<PerformanceMetrics>) => void;
}

export type UIStore = UIState & UIActions;
