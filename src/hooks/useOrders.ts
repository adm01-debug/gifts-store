import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type OrderStatus = 
  | "pending" 
  | "confirmed" 
  | "in_production" 
  | "ready_for_pickup" 
  | "shipped" 
  | "delivered" 
  | "cancelled";

export type FulfillmentStatus = 
  | "not_started" 
  | "picking" 
  | "packing" 
  | "shipped" 
  | "delivered";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_sku: string | null;
  product_name: string;
  product_image_url: string | null;
  color_name: string | null;
  color_hex: string | null;
  quantity: number;
  unit_price: number;
  subtotal: number | null;
  notes: string | null;
  personalization_details: unknown[];
  sort_order: number;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  quote_id: string | null;
  client_id: string | null;
  seller_id: string;
  status: OrderStatus;
  fulfillment_status: FulfillmentStatus;
  subtotal: number;
  discount_percent: number;
  discount_amount: number;
  shipping_cost: number;
  total: number;
  notes: string | null;
  internal_notes: string | null;
  shipping_address: string | null;
  shipping_method: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  estimated_delivery_date: string | null;
  actual_delivery_date: string | null;
  payment_status: string;
  payment_method: string | null;
  paid_amount: number;
  created_at: string;
  updated_at: string;
  confirmed_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  client?: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
  };
  items?: OrderItem[];
}

export interface OrderHistory {
  id: string;
  order_id: string;
  user_id: string;
  action: string;
  description: string;
  old_value: string | null;
  new_value: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export function useOrders() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from("orders") as any)
        .select(`
          *,
          client:bitrix_clients(id, name, email, phone)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
    enabled: !!user,
  });

  const getOrderById = async (orderId: string): Promise<Order | null> => {
    const { data, error } = await (supabase
      .from("orders") as any)
      .select(`
        *,
        client:bitrix_clients(id, name, email, phone)
      `)
      .eq("id", orderId)
      .maybeSingle();

    if (error) throw error;
    return data;
  };

  const getOrderItems = async (orderId: string): Promise<OrderItem[]> => {
    const { data, error } = await (supabase
      .from("order_items") as any)
      .select("*")
      .eq("order_id", orderId)
      .order("sort_order");

    if (error) throw error;
    return data || [];
  };

  const getOrderHistory = async (orderId: string): Promise<OrderHistory[]> => {
    const { data, error } = await (supabase
      /* DISABLED: order_history */ .from("profiles") as any)
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  };

  const createOrderFromQuote = useMutation({
    mutationFn: async (quoteId: string) => {
      // Get quote data
      const { data: quote, error: quoteError } = await supabase
        .from("quotes")
        .select("*")
        .eq("id", quoteId)
        .single();

      if (quoteError) throw quoteError;

      // Get quote items
      const { data: quoteItems, error: itemsError } = await supabase
        .from("quote_items")
        .select("*")
        .eq("quote_id", quoteId);

      if (itemsError) throw itemsError;

      // Create order
      const { data: order, error: orderError } = await (supabase
        .from("orders") as any)
        .insert({
          quote_id: quoteId,
          client_id: quote.client_id,
          seller_id: user?.id,
          subtotal: quote.subtotal,
          discount_percent: quote.discount_percent,
          discount_amount: quote.discount_amount,
          total: quote.total,
          notes: quote.notes,
          internal_notes: quote.internal_notes,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      if (quoteItems && quoteItems.length > 0) {
        const orderItems = quoteItems.map((item: any, index: number) => ({
          order_id: order.id,
          product_id: item.product_id,
          product_sku: item.product_sku,
          product_name: item.product_name,
          product_image_url: item.product_image_url,
          color_name: item.color_name,
          color_hex: item.color_hex,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.subtotal,
          notes: item.notes,
          sort_order: index,
        }));

        const { error: insertError } = await (supabase
          .from("order_items") as any)
          .insert(orderItems);

        if (insertError) throw insertError;
      }

      // Add history entry
      await (supabase/* DISABLED: order_history */ .from("profiles") as any).insert({
        order_id: order.id,
        user_id: user?.id,
        action: "created",
        description: `Pedido criado a partir do orçamento ${quote.quote_number}`,
      });

      // Update quote status
      await supabase
        .from("quotes")
        .update({ status: "approved" })
        .eq("id", quoteId);

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      toast.success("Pedido criado com sucesso!");
    },
    onError: (error) => {
      console.error("Error creating order:", error);
      toast.error("Erro ao criar pedido");
    },
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ 
      orderId, 
      status, 
      fulfillmentStatus 
    }: { 
      orderId: string; 
      status?: OrderStatus;
      fulfillmentStatus?: FulfillmentStatus;
    }) => {
      const updates: Record<string, unknown> = {};
      
      if (status) {
        updates.status = status;
        if (status === "confirmed") updates.confirmed_at = new Date().toISOString();
        if (status === "shipped") updates.shipped_at = new Date().toISOString();
        if (status === "delivered") {
          updates.delivered_at = new Date().toISOString();
          updates.actual_delivery_date = new Date().toISOString().split("T")[0];
        }
      }
      
      if (fulfillmentStatus) {
        updates.fulfillment_status = fulfillmentStatus;
      }

      const { data, error } = await (supabase
        .from("orders") as any)
        .update(updates)
        .eq("id", orderId)
        .select()
        .single();

      if (error) throw error;

      // Add history entry
      await (supabase/* DISABLED: order_history */ .from("profiles") as any).insert({
        order_id: orderId,
        user_id: user?.id,
        action: "status_changed",
        description: status 
          ? `Status alterado para ${status}` 
          : `Status de fulfillment alterado para ${fulfillmentStatus}`,
        new_value: status || fulfillmentStatus,
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Status atualizado!");
    },
    onError: (error) => {
      console.error("Error updating status:", error);
      toast.error("Erro ao atualizar status");
    },
  });

  const updateOrder = useMutation({
    mutationFn: async ({ orderId, updates }: { orderId: string; updates: Partial<Order> }) => {
      const { data, error } = await (supabase
        .from("orders") as any)
        .update(updates)
        .eq("id", orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Pedido atualizado!");
    },
    onError: (error) => {
      console.error("Error updating order:", error);
      toast.error("Erro ao atualizar pedido");
    },
  });

  const updateTracking = useMutation({
    mutationFn: async ({ 
      orderId, 
      trackingNumber, 
      trackingUrl,
      shippingMethod 
    }: { 
      orderId: string; 
      trackingNumber: string;
      trackingUrl?: string;
      shippingMethod?: string;
    }) => {
      const { data, error } = await (supabase
        .from("orders") as any)
        .update({
          tracking_number: trackingNumber,
          tracking_url: trackingUrl,
          shipping_method: shippingMethod,
          status: "shipped",
          shipped_at: new Date().toISOString(),
        })
        .eq("id", orderId)
        .select()
        .single();

      if (error) throw error;

      await (supabase/* DISABLED: order_history */ .from("profiles") as any).insert({
        order_id: orderId,
        user_id: user?.id,
        action: "tracking_added",
        description: `Código de rastreio adicionado: ${trackingNumber}`,
        new_value: trackingNumber,
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Rastreio atualizado!");
    },
    onError: (error) => {
      console.error("Error updating tracking:", error);
      toast.error("Erro ao atualizar rastreio");
    },
  });

  return {
    orders: ordersQuery.data || [],
    isLoading: ordersQuery.isLoading,
    error: ordersQuery.error,
    getOrderById,
    getOrderItems,
    getOrderHistory,
    createOrderFromQuote,
    updateOrderStatus,
    updateOrder,
    updateTracking,
    refetch: ordersQuery.refetch,
  };
}
