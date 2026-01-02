import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRBAC } from '@/hooks/useRBAC';

interface PasswordResetRequest {
  id: string;
  email: string;
  status: string;
  requested_at: string;
}

export function usePasswordResetRealtimeNotifications() {
  const { toast } = useToast();
  const { isAdmin, isManagerOrAbove } = useRBAC();

  const handleNewRequest = useCallback((payload: { new: PasswordResetRequest }) => {
    const request = payload.new;
    
    toast({
      title: '🔐 Nova Solicitação de Reset',
      description: `${request.email} solicitou reset de senha. Acesse o painel admin para revisar.`,
      duration: 10000,
    });
  }, [toast]);

  useEffect(() => {
    // Só escutar se for admin ou manager
    if (!isAdmin && !isManagerOrAbove) return;

    const channel = supabase
      .channel('password-reset-requests')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'password_reset_requests',
        },
        (payload) => {
          if (import.meta.env.DEV) {
            console.log('Nova solicitação de reset recebida:', payload);
          }
          handleNewRequest(payload as { new: PasswordResetRequest });
        }
      )
      .subscribe((status) => {
        if (import.meta.env.DEV) {
          console.log('Status da inscrição realtime:', status);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, isManagerOrAbove, handleNewRequest]);
}
