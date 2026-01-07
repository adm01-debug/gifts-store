import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PersonalizationSize {
  id: string;
  technique_id: string;
  technique_code: string;
  size_label: string;
  width_cm: number;
  height_cm: number;
  area_cm2: number;
  price_modifier: number;
  is_active: boolean;
  created_at: string;
}

export function usePersonalizationSizes(techniqueId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["personalization-sizes", techniqueId],
    queryFn: async (): Promise<PersonalizationSize[]> => {
      let q = supabase
        .from("personalization_sizes")
        .select("*")
        .eq("is_active", true)
        .order("area_cm2", { ascending: true });

      if (techniqueId) {
        q = q.eq("technique_id", techniqueId);
      }

      const { data, error } = await q;

      if (error) {
        console.error("Erro ao buscar tamanhos:", error);
        throw error;
      }

      return data || [];
    },
    staleTime: 1000 * 60 * 10,
  });

  const createSize = useMutation({
    mutationFn: async (input: Omit<PersonalizationSize, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("personalization_sizes")
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personalization-sizes"] });
      toast.success("Tamanho criado!");
    },
    onError: (error) => {
      toast.error("Erro ao criar tamanho");
      console.error(error);
    },
  });

  const updateSize = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PersonalizationSize> }) => {
      const { data, error } = await supabase
        .from("personalization_sizes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personalization-sizes"] });
      toast.success("Tamanho atualizado!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar tamanho");
      console.error(error);
    },
  });

  return {
    sizes: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createSize,
    updateSize,
  };
}
