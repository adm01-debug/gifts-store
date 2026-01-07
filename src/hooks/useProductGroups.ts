import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ProductGroup {
  id: string;
  group_code: string;
  group_name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductGroupMember {
  id: string;
  product_group_id: string;
  product_id: string;
  use_group_rules: boolean;
  created_at: string;
}

export function useProductGroups() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["product-groups"],
    queryFn: async (): Promise<ProductGroup[]> => {
      const { data, error } = await supabase
        .from("product_groups")
        .select("*")
        .eq("is_active", true)
        .order("group_name", { ascending: true });

      if (error) {
        console.error("Erro ao buscar grupos:", error);
        throw error;
      }

      return data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const createGroup = useMutation({
    mutationFn: async (input: Omit<ProductGroup, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("product_groups")
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-groups"] });
      toast.success("Grupo criado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar grupo");
      console.error(error);
    },
  });

  const updateGroup = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ProductGroup> }) => {
      const { data, error } = await supabase
        .from("product_groups")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-groups"] });
      toast.success("Grupo atualizado!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar grupo");
      console.error(error);
    },
  });

  const deleteGroup = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("product_groups")
        .update({ is_active: false })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-groups"] });
      toast.success("Grupo removido!");
    },
    onError: (error) => {
      toast.error("Erro ao remover grupo");
      console.error(error);
    },
  });

  return {
    groups: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    createGroup,
    updateGroup,
    deleteGroup,
  };
}

export function useProductGroupMembers(groupId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["product-group-members", groupId],
    queryFn: async (): Promise<ProductGroupMember[]> => {
      if (!groupId) return [];

      const { data, error } = await supabase
        .from("product_group_members")
        .select("*")
        .eq("product_group_id", groupId);

      if (error) {
        console.error("Erro ao buscar membros do grupo:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!groupId,
    staleTime: 1000 * 60 * 5,
  });

  const addMember = useMutation({
    mutationFn: async ({ groupId, productId, useGroupRules = true }: { 
      groupId: string; 
      productId: string; 
      useGroupRules?: boolean 
    }) => {
      const { data, error } = await supabase
        .from("product_group_members")
        .insert({
          product_group_id: groupId,
          product_id: productId,
          use_group_rules: useGroupRules,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-group-members"] });
      toast.success("Produto adicionado ao grupo!");
    },
    onError: (error) => {
      toast.error("Erro ao adicionar produto ao grupo");
      console.error(error);
    },
  });

  const removeMember = useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase
        .from("product_group_members")
        .delete()
        .eq("id", memberId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-group-members"] });
      toast.success("Produto removido do grupo!");
    },
    onError: (error) => {
      toast.error("Erro ao remover produto do grupo");
      console.error(error);
    },
  });

  return {
    members: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    addMember,
    removeMember,
  };
}
