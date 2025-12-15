import { Flame, Coins, Zap, Trophy } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useGamification } from "@/hooks/useGamification";
import { Progress } from "@/components/ui/progress";

export function GamificationIndicators() {
  const { level, xp, coins, streak, xpProgress, isLoading } = useGamification();

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-muted/50 animate-pulse">
        <div className="h-4 w-16 bg-muted rounded" />
        <div className="h-4 w-12 bg-muted rounded" />
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center gap-1">
      {/* Level & XP */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors cursor-default">
            <Trophy className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">Lv.{level}</span>
            <div className="w-12 h-1.5 bg-primary/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${xpProgress.percentage}%` }}
              />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <div className="text-center">
            <p className="font-medium">Nível {level}</p>
            <p className="text-xs text-muted-foreground">
              {xpProgress.current} / {xpProgress.needed} XP
            </p>
            <Progress value={xpProgress.percentage} className="h-1.5 mt-1.5 w-24" />
          </div>
        </TooltipContent>
      </Tooltip>

      {/* XP Total */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/50 hover:bg-accent transition-colors cursor-default">
            <Zap className="h-3.5 w-3.5 text-yellow-500" />
            <span className="text-xs font-medium">{xp.toLocaleString()}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>XP Total</TooltipContent>
      </Tooltip>

      {/* Coins */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors cursor-default">
            <Coins className="h-3.5 w-3.5 text-yellow-500" />
            <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
              {coins.toLocaleString()}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>Moedas</TooltipContent>
      </Tooltip>

      {/* Streak */}
      {streak > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/10 hover:bg-orange-500/20 transition-colors cursor-default">
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                {streak}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {streak} dias de sequência!
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
