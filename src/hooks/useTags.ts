import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  usage_count: number;
  is_active: boolean;
  created_at: string;
}

export function useTags() {
  const queryClient = useQueryClient();

  const tagsQuery = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) {
        console.error("Erro ao buscar tags:", error);
        return [];
      }
      return data as Tag[];
    },
  });

  const popularTagsQuery = useQuery({
    queryKey: ["tags", "popular"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .eq("is_active", true)
        .order("usage_count", { ascending: false })
        .limit(20);

      if (error) return [];
      return data as Tag[];
    },
  });

  const createTag = useMutation({
    mutationFn: async (tag: Partial<Tag>) => {
      const slug = tag.name?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const { data, error } = await supabase
        .from("tags")
        .insert({ ...tag, slug })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag criada!");
    },
  });

  const searchTags = async (query: string): Promise<Tag[]> => {
    const { data, error } = await supabase
      .from("tags")
      .select("*")
      .eq("is_active", true)
      .ilike("name", `%${query}%`)
      .limit(10);

    if (error) return [];
    return data as Tag[];
  };

  return {
    tags: tagsQuery.data || [],
    popularTags: popularTagsQuery.data || [],
    isLoading: tagsQuery.isLoading,
    createTag,
    searchTags,
    refetch: tagsQuery.refetch,
  };
}
