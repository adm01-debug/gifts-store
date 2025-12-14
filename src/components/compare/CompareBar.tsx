import { useNavigate } from "react-router-dom";
import { useComparisonContext } from "@/contexts/ComparisonContext";
import { Button } from "@/components/ui/button";
import { X, GitCompare, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function CompareBar() {
  const navigate = useNavigate();
  const { compareCount, maxItems, getCompareProducts, removeFromCompare, clearCompare } =
    useComparisonContext();

  const products = getCompareProducts();

  if (compareCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-xl animate-slide-up">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Products preview */}
          <div className="flex items-center gap-3 flex-1 overflow-x-auto">
            <div className="flex items-center gap-2 shrink-0">
              <GitCompare className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">
                Comparar ({compareCount}/{maxItems})
              </span>
            </div>

            <div className="flex gap-2">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="relative group flex items-center gap-2 bg-muted rounded-lg p-2 pr-8 shrink-0"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-10 h-10 rounded-md object-cover"
                  />
                  <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                    {product.name}
                  </span>
                  <button
                    onClick={() => removeFromCompare(product.id)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ))}

              {/* Empty slots */}
              {Array.from({ length: maxItems - compareCount }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="w-[160px] h-[58px] rounded-lg border-2 border-dashed border-border flex items-center justify-center shrink-0"
                >
                  <span className="text-xs text-muted-foreground">
                    + Adicionar
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCompare}
              className="text-muted-foreground"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Limpar
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/comparar")}
              disabled={compareCount < 2}
            >
              <GitCompare className="h-4 w-4 mr-2" />
              Comparar {compareCount >= 2 ? `(${compareCount})` : ""}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}