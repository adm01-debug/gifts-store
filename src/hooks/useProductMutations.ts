import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Product } from './useProducts';

export interface ProductInput {
  name: string;
  description?: string;
  category_id: string;
  price: number;
  image_url?: string;
  stock?: number;
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProduct: ProductInput) => {
      // Validações
      if (!newProduct.name || newProduct.name.trim().length < 3) {
        throw new Error('Nome do produto deve ter no mínimo 3 caracteres');
      }

      if (!newProduct.price || newProduct.price <= 0) {
        throw new Error('Preço deve ser maior que zero');
      }

      if (!newProduct.category_id) {
        throw new Error('Categoria é obrigatória');
      }

      const { data, error } = await supabase
        .from('products')
        .insert(newProduct)
        .select()
        .single();

      if (error) throw new Error(`Erro ao criar produto: ${error.message}`);
      return data;
    },
    onMutate: async (newProduct) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: ['products'] });

      // Snapshot previous value
      const previousProducts = queryClient.getQueryData<Product[]>(['products']);

      // Optimistically update
      if (previousProducts) {
        const optimisticProduct: Product = {
          id: `temp-${Date.now()}`,
          ...newProduct,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        queryClient.setQueryData<Product[]>(
          ['products'],
          [...previousProducts, optimisticProduct]
        );
      }

      return { previousProducts };
    },
    onError: (error: Error, _, context) => {
      // Rollback on error
      if (context?.previousProducts) {
        queryClient.setQueryData(['products'], context.previousProducts);
      }
      toast.error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produto criado com sucesso!');
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ProductInput> }) => {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(`Erro ao atualizar produto: ${error.message}`);
      return data;
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      await queryClient.cancelQueries({ queryKey: ['products', id] });

      const previousProducts = queryClient.getQueryData<Product[]>(['products']);
      const previousProduct = queryClient.getQueryData<Product>(['products', id]);

      // Optimistic update for list
      if (previousProducts) {
        queryClient.setQueryData<Product[]>(
          ['products'],
          previousProducts.map((p) =>
            p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
          )
        );
      }

      // Optimistic update for single
      if (previousProduct) {
        queryClient.setQueryData<Product>(
          ['products', id],
          { ...previousProduct, ...updates, updated_at: new Date().toISOString() }
        );
      }

      return { previousProducts, previousProduct };
    },
    onError: (error: Error, { id }, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(['products'], context.previousProducts);
      }
      if (context?.previousProduct) {
        queryClient.setQueryData(['products', id], context.previousProduct);
      }
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', data.id] });
      toast.success('Produto atualizado!');
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw new Error(`Erro ao deletar produto: ${error.message}`);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });

      const previousProducts = queryClient.getQueryData<Product[]>(['products']);

      // Optimistic removal
      if (previousProducts) {
        queryClient.setQueryData<Product[]>(
          ['products'],
          previousProducts.filter((p) => p.id !== id)
        );
      }

      return { previousProducts };
    },
    onError: (error: Error, _, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(['products'], context.previousProducts);
      }
      toast.error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produto deletado!');
    },
  });
}
