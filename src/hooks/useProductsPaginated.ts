import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductFilters } from './useProducts';

interface PaginatedProducts {
  products: any[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

export function useProductsPaginated(
  page = 1,
  pageSize = 20,
  filters?: ProductFilters
) {
  return useQuery<PaginatedProducts>({
    queryKey: ['products', 'paginated', page, pageSize, filters],
    queryFn: async () => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .order('name')
        .range(from, to);

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

      const { data, error, count } = await query;

      if (error) throw new Error(`Failed to fetch products: ${error.message}`);

      return {
        products: data || [],
        totalPages: Math.ceil((count || 0) / pageSize),
        currentPage: page,
        totalCount: count || 0,
      };
    },
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true, // Manter dados anteriores durante carregamento
  });
}
