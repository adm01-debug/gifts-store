import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { QuoteProvider } from "@/contexts/QuoteContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { CompareBar } from "@/components/compare/CompareBar";
import { QuoteBar } from "@/components/quote/QuoteBar";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import ClientDetail from "./pages/ClientDetail";
import ClientList from "./pages/ClientList";
import FiltersPage from "./pages/FiltersPage";
import FavoritesPage from "./pages/FavoritesPage";
import ComparePage from "./pages/ComparePage";
import QuotePage from "./pages/QuotePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <FavoritesProvider>
        <ComparisonProvider>
          <QuoteProvider>
            <NotificationsProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/produtos" element={<Index />} />
                    <Route path="/produto/:id" element={<ProductDetail />} />
                    <Route path="/clientes" element={<ClientList />} />
                    <Route path="/cliente/:id" element={<ClientDetail />} />
                    <Route path="/filtros" element={<FiltersPage />} />
                    <Route path="/favoritos" element={<FavoritesPage />} />
                    <Route path="/comparar" element={<ComparePage />} />
                    <Route path="/orcamento" element={<QuotePage />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <CompareBar />
                  <QuoteBar />
                </BrowserRouter>
              </TooltipProvider>
            </NotificationsProvider>
          </QuoteProvider>
        </ComparisonProvider>
      </FavoritesProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
