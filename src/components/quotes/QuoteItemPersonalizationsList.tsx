import { useQuoteItemPersonalizations, QuoteItemPersonalization } from "@/hooks/useQuoteItemPersonalizations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Paintbrush,
  Plus,
  Trash2,
  Pencil,
  Palette,
  MapPin,
  DollarSign,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface QuoteItemPersonalizationsListProps {
  quoteItemId: string;
  onAdd?: () => void;
  onEdit?: (personalization: QuoteItemPersonalization) => void;
}

export function QuoteItemPersonalizationsList({
  quoteItemId,
  onAdd,
  onEdit,
}: QuoteItemPersonalizationsListProps) {
  const { personalizations, totalCost, isLoading, deletePersonalization } =
    useQuoteItemPersonalizations(quoteItemId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Paintbrush className="h-5 w-5" />
          Personalizações
        </CardTitle>
        {onAdd && (
          <Button size="sm" onClick={onAdd}>
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {personalizations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Paintbrush className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nenhuma personalização adicionada</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {personalizations.map((p) => (
                <div
                  key={p.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Palette className="h-3 w-3" />
                        {p.colors_count} {p.colors_count === 1 ? "cor" : "cores"}
                      </Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {p.positions_count} {p.positions_count === 1 ? "posição" : "posições"}
                      </Badge>
                      {p.area_cm2 && (
                        <Badge variant="outline">
                          {p.area_cm2} cm²
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Setup:</span>{" "}
                        <span className="font-medium">{formatCurrency(p.setup_cost)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Unitário:</span>{" "}
                        <span className="font-medium">{formatCurrency(p.unit_cost)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total:</span>{" "}
                        <span className="font-medium text-primary">{formatCurrency(p.total_cost)}</span>
                      </div>
                    </div>

                    {p.notes && (
                      <p className="text-sm text-muted-foreground">{p.notes}</p>
                    )}
                  </div>

                  <div className="flex gap-1">
                    {onEdit && (
                      <Button variant="ghost" size="icon" onClick={() => onEdit(p)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => deletePersonalization.mutate(p.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <span className="font-medium">Custo Total de Personalização</span>
              <span className="text-xl font-bold text-primary flex items-center gap-1">
                <DollarSign className="h-5 w-5" />
                {formatCurrency(totalCost)}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
