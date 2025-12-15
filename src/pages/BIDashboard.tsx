import { MainLayout } from "@/components/layout/MainLayout";
import { useBIMetrics } from "@/hooks/useBIMetrics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Briefcase, 
  FileText, 
  Wand2, 
  Calculator, 
  TrendingUp,
  DollarSign,
  Building2,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const STATUS_LABELS: Record<string, string> = {
  draft: "Rascunho",
  pending: "Pendente",
  sent: "Enviado",
  approved: "Aprovado",
  rejected: "Rejeitado",
  expired: "Expirado",
};

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  pending: "bg-yellow-500/20 text-yellow-600",
  sent: "bg-blue-500/20 text-blue-600",
  approved: "bg-green-500/20 text-green-600",
  rejected: "bg-red-500/20 text-red-600",
  expired: "bg-gray-500/20 text-gray-600",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatMonth(monthStr: string) {
  const [year, month] = monthStr.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return format(date, "MMM", { locale: ptBR });
}

export default function BIDashboard() {
  const { data: metrics, isLoading } = useBIMetrics();
  const navigate = useNavigate();

  const quoteStatusData = metrics
    ? Object.entries(metrics.quotesByStatus).map(([status, count]) => ({
        name: STATUS_LABELS[status] || status,
        value: count,
        status,
      }))
    : [];

  const dealsByMonthData = metrics?.dealsByMonth.map((d) => ({
    ...d,
    monthLabel: formatMonth(d.month),
  })) || [];

  const quotesByMonthData = metrics?.quotesByMonth.map((d) => ({
    ...d,
    monthLabel: formatMonth(d.month),
  })) || [];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard BI</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral de métricas e performance
          </p>
        </div>

        {/* Main KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Clientes"
            value={metrics?.totalClients}
            icon={Users}
            isLoading={isLoading}
            onClick={() => navigate("/clientes")}
          />
          <MetricCard
            title="Negócios"
            value={metrics?.totalDeals}
            icon={Briefcase}
            subtitle={metrics ? formatCurrency(metrics.totalDealsValue) : undefined}
            isLoading={isLoading}
          />
          <MetricCard
            title="Cotações"
            value={metrics?.totalQuotes}
            icon={FileText}
            isLoading={isLoading}
          />
          <MetricCard
            title="Mockups Gerados"
            value={metrics?.totalMockups}
            icon={Wand2}
            isLoading={isLoading}
            onClick={() => navigate("/mockup")}
          />
        </div>

        {/* Secondary KPIs */}
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            title="Simulações"
            value={metrics?.totalSimulations}
            icon={Calculator}
            isLoading={isLoading}
            onClick={() => navigate("/simulador")}
          />
          <MetricCard
            title="Ticket Médio"
            value={
              metrics && metrics.totalDeals > 0
                ? formatCurrency(metrics.totalDealsValue / metrics.totalDeals)
                : "R$ 0"
            }
            icon={DollarSign}
            isLoading={isLoading}
            isText
          />
          <MetricCard
            title="Taxa de Conversão"
            value={
              metrics && metrics.totalQuotes > 0
                ? `${Math.round(
                    ((metrics.quotesByStatus.approved || 0) / metrics.totalQuotes) * 100
                  )}%`
                : "0%"
            }
            icon={TrendingUp}
            isLoading={isLoading}
            isText
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Deals by Month */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Negócios por Mês</CardTitle>
              <CardDescription>Evolução dos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[250px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dealsByMonthData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="monthLabel" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(v) => formatCurrency(v)} />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), "Valor"]}
                      labelFormatter={(label) => `Mês: ${label}`}
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Quotes by Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cotações por Status</CardTitle>
              <CardDescription>Distribuição atual</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[250px] w-full" />
              ) : quoteStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={quoteStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {quoteStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => [value, name]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  Nenhuma cotação registrada
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quotes Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Evolução de Cotações</CardTitle>
            <CardDescription>Quantidade e valor total por mês</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={quotesByMonthData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="monthLabel" className="text-xs" />
                  <YAxis yAxisId="left" className="text-xs" />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    className="text-xs"
                    tickFormatter={(v) => formatCurrency(v)}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      name === "total" ? formatCurrency(value) : value,
                      name === "total" ? "Valor Total" : "Quantidade",
                    ]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend formatter={(value) => (value === "total" ? "Valor Total" : "Quantidade")} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="total"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--chart-2))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Bottom Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Clients by Ramo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Clientes por Ramo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : metrics?.clientsByRamo.length ? (
                <div className="space-y-3">
                  {metrics.clientsByRamo.map((item, index) => (
                    <div key={item.ramo} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm truncate max-w-[150px]">{item.ramo}</span>
                      </div>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Nenhum dado disponível</p>
              )}
            </CardContent>
          </Card>

          {/* Top Clients */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Top Clientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : metrics?.topClients.length ? (
                <div className="space-y-3">
                  {metrics.topClients.map((client, index) => (
                    <div
                      key={client.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/cliente/${client.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-muted-foreground">
                          #{index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-sm truncate max-w-[120px]">
                            {client.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {client.deals_count} negócios
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm text-primary">
                          {formatCurrency(client.total_spent || 0)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Nenhum cliente encontrado</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Deals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Negócios Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : metrics?.recentDeals.length ? (
                <div className="space-y-3">
                  {metrics.recentDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{deal.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {deal.created_at_bitrix
                            ? format(parseISO(deal.created_at_bitrix), "dd/MM/yyyy", {
                                locale: ptBR,
                              })
                            : "-"}
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <span className="font-semibold text-sm">
                          {formatCurrency(deal.value || 0)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {deal.stage || "N/A"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Nenhum negócio recente</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

interface MetricCardProps {
  title: string;
  value: number | string | undefined;
  icon: React.ComponentType<{ className?: string }>;
  subtitle?: string;
  isLoading?: boolean;
  onClick?: () => void;
  isText?: boolean;
}

function MetricCard({
  title,
  value,
  icon: Icon,
  subtitle,
  isLoading,
  onClick,
  isText,
}: MetricCardProps) {
  return (
    <Card
      className={onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-2xl font-bold">
                {isText ? value : value?.toLocaleString("pt-BR")}
              </p>
            )}
            {subtitle && !isLoading && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
        {onClick && (
          <div className="mt-3 flex items-center text-xs text-primary">
            <span>Ver detalhes</span>
            <ArrowUpRight className="h-3 w-3 ml-1" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
