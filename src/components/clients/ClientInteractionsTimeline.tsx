import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  DollarSign,
  MessageSquare,
  Package,
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Eye,
  ChevronRight,
  Handshake,
  AlertTriangle,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  type: "deal" | "quote" | "order" | "conversation" | "reminder" | "mockup";
  title: string;
  description?: string;
  status?: string;
  value?: number;
  date: string;
  metadata?: Record<string, any>;
}

interface ClientInteractionsTimelineProps {
  events: TimelineEvent[];
  isLoading?: boolean;
}

const eventConfig = {
  deal: {
    icon: Handshake,
    color: "text-primary",
    bgColor: "bg-primary/10",
    label: "Negócio",
  },
  quote: {
    icon: FileText,
    color: "text-info",
    bgColor: "bg-info/10",
    label: "Orçamento",
  },
  order: {
    icon: Package,
    color: "text-success",
    bgColor: "bg-success/10",
    label: "Pedido",
  },
  conversation: {
    icon: MessageSquare,
    color: "text-warning",
    bgColor: "bg-warning/10",
    label: "Conversa",
  },
  reminder: {
    icon: Bell,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    label: "Lembrete",
  },
  mockup: {
    icon: Eye,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    label: "Mockup",
  },
};

const statusIcons: Record<string, React.ElementType> = {
  approved: CheckCircle,
  rejected: XCircle,
  pending: Clock,
  sent: Send,
  draft: FileText,
  expired: AlertTriangle,
  won: CheckCircle,
  lost: XCircle,
  completed: CheckCircle,
};

const statusColors: Record<string, string> = {
  approved: "text-success",
  rejected: "text-destructive",
  pending: "text-warning",
  sent: "text-info",
  draft: "text-muted-foreground",
  expired: "text-muted-foreground",
  won: "text-success",
  lost: "text-destructive",
  completed: "text-success",
};

export function ClientInteractionsTimeline({
  events,
  isLoading,
}: ClientInteractionsTimelineProps) {
  const navigate = useNavigate();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const groupedEvents = useMemo(() => {
    const groups: Record<string, TimelineEvent[]> = {};

    events.forEach((event) => {
      const date = format(new Date(event.date), "yyyy-MM-dd");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
    });

    // Sort by date descending
    return Object.entries(groups)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .map(([date, events]) => ({
        date,
        label: format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
        events: events.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
      }));
  }, [events]);

  const handleEventClick = (event: TimelineEvent) => {
    switch (event.type) {
      case "quote":
        if (event.metadata?.quoteId) {
          navigate(`/orcamentos/${event.metadata.quoteId}`);
        }
        break;
      case "order":
        if (event.metadata?.orderId) {
          navigate(`/pedidos/${event.metadata.orderId}`);
        }
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Timeline de Interações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Timeline de Interações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Nenhuma interação registrada para este cliente
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Timeline de Interações
          <Badge variant="secondary" className="ml-auto">
            {events.length} eventos
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[500px] pr-4">
          <div className="space-y-6">
            {groupedEvents.map((group) => (
              <div key={group.date}>
                {/* Date Header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs font-medium text-muted-foreground px-2">
                    {group.label}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                {/* Events */}
                <div className="space-y-3">
                  {group.events.map((event, index) => {
                    const config = eventConfig[event.type];
                    const Icon = config.icon;
                    const StatusIcon = event.status
                      ? statusIcons[event.status.toLowerCase()] || Clock
                      : null;

                    return (
                      <div
                        key={event.id}
                        className={cn(
                          "relative flex gap-3 group",
                          event.metadata?.quoteId || event.metadata?.orderId
                            ? "cursor-pointer hover:bg-accent/50 rounded-lg p-2 -m-2"
                            : ""
                        )}
                        onClick={() => handleEventClick(event)}
                      >
                        {/* Timeline Line */}
                        {index < group.events.length - 1 && (
                          <div className="absolute left-5 top-10 w-px h-[calc(100%-2rem)] bg-border" />
                        )}

                        {/* Icon */}
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10",
                            config.bgColor
                          )}
                        >
                          <Icon className={cn("h-5 w-5", config.color)} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className="text-xs">
                                  {config.label}
                                </Badge>
                                {event.status && StatusIcon && (
                                  <span
                                    className={cn(
                                      "flex items-center gap-1 text-xs",
                                      statusColors[event.status.toLowerCase()] ||
                                        "text-muted-foreground"
                                    )}
                                  >
                                    <StatusIcon className="h-3 w-3" />
                                    {event.status}
                                  </span>
                                )}
                              </div>
                              <p className="font-medium text-sm text-foreground mt-1 truncate">
                                {event.title}
                              </p>
                              {event.description && (
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                  {event.description}
                                </p>
                              )}
                            </div>

                            <div className="text-right shrink-0">
                              {event.value !== undefined && event.value > 0 && (
                                <p className="text-sm font-semibold text-success flex items-center gap-1">
                                  <DollarSign className="h-3.5 w-3.5" />
                                  {formatCurrency(event.value)}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(event.date), {
                                  addSuffix: true,
                                  locale: ptBR,
                                })}
                              </p>
                            </div>
                          </div>

                          {/* Click indicator */}
                          {(event.metadata?.quoteId || event.metadata?.orderId) && (
                            <div className="flex items-center gap-1 text-xs text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span>Ver detalhes</span>
                              <ChevronRight className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
