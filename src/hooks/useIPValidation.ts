import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface IPValidationResult {
  isAllowed: boolean;
  currentIP: string | null;
  hasRestrictions: boolean;
  error?: string;
}

export function useIPValidation() {
  const [isValidating, setIsValidating] = useState(false);

  // Buscar IP atual do usuário
  const fetchCurrentIP = useCallback(async (): Promise<string | null> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error fetching current IP:', error);
      return null;
    }
  }, []);

  // Validar IP para um usuário específico (por email)
  const validateIPForUser = useCallback(async (email: string): Promise<IPValidationResult> => {
    setIsValidating(true);
    
    try {
      // 1. Buscar IP atual
      const currentIP = await fetchCurrentIP();
      
      if (!currentIP) {
        return {
          isAllowed: false,
          currentIP: null,
          hasRestrictions: false,
          error: 'Não foi possível identificar seu IP'
        };
      }

      // 2. Buscar user_id pelo email usando uma edge function ou verificação após login
      // Como não temos acesso direto antes do login, vamos usar uma abordagem diferente:
      // Buscar os IPs permitidos para o usuário que está tentando fazer login
      
      // Primeiro, precisamos buscar o user_id pelo email na tabela profiles ou auth
      // Porém, antes do login não temos acesso. Então a validação será feita após a autenticação.
      
      return {
        isAllowed: true, // Será validado após login
        currentIP,
        hasRestrictions: false
      };
    } catch (error: any) {
      return {
        isAllowed: false,
        currentIP: null,
        hasRestrictions: false,
        error: error.message
      };
    } finally {
      setIsValidating(false);
    }
  }, [fetchCurrentIP]);

  // Validar IP para usuário autenticado
  const validateIPForAuthenticatedUser = useCallback(async (userId: string): Promise<IPValidationResult> => {
    setIsValidating(true);
    
    try {
      // 1. Buscar IP atual
      const currentIP = await fetchCurrentIP();
      
      if (!currentIP) {
        return {
          isAllowed: false,
          currentIP: null,
          hasRestrictions: false,
          error: 'Não foi possível identificar seu IP'
        };
      }

      // 2. Buscar IPs permitidos do usuário
      const { data: allowedIPs, error } = await supabase
        .from('user_allowed_ips')
        .select('ip_address, is_active')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) throw error;

      // 3. Se não há IPs configurados, permitir acesso
      if (!allowedIPs || allowedIPs.length === 0) {
        return {
          isAllowed: true,
          currentIP,
          hasRestrictions: false
        };
      }

      // 4. Verificar se o IP atual está na lista
      const isAllowed = allowedIPs.some(ip => ip.ip_address === currentIP);

      return {
        isAllowed,
        currentIP,
        hasRestrictions: true,
        error: isAllowed ? undefined : 'Acesso negado: seu IP não está autorizado para esta conta'
      };
    } catch (error: any) {
      return {
        isAllowed: false,
        currentIP: null,
        hasRestrictions: false,
        error: error.message
      };
    } finally {
      setIsValidating(false);
    }
  }, [fetchCurrentIP]);

  // Registrar tentativa de login
  const logLoginAttempt = useCallback(async (
    email: string,
    userId: string | null,
    success: boolean,
    failureReason?: string
  ): Promise<void> => {
    try {
      const currentIP = await fetchCurrentIP();
      
      await supabase.from('login_attempts').insert({
        email,
        user_id: userId,
        ip_address: currentIP || 'unknown',
        success,
        failure_reason: failureReason || null,
        user_agent: navigator.userAgent
      });
    } catch (error) {
      console.error('Error logging login attempt:', error);
    }
  }, [fetchCurrentIP]);

  return {
    isValidating,
    fetchCurrentIP,
    validateIPForUser,
    validateIPForAuthenticatedUser,
    logLoginAttempt
  };
}
