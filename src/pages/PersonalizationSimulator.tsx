import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Calculator, 
  Package, 
  Palette, 
  Ruler, 
  Clock, 
  DollarSign,
  Loader2,
  Info,
  Send,
  Trash2,
  Plus,
  Copy,
  Check
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
}

interface Technique {
  id: string;
  code: string;
  name: string;
  description: string | null;
  unit_cost: number;
  setup_cost: number;
  estimated_days: number;
  min_quantity: number;
}

interface SimulationOption {
  id: string;
  techniqueId: string;
  techniqueName: string;
  techniqueCode: string;
  colors: number;
  width: number;
  height: number;
  positions: number;
  unitCost: number;
  setupCost: number;
  totalPersonalizationCost: number;
  costPerUnit: number;
  estimatedDays: number;
  // With product price
  productUnitPrice: number;
  totalProductCost: number;
  grandTotal: number;
  grandTotalPerUnit: number;
}

export default function PersonalizationSimulator() {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(100);
  const [customProductPrice, setCustomProductPrice] = useState<string>("");
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);
  const [simulationOptions, setSimulationOptions] = useState<SimulationOption[]>([]);
  const [techniqueSettings, setTechniqueSettings] = useState<Record<string, {
    colors: number;
    width: number;
    height: number;
    positions: number;
  }>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["simulator-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, sku, price")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data as Product[];
    },
  });

  // Fetch techniques
  const { data: techniques, isLoading: techniquesLoading } = useQuery({
    queryKey: ["simulator-techniques"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("personalization_techniques")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data as Technique[];
    },
  });

  const selectedProduct = useMemo(() => {
    return products?.find(p => p.id === selectedProductId);
  }, [products, selectedProductId]);

  // Get effective product price (custom or from product)
  const effectiveProductPrice = useMemo(() => {
    if (customProductPrice && parseFloat(customProductPrice) > 0) {
      return parseFloat(customProductPrice);
    }
    return selectedProduct?.price || 0;
  }, [customProductPrice, selectedProduct]);

  const handleTechniqueToggle = (techniqueId: string) => {
    setSelectedTechniques(prev => {
      if (prev.includes(techniqueId)) {
        return prev.filter(id => id !== techniqueId);
      }
      // Initialize settings for new technique
      if (!techniqueSettings[techniqueId]) {
        setTechniqueSettings(s => ({
          ...s,
          [techniqueId]: { colors: 1, width: 10, height: 10, positions: 1 }
        }));
      }
      return [...prev, techniqueId];
    });
  };

  const updateTechniqueSetting = (
    techniqueId: string, 
    field: 'colors' | 'width' | 'height' | 'positions', 
    value: number
  ) => {
    setTechniqueSettings(prev => ({
      ...prev,
      [techniqueId]: {
        ...prev[techniqueId],
        [field]: value
      }
    }));
  };

  const calculateSimulation = () => {
    if (!selectedProduct || selectedTechniques.length === 0) {
      toast.error("Selecione um produto e pelo menos uma técnica");
      return;
    }

    const options: SimulationOption[] = selectedTechniques.map(techId => {
      const technique = techniques?.find(t => t.id === techId);
      if (!technique) return null;

      const settings = techniqueSettings[techId] || { colors: 1, width: 10, height: 10, positions: 1 };
      
      // Calculate area in cm²
      const area = settings.width * settings.height;
      
      // Base unit cost calculation
      // For techniques like silk, multiply by number of colors
      // For techniques like DTF/sublimation, consider area
      let unitCostMultiplier = 1;
      
      const codeUpper = technique.code?.toUpperCase() || "";
      
      if (codeUpper.includes("SILK") || codeUpper.includes("SERIGRAFIA")) {
        unitCostMultiplier = settings.colors;
      } else if (codeUpper.includes("DTF") || codeUpper.includes("SUB") || codeUpper.includes("TRANSFER")) {
        // Area-based pricing: base is 100cm², scale proportionally
        unitCostMultiplier = Math.max(1, area / 100);
      } else if (codeUpper.includes("BORD") || codeUpper.includes("EMBROID")) {
        // Embroidery: based on area and complexity (colors approximate complexity)
        unitCostMultiplier = Math.max(1, (area / 50) * Math.max(1, settings.colors * 0.5));
      } else if (codeUpper.includes("LASER")) {
        unitCostMultiplier = Math.max(1, area / 100);
      }

      // Calculate costs
      const unitCost = technique.unit_cost * unitCostMultiplier * settings.positions;
      const setupCost = technique.setup_cost * settings.positions * (codeUpper.includes("SILK") ? settings.colors : 1);
      const totalPersonalizationCost = (unitCost * quantity) + setupCost;
      const costPerUnit = totalPersonalizationCost / quantity;

      // Calculate with product price
      const productUnitPrice = effectiveProductPrice;
      const totalProductCost = productUnitPrice * quantity;
      const grandTotal = totalProductCost + totalPersonalizationCost;
      const grandTotalPerUnit = grandTotal / quantity;

      return {
        id: `${techId}-${Date.now()}`,
        techniqueId: techId,
        techniqueName: technique.name,
        techniqueCode: technique.code || "",
        colors: settings.colors,
        width: settings.width,
        height: settings.height,
        positions: settings.positions,
        unitCost,
        setupCost,
        totalPersonalizationCost,
        costPerUnit,
        estimatedDays: technique.estimated_days,
        productUnitPrice,
        totalProductCost,
        grandTotal,
        grandTotalPerUnit,
      };
    }).filter(Boolean) as SimulationOption[];

    setSimulationOptions(options);
    toast.success(`Simulação calculada para ${options.length} técnica(s)`);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const clearSimulation = () => {
    setSimulationOptions([]);
    setSelectedTechniques([]);
    setTechniqueSettings({});
  };

  const copyToClipboard = async (option: SimulationOption) => {
    const text = `
${option.techniqueName}
- Quantidade: ${quantity} un.
- Cores: ${option.colors}
- Tamanho: ${option.width} x ${option.height} cm
- Posições: ${option.positions}
- Preço produto/un: ${formatCurrency(option.productUnitPrice)}
- Custo personalização/un: ${formatCurrency(option.costPerUnit)}
- Setup: ${formatCurrency(option.setupCost)}
- Total produtos: ${formatCurrency(option.totalProductCost)}
- Total personalização: ${formatCurrency(option.totalPersonalizationCost)}
- TOTAL GERAL: ${formatCurrency(option.grandTotal)}
- Custo final/un: ${formatCurrency(option.grandTotalPerUnit)}
- Prazo: ~${option.estimatedDays} dias
    `.trim();

    await navigator.clipboard.writeText(text);
    setCopiedId(option.id);
    toast.success("Copiado para área de transferência");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyAllOptions = async () => {
    if (simulationOptions.length === 0) return;

    const header = `Simulação de Personalização
Produto: ${selectedProduct?.name} (${selectedProduct?.sku})
Preço unitário: ${formatCurrency(effectiveProductPrice)}
Quantidade: ${quantity} unidades
---\n`;

    const optionsText = simulationOptions
      .sort((a, b) => a.grandTotal - b.grandTotal)
      .map((opt, idx) => `
Opção ${idx + 1}: ${opt.techniqueName}
- Cores: ${opt.colors}
- Tamanho: ${opt.width} x ${opt.height} cm
- Posições: ${opt.positions}
- Preço produto/un: ${formatCurrency(opt.productUnitPrice)}
- Personalização/un: ${formatCurrency(opt.costPerUnit)}
- Setup: ${formatCurrency(opt.setupCost)}
- Total produtos: ${formatCurrency(opt.totalProductCost)}
- Total personalização: ${formatCurrency(opt.totalPersonalizationCost)}
- TOTAL GERAL: ${formatCurrency(opt.grandTotal)}
- Custo final/un: ${formatCurrency(opt.grandTotalPerUnit)}
- Prazo estimado: ~${opt.estimatedDays} dias
    `.trim()).join("\n\n");

    await navigator.clipboard.writeText(header + optionsText);
    toast.success("Todas as opções copiadas!");
  };

  const needsColorInput = (code: string) => {
    const c = code?.toUpperCase() || "";
    return c.includes("SILK") || c.includes("SERIGRAFIA") || c.includes("BORD") || c.includes("EMBROID");
  };

  const needsSizeInput = (code: string) => {
    const c = code?.toUpperCase() || "";
    return c.includes("DTF") || c.includes("SUB") || c.includes("TRANSFER") || 
           c.includes("BORD") || c.includes("EMBROID") || c.includes("LASER");
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                <Calculator className="h-7 w-7 text-primary" />
              </div>
              Simulador de Personalização
            </h1>
            <p className="text-muted-foreground mt-1">
              Compare custos de diferentes técnicas em tempo real
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Product Selection */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Produto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Selecione o produto</Label>
                  <Select value={selectedProductId || ""} onValueChange={setSelectedProductId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolher produto..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {productsLoading ? (
                        <div className="p-4 flex justify-center">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : (
                        products?.map(product => (
                          <SelectItem key={product.id} value={product.id}>
                            <span>{product.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">({product.sku})</span>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quantidade</Label>
                  <Input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    placeholder="100"
                  />
                </div>

                {/* Custom product price */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    Preço unitário produto
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs max-w-xs">
                            Deixe em branco para usar o preço base do produto ou informe um valor negociado
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={customProductPrice}
                      onChange={(e) => setCustomProductPrice(e.target.value)}
                      placeholder={selectedProduct?.price?.toFixed(2) || "0.00"}
                      className="pl-10"
                    />
                  </div>
                </div>

                {selectedProduct && (
                  <div className="p-3 rounded-lg bg-secondary/50 text-sm space-y-1">
                    <p className="font-medium">{selectedProduct.name}</p>
                    <p className="text-muted-foreground">
                      Preço base: {formatCurrency(selectedProduct.price)}/un
                    </p>
                    {effectiveProductPrice !== selectedProduct.price && (
                      <p className="text-primary font-medium">
                        Preço usado: {formatCurrency(effectiveProductPrice)}/un
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Techniques Selection */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Técnicas
                </CardTitle>
                <CardDescription>
                  Selecione as técnicas para comparar
                </CardDescription>
              </CardHeader>
              <CardContent>
                {techniquesLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {techniques?.map(technique => (
                      <div 
                        key={technique.id}
                        className={cn(
                          "p-3 rounded-lg border transition-all cursor-pointer",
                          selectedTechniques.includes(technique.id)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => handleTechniqueToggle(technique.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={selectedTechniques.includes(technique.id)}
                              onCheckedChange={() => handleTechniqueToggle(technique.id)}
                            />
                            <div>
                              <p className="font-medium text-sm">{technique.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatCurrency(technique.unit_cost)}/un • Setup: {formatCurrency(technique.setup_cost)}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {technique.code}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Settings & Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Technique Settings */}
            {selectedTechniques.length > 0 && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Ruler className="h-5 w-5 text-primary" />
                    Configurações por Técnica
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {selectedTechniques.map(techId => {
                      const technique = techniques?.find(t => t.id === techId);
                      if (!technique) return null;

                      const settings = techniqueSettings[techId] || { colors: 1, width: 10, height: 10, positions: 1 };
                      const showColors = needsColorInput(technique.code || "");
                      const showSize = needsSizeInput(technique.code || "");

                      return (
                        <div 
                          key={techId}
                          className="p-4 rounded-xl border border-border bg-card"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Badge>{technique.code}</Badge>
                              <span className="font-medium">{technique.name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleTechniqueToggle(techId)}
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {showColors && (
                              <div className="space-y-2">
                                <Label className="text-xs">Cores</Label>
                                <Input
                                  type="number"
                                  min={1}
                                  max={12}
                                  value={settings.colors}
                                  onChange={(e) => updateTechniqueSetting(techId, 'colors', parseInt(e.target.value) || 1)}
                                  className="h-9"
                                />
                              </div>
                            )}

                            {showSize && (
                              <>
                                <div className="space-y-2">
                                  <Label className="text-xs">Largura (cm)</Label>
                                  <Input
                                    type="number"
                                    min={1}
                                    value={settings.width}
                                    onChange={(e) => updateTechniqueSetting(techId, 'width', parseInt(e.target.value) || 1)}
                                    className="h-9"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs">Altura (cm)</Label>
                                  <Input
                                    type="number"
                                    min={1}
                                    value={settings.height}
                                    onChange={(e) => updateTechniqueSetting(techId, 'height', parseInt(e.target.value) || 1)}
                                    className="h-9"
                                  />
                                </div>
                              </>
                            )}

                            <div className="space-y-2">
                              <Label className="text-xs flex items-center gap-1">
                                Posições
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="h-3 w-3 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs">Número de locais de gravação</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </Label>
                              <Input
                                type="number"
                                min={1}
                                max={10}
                                value={settings.positions}
                                onChange={(e) => updateTechniqueSetting(techId, 'positions', parseInt(e.target.value) || 1)}
                                className="h-9"
                              />
                            </div>
                          </div>

                          {showSize && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Área: {settings.width * settings.height} cm²
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button onClick={calculateSimulation} className="flex-1 gap-2">
                      <Calculator className="h-4 w-4" />
                      Calcular Simulação
                    </Button>
                    <Button variant="outline" onClick={clearSimulation}>
                      Limpar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results */}
            {simulationOptions.length > 0 && (
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-success" />
                      Resultado da Simulação
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={copyAllOptions} className="gap-2">
                      <Copy className="h-4 w-4" />
                      Copiar Tudo
                    </Button>
                  </div>
                  <CardDescription>
                    {quantity} unidades de {selectedProduct?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Técnica</TableHead>
                          <TableHead className="text-center">Detalhes</TableHead>
                          <TableHead className="text-right">Produto/Un</TableHead>
                          <TableHead className="text-right">Pers./Un</TableHead>
                          <TableHead className="text-right">Setup</TableHead>
                          <TableHead className="text-right">Total Geral</TableHead>
                          <TableHead className="text-right">Final/Un</TableHead>
                          <TableHead className="text-center">Prazo</TableHead>
                          <TableHead className="w-10"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {simulationOptions
                          .sort((a, b) => a.grandTotal - b.grandTotal)
                          .map((option, idx) => (
                            <TableRow 
                              key={option.id}
                              className={cn(
                                idx === 0 && "bg-success/5"
                              )}
                            >
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {idx === 0 && (
                                    <Badge className="bg-success text-success-foreground text-[10px]">
                                      Menor custo
                                    </Badge>
                                  )}
                                  <div>
                                    <p className="font-medium">{option.techniqueName}</p>
                                    <p className="text-xs text-muted-foreground">{option.techniqueCode}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="text-xs text-muted-foreground space-y-0.5">
                                  {option.colors > 0 && <p>{option.colors} cor(es)</p>}
                                  <p>{option.width}×{option.height}cm</p>
                                  <p>{option.positions} pos.</p>
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-mono text-xs">
                                {formatCurrency(option.productUnitPrice)}
                              </TableCell>
                              <TableCell className="text-right font-mono text-xs">
                                {formatCurrency(option.costPerUnit)}
                              </TableCell>
                              <TableCell className="text-right font-mono text-xs text-muted-foreground">
                                {formatCurrency(option.setupCost)}
                              </TableCell>
                              <TableCell className="text-right">
                                <div>
                                  <span className="font-bold text-lg">
                                    {formatCurrency(option.grandTotal)}
                                  </span>
                                  <p className="text-[10px] text-muted-foreground">
                                    Prod: {formatCurrency(option.totalProductCost)} + Pers: {formatCurrency(option.totalPersonalizationCost)}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <span className="font-semibold text-primary">
                                  {formatCurrency(option.grandTotalPerUnit)}
                                </span>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="h-3.5 w-3.5" />
                                  {option.estimatedDays}d
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => copyToClipboard(option)}
                                >
                                  {copiedId === option.id ? (
                                    <Check className="h-4 w-4 text-success" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                    <div className="p-4 rounded-xl bg-secondary/50 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Quantidade</p>
                      <p className="text-2xl font-bold">{quantity}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Preço/Un</p>
                      <p className="text-xl font-bold">{formatCurrency(effectiveProductPrice)}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Total Produtos</p>
                      <p className="text-xl font-bold">{formatCurrency(effectiveProductPrice * quantity)}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-success/10 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Menor Total</p>
                      <p className="text-xl font-bold text-success">
                        {formatCurrency(Math.min(...simulationOptions.map(o => o.grandTotal)))}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-warning/10 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Maior Total</p>
                      <p className="text-xl font-bold text-warning">
                        {formatCurrency(Math.max(...simulationOptions.map(o => o.grandTotal)))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {selectedTechniques.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                    <Calculator className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">
                    Selecione técnicas para simular
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-sm">
                    Escolha um produto e as técnicas de personalização que deseja comparar para ver os custos em tempo real.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
