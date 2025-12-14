import { useState, useEffect, useCallback } from "react";
import { Product, PRODUCTS } from "@/data/mockData";

const STORAGE_KEY = "product-comparison";
const MAX_COMPARE_ITEMS = 4;

export function useComparison() {
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCompareIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error loading comparison:", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever compareIds change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compareIds));
    }
  }, [compareIds, isLoaded]);

  const addToCompare = useCallback((productId: string): boolean => {
    let added = false;
    setCompareIds((prev) => {
      if (prev.includes(productId)) {
        return prev;
      }
      if (prev.length >= MAX_COMPARE_ITEMS) {
        return prev;
      }
      added = true;
      return [...prev, productId];
    });
    return added;
  }, []);

  const removeFromCompare = useCallback((productId: string) => {
    setCompareIds((prev) => prev.filter((id) => id !== productId));
  }, []);

  const toggleCompare = useCallback((productId: string): { added: boolean; isFull: boolean } => {
    let result = { added: false, isFull: false };
    
    setCompareIds((prev) => {
      if (prev.includes(productId)) {
        result = { added: false, isFull: false };
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= MAX_COMPARE_ITEMS) {
        result = { added: false, isFull: true };
        return prev;
      }
      result = { added: true, isFull: false };
      return [...prev, productId];
    });
    
    return result;
  }, []);

  const isInCompare = useCallback(
    (productId: string) => {
      return compareIds.includes(productId);
    },
    [compareIds]
  );

  const getCompareProducts = useCallback((): Product[] => {
    return compareIds
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter((p): p is Product => p !== undefined);
  }, [compareIds]);

  const clearCompare = useCallback(() => {
    setCompareIds([]);
  }, []);

  const canAddMore = compareIds.length < MAX_COMPARE_ITEMS;

  return {
    compareIds,
    compareCount: compareIds.length,
    maxItems: MAX_COMPARE_ITEMS,
    addToCompare,
    removeFromCompare,
    toggleCompare,
    isInCompare,
    getCompareProducts,
    clearCompare,
    canAddMore,
    isLoaded,
  };
}