import { useQuery } from "@tanstack/react-query";

// DESABILITADO: tabela 'color_variations' não existe no Supabase
// Cores vêm do campo products.colors (jsonb)

interface ColorVariation {
  id: string;
  name: string;
  hex: string;
}

export function useColors() {
  const query = useQuery({
    queryKey: ["colors"],
    queryFn: async (): Promise<ColorVariation[]> => {
      // Retorna array vazio - cores devem ser extraídas de products.colors
      console.warn("useColors: tabela 'color_variations' não existe. Use products.colors");
      return [];
    },
    staleTime: Infinity,
  });

  return {
    colors: query.data || [],
    isLoading: false,
    error: null,
  };
}
