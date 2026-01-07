import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Role {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Permission {
  id: string;
  code: string;
  name: string;
  description: string | null;
  category: string;
  created_at: string;
}

export interface RolePermission {
  id: string;
  role: string;
  permission_id: string;
  created_at: string;
  permission?: Permission;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  role_data?: Role;
}

export function useRoles() {
  const queryClient = useQueryClient();

  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: async (): Promise<Role[]> => {
      const { data, error } = await supabase
        .from("roles")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 10,
  });

  const createRole = useMutation({
    mutationFn: async (input: Omit<Role, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("roles")
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Papel criado com sucesso!");
    },
    onError: () => toast.error("Erro ao criar papel"),
  });

  const deleteRole = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("roles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Papel removido!");
    },
    onError: () => toast.error("Erro ao remover papel"),
  });

  return {
    roles: rolesQuery.data || [],
    isLoading: rolesQuery.isLoading,
    createRole,
    deleteRole,
  };
}

export function usePermissions() {
  const query = useQuery({
    queryKey: ["permissions"],
    queryFn: async (): Promise<Permission[]> => {
      const { data, error } = await supabase
        .from("permissions")
        .select("*")
        .order("category", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 10,
  });

  const byCategory = query.data?.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>) || {};

  return {
    permissions: query.data || [],
    byCategory,
    isLoading: query.isLoading,
  };
}

export function useRolePermissions(roleId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["role-permissions", roleId],
    queryFn: async (): Promise<RolePermission[]> => {
      if (!roleId) return [];

      const { data, error } = await supabase
        .from("role_permissions")
        .select("*, permission:permissions(*)")
        .eq("role", roleId);

      if (error) throw error;
      return data || [];
    },
    enabled: !!roleId,
  });

  const assignPermission = useMutation({
    mutationFn: async ({ roleId, permissionId }: { roleId: string; permissionId: string }) => {
      const { data, error } = await supabase
        .from("role_permissions")
        .insert({ role: roleId, permission_id: permissionId })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role-permissions"] });
      toast.success("Permissão atribuída!");
    },
    onError: () => toast.error("Erro ao atribuir permissão"),
  });

  const removePermission = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("role_permissions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role-permissions"] });
      toast.success("Permissão removida!");
    },
    onError: () => toast.error("Erro ao remover permissão"),
  });

  return {
    rolePermissions: query.data || [],
    isLoading: query.isLoading,
    assignPermission,
    removePermission,
  };
}

export function useUserRoles(userId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["user-roles", userId],
    queryFn: async (): Promise<UserRole[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("user_roles")
        .select("*, role_data:roles(*)")
        .eq("user_id", userId);

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  const assignRole = useMutation({
    mutationFn: async ({ userId, roleId }: { userId: string; roleId: string }) => {
      const { data, error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: roleId })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
      toast.success("Papel atribuído ao usuário!");
    },
    onError: () => toast.error("Erro ao atribuir papel"),
  });

  const removeRole = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("user_roles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
      toast.success("Papel removido do usuário!");
    },
    onError: () => toast.error("Erro ao remover papel"),
  });

  return {
    userRoles: query.data || [],
    isLoading: query.isLoading,
    assignRole,
    removeRole,
  };
}
