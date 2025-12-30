import { Badge } from "@/components/ui/badge";
import { LucideIcon, Clock, Send, CheckCircle, XCircle, FileText, Package, Truck, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

type QuoteStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';

interface StatusConfig {
  label: string;
  icon: LucideIcon;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

const quoteStatusConfig: Record<QuoteStatus, StatusConfig> = {
  draft: {
    label: 'Rascunho',
    icon: FileText,
    variant: 'secondary',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  },
  sent: {
    label: 'Enviado',
    icon: Send,
    variant: 'default',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  },
  approved: {
    label: 'Aprovado',
    icon: CheckCircle,
    variant: 'default',
    className: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  },
  rejected: {
    label: 'Rejeitado',
    icon: XCircle,
    variant: 'destructive',
    className: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  },
  expired: {
    label: 'Expirado',
    icon: Clock,
    variant: 'outline',
    className: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  },
};

const orderStatusConfig: Record<OrderStatus, StatusConfig> = {
  pending: {
    label: 'Pendente',
    icon: Clock,
    variant: 'secondary',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  },
  processing: {
    label: 'Processando',
    icon: Package,
    variant: 'default',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  },
  shipped: {
    label: 'Enviado',
    icon: Truck,
    variant: 'default',
    className: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  },
  delivered: {
    label: 'Entregue',
    icon: CheckCircle,
    variant: 'default',
    className: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  },
  cancelled: {
    label: 'Cancelado',
    icon: XCircle,
    variant: 'destructive',
    className: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  },
};

const paymentStatusConfig: Record<PaymentStatus, StatusConfig> = {
  pending: {
    label: 'Pendente',
    icon: Clock,
    variant: 'secondary',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  },
  paid: {
    label: 'Pago',
    icon: CheckCircle,
    variant: 'default',
    className: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  },
  overdue: {
    label: 'Atrasado',
    icon: XCircle,
    variant: 'destructive',
    className: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  },
  cancelled: {
    label: 'Cancelado',
    icon: XCircle,
    variant: 'outline',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  },
};

interface StatusBadgeProps {
  status: QuoteStatus | OrderStatus | PaymentStatus;
  type: 'quote' | 'order' | 'payment';
  showIcon?: boolean;
  className?: string;
}

export function StatusBadge({ status, type, showIcon = true, className }: StatusBadgeProps) {
  let config: StatusConfig;

  if (type === 'quote') {
    config = quoteStatusConfig[status as QuoteStatus];
  } else if (type === 'order') {
    config = orderStatusConfig[status as OrderStatus];
  } else {
    config = paymentStatusConfig[status as PaymentStatus];
  }

  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={cn("flex items-center gap-1.5", config.className, className)}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
}

// Componentes específicos para cada tipo
export function QuoteStatusBadge({ status, ...props }: Omit<StatusBadgeProps, 'type' | 'status'> & { status: QuoteStatus }) {
  return <StatusBadge status={status} type="quote" {...props} />;
}

export function OrderStatusBadge({ status, ...props }: Omit<StatusBadgeProps, 'type' | 'status'> & { status: OrderStatus }) {
  return <StatusBadge status={status} type="order" {...props} />;
}

export function PaymentStatusBadge({ status, ...props }: Omit<StatusBadgeProps, 'type' | 'status'> & { status: PaymentStatus }) {
  return <StatusBadge status={status} type="payment" {...props} />;
}
