/**
 * Hook de Loja de Recompensas - DESABILITADO
 *
 * Este módulo está temporariamente desabilitado.
 * As tabelas store_rewards e user_rewards não existem no banco de dados atual.
 *
 * Para reativar, crie as tabelas necessárias no Supabase.
 */

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

// Hook desabilitado - retorna dados vazios
export function useRewardsStore() {
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
    // Data (empty - module disabled)
    rewards: [] as StoreReward[],
    userRewards: [] as UserReward[],
    rewardsByCategory: {} as Record<string, StoreReward[]>,
    activeRewards: [] as UserReward[],
    ownedRewardIds: new Set<string>(),

    // Loading states
    isLoading: false,
    isEnabled: false, // Flag indicating module is disabled

    // Actions (no-op)
    purchaseReward: async (_reward: StoreReward) => {
      console.warn("[RewardsStore] Módulo desabilitado");
      throw new Error("Módulo de recompensas desabilitado");
    },
    toggleReward: async (_params: { rewardId: string; isActive: boolean }) => {
      console.warn("[RewardsStore] Módulo desabilitado");
    },
    isPurchasing: false,

    // Helpers
    ownsReward: (_rewardId: string) => false,
    coins: 0,
    categoryNames,
  };
}
