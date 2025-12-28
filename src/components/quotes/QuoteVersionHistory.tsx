import { useQuoteVersions } from '@/hooks/useQuoteVersions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/date-utils';
import { GitBranch, Eye, Plus } from 'lucide-react';

interface QuoteVersionHistoryProps {
  quoteId: string;
}

export function QuoteVersionHistory({ quoteId }: QuoteVersionHistoryProps) {
  const { versions, isLoading, createVersion, isCreating } = useQuoteVersions(quoteId);

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Carregando versões...</div>;
  }

  const currentVersion = versions?.find(v => v.id === quoteId);
  const allVersions = versions || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Histórico de Versões
          </CardTitle>
          <Button
            onClick={() => createVersion()}
            disabled={isCreating}
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isCreating ? 'Criando...' : 'Nova Versão'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {allVersions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma versão anterior
          </p>
        ) : (
          <div className="space-y-2">
            {allVersions.map((version) => (
              <div
                key={version.id}
                className={`flex items-center justify-between p-3 border rounded ${
                  version.id === quoteId ? 'bg-primary/5 border-primary' : ''
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Versão {version.version}</span>
                    {version.id === quoteId && (
                      <Badge variant="default">Atual</Badge>
                    )}
                    <Badge variant="outline">{version.status}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDateTime(new Date(version.created_at))}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(`/quotes/${version.id}`, '_blank')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
