import { toast } from 'sonner';

/**
 * Tipos de erro da API
 */
export enum ApiErrorType {
  NETWORK = 'NETWORK',
  TIMEOUT = 'TIMEOUT',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION = 'VALIDATION',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Classe de erro customizada para APIs
 */
export class ApiError extends Error {
  type: ApiErrorType;
  statusCode?: number;
  details?: any;

  constructor(
    message: string,
    type: ApiErrorType,
    statusCode?: number,
    details?: any
  ) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Parseia erros de fetch para ApiError
 */
export async function parseApiError(response: Response): Promise<ApiError> {
  const statusCode = response.status;
  let details: any;
  let message: string;

  // Tentar parsear JSON do body
  try {
    details = await response.json();
    message = details.message || details.error || response.statusText;
  } catch {
    message = response.statusText;
  }

  // Determinar tipo de erro baseado no status code
  let type: ApiErrorType;

  if (statusCode === 401) {
    type = ApiErrorType.UNAUTHORIZED;
    message = 'Sessão expirada. Faça login novamente.';
  } else if (statusCode === 403) {
    type = ApiErrorType.FORBIDDEN;
    message = 'Você não tem permissão para realizar esta ação.';
  } else if (statusCode === 404) {
    type = ApiErrorType.NOT_FOUND;
    message = 'Recurso não encontrado.';
  } else if (statusCode >= 400 && statusCode < 500) {
    type = ApiErrorType.VALIDATION;
  } else if (statusCode >= 500) {
    type = ApiErrorType.SERVER_ERROR;
    message = 'Erro no servidor. Tente novamente em alguns instantes.';
  } else {
    type = ApiErrorType.UNKNOWN;
  }

  return new ApiError(message, type, statusCode, details);
}

/**
 * Handler centralizado de erros de API
 */
export async function handleApiError(
  error: unknown,
  options: {
    showToast?: boolean;
    context?: string;
    silent?: boolean;
  } = {}
): Promise<ApiError> {
  let apiError: ApiError;

  // Converter para ApiError se necessário
  if (error instanceof ApiError) {
    apiError = error;
  } else if (error instanceof Response) {
    apiError = await parseApiError(error);
  } else if (error instanceof TypeError && error.message.includes('fetch')) {
    apiError = new ApiError(
      'Erro de conexão. Verifique sua internet.',
      ApiErrorType.NETWORK
    );
  } else if (error instanceof Error) {
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      apiError = new ApiError(
        'A requisição demorou muito. Tente novamente.',
        ApiErrorType.TIMEOUT
      );
    } else {
      apiError = new ApiError(
        error.message,
        ApiErrorType.UNKNOWN,
        undefined,
        error
      );
    }
  } else {
    apiError = new ApiError(
      'Erro desconhecido',
      ApiErrorType.UNKNOWN,
      undefined,
      error
    );
  }

  // Log em desenvolvimento
  if (import.meta.env.DEV && !options.silent) {
    console.error(
      `[API Error]${options.context ? ` ${options.context}:` : ''}`,
      apiError
    );
  }

  // Mostrar toast se solicitado
  if (options.showToast !== false && !options.silent) {
    const context = options.context ? `${options.context}: ` : '';
    toast.error(`${context}${apiError.message}`);
  }

  return apiError;
}

/**
 * Wrapper para fetch com tratamento de erro automático
 */
export async function fetchWithErrorHandling<T = any>(
  url: string,
  options: RequestInit & {
    timeout?: number;
    retries?: number;
    retryDelay?: number;
    context?: string;
  } = {}
): Promise<T> {
  const {
    timeout = 30000,
    retries = 0,
    retryDelay = 1000,
    context,
    ...fetchOptions
  } = options;

  // Adicionar timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  let lastError: ApiError | null = null;
  let attempt = 0;

  while (attempt <= retries) {
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw await parseApiError(response);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = await handleApiError(error, {
        context,
        showToast: attempt === retries, // Só mostrar toast na última tentativa
        silent: attempt < retries, // Silenciar tentativas intermediárias
      });

      // Retry se configurado e não for erro de validação/auth
      if (
        attempt < retries &&
        lastError.type !== ApiErrorType.VALIDATION &&
        lastError.type !== ApiErrorType.UNAUTHORIZED &&
        lastError.type !== ApiErrorType.FORBIDDEN
      ) {
        attempt++;
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay * attempt)
        );
        continue;
      }

      throw lastError;
    }
  }

  throw lastError || new ApiError('Erro desconhecido', ApiErrorType.UNKNOWN);
}
