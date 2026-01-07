import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface StoreReward {
  id: string;
  code: string;
  name: string;
  description: string | null;
  category: string;
  icon: string | null;
  coin_cost: number;
  reward_type: string;
  reward_data: Record<string, any> | null;
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

export function useStoreRewards() {
  const query = useQuery({
    queryKey: ["store-rewards"],
    queryFn: async (): Promise<StoreReward[]> => {
      const { data, error } = await supabase
        .from("store_rewards")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Erro ao buscar recompensas:", error);
        throw error;
      }

      return data || [];
    },
    staleTime: 1000 * 60 * 10,
  });

  const byCategory = query.data?.reduce((acc, reward) => {
    if (!acc[reward.category]) {
      acc[reward.category] = [];
    }
    acc[reward.category].push(reward);
    return acc;
  }, {} as Record<string, StoreReward[]>) || {};

  return {
    rewards: query.data || [],
    byCategory,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useUserRewards(userId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["user-rewards", userId],
    queryFn: async (): Promise<UserReward[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("user_rewards")
        .select("*, reward:store_rewards(*)")
        .eq("user_id", userId)
        .order("purchased_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar recompensas do usuário:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  const purchaseReward = useMutation({
    mutationFn: async ({ userId, rewardId }: { userId: string; rewardId: string }) => {
      const { data, error } = await supabase
        .from("user_rewards")
        .insert({
          user_id: userId,
          reward_id: rewardId,
          is_active: true,
        })
        .select("*, reward:store_rewards(*)")
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-rewards"] });
      queryClient.invalidateQueries({ queryKey: ["seller-gamification"] });
      toast.success("Recompensa resgatada!");
    },
    onError: (error) => {
      toast.error("Erro ao resgatar recompensa");
      console.error(error);
    },
  });

  return {
    userRewards: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    purchaseReward,
  };
}
