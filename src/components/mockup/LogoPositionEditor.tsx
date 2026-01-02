import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas as FabricCanvas, FabricImage } from "fabric";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Move, RotateCcw, Target, Eye } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

interface LogoPositionEditorProps {
  productImageUrl: string;
  logoPreview: string | null;
  positionX: number;
  positionY: number;
  logoWidth: number;
  logoHeight: number;
  techniqueCode?: string | null;
  techniqueName?: string;
  onPositionChange: (x: number, y: number) => void;
  onSizeChange: (width: number, height: number) => void;
}

// CSS filter effects to simulate different techniques
const TECHNIQUE_FILTERS: Record<string, { filter: string; opacity: number; blend?: string; description: string }> = {
  bordado: { 
    filter: "contrast(1.1) saturate(0.9)", 
    opacity: 0.85,
    description: "Textura de bordado"
  },
  silk: { 
    filter: "contrast(1.2) saturate(1.1)", 
    opacity: 0.9,
    description: "Serigrafia"
  },
  dtf: { 
    filter: "brightness(1.05) saturate(1.2)", 
    opacity: 0.95,
    description: "Transfer DTF"
  },
  laser: { 
    filter: "grayscale(1) contrast(1.3) sepia(0.3)", 
    opacity: 0.7,
    description: "Gravação laser"
  },
  laser_co2: { 
    filter: "grayscale(1) contrast(1.2) sepia(0.4) brightness(0.9)", 
    opacity: 0.75,
    description: "Laser CO2"
  },
  laser_fibra: { 
    filter: "grayscale(1) contrast(1.4) brightness(1.1)", 
    opacity: 0.8,
    description: "Laser Fibra"
  },
  sublimacao: { 
    filter: "saturate(1.3) brightness(1.05)", 
    opacity: 0.92,
    description: "Sublimação"
  },
  tampografia: { 
    filter: "contrast(1.15)", 
    opacity: 0.88,
    description: "Tampografia"
  },
  hot_stamping: { 
    filter: "sepia(0.5) saturate(1.5) brightness(1.2) contrast(1.1)", 
    opacity: 0.85,
    description: "Hot Stamping"
  },
  adesivo: { 
    filter: "brightness(1.02)", 
    opacity: 0.95,
    description: "Adesivo"
  },
  uv: { 
    filter: "contrast(1.1) saturate(1.15) brightness(1.05)", 
    opacity: 0.9,
    description: "Impressão UV"
  },
  transfer: { 
    filter: "contrast(1.05)", 
    opacity: 0.88,
    description: "Transfer"
  },
  default: { 
    filter: "none", 
    opacity: 1,
    description: "Preview"
  }
} as const;

type TechniqueFilter = { filter: string; opacity: number; description: string };

function getTechniqueFilter(techniqueCode?: string | null, techniqueName?: string): TechniqueFilter {
  const defaultFilter = TECHNIQUE_FILTERS['default'];
  if (!techniqueCode && !techniqueName) return defaultFilter;
  
  const code = (techniqueCode || techniqueName || "").toLowerCase();
  
  for (const [key, value] of Object.entries(TECHNIQUE_FILTERS)) {
    if (code.includes(key)) {
      return value;
    }
  }
  
  return defaultFilter;
}

export function LogoPositionEditor({
  productImageUrl,
  logoPreview,
  positionX,
  positionY,
  logoWidth,
  logoHeight,
  techniqueCode,
  techniqueName,
  onPositionChange,
  onSizeChange,
}: LogoPositionEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const logoObjectRef = useRef<FabricImage | null>(null);
  const productImageRef = useRef<FabricImage | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 400 });
  const [showPreviewMode, setShowPreviewMode] = useState(true);

  const techniqueFilter = getTechniqueFilter(techniqueCode, techniqueName);

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

        // Remove old product image
        if (productImageRef.current) {
          canvas.remove(productImageRef.current);
        }
        
        productImageRef.current = img;
        canvas.add(img);
        canvas.sendObjectToBack(img);
        canvas.renderAll();
        setIsReady(true);
      })
      .catch((err) => {
        console.error("Error loading product image:", err);
      });
  }, [productImageUrl, canvasSize]);

  // Apply technique filter to logo
  const applyTechniqueFilter = useCallback((img: FabricImage) => {
    if (!showPreviewMode) {
      img.set({ opacity: 1 });
      // Reset filters
      img.filters = [];
      img.applyFilters();
      return;
    }

    img.set({ opacity: techniqueFilter.opacity });
  }, [showPreviewMode, techniqueFilter]);

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

        // Apply technique filter for preview
        applyTechniqueFilter(img);

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
  }, [logoPreview, isReady, canvasSize, applyTechniqueFilter, getLogoDisplaySize, onPositionChange, onSizeChange, positionX, positionY]);

  // Update technique filter when technique changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    const logo = logoObjectRef.current;
    if (!canvas || !logo) return;

    applyTechniqueFilter(logo);
    canvas.renderAll();
  }, [techniqueCode, techniqueName, showPreviewMode, applyTechniqueFilter]);

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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Move className="h-4 w-4 text-primary" />
              Posicionar Logo
            </CardTitle>
            <CardDescription className="text-xs">
              Arraste o logo para posicionar. Use as alças para redimensionar.
            </CardDescription>
          </div>
          <Button
            variant={showPreviewMode ? "default" : "outline"}
            size="sm"
            onClick={() => setShowPreviewMode(!showPreviewMode)}
            className="gap-1.5"
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Technique preview indicator */}
        {showPreviewMode && techniqueName && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20">
            <div 
              className="w-4 h-4 rounded-full border-2 border-primary"
              style={{ 
                background: techniqueFilter.filter.includes('grayscale') 
                  ? 'linear-gradient(135deg, #666, #999)' 
                  : techniqueFilter.filter.includes('sepia')
                  ? 'linear-gradient(135deg, #c9a227, #f5d742)'
                  : 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))'
              }}
            />
            <span className="text-xs text-muted-foreground">
              Simulando: <span className="font-medium text-foreground">{techniqueName}</span>
            </span>
            <Badge variant="secondary" className="text-[10px] ml-auto">
              {techniqueFilter.description}
            </Badge>
          </div>
        )}

        {/* Canvas container */}
        <div 
          ref={containerRef}
          className="relative rounded-lg border overflow-hidden bg-muted/30"
        >
          <canvas 
            ref={canvasRef} 
            className="w-full"
            style={{
              filter: showPreviewMode && logoPreview ? techniqueFilter.filter : 'none'
            }}
          />
          
          {!logoPreview && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <p className="text-sm text-muted-foreground text-center px-4">
                Faça upload do logo para posicioná-lo
              </p>
            </div>
          )}

          {/* Live preview badge */}
          {showPreviewMode && logoPreview && (
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-[10px] gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Preview em tempo real
              </Badge>
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
              onValueChange={(v) => onSizeChange(v[0] ?? logoWidth, logoHeight)}
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
              onValueChange={(v) => onSizeChange(logoWidth, v[0] ?? logoHeight)}
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
