import { useSellerGamification } from "@/hooks/useSellerGamification";
import { useUserAchievements } from "@/hooks/useAchievements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Trophy,
  Star,
  Coins,
  Flame,
  TrendingUp,
  Award,
} from "lucide-react";

interface GamificationDashboardProps {
  userId: string;
}

export function GamificationDashboard({ userId }: GamificationDashboardProps) {
  const { gamification, xpToNextLevel, levelProgress, isLoading } =
    useSellerGamification(userId);
  const { userAchievements } = useUserAchievements(userId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!gamification) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Trophy className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Comece a usar o sistema para ganhar XP e moedas!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nível</p>
                <p className="text-2xl font-bold">{gamification.level}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">XP Total</p>
                <p className="text-2xl font-bold">{gamification.xp.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Coins className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Moedas</p>
                <p className="text-2xl font-bold">{gamification.coins.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Flame className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Streak</p>
                <p className="text-2xl font-bold">{gamification.streak} dias</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Progresso para o Nível {gamification.level + 1}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={levelProgress} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">
            Faltam <span className="font-medium">{xpToNextLevel} XP</span> para o próximo nível
          </p>
        </CardContent>
      </Card>

      {userAchievements.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              Conquistas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userAchievements.slice(0, 5).map((ua) => (
                <Badge key={ua.id} variant="secondary" className="flex items-center gap-1 py-1 px-3">
                  {ua.achievement?.icon && <span>{ua.achievement.icon}</span>}
                  {ua.achievement?.name}
                </Badge>
              ))}
              {userAchievements.length > 5 && (
                <Badge variant="outline">+{userAchievements.length - 5} mais</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
