import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface OrderHistoryEntry {
  id: string;
  order_id: string;
  user_id: string;
  action: string;
  description: string | null;
  old_value: string | null;
  new_value: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
}

export function useOrderHistory(orderId?: string) {
  const query = useQuery({
    queryKey: ["order-history", orderId],
    queryFn: async (): Promise<OrderHistoryEntry[]> => {
      if (!orderId) return [];

      const { data, error } = await supabase
        .from("order_history")
        .select("*")
        .eq("order_id", orderId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar histórico do pedido:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!orderId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  return {
    history: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
