import { useTags } from "@/hooks/useTags";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tag } from "lucide-react";

interface PopularTagsProps {
  onTagClick?: (tagSlug: string) => void;
  selectedTags?: string[];
  className?: string;
}

export function PopularTags({ onTagClick, selectedTags = [], className }: PopularTagsProps) {
  const { popularTags, isLoading } = useTags();

  if (isLoading) {
    return (
      <div className={className}>
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-6 w-16 rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  if (popularTags.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-3">
        <Tag className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Tags populares</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {popularTags.slice(0, 10).map((tag) => {
          const isSelected = selectedTags.includes(tag.slug);
          return (
            <Badge
              key={tag.id}
              variant={isSelected ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => onTagClick?.(tag.slug)}
              style={tag.color ? { 
                borderColor: isSelected ? undefined : tag.color,
                backgroundColor: isSelected ? tag.color : undefined 
              } : undefined}
            >
              {tag.name}
              {tag.usage_count > 0 && (
                <span className="ml-1 text-xs opacity-70">({tag.usage_count})</span>
              )}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
