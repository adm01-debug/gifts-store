import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PersonalizationLocation {
  id: string;
  product_type: string;
  location_name: string;
  code: string;
  is_active: boolean;
  created_at: string;
}

export interface ProductComponentLocation {
  id: string;
  component_id: string;
  location_name: string;
  location_code: string;
  max_area_cm2: number | null;
  max_width_cm: number | null;
  max_height_cm: number | null;
  area_image_url: string | null;
  printing_lines_image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export function usePersonalizationLocations(productType?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["personalization-locations", productType],
    queryFn: async (): Promise<PersonalizationLocation[]> => {
      let q = supabase
        .from("personalization_locations")
        .select("*")
        .eq("is_active", true)
        .order("location_name", { ascending: true });

      if (productType) {
        q = q.eq("product_type", productType);
      }

      const { data, error } = await q;

      if (error) {
        console.error("Erro ao buscar locais:", error);
        throw error;
      }

      return data || [];
    },
    staleTime: 1000 * 60 * 10,
  });

  const createLocation = useMutation({
    mutationFn: async (input: Omit<PersonalizationLocation, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("personalization_locations")
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personalization-locations"] });
      toast.success("Local de personalização criado!");
    },
    onError: (error) => {
      toast.error("Erro ao criar local");
      console.error(error);
    },
  });

  return {
    locations: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createLocation,
  };
}

export function useComponentLocations(componentId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["component-locations", componentId],
    queryFn: async (): Promise<ProductComponentLocation[]> => {
      if (!componentId) return [];

      const { data, error } = await supabase
        .from("product_component_locations")
        .select("*")
        .eq("component_id", componentId)
        .eq("is_active", true);

      if (error) {
        console.error("Erro ao buscar locais do componente:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!componentId,
    staleTime: 1000 * 60 * 5,
  });

  const createLocation = useMutation({
    mutationFn: async (input: Omit<ProductComponentLocation, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("product_component_locations")
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["component-locations"] });
      toast.success("Local adicionado ao componente!");
    },
    onError: (error) => {
      toast.error("Erro ao adicionar local");
      console.error(error);
    },
  });

  return {
    locations: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createLocation,
  };
}
