import { usePersonalizationSizes, PersonalizationSize } from "@/hooks/usePersonalizationSizes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Ruler, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PersonalizationSizeSelectorProps {
  techniqueId: string;
  selectedSizeId?: string;
  onSelectSize: (size: PersonalizationSize) => void;
  basePrice?: number;
}

export function PersonalizationSizeSelector({
  techniqueId,
  selectedSizeId,
  onSelectSize,
  basePrice = 0,
}: PersonalizationSizeSelectorProps) {
  const { sizes, isLoading } = usePersonalizationSizes(techniqueId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (sizes.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Ruler className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Nenhum tamanho disponível para esta técnica</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Ruler className="h-5 w-5" />
          Tamanho da Personalização
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedSizeId}
          onValueChange={(value) => {
            const size = sizes.find((s) => s.id === value);
            if (size) onSelectSize(size);
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sizes.map((size) => {
              const calculatedPrice = basePrice * size.price_modifier;
              return (
                <div key={size.id}>
                  <RadioGroupItem
                    value={size.id}
                    id={size.id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={size.id}
                    className="flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors
                      peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5
                      hover:bg-accent/50"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{size.size_label}</div>
                      <div className="text-sm text-muted-foreground">
                        {size.width_cm} x {size.height_cm} cm ({size.area_cm2} cm²)
                      </div>
                    </div>
                    <div className="text-right">
                      {size.price_modifier !== 1 && (
                        <Badge variant={size.price_modifier > 1 ? "destructive" : "secondary"}>
                          {size.price_modifier > 1 ? "+" : ""}
                          {((size.price_modifier - 1) * 100).toFixed(0)}%
                        </Badge>
                      )}
                      {basePrice > 0 && (
                        <div className="text-sm font-medium mt-1 flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {formatCurrency(calculatedPrice)}
                        </div>
                      )}
                    </div>
                  </Label>
                </div>
              );
            })}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
