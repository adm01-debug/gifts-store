import { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload, RefreshCw, Star, Package } from 'lucide-react';
import { SearchInput } from '@/components/SearchInput';
import { SavedFiltersDropdown } from '@/components/SavedFiltersDropdown';
import { DataImporter } from '@/components/DataImporter';
import { BulkActionsBar } from '@/components/BulkActionsBar';
import { DuplicateButton } from '@/components/DuplicateButton';
import { produtoGiftSchema, giftsStoreImportTemplates } from '@/lib/giftsStoreSchemas';
import { exportToExcel } from '@/lib/excelImporter';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProdutosGiftToolbarProps {
  onSearch: (term: string) => void;
  onRefresh: () => void;
  onNewClick: () => void;
  selectedCount: number;
  onClearSelection: () => void;
  onBulkDestacar: () => void;
  onBulkInativar: () => void;
  currentFilters: Record<string, unknown>;
  data?: unknown[];
}

export const ProdutosGiftToolbar = memo(function ProdutosGiftToolbar({ onSearch, onRefresh, onNewClick, selectedCount, onClearSelection, onBulkDestacar, onBulkInativar, currentFilters, data = [] }: ProdutosGiftToolbarProps) {
  const handleImport = async (produtos: unknown[]) => {
    const { error } = await supabase.from('produtos').insert(produtos);
    if (error) throw error;
    toast.success(`${produtos.length} produtos importados!`);
    onRefresh();
  };

  const handleExport = () => {
    if (data.length === 0) { toast.warning('Nenhum dado'); return; }
    exportToExcel(data as Record<string, unknown>[], [
      { key: 'codigo' as const, label: 'Código' },
      { key: 'nome' as const, label: 'Nome' },
      { key: 'preco' as const, label: 'Preço' },
      { key: 'estoque' as const, label: 'Estoque' },
      { key: 'ativo' as const, label: 'Ativo' },
    ], 'produtos', 'Produtos');
    toast.success('Exportado!');
  };

  const bulkActions = [
    { key: 'destacar', label: 'Destacar', icon: <Star className="h-4 w-4" />, onClick: onBulkDestacar },
    { key: 'inativar', label: 'Inativar', variant: 'destructive' as const, onClick: onBulkInativar },
  ];

  return (
    <div className="space-y-3">
      {selectedCount > 0 && <BulkActionsBar selectedCount={selectedCount} onClearSelection={onClearSelection} actions={bulkActions} />}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <SearchInput onSearch={onSearch} placeholder="Buscar produto..." className="w-64" />
          <SavedFiltersDropdown entityType="produtos" currentFilters={currentFilters} onApplyFilter={() => {}} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh}><RefreshCw className="h-4 w-4" /></Button>
          <DataImporter schema={produtoGiftSchema} columns={giftsStoreImportTemplates.produtos} onImport={handleImport} templateName="produtos" title="Importar Produtos" trigger={<Button variant="outline" size="sm"><Upload className="h-4 w-4" /></Button>} onSuccess={onRefresh} />
          <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4" /></Button>
          <Button size="sm" onClick={onNewClick}><Plus className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
});
export default ProdutosGiftToolbar;
