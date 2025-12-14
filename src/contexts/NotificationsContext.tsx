import React, { createContext, useContext, ReactNode } from "react";
import {
  useNotifications,
  Notification,
  NotificationCategory,
} from "@/hooks/useNotifications";

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
  getNotificationsByCategory: (category: NotificationCategory) => Notification[];
  stockAlerts: Notification[];
  goalAlerts: Notification[];
  salesAlerts: Notification[];
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(
  undefined
);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const notificationsState = useNotifications();

  return (
    <NotificationsContext.Provider value={notificationsState}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotificationsContext() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error(
      "useNotificationsContext must be used within a NotificationsProvider"
    );
  }
  return context;
}
