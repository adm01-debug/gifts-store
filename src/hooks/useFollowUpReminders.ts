import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { addDays, isToday, isTomorrow, isPast, startOfDay, endOfDay } from "date-fns";

export interface FollowUpReminder {
  id: string;
  user_id: string;
  client_id: string | null;
  title: string;
  description: string | null;
  reminder_date: string;
  reminder_type: "follow_up" | "meeting" | "call" | "email" | "quote";
  priority: "low" | "medium" | "high" | "urgent";
  is_completed: boolean;
  completed_at: string | null;
  quote_id: string | null;
  created_at: string;
  updated_at: string;
  client?: {
    id: string;
    name: string;
  };
}

export interface CreateReminderInput {
  client_id?: string;
  title: string;
  description?: string;
  reminder_date: Date;
  reminder_type?: FollowUpReminder["reminder_type"];
  priority?: FollowUpReminder["priority"];
  quote_id?: string;
}

export function useFollowUpReminders() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all reminders
  const { data: reminders, isLoading } = useQuery({
    queryKey: ["follow-up-reminders", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("follow_up_reminders")
        .select(`
          *,
          client:bitrix_clients(id, name)
        `)
        .eq("user_id", user.id)
        .order("reminder_date", { ascending: true });

      if (error) throw error;
      return data as FollowUpReminder[];
    },
    enabled: !!user?.id,
  });

  // Fetch pending reminders (not completed, due today or past)
  const { data: pendingReminders } = useQuery({
    queryKey: ["pending-reminders", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from("follow_up_reminders")
        .select(`
          *,
          client:bitrix_clients(id, name)
        `)
        .eq("user_id", user.id)
        .eq("is_completed", false)
        .lte("reminder_date", now)
        .order("reminder_date", { ascending: true });

      if (error) throw error;
      return data as FollowUpReminder[];
    },
    enabled: !!user?.id,
    refetchInterval: 60000, // Refetch every minute
  });

  // Fetch upcoming reminders (next 7 days, not completed)
  const { data: upcomingReminders } = useQuery({
    queryKey: ["upcoming-reminders", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const now = new Date().toISOString();
      const nextWeek = addDays(new Date(), 7).toISOString();

      const { data, error } = await supabase
        .from("follow_up_reminders")
        .select(`
          *,
          client:bitrix_clients(id, name)
        `)
        .eq("user_id", user.id)
        .eq("is_completed", false)
        .gte("reminder_date", now)
        .lte("reminder_date", nextWeek)
        .order("reminder_date", { ascending: true });

      if (error) throw error;
      return data as FollowUpReminder[];
    },
    enabled: !!user?.id,
  });

  // Create reminder mutation
  const createReminderMutation = useMutation({
    mutationFn: async (input: CreateReminderInput) => {
      if (!user?.id) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("follow_up_reminders")
        .insert({
          user_id: user.id,
          client_id: input.client_id || null,
          title: input.title,
          description: input.description || null,
          reminder_date: input.reminder_date.toISOString(),
          reminder_type: input.reminder_type || "follow_up",
          priority: input.priority || "medium",
          quote_id: input.quote_id || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as FollowUpReminder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["follow-up-reminders"] });
      queryClient.invalidateQueries({ queryKey: ["pending-reminders"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-reminders"] });
      toast.success("Lembrete criado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar lembrete", { description: error.message });
    },
  });

  // Complete reminder mutation
  const completeReminderMutation = useMutation({
    mutationFn: async (reminderId: string) => {
      const { data, error } = await supabase
        .from("follow_up_reminders")
        .update({
          is_completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq("id", reminderId)
        .select()
        .single();

      if (error) throw error;
      return data as FollowUpReminder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["follow-up-reminders"] });
      queryClient.invalidateQueries({ queryKey: ["pending-reminders"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-reminders"] });
      toast.success("Lembrete concluído!");
    },
  });

  // Delete reminder mutation
  const deleteReminderMutation = useMutation({
    mutationFn: async (reminderId: string) => {
      const { error } = await supabase
        .from("follow_up_reminders")
        .delete()
        .eq("id", reminderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["follow-up-reminders"] });
      queryClient.invalidateQueries({ queryKey: ["pending-reminders"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-reminders"] });
      toast.success("Lembrete excluído");
    },
  });

  // Snooze reminder mutation
  const snoozeReminderMutation = useMutation({
    mutationFn: async ({ reminderId, days }: { reminderId: string; days: number }) => {
      const newDate = addDays(new Date(), days);

      const { data, error } = await supabase
        .from("follow_up_reminders")
        .update({
          reminder_date: newDate.toISOString(),
        })
        .eq("id", reminderId)
        .select()
        .single();

      if (error) throw error;
      return data as FollowUpReminder;
    },
    onSuccess: (_, { days }) => {
      queryClient.invalidateQueries({ queryKey: ["follow-up-reminders"] });
      queryClient.invalidateQueries({ queryKey: ["pending-reminders"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-reminders"] });
      toast.success(`Lembrete adiado em ${days} dia(s)`);
    },
  });

  // Helper to get status of reminder
  const getReminderStatus = (reminder: FollowUpReminder) => {
    if (reminder.is_completed) return "completed";
    const reminderDate = new Date(reminder.reminder_date);
    if (isPast(reminderDate) && !isToday(reminderDate)) return "overdue";
    if (isToday(reminderDate)) return "today";
    if (isTomorrow(reminderDate)) return "tomorrow";
    return "upcoming";
  };

  // Helper to get priority color
  const getPriorityColor = (priority: FollowUpReminder["priority"]) => {
    switch (priority) {
      case "urgent":
        return "destructive";
      case "high":
        return "warning";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  // Helper to get type icon name
  const getReminderTypeIcon = (type: FollowUpReminder["reminder_type"]) => {
    switch (type) {
      case "call":
        return "Phone";
      case "email":
        return "Mail";
      case "meeting":
        return "Users";
      case "quote":
        return "FileText";
      default:
        return "Bell";
    }
  };

  return {
    reminders: reminders || [],
    pendingReminders: pendingReminders || [],
    upcomingReminders: upcomingReminders || [],
    isLoading,
    createReminder: createReminderMutation.mutateAsync,
    completeReminder: completeReminderMutation.mutateAsync,
    deleteReminder: deleteReminderMutation.mutateAsync,
    snoozeReminder: snoozeReminderMutation.mutateAsync,
    getReminderStatus,
    getPriorityColor,
    getReminderTypeIcon,
    isCreating: createReminderMutation.isPending,
    pendingCount: pendingReminders?.length || 0,
  };
}
