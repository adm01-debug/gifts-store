import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, ChevronRight, TrendingUp, Users, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Product } from "@/data/mockData";

interface RecommendationReason {
  type: "similar" | "trending" | "seasonal" | "complementary" | "popular";
  label: string;
  icon: React.ReactNode;
}

interface ProductRecommendation {
  product: Product;
  reason: RecommendationReason;
  score: number;
}

interface ProductRecommendationsProps {
  currentProduct?: Product;
  clientId?: string;
  maxItems?: number;
  onProductClick?: (product: Product) => void;
  className?: string;
}

const reasons: Record<string, RecommendationReason> = {
  similar: {
    type: "similar",
    label: "Similar ao que você viu",
    icon: <Sparkles className="h-3 w-3" />,
  },
  trending: {
    type: "trending",
    label: "Em alta",
    icon: <TrendingUp className="h-3 w-3" />,
  },
  seasonal: {
    type: "seasonal",
    label: "Ideal para a época",
    icon: <Calendar className="h-3 w-3" />,
  },
  complementary: {
    type: "complementary",
    label: "Combina com sua seleção",
    icon: <Users className="h-3 w-3" />,
  },
  popular: {
    type: "popular",
    label: "Mais vendido",
    icon: <TrendingUp className="h-3 w-3" />,
  },
};

export function ProductRecommendations({
  currentProduct,
  clientId,
  maxItems = 4,
  onProductClick,
  className,
}: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate AI recommendations (in production, this would call an API)
  const fetchRecommendations = async () => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Import products dynamically to avoid circular deps
    const { PRODUCTS } = await import("@/data/mockData");
    
    // Mock recommendation logic
    const shuffled = [...PRODUCTS]
      .filter((p) => p.id !== currentProduct?.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, maxItems);

    const reasonKeys = Object.keys(reasons);
    const mockRecommendations: ProductRecommendation[] = shuffled.map((product, index) => ({
      product,
      reason: reasons[reasonKeys[index % reasonKeys.length]],
      score: 0.85 + Math.random() * 0.15,
    }));

    setRecommendations(mockRecommendations);
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchRecommendations();
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchRecommendations();
  }, [currentProduct?.id, clientId, maxItems]);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Recomendações IA
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading || isRefreshing}
          className="gap-1"
        >
          <RefreshCw
            className={cn("h-4 w-4", isRefreshing && "animate-spin")}
          />
          <span className="hidden sm:inline">Atualizar</span>
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
            {Array.from({ length: maxItems }).map((_, i) => (
              <RecommendationSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
            <AnimatePresence mode="popLayout">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  layout
                >
                  <RecommendationCard
                    recommendation={rec}
                    onClick={() => onProductClick?.(rec.product)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* View all button */}
        <div className="border-t p-3">
          <Button variant="ghost" className="w-full gap-2 text-primary">
            Ver mais recomendações
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function RecommendationCard({
  recommendation,
  onClick,
}: {
  recommendation: ProductRecommendation;
  onClick?: () => void;
}) {
  const { product, reason, score } = recommendation;
  const imageUrl = product.images?.[0] || "/placeholder.svg";

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group text-left w-full bg-card border rounded-lg overflow-hidden hover:border-primary/50 hover:shadow-md transition-all"
    >
      {/* Image */}
      <div className="aspect-square relative overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Match score */}
        <div className="absolute top-2 right-2">
          <Badge 
            variant="secondary" 
            className="bg-background/90 backdrop-blur-sm text-xs font-medium"
          >
            {Math.round(score * 100)}% match
          </Badge>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-1.5">
        <p className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </p>
        
        <p className="text-sm font-semibold text-primary">
          R$ {product.price.toFixed(2)}
        </p>

        {/* Reason badge */}
        <Badge
          variant="outline"
          className="text-xs gap-1 font-normal"
        >
          {reason.icon}
          {reason.label}
        </Badge>
      </div>
    </motion.button>
  );
}

function RecommendationSkeleton() {
  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      <Skeleton className="aspect-square" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-5 w-1/2" />
      </div>
    </div>
  );
}
