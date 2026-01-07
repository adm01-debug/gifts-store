-- ============================================================
-- Migration: 001_create_organizations
-- Data: 2026-01-07
-- Descrição: Cria tabela de organizações (multi-tenant)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  logo_url TEXT,
  settings JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Comentário
COMMENT ON TABLE public.organizations IS 'Organizações/empresas do sistema (multi-tenant)';

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_organizations_updated_at ON public.organizations;
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "organizations_select_all" ON public.organizations
  FOR SELECT USING (true);

-- ============================================================
-- Tabela de relacionamento usuário-organização
-- ============================================================

CREATE TABLE IF NOT EXISTS public.user_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, organization_id)
);

COMMENT ON TABLE public.user_organizations IS 'Relacionamento N:N entre usuários e organizações';

CREATE INDEX IF NOT EXISTS idx_user_organizations_user ON public.user_organizations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_organizations_org ON public.user_organizations(organization_id);

-- RLS
ALTER TABLE public.user_organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_organizations_select_own" ON public.user_organizations
  FOR SELECT USING (user_id = auth.uid());

-- ============================================================
-- ROLLBACK (comentado)
-- ============================================================
-- DROP TABLE IF EXISTS public.user_organizations CASCADE;
-- DROP TABLE IF EXISTS public.organizations CASCADE;
