import { TwoFactorSetup } from './TwoFactorSetup';
import { IPRestrictionManager } from './IPRestrictionManager';

export function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Segurança</h2>
        <p className="text-muted-foreground">
          Gerencie as configurações de segurança da sua conta.
        </p>
      </div>
      
      <TwoFactorSetup />
      <IPRestrictionManager />
    </div>
  );
}
