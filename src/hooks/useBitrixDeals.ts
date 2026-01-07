import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface BitrixDeal {
  id: string;
  bitrix_id: string;
  bitrix_client_id: string;
  title: string;
  value: number;
  currency: string;
  stage: string;
  close_date: string | null;
  created_at_bitrix: string | null;
  synced_at: string | null;
  created_at: string;
}

export function useBitrixDeals(clientId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["bitrix-deals", clientId],
    queryFn: async (): Promise<BitrixDeal[]> => {
      let q = supabase
        .from("bitrix_deals")
        .select("*")
        .order("created_at", { ascending: false });

      if (clientId) {
        q = q.eq("bitrix_client_id", clientId);
      }

      const { data, error } = await q;

      if (error) {
        console.error("Erro ao buscar deals:", error);
        throw error;
      }

      return data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const updateDeal = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<BitrixDeal> }) => {
      const { data, error } = await supabase
        .from("bitrix_deals")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bitrix-deals"] });
      toast.success("Negócio atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar negócio");
      console.error(error);
    },
  });

  return {
    deals: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    updateDeal,
  };
}
