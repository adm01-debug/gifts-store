/**
 * SellerLeaderboard - DESABILITADO
 *
 * Este componente está temporariamente desabilitado.
 * A tabela seller_gamification não existe no banco de dados atual.
 *
 * Para reativar, crie as tabelas necessárias no Supabase.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface SellerLeaderboardProps {
  limit?: number;
  showHeader?: boolean;
  compact?: boolean;
  className?: string;
}

export function SellerLeaderboard({
  showHeader = true,
  className
}: SellerLeaderboardProps) {
  return (
    <Card className={cn("", className)}>
      {showHeader && (
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Ranking de Vendedores
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Módulo Desabilitado</AlertTitle>
          <AlertDescription>
            O ranking de vendedores está temporariamente indisponível.
            As tabelas de gamificação não estão configuradas no banco de dados.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
