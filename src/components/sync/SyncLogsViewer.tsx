import { useBitrixSyncLogs } from "@/hooks/useBitrixSyncLogs";
import { useProductSyncLogs } from "@/hooks/useProductSyncLogs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, CheckCircle2, XCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function SyncLogsViewer() {
  const bitrix = useBitrixSyncLogs();
  const products = useProductSyncLogs();

  const StatusBadge = ({ status }: { status: string }) => {
    const config = { completed: { icon: CheckCircle2, color: "bg-green-500" }, failed: { icon: XCircle, color: "bg-red-500" }, running: { icon: Clock, color: "bg-yellow-500" } };
    const c = config[status as keyof typeof config] || config.running;
    return <Badge className={c.color}><c.icon className="h-3 w-3 mr-1" />{status}</Badge>;
  };

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><RefreshCw className="h-5 w-5" />Logs de Sincronização</CardTitle></CardHeader>
      <CardContent>
        <Tabs defaultValue="bitrix">
          <TabsList><TabsTrigger value="bitrix">Bitrix</TabsTrigger><TabsTrigger value="products">Produtos</TabsTrigger></TabsList>
          <TabsContent value="bitrix" className="space-y-2 mt-4">
            {bitrix.logs.slice(0, 10).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div><p className="font-medium">{log.sync_type}</p><p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(log.started_at), { addSuffix: true, locale: ptBR })}</p></div>
                <div className="flex items-center gap-2"><span className="text-sm">{log.records_processed} registros</span><StatusBadge status={log.status} /></div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="products" className="space-y-2 mt-4">
            {products.logs.slice(0, 10).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div><p className="font-medium">{log.source} - {log.sync_type}</p><p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(log.started_at), { addSuffix: true, locale: ptBR })}</p></div>
                <div className="flex items-center gap-2"><span className="text-sm">{log.products_processed} produtos</span><StatusBadge status={log.status} /></div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
