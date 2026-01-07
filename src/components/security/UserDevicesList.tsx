import { useUserDevices, UserDevice } from "@/hooks/useUserDevices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Monitor, Smartphone, Tablet, Globe, Shield, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface UserDevicesListProps {
  userId: string;
}

export function UserDevicesList({ userId }: UserDevicesListProps) {
  const { devices, isLoading, trustDevice, removeDevice } = useUserDevices(userId);

  const getDeviceIcon = (type: string | null) => {
    switch (type?.toLowerCase()) {
      case "mobile": return <Smartphone className="h-5 w-5" />;
      case "tablet": return <Tablet className="h-5 w-5" />;
      default: return <Monitor className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Dispositivos Conhecidos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {devices.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Nenhum dispositivo registrado</p>
        ) : (
          <div className="space-y-3">
            {devices.map((device) => (
              <div key={device.id} className={`p-4 rounded-lg border ${
                device.is_trusted ? "bg-green-50 border-green-200" : "bg-card"
              }`}>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    {getDeviceIcon(device.device_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {device.browser_name || "Navegador"} - {device.os_name || "SO"}
                      </span>
                      {device.is_trusted && (
                        <Badge variant="outline" className="text-green-600">
                          <Shield className="h-3 w-3 mr-1" />
                          Confiável
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {device.ip_address}
                      </span>
                      {device.location && <span>{device.location}</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Último acesso: {formatDistanceToNow(new Date(device.last_seen_at), { addSuffix: true, locale: ptBR })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Confiável</span>
                      <Switch
                        checked={device.is_trusted}
                        onCheckedChange={(checked) => trustDevice.mutate({ deviceId: device.id, trust: checked })}
                      />
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeDevice.mutate(device.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
