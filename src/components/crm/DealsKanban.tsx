import { useBitrixDeals, BitrixDeal } from "@/hooks/useBitrixDeals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { Building2, Calendar, DollarSign } from "lucide-react";

const STAGES = [
  { id: "NEW", label: "Novo", color: "bg-blue-500" },
  { id: "PREPARATION", label: "Em Preparação", color: "bg-yellow-500" },
  { id: "NEGOTIATION", label: "Negociação", color: "bg-orange-500" },
  { id: "WON", label: "Ganho", color: "bg-green-500" },
  { id: "LOST", label: "Perdido", color: "bg-red-500" },
];

interface DealsKanbanProps {
  clientId?: string;
}

export function DealsKanban({ clientId }: DealsKanbanProps) {
  const { deals, isLoading } = useBitrixDeals(clientId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-5 gap-4">
        {STAGES.map((stage) => (
          <div key={stage.id} className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ))}
      </div>
    );
  }

  const dealsByStage = STAGES.reduce((acc, stage) => {
    acc[stage.id] = deals.filter((d) => d.stage === stage.id);
    return acc;
  }, {} as Record<string, BitrixDeal[]>);

  return (
    <div className="grid grid-cols-5 gap-4 overflow-x-auto">
      {STAGES.map((stage) => (
        <div key={stage.id} className="min-w-[250px]">
          <div className={`${stage.color} text-white px-3 py-2 rounded-t-lg font-medium flex justify-between items-center`}>
            <span>{stage.label}</span>
            <Badge variant="secondary" className="bg-white/20">
              {dealsByStage[stage.id]?.length || 0}
            </Badge>
          </div>
          <div className="bg-muted/50 rounded-b-lg p-2 min-h-[400px] space-y-2">
            {dealsByStage[stage.id]?.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
            {dealsByStage[stage.id]?.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum negócio
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function DealCard({ deal }: { deal: BitrixDeal }) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-sm font-medium line-clamp-2">
          {deal.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-1 space-y-1">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <DollarSign className="h-3 w-3" />
          <span>{formatCurrency(deal.value)} {deal.currency}</span>
        </div>
        {deal.close_date && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{new Date(deal.close_date).toLocaleDateString("pt-BR")}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
