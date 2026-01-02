import { supabase } from '@/integrations/supabase/client';

export interface HealthCheckResult {
  database: boolean;
  auth: boolean;
  functions: boolean;
  errors: string[];
  timestamp: string;
}

export async function healthCheck(): Promise<HealthCheckResult> {
  const result: HealthCheckResult = {
    database: false,
    auth: false,
    functions: false,
    errors: [],
    timestamp: new Date().toISOString(),
  };

  try {
    // Test 1: Database Connection
    const { data, error } = await supabase.from('products').select('count');
    if (error) {
      result.errors.push(`Database: ${error.message}`);
    } else {
      result.database = true;
    }
  } catch (err) {
    result.errors.push(`Database: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }

  try {
    // Test 2: Auth
    const { data: { session } } = await supabase.auth.getSession();
    result.auth = true;
  } catch (err) {
    result.errors.push(`Auth: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }

  try {
    // Test 3: Edge Functions
    const { data, error } = await supabase.functions.invoke('send-notification', {
      body: { test: true }
    });
    if (error) {
      result.errors.push(`Functions: ${error.message}`);
    } else {
      result.functions = true;
    }
  } catch (err) {
    result.errors.push(`Functions: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }

  return result;
}

export async function validateEnvironment(): Promise<boolean> {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];

  const missing = requiredVars.filter(v => !import.meta.env[v]);
  
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }

  return true;
}
