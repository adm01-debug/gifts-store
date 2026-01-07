import { useQuery } from "@tanstack/react-query";

// DESABILITADO: tabela 'product_price_history' não existe no Supabase

interface PriceHistory {
  id: string;
  product_id: string;
  price: number;
  created_at: string;
}

export function usePriceHistory(productId?: string) {
  const query = useQuery({
    queryKey: ["price-history", productId],
    queryFn: async (): Promise<PriceHistory[]> => {
      console.warn("usePriceHistory: tabela não existe no Supabase");
      return [];
    },
    enabled: !!productId,
    staleTime: Infinity,
  });

  return {
    priceHistory: query.data || [],
    isLoading: false,
    error: null,
  };
}
