import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Sparkles, Mail, Lock, User, Package, Factory, SlidersHorizontal, Brain, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

const signupSchema = z.object({
  fullName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading: authLoading, signIn, signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  });

  const handleLogin = async (data: LoginForm) => {
    setIsSubmitting(true);
    try {
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            variant: "destructive",
            title: "Erro ao entrar",
            description: "Email ou senha incorretos",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erro ao entrar",
            description: error.message,
          });
        }
        return;
      }

      toast({
        title: "Bem-vindo!",
        description: "Login realizado com sucesso",
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Tente novamente mais tarde",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (data: SignupForm) => {
    setIsSubmitting(true);
    try {
      const { error } = await signUp(data.email, data.password, data.fullName);
      
      if (error) {
        if (error.message.includes("User already registered")) {
          toast({
            variant: "destructive",
            title: "Erro ao cadastrar",
            description: "Este email já está cadastrado. Tente fazer login.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erro ao cadastrar",
            description: error.message,
          });
        }
        return;
      }

      toast({
        title: "Cadastro realizado!",
        description: "Sua conta foi criada com sucesso",
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Tente novamente mais tarde",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-orange" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-card via-card to-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-orange/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-orange/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-success/5 rounded-full blur-3xl" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-orange flex items-center justify-center shadow-lg shadow-orange/30">
                <Sparkles className="h-7 w-7 text-orange-foreground" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground">
                  Promo
                </h1>
                <p className="text-orange font-semibold uppercase tracking-widest text-sm -mt-1">
                  Brindes
                </p>
              </div>
            </div>
            
            <div className="space-y-4 max-w-md">
              <h2 className="text-4xl xl:text-5xl font-display font-bold text-foreground leading-tight">
                Vitrine de Produtos para{" "}
                <span className="text-orange">Vendedores</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Encontre os melhores brindes promocionais, compare produtos e encante seus clientes.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              {[
                { label: "15.000+", desc: "Produtos", icon: Package },
                { label: "50+", desc: "Fornecedores", icon: Factory },
                { label: "Filtros", desc: "Avançados", icon: SlidersHorizontal },
                { label: "IA", desc: "Recomendações", icon: Brain },
              ].map((item, i) => {
                const IconComponent = item.icon;
                return (
                  <div 
                    key={i} 
                    className="shimmer-hover p-4 rounded-xl bg-white dark:bg-card border border-orange/30 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_hsl(var(--orange)/0.25),0_0_20px_hsl(var(--orange)/0.15)] hover:border-orange/60 hover:scale-[1.02] transition-all duration-300 group opacity-0"
                    style={{ 
                      animation: `scale-fade-in 0.5s ease-out ${300 + i * 150}ms forwards`
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-2xl font-bold text-orange">{item.label}</p>
                        <p className="text-sm text-foreground/70">{item.desc}</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-orange/10 flex items-center justify-center group-hover:bg-orange/20 transition-colors">
                        <IconComponent className="h-5 w-5 text-orange" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Mobile Logo */}
          <div className="text-center lg:hidden space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-orange shadow-lg shadow-orange/30">
              <Sparkles className="h-8 w-8 text-orange-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Promo Brindes
              </h1>
              <p className="text-sm text-muted-foreground">
                Vitrine de Produtos
              </p>
            </div>
          </div>

          {/* Auth Card */}
          <Card className="border-border bg-card shadow-xl">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <CardHeader className="pb-4">
                <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                  <TabsTrigger 
                    value="login" 
                    className="data-[state=active]:bg-orange data-[state=active]:text-orange-foreground"
                  >
                    Entrar
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="data-[state=active]:bg-orange data-[state=active]:text-orange-foreground"
                  >
                    Cadastrar
                  </TabsTrigger>
                </TabsList>
              </CardHeader>

              <CardContent className="pt-2">
                {/* Login Tab */}
                <TabsContent value="login" className="mt-0 space-y-6">
                  <div className="text-center space-y-1">
                    <h2 className="text-xl font-semibold text-foreground">Bem-vindo de volta</h2>
                    <p className="text-sm text-muted-foreground">Entre com suas credenciais</p>
                  </div>
                  
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-foreground">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="seu@email.com"
                          className="pl-10 bg-input border-border focus:border-orange focus:ring-orange"
                          {...loginForm.register("email")}
                        />
                      </div>
                      {loginForm.formState.errors.email && (
                        <p className="text-sm text-destructive">
                          {loginForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-foreground">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10 bg-input border-border focus:border-orange focus:ring-orange"
                          {...loginForm.register("password")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-orange transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {loginForm.formState.errors.password && (
                        <p className="text-sm text-destructive">
                          {loginForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      variant="orange"
                      className="w-full h-11 text-base font-semibold" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Entrando...
                        </>
                      ) : (
                        "Entrar"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* Signup Tab */}
                <TabsContent value="signup" className="mt-0 space-y-6">
                  <div className="text-center space-y-1">
                    <h2 className="text-xl font-semibold text-foreground">Criar conta</h2>
                    <p className="text-sm text-muted-foreground">Preencha seus dados abaixo</p>
                  </div>

                  <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-foreground">Nome completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Seu nome"
                          className="pl-10 bg-input border-border focus:border-orange focus:ring-orange"
                          {...signupForm.register("fullName")}
                        />
                      </div>
                      {signupForm.formState.errors.fullName && (
                        <p className="text-sm text-destructive">
                          {signupForm.formState.errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-foreground">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="seu@email.com"
                          className="pl-10 bg-input border-border focus:border-orange focus:ring-orange"
                          {...signupForm.register("email")}
                        />
                      </div>
                      {signupForm.formState.errors.email && (
                        <p className="text-sm text-destructive">
                          {signupForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-foreground">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10 bg-input border-border focus:border-orange focus:ring-orange"
                          {...signupForm.register("password")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-orange transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {signupForm.formState.errors.password && (
                        <p className="text-sm text-destructive">
                          {signupForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm" className="text-foreground">Confirmar senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-confirm"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 bg-input border-border focus:border-orange focus:ring-orange"
                          {...signupForm.register("confirmPassword")}
                        />
                      </div>
                      {signupForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-destructive">
                          {signupForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      variant="orange"
                      className="w-full h-11 text-base font-semibold" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Cadastrando...
                        </>
                      ) : (
                        "Criar conta"
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            Novos usuários são cadastrados como <span className="font-medium text-orange">Vendedores</span>.
            <br />
            Contate o administrador para acesso de Admin.
          </p>
        </div>
      </div>
    </div>
  );
}
