import React, { createContext, useContext, ReactNode } from "react";
import { useQuote, QuoteItem } from "@/hooks/useQuote";
import { Product, ProductColor } from "@/data/mockData";

interface QuoteContextType {
  items: QuoteItem[];
  itemCount: number;
  addItem: (productId: string, quantity?: number, color?: ProductColor) => boolean;
  updateItem: (productId: string, updates: Partial<QuoteItem>) => void;
  updateItemByIndex: (index: number, updates: Partial<QuoteItem>) => void;
  removeItem: (productId: string, colorName?: string) => void;
  removeItemByIndex: (index: number) => void;
  clearQuote: () => void;
  getItemProducts: () => (Product & { quoteItem: QuoteItem })[];
  getSubtotal: () => number;
  getTotalItems: () => number;
  isInQuote: (productId: string) => boolean;
  isLoaded: boolean;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const quoteHook = useQuote();

  return (
    <QuoteContext.Provider value={quoteHook}>{children}</QuoteContext.Provider>
  );
}

export function useQuoteContext() {
  const context = useContext(QuoteContext);
  if (context === undefined) {
    throw new Error("useQuoteContext must be used within a QuoteProvider");
  }
  return context;
}