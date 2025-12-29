// Error tracking service - Browser compatible placeholder
// Configure with Sentry SDK when ready for production

interface ErrorContext {
  userId?: string;
  extra?: Record<string, any>;
  tags?: Record<string, string>;
}

class ErrorTracker {
  private isInitialized = false;

  init(dsn?: string): void {
    if (dsn) {
      // In production, initialize Sentry here
      // import('@sentry/react').then(Sentry => Sentry.init({ dsn }));
      this.isInitialized = true;
      console.log('Error tracking initialized');
    }
  }

  captureException(error: Error, context?: ErrorContext): void {
    console.error('Captured exception:', error, context);
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    console.log(`[${level.toUpperCase()}]`, message);
  }

  setUser(userId: string, email?: string): void {
    console.log('Set user context:', { userId, email });
  }
}

export const errorTracker = new ErrorTracker();

// Export for compatibility
export function initSentry() {
  errorTracker.init(import.meta.env.VITE_SENTRY_DSN);
}
