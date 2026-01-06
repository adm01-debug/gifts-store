import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AchievementToastData {
  id: string;
  title: string;
  description: string;
  icon?: string;
  xpReward: number;
  coinsReward?: number;
  rarity?: "common" | "rare" | "epic" | "legendary";
}

const rarityConfig = {
  common: {
    gradient: "from-muted to-muted/50",
    border: "border-border",
    glow: "",
  },
  rare: {
    gradient: "from-info/20 to-info/5",
    border: "border-info/30",
    glow: "shadow-[0_0_20px_hsl(var(--info)/0.3)]",
  },
  epic: {
    gradient: "from-primary/20 to-primary/5",
    border: "border-primary/30",
    glow: "shadow-[0_0_25px_hsl(var(--primary)/0.4)]",
  },
  legendary: {
    gradient: "from-coins/20 to-orange/5",
    border: "border-coins/30",
    glow: "shadow-[0_0_30px_hsl(var(--coins)/0.5)]",
  },
};

interface AchievementToastProps {
  achievement: AchievementToastData;
  onDismiss: () => void;
  duration?: number;
}

function AchievementToast({ achievement, onDismiss, duration = 5000 }: AchievementToastProps) {
  const rarity = achievement.rarity || "common";
  const config = rarityConfig[rarity];

  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [onDismiss, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -100, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.8 }}
      className={cn(
        "relative overflow-hidden rounded-xl border p-4 backdrop-blur-sm",
        "bg-gradient-to-r",
        config.gradient,
        config.border,
        config.glow
      )}
    >
      {/* Sparkle effects for rare+ */}
      {rarity !== "common" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-2 right-8"
          >
            <Sparkles className="h-4 w-4 text-coins" />
          </motion.div>
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Icon */}
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={cn(
            "p-3 rounded-xl",
            rarity === "legendary" ? "bg-coins/20" : "bg-primary/10"
          )}
        >
          {achievement.icon ? (
            <span className="text-2xl">{achievement.icon}</span>
          ) : (
            <Trophy className={cn(
              "h-6 w-6",
              rarity === "legendary" ? "text-coins" : "text-primary"
            )} />
          )}
        </motion.div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Conquista Desbloqueada!
            </span>
            {rarity !== "common" && (
              <span className={cn(
                "text-[10px] font-bold uppercase px-1.5 py-0.5 rounded",
                rarity === "rare" && "bg-info/20 text-info",
                rarity === "epic" && "bg-primary/20 text-primary",
                rarity === "legendary" && "bg-coins/20 text-coins"
              )}>
                {rarity}
              </span>
            )}
          </div>
          <h4 className="font-bold text-foreground">{achievement.title}</h4>
          <p className="text-sm text-muted-foreground mt-0.5">{achievement.description}</p>
          
          {/* Rewards */}
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-sm font-medium text-xp">
              <Star className="h-4 w-4" aria-hidden="true" />
              +{achievement.xpReward} XP
            </span>
            {achievement.coinsReward && (
              <span className="flex items-center gap-1 text-sm font-medium text-coins">
                🪙 +{achievement.coinsReward}
              </span>
            )}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onDismiss}
          className="p-1 rounded-lg hover:bg-muted/50 transition-colors"
          aria-label="Fechar notificação"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </motion.div>
  );
}

// Achievement toast manager
interface AchievementToastManagerProps {
  className?: string;
}

export function AchievementToastManager({ className }: AchievementToastManagerProps) {
  const [achievements, setAchievements] = useState<AchievementToastData[]>([]);

  const addAchievement = useCallback((achievement: AchievementToastData) => {
    setAchievements(prev => [...prev, achievement]);
  }, []);

  const removeAchievement = useCallback((id: string) => {
    setAchievements(prev => prev.filter(a => a.id !== id));
  }, []);

  // Expose methods globally for other components to trigger
  useEffect(() => {
    (window as unknown as { showAchievement: typeof addAchievement }).showAchievement = addAchievement;
  }, [addAchievement]);

  return (
    <div className={cn(
      "fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-md w-full",
      className
    )}>
      <AnimatePresence mode="popLayout">
        {achievements.map((achievement) => (
          <AchievementToast
            key={achievement.id}
            achievement={achievement}
            onDismiss={() => removeAchievement(achievement.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Helper function to show achievement from anywhere
export function showAchievement(achievement: AchievementToastData) {
  const show = (window as unknown as { showAchievement?: (a: AchievementToastData) => void }).showAchievement;
  if (show) {
    show(achievement);
  }
}
