import { cn } from "@/lib/utils";

interface SoundWaveIndicatorProps {
  isActive: boolean;
  className?: string;
  barCount?: number;
}

export function SoundWaveIndicator({ 
  isActive, 
  className,
  barCount = 5 
}: SoundWaveIndicatorProps) {
  return (
    <div className={cn("flex items-center justify-center gap-0.5", className)}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-0.5 bg-primary rounded-full transition-all duration-150",
            isActive ? "animate-sound-wave" : "h-1"
          )}
          style={{
            animationDelay: isActive ? `${i * 100}ms` : "0ms",
            height: isActive ? undefined : "4px",
          }}
        />
      ))}
    </div>
  );
}