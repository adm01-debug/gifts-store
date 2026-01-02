import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { z } from 'zod';

// ============================================
// INTERFACES COMPARTILHADAS
// ============================================
export interface ImportResult<T> {
  success: T[];
  errors: { row: number; field: string; error: string }[];
  total: number;
}

// ============================================
// 1. IMPORT CSV
// ============================================
export async function importCSV<T>(
  file: File,
  schema: z.ZodSchema<T>,
  options?: {
    skipFirstRow?: boolean;
    delimiter?: string;
  }
): Promise<ImportResult<T>> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      delimiter: options?.delimiter ?? ',',
      complete: (results) => {
        const success: T[] = [];
        const errors: { row: number; field: string; error: string }[] = [];
        
        results.data.forEach((row: any, index: number) => {
          try {
            const validated = schema.parse(row);
            success.push(validated);
          } catch (error) {
            if (error instanceof z.ZodError) {
              error.errors.forEach((err) => {
                errors.push({
                  row: index + 1,
                  field: err.path.join('.'),
                  error: err.message,
                });
              });
            }
          }
        });

        resolve({
          success,
          errors,
          total: results.data.length,
        });
      },
    });
  });
}

// ============================================
// 2. IMPORT EXCEL
// ============================================
export async function importExcel<T>(
  file: File,
  schema: z.ZodSchema<T>,
  sheetName?: string
): Promise<ImportResult<T>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const sheet = sheetName 
          ? workbook.Sheets[sheetName]
          : workbook.Sheets[workbook.SheetNames[0]];
        
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        
        const success: T[] = [];
        const errors: { row: number; field: string; error: string }[] = [];
        
        jsonData.forEach((row: any, index: number) => {
          try {
            const validated = schema.parse(row);
            success.push(validated);
          } catch (error) {
            if (error instanceof z.ZodError) {
              error.errors.forEach((err) => {
                errors.push({
                  row: index + 2,
                  field: err.path.join('.'),
                  error: err.message,
                });
              });
            }
          }
        });

        resolve({
          success,
          errors,
          total: jsonData.length,
        });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// ============================================
// 3. EXPORT CSV
// ============================================
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns?: Array<keyof T>
): void {
  const csv = Papa.unparse(data, {
    columns: columns as string[],
  });
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ============================================
// 4. EXPORT EXCEL
// ============================================
export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  filename: string,
  sheetName: string = 'Dados'
): void {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

// ============================================
// 5. EXPORT PDF (usando jsPDF)
// ============================================
export async function exportToPDF<T extends Record<string, any>>(
  data: T[],
  filename: string,
  options?: {
    title?: string;
    columns?: Array<{ header: string; dataKey: keyof T }>;
  }
): Promise<void> {
  // Implementação com jsPDF + autoTable
  // Requer: npm install jspdf jspdf-autotable
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');
  
  const doc = new jsPDF();
  
  if (options?.title) {
    doc.setFontSize(16);
    doc.text(options.title, 14, 20);
  }
  
  const columns = options?.columns ?? Object.keys(data[0] ?? {}).map(key => ({
    header: key,
    dataKey: key,
  }));
  
  autoTable(doc, {
    startY: options?.title ? 30 : 20,
    head: [columns.map(col => col.header)],
    body: data.map(row => columns.map(col => row[col.dataKey])),
  });
  
  doc.save(`${filename}.pdf`);
}

// ============================================
// 6. DUPLICATE RECORD
// ============================================
export async function duplicateRecord<T extends Record<string, any>>(
  supabase: any,
  tableName: string,
  recordId: string,
  excludeFields: string[] = ['id', 'created_at', 'updated_at']
): Promise<T> {
  // Buscar registro original
  const { data: original, error: fetchError } = await supabase
    .from(tableName)
    .select('*')
    .eq('id', recordId)
    .single();
  
  if (fetchError) throw fetchError;
  
  // Remover campos excluídos
  const duplicate = { ...original };
  excludeFields.forEach(field => delete duplicate[field]);
  
  // Inserir duplicata
  const { data: newRecord, error: insertError } = await supabase
    .from(tableName)
    .insert(duplicate)
    .select()
    .single();
  
  if (insertError) throw insertError;
  
  return newRecord as T;
}
