# 📋 MELHORIAS RESTANTES - PLANO DE IMPLEMENTAÇÃO COMPLETO

> **Projeto:** Gifts Store  
> **Análise atualizada em:** 27/12/2025  
> **Metodologia:** Varredura exaustiva do código-fonte + verificação de funcionalidades

---

## 📊 RESUMO EXECUTIVO

| Status | Quantidade |
|--------|------------|
| ✅ Já Implementado | 8 itens |
| 🔴 Pendente - Alta Prioridade | 10 itens |
| 🟡 Pendente - Média Prioridade | 12 itens |
| 🟢 Pendente - Baixa Prioridade | 8 itens |
| **TOTAL PENDENTE** | **30 melhorias** |

---

## ✅ JÁ CONCLUÍDAS (8/38):

| # | Funcionalidade | Evidência |
|---|----------------|-----------|
| 1 | ✅ Sistema de Gamificação | `useGamification.ts`, `SellerLeaderboard.tsx` |
| 2 | ✅ Onboarding Interativo | `useOnboarding.ts`, `OnboardingTour.tsx` |
| 3 | ✅ Loja de Recompensas | `useRewardsStore.ts`, `RewardsStorePage.tsx` |
| 4 | ✅ Metas de Vendas | `useSalesGoals.ts`, `SalesGoalsCard.tsx` |
| 5 | ✅ Follow-up Reminders | `useFollowUpReminders.ts`, `FollowUpRemindersPopover.tsx` |
| 6 | ✅ Chat IA Especialista | `useExpertConversations.ts`, `ExpertChatDialog.tsx` |
| 7 | ✅ Busca Visual por Imagem | `VisualSearchButton.tsx`, `visual-search/index.ts` |
| 8 | ✅ Busca por Voz | `useSpeechRecognition.ts`, `VoiceSearchOverlay.tsx` |

---

## 🔴 PENDENTES ALTA PRIORIDADE (10 itens)

### 1. PWA (Progressive Web App)
**Status:** ❌ NÃO IMPLEMENTADO  
**Evidência:** Pasta `public/` não possui `manifest.json` nem `sw.js`  
**Impacto:** Usuários não podem instalar o app no dispositivo  
**Tempo:** 4-5 horas

**Arquivos a criar:**
```
public/manifest.json
public/sw.js
src/lib/sw-register.ts
```

**Tarefas:**
1. Criar `public/manifest.json` com ícones e configurações
2. Criar `public/sw.js` (service worker) para cache offline
3. Criar `src/lib/sw-register.ts` para registrar SW
4. Registrar service worker em `main.tsx`
5. Adicionar meta tags no `index.html`

---

### 2. Lazy Loading de Rotas
**Status:** ❌ NÃO IMPLEMENTADO  
**Evidência:** `App.tsx` importa todas as 26 páginas estaticamente  
**Impacto:** Bundle grande (~1.5MB), carregamento inicial lento  
**Tempo:** 2-3 horas

**Arquivos a editar:**
```
src/App.tsx
```

**Tarefas:**
1. Converter imports para `React.lazy()`
2. Adicionar `Suspense` com fallback skeleton
3. Agrupar rotas por módulo (quotes, clients, products, admin)
4. Verificar redução no bundle size

---

### 3. Testes Automatizados
**Status:** ❌ NÃO IMPLEMENTADO  
**Evidência:** Nenhum arquivo `*.test.ts` ou `vitest.config.ts` encontrado  
**Impacto:** Risco de regressão em refatorações  
**Tempo:** 2-3 dias

**Arquivos a criar:**
```
vitest.config.ts
src/hooks/__tests__/useGamification.test.ts
src/hooks/__tests__/useQuotes.test.ts
src/hooks/__tests__/useSalesGoals.test.ts
src/components/__tests__/QuoteKanbanBoard.test.tsx
.github/workflows/test.yml
```

**Tarefas:**
1. Instalar `vitest`, `@testing-library/react`, `@testing-library/user-event`
2. Configurar `vitest.config.ts`
3. Criar testes para hooks críticos (mínimo 30% coverage)
4. Configurar CI no GitHub Actions

---

### 4. Rate Limiting nas Edge Functions
**Status:** ⚠️ PARCIAL  
**Evidência:** Apenas tratamento de erro 429, sem implementação de rate limiter  
**Impacto:** Vulnerabilidade a abuso de API e custos excessivos  
**Tempo:** 4-6 horas

**Arquivos a criar/editar:**
```
supabase/functions/_shared/rate-limiter.ts (CRIAR)
supabase/functions/ai-recommendations/index.ts
supabase/functions/expert-chat/index.ts
supabase/functions/semantic-search/index.ts
supabase/functions/visual-search/index.ts
supabase/functions/generate-mockup/index.ts
```

**Tarefas:**
1. Criar rate limiter usando Map com TTL
2. Limitar por IP + user_id
3. 100 req/min para endpoints normais
4. 20 req/min para endpoints de IA
5. Retornar HTTP 429 com header Retry-After

---

### 5. Tokens de Aprovação Seguros
**Status:** ❌ NÃO IMPLEMENTADO  
**Evidência:** `quote-approval/index.ts` usa UUID simples, validade de 7 dias  
**Impacto:** Vulnerabilidade a força bruta  
**Tempo:** 4-5 horas

**Arquivos a editar:**
```
supabase/functions/quote-approval/index.ts
src/hooks/useQuoteApproval.ts
+ Migration para alterar tabela quote_approval_tokens
```

**Tarefas:**
1. Migrar para tokens com `crypto.randomBytes(32)`
2. Reduzir validade de 7 dias para 48 horas
3. Adicionar rate limiting (5 req/min por token)
4. Registrar IP e user-agent nas aprovações
5. Invalidar token imediatamente após uso único

---

### 6. Cache de Busca Semântica
**Status:** ❌ NÃO IMPLEMENTADO  
**Evidência:** `semantic-search/index.ts` sem cache  
**Impacto:** Performance degradada, latência alta  
**Tempo:** 6-8 horas

**Arquivos a editar:**
```
supabase/functions/semantic-search/index.ts
+ Migration para índice HNSW (opcional)
```

**Tarefas:**
1. Implementar cache em memória com Map + TTL (5min)
2. Hash da query como chave de cache
3. Invalidar cache via webhook quando produtos atualizados
4. Considerar índice HNSW para performance

---

### 7. Exportação Excel Genérica
**Status:** ⚠️ PARCIAL  
**Evidência:** `personalizationExport.ts` usa xlsx, mas não há botão genérico  
**Impacto:** Usuários precisam de relatórios Excel  
**Tempo:** 4-6 horas

**Arquivos a criar/editar:**
```
src/utils/excelExport.ts (CRIAR)
src/components/export/ExportExcelButton.tsx (CRIAR)
src/pages/QuotesListPage.tsx (adicionar botão)
src/pages/OrdersListPage.tsx (adicionar botão)
src/pages/ClientList.tsx (adicionar botão)
src/pages/BIDashboard.tsx (adicionar botão)
```

**Tarefas:**
1. Criar utilitário genérico de exportação Excel
2. Criar componente `ExportExcelButton` reutilizável
3. Adicionar exportação em todas as páginas de lista
4. Formatação correta de datas (dd/MM/yyyy) e moedas (R$)

---

### 8. Error Handling Centralizado
**Status:** ❌ NÃO IMPLEMENTADO  
**Evidência:** Nenhum `ErrorBoundary.tsx` encontrado  
**Impacto:** UX inconsistente em erros, difícil debugging  
**Tempo:** 3-4 horas

**Arquivos a criar:**
```
src/components/ErrorBoundary.tsx
src/hooks/useErrorHandler.ts
```

**Tarefas:**
1. Criar Error Boundary global
2. Criar hook `useErrorHandler` para erros assíncronos
3. Fallback UI com opção de "Tentar novamente"
4. Logging de erros (console em dev, opcional Sentry em prod)

---

### 9. Validação de Formulários
**Status:** ⚠️ PARCIAL  
**Evidência:** Zod instalado mas validações incompletas  
**Impacto:** Dados inválidos podem ser enviados  
**Tempo:** 4-6 horas

**Arquivos a editar:**
```
src/pages/QuoteBuilderPage.tsx
src/pages/Auth.tsx
src/pages/ProfilePage.tsx
src/components/goals/SalesGoalsCard.tsx
```

**Tarefas:**
1. Auditar todos os formulários
2. Criar schemas Zod completos
3. Validar antes do submit
4. Mensagens de erro claras em pt-BR

---

### 10. Notificações Push Web
**Status:** ❌ NÃO IMPLEMENTADO  
**Evidência:** Nenhum arquivo relacionado a Web Push  
**Impacto:** Usuário não recebe alertas fora do app  
**Tempo:** 8-10 horas

**Arquivos a criar:**
```
src/hooks/usePushNotifications.ts
supabase/functions/send-push/index.ts
+ Migration para tabela push_subscriptions
```

**Tarefas:**
1. Implementar Web Push API
2. Solicitar permissão do navegador
3. Salvar subscription no banco
4. Enviar push para: aprovação, lembrete vencido, conquista
5. Requer PWA (item 1) implementado

---

## 🟡 PENDENTES MÉDIA PRIORIDADE (12 itens)

### 11. QR Code para Orçamentos
**Status:** ❌ NÃO IMPLEMENTADO  
**Evidência:** Arquivo listado no projeto mas não existe  
**Tempo:** 2-3 horas

**Arquivos a criar:**
```
src/components/quotes/QuoteQRCode.tsx
```

**Tarefas:**
1. Instalar `qrcode.react`
2. Gerar QR Code do link de aprovação
3. Incluir no PDF do orçamento
4. Exibir na tela de visualização

---

### 12. Tags/Etiquetas em Orçamentos
**Status:** ❌ NÃO IMPLEMENTADO  
**Evidência:** Arquivo listado mas não existe  
**Tempo:** 3-4 horas

**Arquivos a criar/editar:**
```
src/components/quotes/TagManager.tsx (CRIAR)
+ Migration para campo tags em quotes
src/pages/QuotesListPage.tsx (filtro por tags)
```

---

### 13. Modo Apresentação
**Status:** ❌ NÃO IMPLEMENTADO  
**Evidência:** Arquivo listado mas não existe  
**Tempo:** 3-4 horas

**Arquivos a criar:**
```
src/components/products/PresentationMode.tsx
```

**Tarefas:**
1. Galeria fullscreen com navegação por setas
2. Ocultar elementos de UI
3. Atalho de teclado (F11 ou P)

---

### 14. Sync Bitrix Assíncrono
**Status:** ❌ NÃO IMPLEMENTADO  
**Evidência:** `bitrix-sync/index.ts` é síncrono  
**Tempo:** 1-2 dias

**Arquivos a editar:**
```
supabase/functions/bitrix-sync/index.ts
src/hooks/useBitrixSync.ts
src/pages/BitrixSyncPage.tsx
```

**Tarefas:**
1. Transformar sync em job assíncrono
2. Criar fila de processamento
3. Progress bar em tempo real
4. Notificar quando concluído
5. Retry automático em falhas

---

### 15. Audit Log Universal
**Status:** ❌ NÃO IMPLEMENTADO  
**Evidência:** Só `quote_history` e `order_history` existem  
**Tempo:** 6-8 horas

**Arquivos a criar:**
```
+ Migration para tabela audit_log
+ Migration para triggers em tabelas críticas
src/components/admin/AuditLogViewer.tsx
```

---

### 16. Comentários em Orçamentos
**Status:** ❌ NÃO IMPLEMENTADO  
**Evidência:** Nenhum arquivo relacionado  
**Tempo:** 4-6 horas

**Arquivos a criar:**
```
+ Migration para tabela quote_comments
src/components/quotes/QuoteComments.tsx
```

---

### 17. Bulk Actions (Ações em Massa)
**Status:** ❌ NÃO IMPLEMENTADO  
**Evidência:** Nenhum arquivo relacionado  
**Tempo:** 6-8 horas

**Arquivos a criar:**
```
src/components/common/BulkActionsBar.tsx
```

**Tarefas:**
1. Checkbox de seleção em listas
2. Barra de ações quando itens selecionados
3. Ações: Excluir, Alterar Status, Exportar

---

### 18. Duplicar Orçamento
**Status:** ❌ NÃO IMPLEMENTADO  
**Evidência:** Não há botão duplicar  
**Tempo:** 2-3 horas

**Arquivos a editar:**
```
src/pages/QuoteViewPage.tsx
src/hooks/useQuotes.ts
```

---

### 19. Filtros Salvos por Usuário
**Status:** ❌ NÃO IMPLEMENTADO  
**Tempo:** 4-5 horas

**Arquivos a criar/editar:**
```
+ Migration para tabela user_filter_presets
src/hooks/useFilterPresets.ts
src/components/filters/SavedFiltersDropdown.tsx
```

---

### 20. Histórico de Preços
**Status:** ❌ NÃO IMPLEMENTADO  
**Tempo:** 4-6 horas

**Arquivos a criar:**
```
+ Migration para tabela product_price_history
+ Migration para trigger de alteração de preço
src/components/products/PriceHistoryChart.tsx
```

---

### 21. Dashboard Bitrix Sync
**Status:** ⚠️ PARCIAL  
**Evidência:** Página existe mas sem status em tempo real  
**Tempo:** 4-6 horas

**Arquivos a editar:**
```
src/pages/BitrixSyncPage.tsx
```

---

### 22. Versionamento de Orçamentos
**Status:** ❌ NÃO IMPLEMENTADO  
**Tempo:** 8-10 horas

**Arquivos a criar/editar:**
```
+ Migration para campo version em quotes
src/hooks/useQuoteVersions.ts
src/components/quotes/QuoteVersionHistory.tsx
```

---

## 🟢 PENDENTES BAIXA PRIORIDADE (8 itens)

### 23. Integração Google Calendar
**Tempo:** 6-8 horas

### 24. Dashboard Personalizável
**Tempo:** 1 dia

### 25. Relatórios Agendados
**Tempo:** 1 dia

### 26. Importação CSV de Produtos
**Tempo:** 6-8 horas

### 27. Temas White-label
**Tempo:** 1 semana

### 28. Integração WhatsApp Business
**Tempo:** 1 semana

### 29. Previsão de Vendas com ML
**Tempo:** 2-3 semanas

### 30. API Pública Documentada
**Tempo:** 2-3 semanas

---

## 📅 CRONOGRAMA SUGERIDO

### Semana 1 (Fundação - ~40h)
| Dia | Item | Tempo |
|-----|------|-------|
| D1 | 1. PWA | 5h |
| D1 | 2. Lazy Loading | 3h |
| D2 | 4. Rate Limiting | 6h |
| D3 | 5. Tokens Seguros | 5h |
| D3 | 8. Error Handling | 4h |
| D4 | 7. Export Excel | 6h |
| D4 | 9. Validação Forms | 4h |
| D5 | 11. QR Code | 3h |
| D5 | 12. Tags | 4h |

### Semana 2 (Infraestrutura - ~44h)
| Dia | Item | Tempo |
|-----|------|-------|
| D6-D7 | 3. Testes | 16h |
| D8 | 6. Cache Semântico | 8h |
| D9 | 10. Push Notifications | 10h |
| D10 | 13. Modo Apresentação | 4h |
| D10 | 18. Duplicar Orçamento | 3h |

### Semana 3-4 (Features - ~50h)
| Dia | Item | Tempo |
|-----|------|-------|
| D11-D12 | 14. Sync Assíncrono | 12h |
| D13 | 15. Audit Log | 8h |
| D14 | 16. Comentários | 6h |
| D15 | 17. Bulk Actions | 8h |
| D16 | 19. Filtros Salvos | 5h |
| D17 | 20. Histórico Preços | 6h |
| D18 | 22. Versionamento | 8h |

---

## 📊 MÉTRICAS DE SUCESSO

| Métrica | Atual | Meta |
|---------|-------|------|
| Lighthouse PWA Score | 0 | 90+ |
| Test Coverage | 0% | 30%+ |
| Bundle Size | ~1.5MB | <800KB |
| Rate Limit Violations | N/A | <0.1% |
| First Contentful Paint | ~3s | <1.5s |

---

## 📝 DEPENDÊNCIAS ENTRE ITENS

```
[1] PWA
└── Requerido por: [10] Push Notifications

[2] Lazy Loading
└── Melhora performance geral

[3] Testes
└── Independente

[4] Rate Limiting
└── Requerido por: [6] Cache Semântico

[5] Tokens Seguros
└── Independente

[10] Push Notifications
└── Requer: [1] PWA + [4] Rate Limiting

[15] Audit Log
└── Requerido por: [22] Versionamento
```

---

**Documento gerado por análise exaustiva do repositório**  
**Atualizado em:** 27/12/2025
