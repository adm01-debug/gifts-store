import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Minus, 
  ShoppingCart, 
  X, 
  Check, 
  FileText,
  ArrowRight,
  Trash2,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Product } from "@/data/mockData";

interface QuickQuoteItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

interface QuickQuoteProps {
  items: QuickQuoteItem[];
  onAddItem: (product: Product, quantity?: number) => void;
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearAll: () => void;
  onCreateQuote: () => void;
  className?: string;
}

export function QuickQuote({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateQuantity,
  onClearAll,
  onCreateQuote,
  className,
}: QuickQuoteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCreateQuote = () => {
    onCreateQuote();
    setIsOpen(false);
    toast({
      title: "Orçamento criado!",
      description: `${items.length} produto(s) adicionados ao orçamento.`,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="lg"
          className={cn(
            "fixed bottom-6 right-6 z-40 h-14 rounded-full shadow-lg gap-2",
            "hover:shadow-xl transition-all",
            className
          )}
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="font-semibold">Orçamento Rápido</span>
          {totalItems > 0 && (
            <Badge 
              variant="secondary" 
              className="ml-1 bg-background text-foreground"
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Orçamento Rápido
            {items.length > 0 && (
              <Badge variant="secondary">{items.length} itens</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">Nenhum produto adicionado</h3>
            <p className="text-muted-foreground text-sm max-w-[250px]">
              Adicione produtos ao orçamento rápido clicando no botão "+" nos cards de produto
            </p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <QuickQuoteItemRow
                    key={item.product.id}
                    item={item}
                    index={index}
                    onUpdateQuantity={(qty) => onUpdateQuantity(item.product.id, qty)}
                    onRemove={() => onRemoveItem(item.product.id)}
                  />
                ))}
              </AnimatePresence>
            </ScrollArea>

            <div className="mt-auto pt-4">
              <Separator className="mb-4" />

              {/* Summary */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R$ {totalValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total Estimado</span>
                  <span className="text-primary">R$ {totalValue.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearAll}
                  className="gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Limpar
                </Button>
                <Button
                  onClick={handleCreateQuote}
                  className="flex-1 gap-2"
                >
                  Criar Orçamento
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function QuickQuoteItemRow({
  item,
  index,
  onUpdateQuantity,
  onRemove,
}: {
  item: QuickQuoteItem;
  index: number;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}) {
  const { product, quantity } = item;
  const imageUrl = product.images?.[0] || "/placeholder.svg";
  const minQty = product.minQuantity || 1;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.05 }}
      className="flex gap-3 py-3 border-b last:border-0"
    >
      {/* Image */}
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm line-clamp-1">{product.name}</p>
        <p className="text-xs text-muted-foreground">
          SKU: {product.sku}
        </p>
        <p className="text-sm font-semibold text-primary mt-1">
          R$ {product.price.toFixed(2)} /un
        </p>
      </div>

      {/* Quantity controls */}
      <div className="flex flex-col items-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onUpdateQuantity(Math.max(minQty, quantity - 1))}
            disabled={quantity <= minQty}
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          <Input
            type="number"
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value) || minQty;
              onUpdateQuantity(Math.max(minQty, val));
            }}
            className="w-14 h-7 text-center text-sm"
            min={minQty}
          />
          
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onUpdateQuantity(quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Min: {minQty}
        </p>
      </div>
    </motion.div>
  );
}

// Hook to manage quick quote state
export function useQuickQuote() {
  const [items, setItems] = useState<QuickQuoteItem[]>([]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      const minQty = product.minQuantity || 1;
      return [...prev, { product, quantity: Math.max(minQty, quantity) }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  const isInQuote = useCallback(
    (productId: string) => items.some((item) => item.product.id === productId),
    [items]
  );

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearAll,
    isInQuote,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalValue: items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ),
  };
}
