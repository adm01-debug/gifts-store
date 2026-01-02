import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Supplier {
  id: string;
  name: string;
  cnpj?: string;
  email?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SupplierInput {
  name: string;
  cnpj?: string;
  email?: string;
  phone?: string;
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSupplier: SupplierInput) => {
      if (!newSupplier.name || newSupplier.name.trim().length < 3) {
        throw new Error('Nome do fornecedor deve ter no mínimo 3 caracteres');
      }

      const { data, error } = await supabase
        .from('suppliers')
        .insert(newSupplier)
        .select()
        .single();

      if (error) throw new Error(`Erro ao criar fornecedor: ${error.message}`);
      return data;
    },
    onMutate: async (newSupplier) => {
      await queryClient.cancelQueries({ queryKey: ['suppliers'] });
      const previousSuppliers = queryClient.getQueryData<Supplier[]>(['suppliers']);

      if (previousSuppliers) {
        const optimisticSupplier: Supplier = {
          id: `temp-${Date.now()}`,
          ...newSupplier,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        queryClient.setQueryData<Supplier[]>(['suppliers'], [...previousSuppliers, optimisticSupplier]);
      }

      return { previousSuppliers };
    },
    onError: (error: Error, _, context) => {
      if (context?.previousSuppliers) {
        queryClient.setQueryData(['suppliers'], context.previousSuppliers);
      }
      toast.error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Fornecedor criado!');
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SupplierInput> }) => {
      const { data, error } = await supabase
        .from('suppliers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(`Erro ao atualizar fornecedor: ${error.message}`);
      return data;
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['suppliers'] });
      const previousSuppliers = queryClient.getQueryData<Supplier[]>(['suppliers']);

      if (previousSuppliers) {
        queryClient.setQueryData<Supplier[]>(
          ['suppliers'],
          previousSuppliers.map((s) =>
            s.id === id ? { ...s, ...updates, updated_at: new Date().toISOString() } : s
          )
        );
      }

      return { previousSuppliers };
    },
    onError: (error: Error, _, context) => {
      if (context?.previousSuppliers) {
        queryClient.setQueryData(['suppliers'], context.previousSuppliers);
      }
      toast.error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Fornecedor atualizado!');
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('suppliers').delete().eq('id', id);
      if (error) throw new Error(`Erro ao deletar fornecedor: ${error.message}`);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['suppliers'] });
      const previousSuppliers = queryClient.getQueryData<Supplier[]>(['suppliers']);

      if (previousSuppliers) {
        queryClient.setQueryData<Supplier[]>(
          ['suppliers'],
          previousSuppliers.filter((s) => s.id !== id)
        );
      }

      return { previousSuppliers };
    },
    onError: (error: Error, _, context) => {
      if (context?.previousSuppliers) {
        queryClient.setQueryData(['suppliers'], context.previousSuppliers);
      }
      toast.error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Fornecedor deletado!');
    },
  });
}
