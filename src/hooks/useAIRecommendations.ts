import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ClientProfile {
  name: string;
  company?: string;
  industry?: string;
  preferences?: string[];
  purchaseHistory?: string[];
  budget?: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  description?: string;
  priceRange?: string;
  tags?: string[];
}

interface Recommendation {
  productId: string;
  score: number;
  reason: string;
}

interface AIRecommendationResult {
  recommendations: Recommendation[];
  insights: string;
}

export function useAIRecommendations() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIRecommendationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = async (
    client: ClientProfile,
    products: Product[]
  ): Promise<AIRecommendationResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "ai-recommendations",
        {
          body: { client, products },
        }
      );

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        if (data.error.includes("Limite de requisições")) {
          toast.error("Limite de requisições excedido", {
            description: "Aguarde alguns minutos e tente novamente.",
          });
        } else if (data.error.includes("Créditos")) {
          toast.error("Créditos de IA esgotados", {
            description: "Adicione créditos para continuar usando recomendações.",
          });
        } else {
          toast.error("Erro ao gerar recomendações", {
            description: data.error,
          });
        }
        setError(data.error);
        return null;
      }

      setResult(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError(message);
      toast.error("Erro ao gerar recomendações", { description: message });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearRecommendations = () => {
    setResult(null);
    setError(null);
  };

  return {
    getRecommendations,
    clearRecommendations,
    isLoading,
    result,
    error,
  };
}
