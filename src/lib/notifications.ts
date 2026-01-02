import { supabase } from '@/integrations/supabase/client';

export interface SendNotificationParams {
  userId: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error' | 'urgent';
  category?: 'approval' | 'alert' | 'reminder' | 'system' | 'social';
  sourceSystem: string;
  sourceEntityType?: string;
  sourceEntityId?: string;
  channels?: ('in_app' | 'email' | 'push' | 'sms' | 'whatsapp')[];
  priority?: 0 | 1 | 2 | 3;
  actionUrl?: string;
  actionLabel?: string;
  actionData?: any;
  scheduledFor?: string;
}

export async function sendNotification(params: SendNotificationParams) {
  const { data, error } = await supabase.functions.invoke('send-notification', {
    body: {
      user_id: params.userId,
      title: params.title,
      message: params.message,
      type: params.type || 'info',
      category: params.category || 'system',
      source_system: params.sourceSystem,
      source_entity_type: params.sourceEntityType,
      source_entity_id: params.sourceEntityId,
      channels: params.channels || ['in_app'],
      priority: params.priority ?? 0,
      action_url: params.actionUrl,
      action_label: params.actionLabel,
      action_data: params.actionData,
      scheduled_for: params.scheduledFor,
    },
  });

  if (error) throw error;
  return data;
}

export const NotificationHelpers = {
  approval: (userId: string, entityName: string, actionUrl: string) =>
    sendNotification({
      userId,
      title: 'Nova Aprovação Pendente',
      message: `Você tem uma nova solicitação de aprovação: ${entityName}`,
      type: 'urgent',
      category: 'approval',
      sourceSystem: 'compras',
      channels: ['in_app', 'email', 'push'],
      priority: 3,
      actionUrl,
      actionLabel: 'Aprovar/Rejeitar',
    }),

  reminder: (userId: string, message: string) =>
    sendNotification({
      userId,
      title: 'Lembrete',
      message,
      type: 'info',
      category: 'reminder',
      sourceSystem: 'system',
      channels: ['in_app', 'email'],
      priority: 1,
    }),

  alert: (userId: string, title: string, message: string) =>
    sendNotification({
      userId,
      title,
      message,
      type: 'warning',
      category: 'alert',
      sourceSystem: 'system',
      channels: ['in_app', 'push', 'sms'],
      priority: 2,
    }),

  financialApproval: (userId: string, amount: number, lancamentoId: string) =>
    sendNotification({
      userId,
      title: 'Aprovação Urgente - Lançamento Financeiro',
      message: `Lançamento aguarda aprovação. Valor: R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      type: 'urgent',
      category: 'approval',
      sourceSystem: 'finance',
      sourceEntityType: 'lancamento',
      sourceEntityId: lancamentoId,
      channels: ['in_app', 'email', 'push', 'sms'],
      priority: 3,
      actionUrl: `/finance/lancamentos/${lancamentoId}`,
      actionLabel: 'Aprovar/Rejeitar',
    }),
};
