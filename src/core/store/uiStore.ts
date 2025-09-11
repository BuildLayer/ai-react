import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { UIStore } from '../types/ui';
import type { Theme, Notification, PerformanceMetrics } from '../types/common';

export const useUIStore: () => UIStore = create<UIStore>()(
  devtools(
    persist(
      immer<UIStore>((set, get) => ({
        // State
        theme: 'dark',
        sidebarOpen: true,
        mobileNavOpen: false,
        activeModal: null,
        notifications: [],
        performanceMetrics: {
          renderTime: 0,
          apiResponseTime: 0,
          memoryUsage: 0,
          bundleSize: 0,
          errorRate: 0,
        },

        // Actions
        setTheme: (theme: Theme) => {
          set(state => {
            state.theme = theme;
          });
        },

        toggleSidebar: () => {
          set(state => {
            state.sidebarOpen = !state.sidebarOpen;
          });
        },

        setSidebarOpen: (open: boolean) => {
          set(state => {
            state.sidebarOpen = open;
          });
        },

        toggleMobileNav: () => {
          set(state => {
            state.mobileNavOpen = !state.mobileNavOpen;
          });
        },

        setMobileNavOpen: (open: boolean) => {
          set(state => {
            state.mobileNavOpen = open;
          });
        },

        openModal: (modalId: string) => {
          set(state => {
            state.activeModal = modalId;
          });
        },

        closeModal: () => {
          set(state => {
            state.activeModal = null;
          });
        },

        addNotification: notificationData => {
          const notification: Notification = {
            ...notificationData,
            id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: Date.now(),
          };

          set(state => {
            state.notifications.push(notification);
          });

          // Auto-remove notification after duration (if not persistent)
          if (!notification.persistent && notification.duration) {
            setTimeout(() => {
              get().removeNotification(notification.id);
            }, notification.duration);
          }
        },

        removeNotification: (id: string) => {
          set(state => {
            state.notifications = state.notifications.filter(
              notification => notification.id !== id
            );
          });
        },

        clearNotifications: () => {
          set(state => {
            state.notifications = [];
          });
        },

        updatePerformanceMetrics: (metrics: Partial<PerformanceMetrics>) => {
          set(state => {
            state.performanceMetrics = {
              ...state.performanceMetrics,
              ...metrics,
            };
          });
        },
      })),
      {
        name: 'ui-store',
        partialize: state => ({
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    {
      name: 'ui-store',
    }
  )
);
