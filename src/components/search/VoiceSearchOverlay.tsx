import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoiceSearchOverlayProps {
  isOpen: boolean;
  isListening: boolean;
  transcript: string;
  onClose: () => void;
  onToggleListening: () => void;
}

export function VoiceSearchOverlay({
  isOpen,
  isListening,
  transcript,
  onClose,
  onToggleListening,
}: VoiceSearchOverlayProps) {
  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/95 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 flex flex-col items-center gap-8 p-8"
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 h-10 w-10 rounded-full"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Microphone button with ripple effect */}
            <div className="relative">
              {/* Ripple circles */}
              {isListening && (
                <>
                  <motion.div
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full bg-primary"
                  />
                  <motion.div
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                    className="absolute inset-0 rounded-full bg-primary"
                  />
                  <motion.div
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 1 }}
                    className="absolute inset-0 rounded-full bg-primary"
                  />
                </>
              )}

              {/* Main button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onToggleListening}
                className={cn(
                  "relative z-10 flex items-center justify-center w-32 h-32 rounded-full transition-all duration-300",
                  isListening
                    ? "bg-primary text-primary-foreground shadow-[0_0_60px_rgba(var(--primary),0.5)]"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {isListening ? (
                  <MicOff className="h-12 w-12" />
                ) : (
                  <Mic className="h-12 w-12" />
                )}
              </motion.button>
            </div>

            {/* Status text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {isListening ? "Ouvindo..." : "Busca por Voz"}
              </h2>
              <p className="text-muted-foreground">
                {isListening
                  ? "Fale o nome do produto que você procura"
                  : "Clique no microfone para começar"}
              </p>
            </motion.div>

            {/* Transcript display */}
            <AnimatePresence mode="wait">
              {transcript && (
                <motion.div
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="w-full max-w-md"
                >
                  <div className="bg-card border border-border rounded-xl p-4 shadow-lg">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                      Você disse:
                    </p>
                    <p className="text-lg font-medium text-foreground">
                      "{transcript}"
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sound wave visualization */}
            {isListening && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1"
              >
                {[...Array(9)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: [12, 32, 12],
                    }}
                    transition={{
                      duration: 0.5 + Math.random() * 0.3,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut",
                    }}
                    className="w-1.5 bg-primary rounded-full"
                    style={{ height: 12 }}
                  />
                ))}
              </motion.div>
            )}

            {/* Instructions */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-muted-foreground"
            >
              Pressione <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">ESC</kbd> para fechar
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
