import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AddToQuoteButtonProps {
  onAdd: () => void;
  isAdded?: boolean;
  size?: "sm" | "default" | "lg" | "icon";
  variant?: "default" | "outline" | "ghost" | "secondary";
  showLabel?: boolean;
  className?: string;
}

export function AddToQuoteButton({
  onAdd,
  isAdded = false,
  size = "sm",
  variant = "default",
  showLabel = true,
  className,
}: AddToQuoteButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (isAdded) return;
    
    setIsAnimating(true);
    onAdd();
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  return (
    <Button
      variant={isAdded ? "secondary" : variant}
      size={size}
      onClick={handleClick}
      disabled={isAdded}
      className={cn(
        "relative overflow-hidden transition-all",
        isAdded && "bg-green-500/10 text-green-600 hover:bg-green-500/20",
        className
      )}
    >
      <AnimatePresence mode="wait">
        {isAnimating ? (
          <motion.div
            key="animating"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            className="flex items-center gap-1"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.3 }}
            >
              <ShoppingCart className="h-4 w-4" />
            </motion.div>
          </motion.div>
        ) : isAdded ? (
          <motion.div
            key="added"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1"
          >
            <Check className="h-4 w-4" />
            {showLabel && <span>Adicionado</span>}
          </motion.div>
        ) : (
          <motion.div
            key="add"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            {showLabel && <span>Orçamento</span>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success ripple effect */}
      <AnimatePresence>
        {isAnimating && (
          <motion.span
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-primary rounded-full"
            style={{ originX: 0.5, originY: 0.5 }}
          />
        )}
      </AnimatePresence>
    </Button>
  );
}
