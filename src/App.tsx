import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { CollectionsProvider } from "@/contexts/CollectionsContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { CompareBar } from "@/components/compare/CompareBar";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import ClientDetail from "./pages/ClientDetail";
import ClientList from "./pages/ClientList";
import FiltersPage from "./pages/FiltersPage";
import FavoritesPage from "./pages/FavoritesPage";
import ComparePage from "./pages/ComparePage";
import CollectionsPage from "./pages/CollectionsPage";
import CollectionDetailPage from "./pages/CollectionDetailPage";
import AdminPanel from "./pages/AdminPanel";
import AdminPersonalizationPage from "./pages/AdminPersonalizationPage";
import PersonalizationSimulator from "./pages/PersonalizationSimulator";
import MockupGenerator from "./pages/MockupGenerator";
import ProfilePage from "./pages/ProfilePage";
import BitrixSyncPage from "./pages/BitrixSyncPage";
import BIDashboard from "./pages/BIDashboard";
import TrendsPage from "./pages/TrendsPage";
import QuoteTemplatesPage from "./pages/QuoteTemplatesPage";
import QuotesListPage from "./pages/QuotesListPage";
import QuotesDashboardPage from "./pages/QuotesDashboardPage";
import QuoteBuilderPage from "./pages/QuoteBuilderPage";
import QuoteViewPage from "./pages/QuoteViewPage";
import PublicQuoteApproval from "./pages/PublicQuoteApproval";
import OrdersListPage from "./pages/OrdersListPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import QuotesKanbanPage from "./pages/QuotesKanbanPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <FavoritesProvider>
          <ComparisonProvider>
            <CollectionsProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/aprovar-orcamento" element={<PublicQuoteApproval />} />
                    
                    {/* Protected routes */}
                    <Route path="/" element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    } />
                    <Route path="/produto/:id" element={
                      <ProtectedRoute>
                        <ProductDetail />
                      </ProtectedRoute>
                    } />
                    <Route path="/clientes" element={
                      <ProtectedRoute>
                        <ClientList />
                      </ProtectedRoute>
                    } />
                    <Route path="/cliente/:id" element={
                      <ProtectedRoute>
                        <ClientDetail />
                      </ProtectedRoute>
                    } />
                    <Route path="/filtros" element={
                      <ProtectedRoute>
                        <FiltersPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/favoritos" element={
                      <ProtectedRoute>
                        <FavoritesPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/comparar" element={
                      <ProtectedRoute>
                        <ComparePage />
                      </ProtectedRoute>
                    } />
                    <Route path="/colecoes" element={
                      <ProtectedRoute>
                        <CollectionsPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/colecao/:id" element={
                      <ProtectedRoute>
                        <CollectionDetailPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin" element={
                      <ProtectedRoute requireAdmin>
                        <AdminPanel />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/personalizacao" element={
                      <ProtectedRoute requireAdmin>
                        <AdminPersonalizationPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/perfil" element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } />
                    <Route path="/simulador" element={
                      <ProtectedRoute>
                        <PersonalizationSimulator />
                      </ProtectedRoute>
                    } />
                    <Route path="/mockup" element={
                      <ProtectedRoute>
                        <MockupGenerator />
                      </ProtectedRoute>
                    } />
                    <Route path="/bi" element={
                      <ProtectedRoute>
                        <BIDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/tendencias" element={
                      <ProtectedRoute>
                        <TrendsPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/templates-orcamento" element={
                      <ProtectedRoute>
                        <QuoteTemplatesPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/orcamentos" element={
                      <ProtectedRoute>
                        <QuotesListPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/orcamentos/dashboard" element={
                      <ProtectedRoute>
                        <QuotesDashboardPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/orcamentos/kanban" element={
                      <ProtectedRoute>
                        <QuotesKanbanPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/orcamentos/novo" element={
                      <ProtectedRoute>
                        <QuoteBuilderPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/orcamentos/:id/editar" element={
                      <ProtectedRoute>
                        <QuoteBuilderPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/orcamentos/:id" element={
                      <ProtectedRoute>
                        <QuoteViewPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/pedidos" element={
                      <ProtectedRoute>
                        <OrdersListPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/pedidos/:id" element={
                      <ProtectedRoute>
                        <OrderDetailPage />
                      </ProtectedRoute>
                    } />
                    
                    {/* Catch-all */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <CompareBar />
                </BrowserRouter>
              </TooltipProvider>
            </CollectionsProvider>
          </ComparisonProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
