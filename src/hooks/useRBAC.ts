import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type RoleName = 'admin' | 'manager' | 'seller' | 'viewer';

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
  manager: [
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
  seller: [
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

export function useRBAC() {
  const { user } = useAuth();
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
        // Get user profile with role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role_id')
          .eq('user_id', user.id)
          .single();

        if (profileError || !profile?.role_id) {
          // Default to seller if no role assigned
          setRole({ id: '', name: 'seller', description: 'Vendedor' });
          setIsLoading(false);
          return;
        }

        // Get role details
        const { data: roleData, error: roleError } = await supabase
          .from('roles')
          .select('*')
          .eq('id', profile.role_id)
          .single();

        if (roleError || !roleData) {
          setRole({ id: '', name: 'seller', description: 'Vendedor' });
        } else {
          setRole({
            id: roleData.id,
            name: roleData.name as RoleName,
            description: roleData.description,
          });
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole({ id: '', name: 'seller', description: 'Vendedor' });
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserRole();
  }, [user]);

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
   * Check if user is manager or above
   */
  const isManagerOrAbove = role?.name === 'admin' || role?.name === 'manager';

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
