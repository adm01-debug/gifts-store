import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Heart, 
  Package, 
  Truck, 
  Shield, 
  Tag,
  Layers,
  Star
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductVariations } from "@/components/products/ProductVariations";
import { KitComposition } from "@/components/products/KitComposition";
import { ShareActions } from "@/components/products/ShareActions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PRODUCTS, type Product, type ProductVariation, type KitItem } from "@/data/mockData";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [selectedKitItems, setSelectedKitItems] = useState<KitItem[]>([]);

  // Encontrar produto
  const product = useMemo(() => {
    return PRODUCTS.find((p) => p.id === id);
  }, [id]);

  if (!product) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">
            Produto não encontrado
          </h2>
          <p className="text-muted-foreground mb-4">
            O produto que você está procurando não existe ou foi removido.
          </p>
          <Button onClick={() => navigate("/")}>Voltar para Vitrine</Button>
        </div>
      </MainLayout>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const getStockStatusInfo = (status: string) => {
    switch (status) {
      case "in-stock":
        return { label: "Em estoque", class: "stock-indicator in-stock" };
      case "low-stock":
        return { label: "Estoque baixo", class: "stock-indicator low-stock" };
      case "out-of-stock":
        return { label: "Sem estoque", class: "stock-indicator out-of-stock" };
      default:
        return { label: "Consultar", class: "stock-indicator" };
    }
  };

  const stockInfo = getStockStatusInfo(product.stockStatus);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: product.name,
    });
  };

  // Imagens a exibir (variação selecionada ou todas do produto)
  const displayImages = selectedVariation
    ? [selectedVariation.image, ...product.images.filter((img) => img !== selectedVariation.image)]
    : product.images;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Breadcrumb / Back button */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span
              className="hover:text-foreground cursor-pointer"
              onClick={() => navigate("/")}
            >
              Vitrine
            </span>
            <span>/</span>
            <span
              className="hover:text-foreground cursor-pointer"
              onClick={() => navigate(`/?category=${product.category.id}`)}
            >
              {product.category.icon} {product.category.name}
            </span>
            <span>/</span>
            <span className="text-foreground truncate">{product.name}</span>
          </div>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left column - Gallery */}
          <div className="space-y-4">
            <ProductGallery
              images={displayImages}
              video={product.video}
              productName={product.name}
            />
          </div>

          {/* Right column - Info */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-3">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {product.featured && (
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    Destaque
                  </Badge>
                )}
                {product.newArrival && (
                  <Badge className="bg-info text-info-foreground">Novidade</Badge>
                )}
                {product.onSale && (
                  <Badge className="bg-destructive text-destructive-foreground">
                    Promoção
                  </Badge>
                )}
                {product.isKit && (
                  <Badge className="bg-warning text-warning-foreground">
                    <Layers className="h-3 w-3 mr-1" />
                    KIT
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
                {product.name}
              </h1>

              {/* SKU & Supplier */}
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground font-mono">
                  SKU: {selectedVariation?.sku || product.sku}
                </span>
                <span className="supplier-badge">{product.supplier.name}</span>
              </div>
            </div>

            {/* Price & Stock */}
            <div className="card-stat space-y-3">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    A partir de
                  </p>
                  <span className="price-tag">{formatPrice(product.price)}</span>
                  <span className="text-muted-foreground">/un</span>
                </div>
                <div className="text-right">
                  <span className={stockInfo.class}>
                    <Package className="h-3 w-3" />
                    {stockInfo.label}
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {(selectedVariation?.stock || product.stock).toLocaleString("pt-BR")} unidades
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Tag className="h-4 w-4" />
                  <span>Mín. {product.minQuantity} un.</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Truck className="h-4 w-4" />
                  <span>Consultar prazo</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Garantia</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-display font-semibold text-foreground">
                Descrição
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Materials */}
            <div className="space-y-2">
              <h3 className="font-display font-semibold text-foreground">
                Materiais
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.materials.map((material) => (
                  <Badge key={material} variant="secondary">
                    {material}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Variations */}
            <ProductVariations
              variations={product.variations || []}
              colors={product.colors}
              selectedVariation={selectedVariation}
              onSelectVariation={setSelectedVariation}
            />

            {/* Kit Composition */}
            {product.isKit && product.kitItems && (
              <KitComposition
                items={product.kitItems}
                onSelectItems={setSelectedKitItems}
              />
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <ShareActions product={product} />
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleFavorite}
                className={cn(
                  isFavorite && "bg-destructive/10 border-destructive/50"
                )}
              >
                <Heart
                  className={cn(
                    "h-5 w-5",
                    isFavorite && "fill-destructive text-destructive"
                  )}
                />
              </Button>
            </div>

            {/* Tags */}
            <div className="space-y-3 pt-4 border-t border-border">
              <h3 className="font-display font-semibold text-foreground text-sm">
                Indicado para
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.publicoAlvo.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    👤 {tag}
                  </Badge>
                ))}
                {product.tags.datasComemorativas.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    📅 {tag}
                  </Badge>
                ))}
                {product.tags.endomarketing.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    🎯 {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
