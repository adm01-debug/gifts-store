import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PasswordResetRequest {
  id: string;
  email: string;
  user_id: string | null;
  status: string;
  requested_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  reviewer_notes: string | null;
  created_at: string;
}

export function usePasswordResetRequests(status?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["password-reset-requests", status],
    queryFn: async (): Promise<PasswordResetRequest[]> => {
      let q = supabase
        .from("password_reset_requests")
        .select("*")
        .order("requested_at", { ascending: false });

      if (status) {
        q = q.eq("status", status);
      }

      const { data, error } = await q;

      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 2,
  });

  const reviewRequest = useMutation({
    mutationFn: async ({
      requestId,
      status,
      reviewerId,
      notes,
    }: {
      requestId: string;
      status: "approved" | "rejected";
      reviewerId: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from("password_reset_requests")
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          reviewed_by: reviewerId,
          reviewer_notes: notes,
        })
        .eq("id", requestId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ["password-reset-requests"] });
      toast.success(status === "approved" ? "Solicitação aprovada!" : "Solicitação rejeitada");
    },
    onError: () => toast.error("Erro ao processar solicitação"),
  });

  const pendingCount = query.data?.filter((r) => r.status === "pending").length || 0;

  return {
    requests: query.data || [],
    pendingCount,
    isLoading: query.isLoading,
    reviewRequest,
  };
}
