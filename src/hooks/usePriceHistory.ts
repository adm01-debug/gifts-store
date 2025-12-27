import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function usePriceHistory(productId: string) {
  return useQuery({
    queryKey: ['price-history', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_price_history')
        .select('*')
        .eq('product_id', productId)
        .order('changed_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!productId
  });
}
