import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ApprovalRequest {
  action: "get_quote" | "approve" | "reject";
  token: string;
  notes?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, token, notes }: ApprovalRequest = await req.json();

    console.log(`[quote-approval] Action: ${action}, Token: ${token?.substring(0, 8)}...`);

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Token é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate token
    const { data: tokenData, error: tokenError } = await supabase
      .from("quote_approval_tokens")
      .select("*, quotes(*)")
      .eq("token", token)
      .maybeSingle();

    if (tokenError || !tokenData) {
      console.error("[quote-approval] Token not found:", tokenError);
      return new Response(
        JSON.stringify({ error: "Link inválido ou expirado" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if token is expired
    if (new Date(tokenData.expires_at) < new Date()) {
      console.log("[quote-approval] Token expired");
      return new Response(
        JSON.stringify({ error: "Este link expirou. Solicite um novo link ao vendedor." }),
        { status: 410, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if token was already used
    if (tokenData.used_at && action !== "get_quote") {
      console.log("[quote-approval] Token already used");
      return new Response(
        JSON.stringify({ error: "Este link já foi utilizado." }),
        { status: 410, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const quote = tokenData.quotes;
    
    if (!quote) {
      return new Response(
        JSON.stringify({ error: "Orçamento não encontrado" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Handle different actions
    if (action === "get_quote") {
      // Fetch quote with items
      const { data: quoteItems, error: itemsError } = await supabase
        .from("quote_items")
        .select(`
          *,
          quote_item_personalizations (
            *,
            personalization_techniques (id, name, code)
          )
        `)
        .eq("quote_id", quote.id)
        .order("sort_order");

      if (itemsError) {
        console.error("[quote-approval] Error fetching items:", itemsError);
      }

      // Fetch client info
      const { data: client } = await supabase
        .from("bitrix_clients")
        .select("id, name, email, phone")
        .eq("id", quote.client_id)
        .maybeSingle();

      // Format items for response
      const items = quoteItems?.map((item: any) => ({
        id: item.id,
        product_name: item.product_name,
        product_sku: item.product_sku,
        product_image_url: item.product_image_url,
        quantity: item.quantity,
        unit_price: item.unit_price,
        color_name: item.color_name,
        color_hex: item.color_hex,
        notes: item.notes,
        personalizations: item.quote_item_personalizations?.map((p: any) => ({
          technique_name: p.personalization_techniques?.name,
          colors_count: p.colors_count,
          area_cm2: p.area_cm2,
          setup_cost: p.setup_cost,
          unit_cost: p.unit_cost,
        })),
      })) || [];

      return new Response(
        JSON.stringify({
          quote: {
            id: quote.id,
            quote_number: quote.quote_number,
            status: quote.status,
            subtotal: quote.subtotal,
            discount_percent: quote.discount_percent,
            discount_amount: quote.discount_amount,
            total: quote.total,
            notes: quote.notes,
            valid_until: quote.valid_until,
            created_at: quote.created_at,
            client_response: quote.client_response,
            client_response_at: quote.client_response_at,
            client_response_notes: quote.client_response_notes,
          },
          client,
          items,
          token_used: !!tokenData.used_at,
          token_expires_at: tokenData.expires_at,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "approve" || action === "reject") {
      const newStatus = action === "approve" ? "approved" : "rejected";
      const responseText = action === "approve" ? "Aprovado" : "Rejeitado";

      // Update quote status
      const { error: updateError } = await supabase
        .from("quotes")
        .update({
          status: newStatus,
          client_response: responseText,
          client_response_at: new Date().toISOString(),
          client_response_notes: notes || null,
        })
        .eq("id", quote.id);

      if (updateError) {
        console.error("[quote-approval] Error updating quote:", updateError);
        return new Response(
          JSON.stringify({ error: "Erro ao processar resposta" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Mark token as used
      await supabase
        .from("quote_approval_tokens")
        .update({ used_at: new Date().toISOString() })
        .eq("id", tokenData.id);

      // Add to quote history
      await supabase
        .from("quote_history")
        .insert({
          quote_id: quote.id,
          user_id: tokenData.created_by,
          action: "status_changed",
          description: `Cliente ${responseText.toLowerCase()} o orçamento via link público${notes ? `: "${notes}"` : ""}`,
          field_changed: "status",
          old_value: quote.status,
          new_value: newStatus,
        });

      console.log(`[quote-approval] Quote ${quote.quote_number} ${responseText}`);

      return new Response(
        JSON.stringify({
          success: true,
          message: `Orçamento ${responseText.toLowerCase()} com sucesso!`,
          status: newStatus,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Ação inválida" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[quote-approval] Error:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
