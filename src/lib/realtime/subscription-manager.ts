import { supabase } from '@/integrations/supabase/client';

export class SubscriptionManager {
  subscribe(channel: string, event: string, callback: (payload: any) => void) {
    return supabase.channel(channel)
      .on('postgres_changes', { event, schema: 'public' }, callback)
      .subscribe();
  }
}
