import { usePasswordResetRequests, PasswordResetRequest } from "@/hooks/usePasswordResetRequests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { KeyRound, CheckCircle2, XCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PasswordResetRequestsProps {
  reviewerId: string;
}

export function PasswordResetRequests({ reviewerId }: PasswordResetRequestsProps) {
  const { requests, pendingCount, isLoading, reviewRequest } = usePasswordResetRequests();

  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5" />
          Solicitações de Reset de Senha
        </CardTitle>
        {pendingCount > 0 && <Badge variant="destructive">{pendingCount} pendentes</Badge>}
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Nenhuma solicitação</p>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => (
              <RequestItem key={request.id} request={request} reviewerId={reviewerId} onReview={reviewRequest.mutate} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RequestItem({ request, reviewerId, onReview }: { request: PasswordResetRequest; reviewerId: string; onReview: any }) {
  const statusConfig = {
    pending: { color: "bg-yellow-100 border-yellow-200", icon: Clock, label: "Pendente" },
    approved: { color: "bg-green-100 border-green-200", icon: CheckCircle2, label: "Aprovado" },
    rejected: { color: "bg-red-100 border-red-200", icon: XCircle, label: "Rejeitado" },
  };

  const config = statusConfig[request.status as keyof typeof statusConfig] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-lg border ${config.color}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{request.email}</span>
            <Badge variant="outline"><Icon className="h-3 w-3 mr-1" />{config.label}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Solicitado {formatDistanceToNow(new Date(request.requested_at), { addSuffix: true, locale: ptBR })}
          </p>
          {request.reviewer_notes && (
            <p className="text-sm mt-2 p-2 bg-white/50 rounded">{request.reviewer_notes}</p>
          )}
        </div>
        {request.status === "pending" && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="text-green-600" onClick={() => onReview({ requestId: request.id, status: "approved", reviewerId })}>
              <CheckCircle2 className="h-4 w-4 mr-1" />Aprovar
            </Button>
            <Button size="sm" variant="outline" className="text-red-600" onClick={() => onReview({ requestId: request.id, status: "rejected", reviewerId })}>
              <XCircle className="h-4 w-4 mr-1" />Rejeitar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
