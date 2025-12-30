import { useState } from 'react';
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

interface FilterPreset {
  id: string;
  name: string;
  filters: any;
}

interface SavedFiltersDropdownProps {
  context: string;
  currentFilters: any;
  onApplyFilters: (filters: any) => void;
}

// Armazenamento local de filtros (sem dependência de tabela no banco)
const STORAGE_KEY = 'saved_filter_presets';

function getStoredPresets(context: string): FilterPreset[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const all = JSON.parse(stored);
    return all.filter((p: any) => p.context === context);
  } catch {
    return [];
  }
}

function saveToStorage(context: string, preset: FilterPreset) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const all = stored ? JSON.parse(stored) : [];
    all.push({ ...preset, context });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.error('Error saving preset:', e);
  }
}

function removeFromStorage(id: string) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    const all = JSON.parse(stored);
    const filtered = all.filter((p: any) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Error removing preset:', e);
  }
}

export function SavedFiltersDropdown({ 
  context, 
  currentFilters, 
  onApplyFilters 
}: SavedFiltersDropdownProps) {
  const [newPresetName, setNewPresetName] = useState('');
  const [presets, setPresets] = useState<FilterPreset[]>(() => getStoredPresets(context));
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSavePreset = () => {
    if (!newPresetName.trim()) return;
    
    setIsSaving(true);
    
    const newPreset: FilterPreset = {
      id: crypto.randomUUID(),
      name: newPresetName.trim(),
      filters: currentFilters
    };
    
    saveToStorage(context, newPreset);
    setPresets(prev => [...prev, newPreset]);
    setNewPresetName('');
    setIsSaving(false);
    
    toast({
      title: 'Filtro salvo!',
      description: 'Você pode reutilizar este filtro a qualquer momento'
    });
  };

  const handleDeletePreset = (id: string) => {
    removeFromStorage(id);
    setPresets(prev => prev.filter(p => p.id !== id));
    
    toast({
      title: 'Filtro removido',
      description: 'O filtro foi excluído com sucesso'
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Bookmark className="w-4 h-4 mr-2" />
          Filtros Salvos
          {presets.length > 0 && (
            <span className="ml-2 text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
              {presets.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        {presets.length > 0 ? (
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
                    handleDeletePreset(preset.id);
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
                handleSavePreset();
              }
            }}
          />
          <Button
            className="w-full"
            size="sm"
            onClick={handleSavePreset}
            disabled={!newPresetName.trim() || isSaving}
          >
            {isSaving ? 'Salvando...' : 'Salvar Filtro Atual'}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
