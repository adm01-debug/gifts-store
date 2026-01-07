/**
 * Hook de Expert Conversations (Chat IA) - DESABILITADO
 * 
 * Este módulo está temporariamente desabilitado.
 * A tabela expert_conversations não existe no banco de dados atual.
 * 
 * Para reativar, crie a tabela necessária no Supabase.
 */

import { useState } from "react";

// Tipos mock para manter compatibilidade
interface ExpertConversation {
  id: string;
  seller_id: string;
  title: string;
  context_type: string;
  is_active: boolean;
  message_count: number;
}

interface ExpertMessage {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

// Hook desabilitado - retorna dados vazios
export function useExpertConversations(_sellerId?: string) {
  const [isLoading] = useState(false);

  return {
    // Dados vazios
    conversations: [] as ExpertConversation[],
    activeConversation: null as ExpertConversation | null,
    messages: [] as ExpertMessage[],
    
    // Estados
    isLoading,
    isEnabled: false, // Flag indicando que módulo está desabilitado
    
    // Funções que não fazem nada
    createConversation: async (_title?: string) => {
      console.warn("[Expert Chat] Módulo desabilitado");
      return null;
    },
    sendMessage: async (_conversationId: string, _content: string) => {
      console.warn("[Expert Chat] Módulo desabilitado");
      return null;
    },
    deleteConversation: async (_id: string) => {
      console.warn("[Expert Chat] Módulo desabilitado");
    },
    loadMessages: async (_conversationId: string) => {
      console.warn("[Expert Chat] Módulo desabilitado");
      return [];
    },
    refetch: async () => {},
  };
}

export default useExpertConversations;
