import { useState } from "react";
import { useAIRecommendations } from "@/hooks/useAIRecommendations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Lightbulb, Target, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  category: string;
  image?: string;
  minPrice?: number;
  tags?: string[];
}

interface Client {
  name: string;
  company?: string;
  industry?: string;
  preferences?: string[];
  purchaseHistory?: string[];
  budget?: string;
}

interface AIRecommendationsPanelProps {
  client: Client;
  products: Product[];
  onProductSelect?: (productId: string) => void;
}

export function AIRecommendationsPanel({
  client,
  products,
  onProductSelect,
}: AIRecommendationsPanelProps) {
  const { getRecommendations, isLoading, result, clearRecommendations } = useAIRecommendations();
  const [hasRequested, setHasRequested] = useState(false);

  const handleGetRecommendations = async () => {
    setHasRequested(true);
    await getRecommendations(
      client,
      products.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        tags: p.tags,
      }))
    );
  };

  const handleRefresh = () => {
    clearRecommendations();
    handleGetRecommendations();
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400";
    if (score >= 0.7) return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400";
    return "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400";
  };

  const getRecommendedProduct = (productId: string) => {
    return products.find((p) => p.id === productId);
  };

  if (!hasRequested) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl">Recomendações com IA</CardTitle>
          <CardDescription>
            Encontre os produtos perfeitos para {client.name} com inteligência artificial
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={handleGetRecommendations} size="lg" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Gerar Recomendações
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="border-primary/20">
        <CardContent className="py-12 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Analisando perfil e gerando recomendações...</p>
          <p className="text-xs text-muted-foreground mt-2">Isso pode levar alguns segundos</p>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="border-destructive/20">
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground mb-4">Não foi possível gerar recomendações</p>
          <Button variant="outline" onClick={handleGetRecommendations}>
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Recomendações para {client.name}</CardTitle>
              <CardDescription>Baseado no perfil e histórico do cliente</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Insights */}
        {result.insights && (
          <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm mb-1">Análise do Perfil</p>
                <p className="text-sm text-muted-foreground">{result.insights}</p>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Target className="h-4 w-4" />
            Produtos Recomendados ({result.recommendations.length})
          </h4>
          <div className="grid gap-3">
            {result.recommendations.map((rec, index) => {
              const product = getRecommendedProduct(rec.productId);
              if (!product) return null;

              return (
                <div
                  key={rec.productId}
                  className="flex items-center gap-4 p-3 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-muted/30 transition-all cursor-pointer group"
                  onClick={() => onProductSelect?.(rec.productId)}
                >
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm text-muted-foreground">
                    {index + 1}
                  </div>
                  
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate group-hover:text-primary transition-colors">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{rec.reason}</p>
                  </div>
                  
                  <Badge className={cn("shrink-0", getScoreColor(rec.score))}>
                    {Math.round(rec.score * 100)}%
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
