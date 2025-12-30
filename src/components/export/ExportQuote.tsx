import { useState } from "react";
import { FileDown, Mail, MessageSquare, FileText, FileSpreadsheet, Printer, Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { type QuoteData } from "./QuoteBuilder";

interface ExportQuoteProps {
  quote: QuoteData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportQuote({ quote, open, onOpenChange }: ExportQuoteProps) {
  const { toast } = useToast();
  const [emailData, setEmailData] = useState({
    to: quote.client?.email || "",
    subject: `Orçamento ${quote.quoteNumber} - ${quote.client?.name || ""}`,
    message: `Prezado(a) ${quote.client?.name || ""},\n\nSegue em anexo o orçamento ${quote.quoteNumber} conforme solicitado.\n\nFicamos à disposição para quaisquer esclarecimentos.\n\nAtenciosamente,\nEquipe de Vendas`,
  });

  // Gerar PDF
  const handleExportPDF = async () => {
    try {
      // Criar estrutura HTML do orçamento
      const html = generateQuoteHTML(quote);
      
      // Em produção, usar biblioteca como react-pdf ou jspdf
      // Por ora, vamos criar um blob para download
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orcamento-${quote.quoteNumber}.html`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "PDF gerado",
        description: "O orçamento foi exportado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível exportar o orçamento",
        variant: "destructive",
      });
    }
  };

  // Gerar Excel/CSV
  const handleExportExcel = () => {
    try {
      let csv = "Item,Produto,Quantidade,Preço Unitário,Desconto,Subtotal\n";
      
      quote.items.forEach((item, index) => {
        csv += `${index + 1},"${item.product.name}",${item.quantity},${item.unitPrice},${item.discount},${item.subtotal}\n`;
      });
      
      csv += `\nSubtotal,,,,${quote.subtotal}\n`;
      csv += `Desconto (${quote.discountPercent}%),,,,${quote.discountAmount}\n`;
      csv += `Impostos (${quote.taxPercent}%),,,,${quote.taxAmount}\n`;
      csv += `Total,,,,${quote.total}\n`;

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orcamento-${quote.quoteNumber}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Excel gerado",
        description: "O orçamento foi exportado para Excel",
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar Excel",
        description: "Não foi possível exportar o orçamento",
        variant: "destructive",
      });
    }
  };

  // Enviar por Email
  const handleSendEmail = async () => {
    if (!emailData.to) {
      toast({
        title: "Email obrigatório",
        description: "Informe o email do destinatário",
        variant: "destructive",
      });
      return;
    }

    try {
      // Em produção, integrar com API de envio de email
      // Por ora, simular envio
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Email enviado",
        description: `Orçamento enviado para ${emailData.to}`,
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao enviar email",
        description: "Não foi possível enviar o orçamento",
        variant: "destructive",
      });
    }
  };

  // Compartilhar via WhatsApp
  const handleShareWhatsApp = () => {
    const message = `Olá ${quote.client?.name || ""}!\n\nSegue o orçamento ${quote.quoteNumber}:\n\nTotal: R$ ${quote.total.toFixed(2)}\nValidade: ${new Date(quote.validUntil).toLocaleDateString('pt-BR')}\n\nAcesse o link para visualizar os detalhes.`;
    
    const phone = quote.client?.phone?.replace(/\D/g, '') || '';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');

    toast({
      title: "WhatsApp aberto",
      description: "Compartilhe o orçamento via WhatsApp",
    });
  };

  // Imprimir
  const handlePrint = () => {
    const html = generateQuoteHTML(quote);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
    }

    toast({
      title: "Impressão iniciada",
      description: "O orçamento está sendo impresso",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Exportar Orçamento</DialogTitle>
          <DialogDescription>
            Orçamento {quote.quoteNumber} - R$ {quote.total.toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="quick" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quick">Ações Rápidas</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="formats">Formatos</TabsTrigger>
          </TabsList>

          {/* Ações Rápidas */}
          <TabsContent value="quick" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:bg-accent" onClick={handleExportPDF}>
                <CardContent className="flex flex-col items-center justify-center p-6 space-y-2">
                  <FileText className="h-12 w-12 text-primary" />
                  <h3 className="font-semibold">Download PDF</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Baixar orçamento em PDF
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-accent" onClick={handleShareWhatsApp}>
                <CardContent className="flex flex-col items-center justify-center p-6 space-y-2">
                  <MessageSquare className="h-12 w-12 text-success" />
                  <h3 className="font-semibold">WhatsApp</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Compartilhar via WhatsApp
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-accent" onClick={handlePrint}>
                <CardContent className="flex flex-col items-center justify-center p-6 space-y-2">
                  <Printer className="h-12 w-12 text-secondary-foreground" />
                  <h3 className="font-semibold">Imprimir</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Imprimir orçamento
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-accent" onClick={handleExportExcel}>
                <CardContent className="flex flex-col items-center justify-center p-6 space-y-2">
                  <FileSpreadsheet className="h-12 w-12 text-primary" />
                  <h3 className="font-semibold">Excel/CSV</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Exportar planilha
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Email */}
          <TabsContent value="email" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Para</Label>
                <Input
                  type="email"
                  value={emailData.to}
                  onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
                  placeholder="email@exemplo.com"
                />
              </div>

              <div>
                <Label>Assunto</Label>
                <Input
                  value={emailData.subject}
                  onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>

              <div>
                <Label>Mensagem</Label>
                <Textarea
                  value={emailData.message}
                  onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                  rows={8}
                />
              </div>

              <Button onClick={handleSendEmail} className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Enviar Email
              </Button>
            </div>
          </TabsContent>

          {/* Formatos */}
          <TabsContent value="formats" className="space-y-4">
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleExportPDF}
              >
                <FileText className="h-5 w-5 mr-3 text-primary" />
                <div className="text-left">
                  <p className="font-semibold">PDF Profissional</p>
                  <p className="text-xs text-muted-foreground">
                    Documento formatado com logo e identidade visual
                  </p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleExportExcel}
              >
                <FileSpreadsheet className="h-5 w-5 mr-3 text-success" />
                <div className="text-left">
                  <p className="font-semibold">Planilha Excel/CSV</p>
                  <p className="text-xs text-muted-foreground">
                    Dados tabulados para análise
                  </p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handlePrint}
              >
                <Printer className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <p className="font-semibold">Impressão Direta</p>
                  <p className="text-xs text-muted-foreground">
                    Imprimir orçamento formatado
                  </p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  const json = JSON.stringify(quote, null, 2);
                  const blob = new Blob([json], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `orcamento-${quote.quoteNumber}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                  
                  toast({
                    title: "JSON exportado",
                    description: "Dados brutos do orçamento exportados",
                  });
                }}
              >
                <Download className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <p className="font-semibold">Formato JSON</p>
                  <p className="text-xs text-muted-foreground">
                    Dados brutos para integração
                  </p>
                </div>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Função auxiliar para gerar HTML do orçamento
function generateQuoteHTML(quote: QuoteData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Orçamento ${quote.quoteNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 900px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #333; padding-bottom: 20px; }
    .company-name { font-size: 28px; font-weight: bold; color: #333; }
    .quote-number { font-size: 20px; color: #666; margin-top: 10px; }
    .section { margin: 30px 0; }
    .section-title { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 15px; border-bottom: 2px solid #eee; padding-bottom: 5px; }
    .client-info { background: #f5f5f5; padding: 15px; border-radius: 8px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #333; color: white; padding: 12px; text-align: left; }
    td { padding: 10px; border-bottom: 1px solid #ddd; }
    tr:hover { background: #f9f9f9; }
    .totals { text-align: right; margin-top: 20px; }
    .totals-row { display: flex; justify-content: flex-end; margin: 10px 0; font-size: 16px; }
    .totals-label { width: 200px; font-weight: bold; }
    .totals-value { width: 150px; text-align: right; }
    .total-final { font-size: 24px; color: #333; padding-top: 15px; border-top: 2px solid #333; margin-top: 15px; }
    .terms { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 30px; }
    .footer { text-align: center; margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-name">GIFTS STORE</div>
    <div class="quote-number">Orçamento #${quote.quoteNumber}</div>
    <div style="color: #666; margin-top: 10px;">
      Data: ${new Date(quote.createdAt).toLocaleDateString('pt-BR')}<br>
      Validade: ${new Date(quote.validUntil).toLocaleDateString('pt-BR')}
    </div>
  </div>

  ${quote.client ? `
  <div class="section">
    <div class="section-title">Cliente</div>
    <div class="client-info">
      <strong>${quote.client.name}</strong><br>
      Email: ${quote.client.email}<br>
      Telefone: ${quote.client.phone}
    </div>
  </div>
  ` : ''}

  <div class="section">
    <div class="section-title">Produtos</div>
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Produto</th>
          <th style="text-align: center;">Qtd</th>
          <th style="text-align: right;">Preço Unit.</th>
          <th style="text-align: right;">Desconto</th>
          <th style="text-align: right;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${quote.items.map((item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${item.product.name}</td>
          <td style="text-align: center;">${item.quantity}</td>
          <td style="text-align: right;">R$ ${item.unitPrice.toFixed(2)}</td>
          <td style="text-align: right;">R$ ${item.discount.toFixed(2)}</td>
          <td style="text-align: right;"><strong>R$ ${item.subtotal.toFixed(2)}</strong></td>
        </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="totals">
    <div class="totals-row">
      <div class="totals-label">Subtotal:</div>
      <div class="totals-value">R$ ${quote.subtotal.toFixed(2)}</div>
    </div>
    ${quote.discountAmount > 0 ? `
    <div class="totals-row" style="color: #d9534f;">
      <div class="totals-label">Desconto (${quote.discountPercent}%):</div>
      <div class="totals-value">- R$ ${quote.discountAmount.toFixed(2)}</div>
    </div>
    ` : ''}
    ${quote.taxAmount > 0 ? `
    <div class="totals-row">
      <div class="totals-label">Impostos (${quote.taxPercent}%):</div>
      <div class="totals-value">R$ ${quote.taxAmount.toFixed(2)}</div>
    </div>
    ` : ''}
    <div class="totals-row total-final">
      <div class="totals-label">Total:</div>
      <div class="totals-value">R$ ${quote.total.toFixed(2)}</div>
    </div>
  </div>

  ${quote.notes ? `
  <div class="section">
    <div class="section-title">Observações</div>
    <div style="white-space: pre-wrap;">${quote.notes}</div>
  </div>
  ` : ''}

  ${quote.terms ? `
  <div class="terms">
    <div class="section-title">Termos e Condições</div>
    <div style="white-space: pre-wrap;">${quote.terms}</div>
  </div>
  ` : ''}

  <div class="footer">
    Orçamento gerado automaticamente por GIFTS STORE<br>
    ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}
  </div>
</body>
</html>
  `.trim();
}
