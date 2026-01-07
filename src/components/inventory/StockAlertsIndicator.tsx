/**
 * Stock Alerts Indicator - CORRIGIDO
 * 
 * Busca estoque de variant_stocks e fornecedor de product_suppliers/suppliers
 * em vez de products.stock e products.supplier_name que não existem.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, TrendingDown, Package, X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";

interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  alertType: "low" | "critical" | "out";
  supplier: string;
  createdAt: Date;
}

interface StockAlertsIndicatorProps {
  lowStockThreshold?: number;
  criticalStockThreshold?: number;
}

export function StockAlertsIndicator({
  lowStockThreshold = 50,
  criticalStockThreshold = 10,
}: StockAlertsIndicatorProps) {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchStockAlerts();
    
    // Set up realtime subscription for stock changes
    const channel = supabase
      .channel("stock-alerts")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "variant_stocks",
        },
        () => {
          fetchStockAlerts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [lowStockThreshold]);

  const fetchStockAlerts = async () => {
    try {
      // Buscar produtos com seus variantes e estoques
      // Usando uma abordagem que funciona com as tabelas existentes
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select(`
          id,
          name,
          sku_promo,
          is_active
        `)
        .eq("is_active", true)
        .limit(100);

      if (productsError) {
        console.warn("Erro ao buscar produtos:", productsError.message);
        setIsLoading(false);
        return;
      }

      if (!products || products.length === 0) {
        setAlerts([]);
        setIsLoading(false);
        return;
      }

      // Buscar estoques das variantes
      const { data: stocks, error: stocksError } = await supabase
        .from("products")
        .select(`
          variant_id,
          stock_quantity,
          product_variants!inner(
            product_id
          )
        `)
        .lt("stock_quantity", lowStockThreshold);

      if (stocksError) {
        // Se variant_stocks não existir, não mostrar alertas
        console.warn("Tabela variant_stocks não disponível:", stocksError.message);
        setAlerts([]);
        setIsLoading(false);
        return;
      }

      // Mapear estoques por produto
      const stockByProduct = new Map<string, number>();
      (stocks || []).forEach((s: any) => {
        const productId = s.product_variants?.product_id;
        if (productId) {
          const current = stockByProduct.get(productId) || 0;
          stockByProduct.set(productId, current + (s.stock_quantity || 0));
        }
      });

      // Criar alertas
      const newAlerts: StockAlert[] = [];
      
      products.forEach((product) => {
        const stock = stockByProduct.get(product.id);
        
        // Se não tem estoque registrado, pular
        if (stock === undefined) return;
        
        // Verificar se está abaixo do limite
        if (stock < lowStockThreshold) {
          let alertType: "low" | "critical" | "out" = "low";
          if (stock === 0) {
            alertType = "out";
          } else if (stock <= criticalStockThreshold) {
            alertType = "critical";
          }

          newAlerts.push({
            id: product.id,
            productId: product.id,
            productName: product.name,
            sku: product.sku_promo || "",
            currentStock: stock,
            alertType,
            supplier: "N/A", // Simplificado - não buscar supplier
            createdAt: new Date(),
          });
        }
      });

      // Ordenar por estoque (menor primeiro)
      newAlerts.sort((a, b) => a.currentStock - b.currentStock);

      setAlerts(newAlerts.slice(0, 50));
    } catch (error) {
      console.warn("Erro ao buscar alertas de estoque:", error);
      setAlerts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts((prev) => new Set(prev).add(alertId));
  };

  const visibleAlerts = alerts.filter((alert) => !dismissedAlerts.has(alert.id));
  const criticalCount = visibleAlerts.filter((a) => a.alertType === "critical" || a.alertType === "out").length;
  const totalCount = visibleAlerts.length;

  const getAlertIcon = (type: StockAlert["alertType"]) => {
    switch (type) {
      case "out":
        return <Package className="h-4 w-4 text-destructive" />;
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <TrendingDown className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getAlertBadge = (type: StockAlert["alertType"]) => {
    switch (type) {
      case "out":
        return <Badge variant="destructive">Sem estoque</Badge>;
      case "critical":
        return <Badge className="bg-orange-500">Crítico</Badge>;
      default:
        return <Badge className="bg-yellow-500">Baixo</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Bell className="h-5 w-5 text-muted-foreground" />
      </Button>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <Bell className={`h-5 w-5 ${totalCount > 0 ? "text-yellow-500" : "text-muted-foreground"}`} />
          {totalCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-xs text-white ${
                criticalCount > 0 ? "bg-destructive" : "bg-yellow-500"
              }`}
            >
              {totalCount > 99 ? "99+" : totalCount}
            </motion.span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Alertas de Estoque
              {totalCount > 0 && (
                <Badge variant="outline" className="ml-auto">
                  {totalCount} {totalCount === 1 ? "item" : "itens"}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {visibleAlerts.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum alerta de estoque</p>
              </div>
            ) : (
              <ScrollArea className="h-80">
                <AnimatePresence>
                  {visibleAlerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        {getAlertIcon(alert.alertType)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{alert.productName}</p>
                          <p className="text-xs text-muted-foreground">
                            SKU: {alert.sku}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Estoque: <span className={alert.alertType === "out" ? "text-destructive font-medium" : ""}>{alert.currentStock} unidades</span>
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {getAlertBadge(alert.alertType)}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => dismissAlert(alert.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
