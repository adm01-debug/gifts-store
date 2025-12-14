import { Skeleton } from "@/components/ui/skeleton";

export function ProductListItemSkeleton() {
  return (
    <div className="flex gap-4 p-4 rounded-xl bg-card border border-border/50">
      {/* Image skeleton */}
      <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg shrink-0" />
      
      {/* Content skeleton */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
        <div className="space-y-2">
          {/* Category & supplier */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-1 w-1 rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>
          
          {/* Title */}
          <Skeleton className="h-5 w-2/3" />
          
          {/* Colors */}
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-4 rounded-full" />
            ))}
          </div>
        </div>
        
        {/* Bottom row */}
        <div className="flex items-center justify-between mt-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
      
      {/* Actions skeleton */}
      <div className="flex flex-col items-center justify-center gap-2 shrink-0">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}

export function ProductListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <ProductListItemSkeleton />
        </div>
      ))}
    </div>
  );
}