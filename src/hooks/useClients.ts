/**
 * Hook de Clientes - CORRIGIDO
 * Usa tabela bitrix_clients em vez de clients
 */
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Client {
  id: string;
  name: string;
  company_name?: string;
  trading_name?: string;
  cnpj?: string;
  cpf?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address_street?: string;
  address_city?: string;
  address_state?: string;
  address_zipcode?: string;
  created_at?: string;
  is_active?: boolean;
}

export function useClients() {
  return useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bitrix_clients')  // CORRIGIDO: era 'clients'
        .select('*')
        .eq('is_active', true)
        .order('company_name');

      if (error) {
        console.warn('Erro ao buscar clientes:', error.message);
        return [];
      }
      
      // Mapear para formato esperado
      return (data || []).map(client => ({
        ...client,
        name: client.trading_name || client.company_name || 'Sem nome',
      }));
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useClient(id: string) {
  return useQuery<Client | null>({
    queryKey: ['clients', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bitrix_clients')  // CORRIGIDO: era 'clients'
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        console.warn('Erro ao buscar cliente:', error.message);
        return null;
      }

      return data ? {
        ...data,
        name: data.trading_name || data.company_name || 'Sem nome',
      } : null;
    },
    enabled: !!id,
  });
}
