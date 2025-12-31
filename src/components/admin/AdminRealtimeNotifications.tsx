import { usePasswordResetRealtimeNotifications } from '@/hooks/usePasswordResetRealtimeNotifications';

/**
 * Componente invisível que escuta notificações em tempo real
 * para administradores sobre novas solicitações de reset de senha
 */
export function AdminRealtimeNotifications() {
  usePasswordResetRealtimeNotifications();
  return null;
}
