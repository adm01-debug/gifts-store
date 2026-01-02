import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SupplierInput {
  name: string;
  cnpj?: string;
  contact?: string;
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Fornecedor criado!');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
