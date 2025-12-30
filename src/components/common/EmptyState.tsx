import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className 
}: EmptyStateProps) {
  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        {Icon && (
          <div className="mb-4 h-20 w-20 rounded-full bg-muted flex items-center justify-center">
            <Icon className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
        
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        
        {description && (
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            {description}
          </p>
        )}
        
        {action && (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

interface EmptyStateInlineProps {
  icon?: LucideIcon;
  text: string;
  className?: string;
}

export function EmptyStateInline({ icon: Icon, text, className }: EmptyStateInlineProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      {Icon && <Icon className="h-12 w-12 text-muted-foreground/50 mb-3" />}
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
