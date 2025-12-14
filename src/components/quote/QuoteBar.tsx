import { useNavigate } from "react-router-dom";
import { useQuoteContext } from "@/contexts/QuoteContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuoteBar() {
  const navigate = useNavigate();
  const { itemCount, getItemProducts, removeItemByIndex, clearQuote, getSubtotal } =
    useQuoteContext();

  const products = getItemProducts();
  const subtotal = getSubtotal();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (itemCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-xl animate-slide-up">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Products preview */}
          <div className="flex items-center gap-3 flex-1 overflow-x-auto">
            <div className="flex items-center gap-2 shrink-0">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">
                Orçamento ({itemCount} {itemCount === 1 ? "item" : "itens"})
              </span>
            </div>

            <div className="flex gap-2">
              {products.slice(0, 4).map((product, index) => (
                <div
                  key={`${product.id}-${index}`}
                  className="relative group flex items-center gap-2 bg-muted rounded-lg p-2 pr-8 shrink-0"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-10 h-10 rounded-md object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground max-w-[100px] truncate">
                      {product.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {product.quoteItem.quantity} un.
                    </span>
                  </div>
                  <button
                    onClick={() => removeItemByIndex(index)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ))}

              {products.length > 4 && (
                <div className="flex items-center justify-center px-3 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    +{products.length - 4} itens
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Subtotal and actions */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-muted-foreground">Subtotal</p>
              <p className="text-lg font-bold text-primary">
                {formatCurrency(subtotal)}
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={clearQuote}
              className="text-muted-foreground"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Limpar
            </Button>
            <Button size="sm" onClick={() => navigate("/orcamento")}>
              <FileText className="h-4 w-4 mr-2" />
              Ver Orçamento
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}