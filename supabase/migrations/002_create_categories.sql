-- ============================================================
-- Migration: 002_create_categories
-- Data: 2026-01-07
-- Descrição: Cria tabela de categorias hierárquicas
-- Depende de: 001_create_organizations
-- ============================================================

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT,
  icon TEXT,
  description TEXT,
  image_url TEXT,
  color_hex VARCHAR(7),
  
  -- Hierarquia
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  level INTEGER DEFAULT 1 CHECK (level >= 1 AND level <= 5),
  path TEXT,
  display_order INTEGER DEFAULT 0,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  
  -- Contadores
  products_count INTEGER DEFAULT 0 CHECK (products_count >= 0),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_visible BOOLEAN DEFAULT true,
  
  -- Multi-tenant
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  
  -- Auditoria
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  -- Constraint: slug único por organização
  CONSTRAINT categories_org_slug_unique UNIQUE (organization_id, slug),
  -- Constraint: não pode ser pai de si mesmo
  CONSTRAINT categories_no_self_parent CHECK (id != parent_id)
);

-- Comentários
COMMENT ON TABLE public.categories IS 'Categorias hierárquicas de produtos (até 5 níveis)';
COMMENT ON COLUMN public.categories.level IS 'Nível na hierarquia: 1=raiz, 2=filho, etc.';
COMMENT ON COLUMN public.categories.path IS 'Caminho completo: /uuid1/uuid2/uuid3';

-- Índices
CREATE INDEX IF NOT EXISTS idx_categories_parent ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_org ON public.categories(organization_id);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(is_active, is_visible) 
  WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_categories_display ON public.categories(organization_id, parent_id, display_order);

-- Trigger updated_at
DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_select_all" ON public.categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "categories_insert_org" ON public.categories
  FOR INSERT WITH CHECK (
    organization_id IS NULL OR
    EXISTS (SELECT 1 FROM public.user_organizations WHERE user_id = auth.uid() AND organization_id = categories.organization_id)
  );

CREATE POLICY "categories_update_org" ON public.categories
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_organizations WHERE user_id = auth.uid() AND organization_id = categories.organization_id AND role IN ('owner', 'admin'))
  );

-- ============================================================
-- ROLLBACK (comentado)
-- ============================================================
-- DROP TABLE IF EXISTS public.categories CASCADE;
