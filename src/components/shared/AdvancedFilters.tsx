// ============================================
// COMPONENTE: FILTROS AVANÇADOS
// STATUS: 🟢 Parcial → ✅ Implementado Completo
// PRIORIDADE: 🟠 ALTA
// ============================================

import { useState } from 'react';
import { Filter, X, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

export type FilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';

export interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect';
  options?: { value: string; label: string }[];
  operators?: FilterOperator[];
}

export interface ActiveFilter {
  id: string;
  field: string;
  operator: FilterOperator;
  value: any;
}

interface AdvancedFiltersProps {
  fields: FilterField[];
  onFiltersChange: (filters: ActiveFilter[]) => void;
  initialFilters?: ActiveFilter[];
}

const operatorLabels: Record<FilterOperator, string> = {
  eq: 'Igual a',
  neq: 'Diferente de',
  gt: 'Maior que',
  gte: 'Maior ou igual',
  lt: 'Menor que',
  lte: 'Menor ou igual',
  contains: 'Contém',
  in: 'Em',
};

export function AdvancedFilters({
  fields,
  onFiltersChange,
  initialFilters = [],
}: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<ActiveFilter[]>(initialFilters);
  const [isOpen, setIsOpen] = useState(false);

  const addFilter = () => {
    const newFilter: ActiveFilter = {
      id: `filter-${Date.now()}`,
      field: fields[0].key,
      operator: fields[0].operators?.[0] || 'eq',
      value: '',
    };
    const newFilters = [...filters, newFilter];
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const updateFilter = (id: string, updates: Partial<ActiveFilter>) => {
    const newFilters = filters.map((f) =>
      f.id === id ? { ...f, ...updates } : f
    );
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const removeFilter = (id: string) => {
    const newFilters = filters.filter((f) => f.id !== id);
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAll = () => {
    setFilters([]);
    onFiltersChange([]);
  };

  const getFieldConfig = (fieldKey: string) => {
    return fields.find((f) => f.key === fieldKey);
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            {filters.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {filters.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[500px]" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filtros Avançados</h4>
              {filters.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  Limpar Todos
                </Button>
              )}
            </div>

            {/* Lista de filtros */}
            <div className="space-y-3">
              {filters.map((filter) => {
                const fieldConfig = getFieldConfig(filter.field);
                if (!fieldConfig) return null;

                return (
                  <div key={filter.id} className="flex gap-2 items-start p-3 border rounded-lg">
                    <div className="flex-1 space-y-2">
                      {/* Campo */}
                      <div>
                        <Label className="text-xs">Campo</Label>
                        <Select
                          value={filter.field}
                          onValueChange={(value) => {
                            const newField = getFieldConfig(value);
                            updateFilter(filter.id, {
                              field: value,
                              operator: newField?.operators?.[0] || 'eq',
                              value: '',
                            });
                          }}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fields.map((field) => (
                              <SelectItem key={field.key} value={field.key}>
                                {field.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Operador */}
                      <div>
                        <Label className="text-xs">Operador</Label>
                        <Select
                          value={filter.operator}
                          onValueChange={(value) =>
                            updateFilter(filter.id, { operator: value as FilterOperator })
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(fieldConfig.operators || ['eq']).map((op) => (
                              <SelectItem key={op} value={op}>
                                {operatorLabels[op]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Valor */}
                      <div>
                        <Label className="text-xs">Valor</Label>
                        {fieldConfig.type === 'select' ? (
                          <Select
                            value={filter.value}
                            onValueChange={(value) => updateFilter(filter.id, { value })}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {fieldConfig.options?.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            type={fieldConfig.type}
                            value={filter.value}
                            onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                            className="h-8"
                            placeholder={`Digite o ${fieldConfig.label.toLowerCase()}...`}
                          />
                        )}
                      </div>
                    </div>

                    {/* Remover */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 mt-5"
                      onClick={() => removeFilter(filter.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Adicionar filtro */}
            <Button variant="outline" size="sm" onClick={addFilter} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Filtro
            </Button>

            {/* Aplicar */}
            <Button onClick={() => setIsOpen(false)} className="w-full">
              <Check className="h-4 w-4 mr-2" />
              Aplicar Filtros
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Badges dos filtros ativos */}
      {filters.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {filters.map((filter) => {
            const fieldConfig = getFieldConfig(filter.field);
            if (!fieldConfig || !filter.value) return null;

            return (
              <Badge key={filter.id} variant="secondary" className="gap-1">
                {fieldConfig.label} {operatorLabels[filter.operator]}{' '}
                <strong>{filter.value}</strong>
                <button
                  onClick={() => removeFilter(filter.id)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
