import { Client, PurchaseHistory } from "@/data/mockData";
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Calendar,
  Package,
  Repeat
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ClientStatsProps {
  client: Client;
}

export function ClientStats({ client }: ClientStatsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const purchaseHistory = client.purchaseHistory || [];
  const totalOrders = purchaseHistory.length;
  const totalItems = purchaseHistory.reduce(
    (acc, p) => acc + p.products.reduce((a, prod) => a + prod.quantity, 0),
    0
  );
  const avgOrderValue = totalOrders > 0 ? (client.totalSpent || 0) / totalOrders : 0;
  
  const daysSinceLastPurchase = client.lastPurchase 
    ? differenceInDays(new Date(), new Date(client.lastPurchase))
    : null;

  const stats = [
    {
      label: 'Total Gasto',
      value: formatCurrency(client.totalSpent || 0),
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Total de Pedidos',
      value: totalOrders.toString(),
      icon: ShoppingCart,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Ticket Médio',
      value: formatCurrency(avgOrderValue),
      icon: TrendingUp,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      label: 'Itens Comprados',
      value: totalItems.toLocaleString('pt-BR'),
      icon: Package,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Última Compra',
      value: client.lastPurchase 
        ? format(new Date(client.lastPurchase), "dd/MM/yyyy", { locale: ptBR })
        : 'N/A',
      subtext: daysSinceLastPurchase !== null ? `há ${daysSinceLastPurchase} dias` : undefined,
      icon: Calendar,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
    },
    {
      label: 'Cliente Desde',
      value: client.registeredAt
        ? format(new Date(client.registeredAt), "MMM/yyyy", { locale: ptBR })
        : 'N/A',
      icon: Repeat,
      color: 'text-accent-foreground',
      bgColor: 'bg-accent',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="card-elevated p-4 space-y-2 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
              <Icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">
                {stat.value}
              </p>
              {stat.subtext && (
                <p className="text-xs text-muted-foreground">{stat.subtext}</p>
              )}
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}