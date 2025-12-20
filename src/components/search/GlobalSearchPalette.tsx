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
  Settings,
  Calculator,
  Wand2,
  Heart,
  TrendingUp,
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

export function GlobalSearchPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 300);

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

  // Search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const allResults: SearchResult[] = [];

    try {
      // Search products
      const { data: products } = await supabase
        .from("products")
        .select("id, name, sku, category_name")
        .or(`name.ilike.%${searchQuery}%,sku.ilike.%${searchQuery}%`)
        .eq("is_active", true)
        .limit(5);

      if (products) {
        products.forEach((p) => {
          allResults.push({
            id: p.id,
            title: p.name,
            subtitle: `SKU: ${p.sku} • ${p.category_name || "Sem categoria"}`,
            type: "product",
            href: `/produto/${p.id}`,
          });
        });
      }

      // Search clients
      const { data: clients } = await supabase
        .from("bitrix_clients")
        .select("id, name, email, ramo")
        .or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
        .limit(5);

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

      // Search quotes
      const { data: quotes } = await supabase
        .from("quotes")
        .select("id, quote_number, status, total, client:bitrix_clients(name)")
        .or(`quote_number.ilike.%${searchQuery}%`)
        .limit(5);

      if (quotes) {
        quotes.forEach((q: any) => {
          allResults.push({
            id: q.id,
            title: q.quote_number,
            subtitle: `${q.client?.name || "Sem cliente"} • ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(q.total || 0)}`,
            type: "quote",
            href: `/orcamentos/${q.id}`,
          });
        });
      }

      // Search orders
      const { data: orders } = await (supabase
        .from("orders") as any)
        .select("id, order_number, status, total, client:bitrix_clients(name)")
        .or(`order_number.ilike.%${searchQuery}%`)
        .limit(5);

      if (orders) {
        orders.forEach((o: any) => {
          allResults.push({
            id: o.id,
            title: o.order_number,
            subtitle: `${o.client?.name || "Sem cliente"} • ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(o.total || 0)}`,
            type: "order",
            href: `/pedidos/${o.id}`,
          });
        });
      }

      setResults(allResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Trigger search when debounced query changes
  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  const handleSelect = (href: string) => {
    setOpen(false);
    setQuery("");
    setResults([]);
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
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Buscar...</span>
        <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Buscar produtos, clientes, orçamentos, pedidos..." 
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className="max-h-[500px]">
          {isSearching && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isSearching && query.length >= 2 && results.length === 0 && (
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
