import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useQuoteApproval() {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateApprovalLink = async (
    quoteId: string,
    expirationDays: number = 30
  ): Promise<string | null> => {
    if (!user) {
      toast.error("Usuário não autenticado");
      return null;
    }

    setIsGenerating(true);
    try {
      // Generate a unique token
      const token = crypto.randomUUID() + crypto.randomUUID().replace(/-/g, "");
      
      // Calculate expiration date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expirationDays);

      // Insert token into database
      const { error } = await supabase.from("quote_approval_tokens").insert({
        quote_id: quoteId,
        token,
        expires_at: expiresAt.toISOString(),
        created_by: user.id,
      });

      if (error) throw error;

      // Generate the public URL
      const baseUrl = window.location.origin;
      const approvalUrl = `${baseUrl}/aprovar-orcamento?token=${token}`;

      toast.success("Link de aprovação gerado!");
      return approvalUrl;
    } catch (err) {
      console.error("Error generating approval link:", err);
      toast.error("Erro ao gerar link de aprovação");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Link copiado para a área de transferência!");
    } catch (err) {
      toast.error("Erro ao copiar link");
    }
  };

  return {
    generateApprovalLink,
    copyToClipboard,
    isGenerating,
  };
}
