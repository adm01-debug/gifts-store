import { useRef, useEffect } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Shield, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// hCaptcha test site key - works in development
// In production, replace with your actual site key
const HCAPTCHA_SITE_KEY = '10000000-ffff-ffff-ffff-000000000001';

interface CaptchaWidgetProps {
  onVerify: (token: string) => void;
  onExpire: () => void;
  failedAttempts: number;
  threshold: number;
}

export function CaptchaWidget({ 
  onVerify, 
  onExpire, 
  failedAttempts, 
  threshold 
}: CaptchaWidgetProps) {
  const captchaRef = useRef<HCaptcha>(null);

  // Reset captcha when component mounts
  useEffect(() => {
    if (captchaRef.current) {
      captchaRef.current.resetCaptcha();
    }
  }, []);

  const handleVerify = (token: string) => {
    onVerify(token);
  };

  const handleExpire = () => {
    onExpire();
  };

  const handleError = (err: string) => {
    console.error('hCaptcha error:', err);
    onExpire();
  };

  return (
    <div className="space-y-3">
      <Alert variant="destructive" className="border-warning bg-warning/10">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <AlertDescription className="text-sm">
          <span className="font-medium">Verificação de segurança necessária.</span>
          <br />
          <span className="text-muted-foreground">
            {failedAttempts} tentativas de login falhas detectadas. 
            Complete o CAPTCHA para continuar.
          </span>
        </AlertDescription>
      </Alert>

      <div className="flex flex-col items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Verificação hCaptcha</span>
        </div>
        
        <HCaptcha
          ref={captchaRef}
          sitekey={HCAPTCHA_SITE_KEY}
          onVerify={handleVerify}
          onExpire={handleExpire}
          onError={handleError}
          theme="light"
          size="normal"
        />
      </div>
    </div>
  );
}
