import { useState, useEffect, useMemo } from "react";
import { X, Plus, Minus, Trash2, Save, Send, Calculator, Image as ImageIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { type Product, type Client } from "@/data/mockData";

export interface QuoteItem {
  id: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
  notes?: string;
}

export interface QuoteData {
  id?: string;
  quoteNumber: string;
  client: Client | null;
  items: QuoteItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  total: number;
  notes: string;
  terms: string;
  validUntil: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

interface QuoteBuilderProps {
  initialQuote?: QuoteData;
  onSave?: (quote: QuoteData) => void;
  onSend?: (quote: QuoteData) => void;
  onClose?: () => void;
}

export function QuoteBuilder({ initialQuote, onSave, onSend, onClose }: QuoteBuilderProps) {
  const { toast } = useToast();
  
  // Estado do orçamento
  const [quote, setQuote] = useState<QuoteData>(
    initialQuote || {
      quoteNumber: `ORC-${Date.now()}`,
      client: null,
      items: [],
      subtotal: 0,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 0,
      taxAmount: 0,
      total: 0,
      notes: '',
      terms: 'Pagamento em 30 dias. Validade da proposta: 15 dias.',
      validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );

  // Calcular totais automaticamente
  useEffect(() => {
    const subtotal = quote.items.reduce((sum, item) => sum + item.subtotal, 0);
    const discountAmount = (subtotal * quote.discountPercent) / 100;
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = (afterDiscount * quote.taxPercent) / 100;
    const total = afterDiscount + taxAmount;

    setQuote(prev => ({
      ...prev,
      subtotal,
      discountAmount,
      taxAmount,
      total,
      updatedAt: new Date().toISOString(),
    }));
  }, [quote.items, quote.discountPercent, quote.taxPercent]);

  // Adicionar produto
  const handleAddProduct = (product: Product) => {
    const newItem: QuoteItem = {
      id: `item-${Date.now()}`,
      product,
      quantity: 1,
      unitPrice: product.price,
      discount: 0,
      subtotal: product.price,
    };

    setQuote(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));

    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao orçamento`,
    });
  };

  // Atualizar quantidade
  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;

    setQuote(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId
          ? {
              ...item,
              quantity,
              subtotal: (item.unitPrice - item.discount) * quantity,
            }
          : item
      ),
    }));
  };

  // Atualizar preço unitário
  const handleUpdateUnitPrice = (itemId: string, unitPrice: number) => {
    if (unitPrice < 0) return;

    setQuote(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId
          ? {
              ...item,
              unitPrice,
              subtotal: (unitPrice - item.discount) * item.quantity,
            }
          : item
      ),
    }));
  };

  // Atualizar desconto do item
  const handleUpdateItemDiscount = (itemId: string, discount: number) => {
    if (discount < 0) return;

    setQuote(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId
          ? {
              ...item,
              discount,
              subtotal: (item.unitPrice - discount) * item.quantity,
            }
          : item
      ),
    }));
  };

  // Remover produto
  const handleRemoveItem = (itemId: string) => {
    setQuote(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
    }));

    toast({
      title: "Produto removido",
      description: "O produto foi removido do orçamento",
    });
  };

  // Salvar rascunho
  const handleSave = () => {
    if (!quote.client) {
      toast({
        title: "Cliente obrigatório",
        description: "Selecione um cliente antes de salvar",
        variant: "destructive",
      });
      return;
    }

    if (quote.items.length === 0) {
      toast({
        title: "Adicione produtos",
        description: "O orçamento precisa ter pelo menos um produto",
        variant: "destructive",
      });
      return;
    }

    onSave?.(quote);
    toast({
      title: "Orçamento salvo",
      description: `Orçamento ${quote.quoteNumber} salvo como rascunho`,
    });
  };

  // Enviar orçamento
  const handleSend = () => {
    if (!quote.client) {
      toast({
        title: "Cliente obrigatório",
        description: "Selecione um cliente antes de enviar",
        variant: "destructive",
      });
      return;
    }

    if (quote.items.length === 0) {
      toast({
        title: "Adicione produtos",
        description: "O orçamento precisa ter pelo menos um produto",
        variant: "destructive",
      });
      return;
    }

    const quoteToSend = { ...quote, status: 'sent' as const };
    onSend?.(quoteToSend);
    
    toast({
      title: "Orçamento enviado",
      description: `Orçamento ${quote.quoteNumber} enviado para ${quote.client.name}`,
    });
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{quote.quoteNumber}</h2>
          <p className="text-sm text-muted-foreground">
            {quote.status === 'draft' ? 'Rascunho' : 'Enviado'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
          <Button onClick={handleSend}>
            <Send className="h-4 w-4 mr-2" />
            Enviar
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Separator />

      {/* Conteúdo */}
      <ScrollArea className="flex-1">
        <div className="space-y-6 pr-4">
          {/* Informações do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quote.client ? (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">{quote.client.name}</p>
                    <p className="text-sm text-muted-foreground">{quote.client.email}</p>
                    <p className="text-sm text-muted-foreground">{quote.client.phone}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuote(prev => ({ ...prev, client: null }))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Selecionar Cliente
                </Button>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data de Validade</Label>
                  <Input
                    type="date"
                    value={quote.validUntil}
                    onChange={(e) => setQuote(prev => ({ ...prev, validUntil: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Produtos */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Produtos</CardTitle>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Produto
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {quote.items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum produto adicionado</p>
                  <p className="text-sm">Clique em "Adicionar Produto" para começar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {quote.items.map((item, index) => (
                    <div key={item.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="w-16 h-16 bg-secondary rounded flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-semibold">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">{item.product.category.name}</p>
                            <Badge variant="secondary" className="mt-1">
                              {item.product.supplier.name}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-4 gap-3">
                        <div>
                          <Label className="text-xs">Quantidade</Label>
                          <div className="flex items-center gap-1 mt-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 0)}
                              className="h-8 text-center"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs">Preço Unitário</Label>
                          <Input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => handleUpdateUnitPrice(item.id, parseFloat(e.target.value) || 0)}
                            className="h-8 mt-1"
                            step="0.01"
                          />
                        </div>

                        <div>
                          <Label className="text-xs">Desconto (R$)</Label>
                          <Input
                            type="number"
                            value={item.discount}
                            onChange={(e) => handleUpdateItemDiscount(item.id, parseFloat(e.target.value) || 0)}
                            className="h-8 mt-1"
                            step="0.01"
                          />
                        </div>

                        <div>
                          <Label className="text-xs">Subtotal</Label>
                          <div className="h-8 flex items-center mt-1 font-semibold">
                            R$ {item.subtotal.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cálculos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Totais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Desconto (%)</Label>
                  <Input
                    type="number"
                    value={quote.discountPercent}
                    onChange={(e) => setQuote(prev => ({ ...prev, discountPercent: parseFloat(e.target.value) || 0 }))}
                    step="0.1"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label>Impostos (%)</Label>
                  <Input
                    type="number"
                    value={quote.taxPercent}
                    onChange={(e) => setQuote(prev => ({ ...prev, taxPercent: parseFloat(e.target.value) || 0 }))}
                    step="0.1"
                    min="0"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>R$ {quote.subtotal.toFixed(2)}</span>
                </div>
                {quote.discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-destructive">
                    <span>Desconto ({quote.discountPercent}%):</span>
                    <span>- R$ {quote.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {quote.taxAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Impostos ({quote.taxPercent}%):</span>
                    <span>R$ {quote.taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>R$ {quote.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Observações e Termos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Observações e Termos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Observações</Label>
                <Textarea
                  value={quote.notes}
                  onChange={(e) => setQuote(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Observações adicionais sobre o orçamento..."
                  rows={3}
                />
              </div>
              <div>
                <Label>Termos e Condições</Label>
                <Textarea
                  value={quote.terms}
                  onChange={(e) => setQuote(prev => ({ ...prev, terms: e.target.value }))}
                  placeholder="Termos e condições do orçamento..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
