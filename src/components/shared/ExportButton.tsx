// ============================================
// COMPONENTE: BOTÃO DE EXPORTAÇÃO
// Dropdown com opções CSV/Excel/PDF
// ============================================

import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useExport, ExportConfig } from '@/hooks/useExport';

interface ExportButtonProps<T extends Record<string, any>> {
  data: T[];
  filename: string;
  columns?: ExportConfig<T>['columns'];
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ExportButton<T extends Record<string, any>>({
  data,
  filename,
  columns,
  variant = 'outline',
  size = 'default',
}: ExportButtonProps<T>) {
  const { exportCSV, exportExcel, exportPDF, isExporting } = useExport<T>();

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    const config = { data, filename, columns };

    switch (format) {
      case 'csv':
        exportCSV.mutate(config);
        break;
      case 'excel':
        exportExcel.mutate(config);
        break;
      case 'pdf':
        exportPDF.mutate(config);
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={isExporting || data.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Exportando...' : 'Exportar'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Escolha o formato</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport('csv')} disabled={isExporting}>
          <FileText className="h-4 w-4 mr-2" />
          CSV
          <span className="ml-auto text-xs text-muted-foreground">
            {data.length} {data.length === 1 ? 'registro' : 'registros'}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('excel')} disabled={isExporting}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Excel
          <span className="ml-auto text-xs text-muted-foreground">
            {data.length} {data.length === 1 ? 'registro' : 'registros'}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')} disabled={isExporting}>
          <FileText className="h-4 w-4 mr-2" />
          PDF
          <span className="ml-auto text-xs text-muted-foreground">
            {data.length} {data.length === 1 ? 'registro' : 'registros'}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
