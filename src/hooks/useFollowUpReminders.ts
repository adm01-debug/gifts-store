/**
 * Hook de Follow-up Reminders - DESABILITADO
 * 
 * Este módulo está temporariamente desabilitado.
 * A tabela follow_up_reminders não existe no banco de dados atual.
 * 
 * Para reativar, crie a tabela necessária no Supabase.
 */

import { useState } from "react";

// Tipos mock para manter compatibilidade
interface FollowUpReminder {
  id: string;
  user_id: string;
  client_id?: string;
  title: string;
  description?: string;
  reminder_date: string;
  is_completed: boolean;
  priority: "low" | "normal" | "high" | "urgent";
}

// Hook desabilitado - retorna dados vazios
export function useFollowUpReminders(_userId?: string) {
  const [isLoading] = useState(false);

  return {
    // Dados vazios
    reminders: [] as FollowUpReminder[],
    overdueReminders: [] as FollowUpReminder[],
    upcomingReminders: [] as FollowUpReminder[],
    
    // Estados
    isLoading,
    isEnabled: false, // Flag indicando que módulo está desabilitado
    
    // Funções que não fazem nada
    createReminder: async (_data: Partial<FollowUpReminder>) => {
      console.warn("[Follow-up] Módulo desabilitado");
      return null;
    },
    updateReminder: async (_id: string, _data: Partial<FollowUpReminder>) => {
      console.warn("[Follow-up] Módulo desabilitado");
      return null;
    },
    deleteReminder: async (_id: string) => {
      console.warn("[Follow-up] Módulo desabilitado");
    },
    completeReminder: async (_id: string) => {
      console.warn("[Follow-up] Módulo desabilitado");
    },
    refetch: async () => {},
  };
}

export default useFollowUpReminders;
