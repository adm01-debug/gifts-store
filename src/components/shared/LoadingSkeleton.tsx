import { Skeleton } from '@/components/ui/skeleton';

interface ProductListSkeletonProps {
  count?: number;
  columns?: 1 | 2 | 3 | 4;
}

// Map de classes para garantir que Tailwind as veja em build time
const gridColsMap = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-4',
} as const;

export function ProductListSkeleton({ 
  count = 9, 
  columns = 3 
}: ProductListSkeletonProps) {
  return (
    <div className={`grid ${gridColsMap[columns]} gap-6`}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {[...Array(rows)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
