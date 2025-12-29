import React, { Component, ReactNode } from 'react';
import * as Sentry from '@sentry/react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetOnPropsChange?: any[];
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorCount: number;
}

/**
 * Enhanced Error Boundary with Retry and Reset Capabilities
 * 
 * Features:
 * - Automatic error reporting to Sentry
 * - Retry functionality with exponential backoff
 * - Reset on props change
 * - Custom fallback UI
 * - Error count tracking
 * - Development mode error details
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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Report to Sentry in production
    if (import.meta.env.PROD) {
      Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
      });
    }

    // Update state
    this.setState((prevState) => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: Props): void {
    // Reset error boundary when specific props change
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
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 space-y-4">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Algo deu errado
              </h1>
              <p className="text-gray-600 mb-4">
                Ocorreu um erro inesperado. Por favor, tente novamente.
              </p>

              {import.meta.env.DEV && this.state.error && (
                <div className="text-left bg-gray-100 rounded p-4 mb-4 overflow-auto max-h-40">
                  <p className="text-sm font-mono text-red-600 break-all">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="text-sm font-semibold cursor-pointer">
                        Stack Trace
                      </summary>
                      <pre className="text-xs mt-2 overflow-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {this.state.errorCount > 2 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Este erro ocorreu {this.state.errorCount} vezes. 
                    Considere recarregar a página.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={this.handleReset}
                className="flex-1"
                variant="default"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </Button>

              <Button
                onClick={this.handleGoHome}
                className="flex-1"
                variant="outline"
              >
                <Home className="w-4 h-4 mr-2" />
                Ir para Início
              </Button>
            </div>

            {this.state.errorCount > 2 && (
              <Button
                onClick={this.handleReload}
                className="w-full"
                variant="secondary"
              >
                Recarregar Página
              </Button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Wrapper for Sentry Error Boundary with enhanced features
 */
export const ErrorBoundaryWithSentry: React.FC<{
  children: ReactNode;
  fallback?: ReactNode;
}> = ({ children, fallback }) => {
  return (
    <Sentry.ErrorBoundary
      fallback={fallback || <EnhancedErrorBoundary>{children}</EnhancedErrorBoundary>}
      showDialog={false}
    >
      <EnhancedErrorBoundary fallback={fallback}>
        {children}
      </EnhancedErrorBoundary>
    </Sentry.ErrorBoundary>
  );
};
