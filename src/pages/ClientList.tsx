import { useNavigate } from "react-router-dom";
import { CLIENTS } from "@/data/mockData";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Building2, 
  DollarSign, 
  Calendar,
  ChevronRight,
  Plus
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

export default function ClientList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = CLIENTS.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.ramo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.nicho.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
              Clientes
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seus clientes e veja histórico de compras
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Cliente
          </Button>
        </div>

        {/* Search */}
        <div className="search-bar max-w-md">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar clientes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {/* Client list */}
        <div className="grid gap-4">
          {filteredClients.map((client, index) => (
            <div
              key={client.id}
              className="card-interactive p-4 flex items-center gap-4 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => navigate(`/cliente/${client.id}`)}
            >
              {/* Logo */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-display font-bold text-xl shrink-0"
                style={{ backgroundColor: client.primaryColor.hex }}
              >
                {client.name.charAt(0)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-foreground truncate">
                  {client.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {client.ramo}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {client.nicho}
                  </Badge>
                </div>
              </div>

              {/* Stats */}
              <div className="hidden md:flex items-center gap-6">
                <div className="text-right">
                  <div className="flex items-center gap-1 text-success">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold">
                      {formatCurrency(client.totalSpent || 0)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Total gasto</p>
                </div>

                {client.lastPurchase && (
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">
                        {format(new Date(client.lastPurchase), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Última compra</p>
                  </div>
                )}

                {/* Color palette preview */}
                <div className="flex gap-1">
                  <div
                    className="w-6 h-6 rounded-full border border-border"
                    style={{ backgroundColor: client.primaryColor.hex }}
                  />
                  {client.secondaryColors.slice(0, 2).map((color, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 rounded-full border border-border"
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground">Nenhum cliente encontrado</h3>
            <p className="text-muted-foreground mt-1">
              Tente ajustar sua busca ou adicione um novo cliente
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}