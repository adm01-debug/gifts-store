import { motion } from "framer-motion";
import { CheckCircle, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SuccessAnimationProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  variant?: "default" | "celebration";
  className?: string;
}

export function SuccessAnimation({
  title,
  description,
  action,
  secondaryAction,
  variant = "default",
  className,
}: SuccessAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center",
        className
      )}
    >
      {/* Success Icon with Animation */}
      <div className="relative mb-6">
        {variant === "celebration" && (
          <>
            {/* Confetti particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  scale: 0,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.5],
                  x: Math.cos((i * 30 * Math.PI) / 180) * 80,
                  y: Math.sin((i * 30 * Math.PI) / 180) * 80 - 20,
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.2 + i * 0.05,
                  ease: "easeOut",
                }}
                className={cn(
                  "absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full",
                  i % 3 === 0 && "bg-primary",
                  i % 3 === 1 && "bg-success",
                  i % 3 === 2 && "bg-warning"
                )}
              />
            ))}
          </>
        )}

        {/* Glow ring */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 0 }}
          transition={{
            duration: 1,
            repeat: 2,
            ease: "easeOut",
          }}
          className="absolute inset-0 rounded-full bg-success/30"
        />

        {/* Main icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.1,
          }}
          className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-success/10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 10,
              delay: 0.3,
            }}
          >
            {variant === "celebration" ? (
              <PartyPopper className="h-10 w-10 text-success" />
            ) : (
              <CheckCircle className="h-10 w-10 text-success" />
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-2 text-xl font-semibold"
      >
        {title}
      </motion.h3>

      {/* Description */}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6 max-w-sm text-muted-foreground"
        >
          {description}
        </motion.p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {action && (
            <Button onClick={action.onClick} className="min-w-[120px]">
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
              className="min-w-[120px]"
            >
              {secondaryAction.label}
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

// Compact inline success for toasts
export function SuccessInline({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn("flex items-center gap-2", className)}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <CheckCircle className="h-5 w-5 text-success" />
      </motion.div>
      <span>{message}</span>
    </motion.div>
  );
}
