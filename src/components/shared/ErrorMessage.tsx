import { AlertCircle, AlertTriangle, Info, RefreshCw, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

type ErrorSeverity = 'error' | 'warning' | 'info';

interface ErrorMessageProps {
  error: Error | string;
  onRetry?: () => void;
  title?: string;
  severity?: ErrorSeverity;
  retryLabel?: string;
}

const severityConfig = {
  error: {
    icon: XCircle,
    variant: 'destructive' as const,
    defaultTitle: 'Erro ao carregar dados',
  },
  warning: {
    icon: AlertTriangle,
    variant: 'default' as const,
    defaultTitle: 'Atenção',
  },
  info: {
    icon: Info,
    variant: 'default' as const,
    defaultTitle: 'Informação',
  },
} as const;

export function ErrorMessage({ 
  error, 
  onRetry,
  title,
  severity = 'error',
  retryLabel = 'Tentar novamente'
}: ErrorMessageProps) {
  const config = severityConfig[severity];
  const Icon = config.icon;
  const errorMessage = typeof error === 'string' ? error : error.message;
  const displayTitle = title || config.defaultTitle;

  return (
    <Alert variant={config.variant} className="max-w-2xl mx-auto">
      <Icon className="h-4 w-4" />
      <AlertTitle>{displayTitle}</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>{errorMessage}</p>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-2"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {retryLabel}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
