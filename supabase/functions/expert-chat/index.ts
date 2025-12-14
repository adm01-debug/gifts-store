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

    // Fetch available products for context
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, sku, category_name, subcategory, price, colors, materials, tags")
      .eq("is_active", true)
      .limit(100);

    if (productsError) {
      console.error("Error fetching products:", productsError);
    }

    const productsContext = products && products.length > 0
      ? `\nPRODUTOS DISPONÍVEIS (use o formato [[PRODUTO:id:nome]] para criar links clicáveis):
${products.slice(0, 50).map(p => `- ID: ${p.id} | ${p.name} (${p.category_name || "Sem categoria"}) - R$ ${p.price?.toFixed(2) || "N/A"}`).join("\n")}`
      : "";

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

${clientContext}
${productsContext}

IMPORTANTE: Você tem acesso em tempo real aos dados do cliente e histórico de compras do Bitrix24. Use essas informações para fazer recomendações precisas e personalizadas. Lembre-se de usar o formato [[PRODUTO:id:nome]] para tornar os produtos clicáveis.`;

    const apiMessages: Message[] = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    console.log("Calling Lovable AI with", apiMessages.length, "messages");

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
