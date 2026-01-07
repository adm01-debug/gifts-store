import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SellerGamification {
  id: string;
  user_id: string;
  xp: number;
  level: number;
  coins: number;
  streak: number;
  last_activity_date: string | null;
  total_activities: number;
  created_at: string;
  updated_at: string;
}

export function useSellerGamification(userId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["seller-gamification", userId],
    queryFn: async (): Promise<SellerGamification | null> => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from("seller_gamification")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // Não encontrado - retorna null
          return null;
        }
        console.error("Erro ao buscar gamificação:", error);
        throw error;
      }

      return data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  });

  const addXp = useMutation({
    mutationFn: async ({ userId, amount }: { userId: string; amount: number }) => {
      const current = query.data;
      
      if (!current) {
        // Criar registro se não existe
        const { data, error } = await supabase
          .from("seller_gamification")
          .insert({
            user_id: userId,
            xp: amount,
            level: 1,
            coins: 0,
            streak: 1,
            total_activities: 1,
            last_activity_date: new Date().toISOString().split("T")[0],
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }

      // Atualizar registro existente
      const newXp = current.xp + amount;
      const newLevel = Math.floor(newXp / 1000) + 1; // A cada 1000 XP sobe um nível

      const { data, error } = await supabase
        .from("seller_gamification")
        .update({
          xp: newXp,
          level: newLevel,
          total_activities: current.total_activities + 1,
          last_activity_date: new Date().toISOString().split("T")[0],
          updated_at: new Date().toISOString(),
        })
        .eq("id", current.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["seller-gamification"] });
      toast.success(`+${data.xp - (query.data?.xp || 0)} XP!`);
    },
    onError: (error) => {
      toast.error("Erro ao adicionar XP");
      console.error(error);
    },
  });

  const addCoins = useMutation({
    mutationFn: async ({ userId, amount }: { userId: string; amount: number }) => {
      const current = query.data;
      
      if (!current) {
        const { data, error } = await supabase
          .from("seller_gamification")
          .insert({
            user_id: userId,
            xp: 0,
            level: 1,
            coins: amount,
            streak: 0,
            total_activities: 0,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }

      const { data, error } = await supabase
        .from("seller_gamification")
        .update({
          coins: current.coins + amount,
          updated_at: new Date().toISOString(),
        })
        .eq("id", current.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-gamification"] });
      toast.success("Moedas adicionadas!");
    },
    onError: (error) => {
      toast.error("Erro ao adicionar moedas");
      console.error(error);
    },
  });

  const xpToNextLevel = query.data ? (Math.ceil(query.data.xp / 1000) * 1000) - query.data.xp : 1000;
  const levelProgress = query.data ? ((query.data.xp % 1000) / 1000) * 100 : 0;

  return {
    gamification: query.data,
    xpToNextLevel,
    levelProgress,
    isLoading: query.isLoading,
    error: query.error,
    addXp,
    addCoins,
  };
}
