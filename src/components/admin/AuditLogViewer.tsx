// src/components/admin/AuditLogViewer.tsx

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDateTime } from '@/lib/date-utils';

interface AuditLogEntry {
  id: string;
  table_name: string;
  record_id: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  old_values: Record<string, unknown>;
  new_values: Record<string, unknown>;
  changed_fields: string[];
  user_email: string;
  created_at: string;
}

// Mock data for audit logs until the audit_log table is created
const mockAuditLogs: AuditLogEntry[] = [];

export function AuditLogViewer({ tableName, recordId }: { tableName?: string; recordId?: string }) {
  const [filters] = useState({
    table: tableName || 'all',
    action: 'all'
  });

  // For now, return mock data since audit_log table doesn't exist yet
  const logs = mockAuditLogs.filter(log => {
    if (recordId && log.record_id !== recordId) return false;
    if (filters.table !== 'all' && log.table_name !== filters.table) return false;
    if (filters.action !== 'all' && log.action !== filters.action) return false;
    return true;
  });

  const isLoading = false;

  const getActionBadge = (action: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      INSERT: 'default',
      UPDATE: 'secondary',
      DELETE: 'destructive'
    };
    return <Badge variant={variants[action] || 'default'}>{action}</Badge>;
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
