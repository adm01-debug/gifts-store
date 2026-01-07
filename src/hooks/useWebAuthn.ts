/**
 * Hook WebAuthn/Passkeys - DESABILITADO
 *
 * Este módulo está temporariamente desabilitado.
 * A tabela user_passkeys não existe no banco de dados atual.
 *
 * Para reativar, crie a tabela necessária no Supabase.
 */

import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface Passkey {
  id: string;
  user_id: string;
  credential_id: string;
  public_key: string;
  counter: number;
  device_name: string | null;
  transports: string[] | null;
  created_at: string;
  last_used_at: string | null;
}

export function useWebAuthn() {
  const { toast } = useToast();
  const [isSupported] = useState(() => {
    return (
      typeof window !== "undefined" &&
      window.PublicKeyCredential !== undefined &&
      typeof window.PublicKeyCredential === "function"
    );
  });
  const [isLoading] = useState(false);
  const [passkeys] = useState<Passkey[]>([]);

  // Check if platform authenticator is available
  const checkPlatformAuthenticator = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;
    try {
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch {
      return false;
    }
  }, [isSupported]);

  // Fetch user's registered passkeys (DISABLED)
  const fetchPasskeys = useCallback(async (_userId: string): Promise<Passkey[]> => {
    // Módulo desabilitado - retorna array vazio
    return [];
  }, []);

  // Register a new passkey (DISABLED)
  const registerPasskey = useCallback(
    async (_userId: string, _userEmail: string): Promise<boolean> => {
      toast({
        variant: "destructive",
        title: "Módulo Desabilitado",
        description: "O recurso de Passkeys está temporariamente indisponível",
      });
      return false;
    },
    [toast]
  );

  // Authenticate with passkey (DISABLED)
  const authenticateWithPasskey = useCallback(
    async (_email: string): Promise<{ success: boolean; userId?: string }> => {
      toast({
        variant: "destructive",
        title: "Módulo Desabilitado",
        description: "O recurso de Passkeys está temporariamente indisponível",
      });
      return { success: false };
    },
    [toast]
  );

  // Delete a passkey (DISABLED)
  const deletePasskey = useCallback(
    async (_passkeyId: string): Promise<boolean> => {
      toast({
        variant: "destructive",
        title: "Módulo Desabilitado",
        description: "O recurso de Passkeys está temporariamente indisponível",
      });
      return false;
    },
    [toast]
  );

  // Check if user has any registered passkeys (DISABLED)
  const hasPasskeys = useCallback(async (_userId: string): Promise<boolean> => {
    return false;
  }, []);

  return {
    isSupported,
    isLoading,
    isEnabled: false, // Flag indicating module is disabled
    passkeys,
    checkPlatformAuthenticator,
    fetchPasskeys,
    registerPasskey,
    authenticateWithPasskey,
    deletePasskey,
    hasPasskeys,
  };
}
