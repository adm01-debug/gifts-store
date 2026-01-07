import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UserOnboarding {
  id: string;
  user_id: string;
  has_completed_tour: boolean;
  current_step: number;
  completed_steps: string[];
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useUserOnboarding(userId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["user-onboarding", userId],
    queryFn: async (): Promise<UserOnboarding | null> => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from("user_onboarding")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null;
        throw error;
      }

      return data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  const startOnboarding = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase
        .from("user_onboarding")
        .insert({
          user_id: userId,
          has_completed_tour: false,
          current_step: 0,
          completed_steps: [],
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-onboarding"] });
    },
  });

  const completeStep = useMutation({
    mutationFn: async ({ stepId }: { stepId: string }) => {
      const current = query.data;
      if (!current) throw new Error("Onboarding não iniciado");

      const completedSteps = [...(current.completed_steps || []), stepId];

      const { data, error } = await supabase
        .from("user_onboarding")
        .update({
          current_step: current.current_step + 1,
          completed_steps: completedSteps,
          updated_at: new Date().toISOString(),
        })
        .eq("id", current.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-onboarding"] });
    },
  });

  const completeTour = useMutation({
    mutationFn: async () => {
      const current = query.data;
      if (!current) throw new Error("Onboarding não iniciado");

      const { data, error } = await supabase
        .from("user_onboarding")
        .update({
          has_completed_tour: true,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", current.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-onboarding"] });
      toast.success("Tour concluído! 🎉");
    },
  });

  return {
    onboarding: query.data,
    hasCompletedTour: query.data?.has_completed_tour ?? false,
    currentStep: query.data?.current_step ?? 0,
    isLoading: query.isLoading,
    startOnboarding,
    completeStep,
    completeTour,
  };
}
