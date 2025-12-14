import { useState, useEffect, useCallback } from "react";
import { Product, PRODUCTS, ProductColor, Client } from "@/data/mockData";

const STORAGE_KEY = "quote-items";

export interface QuoteItem {
  productId: string;
  quantity: number;
  selectedColor?: ProductColor;
  unitPrice: number;
  notes?: string;
  addedAt: string;
}

export interface QuoteData {
  id: string;
  client?: Client;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  items: QuoteItem[];
  notes?: string;
  validUntil?: string;
  createdAt: string;
  discount?: number;
  discountType?: "percentage" | "fixed";
}

export function useQuote() {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error loading quote:", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = useCallback((productId: string, quantity: number = 1, color?: ProductColor): boolean => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return false;

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === productId && item.selectedColor?.name === color?.name
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [
        ...prev,
        {
          productId,
          quantity: Math.max(quantity, product.minQuantity),
          selectedColor: color,
          unitPrice: product.price,
          addedAt: new Date().toISOString(),
        },
      ];
    });

    return true;
  }, []);

  const updateItem = useCallback((productId: string, updates: Partial<QuoteItem>) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, ...updates } : item
      )
    );
  }, []);

  const updateItemByIndex = useCallback((index: number, updates: Partial<QuoteItem>) => {
    setItems((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], ...updates };
      }
      return updated;
    });
  }, []);

  const removeItem = useCallback((productId: string, colorName?: string) => {
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(item.productId === productId && item.selectedColor?.name === colorName)
      )
    );
  }, []);

  const removeItemByIndex = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearQuote = useCallback(() => {
    setItems([]);
  }, []);

  const getItemProducts = useCallback((): (Product & { quoteItem: QuoteItem })[] => {
    return items
      .map((item) => {
        const product = PRODUCTS.find((p) => p.id === item.productId);
        if (!product) return null;
        return { ...product, quoteItem: item };
      })
      .filter((p): p is Product & { quoteItem: QuoteItem } => p !== null);
  }, [items]);

  const getSubtotal = useCallback((): number => {
    return items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  }, [items]);

  const getTotalItems = useCallback((): number => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const isInQuote = useCallback(
    (productId: string) => {
      return items.some((item) => item.productId === productId);
    },
    [items]
  );

  return {
    items,
    itemCount: items.length,
    addItem,
    updateItem,
    updateItemByIndex,
    removeItem,
    removeItemByIndex,
    clearQuote,
    getItemProducts,
    getSubtotal,
    getTotalItems,
    isInQuote,
    isLoaded,
  };
}