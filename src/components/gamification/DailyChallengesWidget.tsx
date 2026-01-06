import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Flame, 
  Star, 
  Trophy, 
  Target, 
  Gift, 
  CheckCircle,
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  xpReward: number;
  coinsReward: number;
  icon: "quotes" | "products" | "clients" | "mockups";
  completed: boolean;
}

const iconMap = {
  quotes: Target,
  products: Star,
  clients: Trophy,
  mockups: Gift,
};

interface DailyChallengesWidgetProps {
  challenges?: DailyChallenge[];
  streak?: number;
  className?: string;
}

// Mock data for demo
const defaultChallenges: DailyChallenge[] = [
  {
    id: "1",
    title: "Criar 3 orçamentos",
    description: "Crie orçamentos para seus clientes",
    progress: 1,
    target: 3,
    xpReward: 50,
    coinsReward: 10,
    icon: "quotes",
    completed: false,
  },
  {
    id: "2",
    title: "Visualizar 10 produtos",
    description: "Explore o catálogo de produtos",
    progress: 10,
    target: 10,
    xpReward: 25,
    coinsReward: 5,
    icon: "products",
    completed: true,
  },
  {
    id: "3",
    title: "Gerar 1 mockup",
    description: "Use o gerador de mockups",
    progress: 0,
    target: 1,
    xpReward: 30,
    coinsReward: 8,
    icon: "mockups",
    completed: false,
  },
];

export function DailyChallengesWidget({ 
  challenges = defaultChallenges,
  streak = 5,
  className 
}: DailyChallengesWidgetProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [dismissedChallenges, setDismissedChallenges] = useState<string[]>([]);

  const visibleChallenges = challenges.filter(c => !dismissedChallenges.includes(c.id));
  const completedCount = challenges.filter(c => c.completed).length;
  const allCompleted = completedCount === challenges.length;

  useEffect(() => {
    if (allCompleted && !showCelebration) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [allCompleted, showCelebration]);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" aria-hidden="true" />
            Desafios do Dia
          </CardTitle>
          <div className="flex items-center gap-1 text-sm">
            <Flame className="h-4 w-4 text-orange" aria-hidden="true" />
            <span className="font-bold text-orange">{streak}</span>
            <span className="text-muted-foreground">dias</span>
          </div>
        </div>
        <Progress 
          value={(completedCount / challenges.length) * 100} 
          className="h-2 mt-2"
          aria-label={`${completedCount} de ${challenges.length} desafios completos`}
        />
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence mode="popLayout">
          {visibleChallenges.map((challenge) => {
            const Icon = iconMap[challenge.icon];
            const progress = Math.min((challenge.progress / challenge.target) * 100, 100);

            return (
              <motion.div
                key={challenge.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border transition-colors",
                  challenge.completed 
                    ? "bg-success/5 border-success/20" 
                    : "bg-muted/30 hover:bg-muted/50"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg shrink-0",
                  challenge.completed ? "bg-success/10" : "bg-primary/10"
                )}>
                  {challenge.completed ? (
                    <CheckCircle className="h-5 w-5 text-success" aria-hidden="true" />
                  ) : (
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={cn(
                      "font-medium text-sm",
                      challenge.completed && "line-through text-muted-foreground"
                    )}>
                      {challenge.title}
                    </h4>
                    {challenge.completed && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0"
                        onClick={() => setDismissedChallenges(prev => [...prev, challenge.id])}
                        aria-label="Dispensar desafio"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  
                  {!challenge.completed && (
                    <>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {challenge.progress}/{challenge.target} - {challenge.description}
                      </p>
                      <Progress 
                        value={progress} 
                        className="h-1.5 mt-2"
                        aria-label={`Progresso: ${challenge.progress} de ${challenge.target}`}
                      />
                    </>
                  )}

                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="flex items-center gap-1 text-xp">
                      <Star className="h-3 w-3" aria-hidden="true" />
                      +{challenge.xpReward} XP
                    </span>
                    <span className="flex items-center gap-1 text-coins">
                      <Gift className="h-3 w-3" aria-hidden="true" />
                      +{challenge.coinsReward} 🪙
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Celebration overlay */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Trophy className="h-12 w-12 text-coins mx-auto mb-2" />
                </motion.div>
                <p className="font-bold text-lg">Todos os desafios completos!</p>
                <p className="text-sm text-muted-foreground">Volte amanhã para mais</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
