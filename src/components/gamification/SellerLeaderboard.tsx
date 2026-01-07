import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Medal, Crown, Flame, Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  user_id: string;
  xp: number;
  level: number;
  streak: number;
  coins: number;
  total_activities: number;
  profile?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface SellerLeaderboardProps {
  limit?: number;
  showHeader?: boolean;
  compact?: boolean;
  className?: string;
}

const rankIcons: Record<number, React.ReactNode> = {
  1: <Crown className="h-5 w-5 text-yellow-500" />,
  2: <Medal className="h-5 w-5 text-gray-400" />,
  3: <Medal className="h-5 w-5 text-amber-600" />,
};

const rankColors: Record<number, string> = {
  1: "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30",
  2: "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30",
  3: "bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/30",
};

export function SellerLeaderboard({ 
  limit = 10, 
  showHeader = true,
  compact = false,
  className 
}: SellerLeaderboardProps) {
  const { user } = useAuth();

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["seller-leaderboard", limit],
    queryFn: async () => {
      // Fetch gamification data for all sellers
      const { data: gamificationData, error: gamError } = await supabase
        // .from("seller_gamification") // DISABLED
        .select("*")
        .order("xp", { ascending: false })
        .limit(limit);

      if (gamError) throw gamError;

      // Fetch profiles for these users
      const userIds = gamificationData?.map(g => g.user_id) || [];
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url")
        .in("user_id", userIds);

      if (profileError) console.error("Error fetching profiles:", profileError);

      // Merge data
      const merged: LeaderboardEntry[] = (gamificationData || []).map(g => ({
        ...g,
        profile: profiles?.find(p => p.user_id === g.user_id) || null,
      }));

      return merged;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Find current user's rank
  const { data: userRank } = useQuery({
    queryKey: ["user-rank", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        // .from("seller_gamification") // DISABLED
        .select("user_id, xp")
        .order("xp", { ascending: false });

      if (error) throw error;

      const rank = data?.findIndex(g => g.user_id === user.id) ?? -1;
      return rank >= 0 ? rank + 1 : null;
    },
    enabled: !!user?.id,
  });

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const formatXP = (xp: number) => {
    if (xp >= 1000) {
      return `${(xp / 1000).toFixed(1)}k`;
    }
    return xp.toString();
  };

  if (isLoading) {
    return (
      <Card className={cn("", className)}>
        {showHeader && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Ranking de Vendedores
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("", className)}>
      {showHeader && (
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Ranking de Vendedores
            </div>
            {userRank && (
              <Badge variant="secondary" className="font-normal">
                Sua posição: #{userRank}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn("space-y-2", compact && "py-2")}>
        {leaderboard?.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            Nenhum vendedor no ranking ainda
          </div>
        ) : (
          leaderboard?.map((entry, index) => {
            const rank = index + 1;
            const isCurrentUser = entry.user_id === user?.id;
            
            return (
              <div
                key={entry.user_id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-all",
                  rank <= 3 ? rankColors[rank] : "bg-muted/30 border-transparent",
                  isCurrentUser && "ring-2 ring-primary/50",
                  compact && "p-2"
                )}
              >
                {/* Rank */}
                <div className="flex-shrink-0 w-8 text-center">
                  {rankIcons[rank] || (
                    <span className="text-sm font-medium text-muted-foreground">
                      #{rank}
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <Avatar className={cn("h-10 w-10", compact && "h-8 w-8")}>
                  <AvatarImage src={entry.profile?.avatar_url || undefined} />
                  <AvatarFallback className={cn(
                    rank === 1 && "bg-yellow-500/20 text-yellow-600",
                    rank === 2 && "bg-gray-400/20 text-gray-600",
                    rank === 3 && "bg-amber-600/20 text-amber-700",
                  )}>
                    {getInitials(entry.profile?.full_name)}
                  </AvatarFallback>
                </Avatar>

                {/* Name and Stats */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "font-medium truncate",
                      isCurrentUser && "text-primary"
                    )}>
                      {entry.profile?.full_name || "Vendedor Anônimo"}
                    </span>
                    {isCurrentUser && (
                      <Badge variant="outline" className="text-xs">
                        Você
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-primary" />
                      Nível {entry.level}
                    </span>
                    {entry.streak > 0 && (
                      <span className="flex items-center gap-1">
                        <Flame className="h-3 w-3 text-orange-500" />
                        {entry.streak} dias
                      </span>
                    )}
                  </div>
                </div>

                {/* XP */}
                <div className="flex-shrink-0 text-right">
                  <div className={cn(
                    "font-bold",
                    rank === 1 && "text-yellow-600",
                    rank === 2 && "text-gray-500",
                    rank === 3 && "text-amber-600",
                    rank > 3 && "text-primary"
                  )}>
                    {formatXP(entry.xp)} XP
                  </div>
                  {!compact && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                      <TrendingUp className="h-3 w-3" />
                      {entry.total_activities} ações
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
