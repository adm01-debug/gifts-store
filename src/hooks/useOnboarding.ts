/**
 * Hook de Onboarding - DESABILITADO
 * 
 * Este módulo está temporariamente desabilitado.
 * A tabela user_onboarding não existe no banco de dados atual.
 * 
 * Para reativar, crie a tabela necessária no Supabase.
 */

import { useState } from "react";

// Tipos mock para manter compatibilidade
interface OnboardingProgress {
  id: string;
  user_id: string;
  current_step: string;
  is_completed: boolean;
  step_welcome: boolean;
  step_profile: boolean;
  step_first_product: boolean;
  step_first_quote: boolean;
}

// Hook desabilitado - retorna dados vazios
export function useOnboarding() {
  const [isLoading] = useState(false);

  return {
    // Dados - assume onboarding completo para não bloquear usuário
    progress: {
      is_completed: true,
      current_step: "completed",
      step_welcome: true,
      step_profile: true,
      step_first_product: true,
      step_first_quote: true,
    } as OnboardingProgress,
    
    currentStep: "completed",
    isCompleted: true, // Assume completo para não mostrar onboarding
    
    // Estados
    isLoading,
    isEnabled: false, // Flag indicando que módulo está desabilitado
    
    // Funções que não fazem nada
    completeStep: async (_step: string) => {
      console.warn("[Onboarding] Módulo desabilitado");
    },
    skipOnboarding: async () => {
      console.warn("[Onboarding] Módulo desabilitado");
    },
    resetOnboarding: async () => {
      console.warn("[Onboarding] Módulo desabilitado");
    },
    refetch: async () => {},
  };
}

export default useOnboarding;
