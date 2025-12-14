import { useMemo } from "react";
import {
  Package,
  Users,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Star,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { PRODUCTS, CLIENTS, CATEGORIES, SUPPLIERS } from "@/data/mockData";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// Generate mock sales data
const generateSalesData = () => {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  return months.map((month, index) => ({
    month,
    vendas: Math.floor(Math.random() * 50000) + 20000,
    pedidos: Math.floor(Math.random() * 150) + 50,
    meta: 45000,
  }));
};

const generateCategoryData = () => {
  return CATEGORIES.slice(0, 6).map((category) => ({
    name: category.name.split(" ")[0],
    value: Math.floor(Math.random() * 100) + 20,
    fill: `hsl(${Math.random() * 360}, 70%, 55%)`,
  }));
};

const generateTopProducts = () => {
  return PRODUCTS.slice(0, 5).map((product) => ({
    name: product.name.length > 25 ? product.name.substring(0, 25) + "..." : product.name,
    vendas: Math.floor(Math.random() * 500) + 100,
    receita: Math.floor(Math.random() * 25000) + 5000,
  }));
};

const generateRecentOrders = () => {
  const statuses = ["Concluído", "Pendente", "Enviado"];
  return Array.from({ length: 5 }, (_, i) => ({
    id: `#${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`,
    cliente: CLIENTS[i % CLIENTS.length]?.name || "Cliente",
    valor: Math.floor(Math.random() * 5000) + 500,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    data: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR"),
  }));
};

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--success))",
  "hsl(var(--warning))",
  "hsl(var(--info))",
  "hsl(var(--destructive))",
  "hsl(252, 70%, 70%)",
];

export default function Dashboard() {
  const salesData = useMemo(() => generateSalesData(), []);
  const categoryData = useMemo(() => generateCategoryData(), []);
  const topProducts = useMemo(() => generateTopProducts(), []);
  const recentOrders = useMemo(() => generateRecentOrders(), []);

  // Calculate totals
  const totalProducts = PRODUCTS.length;
  const totalClients = CLIENTS.length;
  const totalCategories = CATEGORIES.length;
  const totalSuppliers = SUPPLIERS.length;

  const totalRevenue = salesData.reduce((acc, curr) => acc + curr.vendas, 0);
  const totalOrders = salesData.reduce((acc, curr) => acc + curr.pedidos, 0);
  const avgOrderValue = Math.round(totalRevenue / totalOrders);

  return (
    <MainLayout>
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Visão geral das métricas e desempenho de vendas
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Receita Total"
          value={`R$ ${(totalRevenue / 1000).toFixed(0)}K`}
          description="Últimos 12 meses"
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
          variant="primary"
        />
        <StatsCard
          title="Total de Pedidos"
          value={totalOrders}
          description="Últimos 12 meses"
          icon={ShoppingCart}
          trend={{ value: 8.2, isPositive: true }}
          variant="success"
        />
        <StatsCard
          title="Ticket Médio"
          value={`R$ ${avgOrderValue}`}
          description="Por pedido"
          icon={TrendingUp}
          trend={{ value: 3.1, isPositive: true }}
        />
        <StatsCard
          title="Clientes Ativos"
          value={totalClients}
          description={`${totalCategories} categorias`}
          icon={Users}
          trend={{ value: 5.4, isPositive: true }}
          variant="warning"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 card-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Receita Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                vendas: { label: "Vendas", color: "hsl(var(--primary))" },
                meta: { label: "Meta", color: "hsl(var(--muted-foreground))" },
              }}
              className="h-[280px] w-full"
            >
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={{ stroke: "hsl(var(--border))" }}
                />
                <Line
                  type="monotone"
                  dataKey="meta"
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="vendas"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#colorVendas)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="card-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: { label: "Vendas" },
              }}
              className="h-[280px] w-full"
            >
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {categoryData.slice(0, 4).map((item, index) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: CHART_COLORS[index] }}
                  />
                  <span className="text-muted-foreground truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="card-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Star className="h-5 w-5 text-warning" />
              Produtos Mais Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                vendas: { label: "Vendas", color: "hsl(var(--primary))" },
              }}
              className="h-[280px] w-full"
            >
              <BarChart data={topProducts} layout="vertical">
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  width={100}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="vendas"
                  fill="hsl(var(--primary))"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Orders Trend */}
        <Card className="card-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-success" />
              Tendência de Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                pedidos: { label: "Pedidos", color: "hsl(var(--success))" },
              }}
              className="h-[280px] w-full"
            >
              <LineChart data={salesData}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="pedidos"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--success))", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: "hsl(var(--success))" }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 card-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Calendar className="h-5 w-5 text-info" />
              Pedidos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm font-medium text-foreground">
                      {order.id}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {order.cliente}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-foreground">
                      R$ {order.valor.toLocaleString("pt-BR")}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "Concluído"
                          ? "bg-success/10 text-success"
                          : order.status === "Pendente"
                          ? "bg-warning/10 text-warning"
                          : "bg-info/10 text-info"
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {order.data}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="card-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-display">Resumo Rápido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-primary" />
                <span className="text-sm">Produtos</span>
              </div>
              <span className="font-display font-bold text-foreground">
                {totalProducts}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-success/5">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-success" />
                <span className="text-sm">Clientes</span>
              </div>
              <span className="font-display font-bold text-foreground">
                {totalClients}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-warning/5">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-warning" />
                <span className="text-sm">Categorias</span>
              </div>
              <span className="font-display font-bold text-foreground">
                {totalCategories}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-info/5">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-info" />
                <span className="text-sm">Fornecedores</span>
              </div>
              <span className="font-display font-bold text-foreground">
                {totalSuppliers}
              </span>
            </div>

            {/* Performance Indicators */}
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3">Indicadores</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Taxa de conversão</span>
                  <div className="flex items-center gap-1 text-success">
                    <ArrowUpRight className="h-3 w-3" />
                    <span className="text-sm font-medium">4.2%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Satisfação</span>
                  <div className="flex items-center gap-1 text-success">
                    <ArrowUpRight className="h-3 w-3" />
                    <span className="text-sm font-medium">94%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Devolução</span>
                  <div className="flex items-center gap-1 text-destructive">
                    <ArrowDownRight className="h-3 w-3" />
                    <span className="text-sm font-medium">1.8%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </MainLayout>
  );
}
