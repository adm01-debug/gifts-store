import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { useFavoritesContext } from "@/contexts/FavoritesContext";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Heart, Trash2, Share2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { getFavoriteProducts, clearFavorites, favoriteCount, toggleFavorite } =
    useFavoritesContext();

  const favoriteProducts = getFavoriteProducts();

  const handleClearAll = () => {
    clearFavorites();
    toast.success("Todos os favoritos foram removidos");
  };

  const handleShareAll = () => {
    const productNames = favoriteProducts.map((p) => `• ${p.name}`).join("\n");
    const message = `Meus produtos favoritos:\n\n${productNames}`;
    
    if (navigator.share) {
      navigator.share({
        title: "Meus Favoritos - PROMO BRINDES",
        text: message,
      });
    } else {
      navigator.clipboard.writeText(message);
      toast.success("Lista copiada para a área de transferência!");
    }
  };

  const handleRemoveFavorite = (productId: string, productName: string) => {
    toggleFavorite(productId);
    toast.success(`"${productName}" removido dos favoritos`);
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
              <Heart className="h-6 w-6 text-destructive fill-destructive" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
                Meus Favoritos
              </h1>
              <p className="text-muted-foreground">
                {favoriteCount} {favoriteCount === 1 ? "produto salvo" : "produtos salvos"}
              </p>
            </div>
          </div>

          {favoriteProducts.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleShareAll}>
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar Lista
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpar Tudo
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Limpar todos os favoritos?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação irá remover todos os {favoriteCount} produtos da sua lista de favoritos.
                      Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearAll}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Limpar Tudo
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        {/* Products grid */}
        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {favoriteProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in relative"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard
                  product={product}
                  onClick={() => navigate(`/produto/${product.id}`)}
                  onFavorite={() => handleRemoveFavorite(product.id, product.name)}
                />
                {/* Overlay badge showing it's favorited */}
                <div className="absolute top-3 right-3 z-10">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 bg-card/90 backdrop-blur-sm hover:bg-destructive/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFavorite(product.id, product.name);
                    }}
                  >
                    <Heart className="h-4 w-4 fill-destructive text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <Heart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              Nenhum favorito ainda
            </h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Navegue pelos produtos e clique no ícone de coração para adicionar
              produtos à sua lista de favoritos.
            </p>
            <Button onClick={() => navigate("/")}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Explorar Produtos
            </Button>
          </div>
        )}

        {/* Quick stats */}
        {favoriteProducts.length > 0 && (
          <div className="card-elevated p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-foreground">
                  {favoriteProducts.length}
                </p>
                <p className="text-sm text-muted-foreground">Produtos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-foreground">
                  {new Set(favoriteProducts.map((p) => p.category.id)).size}
                </p>
                <p className="text-sm text-muted-foreground">Categorias</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-success">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Math.min(...favoriteProducts.map((p) => p.price)))}
                </p>
                <p className="text-sm text-muted-foreground">Menor preço</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-primary">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Math.max(...favoriteProducts.map((p) => p.price)))}
                </p>
                <p className="text-sm text-muted-foreground">Maior preço</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}