import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  position: "top" | "bottom" | "left" | "right";
  route?: string;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Bem-vindo ao Gifts Store!",
    description: "Vamos fazer um tour rápido pelas principais funcionalidades do sistema. Você pode pular a qualquer momento.",
    targetSelector: "[data-tour='sidebar']",
    position: "right",
  },
  {
    id: "products",
    title: "Catálogo de Produtos",
    description: "Aqui você encontra todos os produtos disponíveis. Use os filtros para encontrar exatamente o que precisa.",
    targetSelector: "[data-tour='products']",
    position: "right",
    route: "/",
  },
  {
    id: "search",
    title: "Busca Inteligente",
    description: "Use a busca para encontrar produtos rapidamente. Suporte a busca por voz e visual!",
    targetSelector: "[data-tour='search']",
    position: "bottom",
  },
  {
    id: "quotes",
    title: "Orçamentos",
    description: "Crie e gerencie orçamentos para seus clientes. Acompanhe o status de cada proposta.",
    targetSelector: "[data-tour='quotes']",
    position: "right",
    route: "/orcamentos",
  },
  {
    id: "clients",
    title: "Clientes",
    description: "Gerencie sua carteira de clientes. Veja histórico de compras e recomendações personalizadas.",
    targetSelector: "[data-tour='clients']",
    position: "right",
  },
  {
    id: "gamification",
    title: "Sistema de Recompensas",
    description: "Ganhe XP e moedas por suas atividades! Troque por recompensas na loja.",
    targetSelector: "[data-tour='gamification']",
    position: "bottom",
  },
  {
    id: "notifications",
    title: "Notificações e Lembretes",
    description: "Fique por dentro de tudo! Notificações e lembretes de follow-up ficam aqui.",
    targetSelector: "[data-tour='notifications']",
    position: "bottom",
  },
  {
    id: "complete",
    title: "Pronto para começar!",
    description: "Você completou o tour! Explore o sistema e não hesite em usar todas as funcionalidades.",
    targetSelector: "[data-tour='sidebar']",
    position: "right",
  },
];

export function useOnboarding() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [showTour, setShowTour] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedTour, setHasCompletedTour] = useState(false);
  const [onboardingId, setOnboardingId] = useState<string | null>(null);

  // Fetch onboarding status
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchOnboarding = async () => {
      try {
        const { data, error } = await supabase
          .from("user_onboarding")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching onboarding:", error);
          return;
        }

        if (data) {
          setOnboardingId(data.id);
          setHasCompletedTour(data.has_completed_tour || false);
          setCurrentStep(data.current_step || 0);
          // Show tour if user hasn't completed it
          if (!data.has_completed_tour) {
            setShowTour(true);
          }
        } else {
          // Create onboarding record for new user
          const { data: newData, error: insertError } = await supabase
            .from("user_onboarding")
            .insert({
              user_id: user.id,
              has_completed_tour: false,
              current_step: 0,
            })
            .select()
            .single();

          if (insertError) {
            console.error("Error creating onboarding:", insertError);
          } else if (newData) {
            setOnboardingId(newData.id);
            setShowTour(true);
          }
        }
      } catch (err) {
        console.error("Error in onboarding:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOnboarding();
  }, [user]);

  // Update current step in database
  const updateStep = useCallback(async (step: number) => {
    if (!user || !onboardingId) return;

    setCurrentStep(step);

    await supabase
      .from("user_onboarding")
      .update({
        current_step: step,
        completed_steps: ONBOARDING_STEPS.slice(0, step).map((s) => s.id),
      })
      .eq("id", onboardingId);
  }, [user, onboardingId]);

  // Complete tour
  const completeTour = useCallback(async () => {
    if (!user || !onboardingId) return;

    setShowTour(false);
    setHasCompletedTour(true);

    await supabase
      .from("user_onboarding")
      .update({
        has_completed_tour: true,
        completed_at: new Date().toISOString(),
        completed_steps: ONBOARDING_STEPS.map((s) => s.id),
      })
      .eq("id", onboardingId);
  }, [user, onboardingId]);

  // Skip tour
  const skipTour = useCallback(async () => {
    if (!user || !onboardingId) return;

    setShowTour(false);
    setHasCompletedTour(true);

    await supabase
      .from("user_onboarding")
      .update({
        has_completed_tour: true,
        completed_at: new Date().toISOString(),
      })
      .eq("id", onboardingId);
  }, [user, onboardingId]);

  // Restart tour
  const restartTour = useCallback(async () => {
    if (!user || !onboardingId) return;

    setCurrentStep(0);
    setShowTour(true);
    setHasCompletedTour(false);

    await supabase
      .from("user_onboarding")
      .update({
        has_completed_tour: false,
        current_step: 0,
        completed_steps: [],
        completed_at: null,
      })
      .eq("id", onboardingId);
  }, [user, onboardingId]);

  // Navigate to next step
  const nextStep = useCallback(() => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      updateStep(currentStep + 1);
    } else {
      completeTour();
    }
  }, [currentStep, updateStep, completeTour]);

  // Navigate to previous step
  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      updateStep(currentStep - 1);
    }
  }, [currentStep, updateStep]);

  return {
    isLoading,
    showTour,
    setShowTour,
    currentStep,
    hasCompletedTour,
    currentStepData: ONBOARDING_STEPS[currentStep],
    totalSteps: ONBOARDING_STEPS.length,
    nextStep,
    prevStep,
    skipTour,
    completeTour,
    restartTour,
  };
}
