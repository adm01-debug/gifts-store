import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
  pantone?: string;
  created_at?: string;
}

export function useColors() {
  return useQuery<ProductColor[]>({
    queryKey: ['colors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('colors')
        .select('*')
        .order('name');

      if (error) throw new Error(`Failed to fetch colors: ${error.message}`);
      return data || [];
    },
    staleTime: 60 * 60 * 1000, // 1 hora (dados muito estáveis)
  });
}
