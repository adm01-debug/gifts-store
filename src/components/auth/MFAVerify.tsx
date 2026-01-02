import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { use2FA } from '@/hooks/use2FA';
import { ShieldCheck, Loader2 } from 'lucide-react';

interface MFAVerifyProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  title?: string;
  description?: string;
}

export function MFAVerify({ 
  onSuccess, 
  onCancel,
  title = 'Verificação de Dois Fatores',
  description = 'Digite o código do seu aplicativo autenticador'
}: MFAVerifyProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { settings, verifyToken } = use2FA();

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({ title: 'Erro', description: 'Digite o código de 6 dígitos', variant: 'destructive' });
      return;
    }

    if (!(settings as any)?.totp_secret) {
      toast({ title: 'Erro', description: '2FA não configurado', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const isValid = verifyToken((settings as any).totp_secret, verificationCode);
      if (isValid) {
        toast({ title: 'Verificação bem-sucedida!' });
        onSuccess?.();
      } else {
        toast({ title: 'Erro', description: 'Código inválido', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Erro', description: error instanceof Error ? error.message : 'Erro desconhecido', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={verificationCode} onChange={setVerificationCode}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <div className="flex gap-2 justify-center">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button onClick={handleVerify} disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Verificar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
