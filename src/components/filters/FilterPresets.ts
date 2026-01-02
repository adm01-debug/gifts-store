import { FilterState } from "./FilterPanel";

export interface FilterPreset {
  id: string;
  name: string;
  description?: string;
  filters: FilterState;
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean;
  icon?: string;
  color?: string;
}

// Presets padrão do sistema
export const DEFAULT_PRESETS: FilterPreset[] = [
  {
    id: 'preset-natal',
    name: 'Natal',
    description: 'Produtos ideais para campanhas de Natal',
    icon: '🎄',
    color: '#22C55E',
    isDefault: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    filters: {
      colors: ['Vermelho', 'Verde', 'Branco', 'Dourado'],
      categories: [],
      suppliers: [],
      publicoAlvo: [],
      datasComemorativas: ['NATAL'],
      endomarketing: ['FIM DE ANO | CONFRATERNIZAÇÃO'],
      nichos: [],
      materiais: [],
      priceRange: [0, 500],
      inStock: true,
      isKit: false,
      featured: false,
    },
  },
  {
    id: 'preset-onboarding',
    name: 'Kit Onboarding',
    description: 'Produtos para kits de boas-vindas',
    icon: '👋',
    color: '#3B82F6',
    isDefault: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    filters: {
      colors: [],
      categories: [],
      suppliers: [],
      publicoAlvo: [],
      datasComemorativas: [],
      endomarketing: ['ONBOARDING | KIT BOAS-VINDAS'],
      nichos: [],
      materiais: [],
      priceRange: [0, 200],
      inStock: true,
      isKit: false,
      featured: false,
    },
  },
  {
    id: 'preset-executivo',
    name: 'Linha Executiva',
    description: 'Produtos premium para executivos',
    icon: '💼',
    color: '#1F2937',
    isDefault: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    filters: {
      colors: ['Preto', 'Prata', 'Cinza'],
      categories: [],
      suppliers: [],
      publicoAlvo: ['EXECUTIVO'],
      datasComemorativas: [],
      endomarketing: ['PREMIAÇÃO | INCENTIVO', 'RECONHECIMENTO'],
      nichos: [],
      materiais: ['COURO', 'METAL', 'AÇO INOX'],
      priceRange: [50, 500],
      inStock: true,
      isKit: false,
      featured: false,
    },
  },
  {
    id: 'preset-eco',
    name: 'Linha Ecológica',
    description: 'Produtos sustentáveis e ecológicos',
    icon: '🌿',
    color: '#22C55E',
    isDefault: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    filters: {
      colors: ['Verde', 'Marrom'],
      categories: [196], // ECOLOGIA
      suppliers: [],
      publicoAlvo: [],
      datasComemorativas: [],
      endomarketing: [],
      nichos: [],
      materiais: ['BAMBU', 'MADEIRA', 'PAPEL', 'CORTIÇA', 'ALGODÃO'],
      priceRange: [0, 500],
      inStock: true,
      isKit: false,
      featured: false,
    },
  },
  {
    id: 'preset-tecnologia',
    name: 'Tecnologia',
    description: 'Eletrônicos e gadgets',
    icon: '📱',
    color: '#8B5CF6',
    isDefault: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    filters: {
      colors: [],
      categories: [224], // TECNOLOGIA
      suppliers: [],
      publicoAlvo: [],
      datasComemorativas: [],
      endomarketing: [],
      nichos: ['TI'],
      materiais: [],
      priceRange: [0, 500],
      inStock: true,
      isKit: false,
      featured: false,
    },
  },
  {
    id: 'preset-agro',
    name: 'Agronegócio',
    description: 'Produtos para o setor agropecuário',
    icon: '🌾',
    color: '#D4AF37',
    isDefault: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    filters: {
      colors: ['Verde', 'Amarelo', 'Marrom'],
      categories: [192], // AGRO
      suppliers: [],
      publicoAlvo: ['PRODUTOR RURAL', 'VETERINÁRIO'],
      datasComemorativas: [],
      endomarketing: [],
      nichos: ['Agro'],
      materiais: [],
      priceRange: [0, 500],
      inStock: true,
      isKit: false,
      featured: false,
    },
  },
];

// Hook para gerenciar presets (usando localStorage)
export function useFilterPresets() {
  const STORAGE_KEY = 'filter-presets';

  const getStoredPresets = (): FilterPreset[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading presets from localStorage:', e);
    }
    return [];
  };

  const getAllPresets = (): FilterPreset[] => {
    const customPresets = getStoredPresets();
    return [...DEFAULT_PRESETS, ...customPresets];
  };

  const savePreset = (preset: Omit<FilterPreset, 'id' | 'createdAt' | 'updatedAt'>): FilterPreset => {
    const newPreset: FilterPreset = {
      ...preset,
      id: `preset-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDefault: false,
    };

    const customPresets = getStoredPresets();
    customPresets.push(newPreset);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customPresets));

    return newPreset;
  };

  const updatePreset = (id: string, updates: Partial<FilterPreset>): FilterPreset | null => {
    const customPresets = getStoredPresets();
    const index = customPresets.findIndex((p) => p.id === id);

    if (index === -1) return null;

    const existingPreset = customPresets[index];
    if (!existingPreset) return null;

    const updatedPreset: FilterPreset = {
      ...existingPreset,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    customPresets[index] = updatedPreset;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(customPresets));
    return updatedPreset;
  };

  const deletePreset = (id: string): boolean => {
    const customPresets = getStoredPresets();
    const filtered = customPresets.filter((p) => p.id !== id);

    if (filtered.length === customPresets.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  };

  return {
    getAllPresets,
    getStoredPresets,
    savePreset,
    updatePreset,
    deletePreset,
  };
}