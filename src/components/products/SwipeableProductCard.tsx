/**
 * SwipeableProductCard - Mobile-friendly card with swipe actions
 * Supports swipe-left for compare, swipe-right for favorite
 */
import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Heart, GitCompare, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductCard, ProductCardProps } from "./ProductCard";

interface SwipeableProductCardProps extends ProductCardProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  enableSwipe?: boolean;
}

const SWIPE_THRESHOLD = 80;
const SWIPE_VELOCITY = 500;

export function SwipeableProductCard({
  onSwipeLeft,
  onSwipeRight,
  enableSwipe = true,
  isFavorited,
  isInCompare,
  ...props
}: SwipeableProductCardProps) {
  const [isRevealed, setIsRevealed] = useState<"left" | "right" | null>(null);
  const constraintsRef = useRef(null);
  const x = useMotionValue(0);

  // Background colors based on swipe direction
  const leftBgOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);
  const rightBgOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);

  // Icon scales
  const leftIconScale = useTransform(x, [-SWIPE_THRESHOLD * 1.5, -SWIPE_THRESHOLD, 0], [1.2, 1, 0.5]);
  const rightIconScale = useTransform(x, [0, SWIPE_THRESHOLD, SWIPE_THRESHOLD * 1.5], [0.5, 1, 1.2]);

  const handleDragEnd = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const { offset, velocity } = info;

      // Check for swipe left (compare)
      if (offset.x < -SWIPE_THRESHOLD || velocity.x < -SWIPE_VELOCITY) {
        setIsRevealed("left");
        onSwipeLeft?.();
        // Reset after animation
        setTimeout(() => setIsRevealed(null), 300);
        return;
      }

      // Check for swipe right (favorite)
      if (offset.x > SWIPE_THRESHOLD || velocity.x > SWIPE_VELOCITY) {
        setIsRevealed("right");
        onSwipeRight?.();
        // Reset after animation
        setTimeout(() => setIsRevealed(null), 300);
        return;
      }
    },
    [onSwipeLeft, onSwipeRight]
  );

  // Disable swipe on non-touch devices
  if (!enableSwipe || typeof window !== "undefined" && !("ontouchstart" in window)) {
    return (
      <ProductCard 
        {...props} 
        isFavorited={isFavorited} 
        isInCompare={isInCompare} 
      />
    );
  }

  return (
    <div ref={constraintsRef} className="relative overflow-hidden rounded-2xl">
      {/* Left action background (Compare) */}
      <motion.div
        className="absolute inset-0 bg-primary flex items-center justify-end pr-6 rounded-2xl"
        style={{ opacity: leftBgOpacity }}
      >
        <motion.div style={{ scale: leftIconScale }} className="text-primary-foreground">
          {isInCompare ? (
            <Check className="h-8 w-8" />
          ) : (
            <GitCompare className="h-8 w-8" />
          )}
        </motion.div>
      </motion.div>

      {/* Right action background (Favorite) */}
      <motion.div
        className="absolute inset-0 bg-destructive flex items-center justify-start pl-6 rounded-2xl"
        style={{ opacity: rightBgOpacity }}
      >
        <motion.div style={{ scale: rightIconScale }} className="text-destructive-foreground">
          <Heart className={cn("h-8 w-8", isFavorited && "fill-current")} />
        </motion.div>
      </motion.div>

      {/* Card */}
      <motion.div
        drag="x"
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x }}
        animate={isRevealed === "left" ? { x: -100 } : isRevealed === "right" ? { x: 100 } : { x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative z-10 touch-pan-y"
      >
        <ProductCard 
          {...props} 
          isFavorited={isFavorited} 
          isInCompare={isInCompare}
        />
      </motion.div>

      {/* Swipe hints (shown on first load) */}
      <SwipeHints />
    </div>
  );
}

// Small hint component for first-time users
function SwipeHints() {
  const [shown, setShown] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("swipe-hints-shown") === "true";
  });

  if (shown) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-foreground/60 backdrop-blur-sm z-20 flex items-center justify-between px-4 rounded-2xl"
      onClick={() => {
        setShown(true);
        localStorage.setItem("swipe-hints-shown", "true");
      }}
    >
      <div className="flex items-center gap-2 text-background">
        <Heart className="h-5 w-5" />
        <span className="text-sm font-medium">← Favoritar</span>
      </div>
      <span className="text-xs text-background/80">Toque para fechar</span>
      <div className="flex items-center gap-2 text-background">
        <span className="text-sm font-medium">Comparar →</span>
        <GitCompare className="h-5 w-5" />
      </div>
    </motion.div>
  );
}
