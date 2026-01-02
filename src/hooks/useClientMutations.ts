import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ClientInput {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
}

interface Client extends ClientInput {
  id: string;
  created_at?: string;
  updated_at?: string;
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newClient: ClientInput) => {
      if (!newClient.name || newClient.name.trim().length < 2) {
        throw new Error('Nome do cliente deve ter no mínimo 2 caracteres');
      }

      const { data, error } = await supabase
        .from('clients')
        .insert(newClient)
        .select()
        .single();

      if (error) throw new Error(`Erro ao criar cliente: ${error.message}`);
      return data;
    },
    onMutate: async (newClient) => {
      await queryClient.cancelQueries({ queryKey: ['clients'] });
      const previousClients = queryClient.getQueryData<Client[]>(['clients']);

      if (previousClients) {
        const optimisticClient: Client = {
          id: `temp-${Date.now()}`,
          ...newClient,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        queryClient.setQueryData<Client[]>(['clients'], [...previousClients, optimisticClient]);
      }

      return { previousClients };
    },
    onError: (error: Error, _, context) => {
      if (context?.previousClients) {
        queryClient.setQueryData(['clients'], context.previousClients);
      }
      toast.error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente criado com sucesso!');
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ClientInput> }) => {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(`Erro ao atualizar cliente: ${error.message}`);
      return data;
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['clients'] });
      await queryClient.cancelQueries({ queryKey: ['clients', id] });

      const previousClients = queryClient.getQueryData<Client[]>(['clients']);
      const previousClient = queryClient.getQueryData<Client>(['clients', id]);

      if (previousClients) {
        queryClient.setQueryData<Client[]>(
          ['clients'],
          previousClients.map((c) =>
            c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c
          )
        );
      }

      if (previousClient) {
        queryClient.setQueryData<Client>(
          ['clients', id],
          { ...previousClient, ...updates, updated_at: new Date().toISOString() }
        );
      }

      return { previousClients, previousClient };
    },
    onError: (error: Error, { id }, context) => {
      if (context?.previousClients) {
        queryClient.setQueryData(['clients'], context.previousClients);
      }
      if (context?.previousClient) {
        queryClient.setQueryData(['clients', id], context.previousClient);
      }
      toast.error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente atualizado!');
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw new Error(`Erro ao deletar cliente: ${error.message}`);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['clients'] });
      const previousClients = queryClient.getQueryData<Client[]>(['clients']);

      if (previousClients) {
        queryClient.setQueryData<Client[]>(
          ['clients'],
          previousClients.filter((c) => c.id !== id)
        );
      }

      return { previousClients };
    },
    onError: (error: Error, _, context) => {
      if (context?.previousClients) {
        queryClient.setQueryData(['clients'], context.previousClients);
      }
      toast.error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente deletado!');
    },
  });
}
