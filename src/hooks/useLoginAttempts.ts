import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LoginAttempt {
  id: string;
  user_id: string | null;
  email: string;
  ip_address: string;
  user_agent: string | null;
  success: boolean;
  failure_reason: string | null;
  created_at: string;
}

export function useLoginAttempts(userId?: string, limit = 50) {
  const query = useQuery({
    queryKey: ["login-attempts", userId, limit],
    queryFn: async (): Promise<LoginAttempt[]> => {
      let q = supabase
        .from("login_attempts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (userId) {
        q = q.eq("user_id", userId);
      }

      const { data, error } = await q;

      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 2,
  });

  const failedAttempts = query.data?.filter((a) => !a.success) || [];
  const recentFailures = failedAttempts.filter(
    (a) => new Date(a.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  );

  return {
    attempts: query.data || [],
    failedAttempts,
    recentFailures,
    isLoading: query.isLoading,
    error: query.error,
  };
}
