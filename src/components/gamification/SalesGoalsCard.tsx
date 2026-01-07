import { useSalesGoals, SalesGoal } from "@/hooks/useSalesGoals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, CheckCircle2, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface SalesGoalsCardProps {
  userId: string;
}

export function SalesGoalsCard({ userId }: SalesGoalsCardProps) {
  const { activeGoals, achievedGoals, isLoading } = useSalesGoals(userId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (<Skeleton key={i} className="h-24 w-full" />))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Metas de Vendas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeGoals.length === 0 && achievedGoals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nenhuma meta definida</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeGoals.map((goal) => (
              <GoalItem key={goal.id} goal={goal} />
            ))}
            {achievedGoals.length > 0 && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Metas alcançadas ({achievedGoals.length})
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function GoalItem({ goal }: { goal: SalesGoal }) {
  const valueProgress = goal.target_value > 0 ? (goal.current_value / goal.target_value) * 100 : 0;
  const daysRemaining = Math.ceil((new Date(goal.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="p-4 rounded-lg border bg-card">
      <div className="flex items-center justify-between mb-3">
        <Badge variant="secondary">{goal.goal_type}</Badge>
        {daysRemaining <= 7 && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />{daysRemaining} dias
          </Badge>
        )}
        <span className="text-lg font-bold">{valueProgress.toFixed(0)}%</span>
      </div>
      <Progress value={valueProgress} className="h-2 mb-3" />
      <div className="text-sm">
        <span className="text-muted-foreground">Valor: </span>
        <span className="font-medium">{formatCurrency(goal.current_value)} / {formatCurrency(goal.target_value)}</span>
      </div>
    </div>
  );
}
