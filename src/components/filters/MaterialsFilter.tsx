import { useMaterials, useMaterialGroups } from "@/hooks/useMaterials";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Layers } from "lucide-react";
import { useState } from "react";

interface MaterialsFilterProps {
  selectedMaterials: string[];
  onMaterialChange: (materialId: string) => void;
  className?: string;
}

export function MaterialsFilter({ selectedMaterials, onMaterialChange, className }: MaterialsFilterProps) {
  const { materials, isLoading } = useMaterials();
  const { data: groups, isLoading: loadingGroups } = useMaterialGroups();
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  if (isLoading || loadingGroups) {
    return (
      <div className={className}>
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Agrupar materiais por grupo
  const materialsByGroup = materials.reduce((acc, material) => {
    const groupId = material.material_group_id || "sem-grupo";
    if (!acc[groupId]) {
      acc[groupId] = [];
    }
    acc[groupId].push(material);
    return acc;
  }, {} as Record<string, typeof materials>);

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-3">
        <Layers className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Materiais</span>
      </div>
      
      <div className="space-y-2">
        {groups?.map((group) => {
          const groupMaterials = materialsByGroup[group.id] || [];
          if (groupMaterials.length === 0) return null;
          
          const isOpen = openGroups.includes(group.id);
          
          return (
            <Collapsible key={group.id} open={isOpen} onOpenChange={() => toggleGroup(group.id)}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted rounded-md">
                <span className="text-sm font-medium">{group.name}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-4 space-y-1 mt-1">
                {groupMaterials.map((material) => (
                  <div key={material.id} className="flex items-center gap-2">
                    <Checkbox
                      id={material.id}
                      checked={selectedMaterials.includes(material.id)}
                      onCheckedChange={() => onMaterialChange(material.id)}
                    />
                    <Label htmlFor={material.id} className="text-sm cursor-pointer">
                      {material.name}
                    </Label>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
        
        {/* Materiais sem grupo */}
        {materialsByGroup["sem-grupo"]?.map((material) => (
          <div key={material.id} className="flex items-center gap-2 p-1">
            <Checkbox
              id={material.id}
              checked={selectedMaterials.includes(material.id)}
              onCheckedChange={() => onMaterialChange(material.id)}
            />
            <Label htmlFor={material.id} className="text-sm cursor-pointer">
              {material.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
