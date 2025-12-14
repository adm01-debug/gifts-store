import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Trash2,
  Loader2,
  Palette,
} from "lucide-react";
import { InlineEditField } from "./InlineEditField";

interface Technique {
  id: string;
  code: string | null;
  name: string;
  description: string | null;
  setup_cost: number | null;
  unit_cost: number | null;
  min_quantity: number | null;
  estimated_days: number | null;
  is_active: boolean;
}

export function TechniquesManager() {
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTechnique, setNewTechnique] = useState({
    code: "",
    name: "",
    description: "",
    setupCost: "",
    unitCost: "",
    minQuantity: "",
    estimatedDays: "",
  });

  const { data: techniques, isLoading } = useQuery({
    queryKey: ["all-techniques"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("personalization_techniques")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as Technique[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: {
      code?: string;
      name: string;
      description?: string;
      setup_cost?: number;
      unit_cost?: number;
      min_quantity?: number;
      estimated_days?: number;
    }) => {
      const { error } = await supabase.from("personalization_techniques").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-techniques"] });
      setIsAddOpen(false);
      setNewTechnique({ code: "", name: "", description: "", setupCost: "", unitCost: "", minQuantity: "", estimatedDays: "" });
      toast.success("Técnica criada!");
    },
    onError: () => toast.error("Erro ao criar técnica"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string; code?: string; name?: string; description?: string; setup_cost?: number | null; unit_cost?: number | null; min_quantity?: number | null; estimated_days?: number | null; is_active?: boolean }) => {
      const { error } = await supabase.from("personalization_techniques").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-techniques"] });
      toast.success("Técnica atualizada!");
    },
    onError: () => toast.error("Erro ao atualizar técnica"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("personalization_techniques").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-techniques"] });
      toast.success("Técnica removida!");
    },
    onError: () => toast.error("Erro ao remover técnica"),
  });

  const handleAdd = () => {
    if (!newTechnique.name) return;
    addMutation.mutate({
      code: newTechnique.code.toUpperCase() || undefined,
      name: newTechnique.name,
      description: newTechnique.description || undefined,
      setup_cost: newTechnique.setupCost ? parseFloat(newTechnique.setupCost) : undefined,
      unit_cost: newTechnique.unitCost ? parseFloat(newTechnique.unitCost) : undefined,
      min_quantity: newTechnique.minQuantity ? parseInt(newTechnique.minQuantity) : undefined,
      estimated_days: newTechnique.estimatedDays ? parseInt(newTechnique.estimatedDays) : undefined,
    });
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return "—";
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Técnicas de Personalização
            </CardTitle>
            <CardDescription>
              Gerencie as técnicas disponíveis e seus custos base
            </CardDescription>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Técnica
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Nova Técnica de Personalização</DialogTitle>
                <DialogDescription>
                  Adicione uma nova técnica com seus custos e configurações
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Código</Label>
                    <Input
                      placeholder="Ex: SERI, LASER"
                      value={newTechnique.code}
                      onChange={(e) => setNewTechnique({ ...newTechnique, code: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Nome</Label>
                    <Input
                      placeholder="Ex: Serigrafia"
                      value={newTechnique.name}
                      onChange={(e) => setNewTechnique({ ...newTechnique, name: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Descrição</Label>
                  <Textarea
                    placeholder="Descrição da técnica..."
                    value={newTechnique.description}
                    onChange={(e) => setNewTechnique({ ...newTechnique, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Custo de Setup (R$)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={newTechnique.setupCost}
                      onChange={(e) => setNewTechnique({ ...newTechnique, setupCost: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Custo Unitário (R$)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={newTechnique.unitCost}
                      onChange={(e) => setNewTechnique({ ...newTechnique, unitCost: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Qtd. Mínima</Label>
                    <Input
                      type="number"
                      placeholder="1"
                      value={newTechnique.minQuantity}
                      onChange={(e) => setNewTechnique({ ...newTechnique, minQuantity: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Prazo (dias)</Label>
                    <Input
                      type="number"
                      placeholder="1"
                      value={newTechnique.estimatedDays}
                      onChange={(e) => setNewTechnique({ ...newTechnique, estimatedDays: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAdd} disabled={addMutation.isPending}>
                  {addMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Criar Técnica
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : !techniques?.length ? (
          <div className="text-center py-8 text-muted-foreground">
            <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma técnica cadastrada</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Setup</TableHead>
                <TableHead>Unitário</TableHead>
                <TableHead>Qtd. Mín.</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {techniques.map((technique) => (
                <TableRow key={technique.id}>
                  <TableCell>
                    <InlineEditField
                      value={technique.code || ""}
                      onSave={(value) => updateMutation.mutate({ id: technique.id, code: value.toUpperCase() || undefined })}
                      placeholder="—"
                      className="font-mono text-xs"
                    />
                  </TableCell>
                  <TableCell>
                    <InlineEditField
                      value={technique.name}
                      onSave={(value) => updateMutation.mutate({ id: technique.id, name: value })}
                    />
                  </TableCell>
                  <TableCell>
                    <InlineEditField
                      value={technique.setup_cost?.toString() || ""}
                      onSave={(value) => updateMutation.mutate({ id: technique.id, setup_cost: value ? parseFloat(value) : null })}
                      type="number"
                      placeholder="—"
                    />
                  </TableCell>
                  <TableCell>
                    <InlineEditField
                      value={technique.unit_cost?.toString() || ""}
                      onSave={(value) => updateMutation.mutate({ id: technique.id, unit_cost: value ? parseFloat(value) : null })}
                      type="number"
                      placeholder="—"
                    />
                  </TableCell>
                  <TableCell>
                    <InlineEditField
                      value={technique.min_quantity?.toString() || ""}
                      onSave={(value) => updateMutation.mutate({ id: technique.id, min_quantity: value ? parseInt(value) : null })}
                      type="number"
                      placeholder="—"
                    />
                  </TableCell>
                  <TableCell>
                    <InlineEditField
                      value={technique.estimated_days?.toString() || ""}
                      onSave={(value) => updateMutation.mutate({ id: technique.id, estimated_days: value ? parseInt(value) : null })}
                      type="number"
                      placeholder="—"
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={technique.is_active}
                      onCheckedChange={(checked) => updateMutation.mutate({ id: technique.id, is_active: checked })}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteMutation.mutate(technique.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
