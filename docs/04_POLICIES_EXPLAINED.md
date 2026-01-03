# 🔐 GUIA: Explicação das Policies (RLS)

**Sistema:** Gifts Store - Multi-tenant  
**Data:** 03/01/2025  
**Versão:** 1.0

---

## 🎯 VISÃO GERAL

Este guia explica **TODAS as 80+ policies** do sistema, quando cada uma é aplicada, e como testá-las.

**O que são Policies?**
- Regras SQL que controlam acesso a linhas (rows) específicas
- Executam ANTES de cada query (SELECT, INSERT, UPDATE, DELETE)
- Invisíveis para o usuário (automáticas)
- Base do sistema multi-tenant

---

## 📊 RESUMO DAS POLICIES

| Categoria | Quantidade | Tipo de Acesso |
|-----------|------------|----------------|
| User-Scoped | 18 | user_id = auth.uid() |
| Org-Scoped (Direto) | 32 | organization_id check |
| Org-Scoped (JOIN) | 24 | Herda org via parent |
| Admin-Only | 6 | Role check |
| Public | 4 | Acesso aberto (filtrado) |
| **TOTAL** | **84** | — |

---

## 🏢 CATEGORIA 1: ORGANIZATION TABLES

### **organizations** (3 policies)

#### **Policy 1: org_select_members**
```sql
CREATE POLICY "org_select_members"
ON public.organizations FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_organizations
    WHERE organization_id = organizations.id
      AND user_id = auth.uid()
  )
);
```

**Quando aplica:** User tenta ver lista de organizations  
**Permite:** Ver organizations das quais é membro  
**Bloqueia:** Ver organizations de outros  

**Teste:**
```sql
-- Deve retornar APENAS suas orgs
SELECT * FROM organizations;
```

---

#### **Policy 2: org_update_admins**
```sql
CREATE POLICY "org_update_admins"
ON public.organizations FOR UPDATE
TO authenticated
USING (public.is_org_owner_or_admin(id))
WITH CHECK (public.is_org_owner_or_admin(id));
```

**Quando aplica:** User tenta atualizar organization  
**Permite:** Owners/Admins da org  
**Bloqueia:** Members e usuários de outras orgs  

---

#### **Policy 3: org_delete_admins**
```sql
CREATE POLICY "org_delete_admins"
ON public.organizations FOR DELETE
TO authenticated
USING (public.is_org_owner_or_admin(id));
```

**Quando aplica:** User tenta deletar organization  
**Permite:** Apenas owners/admins  
**Bloqueia:** Members e outros  

---

### **user_organizations** (4 policies)

#### **Policy 1: uo_select_members**
```sql
CREATE POLICY "uo_select_members"
ON public.user_organizations FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_organizations uo
    WHERE uo.organization_id = user_organizations.organization_id
      AND uo.user_id = auth.uid()
  )
);
```

**Quando aplica:** Buscar membros de uma org  
**Permite:** Ver membros das suas orgs  
**Bloqueia:** Ver membros de outras orgs  

**Teste:**
```sql
-- Ver membros da sua org
SELECT * FROM user_organizations;
```

---

#### **Policy 2: uo_insert_admins**
```sql
CREATE POLICY "uo_insert_admins"
ON public.user_organizations FOR INSERT
TO authenticated
WITH CHECK (
  public.is_org_owner_or_admin(organization_id) AND
  CASE 
    WHEN role IN ('admin', 'owner') 
    THEN public.is_org_owner(organization_id)
    ELSE true
  END
);
```

**Quando aplica:** Adicionar novo membro  
**Permite:**  
- Admins/Owners adicionam members  
- Apenas Owners adicionam admins/owners  

**Bloqueia:** Members não podem adicionar ninguém  

**Teste:**
```sql
-- Como admin: adicionar member ✅
INSERT INTO user_organizations (organization_id, user_id, role)
VALUES ('org_id', 'user_id', 'member');

-- Como admin: adicionar admin ❌ (precisa ser owner)
INSERT INTO user_organizations (organization_id, user_id, role)
VALUES ('org_id', 'user_id', 'admin'); -- ERRO!
```

---

#### **Policy 3: uo_delete_admins**
```sql
CREATE POLICY "uo_delete_admins"
ON public.user_organizations FOR DELETE
TO authenticated
USING (
  public.is_org_owner_or_admin(organization_id) AND
  CASE 
    WHEN role IN ('admin', 'owner') 
    THEN public.is_org_owner(organization_id)
    ELSE true
  END
);
```

**Quando aplica:** Remover membro  
**Permite:**  
- Admins/Owners removem members  
- Apenas Owners removem admins/owners  

**Bloqueia:**  
- Members não removem ninguém  
- Remover último owner (trigger protege)  

---

## 📦 CATEGORIA 2: PRODUCTS & CATALOG

### **products** (4 policies)

#### **Policy 1: org_members_view_products**
```sql
CREATE POLICY "org_members_view_products"
ON public.products FOR SELECT
TO authenticated
USING (public.user_is_org_member(organization_id));
```

**Quando aplica:** Buscar produtos  
**Permite:** Ver produtos da sua org  
**Bloqueia:** Ver produtos de outras orgs  

---

#### **Policy 2: org_admins_manage_products**
```sql
CREATE POLICY "org_admins_manage_products"
ON public.products FOR ALL
TO authenticated
USING (public.is_org_owner_or_admin(organization_id))
WITH CHECK (public.is_org_owner_or_admin(organization_id));
```

**Quando aplica:** Criar/Editar/Deletar produtos  
**Permite:** Admins/Owners  
**Bloqueia:** Members  

**Teste:**
```sql
-- Como member: ver ✅
SELECT * FROM products;

-- Como member: criar ❌
INSERT INTO products (name, organization_id, base_price)
VALUES ('Teste', 'org_id', 10.00); -- ERRO!

-- Como admin: criar ✅
INSERT INTO products (name, organization_id, base_price, created_by)
VALUES ('Teste', 'org_id', 10.00, auth.uid()); -- OK!
```

---

### **categories** (4 policies)

**Mesma lógica de products:**
- SELECT: members+ podem ver
- INSERT/UPDATE/DELETE: admins+ podem gerenciar

---

### **suppliers** (2 policies)

```sql
-- Ver: members+
CREATE POLICY "org_members_view_suppliers"
ON public.suppliers FOR SELECT
USING (public.user_is_org_member(organization_id));

-- Gerenciar: admins+
CREATE POLICY "org_admins_manage_suppliers"
ON public.suppliers FOR ALL
USING (public.is_org_owner_or_admin(organization_id))
WITH CHECK (public.is_org_owner_or_admin(organization_id));
```

---

### **product_variants** (2 policies)

#### **Policy 1: org_members_view_variants**
```sql
CREATE POLICY "org_members_view_variants"
ON public.product_variants FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.products
    WHERE id = product_variants.product_id
      AND public.user_is_org_member(organization_id)
  )
);
```

**Quando aplica:** Buscar variações de produto  
**Como funciona:** Herda org do produto via JOIN  
**Permite:** Ver variações de produtos da sua org  

---

## 💰 CATEGORIA 3: QUOTES (ORÇAMENTOS)

### **quotes** (4 policies)

#### **Policy 1: org_members_view_quotes**
```sql
CREATE POLICY "org_members_view_quotes"
ON public.quotes FOR SELECT
USING (public.user_is_org_member(organization_id));
```

**Quando aplica:** Buscar orçamentos  
**Permite:** Todos membros veem orçamentos da org  

---

#### **Policy 2: org_members_create_quotes**
```sql
CREATE POLICY "org_members_create_quotes"
ON public.quotes FOR INSERT
WITH CHECK (public.user_is_org_member(organization_id));
```

**Quando aplica:** Criar novo orçamento  
**Permite:** Qualquer membro pode criar  

---

#### **Policy 3: org_members_update_own_quotes**
```sql
CREATE POLICY "org_members_update_own_quotes"
ON public.quotes FOR UPDATE
USING (
  public.user_is_org_member(organization_id) 
  AND (created_by = auth.uid() OR public.is_org_admin(organization_id))
);
```

**Quando aplica:** Editar orçamento  
**Permite:**  
- Criador do orçamento pode editar  
- Admins/Owners podem editar qualquer orçamento  

**Bloqueia:** Member editar orçamento de outro member  

---

#### **Policy 4: org_admins_delete_quotes**
```sql
CREATE POLICY "org_admins_delete_quotes"
ON public.quotes FOR DELETE
USING (public.is_org_owner_or_admin(organization_id));
```

**Quando aplica:** Deletar orçamento  
**Permite:** Apenas admins/owners  

---

### **quote_items** (2 policies)

**Herda org do quote via JOIN:**

```sql
CREATE POLICY "org_members_view_quote_items"
ON public.quote_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.quotes
    WHERE id = quote_items.quote_id
      AND public.user_is_org_member(organization_id)
  )
);
```

---

## 🛒 CATEGORIA 4: ORDERS & PAYMENTS

### **orders** (4 policies)

**Mesma lógica de quotes:**
- SELECT: todos membros
- INSERT: todos membros
- UPDATE: criador ou admins
- DELETE: apenas admins/owners

---

### **payments** (3 policies)

#### **Policy 1: org_members_view_payments**
```sql
CREATE POLICY "org_members_view_payments"
ON public.payments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE id = payments.order_id
      AND public.user_is_org_member(organization_id)
  )
);
```

**Como funciona:** Herda org de orders  
**Permite:** Ver pagamentos de pedidos da sua org  

---

#### **Policy 2: org_admins_manage_payments**
```sql
CREATE POLICY "org_admins_manage_payments"
ON public.payments FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE id = payments.order_id
      AND public.is_org_admin(organization_id)
  )
)
WITH CHECK (...);
```

**Quando aplica:** Criar/Editar pagamentos  
**Permite:** Apenas admins/owners  
**Bloqueia:** Members não gerenciam pagamentos  

---

## 👤 CATEGORIA 5: USER-SCOPED TABLES

### **user_favorites** (3 policies)

```sql
-- Ver próprios favoritos
CREATE POLICY "users_view_own_favorites"
ON public.user_favorites FOR SELECT
USING (user_id = auth.uid());

-- Criar favorito
CREATE POLICY "users_create_own_favorites"
ON public.user_favorites FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Deletar favorito
CREATE POLICY "users_delete_own_favorites"
ON public.user_favorites FOR DELETE
USING (user_id = auth.uid());
```

**Regra:** User controla 100% seus próprios dados  
**Aplica para:**
- user_favorites
- user_filter_presets
- saved_filters
- push_subscriptions
- notification_preferences
- product_comparisons

---

## 🎨 CATEGORIA 6: MOCKUPS

### **mockup_generation_jobs** (2 policies)

```sql
-- Ver jobs da org
CREATE POLICY "org_members_view_mockup_jobs"
ON public.mockup_generation_jobs FOR SELECT
USING (public.user_is_org_member(organization_id));

-- Criar job
CREATE POLICY "org_members_create_mockup_jobs"
ON public.mockup_generation_jobs FOR INSERT
WITH CHECK (public.user_is_org_member(organization_id));
```

---

### **mockup_approval_links** (2 policies)

#### **Policy 1: public_view_approval_links**
```sql
CREATE POLICY "public_view_approval_links"
ON public.mockup_approval_links FOR SELECT
TO anon, authenticated
USING (is_active = true AND expires_at > NOW());
```

**IMPORTANTE:** Links são **públicos** (para clientes aprovarem)  
**Filtro:** Apenas links ativos e não expirados  

---

## 📊 CATEGORIA 7: ANALYTICS & AUDIT

### **analytics_events** (2 policies)

```sql
-- Todos podem ver analytics
CREATE POLICY "authenticated_view_analytics"
ON public.analytics_events FOR SELECT
TO authenticated
USING (true);

-- Sistema cria eventos
CREATE POLICY "system_create_analytics"
ON public.analytics_events FOR INSERT
TO authenticated
WITH CHECK (true);
```

**Tipo:** **Aberto** (todos autenticados veem tudo)  
**Motivo:** Analytics agregado, sem dados sensíveis  

---

### **audit_log** (2 policies)

```sql
-- Todos podem ver logs (transparência)
CREATE POLICY "authenticated_view_audit_log"
ON public.audit_log FOR SELECT
TO authenticated
USING (true);

-- Sistema cria logs
CREATE POLICY "system_create_audit_log"
ON public.audit_log FOR INSERT
TO authenticated
WITH CHECK (true);
```

**Tipo:** **Aberto** para leitura  
**Motivo:** Transparência total  

---

## 🧪 COMO TESTAR POLICIES

### **Teste 1: Isolamento de Organizations**

```sql
-- 1. Criar duas orgs diferentes
INSERT INTO organizations (name) VALUES ('Org A'), ('Org B')
RETURNING id;

-- 2. Adicionar você como owner da Org A
INSERT INTO user_organizations (organization_id, user_id, role)
VALUES ('org_a_id', auth.uid(), 'owner');

-- 3. Criar produto na Org B
-- (usando service_role para bypass RLS temporário)

-- 4. Agora como user normal, buscar produtos:
SELECT * FROM products;
-- Deve retornar APENAS produtos da Org A!
```

---

### **Teste 2: Permissões por Role**

```sql
-- Como member
INSERT INTO products (name, organization_id, base_price, created_by)
VALUES ('Teste', 'org_id', 10.00, auth.uid());
-- ❌ ERRO: new row violates row-level security policy

-- Promover para admin
UPDATE user_organizations 
SET role = 'admin' 
WHERE user_id = auth.uid();

-- Tentar novamente
INSERT INTO products (name, organization_id, base_price, created_by)
VALUES ('Teste', 'org_id', 10.00, auth.uid());
-- ✅ SUCESSO!
```

---

### **Teste 3: Último Owner Protection**

```sql
-- Tentar deletar último owner
DELETE FROM user_organizations
WHERE organization_id = 'org_id'
  AND role = 'owner';
-- ❌ ERRO: cannot remove last owner
```

---

## 🔧 FUNÇÕES HELPER

### **user_is_org_member(org_id)**
```sql
CREATE OR REPLACE FUNCTION public.user_is_org_member(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_organizations
    WHERE organization_id = org_id
      AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
```

**Uso:** Verificar se user pertence à org  
**Retorna:** `true` ou `false`  

---

### **is_org_admin(org_id)**
```sql
CREATE OR REPLACE FUNCTION public.is_org_admin(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_organizations
    WHERE organization_id = org_id
      AND user_id = auth.uid()
      AND role IN ('admin', 'owner')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
```

**Uso:** Verificar se user é admin ou owner  
**Retorna:** `true` ou `false`  

---

### **is_org_owner(org_id)**
```sql
CREATE OR REPLACE FUNCTION public.is_org_owner(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_organizations
    WHERE organization_id = org_id
      AND user_id = auth.uid()
      AND role = 'owner'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
```

**Uso:** Verificar se user é owner  
**Retorna:** `true` ou `false`  

---

## ❓ TROUBLESHOOTING

### **Erro: "new row violates row-level security policy"**

**Causas comuns:**
1. ❌ Não é membro da organization_id especificada
2. ❌ Não tem role suficiente (member tentando criar produto)
3. ❌ organization_id está NULL ou errado

**Solução:**
```sql
-- Verificar suas orgs
SELECT * FROM user_organizations WHERE user_id = auth.uid();

-- Verificar seu role
SELECT organization_id, role 
FROM user_organizations 
WHERE user_id = auth.uid();
```

---

### **Erro: "permission denied for table X"**

**Causa:** Falta GRANT  

**Solução:**
```sql
GRANT SELECT ON public.products TO authenticated;
```

---

## 📚 PRÓXIMOS PASSOS

1. ✅ Entender as policies
2. ✅ Testar cada tipo
3. ✅ Implementar no frontend
4. ✅ Monitorar RLS overhead
5. ✅ Otimizar queries

---

**Autor:** Sistema Gifts Store  
**Versão:** 1.0  
**Data:** 03/01/2025
