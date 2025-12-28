import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function WorkflowBuilder() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Workflow Builder</h2>
      <div className="space-y-4">
        <Button>Add Trigger</Button>
        <Button>Add Action</Button>
        <Button variant="outline">Save Workflow</Button>
      </div>
    </Card>
  );
}
