import { Card } from '@/components/ui/card';

export function SalesDashboard() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="p-6">
        <h3 className="font-bold">Total Sales</h3>
        <p className="text-3xl">R$ 50,000</p>
      </Card>
      <Card className="p-6">
        <h3 className="font-bold">Orders</h3>
        <p className="text-3xl">150</p>
      </Card>
      <Card className="p-6">
        <h3 className="font-bold">Avg. Ticket</h3>
        <p className="text-3xl">R$ 333</p>
      </Card>
    </div>
  );
}
