import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Plus, 
  ArrowUpDown, 
  Download, 
  Share2, 
  Check, 
  Minus,
  Sparkles,
  GripVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Product } from "@/data/mockData";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ComparisonTableProps {
  products: Product[];
  onRemoveProduct: (productId: string) => void;
  onAddProduct?: () => void;
  onReorder?: (products: Product[]) => void;
  maxProducts?: number;
  className?: string;
}

interface ComparisonAttribute {
  key: string;
  label: string;
  getValue: (product: Product) => string | number | boolean | string[];
  type: "text" | "price" | "boolean" | "list" | "color";
}

const attributes: ComparisonAttribute[] = [
  {
    key: "price",
    label: "Preço",
    getValue: (p) => p.price,
    type: "price",
  },
  {
    key: "minQuantity",
    label: "Quantidade Mínima",
    getValue: (p) => p.minQuantity,
    type: "text",
  },
  {
    key: "category",
    label: "Categoria",
    getValue: (p) => p.category.name,
    type: "text",
  },
  {
    key: "supplier",
    label: "Fornecedor",
    getValue: (p) => p.supplier.name,
    type: "text",
  },
  {
    key: "materials",
    label: "Materiais",
    getValue: (p) => p.materials,
    type: "list",
  },
  {
    key: "colors",
    label: "Cores Disponíveis",
    getValue: (p) => p.colors.length,
    type: "text",
  },
  {
    key: "stock",
    label: "Estoque",
    getValue: (p) => p.stock,
    type: "text",
  },
  {
    key: "stockStatus",
    label: "Disponibilidade",
    getValue: (p) => p.stockStatus,
    type: "text",
  },
  {
    key: "isKit",
    label: "Kit",
    getValue: (p) => p.isKit,
    type: "boolean",
  },
  {
    key: "featured",
    label: "Destaque",
    getValue: (p) => p.featured || false,
    type: "boolean",
  },
];

function SortableProductColumn({
  product,
  onRemove,
  highlights,
}: {
  product: Product;
  onRemove: () => void;
  highlights: Set<string>;
}) {
  const {
    attributes: dndAttributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const imageUrl = product.images?.[0] || "/placeholder.svg";

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "min-w-[200px] flex-shrink-0",
        isDragging && "z-50 opacity-80"
      )}
    >
      {/* Product header */}
      <div className="relative p-4 bg-muted/50 rounded-t-lg border border-b-0">
        {/* Drag handle */}
        <button
          {...dndAttributes}
          {...listeners}
          className="absolute top-2 left-2 p-1 rounded hover:bg-muted cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* Remove button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Product image */}
        <div className="aspect-square rounded-lg overflow-hidden bg-background mt-4 mb-3">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product name */}
        <h3 className="font-semibold text-sm line-clamp-2 text-center">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground text-center mt-1">
          SKU: {product.sku}
        </p>
      </div>

      {/* Attributes */}
      <div className="border rounded-b-lg divide-y">
        {attributes.map((attr) => {
          const value = attr.getValue(product);
          const isHighlighted = highlights.has(attr.key);

          return (
            <div
              key={attr.key}
              className={cn(
                "p-3 text-sm transition-colors",
                isHighlighted && "bg-primary/5"
              )}
            >
              <AttributeValue
                value={value}
                type={attr.type}
                isHighlighted={isHighlighted}
              />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function AttributeValue({
  value,
  type,
  isHighlighted,
}: {
  value: string | number | boolean | string[];
  type: ComparisonAttribute["type"];
  isHighlighted: boolean;
}) {
  if (type === "price") {
    return (
      <span className={cn("font-semibold", isHighlighted && "text-primary")}>
        R$ {(value as number).toFixed(2)}
      </span>
    );
  }

  if (type === "boolean") {
    return value ? (
      <Check className={cn("h-4 w-4", isHighlighted ? "text-primary" : "text-green-500")} />
    ) : (
      <Minus className="h-4 w-4 text-muted-foreground" />
    );
  }

  if (type === "list" && Array.isArray(value)) {
    return (
      <div className="flex flex-wrap gap-1">
        {value.slice(0, 3).map((item, i) => (
          <Badge key={i} variant="secondary" className="text-xs">
            {item}
          </Badge>
        ))}
        {value.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{value.length - 3}
          </Badge>
        )}
      </div>
    );
  }

  const stockStatusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
    "in-stock": { label: "Em estoque", variant: "default" },
    "low-stock": { label: "Estoque baixo", variant: "secondary" },
    "out-of-stock": { label: "Sem estoque", variant: "destructive" },
  };

  if (value && typeof value === "string" && stockStatusLabels[value]) {
    const { label, variant } = stockStatusLabels[value];
    return <Badge variant={variant} className="text-xs">{label}</Badge>;
  }

  return (
    <span className={cn(isHighlighted && "text-primary font-medium")}>
      {String(value)}
    </span>
  );
}

export function ComparisonTable({
  products,
  onRemoveProduct,
  onAddProduct,
  onReorder,
  maxProducts = 4,
  className,
}: ComparisonTableProps) {
  const [orderedProducts, setOrderedProducts] = useState(products);
  const [showHighlights, setShowHighlights] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update ordered products when products change
  useMemo(() => {
    setOrderedProducts(products);
  }, [products]);

  // Calculate differences/highlights
  const highlights = useMemo(() => {
    if (!showHighlights || products.length < 2) return new Set<string>();

    const diff = new Set<string>();
    
    attributes.forEach((attr) => {
      const values = products.map((p) => JSON.stringify(attr.getValue(p)));
      const uniqueValues = new Set(values);
      
      if (uniqueValues.size > 1) {
        diff.add(attr.key);
      }
    });

    return diff;
  }, [products, showHighlights]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = orderedProducts.findIndex((p) => p.id === active.id);
      const newIndex = orderedProducts.findIndex((p) => p.id === over.id);
      const newOrder = arrayMove(orderedProducts, oldIndex, newIndex);
      setOrderedProducts(newOrder);
      onReorder?.(newOrder);
    }
  };

  const canAddMore = products.length < maxProducts;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ArrowUpDown className="h-5 w-5" />
          Comparar Produtos ({products.length}/{maxProducts})
        </CardTitle>
        
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showHighlights ? "default" : "outline"}
                size="sm"
                onClick={() => setShowHighlights(!showHighlights)}
                className="gap-1"
              >
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Destacar diferenças</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Destaca automaticamente as diferenças entre produtos
            </TooltipContent>
          </Tooltip>

          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">PDF</span>
          </Button>

          <Button variant="outline" size="sm" className="gap-1">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Compartilhar</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <ArrowUpDown className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">Nenhum produto para comparar</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Adicione produtos à comparação para ver as diferenças
            </p>
            {onAddProduct && (
              <Button onClick={onAddProduct} className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Produto
              </Button>
            )}
          </div>
        ) : (
          <ScrollArea className="w-full">
            <div className="flex gap-4 p-4">
              {/* Attribute labels column */}
              <div className="min-w-[140px] flex-shrink-0">
                <div className="p-4 bg-muted/30 rounded-t-lg border border-b-0 h-[calc(200px+2rem)]" />
                <div className="border rounded-b-lg divide-y">
                  {attributes.map((attr) => (
                    <div
                      key={attr.key}
                      className={cn(
                        "p-3 text-sm font-medium transition-colors",
                        highlights.has(attr.key) && showHighlights && "bg-primary/5 text-primary"
                      )}
                    >
                      {attr.label}
                      {highlights.has(attr.key) && showHighlights && (
                        <Sparkles className="h-3 w-3 inline ml-1" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Product columns (sortable) */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={orderedProducts.map((p) => p.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  <AnimatePresence mode="popLayout">
                    {orderedProducts.map((product) => (
                      <SortableProductColumn
                        key={product.id}
                        product={product}
                        onRemove={() => onRemoveProduct(product.id)}
                        highlights={highlights}
                      />
                    ))}
                  </AnimatePresence>
                </SortableContext>
              </DndContext>

              {/* Add product column */}
              {canAddMore && onAddProduct && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="min-w-[200px] flex-shrink-0"
                >
                  <button
                    onClick={onAddProduct}
                    className="w-full h-full min-h-[400px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-3 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    <Plus className="h-8 w-8" />
                    <span className="text-sm font-medium">Adicionar Produto</span>
                  </button>
                </motion.div>
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
