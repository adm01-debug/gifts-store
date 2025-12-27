// src/hooks/usePushNotifications.ts

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const VAPID_PUBLIC_KEY = 'YOUR_VAPID_PUBLIC_KEY'; // TODO: Gerar no console

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsSupported(
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    );
  }, []);

  const subscribe = async () => {
    if (!isSupported) {
      toast({
        title: 'Não suportado',
        description: 'Seu navegador não suporta notificações push',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Solicitar permissão
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        toast({
          title: 'Permissão negada',
          description: 'Você precisa permitir notificações',
          variant: 'destructive'
        });
        return;
      }

      // 2. Registrar service worker
      const registration = await navigator.serviceWorker.ready;

      // 3. Subscribe ao push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });

      // 4. Salvar no banco
      const subscriptionData = subscription.toJSON();
      
      const { data: user } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: user.user?.id,
          endpoint: subscriptionData.endpoint!,
          p256dh: subscriptionData.keys!.p256dh,
          auth: subscriptionData.keys!.auth,
          user_agent: navigator.userAgent,
          is_active: true
        }, {
          onConflict: 'endpoint'
        });

      if (error) throw error;

      setIsSubscribed(true);
      toast({
        title: '✅ Notificações ativadas!',
        description: 'Você receberá alertas importantes'
      });

    } catch (error) {
      console.error('Erro ao subscribir:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível ativar notificações',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribe = async () => {
    setIsLoading(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();

        // Desativar no banco
        const subscriptionData = subscription.toJSON();
        await supabase
          .from('push_subscriptions')
          .update({ is_active: false })
          .eq('endpoint', subscriptionData.endpoint!);
      }

      setIsSubscribed(false);
      toast({
        title: 'Notificações desativadas',
        description: 'Você não receberá mais alertas'
      });

    } catch (error) {
      console.error('Erro ao unsubscribe:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(subscription !== null);
    } catch (error) {
      console.error('Erro ao verificar subscription:', error);
    }
  };

  useEffect(() => {
    if (isSupported) {
      checkSubscription();
    }
  }, [isSupported]);

  return {
    isSupported,
    isSubscribed,
    isLoading,
    subscribe,
    unsubscribe
  };
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
