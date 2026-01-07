/**
 * Hook de Mutações de Clientes - CORRIGIDO
 * Usa tabela bitrix_clients em vez de clients
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ClientInput {
  company_name?: string;
  trading_name?: string;
  name?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  cnpj?: string;
  cpf?: string;
  notes?: string;
  address_street?: string;
  address_city?: string;
  address_state?: string;
  address_zipcode?: string;
}

interface Client extends ClientInput {
  id: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newClient: ClientInput) => {
      // Validação
      const name = newClient.trading_name || newClient.company_name || newClient.name;
      if (!name || name.trim().length < 2) {
        throw new Error('Nome do cliente deve ter no mínimo 2 caracteres');
      }

      // Preparar dados para bitrix_clients
      const clientData = {
        company_name: newClient.company_name || newClient.name,
        trading_name: newClient.trading_name || newClient.name,
        email: newClient.email,
        phone: newClient.phone,
        mobile: newClient.mobile,
        cnpj: newClient.cnpj,
        cpf: newClient.cpf,
        notes: newClient.notes,
        address_street: newClient.address_street,
        address_city: newClient.address_city,
        address_state: newClient.address_state,
        address_zipcode: newClient.address_zipcode,
        is_active: true,
      };

      const { data, error } = await supabase
        .from('bitrix_clients')  // CORRIGIDO: era 'clients'
        .insert(clientData)
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
          is_active: true,
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
        .from('bitrix_clients')  // CORRIGIDO: era 'clients'
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
      // Soft delete - apenas marca como inativo
      const { error } = await supabase
        .from('bitrix_clients')  // CORRIGIDO: era 'clients'
        .update({ is_active: false })
        .eq('id', id);
        
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
      toast.success('Cliente removido!');
    },
  });
}
