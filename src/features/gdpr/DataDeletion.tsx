import { useState } from 'react';

export function DataDeletion() {
  const [confirmed, setConfirmed] = useState(false);

  const deleteData = async () => {
    if (!confirmed) return;
    // Delete user data
  };

  return (
    <div>
      <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
      <button onClick={deleteData} disabled={!confirmed}>
        Excluir Meus Dados
      </button>
    </div>
  );
}
