import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { use2FA } from '@/hooks/use2FA';
import { useReauthentication } from '@/hooks/useReauthentication';
import { ReauthenticationDialog } from './ReauthenticationDialog';
import { MFAEnroll } from './MFAEnroll';
import { MFAVerify } from './MFAVerify';
import { Shield, Smartphone, Mail, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

type MFAProvider = 'totp' | 'email';

export function MFASettings() {
  const { settings, isLoading, is2FAEnabled, disable2FA, refetch } = use2FA();
  const { needsReauthentication } = useReauthentication();
  const [showReauth, setShowReauth] = useState(false);
  const [showEnrollTOTP, setShowEnrollTOTP] = useState(false);
  const [showDisable, setShowDisable] = useState(false);
  const [pendingAction, setPendingAction] = useState<'enroll' | 'disable' | null>(null);

  const handleEnrollTOTP = () => {
    if (needsReauthentication('configure_mfa')) {
      setPendingAction('enroll');
      setShowReauth(true);
    } else {
      setShowEnrollTOTP(true);
    }
  };

  const handleDisable = () => {
    if (needsReauthentication('configure_mfa')) {
      setPendingAction('disable');
      setShowReauth(true);
    } else {
      setShowDisable(true);
    }
  };

  const handleReauthSuccess = () => {
    if (pendingAction === 'enroll') {
      setShowEnrollTOTP(true);
    } else if (pendingAction === 'disable') {
      setShowDisable(true);
    }
    setPendingAction(null);
  };

  const handleEnrollSuccess = () => {
    setShowEnrollTOTP(false);
    refetch();
  };

  const handleDisableSuccess = () => {
    setShowDisable(false);
    refetch();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Autenticação Multi-Fator (MFA)
          </CardTitle>
          <CardDescription>
            Adicione uma camada extra de segurança à sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Overview */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {is2FAEnabled ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              )}
              <div>
                <p className="font-medium">Status do MFA</p>
                <p className="text-sm text-muted-foreground">
                  {is2FAEnabled ? 'Proteção ativa' : 'Proteção não configurada'}
                </p>
              </div>
            </div>
            <Badge variant={is2FAEnabled ? 'default' : 'secondary'}>
              {is2FAEnabled ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>

          {/* MFA Providers */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Métodos Disponíveis</h4>
            
            {/* TOTP Provider */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5" />
                <div>
                  <p className="font-medium">Aplicativo Autenticador (TOTP)</p>
                  <p className="text-sm text-muted-foreground">
                    Google Authenticator, Authy, etc.
                  </p>
                </div>
              </div>
              {is2FAEnabled ? (
                <Button variant="destructive" size="sm" onClick={handleDisable}>
                  Desativar
                </Button>
              ) : (
                <Button size="sm" onClick={handleEnrollTOTP}>
                  Configurar
                </Button>
              )}
            </div>

            {/* Email Provider (Future) */}
            <div className="flex items-center justify-between p-4 border rounded-lg opacity-60">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5" />
                <div>
                  <p className="font-medium">Código por Email</p>
                  <p className="text-sm text-muted-foreground">
                    Receba códigos de verificação por email
                  </p>
                </div>
              </div>
              <Badge variant="outline">Em breve</Badge>
            </div>
          </div>

          {!is2FAEnabled && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Recomendamos ativar o MFA para proteger sua conta contra acessos não autorizados.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ReauthenticationDialog
        open={showReauth}
        onOpenChange={setShowReauth}
        onSuccess={handleReauthSuccess}
        actionDescription="Para alterar as configurações de MFA, confirme sua identidade."
      />

      <Dialog open={showEnrollTOTP} onOpenChange={setShowEnrollTOTP}>
        <DialogContent className="sm:max-w-lg">
          <MFAEnroll 
            onSuccess={handleEnrollSuccess}
            onCancel={() => setShowEnrollTOTP(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showDisable} onOpenChange={setShowDisable}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Desativar MFA</DialogTitle>
          </DialogHeader>
          <MFAVerify
            onSuccess={async () => {
              await disable2FA('');
              handleDisableSuccess();
            }}
            onCancel={() => setShowDisable(false)}
            title="Confirmar Desativação"
            description="Digite o código do seu aplicativo para desativar o MFA"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
