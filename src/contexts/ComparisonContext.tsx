import React, { createContext, useContext, ReactNode, useCallback, useRef } from "react";
import { useComparison } from "@/hooks/useComparison";
import { useGamification } from "@/hooks/useGamification";
import { Product } from "@/data/mockData";

interface ComparisonContextType {
  compareIds: string[];
  compareCount: number;
  maxItems: number;
  addToCompare: (productId: string) => boolean;
  removeFromCompare: (productId: string) => void;
  toggleCompare: (productId: string) => { added: boolean; isFull: boolean };
  isInCompare: (productId: string) => boolean;
  getCompareProducts: () => Product[];
  clearCompare: () => void;
  canAddMore: boolean;
  isLoaded: boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const { addXp } = useGamification();
  const addXpRef = useRef(addXp);
  addXpRef.current = addXp;

  const handleProductAdded = useCallback(() => {
    addXpRef.current(10);
  }, []);

  const comparisonHook = useComparison({
    onProductAdded: handleProductAdded,
  });

  return (
    <ComparisonContext.Provider value={comparisonHook}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparisonContext() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error("useComparisonContext must be used within a ComparisonProvider");
  }
  return context;
}
