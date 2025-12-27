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
    description: "Vamos fazer um tour completo pelas funcionalidades do sistema. Você descobrirá recursos poderosos para turbinar suas vendas!",
    targetSelector: "[data-tour='sidebar']",
    position: "right",
  },
  {
    id: "products",
    title: "Catálogo de Produtos",
    description: "Explore milhares de produtos com filtros avançados, busca inteligente e visualização em grid ou lista. Favorite itens para acesso rápido!",
    targetSelector: "[data-tour='products']",
    position: "right",
    route: "/",
  },
  {
    id: "search",
    title: "Busca Inteligente",
    description: "Use Ctrl+K para busca rápida! Suporte a busca por voz 🎤, busca visual por imagem 📷, e busca semântica com IA.",
    targetSelector: "[data-tour='search']",
    position: "bottom",
  },
  {
    id: "quotes",
    title: "Gestão de Orçamentos",
    description: "Crie orçamentos profissionais com cálculo automático de personalização. Use o Kanban para acompanhar o funil de vendas!",
    targetSelector: "[data-tour='quotes']",
    position: "right",
    route: "/orcamentos",
  },
  {
    id: "clients",
    title: "CRM de Clientes",
    description: "Gerencie clientes com análise RFM, histórico completo de interações, preferências de cores e recomendações personalizadas por IA.",
    targetSelector: "[data-tour='clients']",
    position: "right",
  },
  {
    id: "collections",
    title: "Coleções Personalizadas",
    description: "Organize produtos em coleções temáticas. Ideal para apresentar seleções especiais para diferentes clientes ou campanhas!",
    targetSelector: "[data-tour='sidebar']",
    position: "right",
    route: "/colecoes",
  },
  {
    id: "simulator",
    title: "Simulador de Personalização",
    description: "Calcule custos de personalização em tempo real. Configure técnicas (silk, bordado, laser), posições, cores e quantidades!",
    targetSelector: "[data-tour='sidebar']",
    position: "right",
    route: "/simulador",
  },
  {
    id: "mockup",
    title: "Gerador de Mockups",
    description: "Crie visualizações profissionais com logo do cliente! Posicione a arte, ajuste tamanho e gere mockups para apresentações.",
    targetSelector: "[data-tour='sidebar']",
    position: "right",
    route: "/mockup",
  },
  {
    id: "bi-dashboard",
    title: "Dashboard de BI",
    description: "Acompanhe métricas de vendas, metas, conversões e tendências. Visualize dados em tempo real para tomar decisões estratégicas!",
    targetSelector: "[data-tour='bi']",
    position: "right",
    route: "/bi",
  },
  {
    id: "trends",
    title: "Análise de Tendências",
    description: "Descubra produtos em alta, categorias mais buscadas e padrões de compra. Antecipe demandas e surpreenda seus clientes!",
    targetSelector: "[data-tour='sidebar']",
    position: "right",
    route: "/tendencias",
  },
  {
    id: "gamification",
    title: "Sistema de Gamificação",
    description: "Ganhe XP e moedas por cada atividade! Suba de nível, desbloqueie conquistas e troque coins por recompensas exclusivas na loja.",
    targetSelector: "[data-tour='gamification']",
    position: "bottom",
  },
  {
    id: "notifications",
    title: "Central de Notificações",
    description: "Receba alertas importantes, lembretes de follow-up e atualizações de orçamentos. Configure lembretes para nunca perder um deal!",
    targetSelector: "[data-tour='notifications']",
    position: "bottom",
  },
  {
    id: "expert-chat",
    title: "Chat com Especialista IA",
    description: "Precisa de ajuda? O botão flutuante de chat conecta você a um especialista IA que conhece todo o catálogo e pode sugerir produtos!",
    targetSelector: "[data-tour='sidebar']",
    position: "right",
  },
  {
    id: "compare",
    title: "Comparador de Produtos",
    description: "Selecione até 4 produtos para comparar lado a lado. Compare preços, especificações e opções de personalização de fornecedores!",
    targetSelector: "[data-tour='sidebar']",
    position: "right",
    route: "/comparar",
  },
  {
    id: "orders",
    title: "Gestão de Pedidos",
    description: "Acompanhe pedidos do início ao fim. Controle status de produção, fulfillment, rastreamento e histórico completo de alterações.",
    targetSelector: "[data-tour='sidebar']",
    position: "right",
    route: "/pedidos",
  },
  {
    id: "complete",
    title: "Pronto para vender!",
    description: "Você completou o tour! Explore todas as funcionalidades e use o botão de ajuda (?) no canto inferior direito para refazer o tour.",
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
