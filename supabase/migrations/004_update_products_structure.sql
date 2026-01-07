-- ============================================================
-- Migration: 004_update_products_structure
-- Data: 2026-01-07
-- Descrição: Atualiza tabela products para estrutura completa (76 colunas)
-- Depende de: 001, 002, 003
-- NOTA: A tabela products já existe no Supabase Cloud (mas vazia)
-- ============================================================

-- Extensão para busca fuzzy
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================
-- Adicionar colunas faltantes (seguro - IF NOT EXISTS)
-- ============================================================

-- Preços
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS cost_price NUMERIC(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sale_price NUMERIC(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS base_price NUMERIC(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS suggested_price NUMERIC(10,2);

-- Categorização
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category_id UUID;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS main_category_id UUID;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS supplier_id UUID;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS brand VARCHAR(100);

-- Estoque
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS min_stock INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS minimum_stock INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_unit TEXT DEFAULT 'un';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS min_quantity INTEGER DEFAULT 1;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_stockout BOOLEAN DEFAULT false;

-- Mídia
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS primary_image_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS videos JSONB DEFAULT '[]'::jsonb;

-- Dimensões
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS weight NUMERIC(10,3);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS dimensions JSONB;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS box_length_mm INTEGER;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS box_width_mm INTEGER;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS box_height_mm INTEGER;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS box_weight_kg NUMERIC(10,3);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS product_weight_g INTEGER;

-- Personalização
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS allows_personalization BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS personalization_options JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS personalization_areas JSONB DEFAULT '[]'::jsonb;

-- Variações
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS colors JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sizes JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS materials JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS has_colors BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS has_sizes BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS has_capacity BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS combined_sizes VARCHAR(200);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS gender VARCHAR(20);

-- Tags e SEO
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS meta_keywords TEXT[];

-- Flags de destaque
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_on_sale BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_bestseller BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_kit BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_textil BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_online_exclusive BOOLEAN DEFAULT false;

-- Métricas
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS favorite_count INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS order_count INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS catalog_page INTEGER;

-- Códigos fiscais
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS ean VARCHAR(14);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS gtin VARCHAR(14);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS ncm_code VARCHAR(10);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS origin_country VARCHAR(2) DEFAULT 'BR';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS warranty_months INTEGER;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS manufacturer_sku VARCHAR(100);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS supplier_reference VARCHAR(50);

-- SKU e descrição
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku_promo VARCHAR(50);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS short_description VARCHAR(500);

-- Multi-tenant e Status
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS organization_id UUID;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'simple';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Auditoria
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_by UUID;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS last_cost_update_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS last_stock_update_at TIMESTAMP WITH TIME ZONE;

-- ============================================================
-- Foreign Keys (verificar antes de adicionar)
-- ============================================================

DO $$ 
BEGIN
  -- FK category_id
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_category_id_fkey') THEN
    ALTER TABLE public.products 
    ADD CONSTRAINT products_category_id_fkey 
    FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;
  END IF;

  -- FK main_category_id
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_main_category_id_fkey') THEN
    ALTER TABLE public.products 
    ADD CONSTRAINT products_main_category_id_fkey 
    FOREIGN KEY (main_category_id) REFERENCES public.categories(id) ON DELETE SET NULL;
  END IF;

  -- FK supplier_id
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_supplier_id_fkey') THEN
    ALTER TABLE public.products 
    ADD CONSTRAINT products_supplier_id_fkey 
    FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE SET NULL;
  END IF;

  -- FK organization_id
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_organization_id_fkey') THEN
    ALTER TABLE public.products 
    ADD CONSTRAINT products_organization_id_fkey 
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Comentários
COMMENT ON TABLE public.products IS 'Catálogo de produtos. Suporta kits, variações e personalização. Multi-tenant via organization_id.';
COMMENT ON COLUMN public.products.product_type IS 'Tipo: simple (único), kit (conjunto), variation (variação), configurable (com opções)';
COMMENT ON COLUMN public.products.colors IS 'Array JSONB de cores: [{name, hex, group}]';
COMMENT ON COLUMN public.products.materials IS 'Array JSONB de materiais: ["PLÁSTICO", "METAL"]';
COMMENT ON COLUMN public.products.tags IS 'JSONB com tags: {publicoAlvo:[], datasComemorativas:[], endomarketing:[]}';

-- Trigger updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- ROLLBACK (comentado)
-- ============================================================
-- Não há rollback seguro para ALTER TABLE ADD COLUMN
-- Para reverter, seria necessário remover cada coluna individualmente
