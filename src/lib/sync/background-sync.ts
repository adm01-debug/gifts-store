export interface SyncData {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  timestamp: number;
}

declare global {
  interface ServiceWorkerRegistration {
    sync?: {
      register(tag: string): Promise<void>;
    };
  }
}

export class BackgroundSync {
  async register(tag: string, data: SyncData): Promise<void> {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const registration = await navigator.serviceWorker.ready;
      if ('sync' in registration && registration.sync) {
        await registration.sync.register(tag);
        localStorage.setItem(`sync_${tag}`, JSON.stringify(data));
      }
    }
  }

  async getPendingSync(tag: string): Promise<SyncData | null> {
    const stored = localStorage.getItem(`sync_${tag}`);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as SyncData;
    } catch {
      return null;
    }
  }

  async clearSync(tag: string): Promise<void> {
    localStorage.removeItem(`sync_${tag}`);
  }
}

export const backgroundSync = new BackgroundSync();
