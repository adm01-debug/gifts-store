import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Palette,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Package,
  MapPin,
  Layers,
  ChevronRight,
  Settings2,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
}

interface Component {
  id: string;
  product_id: string;
  component_code: string;
  component_name: string;
  is_personalizable: boolean;
  is_active: boolean;
  sort_order: number;
}

interface Location {
  id: string;
  component_id: string;
  location_code: string;
  location_name: string;
  max_width_cm: number | null;
  max_height_cm: number | null;
  max_area_cm2: number | null;
  is_active: boolean;
}

interface Technique {
  id: string;
  code: string;
  name: string;
}

interface LocationTechnique {
  id: string;
  component_location_id: string;
  technique_id: string;
  composed_code: string;
  is_default: boolean;
  is_active: boolean;
  technique?: Technique;
}

export default function AdminPersonalizationPage() {
  const queryClient = useQueryClient();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isAddComponentOpen, setIsAddComponentOpen] = useState(false);
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [isAddTechniqueOpen, setIsAddTechniqueOpen] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  // Form states
  const [newComponent, setNewComponent] = useState({ code: "", name: "" });
  const [newLocation, setNewLocation] = useState({ code: "", name: "", maxWidth: "", maxHeight: "" });
  const [newTechniqueId, setNewTechniqueId] = useState<string>("");

  // Fetch products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, sku")
        .order("name");
      if (error) throw error;
      return data as Product[];
    },
  });

  // Fetch components for selected product
  const { data: components, isLoading: componentsLoading } = useQuery({
    queryKey: ["product-components", selectedProduct],
    queryFn: async () => {
      if (!selectedProduct) return [];
      const { data, error } = await supabase
        .from("product_components")
        .select("*")
        .eq("product_id", selectedProduct)
        .order("sort_order");
      if (error) throw error;
      return data as Component[];
    },
    enabled: !!selectedProduct,
  });

  // Fetch locations for all components of selected product
  const { data: locations } = useQuery({
    queryKey: ["component-locations", selectedProduct],
    queryFn: async () => {
      if (!components?.length) return [];
      const componentIds = components.map((c) => c.id);
      const { data, error } = await supabase
        .from("product_component_locations")
        .select("*")
        .in("component_id", componentIds);
      if (error) throw error;
      return data as Location[];
    },
    enabled: !!components?.length,
  });

  // Fetch techniques
  const { data: techniques } = useQuery({
    queryKey: ["techniques"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("personalization_techniques")
        .select("id, code, name")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data as Technique[];
    },
  });

  // Fetch location techniques
  const { data: locationTechniques } = useQuery({
    queryKey: ["location-techniques", selectedProduct],
    queryFn: async () => {
      if (!locations?.length) return [];
      const locationIds = locations.map((l) => l.id);
      const { data, error } = await supabase
        .from("product_component_location_techniques")
        .select(`
          *,
          technique:personalization_techniques(id, code, name)
        `)
        .in("component_location_id", locationIds);
      if (error) throw error;
      return data as LocationTechnique[];
    },
    enabled: !!locations?.length,
  });

  // Add component mutation
  const addComponentMutation = useMutation({
    mutationFn: async (data: { product_id: string; component_code: string; component_name: string }) => {
      const { error } = await supabase.from("product_components").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-components"] });
      setIsAddComponentOpen(false);
      setNewComponent({ code: "", name: "" });
      toast.success("Componente adicionado com sucesso!");
    },
    onError: () => toast.error("Erro ao adicionar componente"),
  });

  // Add location mutation
  const addLocationMutation = useMutation({
    mutationFn: async (data: {
      component_id: string;
      location_code: string;
      location_name: string;
      max_width_cm?: number;
      max_height_cm?: number;
    }) => {
      const { error } = await supabase.from("product_component_locations").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["component-locations"] });
      setIsAddLocationOpen(false);
      setNewLocation({ code: "", name: "", maxWidth: "", maxHeight: "" });
      toast.success("Localização adicionada com sucesso!");
    },
    onError: () => toast.error("Erro ao adicionar localização"),
  });

  // Add technique to location mutation
  const addTechniqueMutation = useMutation({
    mutationFn: async (data: {
      component_location_id: string;
      technique_id: string;
      composed_code: string;
    }) => {
      const { error } = await supabase.from("product_component_location_techniques").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["location-techniques"] });
      setIsAddTechniqueOpen(false);
      setNewTechniqueId("");
      toast.success("Técnica associada com sucesso!");
    },
    onError: () => toast.error("Erro ao associar técnica"),
  });

  // Delete component mutation
  const deleteComponentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("product_components").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-components"] });
      toast.success("Componente removido!");
    },
    onError: () => toast.error("Erro ao remover componente"),
  });

  // Delete location mutation
  const deleteLocationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("product_component_locations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["component-locations"] });
      toast.success("Localização removida!");
    },
    onError: () => toast.error("Erro ao remover localização"),
  });

  // Delete technique from location mutation
  const deleteTechniqueMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("product_component_location_techniques").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["location-techniques"] });
      toast.success("Técnica removida!");
    },
    onError: () => toast.error("Erro ao remover técnica"),
  });

  const handleAddComponent = () => {
    if (!selectedProduct || !newComponent.code || !newComponent.name) return;
    addComponentMutation.mutate({
      product_id: selectedProduct,
      component_code: newComponent.code.toUpperCase(),
      component_name: newComponent.name,
    });
  };

  const handleAddLocation = () => {
    if (!selectedComponentId || !newLocation.code || !newLocation.name) return;
    addLocationMutation.mutate({
      component_id: selectedComponentId,
      location_code: newLocation.code.toUpperCase(),
      location_name: newLocation.name,
      max_width_cm: newLocation.maxWidth ? parseFloat(newLocation.maxWidth) : undefined,
      max_height_cm: newLocation.maxHeight ? parseFloat(newLocation.maxHeight) : undefined,
    });
  };

  const handleAddTechnique = () => {
    if (!selectedLocationId || !newTechniqueId) return;
    const location = locations?.find((l) => l.id === selectedLocationId);
    const component = components?.find((c) => c.id === location?.component_id);
    const technique = techniques?.find((t) => t.id === newTechniqueId);
    
    if (!location || !component || !technique) return;
    
    const composedCode = `${component.component_code}-${location.location_code}-${technique.code}`;
    
    addTechniqueMutation.mutate({
      component_location_id: selectedLocationId,
      technique_id: newTechniqueId,
      composed_code: composedCode,
    });
  };

  const getLocationsForComponent = (componentId: string) => {
    return locations?.filter((l) => l.component_id === componentId) || [];
  };

  const getTechniquesForLocation = (locationId: string) => {
    return locationTechniques?.filter((lt) => lt.component_location_id === locationId) || [];
  };

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
              Configure componentes, localizações e técnicas de personalização por produto
            </p>
          </div>
        </div>

        {/* Product Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Selecionar Produto
            </CardTitle>
            <CardDescription>
              Escolha um produto para gerenciar suas opções de personalização
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedProduct || ""}
              onValueChange={setSelectedProduct}
            >
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Selecione um produto..." />
              </SelectTrigger>
              <SelectContent>
                {productsLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  products?.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} ({product.sku})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Components Management */}
        {selectedProduct && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Componentes do Produto
                  </CardTitle>
                  <CardDescription>
                    Gerencie os componentes que podem ser personalizados
                  </CardDescription>
                </div>
                <Dialog open={isAddComponentOpen} onOpenChange={setIsAddComponentOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Componente
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Novo Componente</DialogTitle>
                      <DialogDescription>
                        Adicione um novo componente personalizável ao produto
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="component-code">Código</Label>
                        <Input
                          id="component-code"
                          placeholder="Ex: FACA, GARFO, AVENTAL"
                          value={newComponent.code}
                          onChange={(e) =>
                            setNewComponent({ ...newComponent, code: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="component-name">Nome</Label>
                        <Input
                          id="component-name"
                          placeholder="Ex: Faca, Garfo, Avental"
                          value={newComponent.name}
                          onChange={(e) =>
                            setNewComponent({ ...newComponent, name: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddComponentOpen(false)}>
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleAddComponent}
                        disabled={addComponentMutation.isPending}
                      >
                        {addComponentMutation.isPending && (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        )}
                        Salvar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {componentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : !components?.length ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum componente cadastrado</p>
                  <p className="text-sm">Clique em "Adicionar Componente" para começar</p>
                </div>
              ) : (
                <Accordion type="multiple" className="space-y-2">
                  {components.map((component) => (
                    <AccordionItem
                      key={component.id}
                      value={component.id}
                      className="border rounded-lg px-4"
                    >
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{component.component_code}</Badge>
                          <span className="font-medium">{component.component_name}</span>
                          {component.is_personalizable && (
                            <Badge variant="secondary" className="text-xs">
                              Personalizável
                            </Badge>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4 pb-2">
                        {/* Locations for this component */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Localizações
                            </h4>
                            <Dialog
                              open={isAddLocationOpen && selectedComponentId === component.id}
                              onOpenChange={(open) => {
                                setIsAddLocationOpen(open);
                                if (open) setSelectedComponentId(component.id);
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Plus className="h-3 w-3 mr-1" />
                                  Localização
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Nova Localização</DialogTitle>
                                  <DialogDescription>
                                    Adicione uma área de personalização para {component.component_name}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="location-code">Código</Label>
                                    <Input
                                      id="location-code"
                                      placeholder="Ex: CABO, LAMINA, FRENTE"
                                      value={newLocation.code}
                                      onChange={(e) =>
                                        setNewLocation({ ...newLocation, code: e.target.value })
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="location-name">Nome</Label>
                                    <Input
                                      id="location-name"
                                      placeholder="Ex: Cabo, Lâmina, Frente"
                                      value={newLocation.name}
                                      onChange={(e) =>
                                        setNewLocation({ ...newLocation, name: e.target.value })
                                      }
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="max-width">Largura Máx. (cm)</Label>
                                      <Input
                                        id="max-width"
                                        type="number"
                                        placeholder="Ex: 10"
                                        value={newLocation.maxWidth}
                                        onChange={(e) =>
                                          setNewLocation({ ...newLocation, maxWidth: e.target.value })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="max-height">Altura Máx. (cm)</Label>
                                      <Input
                                        id="max-height"
                                        type="number"
                                        placeholder="Ex: 5"
                                        value={newLocation.maxHeight}
                                        onChange={(e) =>
                                          setNewLocation({ ...newLocation, maxHeight: e.target.value })
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => setIsAddLocationOpen(false)}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button
                                    onClick={handleAddLocation}
                                    disabled={addLocationMutation.isPending}
                                  >
                                    {addLocationMutation.isPending && (
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    )}
                                    Salvar
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>

                          {getLocationsForComponent(component.id).length === 0 ? (
                            <p className="text-sm text-muted-foreground pl-6">
                              Nenhuma localização cadastrada
                            </p>
                          ) : (
                            <div className="space-y-3 pl-6">
                              {getLocationsForComponent(component.id).map((location) => (
                                <div
                                  key={location.id}
                                  className="border rounded-lg p-3 bg-muted/30"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="secondary" className="text-xs">
                                        {location.location_code}
                                      </Badge>
                                      <span className="text-sm font-medium">
                                        {location.location_name}
                                      </span>
                                      {location.max_width_cm && location.max_height_cm && (
                                        <span className="text-xs text-muted-foreground">
                                          ({location.max_width_cm}x{location.max_height_cm}cm)
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Dialog
                                        open={
                                          isAddTechniqueOpen && selectedLocationId === location.id
                                        }
                                        onOpenChange={(open) => {
                                          setIsAddTechniqueOpen(open);
                                          if (open) setSelectedLocationId(location.id);
                                        }}
                                      >
                                        <DialogTrigger asChild>
                                          <Button size="sm" variant="ghost">
                                            <Plus className="h-3 w-3" />
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>Associar Técnica</DialogTitle>
                                            <DialogDescription>
                                              Adicione uma técnica de personalização para{" "}
                                              {location.location_name}
                                            </DialogDescription>
                                          </DialogHeader>
                                          <div>
                                            <Label>Técnica</Label>
                                            <Select
                                              value={newTechniqueId}
                                              onValueChange={setNewTechniqueId}
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Selecione uma técnica..." />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {techniques?.map((tech) => (
                                                  <SelectItem key={tech.id} value={tech.id}>
                                                    {tech.name} ({tech.code})
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <DialogFooter>
                                            <Button
                                              variant="outline"
                                              onClick={() => setIsAddTechniqueOpen(false)}
                                            >
                                              Cancelar
                                            </Button>
                                            <Button
                                              onClick={handleAddTechnique}
                                              disabled={addTechniqueMutation.isPending}
                                            >
                                              {addTechniqueMutation.isPending && (
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                              )}
                                              Associar
                                            </Button>
                                          </DialogFooter>
                                        </DialogContent>
                                      </Dialog>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => deleteLocationMutation.mutate(location.id)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Techniques for this location */}
                                  <div className="flex flex-wrap gap-1">
                                    {getTechniquesForLocation(location.id).map((lt) => (
                                      <Badge
                                        key={lt.id}
                                        variant={lt.is_default ? "default" : "outline"}
                                        className="text-xs gap-1 group"
                                      >
                                        {lt.technique?.name || lt.composed_code}
                                        <button
                                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                                          onClick={() => deleteTechniqueMutation.mutate(lt.id)}
                                        >
                                          ×
                                        </button>
                                      </Badge>
                                    ))}
                                    {getTechniquesForLocation(location.id).length === 0 && (
                                      <span className="text-xs text-muted-foreground">
                                        Nenhuma técnica associada
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Component actions */}
                        <div className="flex justify-end mt-4 pt-4 border-t">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteComponentMutation.mutate(component.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remover Componente
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
