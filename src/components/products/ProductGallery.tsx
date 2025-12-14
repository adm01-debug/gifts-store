import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  video?: string;
  productName: string;
}

export function ProductGallery({ images, video, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const allMedia = video ? [...images, video] : images;
  const isVideo = (index: number) => video && index === allMedia.length - 1;

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? allMedia.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === allMedia.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary/30 group">
        {isVideo(selectedIndex) ? (
          <video
            src={allMedia[selectedIndex]}
            controls
            className="w-full h-full object-cover"
            poster={images[0]}
          />
        ) : (
          <img
            src={allMedia[selectedIndex]}
            alt={`${productName} - Imagem ${selectedIndex + 1}`}
            className={cn(
              "w-full h-full object-cover transition-transform duration-500",
              isZoomed && "scale-150 cursor-zoom-out"
            )}
            onClick={() => setIsZoomed(!isZoomed)}
          />
        )}

        {/* Navigation arrows */}
        {allMedia.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-card/90 backdrop-blur-sm"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-card/90 backdrop-blur-sm"
              onClick={goToNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Zoom indicator */}
        {!isVideo(selectedIndex) && (
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="icon"
              className="bg-card/90 backdrop-blur-sm"
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Image counter */}
        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-card/90 backdrop-blur-sm text-xs font-medium">
          {selectedIndex + 1} / {allMedia.length}
        </div>
      </div>

      {/* Thumbnails */}
      {allMedia.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {allMedia.map((media, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-200",
                selectedIndex === index
                  ? "ring-2 ring-primary ring-offset-2"
                  : "opacity-70 hover:opacity-100"
              )}
            >
              {isVideo(index) ? (
                <div className="w-full h-full bg-secondary flex items-center justify-center">
                  <Play className="h-6 w-6 text-muted-foreground" />
                </div>
              ) : (
                <img
                  src={media}
                  alt={`${productName} - Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
