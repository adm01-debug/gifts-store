import { useState, useEffect } from "react";
import { useUserOnboarding } from "@/hooks/useUserOnboarding";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ChevronRight, X } from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  { id: "welcome", title: "Bem-vindo!", description: "Vamos conhecer o sistema juntos.", icon: "👋" },
  { id: "products", title: "Catálogo de Produtos", description: "Explore nossos produtos promocionais.", icon: "📦" },
  { id: "quotes", title: "Criando Orçamentos", description: "Aprenda a criar orçamentos rapidamente.", icon: "📝" },
  { id: "clients", title: "Gestão de Clientes", description: "Gerencie seus clientes em um só lugar.", icon: "👥" },
  { id: "done", title: "Pronto!", description: "Você está pronto para começar!", icon: "🎉" },
];

interface OnboardingTourProps {
  userId: string;
  onComplete?: () => void;
}

export function OnboardingTour({ userId, onComplete }: OnboardingTourProps) {
  const { onboarding, hasCompletedTour, currentStep, startOnboarding, completeStep, completeTour } = useUserOnboarding(userId);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!hasCompletedTour && onboarding) {
      setIsOpen(true);
    }
  }, [hasCompletedTour, onboarding]);

  useEffect(() => {
    if (!onboarding && userId) {
      startOnboarding.mutate(userId);
    }
  }, [onboarding, userId]);

  if (hasCompletedTour || !isOpen) return null;

  const step = ONBOARDING_STEPS[currentStep] || ONBOARDING_STEPS[0];
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;
  const isLastStep = currentStep >= ONBOARDING_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      completeTour.mutate(undefined, { onSuccess: () => { setIsOpen(false); onComplete?.(); } });
    } else {
      completeStep.mutate({ stepId: step.id });
    }
  };

  const handleSkip = () => {
    completeTour.mutate(undefined, { onSuccess: () => { setIsOpen(false); onComplete?.(); } });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="relative">
          <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={handleSkip}>
            <X className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <span className="text-5xl mb-4 block">{step.icon}</span>
            <CardTitle>{step.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">{step.description}</p>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Passo {currentStep + 1} de {ONBOARDING_STEPS.length}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={handleSkip}>Pular tour</Button>
          <Button onClick={handleNext}>
            {isLastStep ? (
              <>Concluir <CheckCircle2 className="h-4 w-4 ml-1" /></>
            ) : (
              <>Próximo <ChevronRight className="h-4 w-4 ml-1" /></>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
