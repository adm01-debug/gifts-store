import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useGamification } from "./useGamification";
import { toast } from "sonner";

export interface StoreReward {
  id: string;
  code: string;
  name: string;
  description: string | null;
  category: string;
  icon: string;
  coin_cost: number;
  reward_type: string;
  reward_data: Record<string, unknown>;
  stock: number | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface UserReward {
  id: string;
  user_id: string;
  reward_id: string;
  purchased_at: string;
  is_active: boolean;
  reward?: StoreReward;
}

export function useRewardsStore() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { coins, spendCoins } = useGamification();

  // Fetch all available rewards
  const { data: rewards, isLoading: isLoadingRewards } = useQuery({
    queryKey: ["store-rewards"],
    queryFn: async () => {
      const { data, error } = await supabase
        // .from("store_rewards") // DISABLED
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data as StoreReward[];
    },
    staleTime: 10 * 60 * 1000,
  });

  // Fetch user's purchased rewards
  const { data: userRewards, isLoading: isLoadingUserRewards } = useQuery({
    queryKey: ["user-rewards", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        // .from("user_rewards") // DISABLED
        .select(`
          *,
          reward:store_rewards(*)
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      return data as UserReward[];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });

  // Purchase reward mutation
  const purchaseRewardMutation = useMutation({
    mutationFn: async (reward: StoreReward) => {
      if (!user?.id) throw new Error("Não autenticado");
      if (coins < reward.coin_cost) throw new Error("Moedas insuficientes");

      // Check if already owned
      const alreadyOwned = userRewards?.some(ur => ur.reward_id === reward.id);
      if (alreadyOwned) throw new Error("Você já possui esta recompensa");

      // Check stock
      if (reward.stock !== null && reward.stock <= 0) {
        throw new Error("Recompensa esgotada");
      }

      // Spend coins
      await spendCoins(reward.coin_cost);

      // Create purchase record
      const { data, error } = await supabase
        // .from("user_rewards") // DISABLED
        .insert({
          user_id: user.id,
          reward_id: reward.id,
        })
        .select(`
          *,
          reward:store_rewards(*)
        `)
        .single();

      if (error) {
        // Refund coins on error
        throw error;
      }

      // Update stock if applicable
      if (reward.stock !== null) {
        await supabase
          // .from("store_rewards") // DISABLED
          .update({ stock: reward.stock - 1 })
          .eq("id", reward.id);
      }

      return data as UserReward;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-rewards"] });
      queryClient.invalidateQueries({ queryKey: ["store-rewards"] });
      toast.success(`Você adquiriu: ${data.reward?.name}!`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Toggle reward active status
  const toggleRewardMutation = useMutation({
    mutationFn: async ({ rewardId, isActive }: { rewardId: string; isActive: boolean }) => {
      if (!user?.id) throw new Error("Não autenticado");

      const { error } = await supabase
        // .from("user_rewards") // DISABLED
        .update({ is_active: isActive })
        .eq("user_id", user.id)
        .eq("reward_id", rewardId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-rewards"] });
      toast.success("Recompensa atualizada");
    },
  });

  // Group rewards by category
  const rewardsByCategory = rewards?.reduce((acc, reward) => {
    if (!acc[reward.category]) {
      acc[reward.category] = [];
    }
    acc[reward.category].push(reward);
    return acc;
  }, {} as Record<string, StoreReward[]>) || {};

  // Check if user owns a reward
  const ownsReward = (rewardId: string) => {
    return userRewards?.some(ur => ur.reward_id === rewardId) || false;
  };

  // Get owned reward IDs set for quick lookup
  const ownedRewardIds = new Set(userRewards?.map(ur => ur.reward_id) || []);

  // Get active rewards (equipped)
  const activeRewards = userRewards?.filter(ur => ur.is_active) || [];

  // Category display names
  const categoryNames: Record<string, string> = {
    avatar: "Avatares",
    badge: "Badges",
    theme: "Temas",
    boost: "Boosts",
    title: "Títulos",
    general: "Geral",
  };

  return {
    // Data
    rewards,
    userRewards,
    rewardsByCategory,
    activeRewards,
    ownedRewardIds,

    // Loading states
    isLoading: isLoadingRewards || isLoadingUserRewards,

    // Actions
    purchaseReward: purchaseRewardMutation.mutateAsync,
    toggleReward: toggleRewardMutation.mutateAsync,
    isPurchasing: purchaseRewardMutation.isPending,

    // Helpers
    ownsReward,
    coins,
    categoryNames,
  };
}
