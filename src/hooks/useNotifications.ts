import { useState, useCallback, useMemo } from "react";
import { PRODUCTS } from "@/data/mockData";

export type NotificationType = "alert" | "warning" | "success" | "info";
export type NotificationCategory = "stock" | "sales" | "goal" | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  productId?: string;
  actionLabel?: string;
  actionUrl?: string;
}

// Generate mock notifications based on real data
const generateMockNotifications = (): Notification[] => {
  const notifications: Notification[] = [];
  const now = new Date();

  // Low stock alerts
  const lowStockProducts = PRODUCTS.filter(
    (p) => p.stockStatus === "low-stock" || p.stock < 100
  );

  lowStockProducts.slice(0, 3).forEach((product, index) => {
    notifications.push({
      id: `stock-${product.id}`,
      type: "warning",
      category: "stock",
      title: "Estoque Baixo",
      message: `${product.name} está com apenas ${product.stock} unidades em estoque.`,
      timestamp: new Date(now.getTime() - index * 3600000),
      read: false,
      productId: product.id,
      actionLabel: "Ver Produto",
      actionUrl: `/produto/${product.id}`,
    });
  });

  // Out of stock alerts
  const outOfStockProducts = PRODUCTS.filter(
    (p) => p.stockStatus === "out-of-stock"
  );

  outOfStockProducts.slice(0, 2).forEach((product, index) => {
    notifications.push({
      id: `out-${product.id}`,
      type: "alert",
      category: "stock",
      title: "Sem Estoque",
      message: `${product.name} está sem estoque disponível.`,
      timestamp: new Date(now.getTime() - (index + 3) * 3600000),
      read: false,
      productId: product.id,
      actionLabel: "Ver Produto",
      actionUrl: `/produto/${product.id}`,
    });
  });

  // Sales goal notifications
  notifications.push({
    id: "goal-monthly",
    type: "success",
    category: "goal",
    title: "Meta Mensal Atingida!",
    message: "Parabéns! Você atingiu 102% da meta de vendas deste mês.",
    timestamp: new Date(now.getTime() - 2 * 3600000),
    read: false,
  });

  notifications.push({
    id: "goal-weekly",
    type: "info",
    category: "goal",
    title: "Progresso Semanal",
    message: "Você está em 78% da meta semanal. Continue assim!",
    timestamp: new Date(now.getTime() - 5 * 3600000),
    read: true,
  });

  notifications.push({
    id: "goal-target",
    type: "warning",
    category: "goal",
    title: "Meta em Risco",
    message: "Faltam 3 dias para o fim do período e você está em 65% da meta.",
    timestamp: new Date(now.getTime() - 24 * 3600000),
    read: true,
  });

  // Sales notifications
  notifications.push({
    id: "sales-new-order",
    type: "success",
    category: "sales",
    title: "Novo Pedido",
    message: "Pedido #4521 de R$ 3.450,00 foi confirmado.",
    timestamp: new Date(now.getTime() - 1 * 3600000),
    read: false,
  });

  notifications.push({
    id: "sales-quote-approved",
    type: "success",
    category: "sales",
    title: "Orçamento Aprovado",
    message: "Cliente Tech Solutions aprovou o orçamento #892.",
    timestamp: new Date(now.getTime() - 8 * 3600000),
    read: true,
  });

  // System notifications
  notifications.push({
    id: "system-update",
    type: "info",
    category: "system",
    title: "Atualização do Sistema",
    message: "Novos recursos de comparação de produtos disponíveis.",
    timestamp: new Date(now.getTime() - 48 * 3600000),
    read: true,
  });

  // Sort by timestamp (newest first)
  return notifications.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
};

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(
    generateMockNotifications
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const getNotificationsByCategory = useCallback(
    (category: NotificationCategory) => {
      return notifications.filter((n) => n.category === category);
    },
    [notifications]
  );

  const stockAlerts = useMemo(
    () => notifications.filter((n) => n.category === "stock"),
    [notifications]
  );

  const goalAlerts = useMemo(
    () => notifications.filter((n) => n.category === "goal"),
    [notifications]
  );

  const salesAlerts = useMemo(
    () => notifications.filter((n) => n.category === "sales"),
    [notifications]
  );

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAll,
    getNotificationsByCategory,
    stockAlerts,
    goalAlerts,
    salesAlerts,
  };
}
