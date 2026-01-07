import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface FollowUpReminder {
  id: string;
  user_id: string;
  client_id: string | null;
  title: string;
  description: string | null;
  reminder_date: string;
  reminder_type: string;
  priority: string;
  is_completed: boolean;
  completed_at: string | null;
  quote_id: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateReminderInput = Omit<FollowUpReminder, "id" | "created_at" | "updated_at" | "completed_at" | "is_completed">;

export function useFollowUpReminders(userId?: string, clientId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["follow-up-reminders", userId, clientId],
    queryFn: async (): Promise<FollowUpReminder[]> => {
      let q = supabase
        .from("follow_up_reminders")
        .select("*")
        .order("reminder_date", { ascending: true });

      if (userId) {
        q = q.eq("user_id", userId);
      }

      if (clientId) {
        q = q.eq("client_id", clientId);
      }

      const { data, error } = await q;

      if (error) {
        console.error("Erro ao buscar lembretes:", error);
        throw error;
      }

      return data || [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutos
  });

  const pendingReminders = useQuery({
    queryKey: ["follow-up-reminders-pending", userId],
    queryFn: async (): Promise<FollowUpReminder[]> => {
      const now = new Date().toISOString();
      
      let q = supabase
        .from("follow_up_reminders")
        .select("*")
        .eq("is_completed", false)
        .lte("reminder_date", now)
        .order("reminder_date", { ascending: true });

      if (userId) {
        q = q.eq("user_id", userId);
      }

      const { data, error } = await q;

      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60, // 1 minuto
  });

  const createReminder = useMutation({
    mutationFn: async (input: CreateReminderInput) => {
      const { data, error } = await supabase
        .from("follow_up_reminders")
        .insert({
          ...input,
          is_completed: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["follow-up-reminders"] });
      toast.success("Lembrete criado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar lembrete");
      console.error(error);
    },
  });

  const completeReminder = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("follow_up_reminders")
        .update({
          is_completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["follow-up-reminders"] });
      toast.success("Lembrete concluído!");
    },
    onError: (error) => {
      toast.error("Erro ao concluir lembrete");
      console.error(error);
    },
  });

  const deleteReminder = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("follow_up_reminders")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["follow-up-reminders"] });
      toast.success("Lembrete excluído!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir lembrete");
      console.error(error);
    },
  });

  return {
    reminders: query.data || [],
    pendingReminders: pendingReminders.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    createReminder,
    completeReminder,
    deleteReminder,
  };
}
