import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useQuoteVersions(quoteId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: versions, isLoading } = useQuery({
    queryKey: ['quote-versions', quoteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select('*, items:quote_items(count)')
        .or(`id.eq.${quoteId},parent_quote_id.eq.${quoteId}`)
        .order('version', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!quoteId
  });

  const createVersion = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc('create_quote_version', {
        p_quote_id: quoteId
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quote-versions', quoteId] });
      toast({
        title: 'Nova versão criada',
        description: 'O orçamento foi duplicado com sucesso'
      });
    }
  });

  return { 
    versions, 
    isLoading, 
    createVersion: createVersion.mutate,
    isCreating: createVersion.isPending
  };
}
