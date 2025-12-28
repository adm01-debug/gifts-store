export const mockQuotes = [
  {
    id: 'quote-1',
    clientId: 'client-1',
    clientName: 'Empresa ABC Ltda',
    clientEmail: 'contato@empresaabc.com',
    status: 'approved',
    items: [
      {
        productId: 'prod-1',
        productName: 'Caneta Personalizada',
        quantity: 500,
        unitPrice: 2.50,
        technique: 'Laser',
        color: 'Azul',
        total: 1250.00
      },
      {
        productId: 'prod-2',
        productName: 'Squeeze 500ml',
        quantity: 200,
        unitPrice: 12.00,
        technique: 'Tampografia',
        color: 'Branco',
        total: 2400.00
      }
    ],
    subtotal: 3650.00,
    discount: 182.50,
    total: 3467.50,
    validUntil: '2025-01-28',
    createdAt: '2025-12-20T10:00:00Z',
    updatedAt: '2025-12-22T14:30:00Z'
  },
  {
    id: 'quote-2',
    clientId: 'client-2',
    clientName: 'XYZ Comércio',
    clientEmail: 'vendas@xyz.com',
    status: 'pending',
    items: [
      {
        productId: 'prod-3',
        productName: 'Caderno Capa Dura A5',
        quantity: 100,
        unitPrice: 18.50,
        technique: 'Hot Stamping',
        color: 'Preto',
        total: 1850.00
      }
    ],
    subtotal: 1850.00,
    discount: 0,
    total: 1850.00,
    validUntil: '2025-01-15',
    createdAt: '2025-12-25T09:00:00Z',
    updatedAt: '2025-12-25T09:00:00Z'
  },
  {
    id: 'quote-3',
    clientId: 'client-3',
    clientName: 'Eventos Premium',
    clientEmail: 'eventos@premium.com',
    status: 'draft',
    items: [
      {
        productId: 'prod-4',
        productName: 'Ecobag Personalizada',
        quantity: 300,
        unitPrice: 8.90,
        technique: 'Serigrafia',
        color: 'Natural',
        total: 2670.00
      },
      {
        productId: 'prod-5',
        productName: 'Chaveiro Metal',
        quantity: 500,
        unitPrice: 5.50,
        technique: 'Laser',
        color: 'Prata',
        total: 2750.00
      }
    ],
    subtotal: 5420.00,
    discount: 271.00,
    total: 5149.00,
    validUntil: '2025-01-30',
    createdAt: '2025-12-28T11:00:00Z',
    updatedAt: '2025-12-28T11:00:00Z'
  }
];

export const mockQuote = mockQuotes[0];
