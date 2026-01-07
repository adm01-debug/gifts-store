import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface ClientNote {
  id: string;
  client_id: string;
  user_id: string;
  title?: string;
  content: string;
  note_type: "general" | "meeting" | "call" | "email" | "task";
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  author?: {
    full_name: string;
    avatar_url?: string;
  };
}

export function useClientNotes(clientId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const notesQuery = useQuery({
    queryKey: ["client-notes", clientId],
    queryFn: async () => {
      if (!clientId) return [];
      
      const { data, error } = await supabase
        .from("client_notes")
        .select(`
          *,
          author:profiles(full_name, avatar_url)
        `)
        .eq("client_id", clientId)
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar notas:", error);
        return [];
      }
      return data as ClientNote[];
    },
    enabled: !!clientId,
  });

  const createNote = useMutation({
    mutationFn: async (note: Partial<ClientNote>) => {
      const { data, error } = await supabase
        .from("client_notes")
        .insert({ 
          ...note, 
          client_id: clientId,
          user_id: user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-notes", clientId] });
      toast.success("Nota adicionada!");
    },
  });

  const updateNote = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ClientNote> & { id: string }) => {
      const { data, error } = await supabase
        .from("client_notes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-notes", clientId] });
      toast.success("Nota atualizada!");
    },
  });

  const togglePin = useMutation({
    mutationFn: async ({ noteId, isPinned }: { noteId: string; isPinned: boolean }) => {
      const { error } = await supabase
        .from("client_notes")
        .update({ is_pinned: !isPinned })
        .eq("id", noteId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-notes", clientId] });
    },
  });

  const deleteNote = useMutation({
    mutationFn: async (noteId: string) => {
      const { error } = await supabase
        .from("client_notes")
        .delete()
        .eq("id", noteId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-notes", clientId] });
      toast.success("Nota removida!");
    },
  });

  return {
    notes: notesQuery.data || [],
    pinnedNotes: notesQuery.data?.filter(n => n.is_pinned) || [],
    isLoading: notesQuery.isLoading,
    createNote,
    updateNote,
    togglePin,
    deleteNote,
    refetch: notesQuery.refetch,
  };
}
