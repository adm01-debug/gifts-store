// ============================================
// COMPONENTE: TIMELINE DE AUDITORIA
// Visualização cronológica de alterações
// ============================================

import { Clock, User, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAuditTrail, AuditLog } from '@/hooks/useAuditTrail';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

interface AuditTimelineProps {
  tableName?: string;
  recordId?: string;
}

const operationColors = {
  INSERT: 'bg-green-100 text-green-800 border-green-200',
  UPDATE: 'bg-blue-100 text-blue-800 border-blue-200',
  DELETE: 'bg-red-100 text-red-800 border-red-200',
  RESTORE: 'bg-purple-100 text-purple-800 border-purple-200',
};

const operationLabels = {
  INSERT: 'Criado',
  UPDATE: 'Atualizado',
  DELETE: 'Deletado',
  RESTORE: 'Restaurado',
};

export function AuditTimeline({ tableName, recordId }: AuditTimelineProps) {
  const { data: logs, isLoading } = useAuditTrail({ tableName, recordId });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Nenhuma atividade registrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {logs.map((log, index) => (
        <div key={log.id} className="relative">
          {/* Linha conectora */}
          {index < logs.length - 1 && (
            <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-border" />
          )}

          {/* Item da timeline */}
          <div className="flex gap-4">
            {/* Ícone */}
            <div className={`flex-shrink-0 h-10 w-10 rounded-full border-2 flex items-center justify-center ${operationColors[log.operation]}`}>
              <Activity className="h-5 w-5" />
            </div>

            {/* Conteúdo */}
            <Card className="flex-1">
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Badge variant="secondary" className={operationColors[log.operation]}>
                      {operationLabels[log.operation]}
                    </Badge>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {format(new Date(log.changed_at), "dd/MM/yyyy 'às' HH:mm", {
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                  </div>
                  {log.changed_by && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{log.changed_by}</span>
                    </div>
                  )}
                </div>

                {/* Mudanças */}
                {log.operation === 'UPDATE' && log.old_data && log.new_data && (
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">Alterações:</p>
                    {Object.keys(log.new_data).map((key) => {
                      const oldValue = log.old_data?.[key];
                      const newValue = log.new_data?.[key];
                      
                      if (oldValue === newValue) return null;
                      if (key === 'updated_at' || key === 'id') return null;

                      return (
                        <div key={key} className="pl-4 border-l-2 border-muted">
                          <p className="text-muted-foreground text-xs uppercase">{key}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-red-600 line-through">
                              {String(oldValue || '-')}
                            </span>
                            <span>→</span>
                            <span className="text-green-600 font-medium">
                              {String(newValue || '-')}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Dados para INSERT */}
                {log.operation === 'INSERT' && log.new_data && (
                  <div className="text-sm">
                    <p className="font-medium mb-2">Dados iniciais:</p>
                    <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                      {JSON.stringify(log.new_data, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Dados para DELETE */}
                {log.operation === 'DELETE' && log.old_data && (
                  <div className="text-sm">
                    <p className="font-medium mb-2">Dados removidos:</p>
                    <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                      {JSON.stringify(log.old_data, null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ))}
    </div>
  );
}
