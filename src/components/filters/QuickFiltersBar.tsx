import React from 'react';
import { cn } from "@/lib/utils";

export interface QuickFilter {
  id: string;
  label: string;
  icon: React.ReactNode;
  filter: Record<string, unknown>;
}

export interface QuickFiltersBarProps {
  filters: QuickFilter[];
  activeFilterId?: string;
  onFilterClick: (filter: QuickFilter) => void;
}

export function QuickFiltersBar({
  filters,
  activeFilterId,
  onFilterClick,
}: QuickFiltersBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
      {filters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          onClick={() => onFilterClick(filter)}
          className={cn(
            "quick-filter-chip group",
            activeFilterId === filter.id && "active"
          )}
        >
          <span
            className={cn(
              "shrink-0 transition-colors",
              activeFilterId === filter.id ? "text-primary-foreground" : "text-primary"
            )}
          >
            {filter.icon}
          </span>
          <span className="whitespace-nowrap">{filter.label}</span>
        </button>
      ))}
    </div>
  );
}

