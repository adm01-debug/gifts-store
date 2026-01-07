import { useQuery } from "@tanstack/react-query";

// DESABILITADO: tabela 'suppliers' não existe no Supabase
// Fornecedores vêm do campo products.supplier_name

interface Supplier {
  id: string;
  name: string;
}

export function useSuppliers() {
  const query = useQuery({
    queryKey: ["suppliers"],
    queryFn: async (): Promise<Supplier[]> => {
      console.warn("useSuppliers: tabela não existe. Use products.supplier_name");
      return [];
    },
    staleTime: Infinity,
  });

  return {
    suppliers: query.data || [],
    isLoading: false,
    error: null,
  };
}
