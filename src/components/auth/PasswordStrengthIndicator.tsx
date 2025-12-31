import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

interface StrengthCriteria {
  label: string;
  met: boolean;
}

export function PasswordStrengthIndicator({ password, className }: PasswordStrengthIndicatorProps) {
  const analysis = useMemo(() => {
    const criteria: StrengthCriteria[] = [
      { label: 'Mínimo 8 caracteres', met: password.length >= 8 },
      { label: 'Letra maiúscula', met: /[A-Z]/.test(password) },
      { label: 'Letra minúscula', met: /[a-z]/.test(password) },
      { label: 'Número', met: /[0-9]/.test(password) },
      { label: 'Caractere especial', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ];

    const score = criteria.filter(c => c.met).length;
    
    let strength: 'empty' | 'weak' | 'fair' | 'good' | 'strong' = 'empty';
    let color = 'bg-muted';
    let label = '';

    if (password.length === 0) {
      strength = 'empty';
    } else if (score <= 2) {
      strength = 'weak';
      color = 'bg-destructive';
      label = 'Fraca';
    } else if (score === 3) {
      strength = 'fair';
      color = 'bg-orange-500';
      label = 'Razoável';
    } else if (score === 4) {
      strength = 'good';
      color = 'bg-yellow-500';
      label = 'Boa';
    } else {
      strength = 'strong';
      color = 'bg-green-500';
      label = 'Forte';
    }

    return { criteria, score, strength, color, label };
  }, [password]);

  if (password.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Força da senha</span>
          <span className={cn(
            'text-xs font-medium',
            analysis.strength === 'weak' && 'text-destructive',
            analysis.strength === 'fair' && 'text-orange-500',
            analysis.strength === 'good' && 'text-yellow-600',
            analysis.strength === 'strong' && 'text-green-600'
          )}>
            {analysis.label}
          </span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((segment) => (
            <div
              key={segment}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-all duration-300',
                segment <= analysis.score ? analysis.color : 'bg-muted'
              )}
            />
          ))}
        </div>
      </div>

      {/* Criteria checklist */}
      <div className="grid grid-cols-2 gap-1.5">
        {analysis.criteria.map((criterion) => (
          <div
            key={criterion.label}
            className={cn(
              'flex items-center gap-1.5 text-xs transition-colors',
              criterion.met ? 'text-green-600' : 'text-muted-foreground'
            )}
          >
            {criterion.met ? (
              <Check className="h-3 w-3" />
            ) : (
              <X className="h-3 w-3" />
            )}
            <span>{criterion.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
