import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { QuoteTemplatesList } from "@/components/quotes/QuoteTemplatesList";
import { QuoteTemplateForm } from "@/components/quotes/QuoteTemplateForm";
import { QuoteTemplate } from "@/hooks/useQuoteTemplates";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type ViewMode = "list" | "create" | "edit";

export default function QuoteTemplatesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingTemplate, setEditingTemplate] = useState<QuoteTemplate | null>(null);

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setViewMode("create");
  };

  const handleEditTemplate = (template: QuoteTemplate) => {
    setEditingTemplate(template);
    setViewMode("edit");
  };

  const handleSaveComplete = () => {
    setViewMode("list");
    setEditingTemplate(null);
  };

  const handleCancel = () => {
    setViewMode("list");
    setEditingTemplate(null);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          {viewMode !== "list" && (
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {viewMode === "list" && "Templates de Orçamento"}
              {viewMode === "create" && "Novo Template"}
              {viewMode === "edit" && "Editar Template"}
            </h1>
            <p className="text-muted-foreground">
              {viewMode === "list" && "Gerencie seus templates reutilizáveis para orçamentos"}
              {viewMode === "create" && "Crie um novo template de orçamento"}
              {viewMode === "edit" && `Editando: ${editingTemplate?.name}`}
            </p>
          </div>
        </div>

        {viewMode === "list" && (
          <QuoteTemplatesList
            onCreateTemplate={handleCreateTemplate}
            onEditTemplate={handleEditTemplate}
          />
        )}

        {(viewMode === "create" || viewMode === "edit") && (
          <QuoteTemplateForm
            template={editingTemplate}
            onSave={handleSaveComplete}
            onCancel={handleCancel}
          />
        )}
      </div>
    </MainLayout>
  );
}
