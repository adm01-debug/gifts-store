import { motion, AnimatePresence } from "framer-motion";
import { Coins, Star, Zap, Trophy, Gift } from "lucide-react";

type RewardType = "xp" | "coins" | "streak" | "trophy" | "gift";

interface FloatingRewardProps {
  show: boolean;
  value: string | number;
  type?: RewardType;
  onComplete?: () => void;
}

const rewardConfig: Record<RewardType, { icon: typeof Star; color: string; bgColor: string }> = {
  xp: {
    icon: Zap,
    color: "text-xp-foreground",
    bgColor: "bg-xp",
  },
  coins: {
    icon: Coins,
    color: "text-coins-foreground",
    bgColor: "bg-coins",
  },
  streak: {
    icon: Star,
    color: "text-streak-foreground",
    bgColor: "bg-streak",
  },
  trophy: {
    icon: Trophy,
    color: "text-rank-gold-foreground",
    bgColor: "bg-rank-gold",
  },
  gift: {
    icon: Gift,
    color: "text-primary-foreground",
    bgColor: "bg-primary",
  },
};

export function FloatingReward({
  show,
  value,
  type = "xp",
  onComplete,
}: FloatingRewardProps) {
  const config = rewardConfig[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={onComplete}
        >
          <motion.div
            className={`flex items-center gap-2 rounded-full px-4 py-2 shadow-lg ${config.bgColor}`}
            initial={{ scale: 0, y: 50 }}
            animate={{ 
              scale: [0, 1.2, 1],
              y: [50, -20, -80],
            }}
            exit={{ 
              scale: 0.5,
              y: -150,
              opacity: 0,
            }}
            transition={{
              duration: 1.2,
              ease: [0.175, 0.885, 0.32, 1.275],
            }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 15, -15, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 0.5,
                delay: 0.3,
                repeat: 1,
              }}
            >
              <Icon className={`h-5 w-5 ${config.color}`} />
            </motion.div>
            <motion.span
              className={`font-display text-lg font-bold ${config.color}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              +{value}
            </motion.span>
          </motion.div>

          {/* Particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute h-2 w-2 rounded-full ${config.bgColor}`}
              initial={{ 
                opacity: 0.8,
                scale: 0,
                x: 0,
                y: 0,
              }}
              animate={{ 
                opacity: 0,
                scale: [0, 1, 0.5],
                x: Math.cos((i / 6) * Math.PI * 2) * 60,
                y: Math.sin((i / 6) * Math.PI * 2) * 60 - 40,
              }}
              transition={{
                duration: 0.8,
                delay: 0.4,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
