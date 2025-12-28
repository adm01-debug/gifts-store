import { http, HttpResponse } from 'msw';

export const handlers = [
  // Products
  http.get('/api/products', () => {
    return HttpResponse.json({
      data: [
        { id: '1', name: 'Caneta Personalizada', price: 2.5, category: 'Escritório' },
        { id: '2', name: 'Caderno', price: 15.0, category: 'Papelaria' },
        { id: '3', name: 'Squeeze 500ml', price: 12.0, category: 'Brindes' }
      ]
    });
  }),

  http.get('/api/products/:id', ({ params }) => {
    return HttpResponse.json({
      data: {
        id: params.id,
        name: 'Produto Mock',
        price: 10.0,
        description: 'Descrição do produto',
        category: 'Categoria'
      }
    });
  }),

  // Quotes
  http.post('/api/quotes', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      data: { id: 'quote-123', ...body, status: 'draft', createdAt: new Date().toISOString() }
    });
  }),

  http.get('/api/quotes', () => {
    return HttpResponse.json({
      data: [
        { id: 'quote-1', clientName: 'Cliente 1', total: 150.0, status: 'approved' },
        { id: 'quote-2', clientName: 'Cliente 2', total: 250.0, status: 'pending' }
      ]
    });
  }),

  // Clients
  http.get('/api/clients', () => {
    return HttpResponse.json({
      data: [
        { id: 'client-1', name: 'Empresa ABC', email: 'contato@abc.com' },
        { id: 'client-2', name: 'Empresa XYZ', email: 'contato@xyz.com' }
      ]
    });
  }),

  // Bitrix24
  http.post('https://promobrindes.bitrix24.com.br/rest/*', () => {
    return HttpResponse.json({ result: true, data: { id: '123' } });
  }),

  // Supabase
  http.post('https://*.supabase.co/rest/v1/*', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ data: body });
  })
];
