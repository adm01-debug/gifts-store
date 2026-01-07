/**
 * Hook de Gamificação - DESABILITADO
 * 
 * Este módulo está temporariamente desabilitado.
 * As tabelas seller_gamification, achievements e seller_achievements
 * não existem no banco de dados atual.
 * 
 * Para reativar, crie as tabelas necessárias no Supabase.
 */

import { useState } from "react";

// Tipos mock para manter compatibilidade
interface SellerGamification {
  id: string;
  user_id: string;
  xp_total: number;
  coins_balance: number;
  current_level: number;
  level_name: string;
  login_streak: number;
}

interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
}

// Hook desabilitado - retorna dados vazios
export function useGamification() {
  const [isLoading] = useState(false);

  return {
    // Dados vazios
    gamificationData: null as SellerGamification | null,
    achievements: [] as Achievement[],
    unlockedAchievements: [] as string[],
    leaderboard: [],
    
    // Dados para GamificationIndicators
    level: 1,
    xp: 0,
    coins: 0,
    streak: 0,
    xpProgress: {
      current: 0,
      needed: 100,
      percentage: 0,
    },
    
    // Estados
    isLoading,
    isEnabled: false, // Flag indicando que módulo está desabilitado
    
    // Funções que não fazem nada
    addXP: async (_amount: number, _reason?: string) => {
      console.warn("[Gamificação] Módulo desabilitado");
    },
    addXp: async (_amount: number, _reason?: string) => {
      console.warn("[Gamificação] Módulo desabilitado");
    },
    addCoins: async (_amount: number, _reason?: string) => {
      console.warn("[Gamificação] Módulo desabilitado");
    },
    checkAchievements: async () => {
      console.warn("[Gamificação] Módulo desabilitado");
    },
    updateLoginStreak: async () => {
      console.warn("[Gamificação] Módulo desabilitado");
    },
    refetch: async () => {},
  };
}

// Export default para compatibilidade
export default useGamification;
