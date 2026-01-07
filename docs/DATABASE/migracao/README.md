# Migrations do Banco de Dados

## Localização

As migrations ficam em:
- **Migrations:** `supabase/migrations/`
- **Seeds:** `supabase/seeds/`
- **Padrão:** Este diretório (`docs/DATABASE/migracao/PADRAO_ENTERPRISE.md`)

## Arquivos de Migration

| # | Arquivo | Descrição |
|---|---------|-----------|
| 1 | `001_create_organizations.sql` | Tabela de organizações (multi-tenant) |
| 2 | `002_create_categories.sql` | Categorias hierárquicas |
| 3 | `003_create_suppliers.sql` | Fornecedores |
| 4 | `004_update_products_structure.sql` | Estrutura products (76 colunas) |
| 5 | `005_create_product_indexes.sql` | Índices de performance |
| 6 | `006_create_product_functions.sql` | Funções RPC + RLS |

## Seeds

| # | Arquivo | Descrição |
|---|---------|-----------|
| 1 | `001_catalog_seed.sql` | Dados de teste (categorias, fornecedores, produtos) |

## Como Executar

1. Acesse o SQL Editor: https://supabase.com/dashboard/project/lgjogrvydtwxxsjarrxm/sql
2. Execute cada migration **na ordem** (001 → 006)
3. Execute o seed por último

Veja `PADRAO_ENTERPRISE.md` para convenções e boas práticas.
