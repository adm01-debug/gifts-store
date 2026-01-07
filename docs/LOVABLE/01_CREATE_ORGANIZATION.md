# 📖 GUIA: Como Criar sua Primeira Organization

**Sistema:** Gifts Store - Multi-tenant  
**Data:** 03/01/2025  
**Versão:** 1.0

---

## 🎯 VISÃO GERAL

Este guia mostra como criar sua primeira **Organization** no sistema Gifts Store e adicionar você como **owner**.

No sistema multi-tenant:
- **Organization** = Empresa/Tenant (ex: "Pink e Cerébro LTDA")
- **User** = Pessoa que trabalha na empresa
- **Role** = Papel do usuário na org (owner, admin, member)

---

## 📋 PRÉ-REQUISITOS

✅ Banco de dados configurado (38+ tabelas)  
✅ RLS aplicado (0 tabelas UNRESTRICTED)  
✅ Seed data inserido  
✅ Você já criou uma conta no sistema (via Supabase Auth)

---

## 🔑 PASSO 1: Descobrir seu User ID

Primeiro, você precisa saber seu `user_id` (UUID do Supabase Auth).

### **Opção A: Via SQL**

```sql
-- No SQL Editor do Supabase
SELECT 
  id as user_id,
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;
```

**Copie seu UUID!** Exemplo: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

### **Opção B: Via Dashboard**

1. Supabase Dashboard → Authentication → Users
2. Clique no seu usuário
3. Copie o UUID

---

## 🏢 PASSO 2: Criar a Organization

Execute no **SQL Editor**:

```sql
-- Criar a organization
INSERT INTO public.organizations (id, name, created_at)
VALUES (
  gen_random_uuid(),
  'Pink e Cerébro', -- ALTERE para o nome da sua empresa
  NOW()
)
RETURNING id, name;
```

**Resultado esperado:**
```
id: 12345678-abcd-ef12-3456-7890abcdef12
name: Pink e Cerébro
```

**✅ Copie o ID da organization!**

---

## 👑 PASSO 3: Adicionar Você como Owner

Substitua os valores e execute:

```sql
-- Adicionar você como owner da organization
INSERT INTO public.user_organizations (
  organization_id,
  user_id,
  role,
  created_at,
  updated_at
)
VALUES (
  '12345678-abcd-ef12-3456-7890abcdef12', -- ID da org (do passo 2)
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890', -- SEU user_id (do passo 1)
  'owner',
  NOW(),
  NOW()
)
RETURNING organization_id, user_id, role;
```

**Resultado esperado:**
```
organization_id: 12345678-abcd-ef12-3456-7890abcdef12
user_id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
role: owner
```

---

## ✅ PASSO 4: Validar

Verifique se você é owner:

```sql
-- Verificar sua membership
SELECT 
  o.id as org_id,
  o.name as org_name,
  uo.role,
  uo.created_at
FROM public.organizations o
JOIN public.user_organizations uo ON uo.organization_id = o.id
WHERE uo.user_id = 'SEU_USER_ID_AQUI'; -- Substitua!
```

**Resultado esperado:**
```
org_id: 12345678-abcd-ef12-3456-7890abcdef12
org_name: Pink e Cerébro
role: owner
created_at: 2025-01-03 15:30:00
```

---

## 🎨 PASSO 5: Criar Categorias para sua Org

Agora você pode criar categorias específicas da sua org:

```sql
-- Criar categoria
INSERT INTO public.categories (
  name,
  slug,
  description,
  organization_id, -- IMPORTANTE!
  is_active,
  display_order
)
VALUES (
  'Canecas Personalizadas',
  'canecas-personalizadas',
  'Canecas com logo da empresa',
  '12345678-abcd-ef12-3456-7890abcdef12', -- ID da sua org
  true,
  1
)
RETURNING id, name, organization_id;
```

---

## 📦 PASSO 6: Criar Produto de Teste

```sql
-- Criar produto
INSERT INTO public.products (
  name,
  description,
  organization_id, -- IMPORTANTE!
  category_id, -- ID da categoria criada no passo 5
  base_price,
  is_active,
  created_by
)
VALUES (
  'Caneca Branca 325ml',
  'Caneca cerâmica branca para sublimação',
  '12345678-abcd-ef12-3456-7890abcdef12', -- ID da sua org
  'ID_DA_CATEGORIA', -- Substitua
  15.00,
  true,
  'SEU_USER_ID' -- Substitua
)
RETURNING id, name, organization_id;
```

---

## 🧪 PASSO 7: Testar RLS

Teste se o RLS está funcionando:

```sql
-- Esta query DEVE retornar APENAS os produtos da sua org
SELECT 
  p.id,
  p.name,
  p.organization_id,
  o.name as org_name
FROM public.products p
JOIN public.organizations o ON o.id = p.organization_id;
```

**Se você ver apenas produtos da sua org = ✅ RLS funcionando!**

---

## 👥 PASSO 8: Adicionar Outros Usuários (Opcional)

### **Como Admin:**

```sql
-- Adicionar um usuário como admin
INSERT INTO public.user_organizations (
  organization_id,
  user_id,
  role
)
VALUES (
  'ID_DA_SUA_ORG',
  'UUID_DO_OUTRO_USUARIO', -- Obtenha de auth.users
  'admin'
);
```

### **Como Member:**

```sql
-- Adicionar um usuário como member
INSERT INTO public.user_organizations (
  organization_id,
  user_id,
  role
)
VALUES (
  'ID_DA_SUA_ORG',
  'UUID_DO_OUTRO_USUARIO',
  'member'
);
```

---

## 🔒 REGRAS IMPORTANTES

### **Roles e Permissões:**

| Role | Permissões |
|------|------------|
| **owner** | • Tudo que admin pode<br>• Gerenciar outros owners/admins<br>• Deletar organization<br>• Ver audit logs |
| **admin** | • Criar/editar/deletar produtos<br>• Gerenciar members<br>• Ver relatórios<br>• Configurar integrações |
| **member** | • Ver produtos<br>• Criar orçamentos<br>• Ver clientes<br>• Criar mockups |

### **Proteção do Último Owner:**

❌ **Você NÃO PODE:**
- Remover o último owner de uma org
- Fazer downgrade do último owner para admin/member
- Deletar o último owner

✅ **Você PODE:**
- Adicionar múltiplos owners
- Transferir ownership (adicionar novo owner, depois remover antigo)

---

## 🛠️ SCRIPT COMPLETO (COPIAR E COLAR)

```sql
-- ============================================================
-- SCRIPT COMPLETO: Criar Organization e Adicionar Owner
-- ============================================================

-- PASSO 1: Descobrir seu user_id
SELECT id as user_id, email FROM auth.users WHERE email = 'SEU_EMAIL@AQUI.com';
-- Copie o UUID retornado!

-- PASSO 2: Criar organization
INSERT INTO public.organizations (name)
VALUES ('Pink e Cerébro')
RETURNING id, name;
-- Copie o ID da org!

-- PASSO 3: Adicionar você como owner
INSERT INTO public.user_organizations (organization_id, user_id, role)
VALUES (
  'ID_DA_ORG_AQUI', -- Do passo 2
  'SEU_USER_ID_AQUI', -- Do passo 1
  'owner'
)
RETURNING *;

-- PASSO 4: Validar
SELECT 
  o.name as organization,
  uo.role,
  u.email
FROM public.organizations o
JOIN public.user_organizations uo ON uo.organization_id = o.id
JOIN auth.users u ON u.id = uo.user_id
WHERE uo.user_id = 'SEU_USER_ID_AQUI';

-- ============================================================
-- Resultado esperado:
-- organization: Pink e Cerébro
-- role: owner
-- email: seu@email.com
-- ============================================================
```

---

## ❓ TROUBLESHOOTING

### **Erro: "new row violates row-level security policy"**

**Causa:** Você não é membro de nenhuma organization.

**Solução:** Execute o PASSO 3 novamente para se adicionar como owner.

---

### **Erro: "cannot remove last owner"**

**Causa:** Tentou remover/downgrade o último owner.

**Solução:** Adicione outro owner primeiro:
```sql
INSERT INTO public.user_organizations (organization_id, user_id, role)
VALUES ('ID_ORG', 'ID_NOVO_OWNER', 'owner');
```

---

### **Não vejo meus produtos/categorias**

**Causa:** `organization_id` não está definido ou está errado.

**Solução:** Verifique:
```sql
SELECT 
  id,
  name,
  organization_id,
  CASE 
    WHEN organization_id IS NULL THEN '❌ NULL'
    WHEN organization_id = 'ID_DA_SUA_ORG' THEN '✅ CORRETO'
    ELSE '⚠️ ORG DIFERENTE'
  END as status
FROM public.products;
```

---

## 🎯 PRÓXIMOS PASSOS

Agora que você tem uma Organization criada:

1. ✅ **Integrar com Frontend** → Veja `02_FRONTEND_INTEGRATION.md`
2. ✅ **Criar produtos** → Use `organization_id` em todos
3. ✅ **Adicionar membros do time**
4. ✅ **Configurar integrações** (Bitrix24, n8n)

---

## 📚 REFERÊNCIAS

- [Documentação da Arquitetura](03_SYSTEM_ARCHITECTURE.md)
- [Explicação das Policies](04_POLICIES_EXPLAINED.md)
- [Próximos Passos](05_NEXT_STEPS.md)

---

**Autor:** Sistema Gifts Store  
**Versão:** 1.0  
**Data:** 03/01/2025
