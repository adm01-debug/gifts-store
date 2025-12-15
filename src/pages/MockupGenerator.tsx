import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, Image as ImageIcon, Download, RefreshCw, Wand2, History, Trash2, Clock, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
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

interface Product {
  id: string;
  name: string;
  sku: string;
  images: unknown;
}

interface Technique {
  id: string;
  name: string;
  code: string | null;
}

interface Client {
  id: string;
  name: string;
}

interface GeneratedMockup {
  id: string;
  product_id: string | null;
  product_name: string;
  product_sku: string | null;
  technique_id: string | null;
  technique_name: string;
  mockup_url: string;
  logo_url: string;
  position_x: number | null;
  position_y: number | null;
  logo_width_cm: number | null;
  logo_height_cm: number | null;
  created_at: string;
  client_id: string | null;
  bitrix_clients?: { name: string } | null;
}

const TECHNIQUE_PROMPTS: Record<string, string> = {
  "bordado": "as professional machine embroidery with visible thread stitching texture, showing the thread weave pattern typical of embroidered logos",
  "silk": "as screen printed with flat solid colors, matte finish, ink sitting on top of the fabric surface",
  "dtf": "as DTF (Direct to Film) printed transfer with vibrant colors, slight glossy finish, smooth edges",
  "laser": "as laser engraved, etched into the material surface with a burned/oxidized appearance, monochromatic grey-brown tones",
  "laser_co2": "as CO2 laser engraved with precise etching, showing material removal and light burn marks on organic materials",
  "laser_fibra": "as fiber laser marked on metal, creating a high-contrast permanent mark with polished appearance",
  "sublimacao": "as sublimation printed, colors absorbed into the material, seamless integration with no texture difference",
  "tampografia": "as pad printed with slightly glossy ink, precise small details, subtle ink buildup",
  "hot_stamping": "as hot stamped with metallic foil finish, shiny reflective surface, typically gold or silver",
  "adesivo": "as vinyl sticker/decal applied to surface, slight edge visibility, glossy or matte vinyl finish",
  "uv": "as UV printed with raised ink texture, vibrant colors, slightly embossed feel",
  "transfer": "as heat transfer vinyl, smooth finish with slight sheen, cut around the design edges",
  "default": "as professionally printed/applied logo maintaining the technique's characteristic appearance"
};

export default function MockupGenerator() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [positionX, setPositionX] = useState(50);
  const [positionY, setPositionY] = useState(50);
  const [logoWidth, setLogoWidth] = useState(5);
  const [logoHeight, setLogoHeight] = useState(3);
  const [generatedMockup, setGeneratedMockup] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [mockupHistory, setMockupHistory] = useState<GeneratedMockup[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mockupToDelete, setMockupToDelete] = useState<string | null>(null);
  
  // History filters
  const [filterClient, setFilterClient] = useState<string>("all");
  const [filterProduct, setFilterProduct] = useState<string>("");
  const [filterTechnique, setFilterTechnique] = useState<string>("all");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    fetchData();
    fetchHistory();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, techniquesRes, clientsRes] = await Promise.all([
        supabase
          .from("products")
          .select("id, name, sku, images")
          .eq("is_active", true)
          .order("name")
          .limit(500),
        supabase
          .from("personalization_techniques")
          .select("id, name, code")
          .eq("is_active", true)
          .order("name"),
        supabase
          .from("bitrix_clients")
          .select("id, name")
          .order("name")
      ]);

      if (productsRes.error) throw productsRes.error;
      if (techniquesRes.error) throw techniquesRes.error;

      setProducts(productsRes.data || []);
      setTechniques(techniquesRes.data || []);
      setClients(clientsRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setIsLoadingData(false);
    }
  };

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from("generated_mockups")
        .select(`
          id,
          product_id,
          product_name,
          product_sku,
          technique_id,
          technique_name,
          mockup_url,
          logo_url,
          position_x,
          position_y,
          logo_width_cm,
          logo_height_cm,
          created_at,
          client_id,
          bitrix_clients(name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMockupHistory(data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem válida");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }

    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const getProductImage = (): string | null => {
    if (!selectedProduct?.images) return null;
    const images = Array.isArray(selectedProduct.images) ? selectedProduct.images : [];
    return images.length > 0 ? String(images[0]) : null;
  };

  const getTechniquePrompt = (technique: Technique): string => {
    const code = technique.code?.toLowerCase() || technique.name.toLowerCase();
    
    for (const [key, prompt] of Object.entries(TECHNIQUE_PROMPTS)) {
      if (code.includes(key) || technique.name.toLowerCase().includes(key)) {
        return prompt;
      }
    }
    
    return TECHNIQUE_PROMPTS.default;
  };

  const saveMockupToHistory = async (mockupUrl: string) => {
    if (!user || !selectedProduct || !selectedTechnique || !logoPreview) return;

    try {
      const { error } = await supabase
        .from("generated_mockups")
        .insert({
          seller_id: user.id,
          client_id: selectedClient?.id || null,
          product_id: selectedProduct.id,
          product_name: selectedProduct.name,
          product_sku: selectedProduct.sku,
          technique_id: selectedTechnique.id,
          technique_name: selectedTechnique.name,
          logo_url: logoPreview,
          mockup_url: mockupUrl,
          position_x: positionX,
          position_y: positionY,
          logo_width_cm: logoWidth,
          logo_height_cm: logoHeight,
        });

      if (error) throw error;
      fetchHistory();
    } catch (error) {
      console.error("Error saving mockup to history:", error);
    }
  };

  const generateMockup = async () => {
    if (!selectedProduct || !selectedTechnique || !logoPreview) {
      toast.error("Selecione produto, técnica e faça upload do logo");
      return;
    }

    const productImage = getProductImage();
    if (!productImage) {
      toast.error("O produto selecionado não possui imagem");
      return;
    }

    setIsLoading(true);
    setGeneratedMockup(null);

    try {
      const techniquePrompt = getTechniquePrompt(selectedTechnique);
      
      const response = await supabase.functions.invoke("generate-mockup", {
        body: {
          productImageUrl: productImage,
          logoBase64: logoPreview,
          techniqueName: selectedTechnique.name,
          techniquePrompt,
          positionX,
          positionY,
          logoWidthCm: logoWidth,
          logoHeightCm: logoHeight,
          productName: selectedProduct.name
        }
      });

      if (response.error) throw response.error;

      if (response.data?.mockupUrl) {
        setGeneratedMockup(response.data.mockupUrl);
        await saveMockupToHistory(response.data.mockupUrl);
        toast.success("Mockup gerado e salvo no histórico!");
      } else {
        throw new Error("Nenhuma imagem retornada");
      }
    } catch (error) {
      console.error("Error generating mockup:", error);
      toast.error("Erro ao gerar mockup. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadMockup = (url?: string) => {
    const mockupUrl = url || generatedMockup;
    if (!mockupUrl) return;
    
    const link = document.createElement("a");
    link.href = mockupUrl;
    link.download = `mockup-${selectedProduct?.sku || "produto"}-${selectedTechnique?.name || "tecnica"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteMockup = async () => {
    if (!mockupToDelete) return;

    try {
      const { error } = await supabase
        .from("generated_mockups")
        .delete()
        .eq("id", mockupToDelete);

      if (error) throw error;
      
      setMockupHistory(prev => prev.filter(m => m.id !== mockupToDelete));
      toast.success("Mockup excluído");
    } catch (error) {
      console.error("Error deleting mockup:", error);
      toast.error("Erro ao excluir mockup");
    } finally {
      setDeleteDialogOpen(false);
      setMockupToDelete(null);
    }
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setSelectedTechnique(null);
    setSelectedClient(null);
    setLogoFile(null);
    setLogoPreview(null);
    setPositionX(50);
    setPositionY(50);
    setLogoWidth(5);
    setLogoHeight(3);
    setGeneratedMockup(null);
  };

  const loadFromHistory = (mockup: GeneratedMockup) => {
    // Find product and technique by ID
    const product = mockup.product_id ? products.find(p => p.id === mockup.product_id) : null;
    const technique = mockup.technique_id ? techniques.find(t => t.id === mockup.technique_id) : null;
    const client = mockup.client_id ? clients.find(c => c.id === mockup.client_id) : null;

    // Set form values
    setSelectedProduct(product || null);
    setSelectedTechnique(technique || null);
    setSelectedClient(client || null);
    setLogoPreview(mockup.logo_url);
    setLogoFile(null); // Can't restore actual file
    setPositionX(mockup.position_x ?? 50);
    setPositionY(mockup.position_y ?? 50);
    setLogoWidth(mockup.logo_width_cm ?? 5);
    setLogoHeight(mockup.logo_height_cm ?? 3);
    setGeneratedMockup(null);

    // Switch to generator tab
    const generatorTab = document.querySelector('[data-state="inactive"][value="generator"]') as HTMLButtonElement | null;
    if (generatorTab) {
      generatorTab.click();
    }

    toast.success("Configurações carregadas! Ajuste se necessário e gere um novo mockup.");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gerador de Mockups</h1>
          <p className="text-muted-foreground mt-1">
            Crie visualizações de produtos personalizados com IA
          </p>
        </div>

        <Tabs defaultValue="generator" className="space-y-4">
          <TabsList>
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Gerar Mockup
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Histórico ({mockupHistory.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Configuration Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-primary" />
                    Configuração
                  </CardTitle>
                  <CardDescription>
                    Selecione o produto, técnica e faça upload do logo do cliente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Client Selection (Optional) */}
                  <div className="space-y-2">
                    <Label>Cliente (opcional)</Label>
                    <Select
                      value={selectedClient?.id || "none"}
                      onValueChange={(value) => {
                        if (value === "none") {
                          setSelectedClient(null);
                        } else {
                          const client = clients.find((c) => c.id === value);
                          setSelectedClient(client || null);
                        }
                      }}
                      disabled={isLoadingData}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Associar a um cliente..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhum cliente</SelectItem>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Product Selection */}
                  <div className="space-y-2">
                    <Label>Produto</Label>
                    <Select
                      value={selectedProduct?.id || ""}
                      onValueChange={(value) => {
                        const product = products.find((p) => p.id === value);
                        setSelectedProduct(product || null);
                        setGeneratedMockup(null);
                      }}
                      disabled={isLoadingData}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um produto..." />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} ({product.sku})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Technique Selection */}
                  <div className="space-y-2">
                    <Label>Técnica de Personalização</Label>
                    <Select
                      value={selectedTechnique?.id || ""}
                      onValueChange={(value) => {
                        const technique = techniques.find((t) => t.id === value);
                        setSelectedTechnique(technique || null);
                        setGeneratedMockup(null);
                      }}
                      disabled={isLoadingData}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma técnica..." />
                      </SelectTrigger>
                      <SelectContent>
                        {techniques.map((technique) => (
                          <SelectItem key={technique.id} value={technique.id}>
                            {technique.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Logo Upload */}
                  <div className="space-y-2">
                    <Label>Logo do Cliente</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-accent transition-colors flex-1"
                      >
                        <Upload className="h-4 w-4" />
                        <span className="text-sm">
                          {logoFile ? logoFile.name : "Selecionar logo..."}
                        </span>
                      </label>
                      {logoPreview && (
                        <div className="h-12 w-12 rounded border bg-background flex items-center justify-center overflow-hidden">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Position Controls */}
                  <div className="space-y-4">
                    <Label>Posição do Logo</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Horizontal</span>
                          <span>{positionX}%</span>
                        </div>
                        <Slider
                          value={[positionX]}
                          onValueChange={(v) => setPositionX(v[0])}
                          min={10}
                          max={90}
                          step={1}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Vertical</span>
                          <span>{positionY}%</span>
                        </div>
                        <Slider
                          value={[positionY]}
                          onValueChange={(v) => setPositionY(v[0])}
                          min={10}
                          max={90}
                          step={1}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Size Controls */}
                  <div className="space-y-4">
                    <Label>Tamanho da Gravação (cm)</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Largura</span>
                          <span>{logoWidth} cm</span>
                        </div>
                        <Slider
                          value={[logoWidth]}
                          onValueChange={(v) => setLogoWidth(v[0])}
                          min={1}
                          max={20}
                          step={0.5}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Altura</span>
                          <span>{logoHeight} cm</span>
                        </div>
                        <Slider
                          value={[logoHeight]}
                          onValueChange={(v) => setLogoHeight(v[0])}
                          min={1}
                          max={20}
                          step={0.5}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={generateMockup}
                      disabled={!selectedProduct || !selectedTechnique || !logoPreview || isLoading}
                      className="flex-1"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Gerando...
                        </>
                      ) : (
                        <>
                          <Wand2 className="mr-2 h-4 w-4" />
                          Gerar Mockup
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={resetForm}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Preview Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    Visualização
                  </CardTitle>
                  <CardDescription>
                    Preview do produto e mockup gerado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Product Preview */}
                    {selectedProduct && getProductImage() && (
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Imagem Original</Label>
                        <div className="aspect-square rounded-lg border bg-muted/30 overflow-hidden">
                          <img
                            src={getProductImage()!}
                            alt={selectedProduct.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    )}

                    {/* Generated Mockup */}
                    {generatedMockup && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm text-muted-foreground">Mockup Gerado</Label>
                          <Button size="sm" variant="outline" onClick={() => downloadMockup()}>
                            <Download className="h-4 w-4 mr-1" />
                            Baixar
                          </Button>
                        </div>
                        <div className="aspect-square rounded-lg border bg-muted/30 overflow-hidden ring-2 ring-primary/20">
                          <img
                            src={generatedMockup}
                            alt="Generated mockup"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    )}

                    {/* Empty State */}
                    {!selectedProduct && !generatedMockup && (
                      <div className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Selecione um produto para visualizar</p>
                        </div>
                      </div>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                      <div className="aspect-square rounded-lg border bg-muted/30 flex items-center justify-center">
                        <div className="text-center">
                          <Loader2 className="h-12 w-12 mx-auto mb-2 animate-spin text-primary" />
                          <p className="text-sm text-muted-foreground">
                            Gerando mockup com IA...
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Isso pode levar alguns segundos
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Histórico de Mockups
                </CardTitle>
                <CardDescription>
                  Mockups gerados anteriormente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Cliente</Label>
                    <Select value={filterClient} onValueChange={(v) => { setFilterClient(v); setCurrentPage(1); }}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Todos os clientes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os clientes</SelectItem>
                        <SelectItem value="none">Sem cliente</SelectItem>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Produto</Label>
                    <Input
                      placeholder="Buscar por nome do produto..."
                      value={filterProduct}
                      onChange={(e) => { setFilterProduct(e.target.value); setCurrentPage(1); }}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Técnica</Label>
                    <Select value={filterTechnique} onValueChange={(v) => { setFilterTechnique(v); setCurrentPage(1); }}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Todas as técnicas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as técnicas</SelectItem>
                        {techniques.map((technique) => (
                          <SelectItem key={technique.id} value={technique.id}>
                            {technique.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Clear filters button */}
                {(filterClient !== "all" || filterProduct || filterTechnique !== "all") && (
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFilterClient("all");
                        setFilterProduct("");
                        setFilterTechnique("all");
                        setCurrentPage(1);
                      }}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Limpar filtros
                    </Button>
                  </div>
                )}

                {isLoadingHistory ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (() => {
                  // Apply filters
                  const filteredMockups = mockupHistory.filter((mockup) => {
                    // Client filter
                    if (filterClient === "none" && mockup.client_id !== null) return false;
                    if (filterClient !== "all" && filterClient !== "none" && mockup.client_id !== filterClient) return false;
                    
                    // Product filter (text search)
                    if (filterProduct && !mockup.product_name.toLowerCase().includes(filterProduct.toLowerCase())) return false;
                    
                    // Technique filter
                    const selectedTechniqueForFilter = techniques.find(t => t.id === filterTechnique);
                    if (filterTechnique !== "all" && selectedTechniqueForFilter && mockup.technique_name !== selectedTechniqueForFilter.name) return false;
                    
                    return true;
                  });

                  // Pagination
                  const totalPages = Math.ceil(filteredMockups.length / ITEMS_PER_PAGE);
                  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
                  const paginatedMockups = filteredMockups.slice(startIndex, startIndex + ITEMS_PER_PAGE);

                  // Reset to page 1 if current page is out of bounds
                  if (currentPage > totalPages && totalPages > 0) {
                    setCurrentPage(1);
                  }

                  if (mockupHistory.length === 0) {
                    return (
                      <div className="text-center py-12 text-muted-foreground">
                        <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Nenhum mockup gerado ainda</p>
                        <p className="text-sm">Gere seu primeiro mockup na aba "Gerar Mockup"</p>
                      </div>
                    );
                  }

                  if (filteredMockups.length === 0) {
                    return (
                      <div className="text-center py-12 text-muted-foreground">
                        <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Nenhum mockup encontrado</p>
                        <p className="text-sm">Tente ajustar os filtros</p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      {/* Results count */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                          Mostrando {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredMockups.length)} de {filteredMockups.length} mockups
                        </span>
                        <span>Página {currentPage} de {totalPages}</span>
                      </div>

                      {/* Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {paginatedMockups.map((mockup) => (
                          <div
                            key={mockup.id}
                            className="group relative border rounded-lg overflow-hidden hover:ring-2 hover:ring-primary/30 transition-all"
                          >
                            <div className="aspect-square bg-muted/30">
                              <img
                                src={mockup.mockup_url}
                                alt={mockup.product_name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="p-3 space-y-1">
                              <p className="font-medium text-sm truncate">{mockup.product_name}</p>
                              <p className="text-xs text-muted-foreground">{mockup.technique_name}</p>
                              {mockup.bitrix_clients?.name && (
                                <p className="text-xs text-primary truncate">
                                  {mockup.bitrix_clients.name}
                                </p>
                              )}
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {formatDistanceToNow(new Date(mockup.created_at), {
                                  addSuffix: true,
                                  locale: ptBR
                                })}
                              </div>
                            </div>
                            
                            {/* Overlay actions */}
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="icon"
                                variant="secondary"
                                className="h-8 w-8"
                                title="Regenerar com estas configurações"
                                onClick={() => loadFromHistory(mockup)}
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="secondary"
                                className="h-8 w-8"
                                title="Baixar mockup"
                                onClick={() => downloadMockup(mockup.mockup_url)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="destructive"
                                className="h-8 w-8"
                                title="Excluir mockup"
                                onClick={() => {
                                  setMockupToDelete(mockup.id);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pagination controls */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                          >
                            Primeira
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          
                          {/* Page numbers */}
                          <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              let pageNum: number;
                              if (totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }
                              
                              return (
                                <Button
                                  key={pageNum}
                                  variant={currentPage === pageNum ? "default" : "outline"}
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => setCurrentPage(pageNum)}
                                >
                                  {pageNum}
                                </Button>
                              );
                            })}
                          </div>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                          >
                            Última
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir mockup?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O mockup será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deleteMockup} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
