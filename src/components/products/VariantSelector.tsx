import { useState } from "react";
import { useProductVariants, ProductVariant } from "@/hooks/useProductVariants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface VariantSelectorProps {
  productId: string;
  onSelect?: (variant: ProductVariant) => void;
  className?: string;
}

export function VariantSelector({ productId, onSelect, className }: VariantSelectorProps) {
  const { variants, isLoading, totalStock } = useProductVariants(productId);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (variants.length === 0) {
    return null;
  }

  const handleSelect = (variant: ProductVariant) => {
    setSelectedId(variant.id);
    onSelect?.(variant);
  };

  // Group variants by attribute (e.g., color, size)
  const colorVariants = variants.filter(v => v.color);
  const sizeVariants = variants.filter(v => v.size);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Color Variants */}
      {colorVariants.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Cor</h4>
          <div className="flex flex-wrap gap-2">
            {colorVariants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => handleSelect(variant)}
                disabled={variant.stock_quantity === 0}
                className={cn(
                  "relative w-10 h-10 rounded-full border-2 transition-all",
                  selectedId === variant.id ? "border-primary ring-2 ring-primary/20" : "border-muted",
                  variant.stock_quantity === 0 && "opacity-50 cursor-not-allowed"
                )}
                style={{ backgroundColor: variant.color?.hex_code }}
                title={variant.color?.name}
              >
                {selectedId === variant.id && (
                  <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-md" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Variants */}
      {sizeVariants.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Tamanho</h4>
          <div className="flex flex-wrap gap-2">
            {sizeVariants.map((variant) => (
              <Button
                key={variant.id}
                variant={selectedId === variant.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleSelect(variant)}
                disabled={variant.stock_quantity === 0}
                className="min-w-[3rem]"
              >
                {variant.size}
                {variant.stock_quantity === 0 && (
                  <Badge variant="destructive" className="ml-1 text-xs">
                    Esgotado
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Stock Info */}
      <div className="text-sm text-muted-foreground">
        {totalStock > 0 ? (
          <span className="text-green-600">{totalStock} unidades em estoque</span>
        ) : (
          <span className="text-red-600">Produto esgotado</span>
        )}
      </div>
    </div>
  );
}
