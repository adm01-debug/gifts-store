import { LucideIcon, Lightbulb, ArrowRight, Sparkles, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Tip {
  icon?: LucideIcon;
  title: string;
  description: string;
}

type EmptyStateVariant = "default" | "compact" | "inline" | "card" | "educational";
type EmptyStateSize = "sm" | "md" | "lg";

interface UnifiedEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  tips?: Tip[];
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  variant?: EmptyStateVariant;
  size?: EmptyStateSize;
  image?: string;
}

const sizeConfig = {
  sm: {
    container: "py-8",
    iconContainer: "p-4",
    iconSize: "h-8 w-8",
    title: "text-base",
    description: "text-sm",
  },
  md: {
    container: "py-12",
    iconContainer: "p-6",
    iconSize: "h-10 w-10",
    title: "text-lg",
    description: "text-sm",
  },
  lg: {
    container: "py-16",
    iconContainer: "p-8",
    iconSize: "h-12 w-12",
    title: "text-xl",
    description: "text-base",
  },
};

export function UnifiedEmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  tips,
  action,
  secondaryAction,
  className,
  variant = "default",
  size = "md",
  image,
}: UnifiedEmptyStateProps) {
  const config = sizeConfig[size];

  // Inline variant - minimal, single line
  if (variant === "inline") {
    return (
      <div 
        className={cn("flex flex-col items-center justify-center py-12 text-center", className)}
        role="status"
        aria-label={title}
      >
        <Icon className="h-12 w-12 text-muted-foreground/50 mb-3" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    );
  }

  // Compact variant - small footprint
  if (variant === "compact") {
    return (
      <div 
        className={cn("flex flex-col items-center justify-center py-8 px-4 text-center", className)}
        role="status"
        aria-label={title}
      >
        <div className={cn("rounded-full bg-muted", config.iconContainer, "mb-3")}>
          <Icon className={cn(config.iconSize, "text-muted-foreground")} aria-hidden="true" />
        </div>
        <h3 className={cn("font-semibold mb-1", config.title)}>{title}</h3>
        {description && (
          <p className={cn("text-muted-foreground max-w-sm mb-4", config.description)}>{description}</p>
        )}
        {action && (
          <Button size="sm" onClick={action.onClick}>
            {action.icon && <action.icon className="h-4 w-4 mr-2" />}
            {action.label}
          </Button>
        )}
      </div>
    );
  }

  // Card variant - with border
  if (variant === "card") {
    return (
      <Card className={cn("border-dashed", className)}>
        <CardContent 
          className={cn("flex flex-col items-center justify-center px-6 text-center", config.container)}
          role="status"
          aria-label={title}
        >
          {image ? (
            <img 
              src={image} 
              alt=""
              className="mb-4 max-w-xs opacity-50"
              aria-hidden="true"
            />
          ) : (
            <div className={cn("rounded-full bg-muted mb-4", config.iconContainer)}>
              <Icon className={cn(config.iconSize, "text-muted-foreground")} aria-hidden="true" />
            </div>
          )}
          <h3 className={cn("font-semibold mb-2", config.title)}>{title}</h3>
          {description && (
            <p className={cn("text-muted-foreground mb-6 max-w-sm", config.description)}>{description}</p>
          )}
          {action && (
            <Button onClick={action.onClick}>
              {action.icon && <action.icon className="h-4 w-4 mr-2" />}
              {action.label}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Educational variant - with tips
  if (variant === "educational" || tips) {
    return (
      <Card className={cn("border-dashed", className)}>
        <CardContent 
          className="flex flex-col items-center justify-center py-12 px-6"
          role="status"
          aria-label={title}
        >
          {/* Main Icon */}
          <div className="relative mb-6">
            <div className="rounded-full bg-gradient-to-br from-primary/10 to-primary/5 p-6">
              <Icon className="h-12 w-12 text-primary" aria-hidden="true" />
            </div>
            <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-1.5 shadow-sm border">
              <Sparkles className="h-4 w-4 text-orange" aria-hidden="true" />
            </div>
          </div>

          {/* Title & Description */}
          <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mb-6 max-w-md text-center">
              {description}
            </p>
          )}

          {/* Educational Tips */}
          {tips && tips.length > 0 && (
            <div className="w-full max-w-lg mb-6 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
                <Lightbulb className="h-4 w-4 text-orange" aria-hidden="true" />
                <span>Dicas para começar:</span>
              </div>
              <ul className="grid gap-2" role="list">
                {tips.map((tip, index) => {
                  const TipIcon = tip.icon || ArrowRight;
                  return (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <TipIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium">{tip.title}</p>
                        <p className="text-xs text-muted-foreground">{tip.description}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {action && (
              <Button onClick={action.onClick} className="gap-2">
                {action.icon && <action.icon className="h-4 w-4" />}
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button variant="outline" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <div 
      className={cn("flex flex-col items-center justify-center px-4 text-center", config.container, className)}
      role="status"
      aria-label={title}
    >
      {image ? (
        <img 
          src={image} 
          alt=""
          className="mb-4 max-w-xs opacity-50"
          aria-hidden="true"
        />
      ) : (
        <div className={cn("rounded-full bg-muted mb-4", config.iconContainer)}>
          <Icon className={cn(config.iconSize, "text-muted-foreground")} aria-hidden="true" />
        </div>
      )}
      <h3 className={cn("font-semibold mb-2", config.title)}>{title}</h3>
      {description && (
        <p className={cn("text-muted-foreground mb-6 max-w-md", config.description)}>{description}</p>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        {action && (
          <Button onClick={action.onClick}>
            {action.icon && <action.icon className="h-4 w-4 mr-2" />}
            {action.label}
          </Button>
        )}
        {secondaryAction && (
          <Button variant="outline" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}

// Presets for common scenarios
export const EmptyStatePresets = {
  noResults: {
    title: "Nenhum resultado encontrado",
    description: "Tente ajustar os filtros ou buscar por outros termos.",
  },
  noQuotes: {
    title: "Nenhum orçamento ainda",
    description: "Comece criando seu primeiro orçamento para um cliente.",
    tips: [
      { title: "Selecione produtos", description: "Navegue pelo catálogo e adicione ao orçamento." },
      { title: "Use templates", description: "Salve orçamentos como template para reutilizar." },
    ],
  },
  noFavorites: {
    title: "Lista de favoritos vazia",
    description: "Salve produtos que você gosta clicando no coração.",
  },
  noClients: {
    title: "Nenhum cliente cadastrado",
    description: "Sincronize com o Bitrix24 ou adicione manualmente.",
  },
  noOrders: {
    title: "Nenhum pedido ainda",
    description: "Quando orçamentos forem aprovados, eles aparecerão aqui.",
  },
  error: {
    title: "Algo deu errado",
    description: "Não foi possível carregar os dados. Tente novamente.",
  },
};
