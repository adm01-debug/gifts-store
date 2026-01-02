// src/components/products/PresentationMode.tsx

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Info,
  Play,
  Pause
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  description?: string;
  images: string[];
  code?: string;
  category?: string;
  price?: number;
  min_quantity?: number;
}

interface PresentationModeProps {
  /** Produtos a apresentar */
  products: Product[];
  /** Índice inicial */
  initialIndex?: number;
  /** Callback ao fechar */
  onClose: () => void;
  /** Modo automático (slideshow) */
  autoPlay?: boolean;
  /** Intervalo do autoplay em segundos */
  autoPlayInterval?: number;
  /** Mostrar informações do produto */
  showInfo?: boolean;
}

/**
 * Modo de Apresentação Fullscreen
 * 
 * Galeria fullscreen profissional para apresentar produtos ao cliente
 * 
 * Recursos:
 * - Navegação por teclado (setas, ESC)
 * - Autoplay opcional
 * - Toggle de informações
 * - Design limpo e profissional
 * 
 * @example
 * ```tsx
 * const [isPresentationMode, setIsPresentationMode] = useState(false);
 * 
 * <Button onClick={() => setIsPresentationMode(true)}>
 *   <Maximize /> Modo Apresentação
 * </Button>
 * 
 * {isPresentationMode && (
 *   <PresentationMode
 *     products={selectedProducts}
 *     onClose={() => setIsPresentationMode(false)}
 *     autoPlay
 *   />
 * )}
 * ```
 */
export function PresentationMode({
  products,
  initialIndex = 0,
  onClose,
  autoPlay = false,
  autoPlayInterval = 5,
  showInfo: initialShowInfo = true
}: PresentationModeProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [showInfo, setShowInfo] = useState(initialShowInfo);
  const [imageIndex, setImageIndex] = useState(0);

  const currentProduct = products[currentIndex];
  const totalProducts = products.length;

  // Navegação
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalProducts);
    setImageIndex(0);
  }, [totalProducts]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalProducts) % totalProducts);
    setImageIndex(0);
  }, [totalProducts]);

  const nextImage = useCallback(() => {
    if (currentProduct && currentProduct.images.length > 1) {
      setImageIndex((prev) => (prev + 1) % currentProduct.images.length);
    }
  }, [currentProduct]);

  const previousImage = useCallback(() => {
    if (currentProduct && currentProduct.images.length > 1) {
      setImageIndex(
        (prev) => (prev - 1 + currentProduct.images.length) % currentProduct.images.length
      );
    }
  }, [currentProduct]);

  // Autoplay
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      goToNext();
    }, autoPlayInterval * 1000);

    return () => clearInterval(interval);
  }, [isPlaying, goToNext, autoPlayInterval]);

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowRight':
          if (e.shiftKey) {
            nextImage();
          } else {
            goToNext();
          }
          break;
        case 'ArrowLeft':
          if (e.shiftKey) {
            previousImage();
          } else {
            goToPrevious();
          }
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying((prev) => !prev);
          break;
        case 'i':
        case 'I':
          setShowInfo((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onClose, goToNext, goToPrevious, nextImage, previousImage]);

  // Bloquear scroll do body
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!currentProduct) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              {currentIndex + 1} / {totalProducts}
            </Badge>
            
            {showInfo && (
              <div className="text-white">
                <h2 className="text-xl font-bold">{currentProduct.name}</h2>
                {currentProduct.code && (
                  <p className="text-sm text-gray-300">
                    Código: {currentProduct.code}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowInfo(!showInfo)}
              className="text-white hover:bg-white/20"
              title="Toggle Info (I)"
            >
              <Info className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white hover:bg-white/20"
              title="Play/Pause (Espaço)"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
              title="Fechar (ESC)"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Image */}
      <div className="absolute inset-0 flex items-center justify-center p-20">
        <img
          src={currentProduct.images[imageIndex] || '/placeholder.svg'}
          alt={currentProduct.name}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Image Navigation (if multiple images) */}
      {currentProduct.images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={previousImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
            title="Imagem Anterior (Shift + ←)"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
            title="Próxima Imagem (Shift + →)"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
            {currentProduct.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setImageIndex(idx)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  idx === imageIndex
                    ? "bg-white w-8"
                    : "bg-white/40 hover:bg-white/60"
                )}
              />
            ))}
          </div>
        </>
      )}

      {/* Product Navigation */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={goToPrevious}
            className="text-white hover:bg-white/20"
            disabled={totalProducts === 1}
            title="Produto Anterior (←)"
          >
            <ChevronLeft className="mr-2 h-5 w-5" />
            Anterior
          </Button>

          {showInfo && currentProduct.description && (
            <div className="max-w-2xl text-center text-white">
              <p className="text-sm">{currentProduct.description}</p>
              {currentProduct.price && (
                <p className="text-lg font-bold mt-2">
                  R$ {currentProduct.price.toFixed(2)}
                  {currentProduct.min_quantity && (
                    <span className="text-sm font-normal ml-2">
                      (mín. {currentProduct.min_quantity} un.)
                    </span>
                  )}
                </p>
              )}
            </div>
          )}

          <Button
            variant="ghost"
            onClick={goToNext}
            className="text-white hover:bg-white/20"
            disabled={totalProducts === 1}
            title="Próximo Produto (→)"
          >
            Próximo
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Keyboard Hints (fade out after 3s) */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/60 text-xs animate-fade-out pointer-events-none">
        <div className="flex gap-4">
          <span>← → Navegar</span>
          <span>Shift + ← → Imagens</span>
          <span>Espaço Play/Pause</span>
          <span>I Info</span>
          <span>ESC Fechar</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Botão para ativar modo apresentação
 */
export function PresentationModeButton({
  onClick,
  className = ""
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={className}
    >
      <Maximize className="mr-2 h-4 w-4" />
      Modo Apresentação
    </Button>
  );
}
