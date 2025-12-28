import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, X } from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  action?: () => void;
}

export function OnboardingChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: 'profile',
      title: 'Complete seu perfil',
      description: 'Adicione foto e informações de contato',
      completed: false
    },
    {
      id: 'first-quote',
      title: 'Crie seu primeiro orçamento',
      description: 'Teste o builder de orçamentos',
      completed: false,
      action: () => window.location.href = '/quotes/new'
    },
    {
      id: 'explore-catalog',
      title: 'Explore o catálogo',
      description: '50.000+ produtos disponíveis',
      completed: false,
      action: () => window.location.href = '/products'
    },
    {
      id: 'enable-notifications',
      title: 'Ative notificações',
      description: 'Receba alertas de aprovações',
      completed: false,
      action: () => window.location.href = '/profile'
    }
  ]);

  const [isVisible, setIsVisible] = useState(() => {
    const dismissed = localStorage.getItem('onboarding-dismissed');
    return !dismissed;
  });

  const progress = (items.filter(i => i.completed).length / items.length) * 100;
  const allCompleted = items.every(i => i.completed);

  const handleDismiss = () => {
    localStorage.setItem('onboarding-dismissed', 'true');
    setIsVisible(false);
  };

  useEffect(() => {
    if (allCompleted) {
      setTimeout(handleDismiss, 2000);
    }
  }, [allCompleted]);

  if (!isVisible) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Primeiros Passos 🎯</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <Progress value={progress} className="mt-2" />
        <p className="text-sm text-muted-foreground mt-2">
          {Math.round(progress)}% completo
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map(item => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="mt-0.5">
                {item.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1">
                <h4 className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>

              {!item.completed && item.action && (
                <Button
                  onClick={item.action}
                  size="sm"
                  variant="outline"
                >
                  Fazer
                </Button>
              )}
            </div>
          ))}
        </div>

        {allCompleted && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg text-center">
            <p className="text-sm font-medium text-green-700 dark:text-green-300">
              🎉 Parabéns! Você completou todos os passos iniciais!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
