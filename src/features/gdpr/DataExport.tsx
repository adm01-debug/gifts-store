import { useState } from 'react';

export function DataExport() {
  const [loading, setLoading] = useState(false);

  const exportData = async () => {
    setLoading(true);
    // Export user data
    setLoading(false);
  };

  return (
    <button onClick={exportData} disabled={loading}>
      {loading ? 'Exportando...' : 'Exportar Meus Dados'}
    </button>
  );
}
