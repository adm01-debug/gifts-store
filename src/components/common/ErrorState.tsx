import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  error?: Error | string;
  onRetry?: () => void;
  onGoBack?: () => void;
  onGoHome?: () => void;
  showDetails?: boolean;
  variant?: "card" | "inline" | "fullpage";
  className?: string;
}

export function ErrorState({
  title = "Algo deu errado",
  description = "Ocorreu um erro inesperado. Por favor, tente novamente.",
  error,
  onRetry,
  onGoBack,
  onGoHome,
  showDetails = false,
  variant = "card",
  className,
}: ErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : error;

  const content = (
    <>
      {/* Icon */}
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>

      {/* Title */}
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>

      {/* Description */}
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>

      {/* Error Details */}
      {showDetails && errorMessage && (
        <div className="mb-6 w-full max-w-md rounded-lg bg-destructive/5 p-3 text-left">
          <p className="text-xs font-mono text-destructive break-all">
            {errorMessage}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <Button onClick={onRetry} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Tentar novamente
          </Button>
        )}
        {onGoBack && (
          <Button variant="outline" onClick={onGoBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        )}
        {onGoHome && (
          <Button variant="ghost" onClick={onGoHome} className="gap-2">
            <Home className="h-4 w-4" />
            Início
          </Button>
        )}
      </div>
    </>
  );

  if (variant === "inline") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-12 text-center",
          className
        )}
      >
        {content}
      </div>
    );
  }

  if (variant === "fullpage") {
    return (
      <div
        className={cn(
          "flex min-h-[60vh] flex-col items-center justify-center py-12 text-center",
          className
        )}
      >
        {content}
      </div>
    );
  }

  return (
    <Card className={cn("border-destructive/20", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        {content}
      </CardContent>
    </Card>
  );
}

// Compact error for inline use
export function ErrorInline({
  message = "Erro ao carregar",
  onRetry,
  className,
}: {
  message?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg bg-destructive/10 px-4 py-3 text-sm",
        className
      )}
    >
      <AlertTriangle className="h-4 w-4 flex-shrink-0 text-destructive" />
      <span className="flex-1 text-destructive">{message}</span>
      {onRetry && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRetry}
          className="h-7 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
