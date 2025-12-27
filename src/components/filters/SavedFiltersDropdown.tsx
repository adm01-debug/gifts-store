import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Bookmark, Trash2 } from 'lucide-react';

interface SavedFiltersDropdownProps {
  context: string;
  currentFilters: any;
  onApplyFilters: (filters: any) => void;
}

export function SavedFiltersDropdown({ 
  context, 
  currentFilters, 
  onApplyFilters 
}: SavedFiltersDropdownProps) {
  const [newPresetName, setNewPresetName] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    }
  });

  const { data: presets } = useQuery({
    queryKey: ['filter-presets', context, user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_filter_presets')
        .select('*')
        .eq('user_id', user.id)
        .eq('context', context)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const savePreset = useMutation({
    mutationFn: async (name: string) => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('user_filter_presets')
        .insert({
          user_id: user.id,
          name,
          context,
          filters: currentFilters
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filter-presets', context] });
      setNewPresetName('');
      toast({
        title: 'Filtro salvo!',
        description: 'Você pode reutilizar este filtro a qualquer momento'
      });
    }
  });

  const deletePreset = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_filter_presets')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filter-presets', context] });
      toast({
        title: 'Filtro removido',
        description: 'O filtro foi excluído com sucesso'
      });
    }
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Bookmark className="w-4 h-4 mr-2" />
          Filtros Salvos
          {presets && presets.length > 0 && (
            <span className="ml-2 text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
              {presets.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        {presets && presets.length > 0 ? (
          <>
            {presets.map((preset) => (
              <DropdownMenuItem
                key={preset.id}
                className="flex items-center justify-between cursor-pointer"
              >
                <span 
                  onClick={() => onApplyFilters(preset.filters)}
                  className="flex-1"
                >
                  {preset.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePreset.mutate(preset.id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </>
        ) : (
          <div className="px-2 py-4 text-sm text-muted-foreground text-center">
            Nenhum filtro salvo ainda
          </div>
        )}

        <div className="p-2 space-y-2">
          <Input
            placeholder="Nome do filtro..."
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newPresetName.trim()) {
                savePreset.mutate(newPresetName);
              }
            }}
          />
          <Button
            className="w-full"
            size="sm"
            onClick={() => savePreset.mutate(newPresetName)}
            disabled={!newPresetName.trim() || savePreset.isPending}
          >
            {savePreset.isPending ? 'Salvando...' : 'Salvar Filtro Atual'}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
