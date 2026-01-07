import { useState } from "react";
import { useProductComponents, ProductComponent } from "@/hooks/useProductComponents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Layers,
  Plus,
  GripVertical,
  Pencil,
  Trash2,
  Image,
} from "lucide-react";

interface ProductComponentsListProps {
  productId: string;
  onAddComponent?: () => void;
  onEditComponent?: (component: ProductComponent) => void;
}

export function ProductComponentsList({
  productId,
  onAddComponent,
  onEditComponent,
}: ProductComponentsListProps) {
  const { components, isLoading, updateComponent, deleteComponent } =
    useProductComponents(productId);

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
          <Layers className="h-5 w-5" />
          Componentes do Produto
        </CardTitle>
        {onAddComponent && (
          <Button size="sm" onClick={onAddComponent}>
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {components.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Layers className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nenhum componente cadastrado</p>
          </div>
        ) : (
          <div className="space-y-2">
            {components.map((component) => (
              <div
                key={component.id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                
                {component.image_url ? (
                  <img
                    src={component.image_url}
                    alt={component.component_name}
                    className="h-12 w-12 rounded object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                    <Image className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{component.component_name}</span>
                    <Badge variant="outline" className="text-xs">
                      {component.component_code}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {component.is_personalizable && (
                      <Badge variant="secondary" className="text-xs">
                        Personalizável
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={component.is_active}
                    onCheckedChange={(checked) =>
                      updateComponent.mutate({
                        id: component.id,
                        updates: { is_active: checked },
                      })
                    }
                  />
                  {onEditComponent && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditComponent(component)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => deleteComponent.mutate(component.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
