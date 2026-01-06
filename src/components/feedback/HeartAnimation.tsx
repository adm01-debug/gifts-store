import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeartAnimationProps {
  isActive: boolean;
  size?: "sm" | "md" | "lg";
  showParticles?: boolean;
  className?: string;
}

export function HeartAnimation({
  isActive,
  size = "md",
  showParticles = true,
  className,
}: HeartAnimationProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <div className={cn("relative inline-flex", className)}>
      {/* Particles */}
      <AnimatePresence>
        {isActive && showParticles && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0],
                  x: Math.cos((i * 60 * Math.PI) / 180) * 20,
                  y: Math.sin((i * 60 * Math.PI) / 180) * 20 - 10,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-destructive"
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Heart Icon */}
      <motion.div
        animate={
          isActive
            ? {
                scale: [1, 1.3, 0.9, 1.1, 1],
              }
            : { scale: 1 }
        }
        transition={{
          duration: 0.4,
          ease: "easeInOut",
        }}
      >
        <Heart
          className={cn(
            sizeClasses[size],
            "transition-colors duration-200",
            isActive
              ? "fill-destructive text-destructive"
              : "text-muted-foreground"
          )}
        />
      </motion.div>
    </div>
  );
}

// Button wrapper for favoriting
interface FavoriteButtonProps {
  isFavorited: boolean;
  onToggle: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

export function FavoriteButton({
  isFavorited,
  onToggle,
  size = "md",
  className,
  disabled = false,
}: FavoriteButtonProps) {
  const buttonSizes = {
    sm: "h-8 w-8",
    md: "h-9 w-9",
    lg: "h-10 w-10",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-full",
        "bg-background/80 backdrop-blur-sm border shadow-sm",
        "hover:bg-background hover:shadow-md",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "transition-all duration-200",
        buttonSizes[size],
        className
      )}
      aria-label={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <HeartAnimation isActive={isFavorited} size={size} />
    </motion.button>
  );
}
