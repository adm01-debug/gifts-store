import { useMaterials } from "@/hooks/useMaterials";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Package } from "lucide-react";

interface ProductMaterialsListProps {
  productId: string;
  className?: string;
}

export function ProductMaterialsList({ productId, className }: ProductMaterialsListProps) {
  // TODO: Create useProductMaterials hook for N:N relationship
  const { materials, isLoading } = useMaterials();

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-32" />
      </div>
    );
  }

  // Placeholder - replace with actual product materials
  const productMaterials = materials.slice(0, 3);

  if (productMaterials.length === 0) {
    return (
      <div className="text-muted-foreground text-sm flex items-center gap-2">
        <Package className="h-4 w-4" />
        Materiais não especificados
      </div>
    );
  }

  return (
    <div className={className}>
      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
        <Package className="h-4 w-4" />
        Materiais
      </h4>
      <div className="flex flex-wrap gap-2">
        {productMaterials.map((material) => (
          <Badge key={material.id} variant="secondary">
            {material.name}
            {material.material_group && (
              <span className="text-muted-foreground ml-1">
                ({material.material_group.name})
              </span>
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
}
