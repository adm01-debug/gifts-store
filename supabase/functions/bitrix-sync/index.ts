import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const bitrixWebhookUrl = Deno.env.get('BITRIX24_WEBHOOK_URL');
    
    if (!bitrixWebhookUrl) {
      console.error('BITRIX24_WEBHOOK_URL not configured');
      return new Response(
        JSON.stringify({ error: 'Bitrix24 webhook URL not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, data } = await req.json();
    console.log('Bitrix24 sync action:', action, data);

    let result;

    switch (action) {
      case 'get_companies': {
        // Fetch companies/clients from Bitrix24
        const response = await fetch(`${bitrixWebhookUrl}/crm.company.list`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            select: [
              'ID',
              'TITLE',
              'LOGO',
              'UF_CRM_1590780873288', // Ramo de Atividade
              'UF_CRM_1631795570468', // Nicho/Segmento
              'UF_CRM_1755898066',    // Cor Predominante Logo
              'UF_CRM_1755898357',    // Cores Secundárias Logo
              'EMAIL',
              'PHONE',
              'ADDRESS',
            ],
            filter: data?.filter || {},
            start: data?.start || 0,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Bitrix24 API error:', errorText);
          throw new Error(`Bitrix24 API error: ${response.status}`);
        }

        const bitrixData = await response.json();
        console.log('Bitrix24 response:', JSON.stringify(bitrixData).slice(0, 500));

        // Transform Bitrix24 data to our client format
        const clients = (bitrixData.result || []).map((company: any) => ({
          id: company.ID,
          name: company.TITLE || 'Sem nome',
          ramo: company.UF_CRM_1590780873288 || 'Não informado',
          nicho: company.UF_CRM_1631795570468 || 'Não informado',
          primaryColor: parseColor(company.UF_CRM_1755898066),
          secondaryColors: parseColors(company.UF_CRM_1755898357),
          email: getFirstValue(company.EMAIL),
          phone: getFirstValue(company.PHONE),
          address: company.ADDRESS || '',
          logo: company.LOGO || null,
        }));

        result = {
          clients,
          total: bitrixData.total || clients.length,
          next: bitrixData.next,
        };
        break;
      }

      case 'get_company': {
        // Fetch single company by ID
        const companyId = data?.id;
        if (!companyId) {
          throw new Error('Company ID is required');
        }

        const response = await fetch(`${bitrixWebhookUrl}/crm.company.get`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: companyId }),
        });

        if (!response.ok) {
          throw new Error(`Bitrix24 API error: ${response.status}`);
        }

        const bitrixData = await response.json();
        const company = bitrixData.result;

        result = {
          id: company.ID,
          name: company.TITLE || 'Sem nome',
          ramo: company.UF_CRM_1590780873288 || 'Não informado',
          nicho: company.UF_CRM_1631795570468 || 'Não informado',
          primaryColor: parseColor(company.UF_CRM_1755898066),
          secondaryColors: parseColors(company.UF_CRM_1755898357),
          email: getFirstValue(company.EMAIL),
          phone: getFirstValue(company.PHONE),
          address: company.ADDRESS || '',
          logo: company.LOGO || null,
        };
        break;
      }

      case 'search_companies': {
        // Search companies by name
        const query = data?.query || '';
        
        const response = await fetch(`${bitrixWebhookUrl}/crm.company.list`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            select: ['ID', 'TITLE', 'UF_CRM_1755898066'],
            filter: { '%TITLE': query },
            order: { TITLE: 'ASC' },
            start: 0,
          }),
        });

        if (!response.ok) {
          throw new Error(`Bitrix24 API error: ${response.status}`);
        }

        const bitrixData = await response.json();
        result = (bitrixData.result || []).map((c: any) => ({
          id: c.ID,
          name: c.TITLE,
          primaryColor: parseColor(c.UF_CRM_1755898066),
        }));
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Bitrix24 sync error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper functions
function parseColor(colorValue: string | null): { name: string; hex: string; group: string } {
  if (!colorValue) {
    return { name: 'Cinza', hex: '#6B7280', group: 'CINZA' };
  }
  
  // If it's already a hex color
  if (colorValue.startsWith('#')) {
    return { name: colorValue, hex: colorValue, group: 'CUSTOM' };
  }
  
  // Map common color names to hex
  const colorMap: Record<string, { hex: string; group: string }> = {
    'vermelho': { hex: '#EF4444', group: 'VERMELHO' },
    'azul': { hex: '#3B82F6', group: 'AZUL' },
    'verde': { hex: '#22C55E', group: 'VERDE' },
    'branco': { hex: '#FFFFFF', group: 'BRANCO' },
    'preto': { hex: '#1F2937', group: 'PRETO' },
    'laranja': { hex: '#F97316', group: 'LARANJA' },
    'amarelo': { hex: '#EAB308', group: 'AMARELO' },
    'rosa': { hex: '#EC4899', group: 'ROSA' },
    'cinza': { hex: '#6B7280', group: 'CINZA' },
    'prata': { hex: '#C0C0C0', group: 'PRATA' },
    'marrom': { hex: '#78350F', group: 'MARROM' },
    'roxo': { hex: '#8B5CF6', group: 'ROXO' },
    'dourado': { hex: '#D4AF37', group: 'DOURADO' },
  };

  const normalizedColor = colorValue.toLowerCase().trim();
  const mapped = colorMap[normalizedColor];
  
  if (mapped) {
    return { name: colorValue, ...mapped };
  }
  
  return { name: colorValue, hex: '#6B7280', group: 'CUSTOM' };
}

function parseColors(colorsValue: string | string[] | null): Array<{ name: string; hex: string; group: string }> {
  if (!colorsValue) return [];
  
  const colors = Array.isArray(colorsValue) ? colorsValue : colorsValue.split(',');
  return colors.map(c => parseColor(c.trim())).filter(c => c.hex !== '#6B7280');
}

function getFirstValue(field: any): string {
  if (!field) return '';
  if (Array.isArray(field) && field.length > 0) {
    return field[0]?.VALUE || field[0] || '';
  }
  if (typeof field === 'object' && field.VALUE) {
    return field.VALUE;
  }
  return String(field);
}
