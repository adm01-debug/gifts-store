import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
}

const sizes = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizes[size])} />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
}

interface LoadingOverlayProps {
  show: boolean;
  text?: string;
  blur?: boolean;
}

export function LoadingOverlay({ show, text = "Carregando...", blur = true }: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center",
      blur ? "backdrop-blur-sm" : "bg-background/80"
    )}>
      <div className="bg-card border rounded-lg p-8 shadow-lg">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  );
}

interface LoadingPageProps {
  text?: string;
}

export function LoadingPage({ text = "Carregando página..." }: LoadingPageProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="xl" text={text} />
    </div>
  );
}
