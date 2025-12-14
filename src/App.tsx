import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { CollectionsProvider } from "@/contexts/CollectionsContext";
import { CompareBar } from "@/components/compare/CompareBar";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import ClientDetail from "./pages/ClientDetail";
import ClientList from "./pages/ClientList";
import FiltersPage from "./pages/FiltersPage";
import FavoritesPage from "./pages/FavoritesPage";
import ComparePage from "./pages/ComparePage";
import CollectionsPage from "./pages/CollectionsPage";
import CollectionDetailPage from "./pages/CollectionDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <FavoritesProvider>
        <ComparisonProvider>
          <CollectionsProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/produto/:id" element={<ProductDetail />} />
                  <Route path="/clientes" element={<ClientList />} />
                  <Route path="/cliente/:id" element={<ClientDetail />} />
                  <Route path="/filtros" element={<FiltersPage />} />
                  <Route path="/favoritos" element={<FavoritesPage />} />
                  <Route path="/comparar" element={<ComparePage />} />
                  <Route path="/colecoes" element={<CollectionsPage />} />
                  <Route path="/colecao/:id" element={<CollectionDetailPage />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <CompareBar />
              </BrowserRouter>
            </TooltipProvider>
          </CollectionsProvider>
        </ComparisonProvider>
      </FavoritesProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
