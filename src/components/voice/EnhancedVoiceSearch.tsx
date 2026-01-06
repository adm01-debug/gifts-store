import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X, Search, Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface EnhancedVoiceSearchProps {
  onSearch: (query: string) => void;
  onClose?: () => void;
  isOpen?: boolean;
  className?: string;
}

const voiceSuggestions = [
  "Canetas personalizadas azuis",
  "Brindes para fim de ano",
  "Kits executivos",
  "Produtos eco-friendly",
  "Mochilas com logo",
];

export function EnhancedVoiceSearch({
  onSearch,
  onClose,
  isOpen = false,
  className,
}: EnhancedVoiceSearchProps) {
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  const handleResult = useCallback((transcript: string) => {
    if (transcript.trim()) {
      onSearch(transcript.trim());
      onClose?.();
    }
  }, [onSearch, onClose]);

  const {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    error,
  } = useSpeechRecognition({
    onResult: handleResult,
    language: "pt-BR",
  });

  useEffect(() => {
    if (isOpen && isSupported) {
      startListening();
      setShowSuggestions(true);
    }
    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (transcript) {
      setShowSuggestions(false);
    }
  }, [transcript]);

  const handleSuggestionClick = (suggestion: string) => {
    onSearch(suggestion);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md",
          className
        )}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg mx-4 p-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Microphone visualization */}
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              {/* Pulse rings */}
              {isListening && (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/20"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/30"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                  />
                </>
              )}

              {/* Mic button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isListening ? stopListening : startListening}
                className={cn(
                  "relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-colors",
                  isListening
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-primary text-primary-foreground"
                )}
                disabled={!isSupported}
              >
                {isListening ? (
                  <MicOff className="h-10 w-10" />
                ) : (
                  <Mic className="h-10 w-10" />
                )}
              </motion.button>
            </div>

            {/* Status text */}
            <div className="text-center space-y-2">
              {!isSupported ? (
                <p className="text-destructive">
                  Seu navegador não suporta busca por voz
                </p>
              ) : error ? (
                <p className="text-destructive">{error}</p>
              ) : isListening ? (
                <div className="flex items-center gap-2 text-primary">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Ouvindo...</span>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Clique no microfone para começar
                </p>
              )}
            </div>

            {/* Transcript display */}
            <AnimatePresence mode="wait">
              {transcript && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full p-4 bg-muted rounded-lg"
                >
                  <p className="text-center font-medium">"{transcript}"</p>
                  <div className="flex justify-center mt-3">
                    <Button
                      size="sm"
                      onClick={() => handleResult(transcript)}
                      className="gap-2"
                    >
                      <Search className="h-4 w-4" />
                      Buscar
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Voice suggestions */}
            <AnimatePresence>
              {showSuggestions && !transcript && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full space-y-3"
                >
                  <p className="text-sm text-muted-foreground text-center flex items-center justify-center gap-2">
                    <Wand2 className="h-4 w-4" />
                    Tente dizer:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {voiceSuggestions.map((suggestion, index) => (
                      <motion.button
                        key={suggestion}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-full transition-colors"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
