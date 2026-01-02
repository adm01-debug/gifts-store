import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  created_at?: string;
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw new Error(`Failed to fetch categories: ${error.message}`);
      return data || [];
    },
    staleTime: 30 * 60 * 1000, // 30 min (dados estáveis)
  });
}
