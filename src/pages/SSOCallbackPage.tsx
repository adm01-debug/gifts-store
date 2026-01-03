import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

export default function SSOCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (error) {
        if (import.meta.env.DEV) {
          console.error('SSO Error:', error, errorDescription);
        }
        navigate('/login?error=' + encodeURIComponent(errorDescription || error));
        return;
      }

      if (code) {
        try {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
          navigate('/');
        } catch (err) {
          if (import.meta.env.DEV) {
            console.error('Session exchange error:', err);
          }
          navigate('/login?error=' + encodeURIComponent(err instanceof Error ? err.message : 'Erro desconhecido'));
        }
      } else {
        // Check if we have a session from hash fragment
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate('/');
        } else {
          navigate('/login');
        }
      }
    };

    handleCallback();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Processando autenticação...</p>
      </div>
    </div>
  );
}
