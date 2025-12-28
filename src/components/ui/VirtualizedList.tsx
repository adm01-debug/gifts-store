import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export function VirtualizedList({ items, renderItem, estimateSize = 200 }: any) {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan: 5
  });

  return (
    <div ref={parentRef} className="h-screen overflow-auto">
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((vItem) => (
          <div key={vItem.key} style={{
            position: 'absolute', top: 0, left: 0, width: '100%',
            height: `${vItem.size}px`, transform: `translateY(${vItem.start}px)`
          }}>
            {renderItem(items[vItem.index], vItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
}
