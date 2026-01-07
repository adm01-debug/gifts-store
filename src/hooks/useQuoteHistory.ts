/**
 * Hook de Histórico de Orçamentos - DESABILITADO
 *
 * Este módulo está temporariamente desabilitado.
 * A tabela quote_history não existe no banco de dados atual.
 *
 * Para reativar, crie a tabela necessária no Supabase.
 */

import { useState } from "react";
import { Json } from "@/integrations/supabase/types";

export interface QuoteHistoryEntry {
  id: string;
  quote_id: string;
  user_id: string;
  action: string;
  field_changed?: string | null;
  old_value?: string | null;
  new_value?: string | null;
  description: string;
  metadata?: Json;
  created_at: string;
}

// Hook desabilitado - retorna dados vazios e operações no-op
export function useQuoteHistory() {
  const [history] = useState<QuoteHistoryEntry[]>([]);
  const [isLoading] = useState(false);

  const fetchHistory = async (_quoteId: string): Promise<QuoteHistoryEntry[]> => {
    // Módulo desabilitado - retorna array vazio
    return [];
  };

  const addHistoryEntry = async (
    _quoteId: string,
    _action: string,
    _description: string,
    _options?: {
      fieldChanged?: string;
      oldValue?: string;
      newValue?: string;
      metadata?: Record<string, unknown>;
    }
  ): Promise<boolean> => {
    // Módulo desabilitado - não faz nada
    return true;
  };

  const logQuoteCreated = async (_quoteId: string, _quoteNumber: string) => {
    return true;
  };

  const logQuoteUpdated = async (_quoteId: string, _changes: string[]) => {
    return true;
  };

  const logStatusChanged = async (
    _quoteId: string,
    _oldStatus: string,
    _newStatus: string
  ) => {
    return true;
  };

  const logItemAdded = async (_quoteId: string, _productName: string, _quantity: number) => {
    return true;
  };

  const logItemRemoved = async (_quoteId: string, _productName: string) => {
    return true;
  };

  const logItemUpdated = async (
    _quoteId: string,
    _productName: string,
    _change: string
  ) => {
    return true;
  };

  const logDuplicated = async (_quoteId: string, _originalQuoteNumber: string) => {
    return true;
  };

  return {
    history,
    isLoading,
    isEnabled: false, // Flag indicating module is disabled
    fetchHistory,
    addHistoryEntry,
    logQuoteCreated,
    logQuoteUpdated,
    logStatusChanged,
    logItemAdded,
    logItemRemoved,
    logItemUpdated,
    logDuplicated,
  };
}
