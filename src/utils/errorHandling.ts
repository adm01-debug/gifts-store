/**
 * Error Handling Utilities - Production Grade
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN', 500);
  }
  return new AppError('Unknown error occurred', 'UNKNOWN', 500);
}

export function logError(error: unknown, context?: string): void {
  const appError = handleError(error);
  console.error(`[${context || 'App'}]`, {
    message: appError.message,
    code: appError.code,
    statusCode: appError.statusCode,
  });
}

export async function tryCatch<T>(
  fn: () => Promise<T>,
  fallback?: T
): Promise<T | undefined> {
  try {
    return await fn();
  } catch (error) {
    logError(error);
    return fallback;
  }
}
