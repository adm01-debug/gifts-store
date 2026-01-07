-- ============================================================
-- Migration: 006_create_product_functions
-- Data: 2026-01-07
-- Descrição: Funções RPC para operações na tabela products
-- Depende de: 004_update_products_structure
-- ============================================================

-- ============================================================
-- Função: Incrementar visualizações
-- ============================================================

CREATE OR REPLACE FUNCTION public.increment_product_view_count(p_product_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.products
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = p_product_id AND is_deleted = false;
END;
$$;

COMMENT ON FUNCTION public.increment_product_view_count 
  IS 'Incrementa contador de visualizações do produto';

-- ============================================================
-- Função: Incrementar favoritos
-- ============================================================

CREATE OR REPLACE FUNCTION public.increment_product_favorite_count(p_product_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.products
  SET favorite_count = COALESCE(favorite_count, 0) + 1
  WHERE id = p_product_id AND is_deleted = false;
END;
$$;

COMMENT ON FUNCTION public.increment_product_favorite_count 
  IS 'Incrementa contador de favoritos do produto';

-- ============================================================
-- Função: Decrementar favoritos
-- ============================================================

CREATE OR REPLACE FUNCTION public.decrement_product_favorite_count(p_product_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.products
  SET favorite_count = GREATEST(COALESCE(favorite_count, 0) - 1, 0)
  WHERE id = p_product_id AND is_deleted = false;
END;
$$;

COMMENT ON FUNCTION public.decrement_product_favorite_count 
  IS 'Decrementa contador de favoritos do produto (mínimo 0)';

-- ============================================================
-- Função: Incrementar pedidos
-- ============================================================

CREATE OR REPLACE FUNCTION public.increment_product_order_count(
  p_product_id UUID, 
  p_quantity INTEGER DEFAULT 1
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.products
  SET order_count = COALESCE(order_count, 0) + p_quantity
  WHERE id = p_product_id AND is_deleted = false;
END;
$$;

COMMENT ON FUNCTION public.increment_product_order_count 
  IS 'Incrementa contador de pedidos do produto';

-- ============================================================
-- Função: Atualizar estoque
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_product_stock(
  p_product_id UUID,
  p_quantity INTEGER,
  p_operation TEXT DEFAULT 'set' -- 'set', 'add', 'subtract'
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_stock INTEGER;
BEGIN
  IF p_operation = 'set' THEN
    UPDATE public.products
    SET 
      stock_quantity = p_quantity,
      is_stockout = (p_quantity <= 0),
      last_stock_update_at = NOW()
    WHERE id = p_product_id
    RETURNING stock_quantity INTO v_new_stock;
    
  ELSIF p_operation = 'add' THEN
    UPDATE public.products
    SET 
      stock_quantity = COALESCE(stock_quantity, 0) + p_quantity,
      is_stockout = (COALESCE(stock_quantity, 0) + p_quantity <= 0),
      last_stock_update_at = NOW()
    WHERE id = p_product_id
    RETURNING stock_quantity INTO v_new_stock;
    
  ELSIF p_operation = 'subtract' THEN
    UPDATE public.products
    SET 
      stock_quantity = GREATEST(COALESCE(stock_quantity, 0) - p_quantity, 0),
      is_stockout = (GREATEST(COALESCE(stock_quantity, 0) - p_quantity, 0) <= 0),
      last_stock_update_at = NOW()
    WHERE id = p_product_id
    RETURNING stock_quantity INTO v_new_stock;
  END IF;
  
  RETURN v_new_stock;
END;
$$;

COMMENT ON FUNCTION public.update_product_stock 
  IS 'Atualiza estoque: set (definir), add (adicionar), subtract (subtrair)';

-- ============================================================
-- RLS para products
-- ============================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Dropar policies antigas
DROP POLICY IF EXISTS "products_select_policy" ON public.products;
DROP POLICY IF EXISTS "products_insert_policy" ON public.products;
DROP POLICY IF EXISTS "products_update_policy" ON public.products;
DROP POLICY IF EXISTS "products_delete_policy" ON public.products;

-- SELECT: Ver produtos ativos (públicos ou da organização)
CREATE POLICY "products_select_active" ON public.products
  FOR SELECT
  USING (
    is_deleted = false AND is_active = true AND (
      organization_id IS NULL
      OR EXISTS (
        SELECT 1 FROM public.user_organizations 
        WHERE user_id = auth.uid() 
        AND organization_id = products.organization_id
      )
    )
  );

-- INSERT: Apenas membros da organização
CREATE POLICY "products_insert_org" ON public.products
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_organizations 
      WHERE user_id = auth.uid() 
      AND organization_id = products.organization_id
      AND role IN ('owner', 'admin')
    )
  );

-- UPDATE: Apenas admins da organização
CREATE POLICY "products_update_org" ON public.products
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations 
      WHERE user_id = auth.uid() 
      AND organization_id = products.organization_id
      AND role IN ('owner', 'admin')
    )
  );

-- DELETE: Apenas owners da organização
CREATE POLICY "products_delete_org" ON public.products
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations 
      WHERE user_id = auth.uid() 
      AND organization_id = products.organization_id
      AND role = 'owner'
    )
  );

-- ============================================================
-- ROLLBACK (comentado)
-- ============================================================
-- DROP FUNCTION IF EXISTS public.increment_product_view_count;
-- DROP FUNCTION IF EXISTS public.increment_product_favorite_count;
-- DROP FUNCTION IF EXISTS public.decrement_product_favorite_count;
-- DROP FUNCTION IF EXISTS public.increment_product_order_count;
-- DROP FUNCTION IF EXISTS public.update_product_stock;
