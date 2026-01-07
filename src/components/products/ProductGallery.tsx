import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Play, Pause, ZoomIn, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ColorOption {
  name: string;
  hex: string;
  image?: string;
}

interface ProductGalleryProps {
  images: string[];
  video?: string;
  productName: string;
  colors?: ColorOption[];
  onColorSelect?: (index: number) => void;
  selectedColorIndex?: number;
}

export function ProductGallery({
  images,
  video,
  productName,
  colors,
  onColorSelect,
  selectedColorIndex = 0,
}: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const allMedia = video ? [...images, "video"] : images;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? allMedia.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === allMedia.length - 1 ? 0 : prev + 1));
  };

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const currentIsVideo = allMedia[currentIndex] === "video";

  return (
    <div className="space-y-4">
      {/* Main Image/Video */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-muted group">
        {currentIsVideo && video ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={video}
              className="w-full h-full object-cover"
              loop
              playsInline
              onClick={toggleVideo}
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={toggleVideo}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
        ) : (
          <img
            src={images[currentIndex] || "/placeholder.svg"}
            alt={`${productName} - Imagem ${currentIndex + 1}`}
            className={cn(
              "w-full h-full object-cover transition-transform duration-300",
              isZoomed && "scale-150 cursor-zoom-out"
            )}
            onClick={() => setIsZoomed(!isZoomed)}
          />
        )}

        {/* Navigation Arrows */}
        {allMedia.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {!currentIsVideo && (
            <Button variant="secondary" size="icon" onClick={() => setIsZoomed(!isZoomed)}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          )}
          <Button variant="secondary" size="icon" onClick={() => setIsFullscreen(true)}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {allMedia.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentIndex ? "bg-primary w-6" : "bg-white/50 hover:bg-white/80"
              )}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {allMedia.map((item, index) => (
          <button
            key={index}
            className={cn(
              "flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
              index === currentIndex ? "border-primary" : "border-transparent hover:border-muted-foreground/30"
            )}
            onClick={() => setCurrentIndex(index)}
          >
            {item === "video" ? (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Play className="h-6 w-6 text-muted-foreground" />
              </div>
            ) : (
              <img src={item} alt="" className="w-full h-full object-cover" />
            )}
          </button>
        ))}
      </div>

      {/* Color Selector */}
      {colors && colors.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Cor:</span>
          <div className="flex gap-2">
            {colors.map((color, index) => (
              <button
                key={index}
                className={cn(
                  "w-8 h-8 rounded-full border-2 transition-all",
                  index === selectedColorIndex ? "border-primary ring-2 ring-primary/20" : "border-muted hover:border-muted-foreground"
                )}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                onClick={() => onColorSelect?.(index)}
              />
            ))}
          </div>
          <span className="text-sm font-medium">{colors[selectedColorIndex]?.name}</span>
        </div>
      )}

      {/* Fullscreen Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-4xl p-0">
          {currentIsVideo && video ? (
            <video src={video} className="w-full" controls autoPlay />
          ) : (
            <img
              src={images[currentIndex] || "/placeholder.svg"}
              alt={productName}
              className="w-full h-auto"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
