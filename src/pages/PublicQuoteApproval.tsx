import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  CheckCircle, 
  XCircle, 
  FileText, 
  AlertCircle, 
  Loader2, 
  Clock,
  Package,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface QuoteItem {
  id: string;
  product_name: string;
  product_sku?: string;
  product_image_url?: string;
  quantity: number;
  unit_price: number;
  color_name?: string;
  color_hex?: string;
  personalizations?: {
    technique_name: string;
    colors_count: number;
    area_cm2?: number;
    setup_cost?: number;
    unit_cost?: number;
  }[];
}

interface QuoteData {
  quote: {
    id: string;
    quote_number: string;
    status: string;
    subtotal: number;
    discount_percent: number;
    discount_amount: number;
    total: number;
    notes?: string;
    valid_until?: string;
    created_at: string;
    client_response?: string;
    client_response_at?: string;
    client_response_notes?: string;
  };
  client?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  items: QuoteItem[];
  token_used: boolean;
  token_expires_at: string;
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function PublicQuoteApproval() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedAction, setSubmittedAction] = useState<"approve" | "reject" | null>(null);

  useEffect(() => {
    if (token) {
      fetchQuote();
    } else {
      setError("Link inválido");
      setIsLoading(false);
    }
  }, [token]);

  const fetchQuote = async () => {
    try {
      const { data, error: fnError } = await supabase.functions.invoke("quote-approval", {
        body: { action: "get_quote", token },
      });

      if (fnError) throw new Error(fnError.message);
      if (data.error) throw new Error(data.error);

      setQuoteData(data);
      
      // Check if already responded
      if (data.quote.client_response) {
        setSubmitted(true);
        setSubmittedAction(data.quote.client_response === "Aprovado" ? "approve" : "reject");
      }
    } catch (err) {
      console.error("Error fetching quote:", err);
      setError(err instanceof Error ? err.message : "Erro ao carregar orçamento");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (action: "approve" | "reject") => {
    setIsSubmitting(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("quote-approval", {
        body: { action, token, notes },
      });

      if (fnError) throw new Error(fnError.message);
      if (data.error) throw new Error(data.error);

      setSubmitted(true);
      setSubmittedAction(action);
      toast.success(data.message);
    } catch (err) {
      console.error("Error submitting response:", err);
      toast.error(err instanceof Error ? err.message : "Erro ao enviar resposta");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando orçamento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Erro</h2>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quoteData) return null;

  const { quote, client, items, token_expires_at } = quoteData;
  const isExpired = new Date(token_expires_at) < new Date();

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            {submittedAction === "approve" ? (
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            )}
            <h2 className="text-xl font-semibold mb-2">
              {submittedAction === "approve" ? "Orçamento Aprovado!" : "Orçamento Rejeitado"}
            </h2>
            <p className="text-muted-foreground mb-4">
              {submittedAction === "approve"
                ? "Obrigado! Sua aprovação foi registrada. O vendedor entrará em contato em breve."
                : "Sua resposta foi registrada. Se precisar de ajustes, entre em contato com o vendedor."}
            </p>
            <Badge variant="secondary">
              Orçamento: {quote.quote_number}
            </Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="text-center pb-4">
            <h1 className="text-3xl font-bold text-primary">PROMO BRINDES</h1>
            <p className="text-muted-foreground">Brindes Promocionais e Personalizados</p>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Orçamento: {quote.quote_number}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Criado em {format(new Date(quote.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Válido até: {quote.valid_until 
                  ? format(new Date(quote.valid_until), "dd/MM/yyyy") 
                  : "30 dias"}
              </div>
            </div>
            
            {client && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="font-medium">{client.name}</p>
                {client.email && <p className="text-sm text-muted-foreground">{client.email}</p>}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5" />
              Itens do Orçamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item, index) => {
                const personalization = item.personalizations?.[0];
                const personalizationCost = personalization
                  ? (personalization.unit_cost || 0) * item.quantity + (personalization.setup_cost || 0)
                  : 0;
                const itemTotal = item.quantity * item.unit_price + personalizationCost;

                return (
                  <div key={item.id || index} className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                    {item.product_image_url && (
                      <img
                        src={item.product_image_url}
                        alt={item.product_name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium">{item.product_name}</h4>
                      {item.product_sku && (
                        <p className="text-sm text-muted-foreground">SKU: {item.product_sku}</p>
                      )}
                      {item.color_name && (
                        <div className="flex items-center gap-1 mt-1">
                          {item.color_hex && (
                            <span
                              className="w-3 h-3 rounded-full border"
                              style={{ backgroundColor: item.color_hex }}
                            />
                          )}
                          <span className="text-sm">{item.color_name}</span>
                        </div>
                      )}
                      {personalization && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Personalização: {personalization.technique_name} ({personalization.colors_count} cor{personalization.colors_count > 1 ? "es" : ""})
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {item.quantity}x {formatCurrency(item.unit_price)}
                      </p>
                      <p className="font-semibold">{formatCurrency(itemTotal)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Separator className="my-4" />

            {/* Totals */}
            <div className="space-y-2 text-right">
              <div className="flex justify-end gap-8">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>{formatCurrency(quote.subtotal)}</span>
              </div>
              {quote.discount_amount > 0 && (
                <div className="flex justify-end gap-8 text-green-600">
                  <span>Desconto{quote.discount_percent ? ` (${quote.discount_percent}%)` : ""}:</span>
                  <span>-{formatCurrency(quote.discount_amount)}</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-end gap-8 text-xl font-bold">
                <span>Total:</span>
                <span className="text-primary">{formatCurrency(quote.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        {quote.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-muted-foreground">{quote.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Approval Actions */}
        {!isExpired ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sua Resposta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notes">Comentários (opcional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Deixe um comentário para o vendedor..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleSubmit("approve")}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Check className="h-5 w-5 mr-2" />
                  )}
                  Aprovar Orçamento
                </Button>
                <Button
                  size="lg"
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleSubmit("reject")}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 mr-2" />
                  )}
                  Rejeitar Orçamento
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-destructive">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-1">Link Expirado</h3>
              <p className="text-muted-foreground">
                Este link de aprovação expirou. Por favor, solicite um novo link ao vendedor.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Promo Brindes - Sistema de Orçamentos
        </p>
      </div>
    </div>
  );
}
