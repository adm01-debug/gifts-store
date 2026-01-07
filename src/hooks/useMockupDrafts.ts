import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MockupDraft {
  id: string;
  user_id: string;
  product_id: string;
  name: string;
  draft_data: Record<string, any>;
  thumbnail_url: string | null;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export function useMockupDrafts(userId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["mockup-drafts", userId],
    queryFn: async (): Promise<MockupDraft[]> => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("mockup_drafts")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  const saveDraft = useMutation({
    mutationFn: async (input: Omit<MockupDraft, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase.from("mockup_drafts").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["mockup-drafts"] }); toast.success("Rascunho salvo!"); },
  });

  const deleteDraft = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("mockup_drafts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["mockup-drafts"] }); toast.success("Rascunho excluído!"); },
  });

  return { drafts: query.data || [], isLoading: query.isLoading, saveDraft, deleteDraft };
}
