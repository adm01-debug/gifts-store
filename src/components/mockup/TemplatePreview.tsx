import { cn } from "@/lib/utils";

interface TemplateArea {
  name: string;
  positionX: number;
  positionY: number;
  logoWidth: number;
  logoHeight: number;
}

interface TemplatePreviewProps {
  areas: TemplateArea[];
  className?: string;
}

export function TemplatePreview({ areas, className }: TemplatePreviewProps) {
  // Normalize sizes for visual representation
  const maxSize = Math.max(...areas.map(a => Math.max(a.logoWidth, a.logoHeight)));
  const minDotSize = 8;
  const maxDotSize = 20;

  return (
    <div
      className={cn(
        "relative w-20 h-20 rounded-md border border-border bg-muted/50",
        className
      )}
    >
      {/* Grid lines for visual reference */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-border" />
      </div>

      {/* Area markers */}
      {areas.map((area, index) => {
        const normalizedSize = maxSize > 0 
          ? minDotSize + ((Math.max(area.logoWidth, area.logoHeight) / maxSize) * (maxDotSize - minDotSize))
          : minDotSize;

        return (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[8px] font-bold shadow-sm border border-primary-foreground/20"
            style={{
              left: `${area.positionX}%`,
              top: `${area.positionY}%`,
              width: `${normalizedSize}px`,
              height: `${normalizedSize}px`,
            }}
            title={area.name}
          >
            {index + 1}
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute -bottom-1 left-0 right-0 flex justify-center">
        <span className="text-[8px] text-muted-foreground bg-background px-1 rounded">
          {areas.length} {areas.length === 1 ? "área" : "áreas"}
        </span>
      </div>
    </div>
  );
}
