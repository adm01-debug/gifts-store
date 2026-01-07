import { useQuoteVersions } from "@/hooks/useQuoteVersions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { History, MoreVertical, RotateCcw, Eye, Clock } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

interface QuoteVersionsPanelProps {
  quoteId: string;
  onRestore?: () => void;
  className?: string;
}

export function QuoteVersionsPanel({ quoteId, onRestore, className }: QuoteVersionsPanelProps) {
  const { versions, isLoading, restoreVersion } = useQuoteVersions(quoteId);
  const [restoreConfirm, setRestoreConfirm] = useState<string | null>(null);
  const [viewingVersion, setViewingVersion] = useState<string | null>(null);

  const handleRestore = async () => {
    if (!restoreConfirm) return;
    await restoreVersion.mutateAsync(restoreConfirm);
    setRestoreConfirm(null);
    onRestore?.();
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (versions.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Versões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma versão salva ainda
          </p>
        </CardContent>
      </Card>
    );
  }

  const versionToView = viewingVersion 
    ? versions.find(v => v.id === viewingVersion) 
    : null;

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Versões
            <Badge variant="secondary" className="ml-2">
              {versions.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {versions.map((version, index) => (
              <div
                key={version.id}
                className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={index === 0 ? "default" : "outline"}>
                      v{version.version_number}
                    </Badge>
                    {index === 0 && (
                      <Badge variant="secondary" className="text-xs">
                        Atual
                      </Badge>
                    )}
                  </div>
                  
                  {version.change_summary && (
                    <p className="text-sm mt-1">{version.change_summary}</p>
                  )}
                  
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {formatDistanceToNow(new Date(version.created_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                    {version.author && (
                      <span>• {version.author.full_name}</span>
                    )}
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setViewingVersion(version.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver detalhes
                    </DropdownMenuItem>
                    {index !== 0 && (
                      <DropdownMenuItem onClick={() => setRestoreConfirm(version.id)}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Restaurar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Restore Confirmation */}
      <AlertDialog open={!!restoreConfirm} onOpenChange={() => setRestoreConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restaurar versão?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso irá substituir o orçamento atual pela versão selecionada.
              Uma nova versão será criada automaticamente com o estado atual.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestore}>
              Restaurar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Version Details Dialog */}
      <AlertDialog open={!!viewingVersion} onOpenChange={() => setViewingVersion(null)}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Versão {versionToView?.version_number}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {versionToView?.created_at && format(
                new Date(versionToView.created_at),
                "dd/MM/yyyy 'às' HH:mm",
                { locale: ptBR }
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="max-h-[400px] overflow-y-auto">
            <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(versionToView?.snapshot, null, 2)}
            </pre>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Fechar</AlertDialogCancel>
            {versionToView && versions.indexOf(versionToView) !== 0 && (
              <AlertDialogAction onClick={() => {
                setRestoreConfirm(versionToView.id);
                setViewingVersion(null);
              }}>
                Restaurar esta versão
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
