import { createContext, useContext, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider, ProtectedRoute } from "@/contexts/AuthContext";
import { ProductsProvider } from "@/contexts/ProductsContext";
import { CollectionsProvider } from "@/contexts/CollectionsContext";
import { GamificationProvider } from "@/contexts/GamificationContext";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { supabase } from "@/integrations/supabase/client";
import LoadingScreen from "@/components/LoadingScreen";
import { Analytics } from "@vercel/analytics/react";
import "./App.css";

// Auth Pages
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
const MagicUp = lazy(() => import("./pages/MagicUp"));

// User Pages
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

// Bitrix Integration
const BitrixSync = lazy(() => import("./pages/BitrixSync"));

// Analytics Pages
const BIDashboard = lazy(() => import("./pages/BIDashboard"));
const TrendsPage = lazy(() => import("./pages/TrendsPage"));

// Gamification Pages
const StoreRewardsPage = lazy(() => import("./pages/StoreRewardsPage"));

const queryClient = new QueryClient();

const App = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ProductsProvider>
            <CollectionsProvider>
              <GamificationProvider>
                <ComparisonProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Suspense fallback={<LoadingScreen />}>
                      <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Auth />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/approve/:token" element={<PublicQuoteApproval />} />

                        {/* Protected Routes */}
                        <Route
                          path="/*"
                          element={
                            <ProtectedRoute>
                              <Routes>
                                {/* Home */}
                                <Route path="/" element={<Index />} />

                                {/* Products */}
                                <Route path="/produto/:id" element={<ProductDetail />} />
                                <Route path="/filtros" element={<FiltersPage />} />
                                <Route path="/favoritos" element={<FavoritesPage />} />
                                <Route path="/comparar" element={<ComparePage />} />
                                <Route path="/colecoes" element={<CollectionsPage />} />
                                <Route path="/colecoes/:id" element={<CollectionDetailPage />} />

                                {/* Clients */}
                                <Route path="/clientes" element={<ClientList />} />
                                <Route path="/clientes/:id" element={<ClientDetail />} />

                                {/* Quotes */}
                                <Route path="/orcamentos" element={<QuotesListPage />} />
                                <Route path="/orcamentos/dashboard" element={<QuotesDashboardPage />} />
                                <Route path="/orcamentos/lista" element={<QuotesListPage />} />
                                <Route path="/orcamentos/kanban" element={<QuotesKanbanPage />} />
                                <Route path="/orcamentos/templates" element={<QuoteTemplatesPage />} />
                                <Route path="/orcamentos/novo" element={<QuoteBuilderPage />} />
                                <Route path="/orcamentos/:id/editar" element={<QuoteBuilderPage />} />
                                <Route path="/orcamentos/:id" element={<QuoteViewPage />} />

                                {/* Orders */}
                                <Route path="/pedidos" element={<OrdersListPage />} />
                                <Route path="/pedidos/:id" element={<OrderDetailPage />} />

                                {/* Admin */}
                                <Route path="/admin" element={<AdminPanel />} />
                                <Route path="/admin/personalizacao" element={<AdminPersonalizationPage />} />
                          
                                {/* Tools Routes */}
                                <Route path="/simulador" element={<PersonalizationSimulator />} />
                                <Route path="/mockup" element={<Navigate to="/mockup-generator" replace />} />
                                <Route path="/mockup-generator" element={<MockupGenerator />} />
                                <Route path="/magic-up" element={<MagicUp />} />
                          
                                {/* User Routes */}
                                <Route path="/perfil" element={<ProfilePage />} />

                                {/* Bitrix */}
                                <Route path="/bitrix-sync" element={<BitrixSync />} />

                                {/* Analytics */}
                                <Route path="/bi" element={<BIDashboard />} />
                                <Route path="/tendencias" element={<TrendsPage />} />

                                {/* Gamification */}
                                <Route path="/loja-recompensas" element={<StoreRewardsPage />} />

                                {/* Fallback */}
                                <Route path="*" element={<NotFound />} />
                              </Routes>
                            </ProtectedRoute>
                          }
                        />
                      </Routes>
                    </Suspense>
                  </BrowserRouter>
                  <Analytics />
                </ComparisonProvider>
              </GamificationProvider>
            </CollectionsProvider>
          </ProductsProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
