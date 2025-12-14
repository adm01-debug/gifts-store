import { Client, PRODUCTS, Product } from "@/data/mockData";
import { ProductCard } from "@/components/products/ProductCard";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ClientRecommendedProductsProps {
  client: Client;
  onProductClick: (productId: string) => void;
}

export function ClientRecommendedProducts({ client, onProductClick }: ClientRecommendedProductsProps) {
  // Filtrar produtos que têm as cores do cliente
  const clientColorGroups = [
    client.primaryColor.group,
    ...client.secondaryColors.map(c => c.group)
  ];

  const recommendedProducts = PRODUCTS.filter(product => {
    // Verificar se o produto tem alguma cor do cliente
    const hasClientColor = product.colors.some(color => 
      clientColorGroups.includes(color.group)
    );
    
    // Verificar se o nicho do produto corresponde ao do cliente
    const matchesNicho = product.tags.nicho.some(n => 
      n.toLowerCase() === client.nicho.toLowerCase()
    );

    return hasClientColor || matchesNicho;
  }).slice(0, 8);

  if (recommendedProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-display font-semibold text-foreground">Produtos Recomendados</h3>
        <Badge variant="secondary" className="ml-2">
          Baseado nas cores e nicho
        </Badge>
      </div>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4 pb-4">
          {recommendedProducts.map((product, index) => (
            <div
              key={product.id}
              className="w-[280px] flex-shrink-0 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard
                product={product}
                onClick={() => onProductClick(product.id)}
                highlightColors={clientColorGroups}
              />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}