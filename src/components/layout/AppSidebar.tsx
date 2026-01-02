import { NavLink, useLocation } from "react-router-dom";
import {
  Package,
  Users,
  Filter,
  Heart,
  GitCompare,
  FolderOpen,
  Settings,
  ShieldCheck,
  User,
  Cloud,
  Palette,
  Calculator,
  Wand2,
  BarChart3,
  TrendingUp,
  FileText,
  ShoppingCart,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { CATEGORIES } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

const mainNavItems = [
  { icon: BarChart3, label: "Dashboard BI", href: "/bi" },
  { icon: TrendingUp, label: "Tendências", href: "/tendencias" },
  { icon: Package, label: "Produtos", href: "/" },
  { icon: FolderOpen, label: "Coleções", href: "/colecoes" },
  { icon: Users, label: "Clientes", href: "/clientes" },
  { icon: FileText, label: "Orçamentos", href: "/orcamentos" },
  { icon: ShoppingCart, label: "Pedidos", href: "/pedidos" },
  { icon: Calculator, label: "Simulador", href: "/simulador" },
  { icon: Wand2, label: "Mockups", href: "/mockup" },
  { icon: ShoppingBag, label: "Loja", href: "/loja" },
  { icon: Filter, label: "Filtros", href: "/filtros" },
  { icon: Heart, label: "Favoritos", href: "/favoritos" },
  { icon: GitCompare, label: "Comparar", href: "/comparar" },
];

const bottomNavItems = [
  { icon: Cloud, label: "Bitrix24", href: "/bitrix", adminOnly: false },
  { icon: User, label: "Meu Perfil", href: "/perfil", adminOnly: false },
  { icon: ShieldCheck, label: "Admin", href: "/admin", adminOnly: true },
  { icon: Palette, label: "Personalização", href: "/admin/personalizacao", adminOnly: true },
  { icon: Settings, label: "Configurações", href: "/configuracoes", adminOnly: false },
];

export function AppSidebar() {
  const location = useLocation();
  const { isAdmin } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h2 className="text-lg font-semibold">Gifts Store</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink
                        to={item.href}
                        className={cn(
                          "flex items-center gap-3",
                          isActive && "font-medium"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Categorias</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {CATEGORIES.slice(0, 8).map((category) => (
                <SidebarMenuItem key={category.id}>
                  <SidebarMenuButton>
                    <span>{category.icon}</span>
                    <span className="truncate">{category.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {bottomNavItems
            .filter((item) => !item.adminOnly || isAdmin)
            .map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <NavLink
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3",
                        isActive && "font-medium"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
