export const mockClients = [
  {
    id: 'client-1',
    name: 'Empresa ABC Ltda',
    tradeName: 'ABC Comércio',
    cnpj: '12.345.678/0001-90',
    email: 'contato@empresaabc.com',
    phone: '(11) 98765-4321',
    address: {
      street: 'Rua das Flores',
      number: '123',
      complement: 'Sala 456',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    contact: {
      name: 'João Silva',
      role: 'Gerente de Compras',
      email: 'joao.silva@empresaabc.com',
      phone: '(11) 91234-5678'
    },
    createdAt: '2024-01-15T10:00:00Z',
    lastPurchase: '2025-12-20T14:30:00Z',
    totalOrders: 15,
    totalSpent: 45000.00,
    segment: 'Varejo',
    status: 'active'
  },
  {
    id: 'client-2',
    name: 'XYZ Comércio e Serviços Ltda',
    tradeName: 'XYZ Store',
    cnpj: '98.765.432/0001-10',
    email: 'vendas@xyz.com',
    phone: '(21) 3333-4444',
    address: {
      street: 'Av. Paulista',
      number: '1000',
      complement: 'Andar 10',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100'
    },
    contact: {
      name: 'Maria Santos',
      role: 'Diretora Comercial',
      email: 'maria.santos@xyz.com',
      phone: '(21) 99999-8888'
    },
    createdAt: '2024-03-20T08:00:00Z',
    lastPurchase: '2025-11-10T10:00:00Z',
    totalOrders: 8,
    totalSpent: 28000.00,
    segment: 'Atacado',
    status: 'active'
  },
  {
    id: 'client-3',
    name: 'Eventos Premium Ltda',
    tradeName: 'Eventos Premium',
    cnpj: '11.222.333/0001-44',
    email: 'eventos@premium.com',
    phone: '(11) 5555-6666',
    address: {
      street: 'Rua dos Eventos',
      number: '500',
      complement: '',
      neighborhood: 'Itaim Bibi',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '04538-000'
    },
    contact: {
      name: 'Carlos Oliveira',
      role: 'CEO',
      email: 'carlos@premium.com',
      phone: '(11) 97777-6666'
    },
    createdAt: '2024-06-10T14:00:00Z',
    lastPurchase: null,
    totalOrders: 0,
    totalSpent: 0,
    segment: 'Eventos',
    status: 'lead'
  }
];

export const mockClient = mockClients[0];
