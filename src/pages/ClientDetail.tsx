import { useParams, useNavigate } from "react-router-dom";
import { CLIENTS } from "@/data/mockData";
import { MainLayout } from "@/components/layout/MainLayout";
import { ClientColorPreferences } from "@/components/clients/ClientColorPreferences";
import { ClientPurchaseHistory } from "@/components/clients/ClientPurchaseHistory";
import { ClientStats } from "@/components/clients/ClientStats";
import { ClientRecommendedProducts } from "@/components/clients/ClientRecommendedProducts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { 
  ArrowLeft, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  FileText,
  Edit,
  Share2
} from "lucide-react";

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const client = CLIENTS.find((c) => c.id === id);

  if (!client) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <h1 className="text-2xl font-display font-bold text-foreground">
            Cliente não encontrado
          </h1>
          <Button onClick={() => navigate("/")}>Voltar ao início</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Início</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/clientes">Clientes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{client.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="mt-1"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-4">
              {/* Logo/Avatar do cliente */}
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-display font-bold text-xl"
                style={{ backgroundColor: client.primaryColor.hex }}
              >
                {client.name.charAt(0)}
              </div>

              <div>
                <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
                  {client.name}
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge variant="outline">{client.ramo}</Badge>
                  <Badge variant="secondary">{client.nicho}</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </div>

        {/* Informações de contato */}
        <div className="card-elevated p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {client.cnpj && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">CNPJ</p>
                  <p className="text-sm font-medium text-foreground">{client.cnpj}</p>
                </div>
              </div>
            )}
            {client.email && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">E-mail</p>
                  <p className="text-sm font-medium text-foreground">{client.email}</p>
                </div>
              </div>
            )}
            {client.phone && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Telefone</p>
                  <p className="text-sm font-medium text-foreground">{client.phone}</p>
                </div>
              </div>
            )}
            {client.address && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Endereço</p>
                  <p className="text-sm font-medium text-foreground line-clamp-1">{client.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <ClientStats client={client} />

        {/* Grid de conteúdo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna da esquerda - Cores */}
          <div className="lg:col-span-1">
            <ClientColorPreferences
              primaryColor={client.primaryColor}
              secondaryColors={client.secondaryColors}
            />
          </div>

          {/* Coluna da direita - Histórico */}
          <div className="lg:col-span-2">
            {client.purchaseHistory && client.purchaseHistory.length > 0 && (
              <ClientPurchaseHistory history={client.purchaseHistory} />
            )}
          </div>
        </div>

        {/* Produtos recomendados */}
        <ClientRecommendedProducts
          client={client}
          onProductClick={(productId) => navigate(`/produto/${productId}`)}
        />
      </div>
    </MainLayout>
  );
}