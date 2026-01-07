import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ProductComponent {
  id: string;
  product_id: string;
  component_name: string;
  component_code: string;
  is_personalizable: boolean;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type CreateComponentInput = Omit<ProductComponent, "id" | "created_at" | "updated_at">;

export function useProductComponents(productId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["product-components", productId],
    queryFn: async (): Promise<ProductComponent[]> => {
      let q = supabase
        .from("product_components")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (productId) {
        q = q.eq("product_id", productId);
      }

      const { data, error } = await q;

      if (error) {
        console.error("Erro ao buscar componentes:", error);
        throw error;
      }

      return data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const createComponent = useMutation({
    mutationFn: async (input: CreateComponentInput) => {
      const { data, error } = await supabase
        .from("product_components")
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-components"] });
      toast.success("Componente criado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar componente");
      console.error(error);
    },
  });

  const updateComponent = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ProductComponent> }) => {
      const { data, error } = await supabase
        .from("product_components")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-components"] });
      toast.success("Componente atualizado!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar componente");
      console.error(error);
    },
  });

  const deleteComponent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("product_components")
        .update({ is_active: false })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-components"] });
      toast.success("Componente removido!");
    },
    onError: (error) => {
      toast.error("Erro ao remover componente");
      console.error(error);
    },
  });

  return {
    components: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    createComponent,
    updateComponent,
    deleteComponent,
  };
}
