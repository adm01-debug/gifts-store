import { useState, useMemo } from "react";
import { Search, Sparkles, Calendar, Gift, Building2, Target, TrendingUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PRODUCTS, DATAS_COMEMORATIVAS, NICHOS } from "@/data/mockData";

interface QuickFilter {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  filter: {
    datasComemorativas?: string[];
    nichos?: string[];
    publicoAlvo?: string[];
    priceRange?: [number, number];
    featured?: boolean;
    isKit?: boolean;
  };
}

const quickFilters: QuickFilter[] = [
  {
    id: "fim-de-ano",
    label: "Fim de Ano",
    icon: <Gift className="h-4 w-4" />,
    description: "Natal, Ano Novo e confraternizações",
    filter: { datasComemorativas: ["Natal", "Ano Novo", "Confraternização"] }
  },
  {
    id: "dia-das-maes",
    label: "Dia das Mães",
    icon: <Calendar className="h-4 w-4" />,
    description: "Produtos ideais para homenagear mães",
    filter: { datasComemorativas: ["Dia das Mães"], publicoAlvo: ["Mulheres"] }
  },
  {
    id: "eventos-corporativos",
    label: "Eventos Corporativos",
    icon: <Building2 className="h-4 w-4" />,
    description: "Feiras, congressos e convenções",
    filter: { nichos: ["Eventos", "Corporativo"], publicoAlvo: ["Executivos"] }
  },
  {
    id: "onboarding",
    label: "Onboarding/Welcome Kit",
    icon: <Sparkles className="h-4 w-4" />,
    description: "Kit de boas-vindas para novos colaboradores",
    filter: { isKit: true, nichos: ["RH", "Onboarding"] }
  },
  {
    id: "destaques",
    label: "Mais Vendidos",
    icon: <TrendingUp className="h-4 w-4" />,
    description: "Produtos em destaque e mais procurados",
    filter: { featured: true }
  },
  {
    id: "ate-50",
    label: "Até R$ 50",
    icon: <Target className="h-4 w-4" />,
    description: "Opções econômicas com qualidade",
    filter: { priceRange: [0, 50] }
  },
];

interface QuickFiltersBarProps {
  onApplyFilter: (filter: QuickFilter["filter"]) => void;
  activeFilterId?: string;
  onClearFilter: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function QuickFiltersBar({
  onApplyFilter,
  activeFilterId,
  onClearFilter,
  searchQuery,
  onSearchChange,
}: QuickFiltersBarProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  interface SuggestionsResult {
    products: typeof PRODUCTS;
    dates: string[];
    nichos: string[];
  }

  // Search suggestions based on products
  const suggestions = useMemo((): SuggestionsResult | null => {
    if (!searchQuery || searchQuery.length < 2) return null;
    
    const query = searchQuery.toLowerCase();
    const productMatches = PRODUCTS
      .filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.category.name.toLowerCase().includes(query) ||
        p.materials.some(m => m.toLowerCase().includes(query))
      )
      .slice(0, 5);

    const dateMatches = DATAS_COMEMORATIVAS
      .filter(d => d.toLowerCase().includes(query))
      .slice(0, 3);

    const nichoMatches = NICHOS
      .filter(n => n.toLowerCase().includes(query))
      .slice(0, 3);

    return {
      products: productMatches,
      dates: dateMatches,
      nichos: nichoMatches,
    };
  }, [searchQuery]);

  const hasSuggestions = suggestions && (suggestions.products.length > 0 || suggestions.dates.length > 0 || suggestions.nichos.length > 0);

  return (
    <div className="space-y-4">
      {/* Search with suggestions */}
      <div className="relative">
        <div className="search-bar">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <Input
            type="text"
            placeholder="Buscar produtos, categorias, datas comemorativas..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={() => onSearchChange("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && hasSuggestions && suggestions && (
          <div className="absolute top-full left-0 right-0 mt-2 p-3 rounded-xl bg-card border border-border shadow-lg z-50 animate-scale-in">
            {suggestions.products.length > 0 && (
              <div className="mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Produtos
                </span>
                <div className="mt-2 space-y-1">
                  {suggestions.products.map((product) => (
                    <button
                      key={product.id}
                      className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-secondary transition-colors text-left"
                      onClick={() => onSearchChange(product.name)}
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.category.icon} {product.category.name}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {suggestions.dates.length > 0 && (
              <div className="mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Datas Comemorativas
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {suggestions.dates.map((date) => (
                    <Badge
                      key={date}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => onSearchChange(date)}
                    >
                      📅 {date}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {suggestions.nichos.length > 0 && (
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Segmentos
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {suggestions.nichos.map((nicho) => (
                    <Badge
                      key={nicho}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => onSearchChange(nicho)}
                    >
                      🎯 {nicho}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Filters */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Filtros Rápidos</span>
          {activeFilterId && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={onClearFilter}
            >
              Limpar filtro rápido
            </Button>
          )}
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {quickFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onApplyFilter(filter.filter)}
              className={cn(
                "quick-filter-chip group",
                activeFilterId === filter.id && "active"
              )}
              title={filter.description}
            >
              <span className={cn(
                "shrink-0 transition-colors",
                activeFilterId === filter.id ? "text-primary-foreground" : "text-primary"
              )}>
                {filter.icon}
              </span>
              <span className="whitespace-nowrap">{filter.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export { quickFilters };
export type { QuickFilter };
