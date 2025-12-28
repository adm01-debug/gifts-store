export const mockProducts = [
  {
    id: 'prod-1',
    name: 'Caneta Personalizada',
    description: 'Caneta esferográfica com gravação a laser',
    price: 2.50,
    category: 'Escritório',
    stock: 1000,
    images: ['https://example.com/caneta.jpg'],
    techniques: ['Serigrafia', 'Laser', 'Tampografia'],
    colors: ['Azul', 'Preto', 'Vermelho', 'Verde'],
    minQuantity: 50,
    leadTime: 7
  },
  {
    id: 'prod-2',
    name: 'Squeeze 500ml',
    description: 'Garrafa plástica personalizada',
    price: 12.00,
    category: 'Brindes',
    stock: 500,
    images: ['https://example.com/squeeze.jpg'],
    techniques: ['Tampografia', 'Transfer', 'Adesivo'],
    colors: ['Transparente', 'Branco', 'Azul'],
    minQuantity: 100,
    leadTime: 10
  },
  {
    id: 'prod-3',
    name: 'Caderno Capa Dura A5',
    description: 'Caderno personalizado 96 folhas',
    price: 18.50,
    category: 'Papelaria',
    stock: 300,
    images: ['https://example.com/caderno.jpg'],
    techniques: ['UV', 'Hot Stamping'],
    colors: ['Preto', 'Azul Marinho', 'Vinho'],
    minQuantity: 50,
    leadTime: 12
  },
  {
    id: 'prod-4',
    name: 'Ecobag Personalizada',
    description: 'Sacola ecológica 100% algodão',
    price: 8.90,
    category: 'Sustentável',
    stock: 800,
    images: ['https://example.com/ecobag.jpg'],
    techniques: ['Serigrafia', 'Sublimação'],
    colors: ['Natural', 'Preta', 'Colorida'],
    minQuantity: 100,
    leadTime: 8
  },
  {
    id: 'prod-5',
    name: 'Chaveiro Metal',
    description: 'Chaveiro personalizado em metal',
    price: 5.50,
    category: 'Acessórios',
    stock: 1500,
    images: ['https://example.com/chaveiro.jpg'],
    techniques: ['Laser', 'Relevo'],
    colors: ['Prata', 'Dourado', 'Bronze'],
    minQuantity: 200,
    leadTime: 5
  }
];

export const mockProduct = mockProducts[0];
