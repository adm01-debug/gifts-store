-- ============================================================
-- Migration: 007_seed_data
-- Data: 2026-01-07
-- Descrição: Dados iniciais para teste (categorias, fornecedores, produtos)
-- Depende de: 001-006
-- NOTA: Execute apenas em ambiente de desenvolvimento/teste
-- ============================================================

-- ============================================================
-- 1. Categorias de teste
-- ============================================================

INSERT INTO public.categories (id, name, slug, icon, level, display_order) VALUES
  ('00000000-0000-0000-0000-000000000001', 'ESPORTES | AVENTURA | LAZER', 'esportes', '⚽', 1, 1),
  ('00000000-0000-0000-0000-000000000002', 'BAR | COZINHA', 'bar-cozinha', '🍷', 1, 2),
  ('00000000-0000-0000-0000-000000000003', 'TECNOLOGIA | ELETRÔNICOS', 'tecnologia', '📱', 1, 3),
  ('00000000-0000-0000-0000-000000000004', 'ROUPAS | CALÇADOS | ACESSÓRIOS', 'roupas', '👕', 1, 4),
  ('00000000-0000-0000-0000-000000000005', 'ECOLOGIA', 'ecologia', '🌿', 1, 5),
  ('00000000-0000-0000-0000-000000000006', 'PAPELARIA | ESCRITÓRIO', 'papelaria', '✏️', 1, 6)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  icon = EXCLUDED.icon;

-- ============================================================
-- 2. Fornecedores de teste
-- ============================================================

INSERT INTO public.suppliers (id, name, code, active) VALUES
  ('00000000-0000-0000-0001-000000000001', 'XBZ Brindes', 'XBZ', true),
  ('00000000-0000-0000-0001-000000000002', 'Stricker Brasil', 'STRICKER', true),
  ('00000000-0000-0000-0001-000000000003', 'Asia Import', 'ASIA', true),
  ('00000000-0000-0000-0001-000000000004', 'Só Marcas', 'SOMARCAS', true)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  active = EXCLUDED.active;

-- ============================================================
-- 3. Produtos de teste (6 produtos)
-- ============================================================

-- Produto 1: Squeeze Plástico
INSERT INTO public.products (
  id, name, description, sku,
  category_id, supplier_id,
  sale_price, cost_price, stock_quantity, min_quantity,
  primary_image_url, images, materials, colors, tags,
  is_featured, is_active, product_type
) VALUES (
  '10000000-0000-0000-0000-000000000001',
  'Squeeze Plástico 700ml',
  'Squeeze de plástico resistente com tampa rosqueável e bico dosador. Capacidade 700ml.',
  'SQ-700-PLAS',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0001-000000000001',
  12.90, 6.50, 5420, 100,
  'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
  '["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400"]'::jsonb,
  '["PLÁSTICO"]'::jsonb,
  '[{"name":"Vermelho","hex":"#EF4444"},{"name":"Azul","hex":"#3B82F6"}]'::jsonb,
  '{"publicoAlvo":["UNISSEX"],"endomarketing":["QUALIDADE DE VIDA"]}'::jsonb,
  true, true, 'simple'
)
ON CONFLICT (sku) DO UPDATE SET 
  name = EXCLUDED.name,
  sale_price = EXCLUDED.sale_price;

-- Produto 2: Caneca Metal
INSERT INTO public.products (
  id, name, description, sku,
  category_id, supplier_id,
  sale_price, cost_price, stock_quantity, min_quantity,
  primary_image_url, materials, colors,
  is_new, is_active, product_type
) VALUES (
  '10000000-0000-0000-0000-000000000002',
  'Caneca Metal 350ml',
  'Caneca de metal com acabamento brilhante. Capacidade 350ml.',
  'CAN-MET-350',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0001-000000000002',
  28.50, 14.25, 1850, 50,
  'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400',
  '["METAL", "AÇO INOX"]'::jsonb,
  '[{"name":"Branco","hex":"#FFFFFF"},{"name":"Preto","hex":"#1F2937"}]'::jsonb,
  true, true, 'simple'
)
ON CONFLICT (sku) DO UPDATE SET 
  name = EXCLUDED.name,
  sale_price = EXCLUDED.sale_price;

-- Produto 3: Kit Churrasco
INSERT INTO public.products (
  id, name, description, sku,
  category_id, supplier_id,
  sale_price, cost_price, stock_quantity, min_quantity,
  primary_image_url, materials,
  is_kit, is_featured, is_active, product_type
) VALUES (
  '10000000-0000-0000-0000-000000000003',
  'Kit Churrasco Premium 10 Peças',
  'Kit completo para churrasco com 10 peças em aço inox.',
  'KIT-CHUR-10P',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0001-000000000001',
  189.90, 95.00, 340, 20,
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
  '["AÇO INOX", "MADEIRA", "COURO"]'::jsonb,
  true, true, true, 'kit'
)
ON CONFLICT (sku) DO UPDATE SET 
  name = EXCLUDED.name,
  sale_price = EXCLUDED.sale_price;

-- Produto 4: Pen Drive
INSERT INTO public.products (
  id, name, description, sku,
  category_id, supplier_id,
  sale_price, cost_price, stock_quantity, min_quantity,
  primary_image_url, materials,
  is_active, product_type
) VALUES (
  '10000000-0000-0000-0000-000000000004',
  'Pen Drive 32GB Giratório',
  'Pen drive 32GB com sistema giratório em metal. USB 3.0.',
  'PEN-USB-32',
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0001-000000000003',
  35.00, 17.50, 2800, 50,
  'https://images.unsplash.com/photo-1597673030062-0a0f1a801a31?w=400',
  '["METAL", "PLÁSTICO"]'::jsonb,
  true, 'simple'
)
ON CONFLICT (sku) DO UPDATE SET 
  name = EXCLUDED.name,
  sale_price = EXCLUDED.sale_price;

-- Produto 5: Camiseta
INSERT INTO public.products (
  id, name, description, sku,
  category_id, supplier_id,
  sale_price, cost_price, stock_quantity, min_quantity,
  primary_image_url, materials, sizes,
  is_textil, has_sizes, is_on_sale, is_active, product_type
) VALUES (
  '10000000-0000-0000-0000-000000000005',
  'Camiseta Algodão Premium',
  'Camiseta 100% algodão penteado, 180g/m². Corte regular.',
  'CAM-ALG-PP',
  '00000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0001-000000000004',
  42.00, 21.00, 4500, 30,
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
  '["ALGODÃO"]'::jsonb,
  '[{"name":"P"},{"name":"M"},{"name":"G"},{"name":"GG"}]'::jsonb,
  true, true, true, true, 'simple'
)
ON CONFLICT (sku) DO UPDATE SET 
  name = EXCLUDED.name,
  sale_price = EXCLUDED.sale_price;

-- Produto 6: Caderno Ecológico
INSERT INTO public.products (
  id, name, description, sku,
  category_id, supplier_id,
  sale_price, cost_price, stock_quantity, min_quantity,
  primary_image_url, materials,
  is_new, is_active, product_type
) VALUES (
  '10000000-0000-0000-0000-000000000006',
  'Caderno Ecológico A5',
  'Caderno A5 com capa em papel reciclado e caneta de bambu. 80 folhas.',
  'CAD-ECO-A5',
  '00000000-0000-0000-0000-000000000005',
  '00000000-0000-0000-0001-000000000003',
  18.90, 9.45, 3200, 100,
  'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400',
  '["PAPEL", "BAMBU"]'::jsonb,
  true, true, 'simple'
)
ON CONFLICT (sku) DO UPDATE SET 
  name = EXCLUDED.name,
  sale_price = EXCLUDED.sale_price;

-- ============================================================
-- Verificação
-- ============================================================

DO $$
DECLARE
  v_categories INT;
  v_suppliers INT;
  v_products INT;
BEGIN
  SELECT COUNT(*) INTO v_categories FROM public.categories;
  SELECT COUNT(*) INTO v_suppliers FROM public.suppliers;
  SELECT COUNT(*) INTO v_products FROM public.products WHERE is_active = true;
  
  RAISE NOTICE '=== SEED CONCLUÍDO ===';
  RAISE NOTICE 'Categorias: %', v_categories;
  RAISE NOTICE 'Fornecedores: %', v_suppliers;
  RAISE NOTICE 'Produtos: %', v_products;
END $$;

-- ============================================================
-- ROLLBACK (comentado)
-- ============================================================
-- DELETE FROM public.products WHERE id LIKE '10000000%';
-- DELETE FROM public.suppliers WHERE id LIKE '00000000-0000-0000-0001%';
-- DELETE FROM public.categories WHERE id LIKE '00000000-0000-0000-0000%';
