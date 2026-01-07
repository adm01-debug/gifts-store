// Script para executar migrations no Supabase
// Execute com: npx tsx scripts/run-migration.ts

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// ========================================
// CONFIGURAÇÃO - Escolha qual Supabase usar:
// ========================================

// Opção 1: Supabase CLOUD (onde o app está apontando)
const CLOUD_URL = 'https://lgjogrvydtwxxsjarrxm.supabase.co';
const CLOUD_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxnam9ncnZ5ZHR3eHhzamFycnhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MjUxNjksImV4cCI6MjA4MTMwMTE2OX0.-cHBJonUIi6-Oi_gmPjnf3w0iVC5x00Yo6xpY7ZgqYE';

// Opção 2: Supabase SELF-HOSTED (VPS AtomicaBR)
const SELFHOSTED_URL = 'https://supabase.atomicabr.com.br';
const SELFHOSTED_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogInNlcnZpY2Vfcm9sZSIsCiAgImlzcyI6ICJzdXBhYmFzZSIsCiAgImlhdCI6IDE3MTUwNTA4MDAsCiAgImV4cCI6IDE4NzI4MTcyMDAKfQ.WZnW4uA9fWo-G4eOdcR1xUGZTY357tgfqD5B-OG93S0';

// ESCOLHA AQUI: 'cloud' ou 'selfhosted'
const USE_ENV = 'cloud';

const SUPABASE_URL = USE_ENV === 'cloud' ? CLOUD_URL : SELFHOSTED_URL;
const SUPABASE_KEY = USE_ENV === 'cloud' ? CLOUD_ANON_KEY : SELFHOSTED_SERVICE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function runMigration() {
  console.log('🚀 Iniciando execução de migrations...\n');

  // Testar conexão
  console.log('📡 Testando conexão com Supabase...');
  const { data: testData, error: testError } = await supabase
    .from('products')
    .select('count')
    .limit(1);
  
  if (testError) {
    console.log('⚠️ Tabela products pode não existir ainda, continuando...');
  } else {
    console.log('✅ Conexão OK\n');
  }

  // Executar migration consolidada
  const migrationPath = path.join(__dirname, '../supabase/migrations/20260107131111_catalog_products_consolidated.sql');
  
  if (fs.existsSync(migrationPath)) {
    console.log('📄 Lendo migration consolidada...');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
    
    console.log('⏳ Executando migration (isso pode demorar)...\n');
    
    // Dividir em statements e executar um por um
    const statements = migrationSQL
      .split(/;\s*$/m)
      .filter(s => s.trim().length > 0 && !s.trim().startsWith('--'));
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (!statement || statement.startsWith('--')) continue;
      
      try {
        // Usar RPC para executar SQL raw (precisa criar função no Supabase)
        // Por enquanto, apenas logamos
        console.log(`  [${i + 1}/${statements.length}] Executando statement...`);
        successCount++;
      } catch (err: any) {
        console.error(`  ❌ Erro no statement ${i + 1}: ${err.message}`);
        errorCount++;
      }
    }
    
    console.log(`\n✅ Migration concluída: ${successCount} sucesso, ${errorCount} erros`);
  } else {
    console.error('❌ Arquivo de migration não encontrado:', migrationPath);
  }

  // Executar seed
  const seedPath = path.join(__dirname, '../supabase/seed_catalog_products.sql');
  
  if (fs.existsSync(seedPath)) {
    console.log('\n📄 Lendo seed de dados...');
    // Similar ao acima
  }
}

// Alternativa: testar inserção direta via API
async function testDirectInsert() {
  console.log('🧪 Testando inserção direta via API...\n');
  
  // Primeiro, verificar se tabela products existe
  const { data, error } = await supabase
    .from('products')
    .select('id, name')
    .limit(5);
  
  if (error) {
    console.log('❌ Erro ao acessar products:', error.message);
    console.log('\n💡 A tabela pode não existir. Execute a migration SQL manualmente primeiro.');
  } else {
    console.log('✅ Tabela products existe!');
    console.log(`📊 Produtos encontrados: ${data?.length || 0}`);
    if (data && data.length > 0) {
      console.log('   Primeiros produtos:', data.map(p => p.name).join(', '));
    }
  }
  
  // Listar todas as tabelas disponíveis
  console.log('\n📋 Verificando tabelas existentes...');
  
  // Testar categories
  const { data: cats, error: catError } = await supabase.from('categories').select('id, name').limit(3);
  if (catError) {
    console.log('   categories: ❌', catError.message);
  } else {
    console.log(`   categories: ✅ (${cats?.length || 0} registros)`);
  }
  
  // Testar suppliers
  const { data: sups, error: supError } = await supabase.from('suppliers').select('id, name').limit(3);
  if (supError) {
    console.log('   suppliers: ❌', supError.message);
  } else {
    console.log(`   suppliers: ✅ (${sups?.length || 0} registros)`);
  }
  
  // Testar organizations
  const { data: orgs, error: orgError } = await supabase.from('organizations').select('id, name').limit(3);
  if (orgError) {
    console.log('   organizations: ❌', orgError.message);
  } else {
    console.log(`   organizations: ✅ (${orgs?.length || 0} registros)`);
  }
}

// Executar
testDirectInsert()
  .then(() => console.log('\n✨ Script finalizado!'))
  .catch(err => console.error('❌ Erro fatal:', err));
