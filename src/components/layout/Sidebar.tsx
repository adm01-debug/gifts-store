import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Package, 
  Users, 
  Filter, 
  Heart, 
  GitCompare,
  FolderOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CATEGORIES } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const mainNavItems = [
  { icon: Package, label: "Produtos", href: "/" },
  { icon: FolderOpen, label: "Coleções", href: "/colecoes" },
  { icon: Users, label: "Clientes", href: "/clientes" },
  { icon: Filter, label: "Filtros", href: "/filtros" },
  { icon: Heart, label: "Favoritos", href: "/favoritos" },
  { icon: GitCompare, label: "Comparar", href: "/comparar" },
];

const bottomNavItems = [
  { icon: ShieldCheck, label: "Admin", href: "/admin", adminOnly: true },
  { icon: Settings, label: "Configurações", href: "/configuracoes" },
];

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isAdmin } = useAuth();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-out",
          "lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex flex-col h-full pt-16 lg:pt-4">
          {/* Collapse toggle (desktop only) */}
          <div className="hidden lg:flex justify-end px-2 mb-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleCollapse}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Main navigation */}
          <nav className="flex-1 px-2 space-y-1 overflow-y-auto scrollbar-thin">
            {mainNavItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              const linkContent = (
                <NavLink
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    "hover:bg-sidebar-accent",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                    !isActive && "text-sidebar-foreground/80"
                  )}
                  onClick={() => isOpen && onToggle()}
                >
                  <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              );

              if (isCollapsed) {
                return (
                  <Tooltip key={item.href} delayDuration={0}>
                    <TooltipTrigger asChild>
                      {linkContent}
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return <div key={item.href}>{linkContent}</div>;
            })}

            {/* Categories section */}
            {!isCollapsed && (
              <div className="pt-4">
                <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Categorias
                </p>
                <div className="space-y-0.5 max-h-48 overflow-y-auto scrollbar-thin">
                  {CATEGORIES.slice(0, 8).map((category) => (
                    <button
                      key={category.id}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent rounded-lg transition-colors"
                    >
                      <span>{category.icon}</span>
                      <span className="truncate">{category.name}</span>
                    </button>
                  ))}
                  <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-primary hover:bg-sidebar-accent rounded-lg transition-colors">
                    <span>+</span>
                    <span>Ver todas ({CATEGORIES.length})</span>
                  </button>
                </div>
              </div>
            )}
          </nav>

          <div className="px-2 py-4 border-t border-sidebar-border">
            {bottomNavItems
              .filter((item) => !item.adminOnly || isAdmin)
              .map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                const linkContent = (
                  <NavLink
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                      "hover:bg-sidebar-accent",
                      isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                      !isActive && "text-sidebar-foreground/70"
                    )}
                  >
                    <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </NavLink>
                );

                if (isCollapsed) {
                  return (
                    <Tooltip key={item.href} delayDuration={0}>
                      <TooltipTrigger asChild>
                        {linkContent}
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return <div key={item.href}>{linkContent}</div>;
              })}
          </div>
        </div>
      </aside>
    </>
  );
}
