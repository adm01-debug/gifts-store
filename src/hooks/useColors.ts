/**
 * Hook de Cores - CORRIGIDO
 * Usa tabela color_variations em vez de colors
 */
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
  hex_code?: string;
  slug?: string;
  pantone?: string;
  color_group_id?: string;
  is_active?: boolean;
  created_at?: string;
}

export function useColors() {
  return useQuery<ProductColor[]>({
    queryKey: ['colors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('color_variations')  // CORRIGIDO: era 'colors'
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.warn('Erro ao buscar cores:', error.message);
        return [];
      }
      
      // Mapear para formato esperado
      return (data || []).map(color => ({
        id: color.id,
        name: color.name,
        hex: color.hex_code || '#CCCCCC',
        hex_code: color.hex_code,
        slug: color.slug,
        color_group_id: color.color_group_id,
        is_active: color.is_active,
        created_at: color.created_at,
      }));
    },
    staleTime: 60 * 60 * 1000, // 1 hora (dados muito estáveis)
  });
}
