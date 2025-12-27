import { usePriceHistory } from '@/hooks/usePriceHistory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface PriceHistoryChartProps {
  productId: string;
}

export function PriceHistoryChart({ productId }: PriceHistoryChartProps) {
  const { data: history, isLoading, error } = usePriceHistory(productId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Histórico de Preços
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Carregando histórico...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Preços</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">
            Erro ao carregar histórico de preços
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!history || history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Histórico de Preços
          </CardTitle>
          <CardDescription>
            Nenhuma alteração de preço registrada ainda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Este produto ainda não teve alterações de preço
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = history.map(h => ({
    date: new Date(h.changed_at).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short' 
    }),
    precoAntigo: h.old_price ? Number(h.old_price) : 0,
    precoNovo: Number(h.new_price),
    fullDate: new Date(h.changed_at).toLocaleDateString('pt-BR')
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const lastPrice = history[history.length - 1];
  const firstPrice = history[0];
  const priceChange = lastPrice && firstPrice 
    ? ((Number(lastPrice.new_price) - Number(firstPrice.old_price || firstPrice.new_price)) / Number(firstPrice.old_price || firstPrice.new_price) * 100)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Histórico de Preços
        </CardTitle>
        <CardDescription>
          {history.length} alteraç{history.length === 1 ? 'ão' : 'ões'} registrada{history.length === 1 ? '' : 's'}
          {priceChange !== 0 && (
            <span className={priceChange > 0 ? 'text-green-600' : 'text-red-600'}>
              {' '}• Variação: {priceChange > 0 ? '+' : ''}{priceChange.toFixed(1)}%
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={formatCurrency}
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return payload[0].payload.fullDate;
                }
                return label;
              }}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="precoNovo" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))' }}
              name="Preço"
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Primeiro Registro</p>
            <p className="font-medium">
              {formatCurrency(Number(firstPrice.old_price || firstPrice.new_price))}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(firstPrice.changed_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Preço Atual</p>
            <p className="font-medium">
              {formatCurrency(Number(lastPrice.new_price))}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(lastPrice.changed_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
