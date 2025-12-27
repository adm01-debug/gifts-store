import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ShoppingBag, Package } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { RewardsStore } from "@/components/gamification/RewardsStore";
import { MyRewards } from "@/components/gamification/MyRewards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RewardsStorePage() {
  const [activeTab, setActiveTab] = useState("store");

  return (
    <MainLayout>
      <Helmet>
        <title>Loja de Recompensas | Gifts Store</title>
        <meta name="description" content="Use suas moedas para desbloquear recompensas exclusivas" />
      </Helmet>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="store" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Loja
            </TabsTrigger>
            <TabsTrigger value="my-rewards" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Minhas Recompensas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="store">
            <RewardsStore />
          </TabsContent>

          <TabsContent value="my-rewards">
            <MyRewards />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
