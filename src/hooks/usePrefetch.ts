import { useQueryClient } from '@tanstack/react-query';

export function usePrefetch() {
  const queryClient = useQueryClient();

  const prefetchProduct = (productId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['product', productId],
      queryFn: async () => {
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
        return data;
      }
    });
  };

  const prefetchQuote = (quoteId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['quote', quoteId],
      queryFn: async () => {
        const { data } = await supabase
          .from('quotes')
          .select('*, items:quote_items(*)')
          .eq('id', quoteId)
          .single();
        return data;
      }
    });
  };

  const prefetchClient = (clientId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['client', clientId],
      queryFn: async () => {
        const { data } = await supabase
          .from('bitrix_clients')
          .select('*')
          .eq('id', clientId)
          .single();
        return data;
      }
    });
  };

  return {
    prefetchProduct,
    prefetchQuote,
    prefetchClient
  };
}
