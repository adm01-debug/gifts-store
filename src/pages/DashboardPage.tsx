import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  DollarSign,
  Target,
  Calendar,
  Award,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for the dashboard
const salesData = [
  { month: "Jan", vendas: 12500, meta: 15000 },
  { month: "Fev", vendas: 18200, meta: 15000 },
  { month: "Mar", vendas: 14800, meta: 16000 },
  { month: "Abr", vendas: 22100, meta: 18000 },
  { month: "Mai", vendas: 19500, meta: 20000 },
  { month: "Jun", vendas: 25800, meta: 22000 },
];

const categoryData = [
  { name: "Canetas", value: 35, color: "hsl(var(--primary))" },
  { name: "Cadernos", value: 25, color: "hsl(var(--chart-2))" },
  { name: "Garrafas", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Bolsas", value: 12, color: "hsl(var(--chart-4))" },
  { name: "Outros", value: 8, color: "hsl(var(--chart-5))" },
];

const weeklyData = [
  { dia: "Seg", pedidos: 4 },
  { dia: "Ter", pedidos: 7 },
  { dia: "Qua", pedidos: 5 },
  { dia: "Qui", pedidos: 9 },
  { dia: "Sex", pedidos: 12 },
  { dia: "Sáb", pedidos: 3 },
  { dia: "Dom", pedidos: 1 },
];

const recentSales = [
  { client: "Tech Solutions LTDA", value: 4500, date: "Hoje", status: "completed" },
  { client: "Marketing Digital SA", value: 2800, date: "Ontem", status: "pending" },
  { client: "Construtora ABC", value: 6200, date: "2 dias", status: "completed" },
  { client: "Farmácia Popular", value: 1900, date: "3 dias", status: "completed" },
  { client: "Escola Modelo", value: 3400, date: "4 dias", status: "pending" },
];

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  description?: string;
}

function StatCard({ title, value, change, icon, description }: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="p-2 rounded-lg bg-primary/10">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-1 mt-1">
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span className={cn("text-sm", isPositive ? "text-green-500" : "text-red-500")}>
            {isPositive ? "+" : ""}{change}%
          </span>
          <span className="text-xs text-muted-foreground ml-1">vs mês anterior</span>
        </div>
        {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
      </CardContent>
    </Card>
  );
}

interface GoalCardProps {
  title: string;
  current: number;
  target: number;
  unit?: string;
}

function GoalCard({ title, current, target, unit = "" }: GoalCardProps) {
  const progress = Math.min((current / target) * 100, 100);
  const isCompleted = current >= target;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        {isCompleted && (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            <Award className="h-3 w-3 mr-1" />
            Meta Atingida
          </Badge>
        )}
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{unit}{current.toLocaleString("pt-BR")}</span>
        <span>Meta: {unit}{target.toLocaleString("pt-BR")}</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { profile } = useAuth();

  return (
    <MainLayout>
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Olá, {profile?.full_name?.split(" ")[0] || "Vendedor"}! 👋
            </h1>
            <p className="text-muted-foreground">
              Acompanhe sua performance e metas de vendas
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Vendas do Mês"
            value="R$ 25.800"
            change={17.2}
            icon={<DollarSign className="h-4 w-4 text-primary" />}
          />
          <StatCard
            title="Pedidos"
            value="42"
            change={8.5}
            icon={<ShoppingCart className="h-4 w-4 text-primary" />}
          />
          <StatCard
            title="Novos Clientes"
            value="12"
            change={-3.2}
            icon={<Users className="h-4 w-4 text-primary" />}
          />
          <StatCard
            title="Produtos Vendidos"
            value="186"
            change={24.1}
            icon={<Package className="h-4 w-4 text-primary" />}
          />
        </div>

        {/* Goals Section */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle>Metas do Mês</CardTitle>
            </div>
            <CardDescription>Acompanhe o progresso das suas metas mensais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <GoalCard title="Faturamento" current={25800} target={30000} unit="R$ " />
              <GoalCard title="Pedidos" current={42} target={50} />
              <GoalCard title="Novos Clientes" current={12} target={15} />
            </div>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Sales Chart */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Evolução de Vendas</CardTitle>
              <CardDescription>Comparativo entre vendas e metas mensais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, ""]}
                    />
                    <Area
                      type="monotone"
                      dataKey="vendas"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorVendas)"
                      name="Vendas"
                    />
                    <Area
                      type="monotone"
                      dataKey="meta"
                      stroke="hsl(var(--muted-foreground))"
                      strokeDasharray="5 5"
                      fill="none"
                      name="Meta"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Orders */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Pedidos por Dia</CardTitle>
              <CardDescription>Distribuição de pedidos na semana atual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="dia" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="pedidos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Category Distribution */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Categorias Mais Vendidas</CardTitle>
              <CardDescription>Distribuição por categoria de produto</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`${value}%`, ""]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-muted-foreground">{cat.name}</span>
                    <span className="ml-auto font-medium">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Sales */}
          <Card className="border-border/50 lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Vendas Recentes</CardTitle>
                  <CardDescription>Últimos pedidos realizados</CardDescription>
                </div>
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSales.map((sale, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{sale.client}</p>
                        <p className="text-xs text-muted-foreground">{sale.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={sale.status === "completed" ? "default" : "secondary"}
                        className={sale.status === "completed" ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        {sale.status === "completed" ? "Concluído" : "Pendente"}
                      </Badge>
                      <span className="font-bold text-primary">
                        R$ {sale.value.toLocaleString("pt-BR")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
