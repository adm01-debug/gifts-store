import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string | null;
  icon: string | null;
  xp_reward: number;
  coins_reward: number;
  category: string;
  requirement_type: string;
  requirement_value: number;
  is_active: boolean;
  created_at: string;
}

export interface SellerAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  achievement?: Achievement;
}

export function useAchievements() {
  const query = useQuery({
    queryKey: ["achievements"],
    queryFn: async (): Promise<Achievement[]> => {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .eq("is_active", true)
        .order("category", { ascending: true })
        .order("xp_reward", { ascending: true });

      if (error) {
        console.error("Erro ao buscar conquistas:", error);
        throw error;
      }

      return data || [];
    },
    staleTime: 1000 * 60 * 30, // 30 minutos
  });

  const byCategory = query.data?.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>) || {};

  return {
    achievements: query.data || [],
    byCategory,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useUserAchievements(userId?: string) {
  const query = useQuery({
    queryKey: ["user-achievements", userId],
    queryFn: async (): Promise<SellerAchievement[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("seller_achievements")
        .select("*, achievement:achievements(*)")
        .eq("user_id", userId)
        .order("earned_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar conquistas do usuário:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    userAchievements: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
  };
}
