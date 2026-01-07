/**
 * ProductGroupsManager - DESABILITADO
 *
 * Este componente está temporariamente desabilitado.
 * As tabelas product_groups e product_group_members não existem no banco de dados atual.
 *
 * Para reativar, crie as tabelas necessárias no Supabase.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ProductGroupsManager() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Grupos de Produtos
        </CardTitle>
        <CardDescription>
          Crie grupos para aplicar regras de personalização em lote
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Módulo Desabilitado</AlertTitle>
          <AlertDescription>
            O recurso de grupos de produtos está temporariamente indisponível.
            As tabelas necessárias não estão configuradas no banco de dados.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
