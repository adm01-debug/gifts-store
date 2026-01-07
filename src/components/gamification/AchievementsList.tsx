import { useAchievements, useUserAchievements, Achievement } from "@/hooks/useAchievements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Lock, Star, Coins } from "lucide-react";

interface AchievementsListProps {
  userId: string;
}

export function AchievementsList({ userId }: AchievementsListProps) {
  const { achievements, byCategory, isLoading } = useAchievements();
  const { userAchievements } = useUserAchievements(userId);

  const earnedIds = new Set(userAchievements.map((ua) => ua.achievement_id));

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const categories = Object.keys(byCategory);
  const totalAchievements = achievements.length;
  const earnedCount = userAchievements.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Conquistas
          </CardTitle>
          <Badge variant="secondary">
            {earnedCount} / {totalAchievements}
          </Badge>
        </div>
        <Progress value={(earnedCount / totalAchievements) * 100} className="h-2 mt-2" />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={categories[0]} className="w-full">
          <TabsList className="mb-4 flex-wrap">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="flex items-center gap-1">
                {cat}
                <Badge variant="outline" className="ml-1 text-xs">
                  {byCategory[cat].filter((a) => earnedIds.has(a.id)).length}/
                  {byCategory[cat].length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((cat) => (
            <TabsContent key={cat} value={cat}>
              <div className="space-y-3">
                {byCategory[cat].map((achievement) => {
                  const isEarned = earnedIds.has(achievement.id);
                  return (
                    <AchievementItem
                      key={achievement.id}
                      achievement={achievement}
                      isEarned={isEarned}
                    />
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

function AchievementItem({
  achievement,
  isEarned,
}: {
  achievement: Achievement;
  isEarned: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
        isEarned ? "bg-amber-50 border-amber-200" : "bg-muted/30 opacity-60"
      }`}
    >
      <div
        className={`text-3xl w-12 h-12 flex items-center justify-center rounded-full ${
          isEarned ? "bg-amber-100" : "bg-muted"
        }`}
      >
        {isEarned ? (
          achievement.icon || "🏆"
        ) : (
          <Lock className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{achievement.name}</h4>
        {achievement.description && (
          <p className="text-sm text-muted-foreground">{achievement.description}</p>
        )}
      </div>
      <div className="flex flex-col items-end gap-1">
        {isEarned ? (
          <Badge className="bg-amber-500">Conquistado!</Badge>
        ) : (
          <Badge variant="outline">
            {achievement.requirement_type}: {achievement.requirement_value}
          </Badge>
        )}
        <div className="flex items-center gap-2 text-sm">
          <span className="flex items-center gap-1 text-purple-600">
            <Star className="h-3 w-3" />
            {achievement.xp_reward} XP
          </span>
          <span className="flex items-center gap-1 text-amber-600">
            <Coins className="h-3 w-3" />
            {achievement.coins_reward}
          </span>
        </div>
      </div>
    </div>
  );
}
