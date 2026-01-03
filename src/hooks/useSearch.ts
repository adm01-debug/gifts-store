import { useState, useEffect, useMemo, useCallback } from "react";
import { PRODUCTS, CATEGORIES, SUPPLIERS, type Product } from "@/data/mockData";

const HISTORY_KEY = "search-history";
const MAX_HISTORY = 10;

export interface SearchResult {
  type: "product" | "category" | "supplier" | "history";
  id: string;
  label: string;
  sublabel?: string;
  icon?: string;
  data?: Product;
}

export function useSearch() {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      if (import.meta.env.DEV) {
        console.error("Error loading search history:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save history to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }
  }, [history, isLoaded]);

  const addToHistory = useCallback((term: string) => {
    if (!term.trim()) return;
    
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.toLowerCase() !== term.toLowerCase());
      return [term, ...filtered].slice(0, MAX_HISTORY);
    });
  }, []);

  const removeFromHistory = useCallback((term: string) => {
    setHistory((prev) => prev.filter((h) => h !== term));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  // Generate suggestions based on query
  const suggestions = useMemo((): SearchResult[] => {
    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase().trim();

    // If no query, show recent history
    if (!searchTerm) {
      history.slice(0, 5).forEach((term) => {
        results.push({
          type: "history",
          id: `history-${term}`,
          label: term,
          icon: "🕐",
        });
      });
      return results;
    }

    // Search products
    const matchingProducts = PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.sku.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.materials.some((m) => m.toLowerCase().includes(searchTerm))
    ).slice(0, 5);

    matchingProducts.forEach((product) => {
      results.push({
        type: "product",
        id: product.id,
        label: product.name,
        sublabel: `${product.sku} • ${product.category.name}`,
        icon: "📦",
        data: product,
      });
    });

    // Search categories
    const matchingCategories = CATEGORIES.filter((c) =>
      c.name.toLowerCase().includes(searchTerm)
    ).slice(0, 3);

    matchingCategories.forEach((category) => {
      results.push({
        type: "category",
        id: String(category.id),
        label: category.name,
        sublabel: `${PRODUCTS.filter((p) => p.category.id === category.id).length} produtos`,
        icon: category.icon || "📁",
      });
    });

    // Search suppliers
    const matchingSuppliers = SUPPLIERS.filter((s) =>
      s.name.toLowerCase().includes(searchTerm)
    ).slice(0, 3);

    matchingSuppliers.forEach((supplier) => {
      results.push({
        type: "supplier",
        id: supplier.id,
        label: supplier.name,
        sublabel: `${PRODUCTS.filter((p) => p.supplier.id === supplier.id).length} produtos`,
        icon: "🏭",
      });
    });

    return results;
  }, [query, history]);

  // Quick suggestions (popular/trending)
  const quickSuggestions = useMemo(() => {
    return [
      { label: "Canetas", icon: "🖊️" },
      { label: "Garrafas", icon: "🍶" },
      { label: "Ecológico", icon: "🌱" },
      { label: "Tecnologia", icon: "💻" },
      { label: "Kits", icon: "🎁" },
    ];
  }, []);

  return {
    query,
    setQuery,
    suggestions,
    quickSuggestions,
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    isLoaded,
  };
}
