# 📋 RELATÓRIO DE ARQUIVOS ÓRFÃOS E NÃO UTILIZADOS

**Data de Geração:** 06 de Janeiro de 2026  
**Gerado por:** Claude (Anthropic) + Lovable  

---

## ⚠️ IMPORTANTE

Este relatório identifica arquivos que **potencialmente** não estão sendo utilizados. 
**NÃO EXCLUA** nenhum arquivo sem verificação manual adicional.

---

## 🔴 PÁGINAS ÓRFÃS (Não registradas no Router)

As seguintes páginas existem mas **NÃO estão no App.tsx**:

| Arquivo | Status | Recomendação |
|---------|--------|--------------|
| `src/pages/NotFoundPage.tsx` | ❌ Órfão | Duplicado de `NotFound.tsx` - Avaliar remoção |
| `src/pages/BitrixSyncPageV2.tsx` | ❌ Órfão | Versão alternativa - Adicionar rota ou remover |
| `src/pages/RateLimitDashboardPage.tsx` | ❌ Órfão | Adicionar rota `/admin/rate-limit` |
| `src/pages/PermissionsPage.tsx` | ❌ Órfão | Adicionar rota `/admin/permissions` |
| `src/pages/RolesPage.tsx` | ❌ Órfão | Adicionar rota `/admin/roles` |
| `src/pages/RolePermissionsPage.tsx` | ❌ Órfão | Adicionar rota `/admin/role-permissions` |
| `src/pages/SSOCallbackPage.tsx` | ❌ Órfão | Adicionar rota `/auth/callback` |
| `src/pages/Security.tsx` | ❌ Órfão | Adicionar rota `/seguranca` |
| `src/pages/CustomizableDashboard.tsx` | ❌ Órfão | Adicionar rota `/dashboard` ou remover |

**Total: 9 páginas órfãs**

---

## 🟡 COMPONENTES POTENCIALMENTE ÓRFÃOS

### Sprint 3/4 - Não Integrados (Recém Criados)

Estes componentes foram criados mas ainda não estão integrados nas páginas:

| Componente | Status | Ação Sugerida |
|------------|--------|---------------|
| `src/components/voice/EnhancedVoiceSearch.tsx` | 🟡 Exportado, não usado | Integrar em FiltersPage |
| `src/components/ai/ProductRecommendations.tsx` | 🟡 Exportado, não usado | Integrar em ProductDetail |
| `src/components/comparison/ComparisonTable.tsx` | 🟡 Exportado, não usado | Integrar em ComparePage |
| `src/components/quotes/QuickQuote.tsx` | 🟡 Exportado, não usado | Integrar com QuickQuoteContext |
| `src/components/quotes/AddToQuoteButton.tsx` | 🟡 Criado | Integrar em ProductCard |

### Componentes Virtualizados - Não Usados

| Componente | Status | Ação Sugerida |
|------------|--------|---------------|
| `src/components/virtualized/VirtualGrid.tsx` | ❌ Não importado | Usar em ProductGrid ou remover |
| `src/components/virtualized/VirtualList.tsx` | ❌ Não importado | Usar em listas grandes ou remover |

### Context Não Integrado

| Context | Status | Ação Sugerida |
|---------|--------|---------------|
| `src/contexts/QuickQuoteContext.tsx` | ❌ Não no App.tsx | Adicionar QuickQuoteProvider ao App |

---

## 🟠 FEATURES NÃO INTEGRADAS

Módulos em `src/features/` que existem mas não são importados em nenhum lugar:

| Feature | Arquivo | Status |
|---------|---------|--------|
| Automation | `src/features/automation/WorkflowBuilder.tsx` | ❌ Não usado |
| Auth | `src/features/auth/BiometricAuth.ts` | ❌ Não usado |
| Auth | `src/features/auth/OAuth2.ts` | ❌ Não usado |
| GDPR | `src/features/gdpr/DataDeletion.tsx` | ❌ Não usado |
| GDPR | `src/features/gdpr/DataExport.tsx` | ❌ Não usado |
| Reports | `src/features/reports/InventoryReport.tsx` | ❌ Não usado |
| Reports | `src/features/reports/SalesDashboard.tsx` | ❌ Não usado |
| Templates | `src/features/templates/TemplateEditor.tsx` | ❌ Não usado |
| Templates | `src/features/templates/TemplateEngine.ts` | ✅ Usado por TemplateEditor |

**Total: 8 features não integradas**

---

## 🟢 HOOKS NÃO UTILIZADOS

| Hook | Status | Observação |
|------|--------|------------|
| `useSupplierMutations.ts` | ❌ Não existe mais | Arquivo listado mas não encontrado |
| `useOptimisticFavorites.ts` | ❌ Não usado | Implementação completa, não integrada |
| `useColors.ts` | ❌ Não usado | Disponível mas não importado |

### Hooks Duplicados

| Hook | Duplicação |
|------|------------|
| `useCategories` | Existe em `useCategories.ts` E `useGiftsData.ts` |
| `useSuppliers` | Existe em `useSuppliers.ts` E `useGiftsData.ts` |
| `useBulkActions` | Existe `.ts` E `.tsx` versões |

---

## 🔵 COMPONENTES DUPLICADOS

Componentes com funcionalidade similar em locais diferentes:

| Componente | Local 1 | Local 2 | Recomendação |
|------------|---------|---------|--------------|
| EmptyState | `src/components/common/EmptyState.tsx` | `src/components/shared/EmptyState.tsx` | Unificar |
| EmptyState | `src/components/common/EmptyState.tsx` | `src/components/ui/EmptyState.tsx` | Unificar |
| LoadingSpinner | `src/components/common/LoadingSpinner.tsx` | `src/components/ui/LoadingSpinner.tsx` | Unificar |
| LoadingState | `src/components/common/LoadingState.tsx` | `src/components/ui/LoadingState.tsx` | Unificar |
| TableSkeleton | `src/components/common/TableSkeleton.tsx` | `src/components/ui/TableSkeleton.tsx` | Unificar |
| ErrorBoundary | `src/components/common/ErrorBoundary.tsx` | `src/components/ErrorBoundary.tsx` | Unificar |
| ErrorBoundary | `src/components/common/ErrorBoundary.tsx` | `src/components/errors/ErrorBoundary.tsx` | Unificar |
| ProtectedRoute | `src/components/auth/ProtectedRoute.tsx` | `src/components/layout/ProtectedRoute.tsx` | Unificar |
| BulkActionsBar | `src/components/common/BulkActionsBar.tsx` | `src/components/BulkActionsBar.tsx` | Unificar |
| LazyImage | `src/components/common/LazyImage.tsx` | `src/components/LazyImage.tsx` | Unificar |
| SavedFiltersDropdown | `src/components/filters/SavedFiltersDropdown.tsx` | `src/components/SavedFiltersDropdown.tsx` | Unificar |

---

## 📦 INTEGRAÇÕES NÃO UTILIZADAS

Módulos de integração que existem mas podem não estar sendo usados:

| Integração | Arquivo | Verificar Uso |
|------------|---------|---------------|
| HubSpot | `src/integrations/hubspot/contact-sync.ts` | ⚠️ Verificar |
| Salesforce | `src/integrations/salesforce/lead-sync.ts` | ⚠️ Verificar |
| SAP | `src/integrations/sap/order-sync.ts` | ⚠️ Verificar |
| TOTVS | `src/integrations/totvs/stock-sync.ts` | ⚠️ Verificar |
| MercadoPago | `src/integrations/mercadopago/payment.ts` | ⚠️ Verificar |
| Zapier | `src/integrations/zapier/actions.ts` | ⚠️ Verificar |
| Zapier | `src/integrations/zapier/triggers.ts` | ⚠️ Verificar |

---

## 📚 BIBLIOTECA (lib) - MÓDULOS NÃO UTILIZADOS

Muitos módulos em `src/lib/` podem não estar sendo usados ativamente:

### Provavelmente Não Usados

| Módulo | Arquivos | Status |
|--------|----------|--------|
| `lib/cache/` | redis.ts | ⚠️ Redis não configurado no frontend |
| `lib/websocket/` | server.ts | ⚠️ Server-side não roda no frontend |
| `lib/scheduler/` | cron-jobs.ts, task-queue.ts | ⚠️ Backend-only |
| `lib/pwa/` | register-sw.ts | ✅ Usado em main.tsx |

---

## 📊 RESUMO ESTATÍSTICO

| Categoria | Órfãos/Duplicados |
|-----------|-------------------|
| Páginas órfãs | 9 |
| Componentes não integrados | 7 |
| Features não usadas | 8 |
| Hooks duplicados | 3 |
| Componentes duplicados | 11 |
| Integrações a verificar | 7 |

---

## ✅ AÇÕES RECOMENDADAS

### Prioridade Alta (Bugs Potenciais)
1. ⬜ Adicionar `QuickQuoteProvider` ao App.tsx
2. ⬜ Unificar `ProtectedRoute` (usar apenas um)
3. ⬜ Unificar `ErrorBoundary` (usar apenas um)

### Prioridade Média (Limpeza)
4. ⬜ Adicionar rotas para páginas órfãs úteis (Security, Permissions, Roles)
5. ⬜ Remover `NotFoundPage.tsx` (duplicado de `NotFound.tsx`)
6. ⬜ Integrar componentes do Sprint 4 nas páginas

### Prioridade Baixa (Organização)
7. ⬜ Unificar componentes duplicados (EmptyState, LoadingSpinner, etc.)
8. ⬜ Consolidar hooks duplicados (useCategories, useSuppliers)
9. ⬜ Avaliar remoção de integrações não utilizadas
10. ⬜ Mover código server-side para edge functions

---

## 🚫 NÃO EXCLUIR

Os seguintes arquivos parecem órfãos mas são importantes:

- `src/components/effects/index.ts` - Barrel export, usado
- `src/components/ai/index.ts` - Barrel export, mantém organização
- `src/components/voice/index.ts` - Barrel export, pronto para uso
- `src/components/comparison/index.ts` - Barrel export, pronto para uso
- Arquivos `.stories.tsx` - Documentação Storybook
- Arquivos em `tests/` - Testes automatizados

---

*Relatório gerado automaticamente. Verificação manual recomendada antes de qualquer exclusão.*
