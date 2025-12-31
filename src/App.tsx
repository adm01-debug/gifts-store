import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Suspense, lazy } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { CollectionsProvider } from "@/contexts/CollectionsContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { CompareBar } from "@/components/compare/CompareBar";
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";
import { AdminRealtimeNotifications } from "@/components/admin/AdminRealtimeNotifications";

// ⚡ LAZY LOADING: Todas as páginas carregadas sob demanda
// Isso reduz o bundle inicial em ~60% e melhora o First Contentful Paint

// Auth & Public Pages
const Auth = lazy(() => import("./pages/Auth"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Index = lazy(() => import("./pages/Index"));
const PublicQuoteApproval = lazy(() => import("./pages/PublicQuoteApproval"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Product Pages
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const FiltersPage = lazy(() => import("./pages/FiltersPage"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));
const ComparePage = lazy(() => import("./pages/ComparePage"));
const CollectionsPage = lazy(() => import("./pages/CollectionsPage"));
const CollectionDetailPage = lazy(() => import("./pages/CollectionDetailPage"));

// Client Pages
const ClientDetail = lazy(() => import("./pages/ClientDetail"));
const ClientList = lazy(() => import("./pages/ClientList"));

// Quote Pages
const QuoteTemplatesPage = lazy(() => import("./pages/QuoteTemplatesPage"));
const QuotesListPage = lazy(() => import("./pages/QuotesListPage"));
const QuotesDashboardPage = lazy(() => import("./pages/QuotesDashboardPage"));
const QuoteBuilderPage = lazy(() => import("./pages/QuoteBuilderPage"));
const QuoteViewPage = lazy(() => import("./pages/QuoteViewPage"));
const QuotesKanbanPage = lazy(() => import("./pages/QuotesKanbanPage"));

// Order Pages
const OrdersListPage = lazy(() => import("./pages/OrdersListPage"));
const OrderDetailPage = lazy(() => import("./pages/OrderDetailPage"));

// Admin Pages
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const AdminPersonalizationPage = lazy(() => import("./pages/AdminPersonalizationPage"));

// Tools Pages
const PersonalizationSimulator = lazy(() => import("./pages/PersonalizationSimulator"));
const MockupGenerator = lazy(() => import("./pages/MockupGenerator"));

// User Pages
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const SecurityPage = lazy(() => import("./pages/Security"));
const RolesPage = lazy(() => import("./pages/RolesPage"));
const PermissionsPage = lazy(() => import("./pages/PermissionsPage"));
const RateLimitDashboardPage = lazy(() => import("./pages/RateLimitDashboardPage"));
const SSOCallbackPage = lazy(() => import("./pages/SSOCallbackPage"));

// Integration Pages
const BitrixSyncPage = lazy(() => import("./pages/BitrixSyncPage"));

// Analytics Pages
const BIDashboard = lazy(() => import("./pages/BIDashboard"));
const TrendsPage = lazy(() => import("./pages/TrendsPage"));

// Gamification Pages
const RewardsStorePage = lazy(() => import("./pages/RewardsStorePage"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="text-sm text-muted-foreground">Carregando...</p>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary showDetails={import.meta.env.DEV}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <AuthProvider>
              <FavoritesProvider>
                <ComparisonProvider>
                  <CollectionsProvider>
                    <Toaster />
                    <Sonner />
                    <AdminRealtimeNotifications />
                    <BrowserRouter>
                    <CompareBar />
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Auth />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/approve/:token" element={<PublicQuoteApproval />} />
                        
                        {/* Protected Routes */}
                        <Route element={<ProtectedRoute />}>
                          <Route path="/" element={<Index />} />
                          
                          {/* Product Routes */}
                          <Route path="/produto/:id" element={<ProductDetail />} />
                          <Route path="/filtros" element={<FiltersPage />} />
                          <Route path="/favoritos" element={<FavoritesPage />} />
                          <Route path="/comparar" element={<ComparePage />} />
                          <Route path="/colecoes" element={<CollectionsPage />} />
                          <Route path="/colecoes/:id" element={<CollectionDetailPage />} />
                          
                          {/* Client Routes */}
                          <Route path="/clientes" element={<ClientList />} />
                          <Route path="/clientes/:id" element={<ClientDetail />} />
                          
                          {/* Quote Routes */}
                          <Route path="/orcamentos" element={<QuotesDashboardPage />} />
                          <Route path="/orcamentos/lista" element={<QuotesListPage />} />
                          <Route path="/orcamentos/kanban" element={<QuotesKanbanPage />} />
                          <Route path="/orcamentos/templates" element={<QuoteTemplatesPage />} />
                          <Route path="/orcamentos/novo" element={<QuoteBuilderPage />} />
                          <Route path="/orcamentos/:id" element={<QuoteViewPage />} />
                          
                          {/* Order Routes */}
                          <Route path="/pedidos" element={<OrdersListPage />} />
                          <Route path="/pedidos/:id" element={<OrderDetailPage />} />
                          
                          {/* Admin Routes */}
                          <Route path="/admin" element={<AdminPanel />} />
                          <Route path="/admin/personalizacao" element={<AdminPersonalizationPage />} />
                          
                          {/* Tools Routes */}
                          <Route path="/simulador" element={<PersonalizationSimulator />} />
                          <Route path="/mockup" element={<Navigate to="/mockup-generator" replace />} />
                          <Route path="/mockup-generator" element={<MockupGenerator />} />
                          
                          {/* User Routes */}
                          <Route path="/perfil" element={<ProfilePage />} />
                          <Route path="/seguranca" element={<SecurityPage />} />
                          <Route path="/roles" element={<RolesPage />} />
                          <Route path="/permissoes" element={<PermissionsPage />} />
                          <Route path="/rate-limit" element={<RateLimitDashboardPage />} />
                          <Route path="/sso-callback" element={<SSOCallbackPage />} />
                          {/* Integration Routes */}
                          <Route path="/bitrix-sync" element={<BitrixSyncPage />} />
                          
                          {/* Analytics Routes */}
                          <Route path="/bi" element={<BIDashboard />} />
                          <Route path="/tendencias" element={<TrendsPage />} />
                          
                          {/* Gamification Routes */}
                          <Route path="/loja-recompensas" element={<RewardsStorePage />} />
                        </Route>
                        
                        {/* 404 Route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </BrowserRouter>
                  </CollectionsProvider>
                </ComparisonProvider>
              </FavoritesProvider>
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
