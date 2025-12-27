// src/lib/sw-register.ts

/**
 * Registra Service Worker para PWA
 * 
 * Deve ser chamado no main.tsx após setupLocale()
 */
export async function registerServiceWorker(): Promise<void> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('✅ Service Worker registrado:', registration.scope);

      // Checar atualizações
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🔄 Nova versão do Service Worker disponível');
              
              // Opcional: mostrar notificação ao usuário para recarregar
              if (confirm('Nova versão disponível! Deseja atualizar?')) {
                window.location.reload();
              }
            }
          });
        }
      });

      // Recarregar quando novo SW assumir o controle
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });

    } catch (error) {
      console.error('❌ Falha ao registrar Service Worker:', error);
    }
  } else {
    console.warn('⚠️ Service Workers não suportados neste navegador');
  }
}

/**
 * Desregistra Service Worker (útil para debug)
 */
export async function unregisterServiceWorker(): Promise<void> {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
      console.log('🗑️ Service Worker desregistrado');
    }
  }
}

/**
 * Verifica se app está instalado como PWA
 */
export function isPWA(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
}

/**
 * Solicita permissão para notificações (para futura implementação)
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('⚠️ Notificações não suportadas');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
}
