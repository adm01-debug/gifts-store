import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface Role {
  id: string;
  name: string;
}

interface Permission {
  id: string;
  code: string;
  name: string;
  category: string;
}

interface RolePermission {
  role: string;
  permission_id: string;
}

export function PermissionMatrix() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rolesRes, permissionsRes, rolePermissionsRes] = await Promise.all([
        supabase.from('roles').select('*').order('name'),
        supabase.from('permissions').select('*').order('category', { ascending: true }),
        supabase.from('role_permissions').select('*'),
      ]);

      if (rolesRes.error) throw rolesRes.error;
      if (permissionsRes.error) throw permissionsRes.error;
      if (rolePermissionsRes.error) throw rolePermissionsRes.error;

      setRoles(rolesRes.data || []);
      setPermissions(permissionsRes.data || []);
      setRolePermissions(rolePermissionsRes.data || []);
    } catch (error: any) {
      toast({ title: 'Erro ao carregar dados', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (roleName: string, permissionId: string) => {
    return rolePermissions.some((rp) => rp.role === roleName && rp.permission_id === permissionId);
  };

  const togglePermission = async (roleName: string, permissionId: string) => {
    const exists = hasPermission(roleName, permissionId);
    const roleValue = roleName as 'admin' | 'vendedor';

    try {
      if (exists) {
        const { error } = await supabase
          .from('role_permissions')
          .delete()
          .eq('role', roleValue)
          .eq('permission_id', permissionId);
        if (error) throw error;
        setRolePermissions((prev) => prev.filter((rp) => !(rp.role === roleName && rp.permission_id === permissionId)));
      } else {
        const { error } = await supabase.from('role_permissions').insert([{ role: roleValue, permission_id: permissionId }]);
        if (error) throw error;
        setRolePermissions((prev) => [...prev, { role: roleName, permission_id: permissionId }]);
      }
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    }
  };

  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Matriz de Permissões</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Permissão</th>
                {roles.map((role) => (
                  <th key={role.id} className="text-center p-2 min-w-[100px]">
                    <Badge variant="outline">{role.name}</Badge>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedPermissions).map(([category, perms]) => (
                <>
                  <tr key={category} className="bg-muted/50">
                    <td colSpan={roles.length + 1} className="p-2 font-medium capitalize">
                      {category}
                    </td>
                  </tr>
                  {perms.map((perm) => (
                    <tr key={perm.id} className="border-b">
                      <td className="p-2">
                        <div>
                          <span className="font-medium">{perm.name}</span>
                          <span className="text-muted-foreground text-xs ml-2">({perm.code})</span>
                        </div>
                      </td>
                      {roles.map((role) => (
                        <td key={role.id} className="text-center p-2">
                          <Checkbox
                            checked={hasPermission(role.name, perm.id)}
                            onCheckedChange={() => togglePermission(role.name, perm.id)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
