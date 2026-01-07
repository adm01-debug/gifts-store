import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BitrixSyncLog {
  id: string;
  sync_type: string;
  status: string;
  records_processed: number;
  records_created: number;
  records_updated: number;
  records_failed: number;
  error_message: string | null;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

export function useBitrixSyncLogs(limit = 50) {
  const query = useQuery({
    queryKey: ["bitrix-sync-logs", limit],
    queryFn: async (): Promise<BitrixSyncLog[]> => {
      const { data, error } = await supabase
        .from("bitrix_sync_logs")
        .select("*")
        .order("started_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 2,
  });

  const lastSync = query.data?.[0];
  const failedSyncs = query.data?.filter((s) => s.status === "failed") || [];

  return { logs: query.data || [], lastSync, failedSyncs, isLoading: query.isLoading };
}
