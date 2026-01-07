import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Material {
  id: string;
  organization_id: string;
  name: string;
  slug?: string;
  description?: string;
  material_group_id?: string;
  properties?: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  material_group?: {
    id: string;
    name: string;
  };
}

export function useMaterials() {
  const queryClient = useQueryClient();

  const materialsQuery = useQuery({
    queryKey: ["materials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("materials")
        .select(`
          *,
          material_group:material_groups(id, name)
        `)
        .eq("is_active", true)
        .order("name");

      if (error) {
        console.error("Erro ao buscar materiais:", error);
        return [];
      }
      return data as Material[];
    },
  });

  const createMaterial = useMutation({
    mutationFn: async (material: Partial<Material>) => {
      const { data, error } = await supabase
        .from("materials")
        .insert(material)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      toast.success("Material criado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar material: ${error.message}`);
    },
  });

  const updateMaterial = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Material> & { id: string }) => {
      const { data, error } = await supabase
        .from("materials")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      toast.success("Material atualizado!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar: ${error.message}`);
    },
  });

  return {
    materials: materialsQuery.data || [],
    isLoading: materialsQuery.isLoading,
    error: materialsQuery.error,
    createMaterial,
    updateMaterial,
    refetch: materialsQuery.refetch,
  };
}

export function useMaterialGroups() {
  return useQuery({
    queryKey: ["material-groups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("material_groups")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) {
        console.error("Erro ao buscar grupos:", error);
        return [];
      }
      return data;
    },
  });
}
