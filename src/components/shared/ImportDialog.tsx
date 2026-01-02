// ============================================
// COMPONENTE: DIALOG DE IMPORTAÇÃO
// Para importar CSV/Excel com validação e preview
// ============================================

import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useImport, ImportConfig, ImportResult } from '@/hooks/useImport';
import { z } from 'zod';

interface ImportDialogProps<T extends Record<string, any>> {
  config: ImportConfig<T>;
  trigger?: React.ReactNode;
}

export function ImportDialog<T extends Record<string, any>>({
  config,
  trigger,
}: ImportDialogProps<T>) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { importData, isImporting } = useImport<T>(config);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    importData.mutate(file, {
      onSuccess: (data) => {
        setResult(data);
        if (data.failed === 0) {
          // Fechar dialog após 2s se não houver erros
          setTimeout(() => {
            setOpen(false);
            reset();
          }, 2000);
        }
      },
    });
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    if (!isImporting) {
      setOpen(false);
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Importar Dados</DialogTitle>
          <DialogDescription>
            Faça upload de um arquivo CSV ou Excel (.xlsx) com os dados para importar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload de arquivo */}
          {!file && !result && (
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Arraste um arquivo ou clique para selecionar
                </p>
                <p className="text-xs text-muted-foreground">
                  Formatos suportados: CSV, Excel (.xlsx, .xls)
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button type="button" variant="secondary" className="mt-4" asChild>
                  <span>Selecionar Arquivo</span>
                </Button>
              </label>
            </div>
          )}

          {/* Arquivo selecionado */}
          {file && !result && (
            <Alert>
              <FileSpreadsheet className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={reset}
                  disabled={isImporting}
                >
                  <X className="h-4 w-4" />
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Colunas obrigatórias */}
          {file && !result && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Colunas obrigatórias:</p>
              <div className="flex flex-wrap gap-2">
                {config.requiredColumns.map((col) => (
                  <Badge key={col} variant="secondary">
                    {col}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Certifique-se de que seu arquivo contém todas estas colunas.
              </p>
            </div>
          )}

          {/* Progress durante importação */}
          {isImporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Importando dados...</span>
                <span className="text-muted-foreground">Aguarde</span>
              </div>
              <Progress value={undefined} className="w-full" />
            </div>
          )}

          {/* Resultado */}
          {result && (
            <div className="space-y-4">
              <Alert
                variant={result.failed === 0 ? 'default' : 'destructive'}
                className={result.failed === 0 ? 'bg-green-50 border-green-200' : ''}
              >
                {result.failed === 0 ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  <div className="space-y-1">
                    <p className="font-medium">
                      {result.failed === 0
                        ? 'Importação concluída com sucesso!'
                        : 'Importação concluída com erros'}
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-sm mt-2">
                      <div>
                        <span className="text-muted-foreground">Total:</span>{' '}
                        <span className="font-medium">{result.total}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Sucesso:</span>{' '}
                        <span className="font-medium text-green-600">{result.success}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Falhas:</span>{' '}
                        <span className="font-medium text-destructive">{result.failed}</span>
                      </div>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>

              {/* Lista de erros */}
              {result.errors.length > 0 && (
                <div className="max-h-60 overflow-y-auto space-y-2">
                  <p className="text-sm font-medium">Erros encontrados:</p>
                  {result.errors.slice(0, 10).map((error, index) => (
                    <Alert key={index} variant="destructive">
                      <AlertDescription className="text-xs">
                        <p className="font-medium">Linha {error.row}</p>
                        <p className="mt-1">{error.error}</p>
                      </AlertDescription>
                    </Alert>
                  ))}
                  {result.errors.length > 10 && (
                    <p className="text-xs text-muted-foreground text-center">
                      ... e mais {result.errors.length - 10} erros
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isImporting}>
            {result ? 'Fechar' : 'Cancelar'}
          </Button>
          {file && !result && (
            <Button onClick={handleImport} disabled={isImporting}>
              {isImporting ? 'Importando...' : 'Importar'}
            </Button>
          )}
          {result && result.failed > 0 && (
            <Button onClick={reset}>Tentar Novamente</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
