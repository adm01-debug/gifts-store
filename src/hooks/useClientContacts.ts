import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ClientContact {
  id: string;
  client_id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: string;
  is_primary: boolean;
  is_active: boolean;
  notes?: string;
  created_at: string;
}

export function useClientContacts(clientId?: string) {
  const queryClient = useQueryClient();

  const contactsQuery = useQuery({
    queryKey: ["client-contacts", clientId],
    queryFn: async () => {
      if (!clientId) return [];
      
      const { data, error } = await supabase
        .from("client_contacts")
        .select("*")
        .eq("client_id", clientId)
        .eq("is_active", true)
        .order("is_primary", { ascending: false });

      if (error) {
        console.error("Erro ao buscar contatos:", error);
        return [];
      }
      return data as ClientContact[];
    },
    enabled: !!clientId,
  });

  const createContact = useMutation({
    mutationFn: async (contact: Partial<ClientContact>) => {
      const { data, error } = await supabase
        .from("client_contacts")
        .insert({ ...contact, client_id: clientId })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-contacts", clientId] });
      toast.success("Contato adicionado!");
    },
  });

  const updateContact = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ClientContact> & { id: string }) => {
      const { data, error } = await supabase
        .from("client_contacts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-contacts", clientId] });
      toast.success("Contato atualizado!");
    },
  });

  const setPrimaryContact = useMutation({
    mutationFn: async (contactId: string) => {
      await supabase
        .from("client_contacts")
        .update({ is_primary: false })
        .eq("client_id", clientId);
      
      const { error } = await supabase
        .from("client_contacts")
        .update({ is_primary: true })
        .eq("id", contactId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-contacts", clientId] });
      toast.success("Contato principal definido!");
    },
  });

  return {
    contacts: contactsQuery.data || [],
    primaryContact: contactsQuery.data?.find(c => c.is_primary),
    isLoading: contactsQuery.isLoading,
    createContact,
    updateContact,
    setPrimaryContact,
    refetch: contactsQuery.refetch,
  };
}
