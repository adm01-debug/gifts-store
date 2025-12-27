import { useState } from "react";
import { Coins, Check, ShoppingBag, Sparkles, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRewardsStore, StoreReward } from "@/hooks/useRewardsStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

function RewardCard({ 
  reward, 
  owned, 
  canAfford, 
  onPurchase, 
  isPurchasing 
}: { 
  reward: StoreReward;
  owned: boolean;
  canAfford: boolean;
  onPurchase: () => void;
  isPurchasing: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
        owned && "ring-2 ring-primary/50 bg-primary/5",
        !canAfford && !owned && "opacity-60"
      )}>
        {owned && (
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-primary text-primary-foreground gap-1">
              <Check className="h-3 w-3" />
              Adquirido
            </Badge>
          </div>
        )}
        
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="text-4xl">{reward.icon}</div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{reward.name}</CardTitle>
              <CardDescription className="line-clamp-2 mt-1">
                {reward.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-amber-500 font-semibold">
              <Coins className="h-4 w-4" />
              <span>{reward.coin_cost}</span>
            </div>
            
            {owned ? (
              <Button variant="outline" size="sm" disabled>
                <Check className="h-4 w-4 mr-1" />
                Adquirido
              </Button>
            ) : (
              <Button 
                size="sm" 
                disabled={!canAfford || isPurchasing}
                onClick={onPurchase}
                className="gap-1"
              >
                {isPurchasing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Comprando...
                  </>
                ) : !canAfford ? (
                  <>
                    <Lock className="h-4 w-4" />
                    Bloqueado
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    Comprar
                  </>
                )}
              </Button>
            )}
          </div>
          
          {reward.stock !== null && (
            <p className="text-xs text-muted-foreground mt-2">
              {reward.stock > 0 ? `${reward.stock} restantes` : "Esgotado"}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function RewardCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-9 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

export function RewardsStore() {
  const {
    rewards,
    rewardsByCategory,
    ownedRewardIds,
    isLoading,
    purchaseReward,
    isPurchasing,
    coins,
    categoryNames,
  } = useRewardsStore();

  const [confirmReward, setConfirmReward] = useState<StoreReward | null>(null);

  const handlePurchase = async () => {
    if (!confirmReward) return;
    
    try {
      await purchaseReward(confirmReward);
    } finally {
      setConfirmReward(null);
    }
  };

  const categories = Object.keys(rewardsByCategory);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <RewardCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <ShoppingBag className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Loja de Recompensas</h2>
            <p className="text-muted-foreground">
              Use suas moedas para desbloquear recompensas exclusivas
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
          <Coins className="h-5 w-5 text-amber-500" />
          <span className="font-bold text-amber-500">{coins}</span>
          <span className="text-muted-foreground">moedas</span>
        </div>
      </div>

      {/* Tabs by Category */}
      <Tabs defaultValue={categories[0] || "all"} className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
          {categories.map((category) => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="flex items-center gap-1.5"
            >
              <span>{categoryNames[category] || category}</span>
              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                {rewardsByCategory[category]?.length || 0}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <AnimatePresence mode="wait">
          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {rewardsByCategory[category]?.map((reward) => (
                  <RewardCard
                    key={reward.id}
                    reward={reward}
                    owned={ownedRewardIds.has(reward.id)}
                    canAfford={coins >= reward.coin_cost}
                    onPurchase={() => setConfirmReward(reward)}
                    isPurchasing={isPurchasing && confirmReward?.id === reward.id}
                  />
                ))}
              </motion.div>
            </TabsContent>
          ))}
        </AnimatePresence>
      </Tabs>

      {/* Empty state */}
      {(!rewards || rewards.length === 0) && (
        <Card className="p-12">
          <div className="flex flex-col items-center text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma recompensa disponível</h3>
            <p className="text-muted-foreground">
              Novas recompensas serão adicionadas em breve!
            </p>
          </div>
        </Card>
      )}

      {/* Confirm Purchase Dialog */}
      <AlertDialog open={!!confirmReward} onOpenChange={() => setConfirmReward(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{confirmReward?.icon}</span>
              Confirmar Compra
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>Deseja comprar <strong>{confirmReward?.name}</strong>?</p>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <span>Custo:</span>
                <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                  <Coins className="h-4 w-4" />
                  <span>{confirmReward?.coin_cost}</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <span>Seu saldo após:</span>
                <div className="flex items-center gap-1.5 font-bold">
                  <Coins className="h-4 w-4 text-muted-foreground" />
                  <span>{coins - (confirmReward?.coin_cost || 0)}</span>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handlePurchase} disabled={isPurchasing}>
              {isPurchasing ? "Comprando..." : "Confirmar Compra"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
