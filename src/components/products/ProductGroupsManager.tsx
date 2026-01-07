import { useState } from "react";
import { useProductGroups, useProductGroupMembers, ProductGroup } from "@/hooks/useProductGroups";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  FolderTree,
  Plus,
  ChevronDown,
  ChevronRight,
  Users,
  Trash2,
  Pencil,
} from "lucide-react";

export function ProductGroupsManager() {
  const { groups, isLoading, createGroup, deleteGroup } = useProductGroups();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({
    group_code: "",
    group_name: "",
    description: "",
    is_active: true,
  });

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const handleCreate = () => {
    createGroup.mutate(newGroup, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setNewGroup({ group_code: "", group_name: "", description: "", is_active: true });
      },
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FolderTree className="h-5 w-5" />
          Grupos de Produtos
        </CardTitle>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Novo Grupo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Grupo de Produtos</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Código</label>
                <Input
                  value={newGroup.group_code}
                  onChange={(e) => setNewGroup({ ...newGroup, group_code: e.target.value })}
                  placeholder="Ex: CANETAS"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Nome</label>
                <Input
                  value={newGroup.group_name}
                  onChange={(e) => setNewGroup({ ...newGroup, group_name: e.target.value })}
                  placeholder="Ex: Canetas Personalizadas"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Input
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  placeholder="Descrição opcional"
                />
              </div>
              <Button onClick={handleCreate} className="w-full" disabled={createGroup.isPending}>
                Criar Grupo
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {groups.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FolderTree className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nenhum grupo cadastrado</p>
          </div>
        ) : (
          <div className="space-y-2">
            {groups.map((group) => (
              <GroupItem
                key={group.id}
                group={group}
                isExpanded={expandedGroups.has(group.id)}
                onToggle={() => toggleGroup(group.id)}
                onDelete={() => deleteGroup.mutate(group.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function GroupItem({
  group,
  isExpanded,
  onToggle,
  onDelete,
}: {
  group: ProductGroup;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const { members, isLoading } = useProductGroupMembers(isExpanded ? group.id : undefined);

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div className="rounded-lg border">
        <CollapsibleTrigger asChild>
          <div className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/50 transition-colors">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{group.group_name}</span>
                <Badge variant="outline" className="text-xs">
                  {group.group_code}
                </Badge>
              </div>
              {group.description && (
                <p className="text-sm text-muted-foreground">{group.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {isLoading ? "..." : members.length}
              </Badge>
              <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t p-3 bg-muted/30">
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : members.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-2">
                Nenhum produto neste grupo
              </p>
            ) : (
              <div className="space-y-1">
                {members.map((member) => (
                  <div key={member.id} className="text-sm flex justify-between items-center">
                    <span>Produto ID: {member.product_id.slice(0, 8)}...</span>
                    <Badge variant={member.use_group_rules ? "default" : "outline"}>
                      {member.use_group_rules ? "Usa regras do grupo" : "Regras próprias"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
