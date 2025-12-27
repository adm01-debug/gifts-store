import { useCallback, useState } from "react";
import { toast } from "sonner";

interface ErrorState {
  error: Error | null;
  isError: boolean;
  message: string;
}

interface UseErrorHandlerOptions {
  showToast?: boolean;
  toastDuration?: number;
  logToConsole?: boolean;
  onError?: (error: Error) => void;
}

interface UseErrorHandlerReturn {
  error: Error | null;
  isError: boolean;
  message: string;
  handleError: (error: unknown, customMessage?: string) => void;
  clearError: () => void;
  wrapAsync: <T>(fn: () => Promise<T>, customMessage?: string) => Promise<T | undefined>;
  wrapSync: <T>(fn: () => T, customMessage?: string) => T | undefined;
}

const defaultOptions: UseErrorHandlerOptions = {
  showToast: true,
  toastDuration: 5000,
  logToConsole: true,
};

/**
 * Hook para tratamento centralizado de erros
 * Fornece funções para capturar, exibir e gerenciar erros de forma consistente
 */
export function useErrorHandler(
  options: UseErrorHandlerOptions = {}
): UseErrorHandlerReturn {
  const opts = { ...defaultOptions, ...options };
  
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isError: false,
    message: "",
  });

  /**
   * Normaliza qualquer tipo de erro para Error
   */
  const normalizeError = useCallback((error: unknown): Error => {
    if (error instanceof Error) {
      return error;
    }
    if (typeof error === "string") {
      return new Error(error);
    }
    if (typeof error === "object" && error !== null) {
      const errorObj = error as Record<string, unknown>;
      const message = errorObj.message || errorObj.error || JSON.stringify(error);
      return new Error(String(message));
    }
    return new Error("Erro desconhecido");
  }, []);

  /**
   * Obtém mensagem amigável para o usuário
   */
  const getUserFriendlyMessage = useCallback((error: Error, customMessage?: string): string => {
    if (customMessage) return customMessage;
    
    const message = error.message.toLowerCase();
    
    // Erros de rede
    if (message.includes("network") || message.includes("fetch")) {
      return "Erro de conexão. Verifique sua internet e tente novamente.";
    }
    
    // Erros de autenticação
    if (message.includes("unauthorized") || message.includes("401")) {
      return "Sessão expirada. Faça login novamente.";
    }
    
    // Erros de permissão
    if (message.includes("forbidden") || message.includes("403")) {
      return "Você não tem permissão para realizar esta ação.";
    }
    
    // Erros de não encontrado
    if (message.includes("not found") || message.includes("404")) {
      return "O recurso solicitado não foi encontrado.";
    }
    
    // Erros de servidor
    if (message.includes("500") || message.includes("server")) {
      return "Erro no servidor. Tente novamente em alguns instantes.";
    }
    
    // Erros de validação
    if (message.includes("validation") || message.includes("invalid")) {
      return "Dados inválidos. Verifique as informações e tente novamente.";
    }
    
    // Erros de timeout
    if (message.includes("timeout")) {
      return "A operação demorou muito. Tente novamente.";
    }

    // Mensagem padrão
    return error.message || "Ocorreu um erro inesperado.";
  }, []);

  /**
   * Handler principal de erros
   */
  const handleError = useCallback(
    (error: unknown, customMessage?: string): void => {
      const normalizedError = normalizeError(error);
      const friendlyMessage = getUserFriendlyMessage(normalizedError, customMessage);

      // Atualiza estado
      setErrorState({
        error: normalizedError,
        isError: true,
        message: friendlyMessage,
      });

      // Log no console
      if (opts.logToConsole) {
        console.error("[useErrorHandler]", normalizedError);
      }

      // Exibe toast
      if (opts.showToast) {
        toast.error(friendlyMessage, {
          duration: opts.toastDuration,
          action: {
            label: "Fechar",
            onClick: () => {},
          },
        });
      }

      // Callback customizado
      opts.onError?.(normalizedError);
    },
    [normalizeError, getUserFriendlyMessage, opts]
  );

  /**
   * Limpa o estado de erro
   */
  const clearError = useCallback((): void => {
    setErrorState({
      error: null,
      isError: false,
      message: "",
    });
  }, []);

  /**
   * Wrapper para funções assíncronas com tratamento de erro automático
   */
  const wrapAsync = useCallback(
    async <T>(fn: () => Promise<T>, customMessage?: string): Promise<T | undefined> => {
      try {
        clearError();
        return await fn();
      } catch (error) {
        handleError(error, customMessage);
        return undefined;
      }
    },
    [clearError, handleError]
  );

  /**
   * Wrapper para funções síncronas com tratamento de erro automático
   */
  const wrapSync = useCallback(
    <T>(fn: () => T, customMessage?: string): T | undefined => {
      try {
        clearError();
        return fn();
      } catch (error) {
        handleError(error, customMessage);
        return undefined;
      }
    },
    [clearError, handleError]
  );

  return {
    error: errorState.error,
    isError: errorState.isError,
    message: errorState.message,
    handleError,
    clearError,
    wrapAsync,
    wrapSync,
  };
}

export default useErrorHandler;
