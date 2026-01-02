import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  description?: string;
  category_id: string;
  price: number;
  image_url?: string;
  stock?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export function useProducts(
  filters?: ProductFilters,
  options?: Omit<UseQueryOptions<Product[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Product[]>({
    queryKey: ['products', filters],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .order('name');

      // Aplicar filtros
      if (filters?.category) {
        query = query.eq('category_id', filters.category);
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters?.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters?.inStock) {
        query = query.gt('stock', 0);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch products: ${error.message}`);
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
}

export function useProduct(id: string) {
  return useQuery<Product | null>({
    queryKey: ['products', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw new Error(`Failed to fetch product: ${error.message}`);
      }

      return data;
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!id,
  });
}
