import { useState, useMemo } from "react";
import { Package, TrendingUp, Users, Layers, Filter, ArrowUpDown, LayoutGrid, List } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProductGrid } from "@/components/products/ProductGrid";
import { FilterPanel, FilterState, defaultFilters } from "@/components/filters/FilterPanel";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PRODUCTS, CATEGORIES, SUPPLIERS, type Product } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'price-asc' | 'price-desc' | 'stock' | 'newest';

export default function Index() {
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  // Calcular contagem de filtros ativos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.colors.length) count += filters.colors.length;
    if (filters.categories.length) count += filters.categories.length;
    if (filters.suppliers.length) count += filters.suppliers.length;
    if (filters.publicoAlvo.length) count += filters.publicoAlvo.length;
    if (filters.datasComemorativas.length) count += filters.datasComemorativas.length;
    if (filters.endomarketing.length) count += filters.endomarketing.length;
    if (filters.nichos.length) count += filters.nichos.length;
    if (filters.materiais.length) count += filters.materiais.length;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) count += 1;
    if (filters.inStock) count += 1;
    if (filters.isKit) count += 1;
    if (filters.featured) count += 1;
    return count;
  }, [filters]);

  // Filtrar e ordenar produtos
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Aplicar filtros
    if (filters.colors.length) {
      result = result.filter((p) =>
        p.colors.some((c) => filters.colors.includes(c.name))
      );
    }

    if (filters.categories.length) {
      result = result.filter((p) =>
        filters.categories.includes(p.category.id)
      );
    }

    if (filters.suppliers.length) {
      result = result.filter((p) =>
        filters.suppliers.includes(p.supplier.id)
      );
    }

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) {
      result = result.filter(
        (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
      );
    }

    if (filters.inStock) {
      result = result.filter((p) => p.stockStatus !== 'out-of-stock');
    }

    if (filters.isKit) {
      result = result.filter((p) => p.isKit);
    }

    if (filters.featured) {
      result = result.filter((p) => p.featured);
    }

    if (filters.materiais.length) {
      result = result.filter((p) =>
        p.materials.some((m) => filters.materiais.includes(m))
      );
    }

    // Ordenar
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'stock':
        result.sort((a, b) => b.stock - a.stock);
        break;
      case 'newest':
        result.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
        break;
    }

    return result;
  }, [filters, sortBy]);

  const handleViewProduct = (product: Product) => {
    toast({
      title: "Visualizar Produto",
      description: `Abrindo detalhes de ${product.name}`,
    });
  };

  const handleShareProduct = (product: Product) => {
    toast({
      title: "Compartilhar",
      description: `Preparando ${product.name} para envio via A-Ticket`,
    });
  };

  const handleFavoriteProduct = (product: Product) => {
    toast({
      title: "Favoritos",
      description: `${product.name} adicionado aos favoritos`,
    });
  };

  const handleQuickAction = (actionId: string) => {
    toast({
      title: "Ação Rápida",
      description: `Executando: ${actionId}`,
    });
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Stats
  const stats = {
    totalProducts: PRODUCTS.length,
    inStock: PRODUCTS.filter((p) => p.stockStatus === 'in-stock').length,
    categories: CATEGORIES.length,
    suppliers: SUPPLIERS.length,
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
              Vitrine de Produtos
            </h1>
            <p className="text-muted-foreground mt-1">
              Encontre o brinde ideal para seu cliente
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {filteredProducts.length} produtos
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total de Produtos"
            value={stats.totalProducts.toLocaleString('pt-BR')}
            description="No catálogo"
            icon={Package}
            variant="primary"
          />
          <StatsCard
            title="Em Estoque"
            value={stats.inStock.toLocaleString('pt-BR')}
            description="Disponíveis"
            icon={TrendingUp}
            trend={{ value: 12, isPositive: true }}
            variant="success"
          />
          <StatsCard
            title="Categorias"
            value={stats.categories}
            description="Organizadas"
            icon={Layers}
          />
          <StatsCard
            title="Fornecedores"
            value={stats.suppliers}
            description="Parceiros"
            icon={Users}
          />
        </div>

        {/* Quick Actions */}
        <QuickActions onActionClick={handleQuickAction} />

        {/* Main content */}
        <div className="flex gap-6">
          {/* Sidebar filters (desktop) */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 card-base p-4 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin">
              <FilterPanel
                filters={filters}
                onFilterChange={setFilters}
                onReset={resetFilters}
                activeFiltersCount={activeFiltersCount}
              />
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1 space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                {/* Mobile filter button */}
                <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtros
                      {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto">
                    <FilterPanel
                      filters={filters}
                      onFilterChange={setFilters}
                      onReset={resetFilters}
                      activeFiltersCount={activeFiltersCount}
                    />
                  </SheetContent>
                </Sheet>

                {/* Sort */}
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-44">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nome A-Z</SelectItem>
                    <SelectItem value="price-asc">Menor Preço</SelectItem>
                    <SelectItem value="price-desc">Maior Preço</SelectItem>
                    <SelectItem value="stock">Maior Estoque</SelectItem>
                    <SelectItem value="newest">Novidades</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View mode toggle */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8",
                    viewMode === 'grid' && "bg-card shadow-sm"
                  )}
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8",
                    viewMode === 'list' && "bg-card shadow-sm"
                  )}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Active filters display */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.colors.map((color) => (
                  <Badge
                    key={color}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive/10"
                    onClick={() =>
                      setFilters({
                        ...filters,
                        colors: filters.colors.filter((c) => c !== color),
                      })
                    }
                  >
                    🎨 {color}
                    <span className="ml-1">×</span>
                  </Badge>
                ))}
                {filters.categories.map((catId) => {
                  const cat = CATEGORIES.find((c) => c.id === catId);
                  return cat ? (
                    <Badge
                      key={catId}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive/10"
                      onClick={() =>
                        setFilters({
                          ...filters,
                          categories: filters.categories.filter((c) => c !== catId),
                        })
                      }
                    >
                      {cat.icon} {cat.name}
                      <span className="ml-1">×</span>
                    </Badge>
                  ) : null;
                })}
                {filters.featured && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive/10"
                    onClick={() => setFilters({ ...filters, featured: false })}
                  >
                    ⭐ Destaques
                    <span className="ml-1">×</span>
                  </Badge>
                )}
                {filters.isKit && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive/10"
                    onClick={() => setFilters({ ...filters, isKit: false })}
                  >
                    📦 KITs
                    <span className="ml-1">×</span>
                  </Badge>
                )}
              </div>
            )}

            {/* Product grid */}
            <ProductGrid
              products={filteredProducts}
              onViewProduct={handleViewProduct}
              onShareProduct={handleShareProduct}
              onFavoriteProduct={handleFavoriteProduct}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
