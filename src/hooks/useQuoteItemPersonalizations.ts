import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface QuoteItemPersonalization {
  id: string;
  quote_item_id: string;
  technique_id: string;
  colors_count: number;
  positions_count: number;
  area_cm2: number | null;
  setup_cost: number;
  unit_cost: number;
  total_cost: number;
  notes: string | null;
  created_at: string;
}

export type CreatePersonalizationInput = Omit<QuoteItemPersonalization, "id" | "created_at">;

export function useQuoteItemPersonalizations(quoteItemId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["quote-item-personalizations", quoteItemId],
    queryFn: async (): Promise<QuoteItemPersonalization[]> => {
      if (!quoteItemId) return [];

      const { data, error } = await supabase
        .from("quote_item_personalizations")
        .select("*")
        .eq("quote_item_id", quoteItemId);

      if (error) {
        console.error("Erro ao buscar personalizações:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!quoteItemId,
    staleTime: 1000 * 60 * 2,
  });

  const createPersonalization = useMutation({
    mutationFn: async (input: CreatePersonalizationInput) => {
      const { data, error } = await supabase
        .from("quote_item_personalizations")
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quote-item-personalizations"] });
      toast.success("Personalização adicionada!");
    },
    onError: (error) => {
      toast.error("Erro ao adicionar personalização");
      console.error(error);
    },
  });

  const updatePersonalization = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<QuoteItemPersonalization> }) => {
      const { data, error } = await supabase
        .from("quote_item_personalizations")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quote-item-personalizations"] });
      toast.success("Personalização atualizada!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar personalização");
      console.error(error);
    },
  });

  const deletePersonalization = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("quote_item_personalizations")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quote-item-personalizations"] });
      toast.success("Personalização removida!");
    },
    onError: (error) => {
      toast.error("Erro ao remover personalização");
      console.error(error);
    },
  });

  const totalCost = query.data?.reduce((sum, p) => sum + p.total_cost, 0) || 0;

  return {
    personalizations: query.data || [],
    totalCost,
    isLoading: query.isLoading,
    error: query.error,
    createPersonalization,
    updatePersonalization,
    deletePersonalization,
  };
}
