import { useState } from "react";
import { Calendar, Percent, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { QuoteItem } from "@/hooks/useQuotes";

interface QuoteSummaryProps {
  items: QuoteItem[];
  discountPercent: number;
  discountAmount: number;
  notes: string;
  internalNotes: string;
  validUntil: string;
  onDiscountPercentChange: (value: number) => void;
  onDiscountAmountChange: (value: number) => void;
  onNotesChange: (value: string) => void;
  onInternalNotesChange: (value: string) => void;
  onValidUntilChange: (value: string) => void;
}

export function QuoteSummary({
  items,
  discountPercent,
  discountAmount,
  notes,
  internalNotes,
  validUntil,
  onDiscountPercentChange,
  onDiscountAmountChange,
  onNotesChange,
  onInternalNotesChange,
  onValidUntilChange,
}: QuoteSummaryProps) {
  const [discountType, setDiscountType] = useState<"percent" | "amount">(
    discountPercent > 0 ? "percent" : "amount"
  );

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  // Calculate totals
  const calculateItemTotal = (item: QuoteItem) => {
    const baseTotal = item.quantity * item.unit_price;
    const personalizationTotal = (item.personalizations || []).reduce(
      (sum, p) => sum + (p.total_cost || 0),
      0
    );
    return baseTotal + personalizationTotal;
  };

  const subtotal = items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  
  const calculatedDiscount = discountType === "percent"
    ? subtotal * (discountPercent / 100)
    : discountAmount;
  
  const total = Math.max(0, subtotal - calculatedDiscount);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-4">
      {/* Totals Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Resumo do Orçamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Items Summary */}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {items.length} produto(s), {totalItems} unidade(s)
            </span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          <Separator />

          {/* Discount */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Desconto</Label>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setDiscountType("percent");
                  onDiscountAmountChange(0);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md border transition-colors ${
                  discountType === "percent"
                    ? "border-primary bg-primary/10 text-primary"
                    : "hover:bg-muted"
                }`}
              >
                <Percent className="h-4 w-4" />
                Percentual
              </button>
              <button
                onClick={() => {
                  setDiscountType("amount");
                  onDiscountPercentChange(0);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md border transition-colors ${
                  discountType === "amount"
                    ? "border-primary bg-primary/10 text-primary"
                    : "hover:bg-muted"
                }`}
              >
                <DollarSign className="h-4 w-4" />
                Valor Fixo
              </button>
            </div>

            {discountType === "percent" ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={discountPercent || ""}
                  onChange={(e) => onDiscountPercentChange(parseFloat(e.target.value) || 0)}
                  className="flex-1"
                  placeholder="0"
                />
                <span className="text-muted-foreground">%</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">R$</span>
                <Input
                  type="number"
                  min={0}
                  max={subtotal}
                  value={discountAmount || ""}
                  onChange={(e) => onDiscountAmountChange(parseFloat(e.target.value) || 0)}
                  className="flex-1"
                  placeholder="0,00"
                />
              </div>
            )}

            {calculatedDiscount > 0 && (
              <div className="flex justify-between text-sm text-destructive">
                <span>Desconto aplicado:</span>
                <span>- {formatCurrency(calculatedDiscount)}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(total)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Validity */}
      <Card>
        <CardContent className="pt-4 space-y-3">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Válido até
            </Label>
            <Input
              type="date"
              value={validUntil}
              onChange={(e) => onValidUntilChange(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardContent className="pt-4 space-y-4">
          <div className="space-y-2">
            <Label>Observações (visíveis ao cliente)</Label>
            <Textarea
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Condições de pagamento, prazo de entrega..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Notas internas (não visíveis ao cliente)</Label>
            <Textarea
              value={internalNotes}
              onChange={(e) => onInternalNotesChange(e.target.value)}
              placeholder="Anotações internas sobre o orçamento..."
              rows={2}
              className="bg-muted/50"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
