import { cn } from "@/lib/utils";
import { Loader2, LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

// ============================================
// LOADING SPINNER
// ============================================

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const spinnerSizes = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function LoadingSpinner({ size = "md", className, label }: LoadingSpinnerProps) {
  return (
    <div 
      className={cn("flex items-center justify-center gap-2", className)}
      role="status"
      aria-label={label || "Carregando"}
    >
      <Loader2 className={cn(spinnerSizes[size], "animate-spin text-primary")} aria-hidden="true" />
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  );
}

// ============================================
// FULL PAGE LOADING
// ============================================

interface FullPageLoadingProps {
  message?: string;
  icon?: LucideIcon;
}

export function FullPageLoading({ message = "Carregando...", icon: Icon }: FullPageLoadingProps) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4">
        {Icon ? (
          <Icon className="h-12 w-12 animate-pulse text-primary" aria-hidden="true" />
        ) : (
          <Loader2 className="h-12 w-12 animate-spin text-primary" aria-hidden="true" />
        )}
        <p className="text-lg font-medium text-foreground">{message}</p>
      </div>
    </div>
  );
}

// ============================================
// INLINE LOADING
// ============================================

interface InlineLoadingProps {
  text?: string;
  className?: string;
}

export function InlineLoading({ text = "Carregando...", className }: InlineLoadingProps) {
  return (
    <span 
      className={cn("inline-flex items-center gap-2 text-muted-foreground", className)}
      role="status"
    >
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      <span className="text-sm">{text}</span>
    </span>
  );
}

// ============================================
// CARD SKELETON
// ============================================

interface CardSkeletonProps {
  count?: number;
  className?: string;
}

export function CardSkeleton({ count = 1, className }: CardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className={cn("overflow-hidden", className)}>
          <Skeleton className="aspect-square w-full" />
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-5 w-1/3" />
          </CardContent>
        </Card>
      ))}
    </>
  );
}

// ============================================
// LIST SKELETON
// ============================================

interface ListSkeletonProps {
  rows?: number;
  className?: string;
  withAvatar?: boolean;
}

export function ListSkeleton({ rows = 5, className, withAvatar = false }: ListSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)} role="status" aria-label="Carregando lista">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
          {withAvatar && <Skeleton className="h-10 w-10 rounded-full shrink-0" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
}

// ============================================
// TABLE SKELETON
// ============================================

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeletonLoading({ rows = 5, columns = 5, className }: TableSkeletonProps) {
  return (
    <div className={cn("w-full", className)} role="status" aria-label="Carregando tabela">
      {/* Header */}
      <div className="flex gap-4 p-4 border-b bg-muted/50">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-4 border-b">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              className={cn(
                "h-4 flex-1",
                colIndex === 0 && "max-w-[200px]"
              )} 
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ============================================
// STAT CARD SKELETON
// ============================================

interface StatSkeletonProps {
  count?: number;
  className?: string;
}

export function StatSkeleton({ count = 4, className }: StatSkeletonProps) {
  return (
    <div className={cn("grid gap-4 grid-cols-2 md:grid-cols-4", className)} role="status">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ============================================
// BUTTON LOADING STATE
// ============================================

interface ButtonLoadingProps {
  loading: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export function ButtonLoadingContent({ loading, loadingText = "Carregando...", children }: ButtonLoadingProps) {
  if (loading) {
    return (
      <>
        <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
        <span>{loadingText}</span>
      </>
    );
  }
  return <>{children}</>;
}
