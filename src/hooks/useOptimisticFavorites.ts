/**
 * useOptimisticFavorites - Optimistic UI for favorites
 * Provides instant feedback with rollback on error
 */
import { useState, useCallback, useRef } from "react";
import { useFavoritesContext } from "@/contexts/FavoritesContext";
import { toast } from "sonner";

interface OptimisticState {
  [productId: string]: {
    pending: boolean;
    optimisticValue: boolean;
  };
}

export function useOptimisticFavorites() {
  const { toggleFavorite, isFavorite } = useFavoritesContext();
  const [optimisticState, setOptimisticState] = useState<OptimisticState>({});
  const timeoutRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});

  /**
   * Get the current favorite status (optimistic or real)
   */
  const getIsFavorite = useCallback((productId: string): boolean => {
    const state = optimisticState[productId];
    if (state?.pending) {
      return state.optimisticValue;
    }
    return isFavorite(productId);
  }, [optimisticState, isFavorite]);

  /**
   * Toggle favorite with optimistic update
   */
  const toggleOptimisticFavorite = useCallback((productId: string, productName?: string) => {
    const currentState = isFavorite(productId);
    const newState = !currentState;

    // Clear any existing timeout for this product
    if (timeoutRefs.current[productId]) {
      clearTimeout(timeoutRefs.current[productId]);
    }

    // Set optimistic state immediately
    setOptimisticState(prev => ({
      ...prev,
      [productId]: {
        pending: true,
        optimisticValue: newState,
      }
    }));

    // Perform the actual toggle
    try {
      toggleFavorite(productId);
      
      // Show success toast with optimistic feel
      toast.success(
        newState 
          ? `"${productName || 'Produto'}" adicionado aos favoritos` 
          : `"${productName || 'Produto'}" removido dos favoritos`,
        {
          duration: 2000,
          icon: newState ? "❤️" : "💔",
        }
      );

      // Clear optimistic state after a short delay
      timeoutRefs.current[productId] = setTimeout(() => {
        setOptimisticState(prev => {
          const newState = { ...prev };
          delete newState[productId];
          return newState;
        });
      }, 300);

    } catch (error) {
      // Rollback on error
      setOptimisticState(prev => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });

      toast.error("Erro ao atualizar favoritos. Tente novamente.", {
        duration: 3000,
      });
    }
  }, [isFavorite, toggleFavorite]);

  /**
   * Check if a toggle is pending
   */
  const isPending = useCallback((productId: string): boolean => {
    return optimisticState[productId]?.pending ?? false;
  }, [optimisticState]);

  return {
    getIsFavorite,
    toggleOptimisticFavorite,
    isPending,
  };
}
