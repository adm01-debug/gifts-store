/**
 * Hook de Sales Goals (Metas de Vendas) - DESABILITADO
 * 
 * Este módulo está temporariamente desabilitado.
 * A tabela sales_goals não existe no banco de dados atual.
 * 
 * Para reativar, crie a tabela necessária no Supabase.
 */

import { useState } from "react";

// Tipos mock para manter compatibilidade
interface SalesGoal {
  id: string;
  user_id: string;
  goal_type: string;
  target_value: number;
  current_value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

// Hook desabilitado - retorna dados vazios
export function useSalesGoals(_userId?: string) {
  const [isLoading] = useState(false);

  return {
    // Dados vazios
    goals: [] as SalesGoal[],
    activeGoal: null as SalesGoal | null,
    progress: 0,
    
    // Estados
    isLoading,
    isEnabled: false, // Flag indicando que módulo está desabilitado
    
    // Funções que não fazem nada
    createGoal: async (_data: Partial<SalesGoal>) => {
      console.warn("[Sales Goals] Módulo desabilitado");
      return null;
    },
    updateGoal: async (_id: string, _data: Partial<SalesGoal>) => {
      console.warn("[Sales Goals] Módulo desabilitado");
      return null;
    },
    deleteGoal: async (_id: string) => {
      console.warn("[Sales Goals] Módulo desabilitado");
    },
    updateProgress: async (_goalId: string, _value: number) => {
      console.warn("[Sales Goals] Módulo desabilitado");
    },
    refetch: async () => {},
  };
}

export default useSalesGoals;
