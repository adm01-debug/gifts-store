// ============================================
// COMPONENTE: LIXEIRA (TRASH VIEW)
// Para visualizar e restaurar itens deletados
// ============================================

import { useState } from 'react';
import { Trash2, RefreshCw, AlertCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useSoftDelete } from '@/hooks/useSoftDelete';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TrashViewProps<T extends { id: string; deleted_at?: string | null; name?: string }> {
  tableName: string;
  queryKey: string[];
  entityName: string;
  columns: Array<{
    key: keyof T;
    label: string;
    render?: (value: any, item: T) => React.ReactNode;
  }>;
}

export function TrashView<T extends { id: string; deleted_at?: string | null; name?: string }>({
  tableName,
  queryKey,
  entityName,
  columns,
}: TrashViewProps<T>) {
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [action, setAction] = useState<'restore' | 'delete' | null>(null);

  const { 
    deletedItems, 
    isLoadingDeleted, 
    restore, 
    permanentDelete 
  } = useSoftDelete<T>({
    tableName,
    queryKey,
    entityName,
  });

  // Filtrar por busca
  const filteredItems = deletedItems.data?.filter((item) => {
    if (!search) return true;
    return Object.values(item).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleRestore = () => {
    if (selectedItem) {
      restore.mutate(selectedItem.id, {
        onSuccess: () => {
          setSelectedItem(null);
          setAction(null);
        },
      });
    }
  };

  const handlePermanentDelete = () => {
    if (selectedItem) {
      permanentDelete.mutate(selectedItem.id, {
        onSuccess: () => {
          setSelectedItem(null);
          setAction(null);
        },
      });
    }
  };

  if (isLoadingDeleted) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trash2 className="h-6 w-6" />
            Lixeira
          </h2>
          <p className="text-muted-foreground">
            {filteredItems?.length || 0} {entityName}(s) arquivado(s)
          </p>
        </div>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar na lixeira..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Aviso */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-yellow-800 dark:text-yellow-200">
            Itens na lixeira são mantidos por 30 dias
          </p>
          <p className="text-yellow-700 dark:text-yellow-300 mt-1">
            Após este período, serão deletados permanentemente e não poderão ser recuperados.
          </p>
        </div>
      </div>

      {/* Tabela */}
      {filteredItems && filteredItems.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={String(col.key)}>{col.label}</TableHead>
                ))}
                <TableHead>Deletado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>
                      {col.render ? col.render(item[col.key], item) : String(item[col.key] || '-')}
                    </TableCell>
                  ))}
                  <TableCell>
                    {item.deleted_at && (
                      <Badge variant="secondary">
                        {format(new Date(item.deleted_at), "dd/MM/yyyy 'às' HH:mm", {
                          locale: ptBR,
                        })}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedItem(item);
                        setAction('restore');
                      }}
                      disabled={restore.isLoading}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Restaurar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedItem(item);
                        setAction('delete');
                      }}
                      disabled={permanentDelete.isLoading}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Deletar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Trash2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum item na lixeira</p>
        </div>
      )}

      {/* Dialog de confirmação - Restaurar */}
      <AlertDialog open={action === 'restore'} onOpenChange={() => setAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restaurar {entityName}?</AlertDialogTitle>
            <AlertDialogDescription>
              O {entityName.toLowerCase()} "{selectedItem?.name}" será restaurado e voltará a
              aparecer na lista principal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestore}>Restaurar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de confirmação - Delete permanente */}
      <AlertDialog open={action === 'delete'} onOpenChange={() => setAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar permanentemente?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Esta ação é <strong>IRREVERSÍVEL</strong>. O {entityName.toLowerCase()} "
                {selectedItem?.name}" será deletado permanentemente e não poderá ser recuperado.
              </p>
              <p className="text-destructive font-medium">Tem certeza que deseja continuar?</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePermanentDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Deletar Permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
