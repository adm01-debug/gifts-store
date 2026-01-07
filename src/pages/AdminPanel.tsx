import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, ShieldCheck, Users, UserCog, Loader2, KeyRound, Package } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PasswordResetApproval } from "@/components/admin/PasswordResetApproval";
import { usePasswordResetRequests } from "@/hooks/usePasswordResetRequests";
import { ProductsManager } from "@/components/admin/ProductsManager";

interface UserWithRole {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string;
  role: "admin" | "vendedor" | "gerente";
  created_at: string;
}

export default function AdminPanel() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const { pendingCount } = usePasswordResetRequests();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // CORRIGIDO: Buscar role diretamente da tabela profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, role, created_at");

      if (profilesError) {
        console.warn("Erro ao buscar profiles:", profilesError.message);
        throw profilesError;
      }

      // Mapear profiles para o formato esperado
      const usersWithRoles: UserWithRole[] = (profiles || []).map((profile) => ({
        id: profile.id,
        user_id: profile.id, // id é o mesmo que user_id em profiles
        full_name: profile.full_name,
        email: "",
        role: (profile.role as "admin" | "vendedor" | "gerente") || "vendedor",
        created_at: profile.created_at,
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Erro ao carregar usuários");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: "admin" | "vendedor") => {
    setUpdatingUserId(userId);
    try {
      // CORRIGIDO: Atualizar role na tabela profiles
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;

      setUsers((prev) =>
        prev.map((u) => (u.user_id === userId ? { ...u, role: newRole } : u))
      );

      toast.success(
        newRole === "admin"
          ? "Usuário promovido a administrador"
          : "Usuário rebaixado para vendedor"
      );
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Erro ao atualizar permissão");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const adminCount = users.filter((u) => u.role === "admin").length;
  const vendedorCount = users.filter((u) => u.role === "vendedor").length;

  return (
    <MainLayout>
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <UserCog className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Painel Administrativo</h1>
            <p className="text-muted-foreground">Gerencie usuários e permissões do sistema</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Administradores</CardTitle>
              <ShieldCheck className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{adminCount}</div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Vendedores</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vendedorCount}</div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Reset de Senha</CardTitle>
              <KeyRound className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pendingCount > 0 ? (
                  <span className="text-orange-500">{pendingCount} pendente{pendingCount > 1 ? 's' : ''}</span>
                ) : (
                  <span className="text-green-500">0</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="password-reset" className="gap-2">
              <KeyRound className="h-4 w-4" />
              Reset de Senha
              {pendingCount > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {pendingCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" />
              Produtos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Usuários</CardTitle>
                <CardDescription>
                  Visualize e gerencie as permissões dos usuários do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Função</TableHead>
                        <TableHead>Cadastrado em</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((userItem) => (
                        <TableRow key={userItem.id}>
                          <TableCell>
                            <div className="font-medium">
                              {userItem.full_name || "Sem nome"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={userItem.role === "admin" ? "default" : "secondary"}
                              className="gap-1"
                            >
                              {userItem.role === "admin" ? (
                                <ShieldCheck className="h-3 w-3" />
                              ) : (
                                <Shield className="h-3 w-3" />
                              )}
                              {userItem.role === "admin" ? "Administrador" : "Vendedor"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(userItem.created_at).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell className="text-right">
                            {userItem.user_id !== user?.id && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={updatingUserId === userItem.user_id}
                                  >
                                    {updatingUserId === userItem.user_id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : userItem.role === "admin" ? (
                                      "Rebaixar"
                                    ) : (
                                      "Promover"
                                    )}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      {userItem.role === "admin"
                                        ? "Rebaixar para Vendedor?"
                                        : "Promover a Administrador?"}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {userItem.role === "admin"
                                        ? `${userItem.full_name || "Este usuário"} perderá acesso às funções administrativas.`
                                        : `${userItem.full_name || "Este usuário"} terá acesso total ao sistema, incluindo gerenciamento de usuários.`}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleRoleChange(
                                          userItem.user_id,
                                          userItem.role === "admin" ? "vendedor" : "admin"
                                        )
                                      }
                                    >
                                      Confirmar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password-reset">
            <PasswordResetApproval />
          </TabsContent>

          <TabsContent value="products">
            <ProductsManager />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
