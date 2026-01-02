import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ============================================
// 1. BUSCA FULLTEXT HOOK
// ============================================
export function useBuscaFulltext<T>(
  supabase: any,
  tabela: string,
  searchTerm: string,
  colunas: string[] = ['*']
) {
  return useQuery({
    queryKey: ['fulltext', tabela, searchTerm],
    queryFn: async () => {
      if (searchTerm.length < 2) return [];
      
      const { data, error } = await supabase
        .from(tabela)
        .select(colunas.join(','))
        .or(
          colunas
            .filter(col => col !== '*')
            .map(col => `${col}.ilike.%${searchTerm}%`)
            .join(',')
        );
      
      if (error) throw error;
      return data as T[];
    },
    enabled: searchTerm.length >= 2,
  });
}

// ============================================
// 2. FILTROS SALVOS HOOK
// ============================================
interface SavedFilter {
  id: string;
  name: string;
  filters: Record<string, any>;
  is_default: boolean;
}

export function useSavedFilters(supabase: any, entityType: string, toast: any) {
  const queryClient = useQueryClient();

  const { data: filters, isLoading } = useQuery({
    queryKey: ['saved-filters', entityType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('saved_filters')
        .select('*')
        .eq('entity_type', entityType)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as SavedFilter[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (filter: Omit<SavedFilter, 'id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('saved_filters')
        .insert({
          user_id: user?.id,
          entity_type: entityType,
          ...filter,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-filters', entityType] });
      toast.success('Filtro salvo com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao salvar filtro');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('saved_filters')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-filters', entityType] });
      toast.success('Filtro removido');
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase
        .from('saved_filters')
        .update({ is_default: false })
        .eq('entity_type', entityType);
      
      const { error } = await supabase
        .from('saved_filters')
        .update({ is_default: true })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-filters', entityType] });
      toast.success('Filtro padrão definido');
    },
  });

  return {
    filters: filters ?? [],
    isLoading,
    saveFilter: saveMutation.mutate,
    deleteFilter: deleteMutation.mutate,
    setDefault: setDefaultMutation.mutate,
  };
}

// ============================================
// 3. DEBOUNCE HOOK
// ============================================
import { useEffect, useState } from 'react';

export function useDebouncedValue<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ============================================
// 4. VERSIONAMENTO HOOK
// ============================================
interface Version {
  id: string;
  version_number: number;
  data: Record<string, any>;
  changed_by: string;
  changed_at: string;
  change_summary: string;
}

export function useVersions(supabase: any, entityType: string, entityId: string) {
  return useQuery({
    queryKey: ['versions', entityType, entityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('entity_versions')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('version_number', { ascending: false });
      
      if (error) throw error;
      return data as Version[];
    },
    enabled: !!entityId,
  });
}

// ============================================
// 5. BULK ACTIONS HOOK
// ============================================
export function useBulkActions(supabase: any, tableName: string, toast: any) {
  const queryClient = useQueryClient();

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from(tableName)
        .update({ deleted_at: new Date().toISOString() })
        .in('id', ids);
      
      if (error) throw error;
    },
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: [tableName] });
      toast.success(`${ids.length} registros excluídos`);
    },
  });

  const bulkRestoreMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from(tableName)
        .update({ deleted_at: null })
        .in('id', ids);
      
      if (error) throw error;
    },
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: [tableName] });
      toast.success(`${ids.length} registros restaurados`);
    },
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ ids, updates }: { ids: string[]; updates: Record<string, any> }) => {
      const { error } = await supabase
        .from(tableName)
        .update(updates)
        .in('id', ids);
      
      if (error) throw error;
    },
    onSuccess: (_, { ids }) => {
      queryClient.invalidateQueries({ queryKey: [tableName] });
      toast.success(`${ids.length} registros atualizados`);
    },
  });

  return {
    bulkDelete: bulkDeleteMutation.mutate,
    bulkRestore: bulkRestoreMutation.mutate,
    bulkUpdate: bulkUpdateMutation.mutate,
  };
}
