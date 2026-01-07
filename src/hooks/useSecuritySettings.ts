import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SecuritySetting {
  id: string;
  setting_key: string;
  setting_value: Record<string, any>;
  description: string | null;
  updated_at: string;
  updated_by: string | null;
}

export interface AllowedIP {
  id: string;
  user_id: string;
  ip_address: string;
  label: string | null;
  is_active: boolean;
  created_at: string;
  created_by: string | null;
}

export interface AllowedCountry {
  id: string;
  country_code: string;
  country_name: string;
  is_active: boolean;
  created_at: string;
  created_by: string | null;
}

export function useSecuritySettings() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["security-settings"],
    queryFn: async (): Promise<SecuritySetting[]> => {
      const { data, error } = await supabase
        .from("security_settings")
        .select("*")
        .order("setting_key", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const updateSetting = useMutation({
    mutationFn: async ({ key, value, userId }: { key: string; value: any; userId: string }) => {
      const { data, error } = await supabase
        .from("security_settings")
        .update({
          setting_value: value,
          updated_at: new Date().toISOString(),
          updated_by: userId,
        })
        .eq("setting_key", key)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["security-settings"] });
      toast.success("Configuração atualizada!");
    },
    onError: () => toast.error("Erro ao atualizar configuração"),
  });

  const getSetting = (key: string) => query.data?.find((s) => s.setting_key === key);

  return {
    settings: query.data || [],
    getSetting,
    isLoading: query.isLoading,
    updateSetting,
  };
}

export function useAllowedIPs(userId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["allowed-ips", userId],
    queryFn: async (): Promise<AllowedIP[]> => {
      let q = supabase
        .from("user_allowed_ips")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (userId) {
        q = q.eq("user_id", userId);
      }

      const { data, error } = await q;

      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const addIP = useMutation({
    mutationFn: async (input: Omit<AllowedIP, "id" | "created_at" | "is_active">) => {
      const { data, error } = await supabase
        .from("user_allowed_ips")
        .insert({ ...input, is_active: true })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allowed-ips"] });
      toast.success("IP adicionado!");
    },
    onError: () => toast.error("Erro ao adicionar IP"),
  });

  const removeIP = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("user_allowed_ips")
        .update({ is_active: false })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allowed-ips"] });
      toast.success("IP removido!");
    },
    onError: () => toast.error("Erro ao remover IP"),
  });

  return {
    allowedIPs: query.data || [],
    isLoading: query.isLoading,
    addIP,
    removeIP,
  };
}

export function useAllowedCountries() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["allowed-countries"],
    queryFn: async (): Promise<AllowedCountry[]> => {
      const { data, error } = await supabase
        .from("geo_allowed_countries")
        .select("*")
        .eq("is_active", true)
        .order("country_name", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 10,
  });

  const toggleCountry = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { data, error } = await supabase
        .from("geo_allowed_countries")
        .update({ is_active: active })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allowed-countries"] });
      toast.success("País atualizado!");
    },
    onError: () => toast.error("Erro ao atualizar país"),
  });

  return {
    countries: query.data || [],
    isLoading: query.isLoading,
    toggleCountry,
  };
}
