import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Download, FileText, Printer, Share2 } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuotes, Quote } from "@/hooks/useQuotes";
import { generateProposalPDF, downloadPDF } from "@/utils/proposalPdfGenerator";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  draft: { label: "Rascunho", variant: "secondary" },
  pending: { label: "Pendente", variant: "outline" },
  sent: { label: "Enviado", variant: "default" },
  approved: { label: "Aprovado", variant: "default" },
  rejected: { label: "Rejeitado", variant: "destructive" },
  expired: { label: "Expirado", variant: "secondary" },
};

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function QuoteViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchQuote, isLoading } = useQuotes();
  const { user } = useAuth();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    if (id) {
      loadQuote();
    }
  }, [id]);

  const loadQuote = async () => {
    if (!id) return;
    const data = await fetchQuote(id);
    setQuote(data);
  };

  const handleDownloadPDF = async () => {
    if (!quote) return;

    setIsGeneratingPDF(true);
    try {
      const proposalData = {
        quoteNumber: quote.quote_number || "",
        date: quote.created_at ? format(new Date(quote.created_at), "dd/MM/yyyy", { locale: ptBR }) : "",
        validUntil: quote.valid_until ? format(new Date(quote.valid_until), "dd/MM/yyyy", { locale: ptBR }) : "30 dias",
        client: {
          name: quote.client_name || "Cliente não especificado",
        },
        seller: {
          name: user?.email || "Vendedor",
        },
        items: quote.items?.map((item) => ({
          name: item.product_name,
          sku: item.product_sku || "",
          quantity: item.quantity,
          unitPrice: item.unit_price,
          color: item.color_name,
          personalization: item.personalizations?.[0] ? {
            technique: item.personalizations[0].technique_name || "Personalização",
            colors: item.personalizations[0].colors_count || 1,
            area: `${item.personalizations[0].area_cm2 || 0} cm²`,
            unitCost: item.personalizations[0].unit_cost || 0,
            setupCost: item.personalizations[0].setup_cost || 0,
          } : undefined,
        })) || [],
        subtotal: quote.subtotal,
        discount: quote.discount_amount,
        total: quote.total,
        notes: quote.notes,
      };

      const blob = await generateProposalPDF(proposalData);
      downloadPDF(blob, `orcamento-${quote.quote_number}.pdf`);
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Erro ao gerar PDF");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-6 space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      </MainLayout>
    );
  }

  if (!quote) {
    return (
      <MainLayout>
        <div className="container py-6">
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold">Orçamento não encontrado</h2>
            <p className="text-muted-foreground mt-2">O orçamento solicitado não existe ou foi removido.</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate("/orcamentos")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Orçamentos
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const status = statusConfig[quote.status] || statusConfig.draft;

  return (
    <MainLayout>
      <div className="container py-6 space-y-6 print:py-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/orcamentos")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Orçamento {quote.quote_number}</h1>
              <p className="text-muted-foreground">
                Criado em {quote.created_at ? format(new Date(quote.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "-"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={status.variant}>{status.label}</Badge>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm" disabled>
              <Share2 className="h-4 w-4 mr-2" />
              Enviar
            </Button>
            <Button onClick={handleDownloadPDF} disabled={isGeneratingPDF}>
              <Download className="h-4 w-4 mr-2" />
              {isGeneratingPDF ? "Gerando..." : "Baixar PDF"}
            </Button>
          </div>
        </div>

        {/* Quote Content */}
        <Card className="print:shadow-none print:border-none">
          <CardHeader className="print:pb-2">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-primary">PROMO BRINDES</h2>
                <p className="text-sm text-muted-foreground">Brindes Promocionais e Personalizados</p>
              </div>
              <div className="text-right">
                <CardTitle className="text-lg">Orçamento: {quote.quote_number}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Data: {quote.created_at ? format(new Date(quote.created_at), "dd/MM/yyyy") : "-"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Válido até: {quote.valid_until ? format(new Date(quote.valid_until), "dd/MM/yyyy") : "30 dias"}
                </p>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6 space-y-6">
            {/* Client Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Cliente</h3>
                <p className="text-foreground">{quote.client_name || "Não especificado"}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Vendedor</h3>
                <p className="text-foreground">{user?.email}</p>
              </div>
            </div>

            <Separator />

            {/* Items Table */}
            <div>
              <h3 className="font-semibold mb-4">Itens do Orçamento</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left p-3 font-medium">Produto</th>
                      <th className="text-left p-3 font-medium">SKU</th>
                      <th className="text-left p-3 font-medium">Personalização</th>
                      <th className="text-center p-3 font-medium">Qtd</th>
                      <th className="text-right p-3 font-medium">Unitário</th>
                      <th className="text-right p-3 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quote.items?.map((item, index) => {
                      const personalization = item.personalizations?.[0];
                      const personalizationCost = personalization 
                        ? (personalization.unit_cost || 0) * item.quantity + (personalization.setup_cost || 0)
                        : 0;
                      const itemTotal = item.quantity * item.unit_price + personalizationCost;

                      return (
                        <tr key={index} className="border-b">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              {item.product_image_url && (
                                <img 
                                  src={item.product_image_url} 
                                  alt={item.product_name}
                                  className="w-12 h-12 object-cover rounded print:hidden"
                                />
                              )}
                              <div>
                                <p className="font-medium">{item.product_name}</p>
                                {item.color_name && (
                                  <div className="flex items-center gap-1 mt-1">
                                    {item.color_hex && (
                                      <span 
                                        className="w-3 h-3 rounded-full border" 
                                        style={{ backgroundColor: item.color_hex }}
                                      />
                                    )}
                                    <span className="text-sm text-muted-foreground">{item.color_name}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-muted-foreground">{item.product_sku || "-"}</td>
                          <td className="p-3">
                            {personalization ? (
                              <span className="text-sm">
                                {personalization.technique_name} ({personalization.colors_count || 1} cor{(personalization.colors_count || 1) > 1 ? "es" : ""})
                              </span>
                            ) : "-"}
                          </td>
                          <td className="p-3 text-center">{item.quantity}</td>
                          <td className="p-3 text-right">{formatCurrency(item.unit_price)}</td>
                          <td className="p-3 text-right font-medium">{formatCurrency(itemTotal)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <Separator />

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(quote.subtotal)}</span>
                </div>
                {quote.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto{quote.discount_percent ? ` (${quote.discount_percent}%)` : ""}:</span>
                    <span>-{formatCurrency(quote.discount_amount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">{formatCurrency(quote.total)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {quote.notes && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Observações</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{quote.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
