import { useState, useCallback } from 'react';
import { z } from 'zod';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

export interface ImportResult<T> { success: T[]; errors: { row: number; field: string; message: string }[]; total: number; fileName: string; }
export type ImportStatus = 'idle' | 'parsing' | 'validating' | 'importing' | 'complete' | 'error';

export function useImportData<T>(options: { schema: z.ZodSchema<T>; onImport: (data: T[]) => Promise<void>; maxRows?: number }) {
  const { schema, onImport, maxRows = 10000 } = options;
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImportResult<T> | null>(null);

  const parseCSV = useCallback(async (file: File): Promise<unknown[]> => new Promise((res, rej) => {
    Papa.parse(file, { header: true, skipEmptyLines: true, transformHeader: h => h.trim().toLowerCase().replace(/\s+/g, '_'), complete: r => res(r.data), error: e => rej(e) });
  }), []);

  const parseExcel = useCallback(async (file: File): Promise<unknown[]> => new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = e => {
      try { const wb = XLSX.read(new Uint8Array(e.target?.result as ArrayBuffer), { type: 'array' }); res(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])); }
      catch (err) { rej(err); }
    };
    reader.onerror = () => rej(new Error('Erro'));
    reader.readAsArrayBuffer(file);
  }), []);

  const validateData = useCallback((data: unknown[]): ImportResult<T> => {
    const success: T[] = [], errors: { row: number; field: string; message: string }[] = [];
    data.slice(0, maxRows).forEach((row, i) => {
      try { success.push(schema.parse(row)); }
      catch (e) { if (e instanceof z.ZodError) e.errors.forEach(err => errors.push({ row: i + 2, field: err.path.join('.'), message: err.message })); }
    });
    return { success, errors, total: data.length, fileName: '' };
  }, [schema, maxRows]);

  const processFile = useCallback(async (file: File) => {
    setStatus('parsing'); setProgress(10); setResult(null);
    try {
      const data = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') ? await parseExcel(file) : await parseCSV(file);
      setStatus('validating'); setProgress(40);
      const res = validateData(data); res.fileName = file.name;
      setResult(res); setProgress(60); setStatus('complete');
      toast[res.errors.length ? 'warning' : 'success'](`${res.success.length} válidos${res.errors.length ? `, ${res.errors.length} erros` : ''}`);
    } catch (e) { setStatus('error'); toast.error(`Erro: ${e instanceof Error ? e.message : 'desconhecido'}`); }
  }, [parseCSV, parseExcel, validateData]);

  const confirmImport = useCallback(async () => {
    if (!result?.success.length) { toast.error('Sem dados'); return; }
    setStatus('importing'); setProgress(70);
    try { await onImport(result.success); setProgress(100); toast.success(`${result.success.length} importados!`); setTimeout(() => { setStatus('idle'); setResult(null); setProgress(0); }, 2000); }
    catch (e) { setStatus('error'); toast.error(`Erro: ${e instanceof Error ? e.message : 'desconhecido'}`); }
  }, [result, onImport]);

  const reset = useCallback(() => { setStatus('idle'); setProgress(0); setResult(null); }, []);

  return { status, progress, result, processFile, confirmImport, reset, isProcessing: ['parsing', 'validating', 'importing'].includes(status) };
}

export default useImportData;
