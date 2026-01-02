// ============================================
// FUNCIONALIDADE: IMPORT CSV/EXCEL
// STATUS: 🟡 Parcial → ✅ Implementado Completo
// PRIORIDADE: 🟠 ALTA
// ============================================

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { z } from 'zod';

export interface ImportConfig<T> {
  tableName: string;
  queryKey: string[];
  schema: z.ZodSchema<T>;
  requiredColumns: string[];
  columnMapping?: Record<string, keyof T>;
  beforeInsert?: (data: T[]) => Promise<T[]>;
  batchSize?: number;
}

export interface ImportResult {
  total: number;
  success: number;
  failed: number;
  errors: Array<{ row: number; error: string; data: any }>;
}

export function useImport<T extends Record<string, any>>(config: ImportConfig<T>) {
  const queryClient = useQueryClient();
  const { tableName, queryKey, schema, requiredColumns, columnMapping, beforeInsert, batchSize = 100 } = config;

  // Parse CSV
  const parseCSV = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (error) => {
          reject(new Error(`Erro ao fazer parse do CSV: ${error.message}`));
        },
      });
    });
  };

  // Parse Excel
  const parseExcel = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          resolve(jsonData);
        } catch (error) {
          reject(new Error(`Erro ao fazer parse do Excel: ${error}`));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Erro ao ler arquivo'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  };

  // Validar e mapear dados
  const validateAndMap = (rawData: any[]): { valid: T[]; errors: ImportResult['errors'] } => {
    const valid: T[] = [];
    const errors: ImportResult['errors'] = [];

    rawData.forEach((row, index) => {
      try {
        // Verificar colunas obrigatórias
        const missingColumns = requiredColumns.filter((col) => !row[col] && row[col] !== 0);
        if (missingColumns.length > 0) {
          throw new Error(`Colunas obrigatórias faltando: ${missingColumns.join(', ')}`);
        }

        // Mapear colunas se necessário
        const mappedRow = columnMapping
          ? Object.entries(columnMapping).reduce((acc, [csvCol, dbCol]) => {
              if (row[csvCol] !== undefined) {
                acc[dbCol as string] = row[csvCol];
              }
              return acc;
            }, {} as any)
          : row;

        // Validar com Zod
        const validated = schema.parse(mappedRow);
        valid.push(validated);
      } catch (error) {
        errors.push({
          row: index + 2, // +2 porque: +1 para index, +1 para header
          error: error instanceof Error ? error.message : 'Erro desconhecido',
          data: row,
        });
      }
    });

    return { valid, errors };
  };

  // Import mutation
  const importData = useMutation({
    mutationFn: async (file: File) => {
      // Parse arquivo
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      let rawData: any[];

      if (fileExt === 'csv') {
        rawData = await parseCSV(file);
      } else if (fileExt === 'xlsx' || fileExt === 'xls') {
        rawData = await parseExcel(file);
      } else {
        throw new Error('Formato de arquivo não suportado. Use CSV ou Excel (.xlsx)');
      }

      if (rawData.length === 0) {
        throw new Error('Arquivo vazio ou sem dados válidos');
      }

      // Validar e mapear
      const { valid, errors } = validateAndMap(rawData);

      if (valid.length === 0) {
        throw new Error('Nenhum registro válido encontrado no arquivo');
      }

      // Before insert hook
      let dataToInsert = valid;
      if (beforeInsert) {
        dataToInsert = await beforeInsert(valid);
      }

      // Inserir em lotes
      const result: ImportResult = {
        total: rawData.length,
        success: 0,
        failed: errors.length,
        errors,
      };

      for (let i = 0; i < dataToInsert.length; i += batchSize) {
        const batch = dataToInsert.slice(i, i + batchSize);
        
        try {
          const { data, error } = await supabase
            .from(tableName)
            .insert(batch)
            .select();

          if (error) throw error;
          
          result.success += batch.length;
        } catch (error) {
          // Em caso de erro no lote, tentar inserir um por um
          for (const item of batch) {
            try {
              await supabase.from(tableName).insert(item);
              result.success++;
            } catch (itemError) {
              result.failed++;
              result.errors.push({
                row: -1, // Não sabemos a linha exata
                error: itemError instanceof Error ? itemError.message : 'Erro ao inserir',
                data: item,
              });
            }
          }
        }
      }

      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey });
      
      if (result.failed === 0) {
        toast.success(`Importação concluída! ${result.success} registros importados.`);
      } else {
        toast.warning(
          `Importação parcial: ${result.success} sucesso, ${result.failed} falhas. Verifique o relatório.`
        );
      }
    },
    onError: (error: Error) => {
      toast.error(`Erro na importação: ${error.message}`);
    },
  });

  return {
    importData,
    isImporting: importData.isLoading,
  };
}
