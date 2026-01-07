import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProductSyncLog {
  id: string;
  source: string;
  sync_type: string;
  status: string;
  products_processed: number;
  products_created: number;
  products_updated: number;
  products_failed: number;
  error_details: Record<string, any> | null;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

export function useProductSyncLogs(limit = 50) {
  const query = useQuery({
    queryKey: ["product-sync-logs", limit],
    queryFn: async (): Promise<ProductSyncLog[]> => {
      const { data, error } = await supabase.from("product_sync_logs").select("*").order("started_at", { ascending: false }).limit(limit);
      if (error) throw error;
      return data || [];
    },
  });

  const lastSync = query.data?.[0];
  const failedSyncs = query.data?.filter((s) => s.status === "failed") || [];

  return { logs: query.data || [], lastSync, failedSyncs, isLoading: query.isLoading };
}
