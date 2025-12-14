import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = 'default',
}: StatsCardProps) {
  const variantStyles = {
    default: {
      card: 'card-stat',
      icon: 'bg-secondary text-secondary-foreground',
      trend: trend?.isPositive ? 'text-success' : 'text-destructive',
    },
    primary: {
      card: 'card-stat bg-primary/5 border-primary/20',
      icon: 'bg-primary/10 text-primary',
      trend: trend?.isPositive ? 'text-success' : 'text-destructive',
    },
    success: {
      card: 'card-stat bg-success/5 border-success/20',
      icon: 'bg-success/10 text-success',
      trend: trend?.isPositive ? 'text-success' : 'text-destructive',
    },
    warning: {
      card: 'card-stat bg-warning/5 border-warning/20',
      icon: 'bg-warning/10 text-warning',
      trend: trend?.isPositive ? 'text-success' : 'text-destructive',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={cn(styles.card, "hover-lift")}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-display font-bold text-foreground">
              {value}
            </span>
            {trend && (
              <span className={cn("text-sm font-medium", styles.trend)}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", styles.icon)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
