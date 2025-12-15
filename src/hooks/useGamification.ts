import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCallback, useState } from "react";

// XP required for each level (index = level - 1)
const XP_PER_LEVEL = [
  0,      // Level 1: 0 XP
  100,    // Level 2: 100 XP
  250,    // Level 3: 250 XP
  450,    // Level 4: 450 XP
  700,    // Level 5: 700 XP
  1000,   // Level 6: 1000 XP
  1400,   // Level 7: 1400 XP
  1900,   // Level 8: 1900 XP
  2500,   // Level 9: 2500 XP
  3200,   // Level 10: 3200 XP
  4000,   // Level 11: 4000 XP
  5000,   // Level 12: 5000 XP
  6200,   // Level 13: 6200 XP
  7600,   // Level 14: 7600 XP
  9200,   // Level 15: 9200 XP
  11000,  // Level 16: 11000 XP
  13000,  // Level 17: 13000 XP
  15500,  // Level 18: 15500 XP
  18500,  // Level 19: 18500 XP
  22000,  // Level 20: 22000 XP
  26000,  // Level 21: 26000 XP
  30500,  // Level 22: 30500 XP
  35500,  // Level 23: 35500 XP
  41000,  // Level 24: 41000 XP
  47000,  // Level 25: 47000 XP
];

export interface GamificationData {
  id: string;
  user_id: string;
  xp: number;
  level: number;
  coins: number;
  streak: number;
  last_activity_date: string | null;
  total_activities: number;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string | null;
  icon: string;
  xp_reward: number;
  coins_reward: number;
  category: string;
  requirement_type: string;
  requirement_value: number;
  is_active: boolean;
}

export interface EarnedAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  achievement?: Achievement;
}

export interface GamificationReward {
  xp?: number;
  coins?: number;
  type: "xp" | "coins" | "streak" | "achievement" | "level-up";
  value: string | number;
}

export function useGamification() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [pendingRewards, setPendingRewards] = useState<GamificationReward[]>([]);

  // Fetch gamification data
  const { data: gamification, isLoading: isLoadingGamification } = useQuery({
    queryKey: ["gamification", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("seller_gamification")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      // If no data, create initial record
      if (!data) {
        const { data: newData, error: insertError } = await supabase
          .from("seller_gamification")
          .insert({ user_id: user.id })
          .select()
          .single();

        if (insertError) throw insertError;
        return newData as GamificationData;
      }

      return data as GamificationData;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch all achievements
  const { data: achievements } = useQuery({
    queryKey: ["achievements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .eq("is_active", true)
        .order("requirement_value", { ascending: true });

      if (error) throw error;
      return data as Achievement[];
    },
    staleTime: 30 * 60 * 1000,
  });

  // Fetch user's earned achievements
  const { data: earnedAchievements } = useQuery({
    queryKey: ["earned-achievements", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("seller_achievements")
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      return data as EarnedAchievement[];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });

  // Calculate level from XP
  const calculateLevel = useCallback((xp: number): number => {
    for (let i = XP_PER_LEVEL.length - 1; i >= 0; i--) {
      if (xp >= XP_PER_LEVEL[i]) {
        return i + 1;
      }
    }
    return 1;
  }, []);

  // Get XP progress for current level
  const getXpProgress = useCallback((xp: number, level: number) => {
    const currentLevelXp = XP_PER_LEVEL[level - 1] || 0;
    const nextLevelXp = XP_PER_LEVEL[level] || XP_PER_LEVEL[XP_PER_LEVEL.length - 1];
    const xpInCurrentLevel = xp - currentLevelXp;
    const xpNeededForNextLevel = nextLevelXp - currentLevelXp;
    
    return {
      current: xpInCurrentLevel,
      needed: xpNeededForNextLevel,
      percentage: Math.min((xpInCurrentLevel / xpNeededForNextLevel) * 100, 100),
    };
  }, []);

  // Check and award achievements
  const checkAchievements = useCallback(
    async (newData: GamificationData) => {
      if (!achievements || !earnedAchievements || !user?.id) return;

      const earnedCodes = new Set(
        earnedAchievements.map((ea) => ea.achievement?.code)
      );
      const newAchievements: Achievement[] = [];

      for (const achievement of achievements) {
        if (earnedCodes.has(achievement.code)) continue;

        let earned = false;

        switch (achievement.requirement_type) {
          case "xp":
            earned = newData.xp >= achievement.requirement_value;
            break;
          case "level":
            earned = newData.level >= achievement.requirement_value;
            break;
          case "streak":
            earned = newData.streak >= achievement.requirement_value;
            break;
          case "activities":
            earned = newData.total_activities >= achievement.requirement_value;
            break;
        }

        if (earned) {
          newAchievements.push(achievement);
        }
      }

      // Award new achievements
      for (const achievement of newAchievements) {
        const { error } = await supabase
          .from("seller_achievements")
          .insert({
            user_id: user.id,
            achievement_id: achievement.id,
          });

        if (!error) {
          // Add rewards
          if (achievement.xp_reward > 0 || achievement.coins_reward > 0) {
            await supabase
              .from("seller_gamification")
              .update({
                xp: newData.xp + achievement.xp_reward,
                coins: newData.coins + achievement.coins_reward,
              })
              .eq("user_id", user.id);
          }

          setPendingRewards((prev) => [
            ...prev,
            {
              type: "achievement",
              value: achievement.name,
              xp: achievement.xp_reward,
              coins: achievement.coins_reward,
            },
          ]);
        }
      }

      if (newAchievements.length > 0) {
        queryClient.invalidateQueries({ queryKey: ["earned-achievements"] });
        queryClient.invalidateQueries({ queryKey: ["gamification"] });
      }
    },
    [achievements, earnedAchievements, user?.id, queryClient]
  );

  // Add XP mutation
  const addXpMutation = useMutation({
    mutationFn: async (amount: number) => {
      if (!user?.id || !gamification) throw new Error("Not authenticated");

      const newXp = gamification.xp + amount;
      const newLevel = calculateLevel(newXp);
      const leveledUp = newLevel > gamification.level;

      const today = new Date().toISOString().split("T")[0];
      const lastActivity = gamification.last_activity_date;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

      let newStreak = gamification.streak;
      if (lastActivity !== today) {
        if (lastActivity === yesterday) {
          newStreak += 1;
        } else if (!lastActivity || lastActivity < yesterday) {
          newStreak = 1;
        }
      }

      const { data, error } = await supabase
        .from("seller_gamification")
        .update({
          xp: newXp,
          level: newLevel,
          streak: newStreak,
          last_activity_date: today,
          total_activities: gamification.total_activities + 1,
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;

      return { data: data as GamificationData, leveledUp, newLevel };
    },
    onSuccess: async ({ data, leveledUp, newLevel }) => {
      queryClient.setQueryData(["gamification", user?.id], data);

      setPendingRewards((prev) => [
        ...prev,
        { type: "xp", value: `+${data.xp - (gamification?.xp || 0)} XP` },
      ]);

      if (leveledUp) {
        setPendingRewards((prev) => [
          ...prev,
          { type: "level-up", value: newLevel },
        ]);
      }

      await checkAchievements(data);
    },
  });

  // Add coins mutation
  const addCoinsMutation = useMutation({
    mutationFn: async (amount: number) => {
      if (!user?.id || !gamification) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("seller_gamification")
        .update({
          coins: gamification.coins + amount,
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data as GamificationData;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["gamification", user?.id], data);
      
      const added = data.coins - (gamification?.coins || 0);
      setPendingRewards((prev) => [
        ...prev,
        { type: "coins", value: added },
      ]);
    },
  });

  // Spend coins mutation
  const spendCoinsMutation = useMutation({
    mutationFn: async (amount: number) => {
      if (!user?.id || !gamification) throw new Error("Not authenticated");
      if (gamification.coins < amount) throw new Error("Insufficient coins");

      const { data, error } = await supabase
        .from("seller_gamification")
        .update({
          coins: gamification.coins - amount,
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data as GamificationData;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["gamification", user?.id], data);
    },
  });

  // Clear pending rewards
  const clearReward = useCallback(() => {
    setPendingRewards((prev) => prev.slice(1));
  }, []);

  // Get current reward to display
  const currentReward = pendingRewards[0] || null;

  return {
    // Data
    gamification,
    achievements,
    earnedAchievements,
    isLoading: isLoadingGamification,

    // Calculated values
    level: gamification?.level || 1,
    xp: gamification?.xp || 0,
    coins: gamification?.coins || 0,
    streak: gamification?.streak || 0,
    xpProgress: gamification
      ? getXpProgress(gamification.xp, gamification.level)
      : { current: 0, needed: 100, percentage: 0 },

    // Actions
    addXp: addXpMutation.mutateAsync,
    addCoins: addCoinsMutation.mutateAsync,
    spendCoins: spendCoinsMutation.mutateAsync,

    // Rewards display
    currentReward,
    clearReward,
    hasRewards: pendingRewards.length > 0,

    // Loading states
    isAddingXp: addXpMutation.isPending,
    isAddingCoins: addCoinsMutation.isPending,
  };
}
