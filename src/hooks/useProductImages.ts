import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
  width?: number;
  height?: number;
  file_size?: number;
  created_at: string;
}

export function useProductImages(productId?: string) {
  const queryClient = useQueryClient();

  const imagesQuery = useQuery({
    queryKey: ["product-images", productId],
    queryFn: async () => {
      if (!productId) return [];
      
      const { data, error } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", productId)
        .order("sort_order");

      if (error) {
        console.error("Erro ao buscar imagens:", error);
        return [];
      }
      return data as ProductImage[];
    },
    enabled: !!productId,
  });

  const setPrimaryImage = useMutation({
    mutationFn: async (imageId: string) => {
      // Remove primary de todas
      await supabase
        .from("product_images")
        .update({ is_primary: false })
        .eq("product_id", productId);
      
      // Define nova primary
      const { error } = await supabase
        .from("product_images")
        .update({ is_primary: true })
        .eq("id", imageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-images", productId] });
      toast.success("Imagem principal definida!");
    },
  });

  const deleteImage = useMutation({
    mutationFn: async (imageId: string) => {
      const { error } = await supabase
        .from("product_images")
        .delete()
        .eq("id", imageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-images", productId] });
      toast.success("Imagem removida!");
    },
  });

  const reorderImages = useMutation({
    mutationFn: async (orderedIds: string[]) => {
      const updates = orderedIds.map((id, index) => 
        supabase.from("product_images").update({ sort_order: index }).eq("id", id)
      );
      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-images", productId] });
    },
  });

  return {
    images: imagesQuery.data || [],
    primaryImage: imagesQuery.data?.find(img => img.is_primary),
    isLoading: imagesQuery.isLoading,
    setPrimaryImage,
    deleteImage,
    reorderImages,
    refetch: imagesQuery.refetch,
  };
}
