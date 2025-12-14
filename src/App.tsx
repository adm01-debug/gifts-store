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
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import BitrixSyncPage from "./pages/BitrixSyncPage";
import QuotesPage from "./pages/QuotesPage";
import CreateQuotePage from "./pages/CreateQuotePage";
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
                    {/* Public route */}
                    <Route path="/auth" element={<Auth />} />
                    
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
                    <Route path="/perfil" element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/bitrix" element={
                      <ProtectedRoute>
                        <BitrixSyncPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/orcamentos" element={
                      <ProtectedRoute>
                        <QuotesPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/orcamentos/novo" element={
                      <ProtectedRoute>
                        <CreateQuotePage />
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
