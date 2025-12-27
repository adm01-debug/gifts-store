import { motion } from "framer-motion";
import { Package, ToggleLeft, ToggleRight, Gift } from "lucide-react";
import { useRewardsStore } from "@/hooks/useRewardsStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function MyRewards() {
  const {
    userRewards,
    isLoading,
    toggleReward,
    categoryNames,
  } = useRewardsStore();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (!userRewards || userRewards.length === 0) {
    return (
      <Card className="p-12">
        <div className="flex flex-col items-center text-center">
          <Gift className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma recompensa adquirida</h3>
          <p className="text-muted-foreground">
            Visite a loja para adquirir suas primeiras recompensas!
          </p>
        </div>
      </Card>
    );
  }

  // Group by category
  const rewardsByCategory = userRewards.reduce((acc, ur) => {
    const category = ur.reward?.category || "general";
    if (!acc[category]) acc[category] = [];
    acc[category].push(ur);
    return acc;
  }, {} as Record<string, typeof userRewards>);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
          <Package className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Minhas Recompensas</h2>
          <p className="text-muted-foreground">
            {userRewards.length} recompensa{userRewards.length !== 1 ? "s" : ""} adquirida{userRewards.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {Object.entries(rewardsByCategory).map(([category, rewards]) => (
        <div key={category} className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {categoryNames[category] || category}
            <Badge variant="secondary">{rewards.length}</Badge>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rewards.map((userReward, index) => (
              <motion.div
                key={userReward.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={cn(
                  "transition-all duration-300",
                  userReward.is_active && "ring-2 ring-primary/50 bg-primary/5"
                )}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{userReward.reward?.icon}</div>
                        <div>
                          <CardTitle className="text-base">
                            {userReward.reward?.name}
                          </CardTitle>
                          <CardDescription>
                            {userReward.reward?.description}
                          </CardDescription>
                        </div>
                      </div>
                      
                      {userReward.reward?.reward_type !== "boost" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleReward({
                            rewardId: userReward.reward_id,
                            isActive: !userReward.is_active,
                          })}
                          className="gap-1"
                        >
                          {userReward.is_active ? (
                            <>
                              <ToggleRight className="h-5 w-5 text-primary" />
                              <span className="text-primary">Ativo</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                              <span className="text-muted-foreground">Inativo</span>
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">
                      Adquirido em {new Date(userReward.purchased_at).toLocaleDateString("pt-BR")}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
