import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SalesGoal {
  id: string;
  user_id: string;
  goal_type: string;
  target_value: number;
  current_value: number;
  target_quotes: number;
  current_quotes: number;
  target_conversions: number;
  current_conversions: number;
  start_date: string;
  end_date: string;
  is_achieved: boolean;
  achieved_at: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateGoalInput = Omit<SalesGoal, "id" | "created_at" | "updated_at" | "is_achieved" | "achieved_at" | "current_value" | "current_quotes" | "current_conversions">;

export function useSalesGoals(userId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["sales-goals", userId],
    queryFn: async (): Promise<SalesGoal[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("sales_goals")
        .select("*")
        .eq("user_id", userId)
        .order("end_date", { ascending: true });

      if (error) {
        console.error("Erro ao buscar metas:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  const activeGoals = query.data?.filter(
    (g) => !g.is_achieved && new Date(g.end_date) >= new Date()
  ) || [];

  const achievedGoals = query.data?.filter((g) => g.is_achieved) || [];

  const createGoal = useMutation({
    mutationFn: async (input: CreateGoalInput) => {
      const { data, error } = await supabase
        .from("sales_goals")
        .insert({
          ...input,
          current_value: 0,
          current_quotes: 0,
          current_conversions: 0,
          is_achieved: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-goals"] });
      toast.success("Meta criada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar meta");
      console.error(error);
    },
  });

  const updateProgress = useMutation({
    mutationFn: async ({ 
      goalId, 
      value = 0, 
      quotes = 0, 
      conversions = 0 
    }: { 
      goalId: string; 
      value?: number; 
      quotes?: number; 
      conversions?: number 
    }) => {
      const goal = query.data?.find((g) => g.id === goalId);
      if (!goal) throw new Error("Meta não encontrada");

      const newValue = goal.current_value + value;
      const newQuotes = goal.current_quotes + quotes;
      const newConversions = goal.current_conversions + conversions;

      const isAchieved = 
        newValue >= goal.target_value &&
        newQuotes >= goal.target_quotes &&
        newConversions >= goal.target_conversions;

      const { data, error } = await supabase
        .from("sales_goals")
        .update({
          current_value: newValue,
          current_quotes: newQuotes,
          current_conversions: newConversions,
          is_achieved: isAchieved,
          achieved_at: isAchieved ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", goalId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sales-goals"] });
      if (data.is_achieved) {
        toast.success("🎉 Meta alcançada! Parabéns!");
      }
    },
    onError: (error) => {
      toast.error("Erro ao atualizar progresso");
      console.error(error);
    },
  });

  return {
    goals: query.data || [],
    activeGoals,
    achievedGoals,
    isLoading: query.isLoading,
    error: query.error,
    createGoal,
    updateProgress,
  };
}
