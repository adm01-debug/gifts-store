import { useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Play, Maximize2, X, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  video?: string;
  productName: string;
  colors?: Array<{ name: string; hex: string; image?: string }>;
  onColorSelect?: (colorIndex: number) => void;
  selectedColorIndex?: number;
}

export function ProductGallery({ 
  images, 
  video, 
  productName, 
  colors,
  onColorSelect,
  selectedColorIndex = 0
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const allMedia = video ? [...images, video] : images;
  const isVideo = (index: number) => video && index === allMedia.length - 1;

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? allMedia.length - 1 : prev - 1));
    resetZoom();
  }, [allMedia.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === allMedia.length - 1 ? 0 : prev + 1));
    resetZoom();
  }, [allMedia.length]);

  const resetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) setPan({ x: 0, y: 0 });
      return newZoom;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsPanning(true);
      panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && zoom > 1) {
      const newX = e.clientX - panStartRef.current.x;
      const newY = e.clientY - panStartRef.current.y;
      const maxPan = (zoom - 1) * 150;
      setPan({
        x: Math.max(-maxPan, Math.min(maxPan, newX)),
        y: Math.max(-maxPan, Math.min(maxPan, newY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (isFullscreen) {
      e.preventDefault();
      if (e.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    }
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "Escape") setIsFullscreen(false);
    if (e.key === "+" || e.key === "=") handleZoomIn();
    if (e.key === "-") handleZoomOut();
  }, [goToPrevious, goToNext]);

  const handleColorClick = (index: number) => {
    if (colors && colors[index]?.image) {
      const imageIndex = images.findIndex(img => img === colors[index].image);
      if (imageIndex !== -1) {
        setSelectedIndex(imageIndex);
      }
    }
    onColorSelect?.(index);
  };

  const ImageView = ({ inDialog = false }: { inDialog?: boolean }) => (
    <div
      ref={imageContainerRef}
      className={cn(
        "relative overflow-hidden bg-secondary/30",
        inDialog ? "w-full h-full" : "aspect-square rounded-2xl"
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {isVideo(selectedIndex) ? (
        <video
          src={allMedia[selectedIndex]}
          controls
          className="w-full h-full object-contain"
          poster={images[0]}
        />
      ) : (
        <img
          src={allMedia[selectedIndex]}
          alt={`${productName} - Imagem ${selectedIndex + 1}`}
          className={cn(
            "w-full h-full object-contain transition-transform duration-200",
            zoom > 1 && "cursor-grab",
            isPanning && "cursor-grabbing"
          )}
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
          }}
          draggable={false}
        />
      )}
    </div>
  );

  return (
    <div className="space-y-4" onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Main image */}
      <div className="relative group">
        <ImageView />

        {/* Navigation arrows */}
        {allMedia.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-card/90 backdrop-blur-sm shadow-lg"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-card/90 backdrop-blur-sm shadow-lg"
              onClick={goToNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Controls */}
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="icon"
            className="bg-card/90 backdrop-blur-sm shadow-lg"
            onClick={() => setIsFullscreen(true)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Image counter */}
        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-card/90 backdrop-blur-sm text-xs font-medium shadow-lg">
          {selectedIndex + 1} / {allMedia.length}
        </div>
      </div>

      {/* Color navigation */}
      {colors && colors.length > 0 && (
        <div className="space-y-2">
          <span className="text-sm font-medium text-muted-foreground">Cores disponíveis</span>
          <div className="flex gap-2 flex-wrap">
            {colors.map((color, index) => (
              <button
                key={color.name}
                onClick={() => handleColorClick(index)}
                className={cn(
                  "group relative w-10 h-10 rounded-lg overflow-hidden transition-all duration-200 ring-offset-background",
                  selectedColorIndex === index
                    ? "ring-2 ring-primary ring-offset-2"
                    : "hover:ring-2 hover:ring-muted-foreground/50 hover:ring-offset-1"
                )}
                title={color.name}
              >
                {color.image ? (
                  <img 
                    src={color.image} 
                    alt={color.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-full h-full" 
                    style={{ backgroundColor: color.hex }}
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Thumbnails */}
      {allMedia.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {allMedia.map((media, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedIndex(index);
                resetZoom();
              }}
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

      {/* Fullscreen Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent 
          className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-background/95 backdrop-blur-xl border-none"
          onKeyDown={handleKeyDown}
        >
          <div className="relative w-full h-full flex flex-col">
            {/* Fullscreen header */}
            <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-card/90 backdrop-blur-sm text-sm font-medium shadow-lg">
                  {selectedIndex + 1} / {allMedia.length}
                </span>
                {zoom > 1 && (
                  <span className="px-3 py-1.5 rounded-full bg-card/90 backdrop-blur-sm text-sm font-medium shadow-lg flex items-center gap-1">
                    <Move className="h-3 w-3" />
                    {Math.round(zoom * 100)}%
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {!isVideo(selectedIndex) && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="bg-card/90 backdrop-blur-sm shadow-lg"
                      onClick={handleZoomOut}
                      disabled={zoom <= 1}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="bg-card/90 backdrop-blur-sm shadow-lg"
                      onClick={handleZoomIn}
                      disabled={zoom >= 4}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Button
                  variant="secondary"
                  size="icon"
                  className="bg-card/90 backdrop-blur-sm shadow-lg"
                  onClick={() => {
                    setIsFullscreen(false);
                    resetZoom();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Fullscreen image */}
            <div className="flex-1 flex items-center justify-center p-16">
              <ImageView inDialog />
            </div>

            {/* Fullscreen navigation */}
            {allMedia.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-card/90 backdrop-blur-sm shadow-lg"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-card/90 backdrop-blur-sm shadow-lg"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Fullscreen thumbnails */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-xl bg-card/90 backdrop-blur-sm shadow-lg max-w-[80vw] overflow-x-auto">
              {allMedia.map((media, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedIndex(index);
                    resetZoom();
                  }}
                  className={cn(
                    "relative shrink-0 w-14 h-14 rounded-lg overflow-hidden transition-all duration-200",
                    selectedIndex === index
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-card"
                      : "opacity-60 hover:opacity-100"
                  )}
                >
                  {isVideo(index) ? (
                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                      <Play className="h-5 w-5 text-muted-foreground" />
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
