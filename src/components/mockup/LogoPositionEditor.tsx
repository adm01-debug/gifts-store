import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas as FabricCanvas, FabricImage, Rect } from "fabric";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Move, ZoomIn, ZoomOut, RotateCcw, Target } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface LogoPositionEditorProps {
  productImageUrl: string;
  logoPreview: string | null;
  positionX: number;
  positionY: number;
  logoWidth: number;
  logoHeight: number;
  onPositionChange: (x: number, y: number) => void;
  onSizeChange: (width: number, height: number) => void;
}

export function LogoPositionEditor({
  productImageUrl,
  logoPreview,
  positionX,
  positionY,
  logoWidth,
  logoHeight,
  onPositionChange,
  onSizeChange,
}: LogoPositionEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const logoObjectRef = useRef<FabricImage | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 400 });

  // Calculate logo display size based on cm (assuming ~3cm per 10% of canvas)
  const getLogoDisplaySize = useCallback(() => {
    const scale = canvasSize.width / 30; // 30cm reference product size
    return {
      width: logoWidth * scale,
      height: logoHeight * scale,
    };
  }, [logoWidth, logoHeight, canvasSize.width]);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const size = Math.min(containerWidth, 500);
    setCanvasSize({ width: size, height: size });

    const canvas = new FabricCanvas(canvasRef.current, {
      width: size,
      height: size,
      backgroundColor: "#f5f5f5",
      selection: false,
    });

    fabricCanvasRef.current = canvas;

    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, []);

  // Load product image as background
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !productImageUrl) return;

    FabricImage.fromURL(productImageUrl, { crossOrigin: "anonymous" })
      .then((img) => {
        const scale = Math.min(
          canvasSize.width / (img.width || 1),
          canvasSize.height / (img.height || 1)
        );
        
        img.scale(scale);
        img.set({
          left: (canvasSize.width - (img.width || 0) * scale) / 2,
          top: (canvasSize.height - (img.height || 0) * scale) / 2,
          selectable: false,
          evented: false,
        });

        // Clear and add background
        const objects = canvas.getObjects();
        objects.forEach((obj) => {
          if (obj !== logoObjectRef.current) {
            canvas.remove(obj);
          }
        });
        
        canvas.add(img);
        canvas.sendObjectToBack(img);
        canvas.renderAll();
        setIsReady(true);
      })
      .catch((err) => {
        console.error("Error loading product image:", err);
      });
  }, [productImageUrl, canvasSize]);

  // Add/update logo on canvas
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !logoPreview || !isReady) return;

    // Remove existing logo
    if (logoObjectRef.current) {
      canvas.remove(logoObjectRef.current);
      logoObjectRef.current = null;
    }

    FabricImage.fromURL(logoPreview, { crossOrigin: "anonymous" })
      .then((img) => {
        const displaySize = getLogoDisplaySize();
        const scaleX = displaySize.width / (img.width || 1);
        const scaleY = displaySize.height / (img.height || 1);

        // Convert percentage position to canvas position
        const left = (positionX / 100) * canvasSize.width;
        const top = (positionY / 100) * canvasSize.height;

        img.set({
          left,
          top,
          scaleX,
          scaleY,
          originX: "center",
          originY: "center",
          hasControls: true,
          hasBorders: true,
          lockRotation: true,
          cornerColor: "hsl(var(--primary))",
          cornerStyle: "circle",
          borderColor: "hsl(var(--primary))",
          borderScaleFactor: 2,
          transparentCorners: false,
          cornerSize: 12,
        });

        canvas.add(img);
        canvas.setActiveObject(img);
        logoObjectRef.current = img;

        // Handle object movement
        img.on("moving", () => {
          const newX = Math.max(5, Math.min(95, ((img.left || 0) / canvasSize.width) * 100));
          const newY = Math.max(5, Math.min(95, ((img.top || 0) / canvasSize.height) * 100));
          onPositionChange(Math.round(newX), Math.round(newY));
        });

        // Handle object scaling
        img.on("scaling", () => {
          const currentScaleX = img.scaleX || 1;
          const currentScaleY = img.scaleY || 1;
          const scale = canvasSize.width / 30;
          const newWidth = ((img.width || 0) * currentScaleX) / scale;
          const newHeight = ((img.height || 0) * currentScaleY) / scale;
          onSizeChange(
            Math.max(1, Math.min(20, Math.round(newWidth * 10) / 10)),
            Math.max(1, Math.min(20, Math.round(newHeight * 10) / 10))
          );
        });

        canvas.renderAll();
      })
      .catch((err) => {
        console.error("Error loading logo:", err);
      });
  }, [logoPreview, isReady, canvasSize]);

  // Update logo position when sliders change externally
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    const logo = logoObjectRef.current;
    if (!canvas || !logo) return;

    const left = (positionX / 100) * canvasSize.width;
    const top = (positionY / 100) * canvasSize.height;
    
    logo.set({ left, top });
    canvas.renderAll();
  }, [positionX, positionY, canvasSize]);

  // Update logo size when sliders change externally
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    const logo = logoObjectRef.current;
    if (!canvas || !logo) return;

    const displaySize = getLogoDisplaySize();
    const scaleX = displaySize.width / (logo.width || 1);
    const scaleY = displaySize.height / (logo.height || 1);
    
    logo.set({ scaleX, scaleY });
    canvas.renderAll();
  }, [logoWidth, logoHeight, getLogoDisplaySize]);

  const centerLogo = () => {
    onPositionChange(50, 50);
  };

  const resetSize = () => {
    onSizeChange(5, 3);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Move className="h-4 w-4 text-primary" />
          Posicionar Logo
        </CardTitle>
        <CardDescription className="text-xs">
          Arraste o logo para posicionar. Use as alças para redimensionar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Canvas container */}
        <div 
          ref={containerRef}
          className="relative rounded-lg border overflow-hidden bg-muted/30"
        >
          <canvas ref={canvasRef} className="w-full" />
          
          {!logoPreview && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <p className="text-sm text-muted-foreground text-center px-4">
                Faça upload do logo para posicioná-lo
              </p>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={centerLogo}
            disabled={!logoPreview}
            className="flex-1"
          >
            <Target className="h-4 w-4 mr-1" />
            Centralizar
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetSize}
            disabled={!logoPreview}
            className="flex-1"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Tamanho Padrão
          </Button>
        </div>

        {/* Fine-tune controls */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Largura</span>
              <span className="font-medium">{logoWidth} cm</span>
            </div>
            <Slider
              value={[logoWidth]}
              onValueChange={(v) => onSizeChange(v[0], logoHeight)}
              min={1}
              max={20}
              step={0.5}
              disabled={!logoPreview}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Altura</span>
              <span className="font-medium">{logoHeight} cm</span>
            </div>
            <Slider
              value={[logoHeight]}
              onValueChange={(v) => onSizeChange(logoWidth, v[0])}
              min={1}
              max={20}
              step={0.5}
              disabled={!logoPreview}
            />
          </div>
        </div>

        {/* Position display */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>Posição: {positionX}% x {positionY}%</span>
          <span>Tamanho: {logoWidth}cm × {logoHeight}cm</span>
        </div>
      </CardContent>
    </Card>
  );
}
