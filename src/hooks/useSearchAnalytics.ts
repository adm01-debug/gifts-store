import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SearchAnalytics {
  id: string;
  user_id: string | null;
  search_term: string;
  results_count: number;
  clicked_product_id: string | null;
  search_filters: Record<string, any> | null;
  session_id: string | null;
  created_at: string;
}

export function useSearchAnalytics() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["search-analytics"],
    queryFn: async (): Promise<SearchAnalytics[]> => {
      const { data, error } = await supabase.from("search_analytics").select("*").order("created_at", { ascending: false }).limit(100);
      if (error) throw error;
      return data || [];
    },
  });

  const logSearch = useMutation({
    mutationFn: async (input: Omit<SearchAnalytics, "id" | "created_at">) => {
      const { data, error } = await supabase.from("search_analytics").insert(input).select().single();
      if (error) throw error;
      return data;
    },
  });

  const topSearches = query.data?.reduce((acc, s) => {
    acc[s.search_term] = (acc[s.search_term] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return { analytics: query.data || [], topSearches, isLoading: query.isLoading, logSearch };
}
