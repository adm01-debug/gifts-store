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
      if (!user?.id || !searchTerm.trim()) return;

      try {
        // DISABLED: table "search_analytics" does not exist yet
        // await (supabase.from("search_analytics") as any).insert({
        //   search_term: searchTerm.toLowerCase().trim(),
        //   results_count: resultsCount,
        //   seller_id: user.id,
        //   filters_used: filtersUsed,
        // });
        console.warn("[Analytics] Tracking search disabled: table 'search_analytics' missing");
      } catch (error) {
        console.error("Error tracking search:", error);
      }
    },
    [user?.id]
  );

  return { trackProductView, trackSearch };
}
