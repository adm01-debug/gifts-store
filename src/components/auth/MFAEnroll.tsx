import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { use2FA } from '@/hooks/use2FA';
import { useAuth } from '@/contexts/AuthContext';
import { Smartphone, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface MFAEnrollProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function MFAEnroll({ onSuccess, onCancel }: MFAEnrollProps) {
  const [step, setStep] = useState<'qr' | 'verify'>('qr');
  const [qrUri, setQrUri] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { generateSecret, enable2FA } = use2FA();
  const { user } = useAuth();

  const handleGenerateQR = async () => {
    if (!user?.email) return;
    
    setIsGenerating(true);
    try {
      const result = await generateSecret(user.email);
      setSecret(result.secret);
      setQrUri(result.uri);
    } catch (error) {
      toast({ title: 'Erro', description: error instanceof Error ? error.message : 'Erro desconhecido', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({ title: 'Erro', description: 'Digite o código de 6 dígitos', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const result = await enable2FA(verificationCode);
      if (result.success) {
        toast({ title: '2FA ativado com sucesso!' });
        onSuccess?.();
      } else {
        toast({ title: 'Erro', description: result.error, variant: 'destructive' });
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
          <Smartphone className="h-5 w-5" />
          Configurar Autenticação de Dois Fatores
        </CardTitle>
        <CardDescription>
          Use um aplicativo autenticador como Google Authenticator ou Authy
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!qrUri ? (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Clique abaixo para gerar o QR Code de configuração
            </p>
            <Button onClick={handleGenerateQR} disabled={isGenerating}>
              {isGenerating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Gerar QR Code
            </Button>
          </div>
        ) : step === 'qr' ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-white rounded-lg">
                <QRCodeSVG value={qrUri} size={200} />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Escaneie o QR Code com seu aplicativo autenticador
              </p>
              {secret && (
                <div className="bg-muted p-2 rounded text-xs font-mono break-all">
                  Chave manual: {secret}
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button onClick={() => setStep('verify')}>
                Próximo
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              Digite o código de 6 dígitos do seu aplicativo
            </p>
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
              <Button variant="outline" onClick={() => setStep('qr')}>
                Voltar
              </Button>
              <Button onClick={handleVerify} disabled={isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Ativar 2FA
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
