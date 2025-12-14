import { useState } from "react";
import { Package, Image, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { KitItem } from "@/data/mockData";

interface KitCompositionProps {
  items: KitItem[];
  onSelectItems: (selectedItems: KitItem[]) => void;
}

export function KitComposition({ items, onSelectItems }: KitCompositionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const toggleItem = (productId: string) => {
    const newSelected = selectedItems.includes(productId)
      ? selectedItems.filter((id) => id !== productId)
      : [...selectedItems, productId];
    
    setSelectedItems(newSelected);
    setSelectAll(newSelected.length === items.length);
    onSelectItems(items.filter((item) => newSelected.includes(item.productId)));
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
      onSelectItems([]);
    } else {
      const allIds = items.map((item) => item.productId);
      setSelectedItems(allIds);
      onSelectItems(items);
    }
    setSelectAll(!selectAll);
  };

  return (
    <div className="card-elevated overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-secondary/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-warning" />
            </div>
            <div className="text-left">
              <h3 className="font-display font-semibold text-foreground">
                Composição do KIT
              </h3>
              <p className="text-sm text-muted-foreground">
                {items.length} itens inclusos
              </p>
            </div>
          </div>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t border-border">
            {/* Header actions */}
            <div className="flex items-center justify-between px-4 py-3 bg-secondary/30">
              <span className="text-sm text-muted-foreground">
                {selectedItems.length} de {items.length} selecionados
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                className={cn(
                  selectAll && "bg-primary/10 text-primary"
                )}
              >
                {selectAll ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Desmarcar Todos
                  </>
                ) : (
                  "Selecionar Todos"
                )}
              </Button>
            </div>

            {/* Items list */}
            <div className="divide-y divide-border">
              {items.map((item) => {
                const isSelected = selectedItems.includes(item.productId);

                return (
                  <button
                    key={item.productId}
                    onClick={() => toggleItem(item.productId)}
                    className={cn(
                      "flex items-center gap-4 w-full p-4 text-left transition-colors",
                      isSelected ? "bg-primary/5" : "hover:bg-secondary/50"
                    )}
                  >
                    {/* Checkbox */}
                    <div
                      className={cn(
                        "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                        isSelected
                          ? "bg-primary border-primary"
                          : "border-border"
                      )}
                    >
                      {isSelected && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>

                    {/* Item image placeholder */}
                    <div className="w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0">
                      <Image className="h-5 w-5 text-muted-foreground" />
                    </div>

                    {/* Item info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {item.quantity}x
                        </span>
                        <span className="text-sm text-foreground truncate">
                          {item.productName}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">
                        SKU: {item.sku}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
