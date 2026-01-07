/**
 * NotificationPreferences - DESABILITADO
 *
 * Este componente está temporariamente desabilitado.
 * Os campos de preferências (email_enabled, push_enabled, etc)
 * não existem na tabela notifications atual.
 *
 * Para reativar, atualize o schema da tabela notifications no Supabase.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function NotificationPreferences() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Preferências de Notificação
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Em Desenvolvimento</AlertTitle>
          <AlertDescription>
            As preferências de notificação estarão disponíveis em breve.
            Por enquanto, você receberá todas as notificações no sistema.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
