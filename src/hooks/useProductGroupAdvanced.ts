import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ProductGroupLocation {
  id: string;
  product_group_id: string;
  location_name: string;
  location_code: string;
  max_area_cm2: number | null;
  is_active: boolean;
  created_at: string;
}

export interface ProductGroupLocationTechnique {
  id: string;
  group_location_id: string;
  technique_id: string;
  is_active: boolean;
  created_at: string;
}

export interface ProductGroupComponent {
  id: string;
  product_group_id: string;
  component_name: string;
  component_code: string;
  is_personalizable: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface ProductComponentLocationTechnique {
  id: string;
  component_location_id: string;
  technique_id: string;
  is_active: boolean;
  created_at: string;
}

export function useProductGroupLocations(groupId?: string) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["product-group-locations", groupId],
    queryFn: async (): Promise<ProductGroupLocation[]> => {
      if (!groupId) return [];
      const { data, error } = await supabase.from("product_group_locations").select("*").eq("product_group_id", groupId).eq("is_active", true);
      if (error) throw error;
      return data || [];
    },
    enabled: !!groupId,
  });

  const addLocation = useMutation({
    mutationFn: async (input: Omit<ProductGroupLocation, "id" | "created_at">) => {
      const { data, error } = await supabase.from("product_group_locations").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["product-group-locations"] }); toast.success("Local adicionado!"); },
  });

  return { locations: query.data || [], isLoading: query.isLoading, addLocation };
}

export function useProductGroupLocationTechniques(locationId?: string) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["product-group-location-techniques", locationId],
    queryFn: async (): Promise<ProductGroupLocationTechnique[]> => {
      if (!locationId) return [];
      const { data, error } = await supabase.from("product_group_location_techniques").select("*").eq("group_location_id", locationId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!locationId,
  });

  const assignTechnique = useMutation({
    mutationFn: async (input: { locationId: string; techniqueId: string }) => {
      const { data, error } = await supabase.from("product_group_location_techniques").insert({ group_location_id: input.locationId, technique_id: input.techniqueId, is_active: true }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product-group-location-techniques"] }),
  });

  return { techniques: query.data || [], isLoading: query.isLoading, assignTechnique };
}

export function useProductGroupComponents(groupId?: string) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["product-group-components", groupId],
    queryFn: async (): Promise<ProductGroupComponent[]> => {
      if (!groupId) return [];
      const { data, error } = await supabase.from("product_group_components").select("*").eq("product_group_id", groupId).eq("is_active", true).order("sort_order");
      if (error) throw error;
      return data || [];
    },
    enabled: !!groupId,
  });

  const addComponent = useMutation({
    mutationFn: async (input: Omit<ProductGroupComponent, "id" | "created_at">) => {
      const { data, error } = await supabase.from("product_group_components").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["product-group-components"] }); toast.success("Componente adicionado!"); },
  });

  return { components: query.data || [], isLoading: query.isLoading, addComponent };
}

export function useComponentLocationTechniques(locationId?: string) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["component-location-techniques", locationId],
    queryFn: async (): Promise<ProductComponentLocationTechnique[]> => {
      if (!locationId) return [];
      const { data, error } = await supabase.from("product_component_location_techniques").select("*").eq("component_location_id", locationId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!locationId,
  });

  const assignTechnique = useMutation({
    mutationFn: async (input: { locationId: string; techniqueId: string }) => {
      const { data, error } = await supabase.from("product_component_location_techniques").insert({ component_location_id: input.locationId, technique_id: input.techniqueId, is_active: true }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["component-location-techniques"] }),
  });

  return { techniques: query.data || [], isLoading: query.isLoading, assignTechnique };
}
