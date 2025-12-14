import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { useQuoteContext } from "@/contexts/QuoteContext";
import { CLIENTS } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  FileText,
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  Printer,
  Download,
  Share2,
  ShoppingCart,
  Building2,
  User,
  Mail,
  Phone,
  Percent,
} from "lucide-react";
import { toast } from "sonner";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function QuotePage() {
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const {
    getItemProducts,
    updateItemByIndex,
    removeItemByIndex,
    clearQuote,
    getSubtotal,
    getTotalItems,
    itemCount,
  } = useQuoteContext();

  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [validDays, setValidDays] = useState(15);

  const products = getItemProducts();
  const subtotal = getSubtotal();
  const totalItems = getTotalItems();

  const selectedClient = CLIENTS.find((c) => c.id === selectedClientId);

  const discountAmount =
    discountType === "percentage" ? (subtotal * discount) / 100 : discount;
  const total = subtotal - discountAmount;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    const client = CLIENTS.find((c) => c.id === clientId);
    if (client) {
      setClientName(client.name);
      setClientEmail(client.email || "");
      setClientPhone(client.phone || "");
    }
  };

  const handleQuantityChange = (index: number, delta: number) => {
    const item = products[index];
    if (!item) return;

    const product = item;
    const newQuantity = Math.max(
      product.minQuantity,
      item.quoteItem.quantity + delta
    );
    updateItemByIndex(index, { quantity: newQuantity });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const itemsList = products
      .map(
        (p) =>
          `• ${p.name} (${p.quoteItem.quantity} un.) - ${formatCurrency(
            p.quoteItem.unitPrice * p.quoteItem.quantity
          )}`
      )
      .join("\n");

    const message = `ORÇAMENTO - PROMO BRINDES

Cliente: ${clientName || "Não informado"}
Data: ${format(new Date(), "dd/MM/yyyy", { locale: ptBR })}
Validade: ${format(addDays(new Date(), validDays), "dd/MM/yyyy", { locale: ptBR })}

ITENS:
${itemsList}

Subtotal: ${formatCurrency(subtotal)}
${discount > 0 ? `Desconto: ${formatCurrency(discountAmount)}\n` : ""}TOTAL: ${formatCurrency(total)}

${notes ? `Observações: ${notes}` : ""}`;

    if (navigator.share) {
      navigator.share({
        title: "Orçamento - PROMO BRINDES",
        text: message,
      });
    } else {
      navigator.clipboard.writeText(message);
      toast.success("Orçamento copiado para a área de transferência!");
    }
  };

  const handleClearQuote = () => {
    clearQuote();
    toast.success("Orçamento limpo");
  };

  if (itemCount === 0) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <FileText className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">
              Orçamento Vazio
            </h1>
            <p className="text-muted-foreground max-w-md">
              Adicione produtos ao orçamento para gerar uma proposta para seu
              cliente.
            </p>
          </div>
          <Button onClick={() => navigate("/")}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Explorar Produtos
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in pb-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
                Orçamento
              </h1>
              <p className="text-muted-foreground">
                {itemCount} {itemCount === 1 ? "item" : "itens"} • {totalItems}{" "}
                unidades
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Limpar orçamento?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação irá remover todos os itens do orçamento. Esta ação
                    não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearQuote}
                    className="bg-destructive text-destructive-foreground"
                  >
                    Limpar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items table */}
            <div className="card-elevated overflow-hidden" ref={printRef}>
              <div className="p-4 border-b border-border bg-muted/30">
                <h2 className="font-display font-semibold text-foreground">
                  Itens do Orçamento
                </h2>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Produto</TableHead>
                    <TableHead className="text-center">Qtd</TableHead>
                    <TableHead className="text-right">Unit.</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product, index) => (
                    <TableRow key={`${product.id}-${index}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover cursor-pointer hover:ring-2 hover:ring-primary"
                            onClick={() => navigate(`/produto/${product.id}`)}
                          />
                          <div>
                            <p className="font-medium text-foreground line-clamp-1">
                              {product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              SKU: {product.sku}
                            </p>
                            {product.quoteItem.selectedColor && (
                              <div className="flex items-center gap-1 mt-1">
                                <div
                                  className="w-3 h-3 rounded-full border border-border"
                                  style={{
                                    backgroundColor:
                                      product.quoteItem.selectedColor.hex,
                                  }}
                                />
                                <span className="text-xs text-muted-foreground">
                                  {product.quoteItem.selectedColor.name}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleQuantityChange(index, -10)}
                            disabled={
                              product.quoteItem.quantity <= product.minQuantity
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            value={product.quoteItem.quantity}
                            onChange={(e) =>
                              updateItemByIndex(index, {
                                quantity: Math.max(
                                  product.minQuantity,
                                  parseInt(e.target.value) || product.minQuantity
                                ),
                              })
                            }
                            className="w-16 h-7 text-center"
                            min={product.minQuantity}
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleQuantityChange(index, 10)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground text-center mt-1">
                          Mín: {product.minQuantity}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(product.quoteItem.unitPrice)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(
                          product.quoteItem.unitPrice *
                            product.quoteItem.quantity
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItemByIndex(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Subtotal
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {formatCurrency(subtotal)}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  {discount > 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-right font-medium text-success"
                      >
                        Desconto{" "}
                        {discountType === "percentage" ? `(${discount}%)` : ""}
                      </TableCell>
                      <TableCell className="text-right font-bold text-success">
                        -{formatCurrency(discountAmount)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  )}
                  <TableRow className="bg-primary/5">
                    <TableCell colSpan={3} className="text-right font-bold text-lg">
                      Total
                    </TableCell>
                    <TableCell className="text-right font-bold text-lg text-primary">
                      {formatCurrency(total)}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>

            {/* Notes */}
            <div className="card-elevated p-4 space-y-3">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                placeholder="Adicione observações, condições de pagamento, prazos de entrega..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          {/* Sidebar - Client info */}
          <div className="space-y-6">
            {/* Client selection */}
            <div className="card-elevated p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold text-foreground">
                  Dados do Cliente
                </h3>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Selecionar cliente cadastrado</Label>
                  <Select value={selectedClientId} onValueChange={handleClientSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {CLIENTS.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: client.primaryColor.hex }}
                            />
                            {client.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="clientName">
                    <User className="h-3 w-3 inline mr-1" />
                    Nome/Empresa
                  </Label>
                  <Input
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Nome do cliente"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientEmail">
                    <Mail className="h-3 w-3 inline mr-1" />
                    E-mail
                  </Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="email@empresa.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientPhone">
                    <Phone className="h-3 w-3 inline mr-1" />
                    Telefone
                  </Label>
                  <Input
                    id="clientPhone"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            </div>

            {/* Discount */}
            <div className="card-elevated p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold text-foreground">
                  Desconto
                </h3>
              </div>

              <div className="flex gap-2">
                <Input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  min={0}
                  className="flex-1"
                />
                <Select
                  value={discountType}
                  onValueChange={(v: "percentage" | "fixed") => setDiscountType(v)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">%</SelectItem>
                    <SelectItem value="fixed">R$</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Validity */}
            <div className="card-elevated p-4 space-y-4">
              <h3 className="font-display font-semibold text-foreground">
                Validade
              </h3>

              <div className="space-y-2">
                <Label>Válido por</Label>
                <Select
                  value={validDays.toString()}
                  onValueChange={(v) => setValidDays(parseInt(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 dias</SelectItem>
                    <SelectItem value="15">15 dias</SelectItem>
                    <SelectItem value="30">30 dias</SelectItem>
                    <SelectItem value="60">60 dias</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Válido até{" "}
                  {format(addDays(new Date(), validDays), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="card-elevated p-4 space-y-3 bg-primary/5">
              <h3 className="font-display font-semibold text-foreground">
                Resumo
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Itens</span>
                  <span className="font-medium">{itemCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Unidades</span>
                  <span className="font-medium">{totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Desconto</span>
                    <span className="font-medium">
                      -{formatCurrency(discountAmount)}
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button className="w-full" size="lg" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Enviar Orçamento
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate("/")}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar mais produtos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}