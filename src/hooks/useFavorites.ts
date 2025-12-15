import { useState, useEffect, useCallback, useRef } from "react";
import { Product, PRODUCTS } from "@/data/mockData";

const STORAGE_KEY = "product-favorites";

export interface FavoriteItem {
  productId: string;
  addedAt: string;
}

interface UseFavoritesOptions {
  onFavoriteAdded?: () => void;
}

export function useFavorites(options?: UseFavoritesOptions) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const onFavoriteAddedRef = useRef(options?.onFavoriteAdded);

  // Keep ref updated
  useEffect(() => {
    onFavoriteAddedRef.current = options?.onFavoriteAdded;
  }, [options?.onFavoriteAdded]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error loading favorites:", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  const addFavorite = useCallback((productId: string) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.productId === productId)) {
        return prev;
      }
      // Call the callback for gamification
      onFavoriteAddedRef.current?.();
      return [
        ...prev,
        {
          productId,
          addedAt: new Date().toISOString(),
        },
      ];
    });
  }, []);

  const removeFavorite = useCallback((productId: string) => {
    setFavorites((prev) => prev.filter((f) => f.productId !== productId));
  }, []);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.productId === productId);
      if (exists) {
        return prev.filter((f) => f.productId !== productId);
      }
      // Call the callback for gamification when adding
      onFavoriteAddedRef.current?.();
      return [
        ...prev,
        {
          productId,
          addedAt: new Date().toISOString(),
        },
      ];
    });
  }, []);

  const isFavorite = useCallback(
    (productId: string) => {
      return favorites.some((f) => f.productId === productId);
    },
    [favorites]
  );

  const getFavoriteProducts = useCallback((): Product[] => {
    return favorites
      .map((f) => PRODUCTS.find((p) => p.id === f.productId))
      .filter((p): p is Product => p !== undefined);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    favoriteCount: favorites.length,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    getFavoriteProducts,
    clearFavorites,
    isLoaded,
  };
}
