import { useState } from "react";
import { useProductGroupLocations, useProductGroupComponents, useProductGroupLocationTechniques } from "@/hooks/useProductGroupAdvanced";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MapPin, Layers, ChevronDown, Plus } from "lucide-react";

interface ProductGroupAdvancedManagerProps { groupId: string; }

export function ProductGroupAdvancedManager({ groupId }: ProductGroupAdvancedManagerProps) {
  const { locations, addLocation } = useProductGroupLocations(groupId);
  const { components, addComponent } = useProductGroupComponents(groupId);
  const [newLoc, setNewLoc] = useState({ name: "", code: "" });
  const [newComp, setNewComp] = useState({ name: "", code: "" });

  const handleAddLoc = () => {
    if (newLoc.name && newLoc.code) {
      addLocation.mutate({ product_group_id: groupId, location_name: newLoc.name, location_code: newLoc.code, is_active: true, max_area_cm2: null });
      setNewLoc({ name: "", code: "" });
    }
  };

  const handleAddComp = () => {
    if (newComp.name && newComp.code) {
      addComponent.mutate({ product_group_id: groupId, component_name: newComp.name, component_code: newComp.code, is_personalizable: true, sort_order: components.length, is_active: true });
      setNewComp({ name: "", code: "" });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" />Locais do Grupo</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input placeholder="Nome" value={newLoc.name} onChange={(e) => setNewLoc({ ...newLoc, name: e.target.value })} />
            <Input placeholder="Código" value={newLoc.code} onChange={(e) => setNewLoc({ ...newLoc, code: e.target.value })} />
            <Button onClick={handleAddLoc}><Plus className="h-4 w-4" /></Button>
          </div>
          <div className="space-y-2">
            {locations.map((loc) => (
              <Collapsible key={loc.id}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg border hover:bg-muted">
                  <div className="flex items-center gap-2"><span className="font-medium">{loc.location_name}</span><Badge variant="outline">{loc.location_code}</Badge></div>
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-3 bg-muted/30 rounded-b-lg"><LocationTechniques locationId={loc.id} /></CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Layers className="h-5 w-5" />Componentes do Grupo</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input placeholder="Nome" value={newComp.name} onChange={(e) => setNewComp({ ...newComp, name: e.target.value })} />
            <Input placeholder="Código" value={newComp.code} onChange={(e) => setNewComp({ ...newComp, code: e.target.value })} />
            <Button onClick={handleAddComp}><Plus className="h-4 w-4" /></Button>
          </div>
          <div className="space-y-2">
            {components.map((comp) => (
              <div key={comp.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-2"><span className="font-medium">{comp.component_name}</span><Badge variant="outline">{comp.component_code}</Badge></div>
                {comp.is_personalizable && <Badge>Personalizável</Badge>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LocationTechniques({ locationId }: { locationId: string }) {
  const { techniques } = useProductGroupLocationTechniques(locationId);
  return <div className="text-sm">{techniques.length > 0 ? techniques.map((t) => <Badge key={t.id} variant="secondary" className="mr-1">{t.technique_id.slice(0, 8)}</Badge>) : <span className="text-muted-foreground">Nenhuma técnica</span>}</div>;
}
