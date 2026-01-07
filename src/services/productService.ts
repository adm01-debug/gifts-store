import { supabase } from '@/integrations/supabase/client';

// ============================================================
// TIPOS - Estrutura completa da tabela products (76 colunas)
// ============================================================

export interface ProductColor {
  name: string;
  hex: string;
  group?: string;
}

export interface ProductSize {
  name: string;
  stock?: number;
}

export interface ProductTag {
  publicoAlvo?: string[];
  datasComemorativas?: string[];
  endomarketing?: string[];
  ramo?: string[];
  nicho?: string[];
}

export interface PersonalizationArea {
  name: string;
  width_cm?: number;
  height_cm?: number;
  techniques?: string[];
}

export interface PersonalizationOption {
  technique_id: string;
  technique_name: string;
  base_price?: number;
  is_available: boolean;
}

export interface Product {
  // Identificação
  id: string;
  name: string;
  description?: string;
  short_description?: string;
  sku?: string;
  sku_promo?: string;
  
  // Categorização
  category_id?: string;
  main_category_id?: string;
  supplier_id?: string;
  brand?: string;
  
  // Preços
  cost_price?: number;
  sale_price?: number;
  base_price?: number;
  suggested_price?: number;
  
  // Estoque
  stock_quantity?: number;
  min_stock?: number;
  minimum_stock?: number;
  stock_unit?: string;
  min_quantity?: number;
  is_stockout?: boolean;
  
  // Mídia
  image_url?: string;
  primary_image_url?: string;
  images?: string[];
  videos?: string[];
  
  // Dimensões
  weight?: number;
  dimensions?: { length?: number; width?: number; height?: number };
  box_length_mm?: number;
  box_width_mm?: number;
  box_height_mm?: number;
  box_weight_kg?: number;
  product_weight_g?: number;
  
  // Personalização
  allows_personalization?: boolean;
  personalization_options?: PersonalizationOption[];
  personalization_areas?: PersonalizationArea[];
  
  // Variações
  colors?: ProductColor[];
  sizes?: ProductSize[];
  materials?: string[];
  has_colors?: boolean;
  has_sizes?: boolean;
  has_capacity?: boolean;
  combined_sizes?: string;
  gender?: string;
  
  // Tags e SEO
  tags?: ProductTag;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  
  // Flags
  is_featured?: boolean;
  is_new?: boolean;
  is_on_sale?: boolean;
  is_bestseller?: boolean;
  is_kit?: boolean;
  is_textil?: boolean;
  is_online_exclusive?: boolean;
  
  // Métricas
  view_count?: number;
  favorite_count?: number;
  order_count?: number;
  catalog_page?: number;
  
  // Códigos fiscais
  ean?: string;
  gtin?: string;
  ncm_code?: string;
  origin_country?: string;
  warranty_months?: number;
  manufacturer_sku?: string;
  supplier_reference?: string;
  
  // Multi-tenant
  organization_id?: string;
  product_type?: 'simple' | 'kit' | 'variation' | 'configurable';
  active?: boolean;
  is_active?: boolean;
  is_deleted?: boolean;
  deleted_at?: string;
  
  // Auditoria
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  last_cost_update_at?: string;
  last_stock_update_at?: string;
  
  // Relacionamentos (joins)
  category?: { id: string; name: string; icon?: string };
  supplier?: { id: string; name: string; logo?: string };
}

// ============================================================
// FILTROS
// ============================================================

export interface ProductFilters {
  search?: string;
  category_id?: string;
  supplier_id?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  is_kit?: boolean;
  is_featured?: boolean;
  is_new?: boolean;
  is_on_sale?: boolean;
  materials?: string[];
  colors?: string[];
  organization_id?: string;
}

export interface ProductPagination {
  page?: number;
  page_size?: number;
  order_by?: 'name' | 'sale_price' | 'created_at' | 'stock_quantity';
  order_direction?: 'asc' | 'desc';
}

export interface PaginatedProductsResponse {
  products: Product[];
  total_count: number;
  total_pages: number;
  current_page: number;
}

// ============================================================
// SERVIÇO DE PRODUTOS
// ============================================================

class ProductService {
  
  /**
   * Busca todos os produtos com filtros opcionais
   */
  async getProducts(
    filters?: ProductFilters,
    pagination?: ProductPagination
  ): Promise<PaginatedProductsResponse> {
    const page = pagination?.page || 1;
    const pageSize = pagination?.page_size || 20;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, icon),
        supplier:suppliers(id, name, logo)
      `, { count: 'exact' })
      .eq('is_active', true)
      .eq('is_deleted', false);
    
    // Aplicar filtros
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`);
    }
    
    if (filters?.category_id) {
      query = query.eq('category_id', filters.category_id);
    }
    
    if (filters?.supplier_id) {
      query = query.eq('supplier_id', filters.supplier_id);
    }
    
    if (filters?.min_price !== undefined) {
      query = query.gte('sale_price', filters.min_price);
    }
    
    if (filters?.max_price !== undefined) {
      query = query.lte('sale_price', filters.max_price);
    }
    
    if (filters?.in_stock) {
      query = query.gt('stock_quantity', 0);
    }
    
    if (filters?.is_kit) {
      query = query.eq('is_kit', true);
    }
    
    if (filters?.is_featured) {
      query = query.eq('is_featured', true);
    }
    
    if (filters?.is_new) {
      query = query.eq('is_new', true);
    }
    
    if (filters?.is_on_sale) {
      query = query.eq('is_on_sale', true);
    }
    
    if (filters?.organization_id) {
      query = query.eq('organization_id', filters.organization_id);
    }
    
    // Ordenação
    const orderBy = pagination?.order_by || 'name';
    const orderDirection = pagination?.order_direction || 'asc';
    query = query.order(orderBy, { ascending: orderDirection === 'asc' });
    
    // Paginação
    query = query.range(from, to);
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Erro ao buscar produtos:', error);
      throw new Error(`Falha ao buscar produtos: ${error.message}`);
    }
    
    return {
      products: (data || []) as Product[],
      total_count: count || 0,
      total_pages: Math.ceil((count || 0) / pageSize),
      current_page: page,
    };
  }
  
  /**
   * Busca um produto por ID
   */
  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, icon),
        supplier:suppliers(id, name, logo)
      `)
      .eq('id', id)
      .eq('is_deleted', false)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      console.error('Erro ao buscar produto:', error);
      throw new Error(`Falha ao buscar produto: ${error.message}`);
    }
    
    // Incrementar view_count
    await this.incrementViewCount(id);
    
    return data as Product;
  }
  
  /**
   * Busca produto por SKU
   */
  async getProductBySku(sku: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, icon),
        supplier:suppliers(id, name, logo)
      `)
      .eq('sku', sku)
      .eq('is_deleted', false)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Falha ao buscar produto: ${error.message}`);
    }
    
    return data as Product;
  }
  
  /**
   * Incrementa contador de visualizações
   */
  async incrementViewCount(id: string): Promise<void> {
    await supabase.rpc('increment_product_view_count', { p_product_id: id });
  }
  
  /**
   * Incrementa contador de favoritos
   */
  async incrementFavoriteCount(id: string): Promise<void> {
    await supabase.rpc('increment_product_favorite_count', { p_product_id: id });
  }
  
  /**
   * Decrementa contador de favoritos
   */
  async decrementFavoriteCount(id: string): Promise<void> {
    await supabase.rpc('decrement_product_favorite_count', { p_product_id: id });
  }
  
  /**
   * Busca produtos em destaque
   */
  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, icon),
        supplier:suppliers(id, name, logo)
      `)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .eq('is_featured', true)
      .limit(limit);
    
    if (error) {
      throw new Error(`Falha ao buscar destaques: ${error.message}`);
    }
    
    return (data || []) as Product[];
  }
  
  /**
   * Busca novidades
   */
  async getNewProducts(limit = 8): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, icon),
        supplier:suppliers(id, name, logo)
      `)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .eq('is_new', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw new Error(`Falha ao buscar novidades: ${error.message}`);
    }
    
    return (data || []) as Product[];
  }
  
  /**
   * Busca produtos relacionados (mesma categoria)
   */
  async getRelatedProducts(productId: string, limit = 4): Promise<Product[]> {
    // Primeiro busca a categoria do produto
    const product = await this.getProductById(productId);
    if (!product?.category_id) return [];
    
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, icon),
        supplier:suppliers(id, name, logo)
      `)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .eq('category_id', product.category_id)
      .neq('id', productId)
      .limit(limit);
    
    if (error) {
      throw new Error(`Falha ao buscar relacionados: ${error.message}`);
    }
    
    return (data || []) as Product[];
  }
  
  /**
   * Busca categorias únicas dos produtos
   */
  async getCategories(): Promise<{ id: string; name: string; icon?: string }[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, icon')
      .order('name');
    
    if (error) {
      throw new Error(`Falha ao buscar categorias: ${error.message}`);
    }
    
    return data || [];
  }
  
  /**
   * Busca fornecedores
   */
  async getSuppliers(): Promise<{ id: string; name: string; logo?: string }[]> {
    const { data, error } = await supabase
      .from('suppliers')
      .select('id, name, logo')
      .order('name');
    
    if (error) {
      throw new Error(`Falha ao buscar fornecedores: ${error.message}`);
    }
    
    return data || [];
  }

  /**
   * Conta produtos por status
   */
  async getProductStats(): Promise<{
    total: number;
    featured: number;
    new_arrivals: number;
    on_sale: number;
    out_of_stock: number;
  }> {
    const [total, featured, newArrivals, onSale, outOfStock] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_active', true).eq('is_deleted', false),
      supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_active', true).eq('is_featured', true),
      supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_active', true).eq('is_new', true),
      supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_active', true).eq('is_on_sale', true),
      supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_active', true).eq('is_stockout', true),
    ]);

    return {
      total: total.count || 0,
      featured: featured.count || 0,
      new_arrivals: newArrivals.count || 0,
      on_sale: onSale.count || 0,
      out_of_stock: outOfStock.count || 0,
    };
  }
}

// Exportar instância singleton
export const productService = new ProductService();

export default productService;
