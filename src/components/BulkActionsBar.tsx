/**
 * Componente de Barra de Ações em Massa
 *
 * @module components/BulkActionsBar
 */

import { Button } from '@/components/ui/button';
import { X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SimpleBulkAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick: () => void;
}

interface BulkActionsBarProps {
  selectedCount: number;
  actions: SimpleBulkAction[];
  onClearSelection: () => void;
  isExecuting?: boolean;
  className?: string;
}

export function BulkActionsBar({
  selectedCount,
  actions,
  onClearSelection,
  isExecuting = false,
  className,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg border bg-primary text-primary-foreground p-2 shadow-lg',
        className
      )}
    >
      <div className="flex items-center gap-2 px-2">
        <span className="text-sm font-medium">
          {selectedCount} selecionado{selectedCount > 1 ? 's' : ''}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
          onClick={onClearSelection}
          disabled={isExecuting}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Limpar seleção</span>
        </Button>
      </div>

      <div className="h-6 w-px bg-primary-foreground/20" />

      <div className="flex items-center gap-1">
        {actions.map((action) => (
          <Button
            key={action.key}
            variant={action.variant ?? 'secondary'}
            size="sm"
            disabled={isExecuting}
            onClick={action.onClick}
            className="gap-2"
          >
            {isExecuting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              action.icon
            )}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default BulkActionsBar;
