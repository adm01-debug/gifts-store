import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateProposalPDF, downloadPDF } from "@/utils/proposalPdfGenerator";

interface ProductItem {
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  color?: string;
  personalization?: {
    technique: string;
    colors: number;
    area: string;
    unitCost: number;
    setupCost: number;
  };
}

interface ProposalGeneratorProps {
  items: ProductItem[];
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  subtotal: number;
  total: number;
  discount?: number;
  quoteNumber?: string;
}

export function ProposalGeneratorButton({
  items,
  clientName = "",
  clientEmail = "",
  clientPhone = "",
  subtotal,
  total,
  discount = 0,
  quoteNumber,
}: ProposalGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    clientName,
    clientEmail,
    clientPhone,
    clientCompany: "",
    sellerName: "",
    sellerEmail: "",
    sellerPhone: "",
    paymentTerms: "50% entrada + 50% na entrega",
    deliveryTime: "15 dias úteis após aprovação",
    notes: "",
    validDays: 30,
  });

  const handleGenerate = async () => {
    if (!formData.clientName) {
      toast({
        title: "Nome do cliente obrigatório",
        description: "Por favor, preencha o nome do cliente.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const today = new Date();
      const validUntil = new Date(today);
      validUntil.setDate(validUntil.getDate() + formData.validDays);

      const proposalData = {
        quoteNumber: quoteNumber || `ORC-${Date.now()}`,
        date: today.toLocaleDateString("pt-BR"),
        validUntil: validUntil.toLocaleDateString("pt-BR"),
        client: {
          name: formData.clientName,
          email: formData.clientEmail || undefined,
          phone: formData.clientPhone || undefined,
          company: formData.clientCompany || undefined,
        },
        seller: {
          name: formData.sellerName || "Vendedor",
          email: formData.sellerEmail || undefined,
          phone: formData.sellerPhone || undefined,
        },
        items,
        subtotal,
        discount: discount > 0 ? discount : undefined,
        total,
        notes: formData.notes || undefined,
        paymentTerms: formData.paymentTerms || undefined,
        deliveryTime: formData.deliveryTime || undefined,
      };

      const pdfBlob = await generateProposalPDF(proposalData);
      const filename = `Proposta_${formData.clientName.replace(/\s+/g, "_")}_${today.toISOString().split("T")[0]}.pdf`;
      
      downloadPDF(pdfBlob, filename);

      toast({
        title: "PDF gerado com sucesso!",
        description: `Proposta "${filename}" foi baixada.`,
      });

      setIsOpen(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Ocorreu um erro ao gerar o PDF. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileDown className="h-4 w-4" />
          Gerar PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerar Proposta em PDF</DialogTitle>
          <DialogDescription>
            Preencha os dados para gerar uma proposta profissional em PDF.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Client Info */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Dados do Cliente</h4>
            <div className="grid gap-3">
              <div>
                <Label htmlFor="clientName">Nome *</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Nome do cliente"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="clientEmail">Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <Label htmlFor="clientPhone">Telefone</Label>
                  <Input
                    id="clientPhone"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="clientCompany">Empresa</Label>
                <Input
                  id="clientCompany"
                  value={formData.clientCompany}
                  onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                  placeholder="Nome da empresa"
                />
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Dados do Vendedor</h4>
            <div className="grid gap-3">
              <div>
                <Label htmlFor="sellerName">Nome</Label>
                <Input
                  id="sellerName"
                  value={formData.sellerName}
                  onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                  placeholder="Seu nome"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="sellerEmail">Email</Label>
                  <Input
                    id="sellerEmail"
                    type="email"
                    value={formData.sellerEmail}
                    onChange={(e) => setFormData({ ...formData, sellerEmail: e.target.value })}
                    placeholder="vendedor@empresa.com"
                  />
                </div>
                <div>
                  <Label htmlFor="sellerPhone">Telefone</Label>
                  <Input
                    id="sellerPhone"
                    value={formData.sellerPhone}
                    onChange={(e) => setFormData({ ...formData, sellerPhone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Proposal Details */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Detalhes da Proposta</h4>
            <div className="grid gap-3">
              <div>
                <Label htmlFor="paymentTerms">Condições de Pagamento</Label>
                <Input
                  id="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  placeholder="Ex: 50% entrada + 50% na entrega"
                />
              </div>
              <div>
                <Label htmlFor="deliveryTime">Prazo de Entrega</Label>
                <Input
                  id="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                  placeholder="Ex: 15 dias úteis"
                />
              </div>
              <div>
                <Label htmlFor="validDays">Validade (dias)</Label>
                <Input
                  id="validDays"
                  type="number"
                  value={formData.validDays}
                  onChange={(e) => setFormData({ ...formData, validDays: parseInt(e.target.value) || 30 })}
                  min={1}
                  max={90}
                />
              </div>
              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Informações adicionais para o cliente..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Itens:</span>
              <span>{items.length} produto(s)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>{subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Desconto:</span>
                <span>-{discount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              </div>
            )}
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total:</span>
              <span className="text-orange">{total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
            </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            className="w-full bg-orange hover:bg-orange-hover"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Gerando PDF...
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4 mr-2" />
                Gerar e Baixar PDF
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
