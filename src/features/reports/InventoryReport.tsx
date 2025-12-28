import { Card } from '@/components/ui/card';

export function InventoryReport() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Inventory Report</h2>
      <div className="space-y-2">
        <div>Products in Stock: 500</div>
        <div>Low Stock Items: 25</div>
        <div>Out of Stock: 5</div>
      </div>
    </Card>
  );
}
