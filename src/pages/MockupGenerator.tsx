import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, Image as ImageIcon, Download, RefreshCw, Wand2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";

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
  const [products, setProducts] = useState<Product[]>([]);
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [positionX, setPositionX] = useState(50);
  const [positionY, setPositionY] = useState(50);
  const [logoWidth, setLogoWidth] = useState(5);
  const [logoHeight, setLogoHeight] = useState(3);
  const [generatedMockup, setGeneratedMockup] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, techniquesRes] = await Promise.all([
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
          .order("name")
      ]);

      if (productsRes.error) throw productsRes.error;
      if (techniquesRes.error) throw techniquesRes.error;

      setProducts(productsRes.data || []);
      setTechniques(techniquesRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setIsLoadingData(false);
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
        toast.success("Mockup gerado com sucesso!");
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

  const downloadMockup = () => {
    if (!generatedMockup) return;
    
    const link = document.createElement("a");
    link.href = generatedMockup;
    link.download = `mockup-${selectedProduct?.sku || "produto"}-${selectedTechnique?.name || "tecnica"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setSelectedTechnique(null);
    setLogoFile(null);
    setLogoPreview(null);
    setPositionX(50);
    setPositionY(50);
    setLogoWidth(5);
    setLogoHeight(3);
    setGeneratedMockup(null);
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
                      <Button size="sm" variant="outline" onClick={downloadMockup}>
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
      </div>
    </MainLayout>
  );
}
