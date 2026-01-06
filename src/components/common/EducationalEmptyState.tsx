import { LucideIcon, Lightbulb, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Tip {
  icon?: LucideIcon;
  title: string;
  description: string;
}

interface EducationalEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
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
  variant?: "default" | "compact" | "illustrated";
}

export function EducationalEmptyState({
  icon: Icon,
  title,
  description,
  tips,
  action,
  secondaryAction,
  className,
  variant = "default",
}: EducationalEmptyStateProps) {
  if (variant === "compact") {
    return (
      <div className={cn("flex flex-col items-center justify-center py-8 px-4 text-center", className)}>
        <div className="rounded-full bg-muted p-4 mb-3">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-base font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
        {action && (
          <Button size="sm" onClick={action.onClick}>
            {action.icon && <action.icon className="h-4 w-4 mr-2" />}
            {action.label}
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 px-6">
        {/* Main Icon */}
        <div className="relative mb-6">
          <div className="rounded-full bg-gradient-to-br from-primary/10 to-primary/5 p-6">
            <Icon className="h-12 w-12 text-primary" />
          </div>
          <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-1.5 shadow-sm border">
            <Sparkles className="h-4 w-4 text-orange" />
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md text-center">
          {description}
        </p>

        {/* Educational Tips */}
        {tips && tips.length > 0 && (
          <div className="w-full max-w-lg mb-6 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
              <Lightbulb className="h-4 w-4 text-orange" />
              <span>Dicas para começar:</span>
            </div>
            <div className="grid gap-2">
              {tips.map((tip, index) => {
                const TipIcon = tip.icon || ArrowRight;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <TipIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{tip.title}</p>
                      <p className="text-xs text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
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

// Pre-built empty states for common scenarios
export const EmptyStatePresets = {
  quotes: {
    title: "Nenhum orçamento encontrado",
    description: "Comece criando seu primeiro orçamento para um cliente.",
    tips: [
      {
        title: "Selecione produtos do catálogo",
        description: "Navegue pelo catálogo e adicione produtos ao orçamento.",
      },
      {
        title: "Use templates para agilizar",
        description: "Salve orçamentos como template para reutilizar depois.",
      },
      {
        title: "Personalize com mockups",
        description: "Gere mockups para visualizar a personalização.",
      },
    ],
  },
  products: {
    title: "Nenhum produto encontrado",
    description: "Ajuste os filtros ou busque por outros termos.",
    tips: [
      {
        title: "Tente termos mais genéricos",
        description: "Use palavras-chave mais amplas na busca.",
      },
      {
        title: "Limpe os filtros",
        description: "Remova alguns filtros para ver mais resultados.",
      },
    ],
  },
  favorites: {
    title: "Sua lista de favoritos está vazia",
    description: "Salve produtos que você gosta para acessá-los rapidamente.",
    tips: [
      {
        title: "Clique no coração",
        description: "Em qualquer produto, clique no ícone de coração para favoritar.",
      },
      {
        title: "Organize seus favoritos",
        description: "Use favoritos para montar kits personalizados para clientes.",
      },
    ],
  },
  clients: {
    title: "Nenhum cliente cadastrado",
    description: "Sincronize com o Bitrix24 ou adicione clientes manualmente.",
    tips: [
      {
        title: "Sincronize com Bitrix24",
        description: "Importe seus clientes automaticamente do CRM.",
      },
      {
        title: "Cadastre manualmente",
        description: "Adicione clientes com nome, email e cores preferidas.",
      },
    ],
  },
};
