import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PersonalizationTechnique, QuoteItemPersonalization } from "@/hooks/useQuotes";

interface QuotePersonalizationSelectorProps {
  techniques: PersonalizationTechnique[];
  quantity: number;
  onAdd: (personalization: QuoteItemPersonalization) => void;
}

export function QuotePersonalizationSelector({
  techniques,
  quantity,
  onAdd,
}: QuotePersonalizationSelectorProps) {
  const [selectedTechnique, setSelectedTechnique] = useState<PersonalizationTechnique | null>(null);
  const [colorsCount, setColorsCount] = useState(1);
  const [positionsCount, setPositionsCount] = useState(1);
  const [areaCm2, setAreaCm2] = useState<number | undefined>();

  const calculateCost = () => {
    if (!selectedTechnique) return 0;
    const setupCost = selectedTechnique.setup_cost || 0;
    const unitCost = (selectedTechnique.unit_cost || 0) * colorsCount * positionsCount;
    return setupCost + (unitCost * quantity);
  };

  const handleAdd = () => {
    if (!selectedTechnique) return;

    const totalCost = calculateCost();

    const personalization: QuoteItemPersonalization = {
      technique_id: selectedTechnique.id,
      technique_name: selectedTechnique.name,
      colors_count: colorsCount,
      positions_count: positionsCount,
      area_cm2: areaCm2,
      setup_cost: selectedTechnique.setup_cost || 0,
      unit_cost: selectedTechnique.unit_cost || 0,
      total_cost: totalCost,
    };

    onAdd(personalization);
    
    // Reset form
    setSelectedTechnique(null);
    setColorsCount(1);
    setPositionsCount(1);
    setAreaCm2(undefined);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  if (techniques.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground text-sm">
        Nenhuma técnica de personalização cadastrada.
        <br />
        Cadastre técnicas no painel de administração.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Technique Selection */}
        <div className="space-y-2">
          <Label>Técnica</Label>
          <Select
            value={selectedTechnique?.id || ""}
            onValueChange={(value) => {
              const technique = techniques.find(t => t.id === value);
              setSelectedTechnique(technique || null);
            }}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Selecionar técnica..." />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              {techniques.map((technique) => (
                <SelectItem key={technique.id} value={technique.id}>
                  {technique.name}
                  {technique.code && ` (${technique.code})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Colors Count */}
        <div className="space-y-2">
          <Label>Nº de Cores</Label>
          <Input
            type="number"
            min={1}
            max={12}
            value={colorsCount}
            onChange={(e) => setColorsCount(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>

        {/* Positions Count */}
        <div className="space-y-2">
          <Label>Posições</Label>
          <Input
            type="number"
            min={1}
            max={10}
            value={positionsCount}
            onChange={(e) => setPositionsCount(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>

        {/* Area */}
        <div className="space-y-2">
          <Label>Área (cm²)</Label>
          <Input
            type="number"
            min={0}
            placeholder="Opcional"
            value={areaCm2 || ""}
            onChange={(e) => setAreaCm2(e.target.value ? parseFloat(e.target.value) : undefined)}
          />
        </div>
      </div>

      {/* Cost Preview and Add Button */}
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="text-sm">
          {selectedTechnique && (
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">
                Setup: {formatCurrency(selectedTechnique.setup_cost || 0)}
              </span>
              <span className="text-muted-foreground">
                Unit: {formatCurrency((selectedTechnique.unit_cost || 0) * colorsCount * positionsCount)}/un
              </span>
              <span className="font-semibold text-primary">
                Total: {formatCurrency(calculateCost())}
              </span>
            </div>
          )}
        </div>
        <Button
          onClick={handleAdd}
          disabled={!selectedTechnique}
          size="sm"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Adicionar Técnica
        </Button>
      </div>
    </div>
  );
}
