import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useQuoteComments(quoteId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['quote-comments', quoteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quote_history')
        .select('*, user:user_id(email, id)')
        .eq('quote_id', quoteId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!quoteId
  });

  const addComment = useMutation({
    mutationFn: async (content: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { error } = await supabase
        .from('quote_history')
        .insert({
          quote_id: quoteId,
          user_id: user.id,
          content
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quote-comments', quoteId] });
      toast({
        title: 'Comentário adicionado',
        description: 'Seu comentário foi publicado com sucesso'
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao adicionar comentário',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  return { 
    comments, 
    isLoading, 
    addComment: addComment.mutate,
    isAddingComment: addComment.isPending
  };
}
