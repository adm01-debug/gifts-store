import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

type RateLimitEndpoint = 'login' | 'api' | 'ai' | 'approval';

interface RateLimitResult {
  allowed: boolean;
  remaining?: number;
  retryAfter?: number;
  error?: string;
}

export function useRateLimitCheck() {
  const checkRateLimit = useCallback(async (endpoint: RateLimitEndpoint): Promise<RateLimitResult> => {
    try {
      const { data, error } = await supabase.functions.invoke('rate-limit-check', {
        body: { endpoint },
      });

      if (error) {
        if (import.meta.env.DEV) {
          console.error('Rate limit check failed:', error);
        }
        // Allow on error to prevent blocking legitimate users
        return { allowed: true };
      }

      return data as RateLimitResult;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Rate limit check error:', error);
      }
      return { allowed: true };
    }
  }, []);

  const withRateLimit = useCallback(async <T>(
    endpoint: RateLimitEndpoint,
    action: () => Promise<T>
  ): Promise<{ data?: T; rateLimited?: boolean; retryAfter?: number }> => {
    const result = await checkRateLimit(endpoint);
    
    if (!result.allowed) {
      return { 
        rateLimited: true, 
        retryAfter: result.retryAfter 
      };
    }

    const data = await action();
    return { data };
  }, [checkRateLimit]);

  return {
    checkRateLimit,
    withRateLimit,
  };
}
