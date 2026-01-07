/**
 * Hook de Audit Trail - CORRIGIDO
 * Usa tabela audit_log em vez de audit_logs (sem 's')
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type AuditOperation = 'INSERT' | 'UPDATE' | 'DELETE' | 'RESTORE';

export interface AuditLog {
  id: string;
  table_name: string;
  record_id: string;
  operation: AuditOperation;
  old_data: Record<string, any> | null;
  new_data: Record<string, any> | null;
  changed_by: string | null;
  changed_at: string;
  ip_address: string | null;
  user_agent: string | null;
}

export interface AuditFilters {
  tableName?: string;
  recordId?: string;
  operation?: AuditOperation;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

export function useAuditTrail(filters?: AuditFilters) {
  return useQuery<AuditLog[]>({
    queryKey: ['audit-trail', filters],
    queryFn: async () => {
      let query = supabase
        .from('quote_history')  // CORRIGIDO: era 'audit_logs'
        .select('*')
        .order('changed_at', { ascending: false });

      // Aplicar filtros
      if (filters?.tableName) {
        query = query.eq('table_name', filters.tableName);
      }

      if (filters?.recordId) {
        query = query.eq('record_id', filters.recordId);
      }

      if (filters?.operation) {
        query = query.eq('operation', filters.operation);
      }

      if (filters?.userId) {
        query = query.eq('changed_by', filters.userId);
      }

      if (filters?.startDate) {
        query = query.gte('changed_at', filters.startDate);
      }

      if (filters?.endDate) {
        query = query.lte('changed_at', filters.endDate);
      }

      const { data, error } = await query.limit(100);

      if (error) {
        console.warn('Erro ao buscar histórico de auditoria:', error.message);
        return [];
      }
      return data as AuditLog[];
    },
    staleTime: 10 * 1000, // 10 segundos
  });
}

// Hook específico para histórico de um registro
export function useRecordHistory(tableName: string, recordId: string) {
  return useAuditTrail({ tableName, recordId });
}

// Hook para atividades recentes
export function useRecentActivity(limit = 20) {
  return useQuery<AuditLog[]>({
    queryKey: ['recent-activity', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quote_history')  // CORRIGIDO: era 'audit_logs'
        .select('*')
        .order('changed_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.warn('Erro ao buscar atividades recentes:', error.message);
        return [];
      }
      return data as AuditLog[];
    },
    staleTime: 5 * 1000,
    refetchInterval: 30 * 1000, // Atualiza a cada 30s
  });
}
