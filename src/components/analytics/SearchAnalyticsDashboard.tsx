import { useSearchAnalytics } from "@/hooks/useSearchAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, BarChart3 } from "lucide-react";

export function SearchAnalyticsDashboard() {
  const { analytics, topSearches, isLoading } = useSearchAnalytics();

  const sortedSearches = Object.entries(topSearches).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const totalSearches = analytics.length;
  const withResults = analytics.filter((a) => a.results_count > 0).length;
  const withClicks = analytics.filter((a) => a.clicked_product_id).length;

  if (isLoading) return <Card><CardContent className="py-8 text-center">Carregando...</CardContent></Card>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><Search className="h-8 w-8 text-blue-500" /><div><p className="text-2xl font-bold">{totalSearches}</p><p className="text-sm text-muted-foreground">Total de buscas</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><BarChart3 className="h-8 w-8 text-green-500" /><div><p className="text-2xl font-bold">{totalSearches > 0 ? ((withResults / totalSearches) * 100).toFixed(0) : 0}%</p><p className="text-sm text-muted-foreground">Com resultados</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><TrendingUp className="h-8 w-8 text-purple-500" /><div><p className="text-2xl font-bold">{totalSearches > 0 ? ((withClicks / totalSearches) * 100).toFixed(0) : 0}%</p><p className="text-sm text-muted-foreground">Taxa de clique</p></div></div></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Termos Mais Buscados</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sortedSearches.map(([term, count], i) => (
              <div key={term} className="flex items-center justify-between p-2 rounded-lg bg-muted">
                <div className="flex items-center gap-2"><Badge variant="outline">{i + 1}</Badge><span>{term}</span></div>
                <Badge>{count} buscas</Badge>
              </div>
            ))}
            {sortedSearches.length === 0 && <p className="text-center text-muted-foreground py-4">Nenhuma busca registrada</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
