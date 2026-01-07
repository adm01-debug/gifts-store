import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// DESABILITADO: tabela 'suppliers' não existe no Supabase

export function useSupplierMutations() {
  const queryClient = useQueryClient();

  const createSupplier = useMutation({
    mutationFn: async (data: any) => {
      console.warn("createSupplier: tabela não existe");
      toast.error("Funcionalidade desabilitada - tabela suppliers não existe");
      throw new Error("Tabela suppliers não existe no Supabase");
    },
  });

  const updateSupplier = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      console.warn("updateSupplier: tabela não existe");
      toast.error("Funcionalidade desabilitada - tabela suppliers não existe");
      throw new Error("Tabela suppliers não existe no Supabase");
    },
  });

  const deleteSupplier = useMutation({
    mutationFn: async (id: string) => {
      console.warn("deleteSupplier: tabela não existe");
      toast.error("Funcionalidade desabilitada - tabela suppliers não existe");
      throw new Error("Tabela suppliers não existe no Supabase");
    },
  });

  return {
    createSupplier,
    updateSupplier,
    deleteSupplier,
  };
}
