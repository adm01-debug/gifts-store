import { useState } from "react";
import { useProductImages } from "@/hooks/useProductImages";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  productId: string;
  className?: string;
}

export function ProductGallery({ productId, className }: ProductGalleryProps) {
  const { images, primaryImage, isLoading } = useProductImages(productId);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  if (isLoading) {
    return (
      <div className={cn("animate-pulse bg-muted rounded-lg aspect-square", className)} />
    );
  }

  if (images.length === 0) {
    return (
      <div className={cn("bg-muted rounded-lg aspect-square flex items-center justify-center", className)}>
        <span className="text-muted-foreground">Sem imagens</span>
      </div>
    );
  }

  const currentImage = images[selectedIndex];

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Image */}
      <div className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
        <img
          src={currentImage.url}
          alt={currentImage.alt_text || "Produto"}
          className="w-full h-full object-contain"
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80"
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Zoom Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80"
          onClick={() => setIsZoomOpen(true)}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        {/* Primary Badge */}
        {currentImage.is_primary && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs flex items-center gap-1">
            <Star className="h-3 w-3" />
            Principal
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors",
                index === selectedIndex ? "border-primary" : "border-transparent hover:border-muted-foreground/50"
              )}
            >
              <img
                src={image.url}
                alt={image.alt_text || `Imagem ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Dialog */}
      <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
        <DialogContent className="max-w-4xl">
          <img
            src={currentImage.url}
            alt={currentImage.alt_text || "Produto"}
            className="w-full h-auto"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
