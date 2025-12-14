import { PurchaseHistory } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShoppingBag, Package, Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ClientPurchaseHistoryProps {
  history: PurchaseHistory[];
}

const statusConfig = {
  completed: {
    label: 'Concluído',
    icon: CheckCircle,
    className: 'bg-success/10 text-success border-success/20',
  },
  pending: {
    label: 'Pendente',
    icon: Clock,
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  cancelled: {
    label: 'Cancelado',
    icon: XCircle,
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
};

export function ClientPurchaseHistory({ history }: ClientPurchaseHistoryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  return (
    <div className="card-elevated p-6 space-y-4">
      <div className="flex items-center gap-2">
        <ShoppingBag className="h-5 w-5 text-primary" />
        <h3 className="font-display font-semibold text-foreground">Histórico de Compras</h3>
        <Badge variant="secondary" className="ml-auto">
          {history.length} pedidos
        </Badge>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <Accordion type="single" collapsible className="space-y-3">
          {history.map((purchase) => {
            const status = statusConfig[purchase.status];
            const StatusIcon = status.icon;
            const totalItems = purchase.products.reduce((acc, p) => acc + p.quantity, 0);

            return (
              <AccordionItem
                key={purchase.id}
                value={purchase.id}
                className="border border-border rounded-xl overflow-hidden bg-card"
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-4 w-full pr-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{formatDate(purchase.date)}</span>
                    </div>
                    <Badge variant="outline" className={status.className}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>
                    <div className="flex items-center gap-2 text-muted-foreground ml-auto">
                      <Package className="h-4 w-4" />
                      <span className="text-sm">{totalItems} itens</span>
                    </div>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(purchase.total)}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead className="text-center">Cor</TableHead>
                        <TableHead className="text-center">Qtd</TableHead>
                        <TableHead className="text-right">Unit.</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchase.products.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.productName}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div
                                className="w-5 h-5 rounded-full border border-border"
                                style={{ backgroundColor: item.color.hex }}
                              />
                              <span className="text-sm text-muted-foreground">
                                {item.color.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.unitPrice)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(item.quantity * item.unitPrice)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </ScrollArea>
    </div>
  );
}