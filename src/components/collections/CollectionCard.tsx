import { Link } from "react-router-dom";
import { Collection } from "@/hooks/useCollections";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Package, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CollectionCardProps {
  collection: Collection;
  className?: string;
}

export function CollectionCard({ collection, className }: CollectionCardProps) {
  const isActive = () => {
    const now = new Date();
    if (collection.start_date && new Date(collection.start_date) > now) return false;
    if (collection.end_date && new Date(collection.end_date) < now) return false;
    return true;
  };

  return (
    <Link to={`/colecoes/${collection.slug}`}>
      <Card className={cn(
        "group overflow-hidden transition-all hover:shadow-lg",
        !isActive() && "opacity-60",
        className
      )}>
        {/* Cover Image */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          {collection.cover_image_url ? (
            <img
              src={collection.cover_image_url}
              alt={collection.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-2">
            {collection.is_featured && (
              <Badge className="bg-yellow-500">
                <Star className="h-3 w-3 mr-1" />
                Destaque
              </Badge>
            )}
            {!isActive() && (
              <Badge variant="secondary">
                {collection.start_date && new Date(collection.start_date) > new Date() 
                  ? "Em breve" 
                  : "Encerrada"}
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
            {collection.name}
          </h3>
          {collection.description && (
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
              {collection.description}
            </p>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Package className="h-4 w-4" />
            {collection.products_count || 0} produtos
          </div>
          
          {(collection.start_date || collection.end_date) && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {collection.end_date 
                ? `Até ${format(new Date(collection.end_date), "dd/MM", { locale: ptBR })}`
                : format(new Date(collection.start_date!), "dd/MM", { locale: ptBR })
              }
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
