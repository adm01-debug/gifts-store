import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function NotificationPreferences() {
  const queryClient = useQueryClient();

  const { data: prefs, isLoading } = useQuery({
    queryKey: ['notification-preferences'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('notifications')
        .upsert({
          user_id: user?.id,
          ...updates,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] });
      toast.success('Preferências salvas!');
    },
  });

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Canais de Notificação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email">E-mail</Label>
            <Switch
              id="email"
              checked={prefs?.email_enabled ?? true}
              onCheckedChange={(checked) =>
                updateMutation.mutate({ email_enabled: checked })
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="push">Push Notifications</Label>
            <Switch
              id="push"
              checked={prefs?.push_enabled ?? true}
              onCheckedChange={(checked) =>
                updateMutation.mutate({ push_enabled: checked })
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="sms">SMS</Label>
            <Switch
              id="sms"
              checked={prefs?.sms_enabled ?? false}
              onCheckedChange={(checked) =>
                updateMutation.mutate({ sms_enabled: checked })
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Switch
              id="whatsapp"
              checked={prefs?.whatsapp_enabled ?? false}
              onCheckedChange={(checked) =>
                updateMutation.mutate({ whatsapp_enabled: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Não Perturbe (DND)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="dnd">Ativar DND</Label>
            <Switch
              id="dnd"
              checked={prefs?.dnd_enabled ?? false}
              onCheckedChange={(checked) =>
                updateMutation.mutate({ dnd_enabled: checked })
              }
            />
          </div>
          
          {prefs?.dnd_enabled && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="dnd-start">Início</Label>
                  <Input
                    id="dnd-start"
                    type="time"
                    value={prefs?.dnd_start_time || '22:00'}
                    onChange={(e) =>
                      updateMutation.mutate({ dnd_start_time: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="dnd-end">Fim</Label>
                  <Input
                    id="dnd-end"
                    type="time"
                    value={prefs?.dnd_end_time || '08:00'}
                    onChange={(e) =>
                      updateMutation.mutate({ dnd_end_time: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumo Diário (Digest)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="digest">Ativar Digest</Label>
            <Switch
              id="digest"
              checked={prefs?.digest_enabled ?? false}
              onCheckedChange={(checked) =>
                updateMutation.mutate({ digest_enabled: checked })
              }
            />
          </div>
          
          {prefs?.digest_enabled && (
            <div>
              <Label htmlFor="digest-time">Horário</Label>
              <Input
                id="digest-time"
                type="time"
                value={prefs?.digest_time || '09:00'}
                onChange={(e) =>
                  updateMutation.mutate({ digest_time: e.target.value })
                }
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contatos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="phone">Telefone (SMS)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+55 11 99999-9999"
              value={prefs?.phone_number || ''}
              onChange={(e) =>
                updateMutation.mutate({ phone_number: e.target.value })
              }
            />
          </div>
          
          <div>
            <Label htmlFor="whatsapp-number">WhatsApp</Label>
            <Input
              id="whatsapp-number"
              type="tel"
              placeholder="+55 11 99999-9999"
              value={prefs?.whatsapp_number || ''}
              onChange={(e) =>
                updateMutation.mutate({ whatsapp_number: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
