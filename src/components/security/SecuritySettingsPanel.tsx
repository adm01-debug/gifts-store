import { useSecuritySettings, useAllowedIPs, useAllowedCountries } from "@/hooks/useSecuritySettings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings, Globe, Shield, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface SecuritySettingsPanelProps {
  userId: string;
}

export function SecuritySettingsPanel({ userId }: SecuritySettingsPanelProps) {
  const { settings, getSetting, isLoading, updateSetting } = useSecuritySettings();
  const { allowedIPs, addIP, removeIP } = useAllowedIPs(userId);
  const { countries, toggleCountry } = useAllowedCountries();
  const [newIP, setNewIP] = useState({ ip: "", label: "" });

  const handleAddIP = () => {
    if (newIP.ip) {
      addIP.mutate({ user_id: userId, ip_address: newIP.ip, label: newIP.label, created_by: userId });
      setNewIP({ ip: "", label: "" });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full" />)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Configurações Gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações de Segurança
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.map((setting) => (
            <div key={setting.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">{setting.setting_key}</p>
                {setting.description && (
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                )}
              </div>
              <Badge variant="outline">{JSON.stringify(setting.setting_value)}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* IPs Permitidos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            IPs Permitidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input placeholder="Endereço IP" value={newIP.ip} onChange={(e) => setNewIP({ ...newIP, ip: e.target.value })} />
            <Input placeholder="Rótulo (opcional)" value={newIP.label} onChange={(e) => setNewIP({ ...newIP, label: e.target.value })} />
            <Button onClick={handleAddIP}><Plus className="h-4 w-4" /></Button>
          </div>
          <div className="space-y-2">
            {allowedIPs.map((ip) => (
              <div key={ip.id} className="flex items-center justify-between p-2 rounded-lg bg-muted">
                <div>
                  <span className="font-mono">{ip.ip_address}</span>
                  {ip.label && <Badge variant="outline" className="ml-2">{ip.label}</Badge>}
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeIP.mutate(ip.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Países Permitidos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Países Permitidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {countries.map((country) => (
              <div key={country.id} className="flex items-center justify-between p-2 rounded-lg border">
                <span className="text-sm">{country.country_name}</span>
                <Switch
                  checked={country.is_active}
                  onCheckedChange={(checked) => toggleCountry.mutate({ id: country.id, active: checked })}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
