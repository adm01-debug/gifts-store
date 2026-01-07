import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export interface QuoteApprovalToken {
  id: string;
  quote_id: string;
  token: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
  created_by: string;
}

export function useQuoteApproval(quoteId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["quote-approval-tokens", quoteId],
    queryFn: async (): Promise<QuoteApprovalToken[]> => {
      if (!quoteId) return [];

      const { data, error } = await supabase
        .from("quote_approval_tokens")
        .select("*")
        .eq("quote_id", quoteId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar tokens de aprovação:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!quoteId,
    staleTime: 1000 * 60 * 2,
  });

  const generateToken = useMutation({
    mutationFn: async ({ quoteId, userId, expiresInDays = 7 }: { 
      quoteId: string; 
      userId: string; 
      expiresInDays?: number 
    }) => {
      const token = uuidv4();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);

      const { data, error } = await supabase
        .from("quote_approval_tokens")
        .insert({
          quote_id: quoteId,
          token,
          expires_at: expiresAt.toISOString(),
          created_by: userId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quote-approval-tokens"] });
      toast.success("Link de aprovação gerado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao gerar link de aprovação");
      console.error(error);
    },
  });

  const validateToken = useMutation({
    mutationFn: async (token: string) => {
      const { data, error } = await supabase
        .from("quote_approval_tokens")
        .select("*, quotes(*)")
        .eq("token", token)
        .is("used_at", null)
        .gt("expires_at", new Date().toISOString())
        .single();

      if (error) throw error;
      return data;
    },
    onError: (error) => {
      toast.error("Token inválido ou expirado");
      console.error(error);
    },
  });

  const useToken = useMutation({
    mutationFn: async (token: string) => {
      const { data, error } = await supabase
        .from("quote_approval_tokens")
        .update({ used_at: new Date().toISOString() })
        .eq("token", token)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quote-approval-tokens"] });
    },
  });

  const activeToken = query.data?.find(
    (t) => !t.used_at && new Date(t.expires_at) > new Date()
  );

  return {
    tokens: query.data || [],
    activeToken,
    isLoading: query.isLoading,
    error: query.error,
    generateToken,
    validateToken,
    useToken,
  };
}
