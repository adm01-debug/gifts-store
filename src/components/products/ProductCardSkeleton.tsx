import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl bg-card border border-border/50 overflow-hidden">
      {/* Image skeleton */}
      <div className="relative aspect-square">
        <Skeleton className="absolute inset-0" />
      </div>
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Category & supplier */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-1 w-1 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
        
        {/* Title */}
        <Skeleton className="h-5 w-3/4" />
        
        {/* Colors */}
        <div className="flex items-center gap-1.5">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-5 w-5 rounded-full" />
          ))}
        </div>
        
        {/* Price and stock row */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-7 w-24" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  );
}