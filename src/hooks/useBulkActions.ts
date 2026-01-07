import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';
import { LucideIcon } from 'lucide-react';

type TableName = keyof Database['public']['Tables'];

interface BulkActionConfig {
  tableName: TableName;
  queryKey: string[];
}

interface BulkDeleteOptions {
  permanent?: boolean;
}

// Interface for bulk action buttons used in BulkActionsBar
export interface BulkAction<T = unknown> {
  id: string;
  label: string;
  icon?: LucideIcon;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  confirm?: {
    title: string;
    description: string;
  };
}

export const useBulkActions = (config: BulkActionConfig) => {
  const { tableName, queryKey } = config;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Bulk Delete (Soft)
  const bulkDelete = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from(tableName)
        .update({ deleted_at: new Date().toISOString() })
        .in('id', ids);

      if (error) throw error;
      return ids;
    },
    onSuccess: (ids) => {
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: 'Registros deletados',
        description: `${ids.length} registro(s) movido(s) para a lixeira`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao deletar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Bulk Restore
  const bulkRestore = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from(tableName)
        .update({ deleted_at: null })
        .in('id', ids);

      if (error) throw error;
      return ids;
    },
    onSuccess: (ids) => {
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: 'Registros restaurados',
        description: `${ids.length} registro(s) restaurado(s) com sucesso`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao restaurar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Bulk Delete Permanent
  const bulkDeletePermanent = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .in('id', ids);

      if (error) throw error;
      return ids;
    },
    onSuccess: (ids) => {
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: 'Registros deletados permanentemente',
        description: `${ids.length} registro(s) deletado(s) permanentemente`,
        variant: 'destructive',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao deletar permanentemente',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Bulk Duplicate
  const bulkDuplicate = useMutation({
    mutationFn: async (ids: string[]) => {
      // Buscar registros originais
      const { data: records, error: fetchError } = await supabase
        .from(tableName)
        .select('*')
        .in('id', ids);

      if (fetchError) throw fetchError;
      if (!records || records.length === 0) {
        throw new Error('Nenhum registro encontrado');
      }

      // Duplicar cada registro
      const duplicates = records.map((record: any) => {
        const { id, created_at, updated_at, deleted_at, ...rest } = record;
        return {
          ...rest,
          // Adicionar sufixo ao nome se existir
          ...(rest.name && { name: `${rest.name} (Cópia)` }),
        };
      });

      const { data, error: insertError } = await supabase
        .from(tableName)
        .insert(duplicates)
        .select();

      if (insertError) throw insertError;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: 'Registros duplicados',
        description: `${data.length} registro(s) duplicado(s) com sucesso`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao duplicar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Bulk Update
  const bulkUpdate = useMutation({
    mutationFn: async ({ ids, updates }: { ids: string[]; updates: Record<string, any> }) => {
      const { error } = await supabase
        .from(tableName)
        .update(updates)
        .in('id', ids);

      if (error) throw error;
      return ids;
    },
    onSuccess: (ids, variables) => {
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: 'Registros atualizados',
        description: `${ids.length} registro(s) atualizado(s) com sucesso`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao atualizar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    bulkDelete: bulkDelete.mutate,
    bulkRestore: bulkRestore.mutate,
    bulkDeletePermanent: bulkDeletePermanent.mutate,
    bulkDuplicate: bulkDuplicate.mutate,
    bulkUpdate: bulkUpdate.mutate,
    isLoading:
      bulkDelete.isPending ||
      bulkRestore.isPending ||
      bulkDeletePermanent.isPending ||
      bulkDuplicate.isPending ||
      bulkUpdate.isPending,
  };
};
