import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Collection {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  description?: string;
  cover_image_url?: string;
  is_featured: boolean;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  sort_order: number;
  products_count?: number;
  created_at: string;
}

export function useCollections() {
  const queryClient = useQueryClient();

  const collectionsQuery = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collections")
        .select(`
          *,
          products_count:collection_products(count)
        `)
        .eq("is_active", true)
        .order("sort_order");

      if (error) {
        console.error("Erro ao buscar coleções:", error);
        return [];
      }
      return data as Collection[];
    },
  });

  const featuredCollections = useQuery({
    queryKey: ["collections", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("sort_order")
        .limit(6);

      if (error) return [];
      return data as Collection[];
    },
  });

  const createCollection = useMutation({
    mutationFn: async (collection: Partial<Collection>) => {
      const slug = collection.name?.toLowerCase().replace(/\s+/g, "-");
      const { data, error } = await supabase
        .from("collections")
        .insert({ ...collection, slug })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Coleção criada!");
    },
  });

  const addProductToCollection = useMutation({
    mutationFn: async ({ collectionId, productId }: { collectionId: string; productId: string }) => {
      const { error } = await supabase
        .from("collection_products")
        .insert({ collection_id: collectionId, product_id: productId });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Produto adicionado à coleção!");
    },
  });

  return {
    collections: collectionsQuery.data || [],
    featuredCollections: featuredCollections.data || [],
    isLoading: collectionsQuery.isLoading,
    createCollection,
    addProductToCollection,
    refetch: collectionsQuery.refetch,
  };
}
