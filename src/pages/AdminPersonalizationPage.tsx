import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, FolderOpen, Layers, Package } from "lucide-react";
import { ProductGroupsManager } from "@/components/admin/ProductGroupsManager";
import { GroupPersonalizationManager } from "@/components/admin/GroupPersonalizationManager";
import { TechniquesManager } from "@/components/admin/TechniquesManager";

export default function AdminPersonalizationPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <Palette className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Personalização</h1>
            <p className="text-muted-foreground">
              Configure grupos, componentes, localizações e técnicas de personalização
            </p>
          </div>
        </div>

        <Tabs defaultValue="groups" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Grupos
            </TabsTrigger>
            <TabsTrigger value="personalization" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Regras por Grupo
            </TabsTrigger>
            <TabsTrigger value="techniques" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Técnicas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="groups">
            <ProductGroupsManager />
          </TabsContent>

          <TabsContent value="personalization">
            <GroupPersonalizationManager />
          </TabsContent>

          <TabsContent value="techniques">
            <TechniquesManager />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
