# Padrão Enterprise de Migrations

## Visão Geral

Este documento define o padrão enterprise para migrations do banco de dados PostgreSQL no Supabase. Seguir estes padrões garante consistência, segurança e manutenibilidade.

## Estrutura de Diretórios

```
supabase/
├── migrations/
│   ├── 001_initial_schema.sql          # Esquema inicial
│   ├── 002_add_products_table.sql      # Adiciona tabela
│   ├── 003_add_categories_table.sql    # Adiciona tabela
│   └── ...
├── seeds/
│   ├── 001_categories.sql              # Dados de categorias
│   ├── 002_suppliers.sql               # Dados de fornecedores
│   └── 003_products.sql                # Dados de produtos
└── functions/
    ├── increment_counters.sql          # Funções de contadores
    └── search_products.sql             # Funções de busca
```

## Convenção de Nomenclatura

### Migrations

```
{NNN}_{ação}_{recurso}_{detalhes}.sql
```

| Parte | Descrição | Exemplo |
|-------|-----------|---------|
| `NNN` | Número sequencial (3 dígitos) | `001`, `002`, `015` |
| `ação` | Verbo da ação | `create`, `add`, `drop`, `alter`, `fix` |
| `recurso` | Tabela ou recurso afetado | `products`, `categories`, `indexes` |
| `detalhes` | Detalhe opcional | `table`, `columns`, `fk`, `rls` |

**Exemplos:**
- `001_create_organizations_table.sql`
- `002_create_categories_table.sql`
- `003_create_suppliers_table.sql`
- `004_create_products_table.sql`
- `005_add_products_indexes.sql`
- `006_add_products_rls.sql`
- `007_create_counter_functions.sql`

### Seeds

```
{NNN}_{tabela}.sql
```

**Exemplos:**
- `001_categories.sql`
- `002_suppliers.sql`
- `003_products.sql`

## Estrutura de uma Migration

```sql
-- ============================================================
-- Migration: {NNN}_{nome}
-- Data: {YYYY-MM-DD}
-- Autor: {nome}
-- Descrição: {descrição breve}
-- ============================================================

-- ============================================================
-- PRÉ-REQUISITOS
-- ============================================================
-- Depende de: {lista de migrations anteriores}
-- Extensões necessárias: {pg_trgm, uuid-ossp, etc.}

-- ============================================================
-- MIGRATION
-- ============================================================

-- [Código SQL aqui]

-- ============================================================
-- ROLLBACK (executar manualmente se necessário)
-- ============================================================
-- DROP TABLE IF EXISTS public.{tabela} CASCADE;
-- DROP FUNCTION IF EXISTS public.{função};
```

## Regras de Ouro

### 1. Uma Migration = Uma Responsabilidade
```sql
-- ❌ ERRADO: Criar tabela + índices + RLS + funções
-- ✅ CERTO: Separar em múltiplas migrations
```

### 2. Idempotência
```sql
-- ❌ ERRADO
CREATE TABLE products (...);

-- ✅ CERTO
CREATE TABLE IF NOT EXISTS products (...);
```

### 3. Adição de Colunas Segura
```sql
-- ❌ ERRADO
ALTER TABLE products ADD COLUMN new_col TEXT;

-- ✅ CERTO
ALTER TABLE products ADD COLUMN IF NOT EXISTS new_col TEXT;
```

### 4. Foreign Keys com Verificação
```sql
-- ❌ ERRADO
ALTER TABLE products ADD FOREIGN KEY (category_id) REFERENCES categories(id);

-- ✅ CERTO
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'products_category_id_fkey'
  ) THEN
    ALTER TABLE products 
    ADD CONSTRAINT products_category_id_fkey 
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
  END IF;
END $$;
```

### 5. Índices com IF NOT EXISTS
```sql
-- ✅ CERTO
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
```

### 6. Nunca DROP em Produção
```sql
-- ❌ NUNCA FAZER
DROP TABLE products;
DROP COLUMN important_data;

-- ✅ CERTO: Soft delete ou renomear
ALTER TABLE products RENAME TO products_deprecated;
ALTER TABLE products ADD COLUMN is_deleted BOOLEAN DEFAULT false;
```

### 7. Defaults Explícitos
```sql
-- ❌ ERRADO
stock INTEGER;

-- ✅ CERTO
stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0);
```

### 8. Comentários em Tabelas e Colunas
```sql
COMMENT ON TABLE products IS 'Catálogo de produtos. Multi-tenant via organization_id.';
COMMENT ON COLUMN products.product_type IS 'Tipo: simple, kit, variation, configurable';
```

## Ordem de Execução

1. **Extensões** (pg_trgm, uuid-ossp)
2. **Tabelas base** (organizations)
3. **Tabelas auxiliares** (categories, suppliers)
4. **Tabelas principais** (products)
5. **Tabelas de relacionamento** (product_categories)
6. **Índices**
7. **Constraints e Foreign Keys**
8. **Triggers**
9. **Funções RPC**
10. **Row Level Security (RLS)**
11. **Seeds** (dados iniciais)

## Checklist de Validação

Antes de executar uma migration:

- [ ] Tem cabeçalho com data, autor e descrição
- [ ] Usa `IF NOT EXISTS` / `IF EXISTS` onde aplicável
- [ ] Foreign Keys têm `ON DELETE` definido
- [ ] Colunas numéricas têm `CHECK` constraints
- [ ] Colunas com valores padrão estão definidas
- [ ] Índices necessários estão criados
- [ ] Comentários em tabelas/colunas importantes
- [ ] Rollback documentado (comentado)
- [ ] Testada em ambiente de desenvolvimento

## Ambiente

| Ambiente | Quando Executar |
|----------|-----------------|
| Local | Desenvolvimento e testes |
| Staging | Antes de produção |
| **Production** | Após aprovação e backup |

## Rollback

Para cada migration, documentar o rollback:

```sql
-- ROLLBACK para migration 004_create_products_table.sql
-- ⚠️ CUIDADO: Isso deleta todos os dados da tabela!

-- Passo 1: Remover dependências
DROP TABLE IF EXISTS product_variations CASCADE;
DROP TABLE IF EXISTS product_kit_components CASCADE;

-- Passo 2: Remover tabela principal
DROP TABLE IF EXISTS products CASCADE;

-- Passo 3: Remover funções relacionadas
DROP FUNCTION IF EXISTS increment_product_view_count;
```

## Comandos Úteis

### Supabase CLI
```bash
# Push migrations para o projeto
npx supabase db push

# Ver diff entre local e remoto
npx supabase db diff

# Resetar banco local
npx supabase db reset
```

### SQL Direto
```sql
-- Ver tabelas existentes
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;

-- Ver colunas de uma tabela
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'products';

-- Ver constraints
SELECT conname, contype FROM pg_constraint 
WHERE conrelid = 'products'::regclass;
```
