// src/components/admin/AuditLogViewer.tsx

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDateTime } from '@/lib/date-utils';

interface AuditLogEntry {
  id: string;
  table_name: string;
  record_id: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  old_values: any;
  new_values: any;
  changed_fields: string[];
  user_email: string;
  created_at: string;
}

export function AuditLogViewer({ tableName, recordId }: { tableName?: string; recordId?: string }) {
  const [filters, setFilters] = useState({
    table: tableName || 'all',
    action: 'all'
  });

  const { data: logs, isLoading } = useQuery({
    queryKey: ['audit-log', filters, recordId],
    queryFn: async () => {
      let query = supabase
        .from('audit_log')
        .select('*, user:auth.users!user_id(email)')
        .order('created_at', { ascending: false })
        .limit(100);

      if (recordId) {
        query = query.eq('record_id', recordId);
      }
      if (filters.table !== 'all') {
        query = query.eq('table_name', filters.table);
      }
      if (filters.action !== 'all') {
        query = query.eq('action', filters.action);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as AuditLogEntry[];
    }
  });

  const getActionBadge = (action: string) => {
    const variants: Record<string, any> = {
      INSERT: 'default',
      UPDATE: 'secondary',
      DELETE: 'destructive'
    };
    return <Badge variant={variants[action]}>{action}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Auditoria</CardTitle>
        <CardDescription>
          Registro de todas as alterações realizadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : (
            <div className="space-y-4">
              {logs?.map((log) => (
                <div key={log.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getActionBadge(log.action)}
                      <span className="text-sm font-medium">{log.table_name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(new Date(log.created_at))}
                    </span>
                  </div>

                  <div className="text-sm">
                    <p className="text-muted-foreground">
                      Por: {log.user_email || 'Sistema'}
                    </p>

                    {log.action === 'UPDATE' && log.changed_fields && (
                      <div className="mt-2">
                        <p className="font-medium text-xs mb-1">Campos alterados:</p>
                        <div className="flex flex-wrap gap-1">
                          {log.changed_fields.map((field) => (
                            <Badge key={field} variant="outline" className="text-xs">
                              {field}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {logs?.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhum registro de auditoria encontrado
                </p>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
