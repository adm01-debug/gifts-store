import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Package,
  Target,
  TrendingUp,
  X,
  Info,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useNotificationsContext } from "@/contexts/NotificationsContext";
import {
  Notification,
  NotificationType,
  NotificationCategory,
} from "@/hooks/useNotifications";

const typeIcons: Record<NotificationType, React.ElementType> = {
  alert: AlertCircle,
  warning: AlertTriangle,
  success: CheckCircle2,
  info: Info,
};

const typeStyles: Record<NotificationType, string> = {
  alert: "text-destructive bg-destructive/10",
  warning: "text-warning bg-warning/10",
  success: "text-success bg-success/10",
  info: "text-info bg-info/10",
};

const categoryIcons: Record<NotificationCategory, React.ElementType> = {
  stock: Package,
  sales: TrendingUp,
  goal: Target,
  system: Bell,
};

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onAction?: () => void;
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onDismiss,
  onAction,
}: NotificationItemProps) {
  const navigate = useNavigate();
  const TypeIcon = typeIcons[notification.type];

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      onAction?.();
    }
  };

  return (
    <div
      className={cn(
        "relative p-3 rounded-lg transition-all duration-200 cursor-pointer group",
        notification.read
          ? "bg-transparent hover:bg-secondary/50"
          : "bg-primary/5 hover:bg-primary/10"
      )}
      onClick={handleClick}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
            typeStyles[notification.type]
          )}
        >
          <TypeIcon className="h-4 w-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className={cn(
                "text-sm font-medium",
                notification.read ? "text-foreground" : "text-foreground"
              )}
            >
              {notification.title}
            </p>
            {!notification.read && (
              <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {notification.message}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-muted-foreground">
              {formatDistanceToNow(notification.timestamp, {
                addSuffix: true,
                locale: ptBR,
              })}
            </span>
            {notification.actionLabel && (
              <span className="text-[10px] text-primary font-medium">
                {notification.actionLabel} →
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!notification.read && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(notification.id);
              }}
            >
              <Check className="h-3 w-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss(notification.id);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function NotificationPanel() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    stockAlerts,
    goalAlerts,
    salesAlerts,
  } = useNotificationsContext();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[380px] p-0"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h3 className="font-display font-semibold">Notificações</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} novas
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={markAllAsRead}
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Marcar todas como lidas
            </Button>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Todas
            </TabsTrigger>
            <TabsTrigger
              value="stock"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Package className="h-3 w-3 mr-1" />
              Estoque
            </TabsTrigger>
            <TabsTrigger
              value="goals"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Target className="h-3 w-3 mr-1" />
              Metas
            </TabsTrigger>
            <TabsTrigger
              value="sales"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Vendas
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px]">
            <TabsContent value="all" className="m-0 p-2 space-y-1">
              {notifications.length === 0 ? (
                <EmptyState />
              ) : (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDismiss={dismissNotification}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="stock" className="m-0 p-2 space-y-1">
              {stockAlerts.length === 0 ? (
                <EmptyState message="Nenhum alerta de estoque" />
              ) : (
                stockAlerts.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDismiss={dismissNotification}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="goals" className="m-0 p-2 space-y-1">
              {goalAlerts.length === 0 ? (
                <EmptyState message="Nenhum alerta de metas" />
              ) : (
                goalAlerts.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDismiss={dismissNotification}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="sales" className="m-0 p-2 space-y-1">
              {salesAlerts.length === 0 ? (
                <EmptyState message="Nenhum alerta de vendas" />
              ) : (
                salesAlerts.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDismiss={dismissNotification}
                  />
                ))
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}

function EmptyState({ message = "Nenhuma notificação" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3">
        <BellOff className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
