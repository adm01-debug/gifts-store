import { useState } from "react";
import { useRoles, usePermissions, useRolePermissions, Role } from "@/hooks/useRoles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Shield, Plus, Trash2, Settings } from "lucide-react";

export function RolesManager() {
  const { roles, isLoading, createRole, deleteRole } = useRoles();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", description: "" });

  const handleCreate = () => {
    createRole.mutate(newRole, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setNewRole({ name: "", description: "" });
      },
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Papéis do Sistema
          </CardTitle>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" />Novo</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Criar Novo Papel</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <Input
                  placeholder="Nome do papel"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                />
                <Input
                  placeholder="Descrição"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                />
                <Button onClick={handleCreate} className="w-full" disabled={!newRole.name}>
                  Criar Papel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {roles.map((role) => (
              <div
                key={role.id}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedRole?.id === role.id ? "border-primary bg-primary/5" : "hover:bg-accent/50"
                }`}
                onClick={() => setSelectedRole(role)}
              >
                <div>
                  <p className="font-medium">{role.name}</p>
                  {role.description && (
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setSelectedRole(role); }}>
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={(e) => { e.stopPropagation(); deleteRole.mutate(role.id); }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedRole && <RolePermissionsPanel role={selectedRole} />}
    </div>
  );
}

function RolePermissionsPanel({ role }: { role: Role }) {
  const { permissions, byCategory } = usePermissions();
  const { rolePermissions, assignPermission, removePermission } = useRolePermissions(role.id);

  const assignedIds = new Set(rolePermissions.map((rp) => rp.permission_id));

  const handleToggle = (permissionId: string) => {
    const existing = rolePermissions.find((rp) => rp.permission_id === permissionId);
    if (existing) {
      removePermission.mutate(existing.id);
    } else {
      assignPermission.mutate({ roleId: role.id, permissionId });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Permissões: {role.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(byCategory).map(([category, perms]) => (
          <div key={category}>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">{category}</h4>
            <div className="space-y-2">
              {perms.map((perm) => (
                <div key={perm.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={assignedIds.has(perm.id)}
                    onCheckedChange={() => handleToggle(perm.id)}
                  />
                  <span className="text-sm">{perm.name}</span>
                  <Badge variant="outline" className="text-xs">{perm.code}</Badge>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
