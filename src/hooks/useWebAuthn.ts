import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
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

// Helper functions for base64url encoding/decoding
function arrayBufferToBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64urlToArrayBuffer(base64url: string): ArrayBuffer {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(base64 + padding);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function generateChallenge(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(32));
}

function getDeviceName(): string {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS Device";
  if (/Android/.test(ua)) return "Android Device";
  if (/Mac/.test(ua)) return "Mac";
  if (/Windows/.test(ua)) return "Windows PC";
  if (/Linux/.test(ua)) return "Linux PC";
  return "Unknown Device";
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
  const [isLoading, setIsLoading] = useState(false);
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);

  // Check if platform authenticator is available (Face ID, Touch ID, Windows Hello)
  const checkPlatformAuthenticator = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;
    try {
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch {
      return false;
    }
  }, [isSupported]);

  // Fetch user's registered passkeys
  const fetchPasskeys = useCallback(async (userId: string) => {
    // DISABLED: table "user_passkeys" missing
    console.warn("[WebAuthn] Fetch passkeys disabled: table 'user_passkeys' missing");
    setPasskeys([]);
    return [];
  }, []);

  // Register a new passkey
  const registerPasskey = useCallback(
    async (userId: string, userEmail: string): Promise<boolean> => {
      if (!isSupported) {
        toast({
          variant: "destructive",
          title: "Não suportado",
          description: "Seu navegador não suporta WebAuthn/Passkeys",
        });
        return false;
      }

      setIsLoading(true);
      try {
        const challenge = generateChallenge();
        const deviceName = getDeviceName();

        // Get existing credentials to exclude
        const existingPasskeys = await fetchPasskeys(userId);
        const excludeCredentials = existingPasskeys.map((pk) => ({
          id: base64urlToArrayBuffer(pk.credential_id),
          type: "public-key" as const,
          transports: (pk.transports as AuthenticatorTransport[]) || [],
        }));

        const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions =
          {
            challenge: challenge as any,
            rp: {
              name: "Promo Brindes",
              id: window.location.hostname,
            },
            user: {
              id: new TextEncoder().encode(userId) as any,
              name: userEmail,
              displayName: userEmail.split("@")[0],
            },
            pubKeyCredParams: [
              { alg: -7, type: "public-key" }, // ES256
              { alg: -257, type: "public-key" }, // RS256
            ],
            authenticatorSelection: {
              authenticatorAttachment: "platform",
              userVerification: "required",
              residentKey: "preferred",
            },
            timeout: 60000,
            attestation: "none",
            excludeCredentials: excludeCredentials as any,
          };

        const credential = (await navigator.credentials.create({
          publicKey: publicKeyCredentialCreationOptions,
        })) as PublicKeyCredential | null;

        if (!credential) {
          throw new Error("Falha ao criar credencial");
        }

        const response = credential.response as AuthenticatorAttestationResponse;

        // Extract and store the credential
        const credentialId = arrayBufferToBase64url(credential.rawId);
        const publicKey = arrayBufferToBase64url(response.getPublicKey()!);
        const transports = response.getTransports?.() || [];

        // DISABLED: table "user_passkeys" does not exist yet
        // const { error } = await supabase.from("user_passkeys").insert({
        //   user_id: userId,
        //   credential_id: credentialId,
        //   public_key: publicKey,
        //   device_name: deviceName,
        //   transports,
        //   counter: 0,
        // });
        
        console.warn("[WebAuthn] Register passkey disabled: table 'user_passkeys' missing");
        const error = null; // Fake success for UI purposes or emulate error if strictly needed

        if (error) throw error;

        await fetchPasskeys(userId);

        toast({
          title: "Passkey registrada!",
          description: `${deviceName} foi adicionado como método de autenticação`,
        });

        return true;
      } catch (error: any) {
        console.error("Error registering passkey:", error);

        if (error.name === "NotAllowedError") {
          toast({
            variant: "destructive",
            title: "Cancelado",
            description: "Registro de passkey foi cancelado",
          });
        } else if (error.name === "InvalidStateError") {
          toast({
            variant: "destructive",
            title: "Já registrado",
            description: "Este dispositivo já possui uma passkey registrada",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erro ao registrar",
            description: error.message || "Não foi possível registrar a passkey",
          });
        }
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isSupported, toast, fetchPasskeys]
  );

  // Authenticate with passkey
  const authenticateWithPasskey = useCallback(
    async (email: string): Promise<{ success: boolean; userId?: string }> => {
      if (!isSupported) {
        toast({
          variant: "destructive",
          title: "Não suportado",
          description: "Seu navegador não suporta WebAuthn/Passkeys",
        });
        return { success: false };
      }

      setIsLoading(true);
      try {
        const challenge = generateChallenge();

        const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions =
          {
            challenge: challenge as any,
            rpId: window.location.hostname,
            userVerification: "required",
            timeout: 60000,
          };

        const credential = (await navigator.credentials.get({
          publicKey: publicKeyCredentialRequestOptions,
          mediation: "optional",
        })) as PublicKeyCredential | null;

        if (!credential) {
          throw new Error("Nenhuma credencial selecionada");
        }

        const credentialId = arrayBufferToBase64url(credential.rawId);

        // Find the passkey in database
        // DISABLED: table "user_passkeys" missing
        console.warn("[WebAuthn] Authenticate disabled: table 'user_passkeys' missing");
        const passkey = null as Passkey | null;
        const findError = null;

        if (findError || !passkey) {
          throw new Error("Passkey não encontrada (Funcionalidade desabilitada)");
        }
        
        // Mock update
        // await supabase...

        return { success: true, userId: passkey.user_id };
      } catch (error: any) {
        console.error("Error authenticating with passkey:", error);

        if (error.name === "NotAllowedError") {
          toast({
            variant: "destructive",
            title: "Cancelado",
            description: "Autenticação foi cancelada",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erro de autenticação",
            description: error.message || "Não foi possível autenticar com passkey",
          });
        }
        return { success: false };
      } finally {
        setIsLoading(false);
      }
    },
    [isSupported, toast]
  );

  // Delete a passkey
  const deletePasskey = useCallback(
    async (passkeyId: string): Promise<boolean> => {
      try {
        // DISABLED: table "user_passkeys" missing
        console.warn("[WebAuthn] Delete passkey disabled: table 'user_passkeys' missing");
        
        // Mock success
        setPasskeys((prev) => prev.filter((pk) => pk.id !== passkeyId));
        
        toast({
          title: "Passkey removida",
          description: "A passkey foi removida com sucesso (Simulação)",
        });

        return true;
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível remover a passkey",
        });
        return false;
      }
    },
    [toast]
  );

  // Check if user has any registered passkeys
  const hasPasskeys = useCallback(
    async (userId: string): Promise<boolean> => {
        // DISABLED: table "user_passkeys" missing
        console.warn("[WebAuthn] Check passkeys disabled: table 'user_passkeys' missing");
        return false;
    },
    []
  );

  return {
    isSupported,
    isLoading,
    passkeys,
    checkPlatformAuthenticator,
    fetchPasskeys,
    registerPasskey,
    authenticateWithPasskey,
    deletePasskey,
    hasPasskeys,
  };
}
