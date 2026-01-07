import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UserDevice {
  id: string;
  user_id: string;
  device_fingerprint: string;
  ip_address: string;
  user_agent: string | null;
  browser_name: string | null;
  os_name: string | null;
  device_type: string | null;
  location: string | null;
  first_seen_at: string;
  last_seen_at: string;
  is_trusted: boolean;
  created_at: string;
}

export function useUserDevices(userId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["user-devices", userId],
    queryFn: async (): Promise<UserDevice[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("user_known_devices")
        .select("*")
        .eq("user_id", userId)
        .order("last_seen_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  const trustDevice = useMutation({
    mutationFn: async ({ deviceId, trust }: { deviceId: string; trust: boolean }) => {
      const { data, error } = await supabase
        .from("user_known_devices")
        .update({ is_trusted: trust })
        .eq("id", deviceId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { trust }) => {
      queryClient.invalidateQueries({ queryKey: ["user-devices"] });
      toast.success(trust ? "Dispositivo confiável!" : "Confiança removida");
    },
    onError: () => toast.error("Erro ao atualizar dispositivo"),
  });

  const removeDevice = useMutation({
    mutationFn: async (deviceId: string) => {
      const { error } = await supabase
        .from("user_known_devices")
        .delete()
        .eq("id", deviceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-devices"] });
      toast.success("Dispositivo removido!");
    },
    onError: () => toast.error("Erro ao remover dispositivo"),
  });

  const trustedDevices = query.data?.filter((d) => d.is_trusted) || [];

  return {
    devices: query.data || [],
    trustedDevices,
    isLoading: query.isLoading,
    trustDevice,
    removeDevice,
  };
}
