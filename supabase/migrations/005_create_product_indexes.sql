-- ============================================================
-- Migration: 005_create_product_indexes
-- Data: 2026-01-07
-- Descrição: Cria índices de performance para tabela products
-- Depende de: 004_update_products_structure
-- ============================================================

-- Extensão para busca fuzzy (se não existir)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================
-- Índices para busca
-- ============================================================

-- Busca fuzzy por nome (trigram)
CREATE INDEX IF NOT EXISTS idx_products_name_trgm 
  ON public.products USING gin (name gin_trgm_ops);

-- Busca por SKU
CREATE INDEX IF NOT EXISTS idx_products_sku 
  ON public.products(sku) WHERE sku IS NOT NULL;

-- ============================================================
-- Índices para Foreign Keys
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_products_category 
  ON public.products(category_id);

CREATE INDEX IF NOT EXISTS idx_products_main_category 
  ON public.products(main_category_id);

CREATE INDEX IF NOT EXISTS idx_products_supplier 
  ON public.products(supplier_id);

CREATE INDEX IF NOT EXISTS idx_products_organization 
  ON public.products(organization_id);

-- ============================================================
-- Índices para filtros comuns
-- ============================================================

-- Produtos ativos (filtro mais comum)
CREATE INDEX IF NOT EXISTS idx_products_active 
  ON public.products(is_active) WHERE is_active = true AND is_deleted = false;

-- Produtos por organização + status
CREATE INDEX IF NOT EXISTS idx_products_org_active 
  ON public.products(organization_id, is_active, is_deleted) 
  WHERE is_active = true AND is_deleted = false;

-- Produtos em destaque
CREATE INDEX IF NOT EXISTS idx_products_featured 
  ON public.products(is_featured) WHERE is_featured = true;

-- Novidades
CREATE INDEX IF NOT EXISTS idx_products_new 
  ON public.products(is_new, created_at) WHERE is_new = true;

-- Promoções
CREATE INDEX IF NOT EXISTS idx_products_on_sale 
  ON public.products(is_on_sale) WHERE is_on_sale = true;

-- Kits
CREATE INDEX IF NOT EXISTS idx_products_kit 
  ON public.products(is_kit) WHERE is_kit = true;

-- ============================================================
-- Índices para ordenação
-- ============================================================

-- Ordenação por nome
CREATE INDEX IF NOT EXISTS idx_products_name 
  ON public.products(name);

-- Ordenação por preço
CREATE INDEX IF NOT EXISTS idx_products_price 
  ON public.products(sale_price);

-- Ordenação por data
CREATE INDEX IF NOT EXISTS idx_products_created 
  ON public.products(created_at DESC);

-- ============================================================
-- Índices para códigos fiscais
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_products_ean 
  ON public.products(ean) WHERE ean IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_products_gtin 
  ON public.products(gtin) WHERE gtin IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_products_brand 
  ON public.products(brand) WHERE brand IS NOT NULL;

-- ============================================================
-- ROLLBACK (comentado)
-- ============================================================
-- DROP INDEX IF EXISTS idx_products_name_trgm;
-- DROP INDEX IF EXISTS idx_products_sku;
-- DROP INDEX IF EXISTS idx_products_category;
-- ... etc
