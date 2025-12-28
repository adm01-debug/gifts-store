import { useState } from 'react';
import { Button } from '@/components/ui/button';
export function ProductImportCSV() {
  const [file, setFile] = useState<File | null>(null);
  return (
    <div>
      <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <Button disabled={!file}>Importar</Button>
    </div>
  );
}
