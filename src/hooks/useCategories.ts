import { useQuery } from "@tanstack/react-query";

// DESABILITADO: tabela 'categories' não existe no Supabase
// Categorias vêm do campo products.category_name

interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
}

export function useCategories() {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      // Retorna array vazio - categorias devem ser extraídas de products.category_name
      console.warn("useCategories: tabela 'categories' não existe. Use products.category_name");
      return [];
    },
    staleTime: Infinity,
  });

  return {
    categories: query.data || [],
    isLoading: false,
    error: null,
  };
}
