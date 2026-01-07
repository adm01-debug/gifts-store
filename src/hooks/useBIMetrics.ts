import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ColorInfo {
  name?: string;
  hex?: string;
  color_name?: string;
  color_hex?: string;
}

export interface ProductBIMetrics {
  totalProducts: number;
  totalActiveProducts: number;
  totalKits: number;
  averagePrice: number;
  productsByCategory: Array<{
    category: string;
    count: number;
  }>;
  productsBySubcategory: Array<{
    subcategory: string;
    count: number;
  }>;
  productsByColor: Array<{
    color: string;
    hex: string;
    count: number;
  }>;
  productsByMaterial: Array<{
    material: string;
    count: number;
  }>;
  productsBySupplier: Array<{
    supplier: string;
    count: number;
  }>;
  productsByStockStatus: Array<{
    status: string;
    count: number;
  }>;
  productsByGroup: Array<{
    groupName: string;
    count: number;
  }>;
  priceRanges: Array<{
    range: string;
    count: number;
  }>;
  recentProducts: Array<{
    id: string;
    name: string;
    sku: string;
    price: number;
    category_name: string | null;
    created_at: string;
  }>;
  featuredCount: number;
  newArrivalCount: number;
  onSaleCount: number;
}

export function useBIMetrics() {
  return useQuery({
    queryKey: ["product-bi-metrics"],
    queryFn: async (): Promise<ProductBIMetrics> => {
      // Fetch apenas products - product_groups está desabilitado
      const { data: products, error } = await supabase
        .from("products")
        .select("*");

      if (error) {
        console.warn("Erro ao buscar produtos para BI:", error.message);
      }

      const productsList = products || [];

      // Basic counts
      const totalProducts = productsList.length;
      const totalActiveProducts = productsList.filter((p) => p.is_active).length;
      const totalKits = productsList.filter((p) => p.is_kit).length;
      const featuredCount = productsList.filter((p) => p.featured || p.is_featured).length;
      const newArrivalCount = productsList.filter((p) => p.new_arrival || p.is_new).length;
      const onSaleCount = productsList.filter((p) => p.on_sale).length;

      // Average price
      const prices = productsList.map(p => p.price || p.base_price || 0).filter(p => p > 0);
      const totalPrice = prices.reduce((sum, p) => sum + p, 0);
      const averagePrice = prices.length > 0 ? totalPrice / prices.length : 0;

      // Products by category
      const categoryMap = new Map<string, number>();
      productsList.forEach((p) => {
        const category = p.category_name || "Sem categoria";
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      });
      const productsByCategory = Array.from(categoryMap.entries())
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Products by subcategory
      const subcategoryMap = new Map<string, number>();
      productsList.forEach((p) => {
        if (p.subcategory) {
          subcategoryMap.set(p.subcategory, (subcategoryMap.get(p.subcategory) || 0) + 1);
        }
      });
      const productsBySubcategory = Array.from(subcategoryMap.entries())
        .map(([subcategory, count]) => ({ subcategory, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Products by color
      const colorMap = new Map<string, { hex: string; count: number }>();
      productsList.forEach((p) => {
        if (p.colors && Array.isArray(p.colors)) {
          (p.colors as ColorInfo[]).forEach((color) => {
            const colorName = color.name || color.color_name || "Desconhecida";
            const colorHex = color.hex || color.color_hex || "#CCCCCC";
            const existing = colorMap.get(colorName) || { hex: colorHex, count: 0 };
            existing.count += 1;
            colorMap.set(colorName, existing);
          });
        }
      });
      const productsByColor = Array.from(colorMap.entries())
        .map(([color, data]) => ({ color, hex: data.hex, count: data.count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15);

      // Products by material
      const materialMap = new Map<string, number>();
      productsList.forEach((p) => {
        if (p.materials && Array.isArray(p.materials)) {
          p.materials.forEach((material: string) => {
            materialMap.set(material, (materialMap.get(material) || 0) + 1);
          });
        }
      });
      const productsByMaterial = Array.from(materialMap.entries())
        .map(([material, count]) => ({ material, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Products by supplier
      const supplierMap = new Map<string, number>();
      productsList.forEach((p) => {
        const supplier = p.supplier_name || "Sem fornecedor";
        supplierMap.set(supplier, (supplierMap.get(supplier) || 0) + 1);
      });
      const productsBySupplier = Array.from(supplierMap.entries())
        .map(([supplier, count]) => ({ supplier, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Products by stock status
      const stockStatusMap = new Map<string, number>();
      productsList.forEach((p) => {
        const status = p.stock_status || "in-stock";
        stockStatusMap.set(status, (stockStatusMap.get(status) || 0) + 1);
      });
      const productsByStockStatus = Array.from(stockStatusMap.entries())
        .map(([status, count]) => ({ status, count }))
        .sort((a, b) => b.count - a.count);

      // Products by group - DESABILITADO (tabelas não existem)
      // Retorna array vazio
      const productsByGroup: Array<{ groupName: string; count: number }> = [];

      // Price ranges
      const priceRangesConfig = [
        { label: "R$ 0-10", min: 0, max: 10 },
        { label: "R$ 10-25", min: 10, max: 25 },
        { label: "R$ 25-50", min: 25, max: 50 },
        { label: "R$ 50-100", min: 50, max: 100 },
        { label: "R$ 100-200", min: 100, max: 200 },
        { label: "R$ 200+", min: 200, max: Infinity },
      ];

      const priceRanges = priceRangesConfig.map((range) => ({
        range: range.label,
        count: productsList.filter((p) => {
          const price = p.price || p.base_price || 0;
          return price >= range.min && price < range.max;
        }).length,
      }));

      // Recent products
      const recentProducts = [...productsList]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map((p) => ({
          id: p.id,
          name: p.name,
          sku: p.sku || p.sku_promo || "",
          price: p.price || p.base_price || 0,
          category_name: p.category_name || null,
          created_at: p.created_at,
        }));

      return {
        totalProducts,
        totalActiveProducts,
        totalKits,
        averagePrice,
        productsByCategory,
        productsBySubcategory,
        productsByColor,
        productsByMaterial,
        productsBySupplier,
        productsByStockStatus,
        productsByGroup,
        priceRanges,
        recentProducts,
        featuredCount,
        newArrivalCount,
        onSaleCount,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
