import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface TrackViewParams {
  productId?: string;
  productSku?: string;
  productName: string;
  viewType: "detail" | "card" | "compare" | "favorite";
}

interface TrackSearchParams {
  searchTerm: string;
  resultsCount: number;
  filtersUsed?: Record<string, unknown>;
}

export function useProductAnalytics() {
  const { user } = useAuth();

  const trackProductView = useCallback(
    async ({ productId, productSku, productName, viewType }: TrackViewParams) => {
      if (!user?.id) return;

      try {
        // Using type assertion since table was just created
        await (supabase.from("product_views") as any).insert({
          product_id: productId,
          product_sku: productSku,
          product_name: productName,
          seller_id: user.id,
          view_type: viewType,
        });
      } catch (error) {
        console.error("Error tracking product view:", error);
      }
    },
    [user?.id]
  );

  const trackSearch = useCallback(
    async ({ searchTerm, resultsCount, filtersUsed = {} }: TrackSearchParams) => {
      // DISABLED: search_analytics table does not exist
      // This is a no-op until the table is created
      if (!user?.id || !searchTerm.trim()) return;

      // Log locally for debugging
      if (import.meta.env.DEV) {
        console.debug("[Analytics] Search tracked:", {
          term: searchTerm,
          results: resultsCount,
          filters: filtersUsed,
        });
      }
    },
    [user?.id]
  );

  return { trackProductView, trackSearch };
}
