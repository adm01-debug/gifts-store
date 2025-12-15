import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

interface ProposalData {
  quoteNumber: string;
  date: string;
  validUntil: string;
  client: {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
  };
  seller: {
    name: string;
    email?: string;
    phone?: string;
  };
  items: ProductItem[];
  subtotal: number;
  discount?: number;
  total: number;
  notes?: string;
  paymentTerms?: string;
  deliveryTime?: string;
}

export async function generateProposalPDF(data: ProposalData): Promise<Blob> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  // Header with company info
  doc.setFontSize(24);
  doc.setTextColor(234, 88, 12); // Orange color
  doc.text("PROMO BRINDES", margin, yPos);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  yPos += 8;
  doc.text("Brindes Promocionais e Personalizados", margin, yPos);

  // Quote number and date (right aligned)
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Orçamento: ${data.quoteNumber}`, pageWidth - margin, 20, { align: "right" });
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Data: ${data.date}`, pageWidth - margin, 28, { align: "right" });
  doc.text(`Válido até: ${data.validUntil}`, pageWidth - margin, 35, { align: "right" });

  // Separator line
  yPos += 15;
  doc.setDrawColor(234, 88, 12);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);

  // Client and Seller info in two columns
  yPos += 10;
  
  // Client info (left)
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("CLIENTE", margin, yPos);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  yPos += 6;
  doc.text(data.client.name, margin, yPos);
  if (data.client.company) {
    yPos += 5;
    doc.text(data.client.company, margin, yPos);
  }
  if (data.client.email) {
    yPos += 5;
    doc.text(data.client.email, margin, yPos);
  }
  if (data.client.phone) {
    yPos += 5;
    doc.text(data.client.phone, margin, yPos);
  }

  // Seller info (right)
  let sellerY = yPos - (data.client.email ? 16 : 11);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("VENDEDOR", pageWidth / 2 + 10, sellerY - 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(data.seller.name, pageWidth / 2 + 10, sellerY);
  if (data.seller.email) {
    sellerY += 5;
    doc.text(data.seller.email, pageWidth / 2 + 10, sellerY);
  }
  if (data.seller.phone) {
    sellerY += 5;
    doc.text(data.seller.phone, pageWidth / 2 + 10, sellerY);
  }

  // Products table
  yPos += 15;
  
  const tableData = data.items.map((item) => {
    const personalizationText = item.personalization
      ? `${item.personalization.technique} (${item.personalization.colors} cor${item.personalization.colors > 1 ? "es" : ""})`
      : "-";
    
    const itemTotal = item.quantity * item.unitPrice + 
      (item.personalization 
        ? item.quantity * item.personalization.unitCost + item.personalization.setupCost 
        : 0);

    return [
      item.name + (item.color ? `\n(${item.color})` : ""),
      item.sku,
      personalizationText,
      item.quantity.toString(),
      formatCurrency(item.unitPrice),
      formatCurrency(itemTotal),
    ];
  });

  autoTable(doc, {
    startY: yPos,
    head: [["Produto", "SKU", "Personalização", "Qtd", "Unit.", "Total"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: [234, 88, 12],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 25 },
      2: { cellWidth: 35 },
      3: { cellWidth: 15, halign: "center" },
      4: { cellWidth: 25, halign: "right" },
      5: { cellWidth: 30, halign: "right" },
    },
    margin: { left: margin, right: margin },
  });

  // Get the final Y position after the table
  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Totals section
  const totalsX = pageWidth - margin - 60;
  
  doc.setFontSize(10);
  doc.text("Subtotal:", totalsX, yPos);
  doc.text(formatCurrency(data.subtotal), pageWidth - margin, yPos, { align: "right" });
  
  if (data.discount && data.discount > 0) {
    yPos += 6;
    doc.setTextColor(0, 150, 0);
    doc.text("Desconto:", totalsX, yPos);
    doc.text(`-${formatCurrency(data.discount)}`, pageWidth - margin, yPos, { align: "right" });
    doc.setTextColor(0, 0, 0);
  }
  
  yPos += 8;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL:", totalsX, yPos);
  doc.setTextColor(234, 88, 12);
  doc.text(formatCurrency(data.total), pageWidth - margin, yPos, { align: "right" });
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");

  // Additional info
  yPos += 15;
  
  if (data.paymentTerms) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Condições de Pagamento:", margin, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 5;
    doc.text(data.paymentTerms, margin, yPos);
    yPos += 10;
  }

  if (data.deliveryTime) {
    doc.setFont("helvetica", "bold");
    doc.text("Prazo de Entrega:", margin, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 5;
    doc.text(data.deliveryTime, margin, yPos);
    yPos += 10;
  }

  if (data.notes) {
    doc.setFont("helvetica", "bold");
    doc.text("Observações:", margin, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 5;
    const splitNotes = doc.splitTextToSize(data.notes, pageWidth - margin * 2);
    doc.text(splitNotes, margin, yPos);
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    "Orçamento gerado automaticamente pelo sistema Promo Brindes",
    pageWidth / 2,
    footerY,
    { align: "center" }
  );

  return doc.output("blob");
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function downloadPDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
