/**
 * GroupPersonalizationManager - DESABILITADO
 *
 * Este componente está temporariamente desabilitado.
 * As tabelas product_group_components, group_print_locations e group_location_techniques
 * não existem no banco de dados atual.
 *
 * Para reativar, crie as tabelas necessárias no Supabase.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function GroupPersonalizationManager() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Personalização por Grupo
        </CardTitle>
        <CardDescription>
          Gerencie componentes e áreas de personalização por grupo de produtos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Módulo Desabilitado</AlertTitle>
          <AlertDescription>
            O recurso de personalização por grupo está temporariamente indisponível.
            As tabelas necessárias não estão configuradas no banco de dados.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
