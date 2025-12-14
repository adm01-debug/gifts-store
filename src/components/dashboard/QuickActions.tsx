import { 
  Search, 
  Palette, 
  Calendar, 
  Users, 
  Gift, 
  Share2, 
  Download, 
  Sparkles 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: 'primary' | 'success' | 'warning' | 'info';
}

const quickActions: QuickAction[] = [
  {
    id: 'match-cores',
    label: 'Match de Cores',
    description: 'Buscar por cores do cliente',
    icon: Palette,
    color: 'primary',
  },
  {
    id: 'datas-proximas',
    label: 'Datas Próximas',
    description: 'Ver datas comemorativas',
    icon: Calendar,
    color: 'warning',
  },
  {
    id: 'por-cliente',
    label: 'Por Cliente',
    description: 'Recomendações personalizadas',
    icon: Users,
    color: 'info',
  },
  {
    id: 'kits',
    label: 'Kits Montados',
    description: 'Ver kits disponíveis',
    icon: Gift,
    color: 'success',
  },
];

interface QuickActionsProps {
  onActionClick?: (actionId: string) => void;
}

export function QuickActions({ onActionClick }: QuickActionsProps) {
  const colorStyles = {
    primary: {
      bg: 'bg-primary/10',
      text: 'text-primary',
      hover: 'hover:bg-primary/15',
    },
    success: {
      bg: 'bg-success/10',
      text: 'text-success',
      hover: 'hover:bg-success/15',
    },
    warning: {
      bg: 'bg-warning/10',
      text: 'text-warning',
      hover: 'hover:bg-warning/15',
    },
    info: {
      bg: 'bg-info/10',
      text: 'text-info',
      hover: 'hover:bg-info/15',
    },
  };

  return (
    <div className="card-elevated p-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-display font-semibold text-foreground">
          Ações Rápidas
        </h3>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickActions.map((action) => {
          const styles = colorStyles[action.color];
          const Icon = action.icon;

          return (
            <button
              key={action.id}
              onClick={() => onActionClick?.(action.id)}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200",
                styles.bg,
                styles.hover,
                "group"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110",
                styles.bg
              )}>
                <Icon className={cn("h-6 w-6", styles.text)} />
              </div>
              <div className="text-center">
                <p className="font-medium text-sm text-foreground">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
