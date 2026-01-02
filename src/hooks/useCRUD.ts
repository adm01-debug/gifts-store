import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BaseEntity {
  id: string;
  created_at?: string;
  updated_at?: string;
}

interface CRUDConfig<T extends BaseEntity, TInput> {
  tableName: string;
  queryKey: string[];
  entityName: string;
  validate?: (input: TInput) => void | Promise<void>;
  successMessages?: {
    create?: string;
    update?: string;
    delete?: string;
  };
}

export function useCRUD<T extends BaseEntity, TInput>(config: CRUDConfig<T, TInput>) {
  const queryClient = useQueryClient();
  const { 
    tableName, 
    queryKey, 
    entityName,
    validate,
    successMessages = {}
  } = config;

  const defaultMessages = {
    create: `${entityName} criado com sucesso!`,
    update: `${entityName} atualizado!`,
    delete: `${entityName} deletado!`,
  };

  const messages = { ...defaultMessages, ...successMessages };

  const create = useMutation({
    mutationFn: async (input: TInput) => {
      if (validate) await validate(input);

      const { data, error } = await supabase
        .from(tableName)
        .insert(input as any)
        .select()
        .single();

      if (error) throw new Error(`Erro ao criar ${entityName.toLowerCase()}: ${error.message}`);
      return data as T;
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<T[]>(queryKey);

      if (previous) {
        const optimistic: T = {
          id: `temp-${Date.now()}`,
          ...input,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as T;
        
        queryClient.setQueryData<T[]>(queryKey, [...previous, optimistic]);
      }

      return { previous };
    },
    onError: (error: Error, _, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
      toast.error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success(messages.create);
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<TInput> }) => {
      const { data, error } = await supabase
        .from(tableName)
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(`Erro ao atualizar ${entityName.toLowerCase()}: ${error.message}`);
      return data as T;
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({ queryKey: [...queryKey, id] });

      const previous = queryClient.getQueryData<T[]>(queryKey);
      const previousSingle = queryClient.getQueryData<T>([...queryKey, id]);

      if (previous) {
        queryClient.setQueryData<T[]>(
          queryKey,
          previous.map((item) =>
            item.id === id 
              ? { ...item, ...updates, updated_at: new Date().toISOString() } 
              : item
          )
        );
      }

      if (previousSingle) {
        queryClient.setQueryData<T>(
          [...queryKey, id],
          { ...previousSingle, ...updates, updated_at: new Date().toISOString() }
        );
      }

      return { previous, previousSingle };
    },
    onError: (error: Error, { id }, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
      if (context?.previousSingle) queryClient.setQueryData([...queryKey, id], context.previousSingle);
      toast.error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success(messages.update);
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw new Error(`Erro ao deletar ${entityName.toLowerCase()}: ${error.message}`);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<T[]>(queryKey);

      if (previous) {
        queryClient.setQueryData<T[]>(queryKey, previous.filter((item) => item.id !== id));
      }

      return { previous };
    },
    onError: (error: Error, _, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
      toast.error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success(messages.delete);
    },
  });

  return { create, update, remove };
}
