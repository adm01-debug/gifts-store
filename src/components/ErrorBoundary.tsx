import React from 'react';
import * as Sentry from '@sentry/react';

interface Props {
  children: React.ReactNode;
}

export const ErrorBoundary: React.FC<Props> = ({ children }) => {
  return (
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      {children}
    </Sentry.ErrorBoundary>
  );
};

const ErrorFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Algo deu errado</h1>
      <button onClick={() => window.location.reload()}>Recarregar</button>
    </div>
  </div>
);
