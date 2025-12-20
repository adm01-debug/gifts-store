import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Package,
  Users,
  FileText,
  ShoppingCart,
  Search,
  ArrowRight,
  Loader2,
  FolderOpen,
  BarChart3,
  Calculator,
  Wand2,
  Heart,
  TrendingUp,
  Sparkles,
  Brain,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: "product" | "client" | "quote" | "order";
  href: string;
  metadata?: Record<string, unknown>;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  shortcut?: string;
}

const quickActions: QuickAction[] = [
  {
    id: "new-quote",
    title: "Novo Orçamento",
    description: "Criar um novo orçamento",
    icon: <FileText className="h-4 w-4" />,
    href: "/orcamentos/novo",
    shortcut: "N",
  },
  {
    id: "products",
    title: "Catálogo de Produtos",
    description: "Ver todos os produtos",
    icon: <Package className="h-4 w-4" />,
    href: "/",
  },
  {
    id: "clients",
    title: "Lista de Clientes",
    description: "Ver todos os clientes",
    icon: <Users className="h-4 w-4" />,
    href: "/clientes",
  },
  {
    id: "orders",
    title: "Gestão de Pedidos",
    description: "Ver todos os pedidos",
    icon: <ShoppingCart className="h-4 w-4" />,
    href: "/pedidos",
  },
  {
    id: "quotes",
    title: "Orçamentos",
    description: "Ver todos os orçamentos",
    icon: <FileText className="h-4 w-4" />,
    href: "/orcamentos",
  },
  {
    id: "collections",
    title: "Coleções",
    description: "Ver suas coleções",
    icon: <FolderOpen className="h-4 w-4" />,
    href: "/colecoes",
  },
  {
    id: "favorites",
    title: "Favoritos",
    description: "Ver produtos favoritos",
    icon: <Heart className="h-4 w-4" />,
    href: "/favoritos",
  },
  {
    id: "simulator",
    title: "Simulador de Personalização",
    description: "Calcular custos de personalização",
    icon: <Calculator className="h-4 w-4" />,
    href: "/simulador",
  },
  {
    id: "mockup",
    title: "Gerador de Mockups",
    description: "Criar mockups com logo",
    icon: <Wand2 className="h-4 w-4" />,
    href: "/mockup",
  },
  {
    id: "bi",
    title: "Dashboard BI",
    description: "Análises e métricas",
    icon: <BarChart3 className="h-4 w-4" />,
    href: "/bi",
  },
  {
    id: "trends",
    title: "Tendências",
    description: "Análise de tendências",
    icon: <TrendingUp className="h-4 w-4" />,
    href: "/tendencias",
  },
];

const typeConfig = {
  product: { label: "Produto", color: "bg-blue-500", icon: Package },
  client: { label: "Cliente", color: "bg-green-500", icon: Users },
  quote: { label: "Orçamento", color: "bg-orange-500", icon: FileText },
  order: { label: "Pedido", color: "bg-purple-500", icon: ShoppingCart },
};

interface SearchIntent {
  type: 'product' | 'client' | 'quote' | 'order' | 'mixed';
  filters: {
    category?: string;
    color?: string;
    material?: string;
    priceRange?: 'low' | 'medium' | 'high';
    status?: string;
    clientName?: string;
    dateRange?: 'today' | 'week' | 'month' | 'year';
  };
  keywords: string[];
  originalQuery: string;
}

export function GlobalSearchPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [searchIntent, setSearchIntent] = useState<SearchIntent | null>(null);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 500);

  // Listen for Ctrl+K / Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // AI-powered semantic search
  const performSemanticSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setResults([]);
      setSearchIntent(null);
      return;
    }

    setIsSearching(true);
    setIsAIProcessing(true);

    try {
      // First, get AI interpretation of the query
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('semantic-search', {
        body: { query: searchQuery }
      });

      setIsAIProcessing(false);

      let intent: SearchIntent = {
        type: 'mixed',
        filters: {},
        keywords: searchQuery.split(' ').filter(w => w.length > 2),
        originalQuery: searchQuery
      };

      if (aiResponse?.success && aiResponse?.intent) {
        intent = aiResponse.intent;
        setSearchIntent(intent);
      }

      const allResults: SearchResult[] = [];

      // Search based on intent
      if (intent.type === 'product' || intent.type === 'mixed') {
        let productQuery = supabase
          .from("products")
          .select("id, name, sku, category_name, price, colors")
          .eq("is_active", true);

        // Apply semantic filters
        if (intent.filters.category) {
          productQuery = productQuery.ilike("category_name", `%${intent.filters.category}%`);
        }
        
        if (intent.filters.priceRange) {
          if (intent.filters.priceRange === 'low') {
            productQuery = productQuery.lt("price", 50);
          } else if (intent.filters.priceRange === 'high') {
            productQuery = productQuery.gt("price", 200);
          }
        }

        // Text search with keywords
        const keywordSearch = intent.keywords.join('%');
        if (keywordSearch) {
          productQuery = productQuery.or(`name.ilike.%${keywordSearch}%,sku.ilike.%${keywordSearch}%,category_name.ilike.%${keywordSearch}%`);
        }

        const { data: products } = await productQuery.limit(8);

        if (products) {
          // Filter by color if specified
          let filteredProducts = products;
          if (intent.filters.color) {
            const colorLower = intent.filters.color.toLowerCase();
            filteredProducts = products.filter((p: any) => {
              if (!p.colors) return false;
              const colors = Array.isArray(p.colors) ? p.colors : [];
              return colors.some((c: any) => 
                c.name?.toLowerCase().includes(colorLower) || 
                c.label?.toLowerCase().includes(colorLower)
              );
            });
            // If no color matches, show all products
            if (filteredProducts.length === 0) filteredProducts = products;
          }

          filteredProducts.forEach((p: any) => {
            allResults.push({
              id: p.id,
              title: p.name,
              subtitle: `SKU: ${p.sku} • ${p.category_name || "Sem categoria"} • ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(p.price)}`,
              type: "product",
              href: `/produto/${p.id}`,
            });
          });
        }
      }

      if (intent.type === 'client' || intent.type === 'mixed') {
        let clientQuery = supabase
          .from("bitrix_clients")
          .select("id, name, email, ramo");

        if (intent.filters.clientName) {
          clientQuery = clientQuery.ilike("name", `%${intent.filters.clientName}%`);
        } else {
          const keywordSearch = intent.keywords.join('%');
          if (keywordSearch) {
            clientQuery = clientQuery.or(`name.ilike.%${keywordSearch}%,email.ilike.%${keywordSearch}%`);
          }
        }

        const { data: clients } = await clientQuery.limit(5);

        if (clients) {
          clients.forEach((c) => {
            allResults.push({
              id: c.id,
              title: c.name,
              subtitle: c.email || c.ramo || "Cliente",
              type: "client",
              href: `/cliente/${c.id}`,
            });
          });
        }
      }

      if (intent.type === 'quote' || intent.type === 'mixed') {
        let quoteQuery = supabase
          .from("quotes")
          .select("id, quote_number, status, total, client:bitrix_clients(name)");

        if (intent.filters.status) {
          quoteQuery = quoteQuery.eq("status", intent.filters.status as any);
        }

        if (intent.filters.clientName) {
          // Filter by client name in the result
        }

        const { data: quotes } = await quoteQuery.limit(5);

        if (quotes) {
          let filteredQuotes = quotes;
          if (intent.filters.clientName) {
            const clientNameLower = intent.filters.clientName.toLowerCase();
            filteredQuotes = quotes.filter((q: any) => 
              q.client?.name?.toLowerCase().includes(clientNameLower)
            );
          }

          filteredQuotes.forEach((q: any) => {
            allResults.push({
              id: q.id,
              title: q.quote_number,
              subtitle: `${q.client?.name || "Sem cliente"} • ${q.status} • ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(q.total || 0)}`,
              type: "quote",
              href: `/orcamentos/${q.id}`,
            });
          });
        }
      }

      if (intent.type === 'order' || intent.type === 'mixed') {
        let orderQuery = (supabase.from("orders") as any)
          .select("id, order_number, status, total, client:bitrix_clients(name)");

        if (intent.filters.status) {
          orderQuery = orderQuery.eq("status", intent.filters.status);
        }

        const { data: orders } = await orderQuery.limit(5);

        if (orders) {
          let filteredOrders = orders;
          if (intent.filters.clientName) {
            const clientNameLower = intent.filters.clientName.toLowerCase();
            filteredOrders = orders.filter((o: any) => 
              o.client?.name?.toLowerCase().includes(clientNameLower)
            );
          }

          filteredOrders.forEach((o: any) => {
            allResults.push({
              id: o.id,
              title: o.order_number,
              subtitle: `${o.client?.name || "Sem cliente"} • ${o.status} • ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(o.total || 0)}`,
              type: "order",
              href: `/pedidos/${o.id}`,
            });
          });
        }
      }

      setResults(allResults);
    } catch (error) {
      console.error("Search error:", error);
      setIsAIProcessing(false);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Trigger search when debounced query changes
  useEffect(() => {
    performSemanticSearch(debouncedQuery);
  }, [debouncedQuery, performSemanticSearch]);

  const handleSelect = (href: string) => {
    setOpen(false);
    setQuery("");
    setResults([]);
    setSearchIntent(null);
    navigate(href);
  };

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-muted/50 hover:bg-muted rounded-lg border border-border transition-colors w-full md:w-64"
      >
        <Brain className="h-4 w-4 text-primary" />
        <span className="flex-1 text-left">Busca inteligente...</span>
        <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Ex: canecas azuis baratas, orçamentos pendentes do João..." 
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className="max-h-[500px]">
          {/* AI Processing indicator */}
          {isAIProcessing && (
            <div className="flex items-center gap-2 px-4 py-3 bg-primary/5 border-b">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm text-primary">Analisando sua busca com IA...</span>
            </div>
          )}

          {/* Show interpreted intent */}
          {searchIntent && !isSearching && results.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 px-4 py-2 bg-muted/50 border-b">
              <Brain className="h-3 w-3 text-primary" />
              <span className="text-xs text-muted-foreground">Entendi:</span>
              {searchIntent.type !== 'mixed' && (
                <Badge variant="outline" className="text-xs">
                  {searchIntent.type === 'product' && 'Produtos'}
                  {searchIntent.type === 'client' && 'Clientes'}
                  {searchIntent.type === 'quote' && 'Orçamentos'}
                  {searchIntent.type === 'order' && 'Pedidos'}
                </Badge>
              )}
              {searchIntent.filters.category && (
                <Badge variant="secondary" className="text-xs">
                  {searchIntent.filters.category}
                </Badge>
              )}
              {searchIntent.filters.color && (
                <Badge variant="secondary" className="text-xs">
                  Cor: {searchIntent.filters.color}
                </Badge>
              )}
              {searchIntent.filters.priceRange && (
                <Badge variant="secondary" className="text-xs">
                  {searchIntent.filters.priceRange === 'low' && 'Preço baixo'}
                  {searchIntent.filters.priceRange === 'medium' && 'Preço médio'}
                  {searchIntent.filters.priceRange === 'high' && 'Premium'}
                </Badge>
              )}
              {searchIntent.filters.status && (
                <Badge variant="secondary" className="text-xs">
                  Status: {searchIntent.filters.status}
                </Badge>
              )}
              {searchIntent.filters.clientName && (
                <Badge variant="secondary" className="text-xs">
                  Cliente: {searchIntent.filters.clientName}
                </Badge>
              )}
            </div>
          )}

          {isSearching && !isAIProcessing && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isSearching && query.length >= 3 && results.length === 0 && (
            <CommandEmpty>
              Nenhum resultado encontrado para "{query}"
            </CommandEmpty>
          )}

          {/* Search results */}
          {!isSearching && Object.entries(groupedResults).map(([type, items]) => {
            const config = typeConfig[type as keyof typeof typeConfig];
            const Icon = config.icon;
            
            return (
              <CommandGroup key={type} heading={config.label + "s"}>
                {items.map((result) => (
                  <CommandItem
                    key={result.id}
                    value={result.title}
                    onSelect={() => handleSelect(result.href)}
                    className="flex items-center gap-3 py-3"
                  >
                    <div className={`p-2 rounded-lg ${config.color}/10`}>
                      <Icon className={`h-4 w-4 ${config.color.replace("bg-", "text-")}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{result.title}</p>
                      {result.subtitle && (
                        <p className="text-sm text-muted-foreground truncate">
                          {result.subtitle}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      {config.label}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}

          {/* Quick actions when no search query */}
          {query.length < 2 && (
            <>
              <CommandGroup heading="Ações Rápidas">
                {quickActions.slice(0, 5).map((action) => (
                  <CommandItem
                    key={action.id}
                    value={action.title}
                    onSelect={() => handleSelect(action.href)}
                    className="flex items-center gap-3 py-2"
                  >
                    <div className="p-2 rounded-lg bg-primary/10">
                      {action.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{action.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                    {action.shortcut && (
                      <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                        {action.shortcut}
                      </kbd>
                    )}
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </CommandItem>
                ))}
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading="Navegação">
                {quickActions.slice(5).map((action) => (
                  <CommandItem
                    key={action.id}
                    value={action.title}
                    onSelect={() => handleSelect(action.href)}
                    className="flex items-center gap-3 py-2"
                  >
                    <div className="p-2 rounded-lg bg-muted">
                      {action.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{action.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
