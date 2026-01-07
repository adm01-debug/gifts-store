-- ============================================================
-- Migration: 003_create_suppliers
-- Data: 2026-01-07
-- Descrição: Cria tabela de fornecedores
-- Depende de: 001_create_organizations
-- ============================================================

CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code VARCHAR(20) UNIQUE,
  trading_name TEXT,
  
  -- Documentos
  cnpj VARCHAR(18),
  
  -- Contato
  contact_name TEXT,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  
  -- Endereço
  address TEXT,
  
  -- Comercial
  payment_terms TEXT,
  shipping_terms TEXT,
  delivery_time_days INTEGER,
  min_order_value NUMERIC(10,2),
  
  -- Integração API
  api_type VARCHAR(20),
  api_base_url TEXT,
  api_credentials JSONB,
  
  -- Observações
  notes TEXT,
  
  -- Status
  active BOOLEAN DEFAULT true,
  
  -- Multi-tenant
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  
  -- Logo
  logo_url TEXT,
  
  -- Auditoria
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Comentários
COMMENT ON TABLE public.suppliers IS 'Fornecedores de produtos';
COMMENT ON COLUMN public.suppliers.api_credentials IS 'Credenciais de API criptografadas (JSONB)';

-- Índices
CREATE INDEX IF NOT EXISTS idx_suppliers_org ON public.suppliers(organization_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_active ON public.suppliers(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_suppliers_code ON public.suppliers(code) WHERE code IS NOT NULL;

-- Trigger updated_at
DROP TRIGGER IF EXISTS update_suppliers_updated_at ON public.suppliers;
CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON public.suppliers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "suppliers_select_all" ON public.suppliers
  FOR SELECT USING (active = true);

CREATE POLICY "suppliers_insert_org" ON public.suppliers
  FOR INSERT WITH CHECK (
    organization_id IS NULL OR
    EXISTS (SELECT 1 FROM public.user_organizations WHERE user_id = auth.uid() AND organization_id = suppliers.organization_id)
  );

CREATE POLICY "suppliers_update_org" ON public.suppliers
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_organizations WHERE user_id = auth.uid() AND organization_id = suppliers.organization_id AND role IN ('owner', 'admin'))
  );

-- ============================================================
-- ROLLBACK (comentado)
-- ============================================================
-- DROP TABLE IF EXISTS public.suppliers CASCADE;
