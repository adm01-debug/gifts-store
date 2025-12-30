import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2, X, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type Product } from "@/data/mockData";

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  products?: Product[];
}

interface AIChatProps {
  clientId?: string;
  clientName?: string;
  onProductSelect?: (product: Product) => void;
  className?: string;
}

export function AIChat({ clientId, clientName, onProductSelect, className }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou seu assistente de vendas com IA. Como posso ajudar você hoje?',
      timestamp: new Date(),
      suggestions: [
        'Produtos para eventos corporativos',
        'Brindes sustentáveis',
        'Kits personalizados',
        'Novidades do catálogo',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll para última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focar input quando abrir
  useEffect(() => {
    if (!isMinimized) {
      inputRef.current?.focus();
    }
  }, [isMinimized]);

  // Simular resposta da IA
  const getAIResponse = async (userMessage: string): Promise<Message> => {
    // Em produção, integrar com API real (Claude, GPT, etc)
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lowerMessage = userMessage.toLowerCase();
    
    // Respostas inteligentes baseadas em contexto
    if (lowerMessage.includes('evento') || lowerMessage.includes('corporativ')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Ótimo! Para eventos corporativos, temos várias opções excelentes:\n\n• Canetas executivas personalizadas\n• Cadernos com logo da empresa\n• Garrafas térmicas de qualidade\n• Kits welcome para novos colaboradores\n• Brindes tecnológicos (pen drives, power banks)\n\nQual o tipo de evento e quantidade aproximada?',
        timestamp: new Date(),
        suggestions: [
          'Ver canetas executivas',
          'Ver kits welcome',
          'Orçamento para 100 unidades',
        ],
      };
    }

    if (lowerMessage.includes('sustent') || lowerMessage.includes('ecológic')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Excelente escolha! Nossa linha sustentável inclui:\n\n• Produtos feitos com materiais reciclados\n• Canudos reutilizáveis\n• Ecobags personalizadas\n• Canetas de bambu\n• Garrafas eco-friendly\n\nTodos com certificações ambientais. Quer ver alguma categoria específica?',
        timestamp: new Date(),
        suggestions: [
          'Ver ecobags',
          'Ver canetas de bambu',
          'Certificações disponíveis',
        ],
      };
    }

    if (lowerMessage.includes('kit') || lowerMessage.includes('conjunto')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Temos kits prontos e também montamos personalizados! Alguns populares:\n\n• Kit Home Office (mouse pad, caneta, caderno)\n• Kit Bem-estar (garrafa, toalha, squeeze)\n• Kit Executivo (caneta, carteira, chaveiro)\n• Kit Tecnológico (pen drive, power bank, fone)\n\nPosso ajudar a montar um kit personalizado para você?',
        timestamp: new Date(),
        suggestions: [
          'Montar kit personalizado',
          'Ver kits prontos',
          'Preços dos kits',
        ],
      };
    }

    if (lowerMessage.includes('preço') || lowerMessage.includes('quanto custa') || lowerMessage.includes('valor')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Os preços variam conforme:\n\n• Quantidade (temos descontos progressivos)\n• Personalização (impressão, gravação laser, bordado)\n• Prazo de entrega\n\nPara orçamento preciso, preciso saber:\n1. Qual produto te interessa?\n2. Quantidade aproximada?\n3. Tipo de personalização desejada?',
        timestamp: new Date(),
        suggestions: [
          'Falar sobre quantidade',
          'Ver tabela de descontos',
          'Tipos de personalização',
        ],
      };
    }

    if (lowerMessage.includes('entrega') || lowerMessage.includes('prazo')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Nossos prazos de entrega:\n\n• Express (5-7 dias): produtos em estoque sem personalização\n• Padrão (10-15 dias): com personalização simples\n• Personalizado (15-20 dias): gravação laser, bordado\n• Grande volume (20-30 dias): acima de 500 unidades\n\nPosso verificar disponibilidade de algum produto específico?',
        timestamp: new Date(),
        suggestions: [
          'Produtos em estoque',
          'Entrega urgente',
          'Consultar disponibilidade',
        ],
      };
    }

    // Resposta genérica inteligente
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Entendi sua questão sobre "${userMessage}". Posso ajudar você com:\n\n• Sugestões de produtos personalizadas\n• Orçamentos detalhados\n• Informações sobre personalização\n• Prazos e condições de pagamento\n• Montagem de kits corporativos\n\nO que você gostaria de saber primeiro?`,
      timestamp: new Date(),
      suggestions: [
        'Ver catálogo completo',
        'Fazer orçamento',
        'Falar com especialista',
      ],
    };
  };

  // Enviar mensagem
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await getAIResponse(input);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Desculpe, tive um problema ao processar sua mensagem. Pode tentar novamente?',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Usar sugestão
  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  if (isMinimized) {
    return (
      <Button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <Bot className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card
      className={cn(
        "fixed bottom-4 right-4 shadow-2xl z-50 flex flex-col transition-all",
        isExpanded ? "w-[600px] h-[700px]" : "w-96 h-[500px]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary-foreground/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">Assistente IA</h3>
            <p className="text-xs opacity-80">
              {clientName ? `Atendendo ${clientName}` : 'Online agora'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(true)}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
              )}

              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-3 space-y-2",
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {message.suggestions.map((suggestion, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80"
                        onClick={() => handleSuggestion(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                )}

                <p className="text-xs opacity-50">
                  {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {message.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="bg-muted rounded-lg p-3">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Digite sua mensagem..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Assistente com IA • Respostas instantâneas
        </p>
      </div>
    </Card>
  );
}
