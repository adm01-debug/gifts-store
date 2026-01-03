// src/components/export/ExportExcelButton.tsx

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportToExcel, type ExcelExportConfig } from "@/utils/excelExport";
import { useToast } from "@/hooks/use-toast";

interface ExportExcelButtonProps {
  /** Configuração da exportação */
  config: ExcelExportConfig;
  /** Texto do botão (padrão: "Exportar Excel") */
  label?: string;
  /** Variante do botão */
  variant?: "default" | "outline" | "secondary" | "ghost";
  /** Tamanho do botão */
  size?: "default" | "sm" | "lg" | "icon";
  /** Desabilitar botão */
  disabled?: boolean;
  /** Classe CSS adicional */
  className?: string;
}

/**
 * Botão de exportação Excel reutilizável
 * 
 * @example
 * ```tsx
 * <ExportExcelButton
 *   config={{
 *     filename: 'orcamentos',
 *     columns: [
 *       { key: 'quote_number', header: 'Número' },
 *       { key: 'client_name', header: 'Cliente' }
 *     ],
 *     data: quotes
 *   }}
 * />
 * ```
 */
export function ExportExcelButton({
  config,
  label = "Exportar Excel",
  variant = "outline",
  size = "default",
  disabled = false,
  className = ""
}: ExportExcelButtonProps) {
  const { toast } = useToast();

  const handleExport = () => {
    try {
      if (config.data.length === 0) {
        toast({
          title: "Nenhum dado para exportar",
          description: "Não há registros para exportar no momento.",
          variant: "destructive"
        });
        return;
      }

      exportToExcel(config);

      toast({
        title: "✅ Exportação concluída!",
        description: `Arquivo ${config.filename}.xlsx baixado com sucesso.`
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Erro ao exportar:', error);
      }
      toast({
        title: "❌ Erro na exportação",
        description: "Não foi possível exportar o arquivo. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleExport}
      disabled={disabled || config.data.length === 0}
      className={className}
    >
      <Download className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
