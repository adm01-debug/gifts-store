import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface BIMetrics {
  totalClients: number;
  totalDeals: number;
  totalDealsValue: number;
  totalQuotes: number;
  quotesByStatus: Record<string, number>;
  totalMockups: number;
  totalSimulations: number;
  recentClients: Array<{
    id: string;
    name: string;
    ramo: string | null;
    total_spent: number | null;
    last_purchase_date: string | null;
  }>;
  recentDeals: Array<{
    id: string;
    title: string;
    value: number | null;
    stage: string | null;
    created_at_bitrix: string | null;
  }>;
  topClients: Array<{
    id: string;
    name: string;
    total_spent: number | null;
    deals_count: number;
  }>;
  dealsByMonth: Array<{
    month: string;
    value: number;
    count: number;
  }>;
  quotesByMonth: Array<{
    month: string;
    count: number;
    total: number;
  }>;
  clientsByRamo: Array<{
    ramo: string;
    count: number;
  }>;
}

export function useBIMetrics() {
  const { user, isAdmin } = useAuth();

  return useQuery({
    queryKey: ["bi-metrics", user?.id, isAdmin],
    queryFn: async (): Promise<BIMetrics> => {
      // Fetch all data in parallel
      const [
        clientsResult,
        dealsResult,
        quotesResult,
        mockupsResult,
        simulationsResult,
      ] = await Promise.all([
        supabase.from("bitrix_clients").select("*"),
        supabase.from("bitrix_deals").select("*"),
        isAdmin
          ? supabase.from("quotes").select("*")
          : supabase.from("quotes").select("*").eq("seller_id", user?.id),
        isAdmin
          ? supabase.from("generated_mockups").select("*")
          : supabase.from("generated_mockups").select("*").eq("seller_id", user?.id),
        isAdmin
          ? supabase.from("personalization_simulations").select("*")
          : supabase.from("personalization_simulations").select("*").eq("seller_id", user?.id),
      ]);

      const clients = clientsResult.data || [];
      const deals = dealsResult.data || [];
      const quotes = quotesResult.data || [];
      const mockups = mockupsResult.data || [];
      const simulations = simulationsResult.data || [];

      // Calculate metrics
      const totalDealsValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);

      // Quotes by status
      const quotesByStatus: Record<string, number> = {};
      quotes.forEach((quote) => {
        const status = quote.status || "unknown";
        quotesByStatus[status] = (quotesByStatus[status] || 0) + 1;
      });

      // Recent clients (last 5)
      const recentClients = [...clients]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map((c) => ({
          id: c.id,
          name: c.name,
          ramo: c.ramo,
          total_spent: c.total_spent,
          last_purchase_date: c.last_purchase_date,
        }));

      // Recent deals (last 5)
      const recentDeals = [...deals]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map((d) => ({
          id: d.id,
          title: d.title,
          value: d.value,
          stage: d.stage,
          created_at_bitrix: d.created_at_bitrix,
        }));

      // Top clients by total spent
      const clientDealsMap = new Map<string, { count: number }>();
      deals.forEach((deal) => {
        const clientId = deal.bitrix_client_id;
        const existing = clientDealsMap.get(clientId) || { count: 0 };
        existing.count += 1;
        clientDealsMap.set(clientId, existing);
      });

      const topClients = [...clients]
        .sort((a, b) => (b.total_spent || 0) - (a.total_spent || 0))
        .slice(0, 5)
        .map((c) => ({
          id: c.id,
          name: c.name,
          total_spent: c.total_spent,
          deals_count: clientDealsMap.get(c.bitrix_id)?.count || 0,
        }));

      // Deals by month (last 6 months)
      const dealsByMonthMap = new Map<string, { value: number; count: number }>();
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        dealsByMonthMap.set(key, { value: 0, count: 0 });
      }

      deals.forEach((deal) => {
        const date = new Date(deal.created_at_bitrix || deal.created_at);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        if (dealsByMonthMap.has(key)) {
          const existing = dealsByMonthMap.get(key)!;
          existing.value += deal.value || 0;
          existing.count += 1;
        }
      });

      const dealsByMonth = Array.from(dealsByMonthMap.entries()).map(([month, data]) => ({
        month,
        value: data.value,
        count: data.count,
      }));

      // Quotes by month (last 6 months)
      const quotesByMonthMap = new Map<string, { count: number; total: number }>();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        quotesByMonthMap.set(key, { count: 0, total: 0 });
      }

      quotes.forEach((quote) => {
        const date = new Date(quote.created_at);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        if (quotesByMonthMap.has(key)) {
          const existing = quotesByMonthMap.get(key)!;
          existing.count += 1;
          existing.total += quote.total || 0;
        }
      });

      const quotesByMonth = Array.from(quotesByMonthMap.entries()).map(([month, data]) => ({
        month,
        count: data.count,
        total: data.total,
      }));

      // Clients by ramo
      const ramoMap = new Map<string, number>();
      clients.forEach((client) => {
        const ramo = client.ramo || "Não informado";
        ramoMap.set(ramo, (ramoMap.get(ramo) || 0) + 1);
      });

      const clientsByRamo = Array.from(ramoMap.entries())
        .map(([ramo, count]) => ({ ramo, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      return {
        totalClients: clients.length,
        totalDeals: deals.length,
        totalDealsValue,
        totalQuotes: quotes.length,
        quotesByStatus,
        totalMockups: mockups.length,
        totalSimulations: simulations.length,
        recentClients,
        recentDeals,
        topClients,
        dealsByMonth,
        quotesByMonth,
        clientsByRamo,
      };
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
