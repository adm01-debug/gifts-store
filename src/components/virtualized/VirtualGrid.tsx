import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

interface VirtualGridProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  columns: number;
  renderItem: (item: T) => React.ReactNode;
}

export function VirtualGrid<T>({ items, height, itemHeight, columns, renderItem }: VirtualGridProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const rows = Math.ceil(items.length / columns);
  
  const rowVirtualizer = useVirtualizer({
    count: rows,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan: 2
  });
  
  return (
    <div ref={parentRef} style={{ height, overflow: 'auto' }}>
      <div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative' }}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: virtualRow.size,
              transform: `translateY(${virtualRow.start}px)`,
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap: '1rem'
            }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => {
              const itemIndex = virtualRow.index * columns + colIndex;
              return itemIndex < items.length ? renderItem(items[itemIndex]) : null;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
