import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ProductVariant {
  id: string;
  product_id: string;
  sku?: string;
  name: string;
  color_variation_id?: string;
  size?: string;
  price_adjustment: number;
  stock_quantity: number;
  is_active: boolean;
  attributes?: Record<string, unknown>;
  created_at: string;
  color?: {
    id: string;
    name: string;
    hex_code: string;
  };
}

export function useProductVariants(productId?: string) {
  const queryClient = useQueryClient();

  const variantsQuery = useQuery({
    queryKey: ["product-variants", productId],
    queryFn: async () => {
      if (!productId) return [];
      
      const { data, error } = await supabase
        .from("product_variants")
        .select(`
          *,
          color:color_variations(id, name, hex_code)
        `)
        .eq("product_id", productId)
        .eq("is_active", true)
        .order("name");

      if (error) {
        console.error("Erro ao buscar variantes:", error);
        return [];
      }
      return data as ProductVariant[];
    },
    enabled: !!productId,
  });

  const createVariant = useMutation({
    mutationFn: async (variant: Partial<ProductVariant>) => {
      const { data, error } = await supabase
        .from("product_variants")
        .insert({ ...variant, product_id: productId })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-variants", productId] });
      toast.success("Variante criada!");
    },
  });

  const updateVariant = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProductVariant> & { id: string }) => {
      const { data, error } = await supabase
        .from("product_variants")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-variants", productId] });
      toast.success("Variante atualizada!");
    },
  });

  const updateStock = useMutation({
    mutationFn: async ({ variantId, quantity }: { variantId: string; quantity: number }) => {
      const { error } = await supabase
        .from("product_variants")
        .update({ stock_quantity: quantity })
        .eq("id", variantId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-variants", productId] });
      toast.success("Estoque atualizado!");
    },
  });

  return {
    variants: variantsQuery.data || [],
    isLoading: variantsQuery.isLoading,
    totalStock: variantsQuery.data?.reduce((sum, v) => sum + v.stock_quantity, 0) || 0,
    createVariant,
    updateVariant,
    updateStock,
    refetch: variantsQuery.refetch,
  };
}
