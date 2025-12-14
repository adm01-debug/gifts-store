import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Send, FileText } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { QuoteClientSelector } from "@/components/quotes/QuoteClientSelector";
import { QuoteProductSelector } from "@/components/quotes/QuoteProductSelector";
import { QuoteItemsList } from "@/components/quotes/QuoteItemsList";
import { QuoteSummary } from "@/components/quotes/QuoteSummary";
import { useQuotes, QuoteItem, Quote } from "@/hooks/useQuotes";
import { toast } from "sonner";

interface SelectedClient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  ramo?: string;
  nicho?: string;
  primary_color_name?: string;
  primary_color_hex?: string;
}

export default function CreateQuotePage() {
  const navigate = useNavigate();
  const { createQuote, techniques, isLoading } = useQuotes();

  // Quote state
  const [selectedClient, setSelectedClient] = useState<SelectedClient | null>(null);
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [notes, setNotes] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [validUntil, setValidUntil] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30); // 30 days validity by default
    return date.toISOString().split("T")[0];
  });

  const handleAddItem = (item: QuoteItem) => {
    setItems([...items, item]);
    toast.success("Produto adicionado ao orçamento");
  };

  const handleUpdateItem = (index: number, updatedItem: QuoteItem) => {
    const newItems = [...items];
    newItems[index] = updatedItem;
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
    toast.info("Produto removido do orçamento");
  };

  const handleSave = async (status: "draft" | "sent") => {
    if (items.length === 0) {
      toast.error("Adicione pelo menos um produto ao orçamento");
      return;
    }

    const quote: Partial<Quote> = {
      client_id: selectedClient?.id,
      status,
      discount_percent: discountPercent,
      discount_amount: discountAmount,
      notes,
      internal_notes: internalNotes,
      valid_until: validUntil,
    };

    const result = await createQuote(quote, items);

    if (result) {
      navigate("/orcamentos");
    }
  };

  const existingProductIds = items.map((item) => item.product_id);

  return (
    <MainLayout>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/orcamentos")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Novo Orçamento
              </h1>
              <p className="text-muted-foreground">
                Crie um novo orçamento para seu cliente
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleSave("draft")}
              disabled={isLoading}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Salvar Rascunho
            </Button>
            <Button
              onClick={() => handleSave("sent")}
              disabled={isLoading}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Enviar Orçamento
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <QuoteClientSelector
                  selectedClient={selectedClient}
                  onClientSelect={setSelectedClient}
                />
                {selectedClient && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                        style={{
                          backgroundColor:
                            selectedClient.primary_color_hex || "hsl(var(--primary))",
                        }}
                      >
                        {selectedClient.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold">{selectedClient.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedClient.ramo}
                          {selectedClient.nicho && ` • ${selectedClient.nicho}`}
                        </p>
                      </div>
                    </div>
                    {(selectedClient.email || selectedClient.phone) && (
                      <div className="text-sm text-muted-foreground">
                        {selectedClient.email && <p>{selectedClient.email}</p>}
                        {selectedClient.phone && <p>{selectedClient.phone}</p>}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Products */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Produtos</CardTitle>
                <QuoteProductSelector
                  onProductAdd={handleAddItem}
                  existingProductIds={existingProductIds}
                />
              </CardHeader>
              <CardContent>
                <QuoteItemsList
                  items={items}
                  techniques={techniques}
                  onItemUpdate={handleUpdateItem}
                  onItemRemove={handleRemoveItem}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            <QuoteSummary
              items={items}
              discountPercent={discountPercent}
              discountAmount={discountAmount}
              notes={notes}
              internalNotes={internalNotes}
              validUntil={validUntil}
              onDiscountPercentChange={setDiscountPercent}
              onDiscountAmountChange={setDiscountAmount}
              onNotesChange={setNotes}
              onInternalNotesChange={setInternalNotes}
              onValidUntilChange={setValidUntil}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
