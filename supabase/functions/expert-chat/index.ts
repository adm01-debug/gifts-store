import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ClientData {
  id: string;
  name: string;
  ramo?: string;
  nicho?: string;
  primary_color_name?: string;
  primary_color_hex?: string;
  logo_url?: string;
  total_spent?: number;
  last_purchase_date?: string;
}

interface DealData {
  title: string;
  value?: number;
  stage?: string;
  created_at_bitrix?: string;
}

// Extract search terms from the last user message
function extractSearchTerms(messages: Message[]): string[] {
  const lastUserMessage = [...messages].reverse().find(m => m.role === "user");
  if (!lastUserMessage) return [];
  
  const content = lastUserMessage.content.toLowerCase();
  
  // Remove common words and extract meaningful terms
  const stopWords = new Set([
    "o", "a", "os", "as", "um", "uma", "uns", "umas", "de", "da", "do", "das", "dos",
    "em", "na", "no", "nas", "nos", "por", "para", "com", "sem", "que", "qual", "quais",
    "como", "onde", "quando", "porque", "se", "ou", "e", "mas", "mais", "menos",
    "muito", "muita", "muitos", "muitas", "pouco", "pouca", "poucos", "poucas",
    "esse", "essa", "esses", "essas", "este", "esta", "estes", "estas", "aquele", "aquela",
    "isso", "isto", "aquilo", "meu", "minha", "seu", "sua", "nosso", "nossa",
    "algum", "alguma", "alguns", "algumas", "nenhum", "nenhuma", "todo", "toda", "todos", "todas",
    "outro", "outra", "outros", "outras", "mesmo", "mesma", "próprio", "própria",
    "você", "vocês", "ele", "ela", "eles", "elas", "nós", "eu", "me", "te", "lhe", "nos",
    "preciso", "quero", "gostaria", "poderia", "pode", "tem", "tenho", "ter", "haver",
    "ser", "estar", "fazer", "dar", "ver", "ir", "vir", "saber", "querer", "poder",
    "cliente", "produto", "produtos", "brinde", "brindes", "recomenda", "recomende", "sugira", "sugere",
    "melhor", "melhores", "bom", "boa", "bons", "boas", "ótimo", "ótima", "excelente",
  ]);
  
  const words = content
    .replace(/[^\w\sàáâãéêíóôõúç]/g, " ")
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
  
  return [...new Set(words)];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, clientId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não está configurada");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch client data if clientId is provided
    let clientContext = "";
    let clientData: ClientData | null = null;
    let clientDeals: DealData[] = [];

    if (clientId) {
      console.log("Fetching client data for:", clientId);
      
      const { data: client, error: clientError } = await supabase
        .from("bitrix_clients")
        .select("*")
        .eq("id", clientId)
        .single();

      if (clientError) {
        console.error("Error fetching client:", clientError);
      } else {
        clientData = client;
        console.log("Client data:", clientData);
      }

      // Fetch client deals/purchase history
      const { data: deals, error: dealsError } = await supabase
        .from("bitrix_deals")
        .select("*")
        .eq("bitrix_client_id", clientId)
        .order("created_at_bitrix", { ascending: false })
        .limit(20);

      if (dealsError) {
        console.error("Error fetching deals:", dealsError);
      } else {
        clientDeals = deals || [];
        console.log("Client deals count:", clientDeals.length);
      }

      if (clientData) {
        clientContext = `
CONTEXTO DO CLIENTE ATUAL:
- Nome: ${clientData.name}
- Ramo de atividade: ${clientData.ramo || "Não informado"}
- Nicho/Segmento: ${clientData.nicho || "Não informado"}
- Cor primária da marca: ${clientData.primary_color_name || "Não informada"} ${clientData.primary_color_hex ? `(${clientData.primary_color_hex})` : ""}
- Logo disponível: ${clientData.logo_url ? "Sim" : "Não"}
- Total investido: ${clientData.total_spent ? `R$ ${clientData.total_spent.toLocaleString("pt-BR")}` : "Não disponível"}
- Última compra: ${clientData.last_purchase_date ? new Date(clientData.last_purchase_date).toLocaleDateString("pt-BR") : "Não disponível"}

HISTÓRICO DE COMPRAS (últimas ${clientDeals.length} negociações):
${clientDeals.length > 0 
  ? clientDeals.map((deal, i) => `${i + 1}. ${deal.title} - ${deal.value ? `R$ ${deal.value.toLocaleString("pt-BR")}` : "Valor não informado"} (${deal.stage || "Em andamento"})`).join("\n")
  : "Nenhum histórico de compras encontrado"}
`;
      }
    }

    // Extract search terms from conversation
    const searchTerms = extractSearchTerms(messages);
    console.log("Extracted search terms:", searchTerms);

    let productsContext = "";
    let semanticResults: any[] = [];

    // If we have search terms, use semantic search
    if (searchTerms.length > 0) {
      const searchQuery = searchTerms.join(" ");
      console.log("Performing semantic search for:", searchQuery);
      
      const { data: semanticProducts, error: semanticError } = await supabase
        .rpc("search_products_semantic", { 
          search_query: searchQuery,
          max_results: 30
        });

      if (semanticError) {
        console.error("Semantic search error:", semanticError);
      } else {
        semanticResults = semanticProducts || [];
        console.log("Semantic search found:", semanticResults.length, "products");
      }
    }

    // Also fetch general products for broader context
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, sku, category_name, subcategory, description, price, colors, materials, tags")
      .eq("is_active", true)
      .limit(50);

    if (productsError) {
      console.error("Error fetching products:", productsError);
    }

    // Build product description helper
    const buildProductDescription = (p: any, relevance?: number): string => {
      const parts = [
        `ID: ${p.id}`,
        `Nome: ${p.name}`,
        p.sku ? `SKU: ${p.sku}` : null,
        p.category_name ? `Categoria: ${p.category_name}` : null,
        p.subcategory ? `Subcategoria: ${p.subcategory}` : null,
        `Preço: R$ ${p.price?.toFixed(2) || "N/A"}`,
        p.description ? `Descrição: ${p.description.substring(0, 150)}` : null,
        p.materials?.length ? `Materiais: ${p.materials.join(", ")}` : null,
        relevance !== undefined ? `[Relevância: ${(relevance * 100).toFixed(0)}%]` : null,
      ].filter(Boolean);
      return parts.join(" | ");
    };

    // Build context with semantic results prioritized
    if (semanticResults.length > 0) {
      productsContext = `
PRODUTOS ENCONTRADOS POR BUSCA SEMÂNTICA (ordenados por relevância):
Estes produtos são os mais relevantes para a busca "${searchTerms.join(" ")}":

${semanticResults.map(p => buildProductDescription(p, p.relevance)).join("\n\n")}
`;
    }

    // Add general catalog context
    if (products && products.length > 0) {
      const generalProducts = products.filter(
        p => !semanticResults.some(sr => sr.id === p.id)
      ).slice(0, 20);

      if (generalProducts.length > 0) {
        productsContext += `

OUTROS PRODUTOS DO CATÁLOGO (para contexto adicional):
${generalProducts.map(p => buildProductDescription(p)).join("\n\n")}
`;
      }
    }

    if (productsContext) {
      productsContext = `
CATÁLOGO DE PRODUTOS (use o formato [[PRODUTO:id:nome]] para criar links clicáveis):
${productsContext}`;
    }

    const systemPrompt = `Você é o EXPERT, um consultor especializado em produtos promocionais e brindes corporativos da Promo Brindes.

SEU PAPEL:
- Você é experiente e conhece profundamente o catálogo de produtos
- Ajuda vendedores a encontrar os melhores produtos para cada cliente
- Analisa o perfil do cliente (ramo, nicho, cores da marca, histórico) para fazer recomendações personalizadas
- Sugere produtos que combinam com as cores da marca do cliente
- Considera o histórico de compras para sugerir produtos complementares ou similares

FORMATO DE LINKS DE PRODUTOS:
Quando recomendar produtos, SEMPRE use este formato para criar links clicáveis:
[[PRODUTO:id_do_produto:Nome do Produto]]

Exemplo: "Recomendo o [[PRODUTO:abc123:Caderno Executivo Premium]] que combina perfeitamente com as cores da marca."

BUSCA SEMÂNTICA:
Você tem acesso a uma busca semântica avançada que encontra produtos por similaridade de texto.
Os produtos listados em "PRODUTOS ENCONTRADOS POR BUSCA SEMÂNTICA" são os mais relevantes para a busca atual.
PRIORIZE esses produtos nas suas recomendações, pois são os mais adequados ao que o vendedor está buscando.

DIRETRIZES:
1. Seja proativo e sugira produtos baseado no contexto do cliente
2. Sempre explique POR QUE está recomendando cada produto
3. Considere as cores da marca do cliente nas sugestões
4. Analise o histórico para entender preferências
5. Sugira produtos para datas comemorativas quando apropriado
6. Seja conciso mas informativo
7. Use linguagem profissional mas acessível
8. Se não souber algo, seja honesto
9. SEMPRE use o formato [[PRODUTO:id:nome]] ao mencionar produtos específicos
10. PRIORIZE produtos da busca semântica quando disponíveis

MAPEAMENTO DE CARACTERÍSTICAS:
- "produto sustentável/ecológico" → materiais: bambu, papel reciclado, algodão orgânico, madeira, cortiça
- "brinde tecnológico" → carregadores, power banks, pen drives, fones, suportes celular
- "item para escritório" → canetas, cadernos, organizadores, mouse pads, porta-canetas
- "presente premium/executivo" → kits, itens em couro, canetas metálicas, agendas premium
- "para eventos" → ecobags, squeezes, bonés, camisetas
- "fim de ano" → kits natalinos, champanheiras, porta-vinhos

${clientContext}
${productsContext}

IMPORTANTE: Você tem acesso em tempo real aos dados do cliente e histórico de compras do Bitrix24, além de busca semântica avançada que encontra produtos por similaridade. Use essas informações para fazer recomendações precisas e personalizadas. Lembre-se de usar o formato [[PRODUTO:id:nome]] para tornar os produtos clicáveis.`;

    const apiMessages: Message[] = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    console.log("Calling Lovable AI with", apiMessages.length, "messages");
    console.log("System prompt length:", systemPrompt.length);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: apiMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Aguarde alguns minutos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos de IA esgotados. Adicione créditos na workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    // Return streaming response
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("Expert chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
