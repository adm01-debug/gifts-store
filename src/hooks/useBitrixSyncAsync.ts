// src/hooks/useBitrixSyncAsync.ts

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SyncJob {
  id: string;
  status: string;
  progress: number;
  total: number;
  error?: string;
}

export function useBitrixSyncAsync() {
  const [isLoading, setIsLoading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const startSync = async () => {
    setIsLoading(true);

    try {
      // Use the existing bitrix_sync_logs table instead of sync_jobs
      const { data: user } = await supabase.auth.getUser();
      
      const { data: job, error } = await supabase
        /* DISABLED: bitrix_sync_logs */ .from('profiles')
        .insert({
          status: 'pending',
          synced_by: user.user?.id,
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setJobId(job.id);
      
      const { error: fnError } = await supabase.functions.invoke('bitrix-sync', {
        body: { jobId: job.id }
      });

      if (fnError) throw fnError;

      toast({
        title: '🔄 Sincronização iniciada!',
        description: 'Você será notificado quando concluir'
      });

      subscribeToProgress(job.id);

    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro',
        description: 'Falha ao iniciar sincronização',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToProgress = (id: string) => {
    const channel = supabase
      .channel(`job:${id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'bitrix_sync_logs',
        filter: `id=eq.${id}`
      }, (payload) => {
        const job = payload.new as SyncJob;
        if (job.total > 0) {
          setProgress((job.progress / job.total) * 100);
        }
        
        if (job.status === 'completed') {
          toast({
            title: '✅ Sincronização concluída!',
            description: `${job.progress} registros processados`
          });
          channel.unsubscribe();
        } else if (job.status === 'failed') {
          toast({
            title: '❌ Falha na sincronização',
            description: job.error || 'Erro desconhecido',
            variant: 'destructive'
          });
          channel.unsubscribe();
        }
      })
      .subscribe();
  };

  return { startSync, isLoading, jobId, progress };
}
