import { useLoginAttempts, LoginAttempt } from "@/hooks/useLoginAttempts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, CheckCircle2, XCircle, Globe, Monitor } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LoginAttemptsLogProps {
  userId?: string;
  limit?: number;
}

export function LoginAttemptsLog({ userId, limit = 20 }: LoginAttemptsLogProps) {
  const { attempts, recentFailures, isLoading } = useLoginAttempts(userId, limit);

  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Tentativas de Login
        </CardTitle>
        {recentFailures.length > 0 && (
          <Badge variant="destructive">
            {recentFailures.length} falhas (24h)
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {attempts.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Nenhuma tentativa registrada</p>
        ) : (
          <div className="space-y-2">
            {attempts.map((attempt) => (
              <AttemptItem key={attempt.id} attempt={attempt} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AttemptItem({ attempt }: { attempt: LoginAttempt }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${
      attempt.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
    }`}>
      {attempt.success ? (
        <CheckCircle2 className="h-5 w-5 text-green-600" />
      ) : (
        <XCircle className="h-5 w-5 text-red-600" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{attempt.email}</span>
          <Badge variant={attempt.success ? "default" : "destructive"} className="text-xs">
            {attempt.success ? "Sucesso" : "Falha"}
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
          <span className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            {attempt.ip_address}
          </span>
          <span>
            {formatDistanceToNow(new Date(attempt.created_at), { addSuffix: true, locale: ptBR })}
          </span>
        </div>
        {attempt.failure_reason && (
          <p className="text-xs text-red-600 mt-1">{attempt.failure_reason}</p>
        )}
      </div>
    </div>
  );
}
