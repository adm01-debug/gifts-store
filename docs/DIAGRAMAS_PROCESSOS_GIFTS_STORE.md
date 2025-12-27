# 📋 GIFTS-STORE - DIAGRAMAS DE PROCESSOS E MATRIZ DE FUNCIONALIDADES

> **Complemento da Análise Exaustiva**  
> **Data:** 26/12/2025  
> **Repositório:** https://github.com/adm01-debug/gifts-store

---

## 📌 ÍNDICE

1. [Diagramas BPMN Textuais](#1-diagramas-bpmn-textuais)
2. [Matriz de Funcionalidades](#2-matriz-de-funcionalidades)
3. [Mapa de Dependências](#3-mapa-de-dependências)
4. [Análise de Complexidade](#4-análise-de-complexidade)
5. [Roadmap Visual](#5-roadmap-visual)

---

## 1. DIAGRAMAS BPMN TEXTUAIS

### 🔄 PROCESSO: Criação e Aprovação de Orçamento (Completo)

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CRIAÇÃO E APROVAÇÃO DE ORÇAMENTO                │
└─────────────────────────────────────────────────────────────────────┘

[INÍCIO] Vendedor decide criar orçamento
   │
   ├──> [TAREFA 1] Selecionar Cliente
   │       │
   │       ├─> Sistema: Buscar clientes do Bitrix24
   │       ├─> Vendedor: Filtrar/pesquisar cliente
   │       └─> Sistema: Cliente selecionado → session.clientId
   │
   ├──> [TAREFA 2] Adicionar Produtos ao Orçamento
   │       │
   │       ├─> Loop (até vendedor terminar):
   │       │     │
   │       │     ├─> Vendedor: Buscar produto
   │       │     ├─> Vendedor: Visualizar detalhes
   │       │     ├─> [GATEWAY] Produto precisa personalização?
   │       │     │     │
   │       │     │     ├─> SIM:
   │       │     │     │     ├─> [TAREFA 2.1] Configurar Personalização
   │       │     │     │     │     ├─> Vendedor: Escolher técnica
   │       │     │     │     │     ├─> Vendedor: Definir cores
   │       │     │     │     │     ├─> Vendedor: Definir posições
   │       │     │     │     │     ├─> Sistema: Calcular custos
   │       │     │     │     │     └─> Sistema: Salvar em quote_item_personalizations
   │       │     │     │     │
   │       │     │     └─> NÃO:
   │       │     │           └─> Pular personalização
   │       │     │
   │       │     ├─> [TAREFA 2.2] Definir Quantidade
   │       │     │     ├─> Vendedor: Inserir quantidade
   │       │     │     ├─> Sistema: Validar estoque
   │       │     │     └─> Sistema: Calcular subtotal
   │       │     │
   │       │     └─> Sistema: Adicionar item ao quote.items[]
   │       │
   │       └─> Fim do loop
   │
   ├──> [TAREFA 3] Revisar Orçamento
   │       │
   │       ├─> Sistema: Exibir resumo (QuoteSummary)
   │       ├─> Sistema: Calcular total bruto
   │       │
   │       └─> [GATEWAY] Aplicar desconto?
   │             │
   │             ├─> SIM:
   │             │     ├─> Vendedor: Inserir desconto (% ou R$)
   │             │     ├─> Sistema: Validar desconto max (30%)
   │             │     └─> Sistema: Calcular total líquido
   │             │
   │             └─> NÃO:
   │                   └─> Total = Total bruto
   │
   ├──> [TAREFA 4] Adicionar Observações
   │       │
   │       ├─> Vendedor: Notas públicas (cliente vê)
   │       └─> Vendedor: Notas internas (só time vê)
   │
   ├──> [GATEWAY DE DECISÃO] Salvar como?
   │       │
   │       ├─> RASCUNHO:
   │       │     ├─> Sistema: status = "draft"
   │       │     ├─> Sistema: Salvar no Supabase
   │       │     └─> [FIM - Rascunho] Vendedor pode continuar depois
   │       │
   │       └─> ENVIAR:
   │             │
   │             ├──> [TAREFA 5] Gerar Link de Aprovação
   │             │       │
   │             │       ├─> Sistema: status = "sent"
   │             │       ├─> Sistema: Chamar Edge Function quote-approval
   │             │       ├─> Edge Function: Gerar token único (UUID)
   │             │       ├─> Edge Function: Salvar em quote_approval_tokens
   │             │       │     - token (UUID)
   │             │       │     - quote_id
   │             │       │     - expires_at (7 dias)
   │             │       │     - is_used = false
   │             │       └─> Sistema: link = /aprovar-orcamento?token={token}
   │             │
   │             ├──> [TAREFA 6] Enviar Notificação ao Cliente
   │             │       │
   │             │       ├─> Sistema: Chamar Edge Function quote-sync
   │             │       ├─> Edge Function: Montar payload JSON
   │             │       │     - quoteData (número, cliente, itens, total)
   │             │       │     - approvalLink
   │             │       ├─> Edge Function: POST para webhook n8n
   │             │       ├─> n8n: Workflow "Enviar Orçamento"
   │             │       │     ├─> Criar deal no Bitrix24 (se não existe)
   │             │       │     ├─> Atualizar deal (stage = "Orçamento Enviado")
   │             │       │     ├─> Enviar email ao cliente
   │             │       │     │     - Assunto: "Orçamento #{number}"
   │             │       │     │     - Link de aprovação
   │             │       │     └─> Enviar WhatsApp (opcional)
   │             │       │           - Template pré-aprovado
   │             │       │           - Link curto
   │             │       └─> Sistema: Notificar vendedor (toast)
   │             │
   │             └──> [TAREFA 7] Aguardar Resposta do Cliente
   │                     │
   │                     ├─> [EVENTO] Cliente abre link
   │                     │     │
   │                     │     ├─> Sistema: Validar token
   │                     │     │     - Verificar expiração
   │                     │     │     - Verificar is_used
   │                     │     ├─> Sistema: Exibir orçamento (PublicQuoteApproval)
   │                     │     │     - Dados do cliente
   │                     │     │     - Itens + personalizações
   │                     │     │     - Total
   │                     │     │     - Botões: Aprovar / Rejeitar
   │                     │     │
   │                     │     └─> [GATEWAY] Cliente decide
   │                     │           │
   │                     │           ├─> APROVAR:
   │                     │           │     │
   │                     │           │     ├──> [TAREFA 7.1] Processar Aprovação
   │                     │           │     │       ├─> Cliente: (opcional) Inserir observações
   │                     │           │     │       ├─> Sistema: quote.status = "approved"
   │                     │           │     │       ├─> Sistema: quote.client_response = "approved"
   │                     │           │     │       ├─> Sistema: quote.client_response_at = now()
   │                     │           │     │       ├─> Sistema: token.is_used = true
   │                     │           │     │       │
   │                     │           │     │       ├──> [TAREFA 7.2] Criar Pedido
   │                     │           │     │       │       ├─> Sistema: INSERT em orders
   │                     │           │     │       │       │     - order_number = auto
   │                     │           │     │       │       │     - quote_id
   │                     │           │     │       │       │     - client_id
   │                     │           │     │       │       │     - status = "pending"
   │                     │           │     │       │       ├─> Sistema: Copiar items → order_items
   │                     │           │     │       │       └─> Sistema: order_id retornado
   │                     │           │     │       │
   │                     │           │     │       ├──> [TAREFA 7.3] Sincronizar Bitrix24
   │                     │           │     │       │       ├─> Sistema: Chamar quote-sync
   │                     │           │     │       │       ├─> Edge Function: POST n8n
   │                     │           │     │       │       ├─> n8n: Atualizar deal
   │                     │           │     │       │       │     - Stage = "Pedido Confirmado"
   │                     │           │     │       │       │     - Anexar orçamento aprovado
   │                     │           │     │       │       └─> n8n: Criar atividade no Bitrix
   │                     │           │     │       │             - Tipo: "Pedido"
   │                     │           │     │       │             - Descrição: Detalhes
   │                     │           │     │       │
   │                     │           │     │       ├──> [TAREFA 7.4] Notificar Vendedor
   │                     │           │     │       │       ├─> Sistema: INSERT notification
   │                     │           │     │       │       │     - seller_id
   │                     │           │     │       │       │     - type = "quote_approved"
   │                     │           │     │       │       │     - quote_id
   │                     │           │     │       │       ├─> Sistema: (realtime) Enviar notificação
   │                     │           │     │       │       └─> n8n: Email/WhatsApp ao vendedor
   │                     │           │     │       │
   │                     │           │     │       └──> [TAREFA 7.5] Registrar Gamificação
   │                     │           │     │             ├─> Sistema: +50 XP (venda convertida)
   │                     │           │     │             ├─> Sistema: +valor/100 coins
   │                     │           │     │             ├─> Sistema: Verificar conquistas
   │                     │           │     │             │     - "Primeira Venda"
   │                     │           │     │             │     - "10 Vendas no Mês"
   │                     │           │     │             └─> Sistema: Atualizar seller_gamification
   │                     │           │
   │                     │           └─> REJEITAR:
   │                     │                 │
   │                     │                 ├──> [TAREFA 7.6] Processar Rejeição
   │                     │                 │       ├─> Cliente: (opcional) Motivo da rejeição
   │                     │                 │       ├─> Sistema: quote.status = "rejected"
   │                     │                 │       ├─> Sistema: quote.client_response = "rejected"
   │                     │                 │       ├─> Sistema: quote.client_response_notes = motivo
   │                     │                 │       └─> Sistema: token.is_used = true
   │                     │                 │
   │                     │                 ├──> [TAREFA 7.7] Sincronizar Bitrix24
   │                     │                 │       ├─> Edge Function: POST n8n
   │                     │                 │       └─> n8n: Atualizar deal
   │                     │                 │             - Stage = "Orçamento Rejeitado"
   │                     │                 │             - Motivo anexado
   │                     │                 │
   │                     │                 ├──> [TAREFA 7.8] Notificar Vendedor
   │                     │                 │       ├─> Sistema: INSERT notification
   │                     │                 │       │     - type = "quote_rejected"
   │                     │                 │       └─> n8n: Enviar alerta
   │                     │                 │
   │                     │                 └──> [TAREFA 7.9] Sugerir Follow-up
   │                     │                       ├─> Sistema: INSERT follow_up_reminders
   │                     │                       │     - seller_id
   │                     │                       │     - client_id
   │                     │                       │     - due_date = +3 dias
   │                     │                       │     - message = "Cliente rejeitou orçamento. Ligar?"
   │                     │                       └─> Sistema: Agendar notificação
   │                     │
   │                     └─> [EVENTO] Token expira (7 dias)
   │                           │
   │                           ├─> Sistema: Cron job diário
   │                           ├─> Sistema: Marcar quotes expirados
   │                           │     - status = "expired"
   │                           └─> Sistema: Notificar vendedor
   │
   └──> [FIM] Orçamento processado

┌─────────────────────────────────────────────────────────────────────┐
│                           MÉTRICAS DO PROCESSO                       │
├─────────────────────────────────────────────────────────────────────┤
│ Tempo Médio Total:     5-7 dias (da criação até resposta)          │
│ Tempo Criação:         10-15 min (vendedor)                        │
│ Tempo Aprovação:       1-3 dias (cliente)                          │
│ Taxa de Aprovação:     60-70% (target)                             │
│ Taxa de Expiração:     10-15% (target < 10%)                       │
│ SLA Notificação:       < 1 minuto (realtime)                       │
│ SLA Sync Bitrix:       < 30 segundos                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 🔄 PROCESSO: Sincronização Bitrix24 (Detalhado)

```
┌─────────────────────────────────────────────────────────────────────┐
│                      SINCRONIZAÇÃO BITRIX24                         │
└─────────────────────────────────────────────────────────────────────┘

[INÍCIO] Trigger de Sincronização
   │
   ├──> [GATEWAY] Tipo de trigger?
   │       │
   │       ├─> MANUAL:
   │       │     └─> Vendedor clica "Sincronizar" (BitrixSyncPage)
   │       │
   │       ├─> AGENDADO:
   │       │     └─> Cron job (diário, 6h da manhã)
   │       │
   │       └─> WEBHOOK:
   │             └─> Bitrix24 notifica alteração em company/deal
   │
   ├──> [TAREFA 1] Iniciar Log de Sincronização
   │       │
   │       ├─> Sistema: INSERT bitrix_sync_logs
   │       │     - id = UUID
   │       │     - started_at = now()
   │       │     - status = "running"
   │       │     - synced_by = user_id (se manual)
   │       └─> Sistema: Exibir loading (frontend)
   │
   ├──> [TAREFA 2] Sincronizar Empresas (Companies)
   │       │
   │       ├──> [SUB-TAREFA 2.1] Buscar Empresas do Bitrix24
   │       │       │
   │       │       ├─> Sistema: Chamar Edge Function bitrix-sync
   │       │       │     - action: "get_companies"
   │       │       │     - filter: {} (todas) ou {ID: [x,y,z]} (específicas)
   │       │       │     - start: 0 (primeira página)
   │       │       │
   │       │       ├─> Edge Function: POST Bitrix24 API
   │       │       │     - endpoint: /crm.company.list
   │       │       │     - select: [ID, TITLE, LOGO, EMAIL, PHONE, ADDRESS,
   │       │       │                 UF_CRM_1590780873288, // Ramo
   │       │       │                 UF_CRM_1631795570468, // Nicho
   │       │       │                 UF_CRM_1755898066,    // Cor Primária
   │       │       │                 UF_CRM_1755898357]    // Cores Secundárias
   │       │       │     - start: 0
   │       │       │
   │       │       ├─> Bitrix24: Retorna JSON
   │       │       │     {
   │       │       │       "result": [
   │       │       │         {
   │       │       │           "ID": "123",
   │       │       │           "TITLE": "Empresa XYZ",
   │       │       │           "LOGO": "https://...",
   │       │       │           "EMAIL": [{"VALUE": "contato@xyz.com"}],
   │       │       │           "UF_CRM_1590780873288": "Tecnologia",
   │       │       │           ...
   │       │       │         }
   │       │       │       ],
   │       │       │       "total": 250,
   │       │       │       "next": 50
   │       │       │     }
   │       │       │
   │       │       └─> Edge Function: Retornar ao frontend
   │       │
   │       ├──> [SUB-TAREFA 2.2] Transformar Dados
   │       │       │
   │       │       └─> Edge Function: Para cada company:
   │       │             │
   │       │             ├─> Mapear campos:
   │       │             │     - ID → bitrix_id
   │       │             │     - TITLE → name
   │       │             │     - LOGO → logo_url
   │       │             │     - EMAIL[0].VALUE → email
   │       │             │     - PHONE[0].VALUE → phone
   │       │             │     - ADDRESS → address
   │       │             │     - UF_CRM_1590780873288 → ramo
   │       │             │     - UF_CRM_1631795570468 → nicho
   │       │             │     - UF_CRM_1755898066 → primary_color_hex
   │       │             │
   │       │             ├─> Parsear cores:
   │       │             │     - Formato: "#FF5733" ou "Vermelho (#FF5733)"
   │       │             │     - Extrair HEX + nome
   │       │             │
   │       │             └─> Retornar objeto:
   │       │                   {
   │       │                     bitrix_id: "123",
   │       │                     name: "Empresa XYZ",
   │       │                     email: "contato@xyz.com",
   │       │                     ...
   │       │                   }
   │       │
   │       ├──> [SUB-TAREFA 2.3] Upsert no Supabase
   │       │       │
   │       │       └─> Para cada empresa transformada:
   │       │             │
   │       │             ├─> Sistema: INSERT bitrix_clients
   │       │             │     ON CONFLICT (bitrix_id)
   │       │             │     DO UPDATE SET
   │       │             │       name = EXCLUDED.name,
   │       │             │       email = EXCLUDED.email,
   │       │             │       ...
   │       │             │       synced_at = now(),
   │       │             │       updated_at = now()
   │       │             │
   │       │             └─> Sistema: Incrementar counter
   │       │                   clients_synced++
   │       │
   │       └──> [GATEWAY] Há próxima página? (next > 0)
   │             │
   │             ├─> SIM:
   │             │     ├─> start = next
   │             │     └─> Repetir SUB-TAREFA 2.1
   │             │
   │             └─> NÃO:
   │                   └─> Prosseguir
   │
   ├──> [TAREFA 3] Sincronizar Negócios (Deals)
   │       │
   │       ├──> [SUB-TAREFA 3.1] Buscar Deals do Bitrix24
   │       │       │
   │       │       ├─> Sistema: Chamar Edge Function
   │       │       │     - action: "get_deals"
   │       │       │
   │       │       ├─> Edge Function: POST Bitrix24 API
   │       │       │     - endpoint: /crm.deal.list
   │       │       │     - select: [ID, TITLE, COMPANY_ID, STAGE_ID,
   │       │       │                 OPPORTUNITY, CURRENCY_ID,
   │       │       │                 CLOSEDATE, DATE_CREATE]
   │       │       │
   │       │       └─> Bitrix24: Retorna deals
   │       │
   │       ├──> [SUB-TAREFA 3.2] Vincular aos Clientes
   │       │       │
   │       │       └─> Para cada deal:
   │       │             │
   │       │             ├─> Sistema: Buscar bitrix_clients
   │       │             │     WHERE bitrix_id = deal.COMPANY_ID
   │       │             │
   │       │             ├─> [GATEWAY] Cliente encontrado?
   │       │             │     │
   │       │             │     ├─> SIM:
   │       │             │     │     └─> bitrix_client_id = client.id
   │       │             │     │
   │       │             │     └─> NÃO:
   │       │             │           ├─> Log: "Empresa {ID} não encontrada"
   │       │             │           └─> Pular deal (não sincronizar)
   │       │             │
   │       │             └─> Transformar:
   │       │                   {
   │       │                     bitrix_id: deal.ID,
   │       │                     bitrix_client_id: ...,
   │       │                     title: deal.TITLE,
   │       │                     stage: deal.STAGE_ID,
   │       │                     value: deal.OPPORTUNITY,
   │       │                     currency: deal.CURRENCY_ID,
   │       │                     ...
   │       │                   }
   │       │
   │       ├──> [SUB-TAREFA 3.3] Upsert no Supabase
   │       │       │
   │       │       └─> Sistema: INSERT bitrix_deals
   │       │             ON CONFLICT (bitrix_id)
   │       │             DO UPDATE ...
   │       │
   │       └──> Loop até última página
   │
   ├──> [TAREFA 4] Calcular Estatísticas dos Clientes
   │       │
   │       └─> Para cada cliente sincronizado:
   │             │
   │             ├─> Sistema: Calcular total_spent
   │             │     SELECT SUM(value)
   │             │     FROM bitrix_deals
   │             │     WHERE bitrix_client_id = client.id
   │             │       AND stage IN ('WON', 'COMPLETED')
   │             │
   │             ├─> Sistema: Calcular last_purchase_date
   │             │     SELECT MAX(close_date)
   │             │     FROM bitrix_deals
   │             │     WHERE bitrix_client_id = client.id
   │             │       AND stage IN ('WON', 'COMPLETED')
   │             │
   │             └─> Sistema: UPDATE bitrix_clients
   │                   SET total_spent = ...,
   │                       last_purchase_date = ...
   │
   ├──> [TAREFA 5] Finalizar Log
   │       │
   │       ├─> Sistema: UPDATE bitrix_sync_logs
   │       │     SET status = "completed",
   │       │         completed_at = now(),
   │       │         clients_synced = counter_clients,
   │       │         deals_synced = counter_deals
   │       │
   │       └─> Sistema: Toast notification
   │             "✅ Sincronização concluída!
   │              {counter_clients} clientes e {counter_deals} negócios."
   │
   └──> [FIM] Sincronização completa

┌─────────────────────────────────────────────────────────────────────┐
│                      TRATAMENTO DE ERROS                            │
├─────────────────────────────────────────────────────────────────────┤
│ Erro na Tarefa 2 (Empresas):                                       │
│   ├─> Bitrix24 offline → Retry 3x (backoff: 5s, 15s, 30s)        │
│   ├─> Timeout (>30s) → Marcar log como "failed"                   │
│   └─> Erro de parse → Log erro + continuar próxima empresa        │
│                                                                     │
│ Erro na Tarefa 3 (Deals):                                          │
│   ├─> Deal sem empresa → Skip + log warning                       │
│   ├─> Campos inválidos → Usar valores default                     │
│   └─> Constraint violation → Log + skip                           │
│                                                                     │
│ Rollback:                                                           │
│   └─> NÃO há rollback automático                                  │
│       (Sincronização é idempotente - safe)                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. MATRIZ DE FUNCIONALIDADES

### 📊 Matriz Completa: Features vs Módulos

| Feature | Catálogo | Personalização | CRM | Orçamentos | Pedidos | BI | Gamificação | IA | Admin |
|---------|----------|----------------|-----|------------|---------|----|--------------|----|-------|
| **Listagem** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Detalhes** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Criar** | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Editar** | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Deletar** | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Busca Textual** | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Busca Semântica** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Busca Visual** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Busca por Voz** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Filtros** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Ordenação** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Paginação** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Exportar** | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Importar** | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Compartilhar** | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Favoritos** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Coleções** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Comparação** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Histórico** | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Notificações** | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| **Sincronização Bitrix** | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Sincronização n8n** | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Templates** | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Aprovação Online** | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Kanban** | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Dashboard** | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ |
| **Recomendações IA** | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Chat IA** | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Análise RFM** | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Conquistas** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **XP/Moedas** | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Ranking** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |

**Legenda:**
- ✅ Implementado
- ❌ Não aplicável ou não implementado

### 📈 Contadores por Módulo

| Módulo | Features Implementadas | Complexidade |
|--------|------------------------|--------------|
| **Catálogo** | 15 | Alta |
| **Personalização** | 8 | Média |
| **CRM** | 11 | Alta |
| **Orçamentos** | 16 | Muito Alta |
| **Pedidos** | 7 | Média |
| **BI** | 6 | Alta |
| **Gamificação** | 6 | Média |
| **IA** | 7 | Muito Alta |
| **Admin** | 10 | Média |

---

## 3. MAPA DE DEPENDÊNCIAS

### 🔗 Dependências entre Módulos

```
┌────────────────────────────────────────────────────────────────┐
│                      MAPA DE DEPENDÊNCIAS                      │
└────────────────────────────────────────────────────────────────┘

                    [Auth / Profiles]
                           │
                           ├──────────┬──────────┬──────────┐
                           │          │          │          │
                     [Catálogo]   [CRM]    [Admin]   [Gamificação]
                           │          │          │          │
                           │          │          │          │
             ┌─────────────┼──────────┴─────┐    │          │
             │             │                │    │          │
             │             │                │    │          │
      [Personalização] [Orçamentos]      [BI]   │          │
             │             │                │    │          │
             │             │                │    │          │
             └─────────────┼────────────────┼────┘          │
                           │                │               │
                           │                │               │
                       [Pedidos]            │               │
                           │                │               │
                           │                │               │
                           └────────────────┴───────────────┘
                                            │
                                       [Bitrix24]
                                            │
                                         [n8n]

```

### 📊 Matriz de Dependências

| Módulo | Depende de | É dependência de |
|--------|------------|------------------|
| **Auth** | - | Todos |
| **Catálogo** | Auth | Orçamentos, IA, Favoritos, Coleções |
| **Personalização** | Auth, Catálogo | Orçamentos, Admin |
| **CRM** | Auth, Bitrix24 | Orçamentos, IA, BI |
| **Orçamentos** | Auth, Catálogo, CRM, Personalização | Pedidos, Gamificação, BI |
| **Pedidos** | Auth, Orçamentos | BI, Gamificação |
| **BI** | Auth, CRM, Orçamentos, Pedidos | - |
| **Gamificação** | Auth, Orçamentos, Pedidos | - |
| **IA** | Auth, Catálogo, CRM | Recomendações |
| **Admin** | Auth | Personalização, Catálogo |
| **Bitrix24** | - | CRM, Orçamentos |
| **n8n** | - | Orçamentos, Notificações |

---

## 4. ANÁLISE DE COMPLEXIDADE

### 🎯 Complexidade por Funcionalidade

| Funcionalidade | Complexidade | Arquivos Envolvidos | LOC Estimado | Risco |
|----------------|--------------|---------------------|--------------|-------|
| **Busca Semântica** | 🔴 Muito Alta | 3 files (hook, edge function, component) | ~800 | Alto |
| **Sincronização Bitrix24** | 🔴 Muito Alta | 5 files (hook, edge function, page, types) | ~1200 | Alto |
| **Orçamentos (CRUD completo)** | 🔴 Muito Alta | 25+ files (pages, components, hooks) | ~3000 | Médio |
| **Chat com Especialista** | 🟠 Alta | 4 files (component, hook, edge function) | ~600 | Médio |
| **Gamificação** | 🟠 Alta | 6 files (components, hooks, tables) | ~500 | Baixo |
| **Simulador de Personalização** | 🟠 Alta | 8 files (page, components, hooks) | ~700 | Médio |
| **Gerador de Mockups** | 🟠 Alta | 4 files (page, edge function, components) | ~500 | Médio |
| **Análise RFM** | 🟡 Média | 3 files (hook, component) | ~300 | Baixo |
| **Coleções de Produtos** | 🟡 Média | 4 files (context, hooks, pages) | ~400 | Baixo |
| **Comparação de Produtos** | 🟡 Média | 5 files (context, components, page) | ~350 | Baixo |
| **Busca Visual** | 🔴 Muito Alta | 3 files (button, edge function) | ~400 | Alto |
| **Comandos de Voz** | 🟠 Alta | 5 files (hooks, overlay) | ~500 | Médio |
| **Dashboard de BI** | 🟠 Alta | 3 files (page, hooks, charts) | ~600 | Baixo |
| **Templates de Orçamento** | 🟡 Média | 4 files (page, components, hooks) | ~400 | Baixo |
| **Aprovação Pública** | 🟠 Alta | 4 files (page, edge function, tokens) | ~450 | Médio |

**Legenda:**
- 🔴 Muito Alta: >600 LOC ou >4 integrações externas
- 🟠 Alta: 400-600 LOC ou 2-3 integrações
- 🟡 Média: <400 LOC, poucas integrações

---

## 5. ROADMAP VISUAL

### 📅 Timeline de Desenvolvimento (Estimado)

```
Q4 2024                    Q1 2025                    Q2 2025
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dez 2024
├─ ✅ Setup inicial
├─ ✅ Auth + Perfis
├─ ✅ Catálogo básico
└─ ✅ Produtos + Variações

Jan 2025
├─ ✅ CRM + Bitrix24
├─ ✅ Sincronização
├─ ✅ Orçamentos (CRUD)
└─ ✅ Personalização

Fev 2025
├─ ✅ IA (Recomendações)
├─ ✅ Chat Especialista
├─ ✅ Gamificação
└─ ✅ Templates

Mar 2025
├─ ✅ Pedidos
├─ ✅ BI Dashboard
├─ ✅ Busca Semântica
└─ ✅ Busca Visual

Abr 2025
├─ 🔄 Comandos de Voz
├─ 🔄 Mockup Generator
├─ 📋 Testes (70% coverage)
└─ 📋 Refatoração

Mai 2025
├─ 📋 Performance
├─ 📋 Escalabilidade
├─ 📋 Segurança
└─ 📋 Documentação

Jun 2025
├─ 📋 Mobile (PWA)
├─ 📋 Exportações
├─ 📋 WhatsApp Business
└─ 📋 Go Live v1.0
```

**Legenda:**
- ✅ Concluído
- 🔄 Em andamento
- 📋 Planejado

---

**Este documento é parte da análise exaustiva do repositório gifts-store.**  
**Para análise completa, consulte:** ANALISE_EXAUSTIVA_GIFTS_STORE.md
