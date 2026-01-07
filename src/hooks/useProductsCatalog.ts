import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService, ProductFilters, ProductPagination, Product } from '@/services/productService';

// ============================================================
// HOOKS PARA CATÁLOGO DE PRODUTOS
// ============================================================

/**
 * Hook para buscar lista de produtos com filtros e paginação
 */
export function useProductsCatalog(
  filters?: ProductFilters,
  pagination?: ProductPagination
) {
  return useQuery({
    queryKey: ['products', 'catalog', filters, pagination],
    queryFn: () => productService.getProducts(filters, pagination),
    staleTime: 5 * 60 * 1000, // 5 minutos
    keepPreviousData: true,
  });
}

/**
 * Hook para buscar um produto específico
 */
export function useProductDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['products', 'detail', id],
    queryFn: () => productService.getProductById(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

/**
 * Hook para buscar produto por SKU
 */
export function useProductBySku(sku: string | undefined) {
  return useQuery({
    queryKey: ['products', 'sku', sku],
    queryFn: () => productService.getProductBySku(sku!),
    enabled: !!sku,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar produtos em destaque
 */
export function useFeaturedProducts(limit = 8) {
  return useQuery({
    queryKey: ['products', 'featured', limit],
    queryFn: () => productService.getFeaturedProducts(limit),
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar novidades
 */
export function useNewProducts(limit = 8) {
  return useQuery({
    queryKey: ['products', 'new', limit],
    queryFn: () => productService.getNewProducts(limit),
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar produtos relacionados
 */
export function useRelatedProducts(productId: string | undefined, limit = 4) {
  return useQuery({
    queryKey: ['products', 'related', productId, limit],
    queryFn: () => productService.getRelatedProducts(productId!, limit),
    enabled: !!productId,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar categorias
 */
export function useProductCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutos - categorias mudam pouco
  });
}

/**
 * Hook para buscar fornecedores
 */
export function useProductSuppliers() {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: () => productService.getSuppliers(),
    staleTime: 30 * 60 * 1000,
  });
}

/**
 * Hook para buscar estatísticas dos produtos
 */
export function useProductStats() {
  return useQuery({
    queryKey: ['products', 'stats'],
    queryFn: () => productService.getProductStats(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para favoritar/desfavoritar produto
 */
export function useToggleFavoriteCount() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, isFavorited }: { productId: string; isFavorited: boolean }) => {
      if (isFavorited) {
        await productService.decrementFavoriteCount(productId);
      } else {
        await productService.incrementFavoriteCount(productId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// ============================================================
// TIPOS EXPORTADOS
// ============================================================

export type { Product, ProductFilters, ProductPagination } from '@/services/productService';
