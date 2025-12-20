import { useState } from "react";
import { useRFMAnalysis, SEGMENT_INFO, RFMSegment, RFMScore } from "@/hooks/useRFMAnalysis";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { 
  Users, 
  Crown, 
  Heart, 
  Star, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  AlertCircle,
  Moon,
  UserX,
  ChevronRight,
  Calendar,
  ShoppingCart,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const SEGMENT_ICONS: Record<RFMSegment, React.ReactNode> = {
  champions: <Crown className="h-4 w-4" />,
  loyal: <Heart className="h-4 w-4" />,
  potential_loyal: <Star className="h-4 w-4" />,
  new: <Sparkles className="h-4 w-4" />,
  promising: <TrendingUp className="h-4 w-4" />,
  needs_attention: <AlertTriangle className="h-4 w-4" />,
  about_to_sleep: <Clock className="h-4 w-4" />,
  at_risk: <AlertCircle className="h-4 w-4" />,
  hibernating: <Moon className="h-4 w-4" />,
  lost: <UserX className="h-4 w-4" />,
};

const CHART_COLORS: Record<RFMSegment, string> = {
  champions: "#10b981",
  loyal: "#3b82f6",
  potential_loyal: "#06b6d4",
  new: "#8b5cf6",
  promising: "#818cf8",
  needs_attention: "#f59e0b",
  about_to_sleep: "#f97316",
  at_risk: "#f87171",
  hibernating: "#9ca3af",
  lost: "#4b5563",
};

interface ClientRFMSegmentationProps {
  showDetails?: boolean;
  compact?: boolean;
}

export function ClientRFMSegmentation({ showDetails = true, compact = false }: ClientRFMSegmentationProps) {
  const navigate = useNavigate();
  const { rfmScores, segmentDistribution, averages, isLoading, totalClients, getClientsBySegment } = useRFMAnalysis();
  const [selectedSegment, setSelectedSegment] = useState<RFMSegment | null>(null);

  const pieData = Object.entries(segmentDistribution)
    .filter(([_, count]) => count > 0)
    .map(([segment, count]) => ({
      name: SEGMENT_INFO[segment as RFMSegment].label,
      value: count,
      segment: segment as RFMSegment,
    }));

  const radarData = [
    { subject: "Recência", value: averages.recency, fullMark: 5 },
    { subject: "Frequência", value: averages.frequency, fullMark: 5 },
    { subject: "Valor", value: averages.monetary, fullMark: 5 },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  const selectedClients = selectedSegment ? getClientsBySegment(selectedSegment) : [];

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Clientes</p>
                <p className="text-2xl font-bold">{totalClients}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Crown className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Campeões</p>
                <p className="text-2xl font-bold">{segmentDistribution.champions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Em Risco</p>
                <p className="text-2xl font-bold">{segmentDistribution.at_risk + segmentDistribution.about_to_sleep}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-500/10">
                <Sparkles className="h-5 w-5 text-violet-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Novos</p>
                <p className="text-2xl font-bold">{segmentDistribution.new}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribuição de Segmentos</CardTitle>
            <CardDescription>Clientes por segmento RFM</CardDescription>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    onClick={(data) => setSelectedSegment(data.segment)}
                    style={{ cursor: "pointer" }}
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={CHART_COLORS[entry.segment]}
                        stroke={selectedSegment === entry.segment ? "hsl(var(--primary))" : "transparent"}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `${value} clientes (${((value / totalClients) * 100).toFixed(1)}%)`,
                      name,
                    ]}
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
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>

        {/* Radar Chart - Average Scores */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Média RFM</CardTitle>
            <CardDescription>Scores médios de todos os clientes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="subject" className="text-xs" />
                <PolarRadiusAxis angle={30} domain={[0, 5]} />
                <Radar
                  name="Média"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                />
                <Tooltip
                  formatter={(value: number) => [value.toFixed(2), "Score"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Segment Cards */}
      {showDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Segmentos RFM</CardTitle>
            <CardDescription>Clique em um segmento para ver os clientes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {(Object.entries(SEGMENT_INFO) as [RFMSegment, typeof SEGMENT_INFO[RFMSegment]][]).map(
                ([segment, info]) => {
                  const count = segmentDistribution[segment];
                  const isSelected = selectedSegment === segment;

                  return (
                    <button
                      key={segment}
                      onClick={() => setSelectedSegment(isSelected ? null : segment)}
                      className={cn(
                        "p-3 rounded-lg border text-left transition-all hover:shadow-md",
                        isSelected 
                          ? "ring-2 ring-primary border-primary" 
                          : "hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn("p-1.5 rounded", info.color, "text-white")}>
                          {SEGMENT_ICONS[segment]}
                        </div>
                        <span className="font-medium text-sm">{info.label}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{count}</span>
                        <span className="text-xs text-muted-foreground">
                          {totalClients > 0 ? ((count / totalClients) * 100).toFixed(0) : 0}%
                        </span>
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Segment Details */}
      {selectedSegment && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg text-white", SEGMENT_INFO[selectedSegment].color)}>
                  {SEGMENT_ICONS[selectedSegment]}
                </div>
                <div>
                  <CardTitle className="text-lg">{SEGMENT_INFO[selectedSegment].label}</CardTitle>
                  <CardDescription>{SEGMENT_INFO[selectedSegment].description}</CardDescription>
                </div>
              </div>
              <Badge variant="outline">{selectedClients.length} clientes</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Action Recommendation */}
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm font-medium text-primary mb-1">Ação Recomendada:</p>
              <p className="text-sm text-muted-foreground">{SEGMENT_INFO[selectedSegment].action}</p>
            </div>

            {/* Client List */}
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {selectedClients.slice(0, 20).map((client) => (
                  <div
                    key={client.clientId}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{client.clientName}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {client.daysSinceLastPurchase}d atrás
                        </span>
                        <span className="flex items-center gap-1">
                          <ShoppingCart className="h-3 w-3" />
                          {client.totalOrders} pedidos
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {formatCurrency(client.totalSpent)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="flex gap-1">
                          <Badge variant="outline" className="text-xs">
                            R{client.recency}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            F{client.frequency}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            M{client.monetary}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/clientes/${client.clientId}`)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {selectedClients.length > 20 && (
                  <p className="text-center text-sm text-muted-foreground py-2">
                    E mais {selectedClients.length - 20} clientes...
                  </p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
