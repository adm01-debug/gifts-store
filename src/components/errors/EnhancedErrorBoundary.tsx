import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: any[];
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

/**
 * Enhanced Error Boundary with Retry and Reset Capabilities
 */
export class EnhancedErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('EnhancedErrorBoundary caught an error:', error, errorInfo);

    this.setState((prevState) => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: Props): void {
    if (
      this.props.resetOnPropsChange &&
      this.state.hasError &&
      !this.arePropsEqual(prevProps.resetOnPropsChange, this.props.resetOnPropsChange)
    ) {
      this.handleReset();
    }
  }

  arePropsEqual(prev: any[] | undefined, current: any[] | undefined): boolean {
    if (!prev || !current) return true;
    if (prev.length !== current.length) return false;
    return prev.every((value, index) => value === current[index]);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Algo deu errado</CardTitle>
              <CardDescription>
                Ocorreu um erro inesperado. Por favor, tente novamente.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {this.state.error && (
                <details className="group">
                  <summary className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                    <Bug className="w-4 h-4" />
                    Detalhes técnicos
                  </summary>
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-mono break-all">
                      {this.state.error.message}
                    </p>
                    {this.state.errorInfo?.componentStack && (
                      <pre className="mt-2 text-xs text-muted-foreground overflow-auto max-h-32">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              {this.state.errorCount > 2 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Este erro ocorreu {this.state.errorCount} vezes. Considere recarregar a página.
                  </p>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              <div className="flex gap-2 w-full">
                <Button onClick={this.handleReset} variant="default" className="flex-1 gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Tentar Novamente
                </Button>
                <Button onClick={this.handleGoHome} variant="outline" className="flex-1 gap-2">
                  <Home className="w-4 h-4" />
                  Ir para Início
                </Button>
              </div>
              {this.state.errorCount > 2 && (
                <Button onClick={this.handleReload} variant="secondary" className="w-full gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Recarregar Página
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default EnhancedErrorBoundary;
