/**
 * Hook de RBAC (Role-Based Access Control) - CORRIGIDO
 * Usa profiles.role em vez de tabela roles separada
 */
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type RoleName = 'admin' | 'gerente' | 'vendedor' | 'viewer';

export interface Role {
  id: string;
  name: RoleName;
  description: string | null;
}

export interface Permission {
  action: string;
  resource: string;
}

// Define permissions for each role
const rolePermissions: Record<RoleName, Permission[]> = {
  admin: [
    { action: '*', resource: '*' }, // Full access
  ],
  gerente: [
    { action: 'read', resource: '*' },
    { action: 'create', resource: 'quotes' },
    { action: 'update', resource: 'quotes' },
    { action: 'delete', resource: 'quotes' },
    { action: 'approve', resource: 'quotes' },
    { action: 'create', resource: 'orders' },
    { action: 'update', resource: 'orders' },
    { action: 'read', resource: 'reports' },
    { action: 'manage', resource: 'team' },
  ],
  vendedor: [
    { action: 'read', resource: 'products' },
    { action: 'read', resource: 'clients' },
    { action: 'create', resource: 'quotes' },
    { action: 'update', resource: 'quotes' },
    { action: 'read', resource: 'quotes' },
    { action: 'create', resource: 'orders' },
    { action: 'read', resource: 'orders' },
    { action: 'read', resource: 'mockups' },
    { action: 'create', resource: 'mockups' },
  ],
  viewer: [
    { action: 'read', resource: 'products' },
    { action: 'read', resource: 'quotes' },
    { action: 'read', resource: 'orders' },
  ],
};

// Mapeamento de nomes de roles (para compatibilidade)
const roleNameMap: Record<string, RoleName> = {
  'admin': 'admin',
  'manager': 'gerente',
  'gerente': 'gerente',
  'seller': 'vendedor',
  'vendedor': 'vendedor',
  'viewer': 'viewer',
};

export function useRBAC() {
  const { user, role: authRole } = useAuth();
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      if (!user) {
        setRole(null);
        setIsLoading(false);
        return;
      }

      try {
        // Se já temos o role do AuthContext, usar ele
        if (authRole) {
          const mappedRole = roleNameMap[authRole] || 'vendedor';
          setRole({ 
            id: user.id, 
            name: mappedRole, 
            description: getRoleDescription(mappedRole) 
          });
          setIsLoading(false);
          return;
        }

        // CORRIGIDO: Buscar role diretamente de profiles
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.warn('Erro ao buscar role do usuário:', profileError.message);
          // Default to vendedor if error
          setRole({ id: '', name: 'vendedor', description: 'Vendedor' });
          setIsLoading(false);
          return;
        }

        if (!profile?.role) {
          // Default to vendedor if no role assigned
          setRole({ id: '', name: 'vendedor', description: 'Vendedor' });
          setIsLoading(false);
          return;
        }

        // Mapear role para nome padronizado
        const roleName = roleNameMap[profile.role] || 'vendedor';
        setRole({
          id: profile.id,
          name: roleName,
          description: getRoleDescription(roleName),
        });
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole({ id: '', name: 'vendedor', description: 'Vendedor' });
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserRole();
  }, [user, authRole]);

  /**
   * Get description for a role
   */
  function getRoleDescription(roleName: RoleName): string {
    const descriptions: Record<RoleName, string> = {
      admin: 'Administrador - Acesso total ao sistema',
      gerente: 'Gerente - Gerenciamento de equipe e relatórios',
      vendedor: 'Vendedor - Criação de orçamentos e pedidos',
      viewer: 'Visualizador - Apenas leitura',
    };
    return descriptions[roleName] || 'Vendedor';
  }

  /**
   * Check if user has permission to perform an action on a resource
   */
  const hasPermission = (action: string, resource: string): boolean => {
    if (!role) return false;

    const permissions = rolePermissions[role.name] || [];
    
    return permissions.some(p => 
      (p.action === '*' || p.action === action) &&
      (p.resource === '*' || p.resource === resource)
    );
  };

  /**
   * Check if user has any of the specified roles
   */
  const hasRole = (...roles: RoleName[]): boolean => {
    if (!role) return false;
    return roles.includes(role.name);
  };

  /**
   * Check if user is admin
   */
  const isAdmin = role?.name === 'admin';

  /**
   * Check if user is manager/gerente or above
   */
  const isManagerOrAbove = role?.name === 'admin' || role?.name === 'gerente';

  /**
   * Get all permissions for current role
   */
  const getPermissions = (): Permission[] => {
    if (!role) return [];
    return rolePermissions[role.name] || [];
  };

  return {
    role,
    isLoading,
    hasPermission,
    hasRole,
    isAdmin,
    isManagerOrAbove,
    getPermissions,
  };
}

export default useRBAC;
