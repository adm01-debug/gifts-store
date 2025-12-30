import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface PriceHistoryItem {
  id: string;
  changed_at: string;
  old_price: number | null;
  new_price: number;
}

interface PriceHistoryChartProps {
  productId: string;
}

export function PriceHistoryChart({ productId }: PriceHistoryChartProps) {
  // Simulando histórico de preços baseado no produto atual
  // já que a tabela price_history não existe no banco
  const { data: product, isLoading } = useQuery({
    queryKey: ['product-for-price-history', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('price, created_at, updated_at')
        .eq('id', productId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!productId
  });

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

  if (!product) {
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
            Este produto ainda não teve alterações de preço registradas
          </p>
        </CardContent>
      </Card>
    );
  }

  // Simulação de histórico com dados do produto
  const simulatedHistory: PriceHistoryItem[] = [
    {
      id: '1',
      changed_at: product.created_at,
      old_price: null,
      new_price: product.price
    }
  ];

  const chartData = simulatedHistory.map(h => ({
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Histórico de Preços
        </CardTitle>
        <CardDescription>
          Preço atual: {formatCurrency(product.price)}
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

        <div className="mt-4 text-sm">
          <div>
            <p className="text-muted-foreground">Preço Atual</p>
            <p className="font-medium">
              {formatCurrency(product.price)}
            </p>
            <p className="text-xs text-muted-foreground">
              Registrado em {new Date(product.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
