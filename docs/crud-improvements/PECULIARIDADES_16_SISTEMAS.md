# 🔍 PECULIARIDADES DOS 16 SISTEMAS

## 1. FINANCE HUB 💰

**Tabelas principais:** `lancamentos_financeiros`, `categorias`, `contas_bancarias`

**Campos fulltext:**
```typescript
['descricao', 'fornecedor', 'categoria', 'observacoes']
```

**Schema import:**
```typescript
z.object({
  descricao: z.string().min(1),
  valor: z.coerce.number(),
  data: z.coerce.date(),
  categoria: z.enum(['receita', 'despesa', 'investimento']),
})
```

**Versionamento:** ✅ CRÍTICO (transações financeiras)

---

## 2. DP SYSTEM 👥

**Tabelas principais:** `colaboradores`, `folha_pagamento`, `beneficios`

**Campos fulltext:**
```typescript
['nome', 'cpf', 'cargo', 'departamento']
```

**Schema import:**
```typescript
z.object({
  nome: z.string().min(1),
  cpf: z.string().regex(/^\d{11}$/),
  cargo: z.string(),
  salario: z.coerce.number().positive(),
})
```

**Versionamento:** ✅ CRÍTICO (dados pessoais LGPD)

---

## 3. SISTEMA DE COMPRAS 🛒

**Tabelas principais:** `pedidos_compra`, `fornecedores`, `produtos`

**Campos fulltext:**
```typescript
['descricao_produto', 'fornecedor', 'codigo_produto']
```

**Schema import:**
```typescript
z.object({
  produto: z.string(),
  quantidade: z.coerce.number().int().positive(),
  preco_unitario: z.coerce.number().positive(),
  fornecedor: z.string(),
})
```

**Versionamento:** ✅ CRÍTICO (contratos)

---

## 4. ESTOKI WMS 📦

**Tabelas principais:** `estoque`, `movimentacoes`, `locais`

**Campos fulltext:**
```typescript
['produto', 'sku', 'localizacao', 'lote']
```

**Schema import:**
```typescript
z.object({
  sku: z.string().min(1),
  produto: z.string(),
  quantidade: z.coerce.number().int(),
  localizacao: z.string(),
})
```

**Versionamento:** 🟡 MÉDIA (rastreabilidade)

---

## 5. SALESPRO CRM 💼

**Tabelas principais:** `oportunidades`, `clientes`, `atividades`

**Campos fulltext:**
```typescript
['nome_cliente', 'empresa', 'email', 'telefone']
```

**Schema import:**
```typescript
z.object({
  nome: z.string().min(1),
  email: z.string().email(),
  telefone: z.string(),
  empresa: z.string().optional(),
})
```

**Filtros salvos:** ✅ JÁ TEM (manter compatibilidade)

---

## 6. HELLO CONTACT CENTER 📞

**Tabelas principais:** `atendimentos`, `tickets`, `clientes`

**Campos fulltext:**
```typescript
['assunto', 'descricao', 'cliente', 'protocolo']
```

**Schema import:**
```typescript
z.object({
  protocolo: z.string(),
  assunto: z.string(),
  cliente: z.string(),
  prioridade: z.enum(['baixa', 'media', 'alta', 'urgente']),
})
```

**Histórico:** ✅ CRÍTICO (auditoria de atendimentos)

---

## 7. MULTIPLIXE ⚡

**Tabelas principais:** `multiplas_entidades` (sistema genérico)

**Campos fulltext:**
```typescript
['nome', 'descricao', 'tags', 'categoria']
```

**Schema import:**
```typescript
z.object({
  nome: z.string(),
  tipo: z.string(),
  // Campos dinâmicos
})
```

**Busca fulltext:** 🟡 PARCIAL (melhorar)

---

## 8. TASKGIFTS 🎁

**Tabelas principais:** `tarefas`, `brindes`, `campanhas`

**Campos fulltext:**
```typescript
['titulo', 'descricao', 'brinde', 'campanha']
```

**Schema import:**
```typescript
z.object({
  titulo: z.string(),
  brinde: z.string(),
  quantidade: z.coerce.number().int(),
  data_entrega: z.coerce.date(),
})
```

---

## 9. FUXICO 💬

**Tabelas principais:** `conversas`, `mensagens`, `usuarios`

**Campos fulltext:**
```typescript
['texto', 'remetente', 'destinatario', 'tags']
```

**Schema import:**
```typescript
z.object({
  remetente: z.string(),
  destinatario: z.string(),
  mensagem: z.string(),
  data: z.coerce.date(),
})
```

**Histórico:** ✅ IMPORTANTE (rastreabilidade de comunicação)

---

## 10. LOGGI-FLOW 🚚

**Tabelas principais:** `entregas`, `rotas`, `motoristas`

**Campos fulltext:**
```typescript
['endereco', 'motorista', 'rastreio', 'cliente']
```

**Schema import:**
```typescript
z.object({
  rastreio: z.string(),
  endereco: z.string(),
  motorista: z.string(),
  status: z.enum(['pendente', 'em_rota', 'entregue']),
})
```

---

## 11. MATCH ATS 🎯

**Tabelas principais:** `candidatos`, `vagas`, `processos_seletivos`

**Campos fulltext:**
```typescript
['nome', 'email', 'vaga', 'habilidades']
```

**Schema import:**
```typescript
z.object({
  nome: z.string(),
  email: z.string().email(),
  telefone: z.string(),
  vaga: z.string(),
})
```

**Filtros salvos:** ✅ JÁ TEM (manter compatibilidade)

---

## 12. ZAPP (WhatsApp CRM) 📱

**Tabelas principais:** `contatos`, `conversas`, `campanhas`

**Campos fulltext:**
```typescript
['nome', 'telefone', 'mensagem', 'tags']
```

**Schema import:**
```typescript
z.object({
  nome: z.string(),
  telefone: z.string().regex(/^\d{10,11}$/),
  tags: z.string().optional(),
})
```

---

## 13. FAST GRAVA ES 🎬

**Tabelas principais:** `gravacoes`, `projetos`, `clientes`

**Campos fulltext:**
```typescript
['titulo_projeto', 'cliente', 'descricao']
```

**Schema import:**
```typescript
z.object({
  titulo: z.string(),
  cliente: z.string(),
  data_gravacao: z.coerce.date(),
  status: z.enum(['agendado', 'em_producao', 'finalizado']),
})
```

**Busca fulltext:** 🟡 PARCIAL (melhorar)

---

## 14. LALAMOVE GUARDIAN 🛡️

**Tabelas principais:** `entregas`, `motoristas`, `incidentes`

**Campos fulltext:**
```typescript
['motorista', 'endereco', 'placa', 'rastreio']
```

**Schema import:**
```typescript
z.object({
  motorista: z.string(),
  placa: z.string(),
  endereco: z.string(),
  data_entrega: z.coerce.date(),
})
```

---

## 15. GIFTS STORE 🎁

**Status:** ✅ COMPLETO (sistema piloto)

**Funcionalidades implementadas:**
- ✅ Busca fulltext
- ✅ Filtros salvos
- ✅ Import CSV/Excel
- ✅ Export CSV/Excel/PDF
- ✅ Bulk actions
- ✅ Duplicação
- ✅ Versionamento
- ✅ Histórico completo

---

## 16. BITRIX24 ACTION 🔗

**Tabelas principais:** `integracao_bitrix`, `sincronizacao`, `logs`

**Campos fulltext:**
```typescript
['entity_type', 'bitrix_id', 'descricao', 'status']
```

**Schema import:**
```typescript
z.object({
  bitrix_id: z.string(),
  entity_type: z.string(),
  data: z.record(z.any()),
})
```

---

## 🎯 PRIORIZAÇÃO DE VERSIONAMENTO

### 🔴 CRÍTICO (Implementar primeiro):
1. Finance Hub (transações)
2. DP System (LGPD)
3. Sistema Compras (contratos)

### 🟡 MÉDIA (Implementar depois):
4. ESTOKI WMS (rastreabilidade)
5. HELLO (auditoria)
6. FUXICO (compliance)

### ⚪ BAIXA (Opcional):
7-16. Demais sistemas

---

## 📋 ADAPTAÇÕES NECESSÁRIAS POR SISTEMA

### Sistemas que PRECISAM de adaptação SQL:
- Todos (nomes de tabelas específicos)

### Sistemas que JÁ TÊM funcionalidades:
- SalesPro (filtros salvos) → Migrar para novo padrão
- Match ATS (filtros salvos) → Migrar para novo padrão
- Gifts Store (completo) → Base para os demais

### Sistemas com integrações externas:
- Bitrix24 Action → Cuidado com sync
- ZAPP → Integração WhatsApp Business
- Loggi-Flow → API Loggi
- Lalamove Guardian → API Lalamove

---

## ✅ CHECKLIST DE PECULIARIDADES

Antes de integrar CADA sistema, verificar:

- [ ] Nomes das tabelas principais
- [ ] Campos para busca fulltext
- [ ] Schema Zod para import
- [ ] Funcionalidades já existentes
- [ ] Integrações externas
- [ ] Necessidade de versionamento
- [ ] Compliance (LGPD, auditoria)

