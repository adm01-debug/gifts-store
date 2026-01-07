// Script simplificado para criar tabelas via Supabase RPC
// Execute com: npx tsx scripts/create-tables.ts

const SUPABASE_URL = 'https://supabase.atomicabr.com.br';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogInNlcnZpY2Vfcm9sZSIsCiAgImlzcyI6ICJzdXBhYmFzZSIsCiAgImlhdCI6IDE3MTUwNTA4MDAsCiAgImV4cCI6IDE4NzI4MTcyMDAKfQ.WZnW4uA9fWo-G4eOdcR1xUGZTY357tgfqD5B-OG93S0';

// SQL para criar tabelas básicas (simplificado para teste)
const CREATE_ORGANIZATIONS = `
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
`;

const CREATE_CATEGORIES = `
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  slug TEXT,
  is_active BOOLEAN DEFAULT true,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
`;

const CREATE_SUPPLIERS = `
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
`;

const CREATE_PRODUCTS = `
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT UNIQUE,
  category_id UUID,
  supplier_id UUID,
  cost_price NUMERIC(10,2),
  sale_price NUMERIC(10,2),
  stock_quantity INTEGER DEFAULT 0,
  min_quantity INTEGER DEFAULT 1,
  image_url TEXT,
  primary_image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  materials JSONB DEFAULT '[]'::jsonb,
  colors JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_on_sale BOOLEAN DEFAULT false,
  is_kit BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  product_type TEXT DEFAULT 'simple',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
`;

async function executeSQL(sql: string, name: string) {
  console.log(`\n⏳ Executando: ${name}...`);
  
  try {
    // Usando o endpoint de execução SQL do Supabase via PostgREST
    // Nota: Isso requer uma função RPC ou acesso direto
    
    // Alternativa: usar a API de management do Supabase
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({ query: sql }),
    });
    
    if (!response.ok) {
      const text = await response.text();
      console.log(`   ⚠️ Resposta: ${response.status} - ${text.substring(0, 200)}`);
    } else {
      console.log(`   ✅ ${name} OK!`);
    }
  } catch (error: any) {
    console.log(`   ❌ Erro: ${error.message}`);
  }
}

async function insertSeedData() {
  console.log('\n📦 Inserindo dados de seed...\n');
  
  // Inserir categorias
  const categoriesData = [
    { id: '00000000-0000-0000-0000-000000000202', name: 'ESPORTES | AVENTURA | LAZER', icon: '⚽', slug: 'esportes' },
    { id: '00000000-0000-0000-0000-000000000124', name: 'BAR | COZINHA', icon: '🍷', slug: 'bar-cozinha' },
    { id: '00000000-0000-0000-0000-000000000224', name: 'TECNOLOGIA | ELETRÔNICOS', icon: '📱', slug: 'tecnologia' },
    { id: '00000000-0000-0000-0000-000000000220', name: 'ROUPAS | CALÇADOS', icon: '👕', slug: 'roupas' },
    { id: '00000000-0000-0000-0000-000000000196', name: 'ECOLOGIA', icon: '🌿', slug: 'ecologia' },
  ];
  
  for (const cat of categoriesData) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/categories`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(cat),
    });
    
    if (response.ok || response.status === 201) {
      console.log(`   ✅ Categoria: ${cat.name}`);
    } else {
      const text = await response.text();
      console.log(`   ⚠️ Categoria ${cat.name}: ${response.status} - ${text.substring(0, 100)}`);
    }
  }
  
  // Inserir fornecedores
  const suppliersData = [
    { id: '00000000-0000-0000-0001-000000000001', name: 'XBZ Brindes', code: 'XBZ' },
    { id: '00000000-0000-0000-0001-000000000002', name: 'Stricker Brasil', code: 'STRICKER' },
    { id: '00000000-0000-0000-0001-000000000003', name: 'Asia Import', code: 'ASIA' },
    { id: '00000000-0000-0000-0001-000000000004', name: 'Só Marcas', code: 'SOMARCAS' },
  ];
  
  for (const sup of suppliersData) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/suppliers`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(sup),
    });
    
    if (response.ok || response.status === 201) {
      console.log(`   ✅ Fornecedor: ${sup.name}`);
    } else {
      const text = await response.text();
      console.log(`   ⚠️ Fornecedor ${sup.name}: ${response.status} - ${text.substring(0, 100)}`);
    }
  }
  
  // Inserir produtos
  const productsData = [
    {
      id: '10000000-0000-0000-0000-000000000001',
      name: 'Squeeze Plástico 700ml',
      description: 'Squeeze de plástico resistente com tampa rosqueável e bico dosador.',
      sku: 'SQ-700-PLAS',
      category_id: '00000000-0000-0000-0000-000000000202',
      supplier_id: '00000000-0000-0000-0001-000000000001',
      sale_price: 12.90,
      stock_quantity: 5420,
      min_quantity: 100,
      primary_image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
      materials: ['PLÁSTICO'],
      colors: [{ name: 'Vermelho', hex: '#EF4444' }, { name: 'Azul', hex: '#3B82F6' }],
      is_featured: true,
    },
    {
      id: '10000000-0000-0000-0000-000000000002',
      name: 'Caneca Metal 350ml',
      description: 'Caneca de metal com acabamento brilhante.',
      sku: 'CAN-MET-350',
      category_id: '00000000-0000-0000-0000-000000000124',
      supplier_id: '00000000-0000-0000-0001-000000000002',
      sale_price: 28.50,
      stock_quantity: 1850,
      min_quantity: 50,
      primary_image_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400',
      materials: ['METAL', 'AÇO INOX'],
      colors: [{ name: 'Branco', hex: '#FFFFFF' }, { name: 'Preto', hex: '#1F2937' }],
      is_new: true,
    },
    {
      id: '10000000-0000-0000-0000-000000000003',
      name: 'Kit Churrasco Premium 10 Peças',
      description: 'Kit completo para churrasco com 10 peças em aço inox.',
      sku: 'KIT-CHUR-10P',
      category_id: '00000000-0000-0000-0000-000000000124',
      supplier_id: '00000000-0000-0000-0001-000000000001',
      sale_price: 189.90,
      stock_quantity: 340,
      min_quantity: 20,
      primary_image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
      materials: ['AÇO INOX', 'MADEIRA', 'COURO'],
      colors: [{ name: 'Preto', hex: '#1F2937' }],
      is_kit: true,
      is_featured: true,
    },
  ];
  
  for (const prod of productsData) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(prod),
    });
    
    if (response.ok || response.status === 201) {
      console.log(`   ✅ Produto: ${prod.name}`);
    } else {
      const text = await response.text();
      console.log(`   ⚠️ Produto ${prod.name}: ${response.status} - ${text.substring(0, 100)}`);
    }
  }
}

async function main() {
  console.log('🚀 Script de criação de tabelas\n');
  console.log('⚠️  IMPORTANTE: As tabelas precisam ser criadas via SQL Editor primeiro!');
  console.log('    Este script apenas insere dados via REST API.\n');
  
  // Tentar inserir dados (assumindo que as tabelas existem)
  await insertSeedData();
  
  console.log('\n✨ Script finalizado!');
}

main().catch(console.error);
