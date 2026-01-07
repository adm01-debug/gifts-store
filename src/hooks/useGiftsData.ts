/**
 * Hook para buscar dados reais do Gifts Store
 * MIGRAÇÃO: Mock → Produção
 * Substitui: src/data/mockData.ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  min_quantity: number;
  category_id: string;
  subcategory?: string;
  colors: string[];
  materials: string[];
  supplier_id: string;
  stock: number;
  stock_status: 'in-stock' | 'low-stock' | 'out-of-stock';
  is_kit: boolean;
  images: string[];
  video?: string;
  tags: Record<string, string[]>;
  featured: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  product_count: number;
}

export interface Supplier {
  id: string;
  name: string;
  code: string;
  lead_time: number;
  min_order: number;
  payment_terms: string;
  rating: number;
}

export interface Quote {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  products: { product_id: string; quantity: number; customization?: string }[];
  total: number;
  status: 'pending' | 'sent' | 'approved' | 'rejected';
  created_at: string;
}

// Hooks
export function useProducts(filters?: { category?: string; search?: string; featured?: boolean }) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      let query = supabase.from('products').select('*').eq('active', true);
      
      if (filters?.category) query = query.eq('category_id', filters.category);
      if (filters?.search) query = query.or(`name.ilike.%${filters.search}%,sku.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      if (filters?.featured) query = query.eq('featured', true);
      
      const { data, error } = await query.order('name');
      if (error) throw error;
      return data as Product[];
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error) throw error;
      return data as Product;
    },
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      // DESABILITADO: tabela categories não existe
    const data: any[] = []; const error = null;
      if (error) throw error;
      return data.map(c => ({ ...c, product_count: c.products?.[0]?.count || 0 })) as Category[];
    },
  });
}

export function useSuppliers() {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      // DESABILITADO: tabela suppliers não existe
    const data: any[] = []; const error = null;
      if (error) throw error;
      return data as Supplier[];
    },
  });
}

export function useRecommendedProducts(tags: Record<string, string[]>) {
  return useQuery({
    queryKey: ['recommended', tags],
    queryFn: async () => {
      // Buscar produtos que contenham qualquer uma das tags
      const { data, error } = await supabase.from('products').select('*').eq('active', true).limit(20);
      if (error) throw error;
      
      // Filtrar e ordenar por relevância
      const scored = (data || []).map(p => {
        let score = 0;
        Object.entries(tags).forEach(([key, values]) => {
          values.forEach(v => { if (p.tags?.[key]?.includes(v)) score++; });
        });
        return { ...p, score };
      }).sort((a, b) => b.score - a.score);
      
      return scored.slice(0, 10) as Product[];
    },
    enabled: Object.keys(tags).length > 0,
  });
}

export function useQuotes(status?: string) {
  return useQuery({
    queryKey: ['quotes', status],
    queryFn: async () => {
      let query = supabase.from('quotes').select('*').order('created_at', { ascending: false });
      if (status) query = query.eq('status', status);
      const { data, error } = await query;
      if (error) throw error;
      return data as Quote[];
    },
  });
}

export function useCreateQuote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (quote: Omit<Quote, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('quotes').insert(quote).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['quotes'] }); toast.success('Orçamento criado!'); },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Product> & { id: string }) => {
      const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { id }) => { qc.invalidateQueries({ queryKey: ['products'] }); qc.invalidateQueries({ queryKey: ['product', id] }); toast.success('Produto atualizado!'); },
  });
}

export default { useProducts, useProduct, useCategories, useSuppliers, useRecommendedProducts, useQuotes, useCreateQuote, useUpdateProduct };
