import { useState } from "react";
import { Heart, Share2, Eye, Package, Layers, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Product } from "@/data/mockData";
import { toast } from "sonner";

export interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  onView?: (product: Product) => void;
  onShare?: (product: Product) => void;
  onFavorite?: (product: Product) => void;
  highlightColors?: string[];
  isFavorited?: boolean;
  onToggleFavorite?: (productId: string) => void;
  isInCompare?: boolean;
  onToggleCompare?: (productId: string) => { added: boolean; isFull: boolean };
  canAddToCompare?: boolean;
}

export function ProductCard({ 
  product, 
  onClick, 
  onView, 
  onShare, 
  onFavorite, 
  highlightColors,
  isFavorited = false,
  onToggleFavorite,
  isInCompare = false,
  onToggleCompare,
  canAddToCompare = true
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(product.id);
      toast.success(
        isFavorited 
          ? `"${product.name}" removido dos favoritos` 
          : `"${product.name}" adicionado aos favoritos`
      );
    } else {
      onFavorite?.(product);
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleCompare) {
      const result = onToggleCompare(product.id);
      if (result.isFull) {
        toast.error("Limite de 4 produtos para comparação atingido");
      } else {
        toast.success(
          result.added
            ? `"${product.name}" adicionado à comparação`
            : `"${product.name}" removido da comparação`
        );
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'in-stock';
      case 'low-stock':
        return 'low-stock';
      case 'out-of-stock':
        return 'out-of-stock';
      default:
        return 'in-stock';
    }
  };

  const getStockStatusLabel = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'Em estoque';
      case 'low-stock':
        return 'Estoque baixo';
      case 'out-of-stock':
        return 'Sem estoque';
      default:
        return 'Em estoque';
    }
  };

  const hasHighlightedColor = highlightColors?.some(group =>
    product.colors.some(color => color.group === group)
  );

  return (
    <article
      className={cn(
        "card-interactive group overflow-hidden cursor-pointer",
        product.featured && "ring-2 ring-primary/20",
        hasHighlightedColor && "ring-2 ring-success/30"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-secondary/30">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.featured && (
            <Badge className="bg-primary text-primary-foreground text-xs">
              Destaque
            </Badge>
          )}
          {product.newArrival && (
            <Badge className="bg-info text-info-foreground text-xs">
              Novidade
            </Badge>
          )}
          {product.onSale && (
            <Badge className="bg-destructive text-destructive-foreground text-xs">
              Promoção
            </Badge>
          )}
          {product.isKit && (
            <Badge className="bg-warning text-warning-foreground text-xs">
              <Layers className="h-3 w-3 mr-1" />
              KIT
            </Badge>
          )}
        </div>

        {/* Quick actions */}
        <div
          className={cn(
            "absolute top-3 right-3 flex flex-col gap-1.5 transition-all duration-300",
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
          )}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-card/90 backdrop-blur-sm hover:bg-card"
                onClick={handleFavorite}
              >
                <Heart
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isFavorited && "fill-destructive text-destructive"
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className={cn(
                  "h-8 w-8 bg-card/90 backdrop-blur-sm hover:bg-card",
                  isInCompare && "bg-primary/20 hover:bg-primary/30"
                )}
                onClick={handleCompare}
                disabled={!isInCompare && !canAddToCompare}
              >
                <GitCompare
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isInCompare && "text-primary"
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isInCompare ? "Remover da comparação" : "Adicionar à comparação"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-card/90 backdrop-blur-sm hover:bg-card"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare?.(product);
                }}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Compartilhar</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-card/90 backdrop-blur-sm hover:bg-card"
                onClick={(e) => {
                  e.stopPropagation();
                  onView?.(product);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ver detalhes</TooltipContent>
          </Tooltip>
        </div>

        {/* Color variations */}
        {product.colors.length > 0 && (
          <div
            className={cn(
              "absolute bottom-3 left-3 right-3 flex items-center gap-1 transition-all duration-300",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            )}
          >
            <div className="flex items-center gap-1 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1">
              {product.colors.slice(0, 5).map((color, idx) => (
                <Tooltip key={idx}>
                  <TooltipTrigger asChild>
                    <div
                      className="w-4 h-4 rounded-full border border-border shadow-sm cursor-pointer hover:scale-125 transition-transform"
                      style={{ 
                        backgroundColor: color.hex,
                        border: color.hex === '#FFFFFF' ? '1px solid hsl(var(--border))' : undefined
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>{color.name}</TooltipContent>
                </Tooltip>
              ))}
              {product.colors.length > 5 && (
                <span className="text-xs text-muted-foreground ml-1">
                  +{product.colors.length - 5}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category & Supplier */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {product.category.icon} {product.category.name}
          </span>
          <span className="supplier-badge">
            {product.supplier.name}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-display font-semibold text-foreground line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* SKU */}
        <p className="text-xs text-muted-foreground font-mono">
          SKU: {product.sku}
        </p>

        {/* Price & Stock */}
        <div className="flex items-end justify-between">
          <div>
            <span className="price-tag-small">
              {formatPrice(product.price)}
            </span>
            <p className="text-xs text-muted-foreground">
              Mín. {product.minQuantity} un.
            </p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className={cn("stock-indicator", getStockStatusColor(product.stockStatus))}>
              <Package className="h-3 w-3" />
              {getStockStatusLabel(product.stockStatus)}
            </span>
            <span className="text-xs text-muted-foreground">
              {product.stock.toLocaleString('pt-BR')} un.
            </span>
          </div>
        </div>

        {/* Materials */}
        <div className="flex flex-wrap gap-1">
          {product.materials.slice(0, 2).map((material) => (
            <span
              key={material}
              className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
            >
              {material}
            </span>
          ))}
          {product.materials.length > 2 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
              +{product.materials.length - 2}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
