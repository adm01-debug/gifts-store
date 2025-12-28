export function BIDashboard() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="card">
        <h3>Vendas</h3>
        <p className="text-3xl">R$ 125.000</p>
      </div>
      <div className="card">
        <h3>Clientes</h3>
        <p className="text-3xl">234</p>
      </div>
      <div className="card">
        <h3>Conversão</h3>
        <p className="text-3xl">18%</p>
      </div>
    </div>
  );
}
