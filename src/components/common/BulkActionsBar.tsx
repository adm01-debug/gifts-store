import { Button } from '@/components/ui/button';
import { Trash2, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BulkActionsBarProps {
  selectedCount: number;
  onDelete?: () => void;
  onChangeStatus?: (status: string) => void;
  onClear: () => void;
  statusOptions?: Array<{ value: string; label: string }>;
}

export function BulkActionsBar({
  selectedCount,
  onDelete,
  onChangeStatus,
  onClear,
  statusOptions = []
}: BulkActionsBarProps) {
  const { toast } = useToast();

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom">
        <span className="font-medium">
          {selectedCount} {selectedCount === 1 ? 'item selecionado' : 'itens selecionados'}
        </span>

        <div className="h-6 w-px bg-primary-foreground/20" />

        {onChangeStatus && statusOptions.length > 0 && (
          <div className="flex gap-2">
            {statusOptions.map((status) => (
              <Button
                key={status.value}
                variant="secondary"
                size="sm"
                onClick={() => {
                  onChangeStatus(status.value);
                  toast({
                    title: 'Status atualizado',
                    description: `${selectedCount} itens alterados para "${status.label}"`
                  });
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {status.label}
              </Button>
            ))}
          </div>
        )}

        {onDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (confirm(`Deseja realmente excluir ${selectedCount} itens?`)) {
                onDelete();
                toast({
                  title: 'Itens excluídos',
                  description: `${selectedCount} itens foram removidos`,
                  variant: 'default'
                });
              }
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-primary-foreground hover:text-primary-foreground"
        >
          <X className="w-4 h-4 mr-2" />
          Limpar
        </Button>
      </div>
    </div>
  );
}
