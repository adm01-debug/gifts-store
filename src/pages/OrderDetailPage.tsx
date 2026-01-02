import React from 'react';
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Factory,
  PackageCheck,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
  History,
  Edit,
  Save,
  ExternalLink,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useOrders, Order, OrderItem, OrderHistory, OrderStatus, FulfillmentStatus } from "@/hooks/useOrders";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const statusConfig: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode; color: string }> = {
  pending: { label: "Pendente", variant: "outline", icon: <Clock className="h-4 w-4" />, color: "text-yellow-500" },
  confirmed: { label: "Confirmado", variant: "default", icon: <CheckCircle className="h-4 w-4" />, color: "text-blue-500" },
  in_production: { label: "Em Produção", variant: "secondary", icon: <Factory className="h-4 w-4" />, color: "text-orange-500" },
  ready_for_pickup: { label: "Pronto p/ Retirada", variant: "default", icon: <PackageCheck className="h-4 w-4" />, color: "text-purple-500" },
  shipped: { label: "Enviado", variant: "default", icon: <Truck className="h-4 w-4" />, color: "text-indigo-500" },
  delivered: { label: "Entregue", variant: "default", icon: <CheckCircle className="h-4 w-4" />, color: "text-green-500" },
  cancelled: { label: "Cancelado", variant: "destructive", icon: <XCircle className="h-4 w-4" />, color: "text-red-500" },
};

const statusOrder: OrderStatus[] = ["pending", "confirmed", "in_production", "ready_for_pickup", "shipped", "delivered"];

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderById, getOrderItems, getOrderHistory, updateOrderStatus, updateTracking, updateOrder } = useOrders();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [history, setHistory] = useState<OrderHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [shippingMethod, setShippingMethod] = useState("");
  const [isTrackingDialogOpen, setIsTrackingDialogOpen] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (id) {
      loadOrderData();
    }
  }, [id]);

  const loadOrderData = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const [orderData, itemsData, historyData] = await Promise.all([
        getOrderById(id),
        getOrderItems(id),
        getOrderHistory(id),
      ]);
      setOrder(orderData);
      setItems(itemsData);
      setHistory(historyData);
      if (orderData) {
        setNotes(orderData.internal_notes || "");
        setTrackingNumber(orderData.tracking_number || "");
        setTrackingUrl(orderData.tracking_url || "");
        setShippingMethod(orderData.shipping_method || "");
      }
    } catch (error) {
      console.error("Error loading order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return;
    await updateOrderStatus.mutateAsync({ orderId: order.id, status: newStatus });
    loadOrderData();
  };

  const handleFulfillmentChange = async (newStatus: FulfillmentStatus) => {
    if (!order) return;
    await updateOrderStatus.mutateAsync({ orderId: order.id, fulfillmentStatus: newStatus });
    loadOrderData();
  };

  const handleTrackingSubmit = async () => {
    if (!order || !trackingNumber) return;
    await updateTracking.mutateAsync({
      orderId: order.id,
      trackingNumber,
      trackingUrl,
      shippingMethod,
    });
    setIsTrackingDialogOpen(false);
    loadOrderData();
  };

  const handleSaveNotes = async () => {
    if (!order) return;
    await updateOrder.mutateAsync({
      orderId: order.id,
      updates: { internal_notes: notes },
    });
    setIsEditingNotes(false);
    loadOrderData();
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-64 lg:col-span-2" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold">Pedido não encontrado</h2>
          <Button variant="link" onClick={() => navigate("/pedidos")}>
            Voltar para lista de pedidos
          </Button>
        </div>
      </MainLayout>
    );
  }

  const currentStatusIndex = statusOrder.indexOf(order.status);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/pedidos")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{order.order_number}</h1>
              <Badge variant={statusConfig[order.status].variant} className="gap-1">
                {statusConfig[order.status].icon}
                {statusConfig[order.status].label}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Criado em {format(new Date(order.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
          </div>
        </div>

        {/* Status Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Progresso do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {statusOrder.map((status, index) => {
                const config = statusConfig[status];
                const isActive = index <= currentStatusIndex;
                const isCurrent = status === order.status;
                
                return (
                  <div key={status} className="flex flex-col items-center flex-1">
                    <button
                      onClick={() => handleStatusChange(status)}
                      disabled={order.status === "cancelled"}
                      className={`
                        h-10 w-10 rounded-full flex items-center justify-center transition-all
                        ${isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}
                        ${isCurrent ? "ring-2 ring-primary ring-offset-2" : ""}
                        ${order.status !== "cancelled" ? "hover:scale-110 cursor-pointer" : "cursor-not-allowed"}
                      `}
                    >
                      {config.icon}
                    </button>
                    <span className={`text-xs mt-2 text-center ${isActive ? "font-medium" : "text-muted-foreground"}`}>
                      {config.label}
                    </span>
                    {index < statusOrder.length - 1 && (
                      <div className={`absolute h-0.5 w-full top-5 left-1/2 -z-10 ${
                        index < currentStatusIndex ? "bg-primary" : "bg-muted"
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="items">
              <TabsList>
                <TabsTrigger value="items">
                  <Package className="h-4 w-4 mr-2" />
                  Itens ({items.length})
                </TabsTrigger>
                <TabsTrigger value="history">
                  <History className="h-4 w-4 mr-2" />
                  Histórico
                </TabsTrigger>
              </TabsList>

              <TabsContent value="items" className="mt-4">
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4">
                          {item.product_image_url ? (
                            <img
                              src={item.product_image_url}
                              alt={item.product_name}
                              className="h-16 w-16 rounded object-cover"
                            />
                          ) : (
                            <div className="h-16 w-16 rounded bg-muted flex items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium">{item.product_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              SKU: {item.product_sku || "N/A"}
                              {item.color_name && ` • ${item.color_name}`}
                            </p>
                            <p className="text-sm">
                              {item.quantity}x {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(item.unit_price)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(item.subtotal || item.quantity * item.unit_price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                <Card>
                  <CardContent className="p-4">
                    {history.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        Nenhum histórico disponível
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {history.map((entry) => (
                          <div key={entry.id} className="flex gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <History className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{entry.description}</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(entry.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Notes */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Notas Internas</CardTitle>
                {isEditingNotes ? (
                  <Button size="sm" onClick={handleSaveNotes}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setIsEditingNotes(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {isEditingNotes ? (
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Adicione notas internas sobre este pedido..."
                    rows={4}
                  />
                ) : (
                  <p className="text-muted-foreground">
                    {order.internal_notes || "Nenhuma nota adicionada"}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.client ? (
                  <>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{order.client.name}</span>
                    </div>
                    {order.client.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{order.client.email}</span>
                      </div>
                    )}
                    {order.client.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{order.client.phone}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-muted-foreground">Cliente não definido</p>
                )}
              </CardContent>
            </Card>

            {/* Shipping & Tracking */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Envio</CardTitle>
                <Dialog open={isTrackingDialogOpen} onOpenChange={setIsTrackingDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Truck className="h-4 w-4 mr-2" />
                      {order.tracking_number ? "Editar" : "Adicionar"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Informações de Rastreio</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Método de Envio</Label>
                        <Input
                          value={shippingMethod}
                          onChange={(e) => setShippingMethod(e.target.value)}
                          placeholder="Ex: Correios, Transportadora..."
                        />
                      </div>
                      <div>
                        <Label>Código de Rastreio</Label>
                        <Input
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="Ex: BR123456789XX"
                        />
                      </div>
                      <div>
                        <Label>URL de Rastreio (opcional)</Label>
                        <Input
                          value={trackingUrl}
                          onChange={(e) => setTrackingUrl(e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                      <Button onClick={handleTrackingSubmit} className="w-full">
                        Salvar Rastreio
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.shipping_method && (
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span>{order.shipping_method}</span>
                  </div>
                )}
                {order.tracking_number && (
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono">{order.tracking_number}</span>
                    {order.tracking_url && (
                      <a
                        href={order.tracking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                )}
                {order.shipping_address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm">{order.shipping_address}</span>
                  </div>
                )}
                {!order.tracking_number && !order.shipping_address && (
                  <p className="text-muted-foreground text-sm">
                    Nenhuma informação de envio
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(order.subtotal)}
                  </span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto</span>
                    <span>
                      -{new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(order.discount_amount)}
                    </span>
                  </div>
                )}
                {order.shipping_cost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frete</span>
                    <span>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(order.shipping_cost)}
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(order.total)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Fulfillment Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fulfillment</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={order.fulfillment_status}
                  onValueChange={(value) => handleFulfillmentChange(value as FulfillmentStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Não Iniciado</SelectItem>
                    <SelectItem value="picking">Separando</SelectItem>
                    <SelectItem value="packing">Embalando</SelectItem>
                    <SelectItem value="shipped">Enviado</SelectItem>
                    <SelectItem value="delivered">Entregue</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
