import { useOrderHistory } from "@/hooks/useOrderHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { History, User, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const ACTION_LABELS: Record<string, string> = {
  created: "Criado",
  updated: "Atualizado",
  status_changed: "Status alterado",
  item_added: "Item adicionado",
  item_removed: "Item removido",
  payment_received: "Pagamento recebido",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

const ACTION_COLORS: Record<string, string> = {
  created: "bg-blue-500",
  updated: "bg-yellow-500",
  status_changed: "bg-purple-500",
  item_added: "bg-green-500",
  item_removed: "bg-red-500",
  payment_received: "bg-emerald-500",
  shipped: "bg-orange-500",
  delivered: "bg-green-600",
  cancelled: "bg-red-600",
};

interface OrderHistoryTimelineProps {
  orderId: string;
}

export function OrderHistoryTimeline({ orderId }: OrderHistoryTimelineProps) {
  const { history, isLoading } = useOrderHistory(orderId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Histórico do Pedido
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nenhum histórico registrado</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-6">
              {history.map((entry, index) => (
                <div key={entry.id} className="relative flex gap-4">
                  <div
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${
                      ACTION_COLORS[entry.action] || "bg-gray-500"
                    } text-white`}
                  >
                    <History className="h-5 w-5" />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary">
                        {ACTION_LABELS[entry.action] || entry.action}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(entry.created_at), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    {entry.description && (
                      <p className="text-sm text-muted-foreground mb-1">
                        {entry.description}
                      </p>
                    )}
                    {entry.old_value && entry.new_value && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground line-through">
                          {entry.old_value}
                        </span>
                        <ArrowRight className="h-3 w-3" />
                        <span className="font-medium">{entry.new_value}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
