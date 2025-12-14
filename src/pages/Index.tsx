import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, TrendingUp, Users, Layers, Filter, ArrowUpDown, LayoutGrid, List, User, X, Palette, Sparkles } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductList } from "@/components/products/ProductList";
import { ProductGridSkeleton } from "@/components/products/ProductCardSkeleton";
import { ProductListSkeleton } from "@/components/products/ProductListItemSkeleton";
import { FilterPanel, FilterState, defaultFilters } from "@/components/filters/FilterPanel";
import { QuickFiltersBar, QuickFilter } from "@/components/filters/QuickFiltersBar";
import { ClientFilterModal } from "@/components/clients/ClientFilterModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PRODUCTS, CATEGORIES, SUPPLIERS, type Product, type Client } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { useFavoritesContext } from "@/contexts/FavoritesContext";
import { useComparisonContext } from "@/contexts/ComparisonContext";

type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'price-asc' | 'price-desc' | 'stock' | 'newest' | 'color-match';

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isFavorite, toggleFavorite, favoriteCount } = useFavoritesContext();
  const { isInCompare, toggleCompare, canAddMore } = useComparisonContext();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuickFilterId, setActiveQuickFilterId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  // Simular carregamento inicial
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
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

  // Get client colors for highlighting
  const clientColorGroups = useMemo(() => {
    if (!selectedClient) return [];
    const colors = [selectedClient.primaryColor, ...selectedClient.secondaryColors];
    return colors.map((c) => c.group);
  }, [selectedClient]);

  // Calculate color match score for a product
  const getColorMatchScore = (product: Product): number => {
    if (!selectedClient) return 0;
    const clientColors = [selectedClient.primaryColor.group, ...selectedClient.secondaryColors.map(c => c.group)];
    const matchCount = product.colors.filter(c => clientColors.includes(c.group)).length;
    return matchCount;
  };

  // Filtrar e ordenar produtos
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Text search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.name.toLowerCase().includes(query) ||
        p.materials.some((m) => m.toLowerCase().includes(query)) ||
        p.tags.datasComemorativas.some((d) => d.toLowerCase().includes(query)) ||
        p.tags.publicoAlvo.some((pa) => pa.toLowerCase().includes(query))
      );
    }

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
      case 'color-match':
        result.sort((a, b) => getColorMatchScore(b) - getColorMatchScore(a));
        break;
    }

    return result;
  }, [filters, sortBy, selectedClient, searchQuery]);

  // Apply quick filter
  const handleApplyQuickFilter = (quickFilter: QuickFilter["filter"]) => {
    const newFilters = { ...defaultFilters };
    
    if (quickFilter.datasComemorativas) {
      newFilters.datasComemorativas = quickFilter.datasComemorativas;
    }
    if (quickFilter.nichos) {
      newFilters.nichos = quickFilter.nichos;
    }
    if (quickFilter.publicoAlvo) {
      newFilters.publicoAlvo = quickFilter.publicoAlvo;
    }
    if (quickFilter.priceRange) {
      newFilters.priceRange = quickFilter.priceRange;
    }
    if (quickFilter.featured) {
      newFilters.featured = quickFilter.featured;
    }
    if (quickFilter.isKit) {
      newFilters.isKit = quickFilter.isKit;
    }
    
    setFilters(newFilters);
    // Find the quick filter id for highlighting
    const quickFilters = [
      { id: "fim-de-ano", filter: { datasComemorativas: ["Natal", "Ano Novo", "Confraternização"] } },
      { id: "dia-das-maes", filter: { datasComemorativas: ["Dia das Mães"], publicoAlvo: ["Mulheres"] } },
      { id: "eventos-corporativos", filter: { nichos: ["Eventos", "Corporativo"], publicoAlvo: ["Executivos"] } },
      { id: "onboarding", filter: { isKit: true, nichos: ["RH", "Onboarding"] } },
      { id: "destaques", filter: { featured: true } },
      { id: "ate-50", filter: { priceRange: [0, 50] } },
    ];
    const matched = quickFilters.find(qf => JSON.stringify(qf.filter) === JSON.stringify(quickFilter));
    setActiveQuickFilterId(matched?.id);
  };

  const handleClearQuickFilter = () => {
    setFilters(defaultFilters);
    setActiveQuickFilterId(undefined);
  };

  const handleViewProduct = (product: Product) => {
    navigate(`/produto/${product.id}`);
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

  const resetFilters = () => {
    setFilters(defaultFilters);
    setActiveQuickFilterId(undefined);
    setSearchQuery("");
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

          <div className="flex items-center gap-2 flex-wrap">
            {/* Client filter button */}
            <Button
              variant={selectedClient ? "default" : "outline"}
              size="sm"
              onClick={() => setClientModalOpen(true)}
              className="gap-2"
            >
              <User className="h-4 w-4" />
              {selectedClient ? selectedClient.name : "Filtrar por cliente"}
            </Button>

            {/* Selected client indicator */}
            {selectedClient && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <Palette className="h-3 w-3 text-primary" />
                <div className="flex items-center gap-1">
                  <div
                    className="w-4 h-4 rounded-full border border-border"
                    style={{ backgroundColor: selectedClient.primaryColor.hex }}
                    title={selectedClient.primaryColor.name}
                  />
                  {selectedClient.secondaryColors.slice(0, 2).map((color, idx) => (
                    <div
                      key={idx}
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 ml-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedClient(null);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            <Badge variant="secondary" className="text-sm">
              {filteredProducts.length} produtos
            </Badge>
          </div>
        </div>

        {/* Quick Filters Bar */}
        <QuickFiltersBar
          onApplyFilter={handleApplyQuickFilter}
          activeFilterId={activeQuickFilterId}
          onClearFilter={handleClearQuickFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card-interactive">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalProducts}</p>
                <p className="text-sm text-muted-foreground">Total de Produtos</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-interactive">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.inStock}</p>
                <p className="text-sm text-muted-foreground">Em Estoque</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-interactive">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
                <Layers className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.categories}</p>
                <p className="text-sm text-muted-foreground">Categorias</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-interactive">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.suppliers}</p>
                <p className="text-sm text-muted-foreground">Fornecedores</p>
              </div>
            </CardContent>
          </Card>
        </div>

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
                    {selectedClient && (
                      <SelectItem value="color-match">Cores Compatíveis</SelectItem>
                    )}
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

            {/* Product grid or list */}
            {isLoading ? (
              viewMode === 'grid' ? (
                <ProductGridSkeleton count={8} />
              ) : (
                <ProductListSkeleton count={6} />
              )
            ) : viewMode === 'grid' ? (
              <ProductGrid
                products={filteredProducts}
                onProductClick={(productId) => navigate(`/produto/${productId}`)}
                onViewProduct={handleViewProduct}
                onShareProduct={handleShareProduct}
                onFavoriteProduct={handleFavoriteProduct}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
                isInCompare={isInCompare}
                onToggleCompare={toggleCompare}
                canAddToCompare={canAddMore}
                highlightColors={clientColorGroups}
              />
            ) : (
              <ProductList
                products={filteredProducts}
                onProductClick={(productId) => navigate(`/produto/${productId}`)}
                onViewProduct={handleViewProduct}
                onShareProduct={handleShareProduct}
                onFavoriteProduct={handleFavoriteProduct}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
                isInCompare={isInCompare}
                onToggleCompare={toggleCompare}
                canAddToCompare={canAddMore}
                highlightColors={clientColorGroups}
              />
            )}
          </div>
        </div>
      </div>

      {/* Client Filter Modal */}
      <ClientFilterModal
        open={clientModalOpen}
        onOpenChange={setClientModalOpen}
        onSelectClient={setSelectedClient}
        selectedClientId={selectedClient?.id}
      />
    </MainLayout>
  );
}
