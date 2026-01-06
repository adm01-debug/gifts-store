# 📊 INVENTÁRIO COMPLETO DO PROJETO GIFTS STORE

**Data de Geração:** 06 de Janeiro de 2026  
**Gerado por:** Claude (Anthropic) + Lovable  
**Versão do Inventário:** 2.0

---

## 📋 ÍNDICE

1. [Estrutura Raiz](#-estrutura-raiz)
2. [Configurações CI/CD](#-github-cicd)
3. [Documentação](#-documentação)
4. [Supabase Backend](#-supabase-backend)
5. [Testes](#-testes)
6. [Código Fonte (src)](#-código-fonte-src)
7. [Resumo Quantitativo](#-resumo-quantitativo)

---

## 🏗️ ESTRUTURA RAIZ

### Arquivos de Configuração (45+ arquivos)

| Arquivo | Descrição |
|---------|-----------|
| `.codeclimate.yml` | Configuração Code Climate para análise de qualidade |
| `.dockerignore` | Arquivos ignorados no build Docker |
| `.env` | Variáveis de ambiente (auto-gerado) |
| `.env.example` | Template de variáveis de ambiente |
| `.env.local.example` | Template para desenvolvimento local |
| `.env.production.example` | Template para produção |
| `.eslintrc.cjs` | Configuração ESLint (CommonJS) |
| `.eslintrc.json` | Configuração ESLint (JSON) |
| `eslint.config.js` | Configuração ESLint (Flat Config) |
| `.gitignore` | Arquivos ignorados pelo Git |
| `.nycrc` | Configuração NYC (cobertura de código) |
| `.prettierignore` | Arquivos ignorados pelo Prettier |
| `.prettierrc.json` | Configuração Prettier |
| `.vercel-force-deploy` | Flag para forçar deploy Vercel |
| `.vercelignore` | Arquivos ignorados no deploy Vercel |
| `vercel.json` | Configuração Vercel |
| `bun.lock` | Lockfile Bun (texto) |
| `bun.lockb` | Lockfile Bun (binário) |
| `package-lock.json` | Lockfile NPM |
| `package.json` | Dependências e scripts |
| `bundle-analyzer.config.js` | Análise de bundle |
| `commitlint.config.js` | Regras de commit (Conventional Commits) |
| `components.json` | Configuração shadcn/ui |
| `coverage.config.js` | Configuração de cobertura de testes |
| `index.html` | HTML principal da aplicação |
| `lighthouserc.js` | Configuração Lighthouse CI |
| `lint-staged.config.js` | Configuração lint-staged |
| `netlify.toml` | Configuração deploy Netlify |
| `nginx.conf` | Configuração Nginx |
| `performance-budget.json` | Budget de performance |
| `playwright.config.ts` | Configuração Playwright (E2E) |
| `postcss.config.js` | Configuração PostCSS |
| `sentry.client.config.ts` | Configuração Sentry (monitoramento) |
| `sonar-project.properties` | Configuração SonarQube |
| `tailwind.config.ts` | Configuração Tailwind CSS |
| `tsconfig.json` | Configuração TypeScript principal |
| `tsconfig.app.json` | Configuração TypeScript para app |
| `tsconfig.node.json` | Configuração TypeScript para Node |
| `vite.config.ts` | Configuração Vite |
| `vitest.config.ts` | Configuração Vitest |
| `Dockerfile` | Definição de imagem Docker |
| `docker-compose.yml` | Orquestração Docker |

### Documentação na Raiz

| Arquivo | Descrição |
|---------|-----------|
| `AUDIT_REPORT.md` | Relatório de auditoria |
| `BUILD_FIXES.md` | Correções de build |
| `CHANGELOG.md` | Log de mudanças |
| `CHANGELOG_BUILD.md` | Changelog específico de builds |
| `CODE_OF_CONDUCT.md` | Código de conduta |
| `CONTRIBUTING.md` | Guia de contribuição |
| `CORRECTIONS_SUMMARY.md` | Resumo de correções |
| `DEPLOY.md` | Guia de deploy |
| `DEPLOYMENT_GUIDE.md` | Guia detalhado de deployment |
| `FINAL_AUDIT_REPORT.md` | Relatório final de auditoria |
| `FIXES_SUMMARY.md` | Resumo de fixes |
| `GIT_WORKFLOW.md` | Workflow Git |
| `README.md` | Documentação principal |
| `SECURITY.md` | Política de segurança |
| `SUPABASE_FIX.md` | Correções Supabase |

---

## 🔄 GITHUB (CI/CD)

### `.github/workflows/` (13 workflows)

| Workflow | Descrição |
|----------|-----------|
| `ci.yml` | Integração contínua principal |
| `codeql.yml` | Análise de segurança CodeQL |
| `deploy.yml` | Deploy automático |
| `docker.yml` | Build e push Docker |
| `lighthouse.yml` | Testes de performance Lighthouse |
| `notification-cron.yml` | Cron para notificações |
| `performance.yml` | Testes de performance |
| `release.yml` | Automação de releases |
| `security.yml` | Verificações de segurança |
| `storybook.yml` | Deploy Storybook |
| `test.yml` | Testes unitários |
| `tests.yml` | Suite completa de testes |
| `vercel.yml` | Deploy Vercel |

### `.github/`

| Arquivo | Descrição |
|---------|-----------|
| `dependabot.yml` | Configuração Dependabot |

### `.husky/` (Git Hooks)

| Hook | Descrição |
|------|-----------|
| `commit-msg` | Validação de mensagem de commit |
| `pre-commit` | Executa antes do commit |
| `pre-push` | Executa antes do push |

### `.storybook/`

| Arquivo | Descrição |
|---------|-----------|
| `main.ts` | Configuração principal Storybook |
| `preview.ts` | Preview do Storybook |

---

## 📚 DOCUMENTAÇÃO

### `docs/` (50+ arquivos)

#### Subpasta `crud-improvements/`

| Arquivo | Descrição |
|---------|-----------|
| `CHECKLIST_EXECUTIVO.md` | Checklist executivo |
| `DASHBOARD_TRACKING.md` | Tracking do dashboard |
| `EXEMPLO_INTEGRACAO_FINANCE_HUB.md` | Exemplo integração Finance Hub |
| `IMPLEMENTACAO_TOTAL_16_SISTEMAS.md` | Implementação dos 16 sistemas |
| `PECULIARIDADES_16_SISTEMAS.md` | Peculiaridades dos sistemas |
| `README.md` | README do CRUD |
| `README_EXECUCAO_FINAL.md` | Execução final |
| `TROUBLESHOOTING.md` | Solução de problemas |

#### Documentação Principal

| Arquivo | Descrição |
|---------|-----------|
| `01_CREATE_ORGANIZATION.md` | Criação de organização (EN) |
| `01_CRIAR_PRIMEIRA_ORGANIZATION.md` | Criação de organização (PT) |
| `02_FRONTEND_INTEGRATION.md` | Integração frontend (EN) |
| `02_INTEGRACAO_FRONTEND_REACT.md` | Integração frontend (PT) |
| `03_ARQUITETURA_DO_SISTEMA.md` | Arquitetura (PT) |
| `03_SYSTEM_ARCHITECTURE.md` | Arquitetura (EN) |
| `04_EXPLICACAO_DAS_POLICIES.md` | Políticas RLS (PT) |
| `04_POLICIES_EXPLAINED.md` | Políticas RLS (EN) |
| `05_NEXT_STEPS.md` | Próximos passos (EN) |
| `05_ROADMAP_PROXIMOS_PASSOS.md` | Roadmap (PT) |
| `ACCESSIBILITY.md` | Acessibilidade |
| `ANALISE_EXAUSTIVA_GIFTS_STORE.md` | Análise completa do projeto |
| `API.md` | Documentação da API |
| `BUNDLE_ANALYSIS.md` | Análise de bundle |
| `BUNDLE_ANALYZER_SETUP.md` | Setup do analisador |
| `CONFIGURACAO_LOCALE_PT_BR.md` | Configuração locale PT-BR |
| `DARK_MODE.md` | Modo escuro |
| `DEPLOYMENT.md` | Deployment |
| `DIAGRAMAS_PROCESSOS_GIFTS_STORE.md` | Diagramas de processos |
| `EXCEL_INTEGRATION_GUIDE.md` | Guia integração Excel |
| `FORM_VALIDATION.md` | Validação de formulários |
| `FUNCIONALIDADES_E_FERRAMENTAS.md` | Funcionalidades |
| `HOOKS_USAGE_GUIDE.md` | Guia de uso dos hooks |
| `INVENTARIO_COMPLETO_PROJETO.md` | Inventário anterior |
| `MELHORIAS_PENDENTES_PLANO_IMPLEMENTACAO.md` | Melhorias pendentes |
| `MELHORIAS_RESTANTES.md` | Melhorias restantes |
| `MELHORIAS_SUPABASE_AI.md` | Melhorias Supabase AI |
| `MIGRATION_GUIDE.md` | Guia de migração |
| `MOBILE.md` | Mobile |
| `NOTIFICATION_SYSTEM.md` | Sistema de notificações |
| `PERFORMANCE.md` | Performance |
| `PLANO_EXAUSTIVO_MELHORIAS.md` | Plano de melhorias |
| `POLITICA_IDIOMA_PT_BR.md` | Política de idioma |
| `PRODUCT_DESIGN_STRATEGY_IMPROVEMENTS.md` | Estratégia de design |
| `PROXIMOS_PASSOS.md` | Próximos passos |
| `README.md` | README da documentação |
| `README_NO_GAMIFICATION.md` | README sem gamificação |
| `RELATORIO_ERROS_BUGS_ANOMALIAS.md` | Relatório de bugs |
| `SECURITY.md` | Segurança |
| `TESTING.md` | Testes |
| `api.md` | API (lowercase) |
| `architecture.md` | Arquitetura |
| `code-style.md` | Estilo de código |
| `commits.md` | Commits |
| `deployment.md` | Deployment (lowercase) |
| `faq.md` | FAQ |
| `performance.md` | Performance (lowercase) |
| `security-policy.md` | Política de segurança |
| `testing.md` | Testes (lowercase) |
| `troubleshooting.md` | Troubleshooting |
| `workflows.md` | Workflows |

---

## 🗃️ SUPABASE (Backend)

### `supabase/functions/` (20 Edge Functions)

| Função | Descrição |
|--------|-----------|
| `_shared/rate-limiter.ts` | Rate limiter compartilhado |
| `ai-recommendations/index.ts` | Recomendações por IA |
| `bitrix-sync/index.ts` | Sincronização Bitrix24 |
| `cleanup-notifications/index.ts` | Limpeza de notificações |
| `detect-new-device/index.ts` | Detecção de novo dispositivo |
| `dropbox-list/index.ts` | Listagem Dropbox |
| `expert-chat/index.ts` | Chat com especialista (IA) |
| `generate-mockup/index.ts` | Geração de mockups |
| `generate-mockup-nanobanana/index.ts` | Mockups NanoBanana |
| `process-queue/index.ts` | Processamento de fila |
| `product-webhook/index.ts` | Webhook de produtos |
| `quote-approval/index.ts` | Aprovação de cotações |
| `quote-sync/index.ts` | Sincronização de cotações |
| `rate-limit-check/index.ts` | Verificação de rate limit |
| `semantic-search/index.ts` | Busca semântica |
| `send-digest/index.ts` | Envio de digest |
| `send-notification/index.ts` | Envio de notificações |
| `verify-email/index.ts` | Verificação de email |
| `visual-search/index.ts` | Busca visual |
| `webhook-dispatcher/index.ts` | Dispatcher de webhooks |

### `supabase/cron/`

| Arquivo | Descrição |
|---------|-----------|
| `cron-config.sql` | Configuração de cron jobs |

### `supabase/migrations/`

Contém todas as migrações do banco de dados (gerenciado automaticamente).

---

## 🧪 TESTES

### Estrutura de Testes (130+ arquivos)

```
tests/
├── components/
│   ├── admin/ (23 testes)
│   ├── clients/ (9 testes)
│   ├── products/ (13 testes)
│   ├── quotes/ (16 testes)
│   ├── ui/ (20 testes)
│   └── [10 testes raiz]
├── e2e/ (10 testes)
├── features/ (5 testes)
├── fixtures/ (4 arquivos)
├── hooks/ (45 testes)
├── integration/ (5 testes)
├── lib/ (5 testes)
├── mocks/ (2 arquivos)
├── services/ (10 testes)
├── setup.ts
└── test-utils.tsx
```

### `tests/components/admin/` (23 arquivos)

- AIRecommendations.test.tsx
- ActivityLog.test.tsx
- AuditLogViewer.test.tsx
- CategoryManager.test.tsx
- DashboardStats.test.tsx
- GroupPersonalizationManager.test.tsx
- ImageUploadButton.test.tsx
- NotificationCenter.test.tsx
- OrderManager.test.tsx
- PermissionManager.test.tsx
- PriceManager.test.tsx
- ProductCard.test.tsx
- ProductGroupsManager.test.tsx
- ProductImportCSV.test.tsx
- ReportBuilder.test.tsx
- ReportExport.test.tsx
- ReportManager.test.tsx
- SettingsPanel.test.tsx
- SortableItem.test.tsx
- StockManager.test.tsx
- SupplierManager.test.tsx
- TechniquesManager.test.tsx
- UserManager.test.tsx

### `tests/components/clients/` (9 arquivos)

- ClientAnalytics.test.tsx
- ClientCard.test.tsx
- ClientCommunication.test.tsx
- ClientDetails.test.tsx
- ClientDocuments.test.tsx
- ClientForm.test.tsx
- ClientNotes.test.tsx
- ClientPurchaseHistory.test.tsx
- ClientStats.test.tsx

### `tests/components/products/` (13 arquivos)

- ProductCard.test.tsx
- ProductCategories.test.tsx
- ProductDetails.test.tsx
- ProductFilters.test.tsx
- ProductGrid.test.tsx
- ProductImages.test.tsx
- ProductList.test.tsx
- ProductPrice.test.tsx
- ProductReviews.test.tsx
- ProductSearch.test.tsx
- ProductSort.test.tsx
- ProductSpecs.test.tsx
- ProductStock.test.tsx

### `tests/components/quotes/` (16 arquivos)

- QuoteActions.test.tsx
- QuoteApproval.test.tsx
- QuoteCard.test.tsx
- QuoteDetails.test.tsx
- QuoteEmail.test.tsx
- QuoteExport.test.tsx
- QuoteFilters.test.tsx
- QuoteForm.test.tsx
- QuoteItems.test.tsx
- QuoteList.test.tsx
- QuotePDF.test.tsx
- QuoteRevision.test.tsx
- QuoteSearch.test.tsx
- QuoteStatus.test.tsx
- QuoteTimeline.test.tsx
- QuoteTotal.test.tsx

### `tests/components/ui/` (20 arquivos)

- Alert.test.tsx
- Avatar.test.tsx
- Badge.test.tsx
- Button.test.tsx
- Card.test.tsx
- Checkbox.test.tsx
- Dialog.test.tsx
- Dropdown.test.tsx
- Input.test.tsx
- Modal.test.tsx
- Progress.test.tsx
- Radio.test.tsx
- Select.test.tsx
- Skeleton.test.tsx
- Slider.test.tsx
- Switch.test.tsx
- Table.test.tsx
- Tabs.test.tsx
- Toast.test.tsx
- Tooltip.test.tsx

### `tests/e2e/` (10 arquivos)

- bitrix-sync.spec.ts
- bulk-operations.spec.ts
- client-management.spec.ts
- comments-history.spec.ts
- excel-export.spec.ts
- mobile-responsive.spec.ts
- product-search.spec.ts
- quote-approval.spec.ts
- quote-creation.spec.ts
- template-management.spec.ts

### `tests/hooks/` (45 arquivos)

- useAIRecommendations.test.ts
- useBIMetrics.test.ts
- useBitrixSyncAsync.test.ts
- useBulkDelete.test.ts
- useBulkExport.test.ts
- useBulkImport.test.ts
- useBulkSelection.test.ts
- useClickOutside.test.ts
- useCollections.test.ts
- useComparison.test.ts
- useConfirmDialog.test.ts
- useContextualSuggestions.test.ts
- useDebounce.test.ts
- useDebouncedSearch.test.ts
- useErrorHandler.test.ts
- useExpertConversations.test.ts
- useFavorites.test.ts
- useFollowUpReminders.test.ts
- useGamification.test.ts
- useIntersectionObserver.test.ts
- useInterval.test.ts
- useKeyPress.test.ts
- useKeyboardShortcuts.test.ts
- useLocalStorage.test.ts
- useMediaQuery.test.ts
- useNotifications.test.ts
- useOnboarding.test.ts
- useOrders.test.ts
- usePrefetch.test.ts
- usePrevious.test.ts
- usePriceHistory.test.ts
- useProductAnalytics.test.ts
- useQuoteTemplates.test.ts
- useQuoteVersions.test.ts
- useRFMAnalysis.test.ts
- useRewardsStore.test.ts
- useSalesGoals.test.ts
- useScrollPosition.test.ts
- useSessionStorage.test.ts
- useSpeechRecognition.test.ts
- useSupplierComparison.test.ts
- useTimeout.test.ts
- useToggle.test.ts
- useVoiceCommands.test.ts
- useWindowSize.test.ts

---

## 📱 CÓDIGO FONTE (src)

### Estrutura Principal

```
src/
├── components/ (35 pastas, 180+ componentes)
├── contexts/ (8 contexts)
├── data/ (1 arquivo)
├── features/ (7 pastas)
├── hooks/ (78 hooks)
├── i18n/ (4 arquivos)
├── integrations/ (11 integrações)
├── lib/ (28 pastas, 50+ arquivos)
├── middleware/ (6 arquivos)
├── pages/ (41 páginas)
├── services/ (4 serviços)
├── stores/ (3 stores)
├── styles/ (2 arquivos)
├── templates/ (2 arquivos)
├── test/ (1 arquivo)
├── types/ (1 arquivo)
├── utils/ (6 arquivos)
├── App.css
├── App.tsx
├── index.css
├── main.tsx
├── tailwind.config.lov.json
└── vite-env.d.ts
```

### `src/components/` (35 pastas)

#### `admin/` (13 componentes)

- AdminRealtimeNotifications.tsx
- AuditLogViewer.tsx
- DropboxMediaBrowser.tsx
- GroupPersonalizationManager.tsx
- ImageUploadButton.tsx
- InlineEditField.tsx
- PasswordResetApproval.tsx
- ProductGroupsManager.tsx
- ProductImportCSV.tsx
- ProductPersonalizationManager.tsx
- ProductsManager.tsx
- SortableItem.tsx
- TechniquesManager.tsx

#### `ai/` (4 componentes)

- AIChat.tsx
- AIRecommendationsPanel.tsx
- ProductRecommendations.tsx
- index.ts

#### `auth/` (12 componentes)

- CaptchaWidget.tsx
- ForgotPasswordForm.tsx
- KnownDevicesManager.tsx
- MFAEnroll.tsx
- MFASettings.tsx
- MFAVerify.tsx
- PasskeyLogin.tsx
- PasswordStrengthIndicator.tsx
- PermissionGate.tsx
- PermissionMatrix.tsx
- ProtectedRoute.tsx
- ReauthenticationDialog.tsx

#### `clients/` (8 componentes)

- ClientCardSkeleton.tsx
- ClientColorPreferences.tsx
- ClientFilterModal.tsx
- ClientInteractionsTimeline.tsx
- ClientPurchaseHistory.tsx
- ClientRFMSegmentation.tsx
- ClientRecommendedProducts.tsx
- ClientStats.tsx

#### `collections/` (1 componente)

- AddToCollectionModal.tsx

#### `common/` (12 componentes)

- BulkActionsBar.tsx
- ConfirmDialog.tsx
- EmptyState.tsx
- ErrorBoundary.tsx
- ErrorState.tsx
- LazyImage.tsx
- LoadingSpinner.tsx
- LoadingState.tsx
- SkipToContent.tsx
- Spotlight.tsx
- StatusBadge.tsx
- TableSkeleton.tsx

#### `compare/` (3 componentes)

- CompareBar.tsx
- SupplierComparisonModal.tsx
- SyncedZoomGallery.tsx

#### `comparison/` (2 componentes)

- ComparisonTable.tsx
- index.ts

#### `effects/` (5 componentes)

- FloatingReward.tsx
- MiniConfetti.tsx
- PageTransition.tsx
- SuccessCelebration.tsx
- index.ts

#### `errors/` (3 componentes)

- EnhancedErrorBoundary.tsx
- ErrorBoundary.tsx
- index.ts

#### `expert/` (2 componentes)

- ExpertChatButton.tsx
- ExpertChatDialog.tsx

#### `export/` (2 componentes)

- ExportExcelButton.tsx
- ExportQuote.tsx

#### `feedback/` (2 componentes)

- HeartAnimation.tsx
- SuccessAnimation.tsx

#### `filters/` (5 componentes)

- FilterPanel.tsx
- FilterPresets.ts
- PresetManager.tsx
- QuickFiltersBar.tsx
- SavedFiltersDropdown.tsx

#### `gamification/` (3 componentes)

- MyRewards.tsx
- RewardsStore.tsx
- SellerLeaderboard.tsx

#### `goals/` (1 componente)

- SalesGoalsCard.tsx

#### `inventory/` (1 componente)

- StockAlertsIndicator.tsx

#### `layout/` (6 componentes)

- GamificationIndicators.tsx
- Header.tsx
- HeaderActionsMenu.tsx
- MainLayout.tsx
- ProtectedRoute.tsx
- Sidebar.tsx

#### `mockup/` (3 componentes)

- LogoPositionEditor.tsx
- MultiAreaManager.tsx
- TemplatePreview.tsx

#### `notifications/` (1 componente)

- NotificationsPopover.tsx

#### `onboarding/` (3 componentes)

- OnboardingChecklist.tsx
- OnboardingTour.tsx
- RestartTourButton.tsx

#### `products/` (22 componentes)

- KitComposition.tsx
- PresentationMode.tsx
- PriceHistoryChart.tsx
- ProductCard.tsx
- ProductCardSkeleton.tsx
- ProductCustomizationOptions.tsx
- ProductGallery.tsx
- ProductGrid.tsx
- ProductList.stories.tsx
- ProductList.tsx
- ProductListItem.tsx
- ProductListItemSkeleton.tsx
- ProductPersonalizationRules.tsx
- ProductPrice.stories.tsx
- ProductReviews.stories.tsx
- ProductSearch.stories.tsx
- ProductStock.stories.tsx
- ProductVariations.tsx
- RelatedProducts.tsx
- ShareActions.tsx
- SwipeableProductCard.tsx
- VirtualizedProductGrid.tsx

#### `produtos/` (1 componente)

- ProdutosGiftToolbar.tsx

#### `quotes/` (30 componentes)

- AddToQuoteButton.tsx
- AdminTemplatesManager.tsx
- ProposalGeneratorButton.tsx
- QuickQuote.tsx
- QuoteActions.stories.tsx
- QuoteApproval.stories.tsx
- QuoteBuilder.tsx
- QuoteCard.stories.tsx
- QuoteCardSkeleton.tsx
- QuoteClientSelector.tsx
- QuoteComments.tsx
- QuoteDetails.stories.tsx
- QuoteForm.stories.tsx
- QuoteHistoryPanel.tsx
- QuoteItems.stories.tsx
- QuoteItemsList.tsx
- QuoteKanbanBoard.tsx
- QuoteList.stories.tsx
- QuotePersonalizationSelector.tsx
- QuoteProductSelector.tsx
- QuoteQRCode.tsx
- QuoteStatus.stories.tsx
- QuoteSummary.tsx
- QuoteTemplateForm.tsx
- QuoteTemplateSelector.tsx
- QuoteTemplatesList.tsx
- QuoteTimeline.stories.tsx
- QuoteTotal.stories.tsx
- QuoteVersionHistory.tsx
- SaveAsTemplateButton.tsx
- TagManager.tsx

#### `reminders/` (2 componentes)

- FollowUpRemindersPopover.tsx
- GoogleCalendarSync.tsx

#### `search/` (4 componentes)

- AdvancedSearch.tsx
- GlobalSearchPalette.tsx
- VisualSearchButton.tsx
- VoiceSearchOverlay.tsx

#### `security/` (7 componentes)

- GeoBlockingManager.tsx
- IPRestrictionManager.tsx
- PasskeyManager.tsx
- PushNotificationSettings.tsx
- SecurityDashboard.tsx
- SecuritySettings.tsx
- TwoFactorSetup.tsx

#### `shared/` (9 componentes)

- AdvancedFilters.tsx
- AuditTimeline.tsx
- BulkActionsToolbar.tsx
- EmptyState.tsx
- ErrorMessage.tsx
- ExportButton.tsx
- ImportDialog.tsx
- LoadingSkeleton.tsx
- TrashView.tsx

#### `theme/` (1 componente)

- ThemeToggle.tsx

#### `ui/` (78 componentes)

**Componentes shadcn/ui:**
- accordion.tsx
- alert-dialog.tsx
- alert.tsx
- aspect-ratio.tsx
- avatar.tsx
- badge.tsx
- breadcrumb.tsx
- button.tsx
- calendar.tsx
- card.tsx
- carousel.tsx
- chart.tsx
- checkbox.tsx
- collapsible.tsx
- command.tsx
- context-menu.tsx
- dialog.tsx
- drawer.tsx
- dropdown-menu.tsx
- form.tsx
- hover-card.tsx
- input-otp.tsx
- input.tsx
- label.tsx
- menubar.tsx
- navigation-menu.tsx
- pagination.tsx
- popover.tsx
- progress.tsx
- radio-group.tsx
- resizable.tsx
- scroll-area.tsx
- select.tsx
- separator.tsx
- sheet.tsx
- sidebar.tsx
- skeleton.tsx
- slider.tsx
- sonner.tsx
- switch.tsx
- table.tsx
- tabs.tsx
- textarea.tsx
- toast.tsx
- toaster.tsx
- toggle-group.tsx
- toggle.tsx
- tooltip.tsx

**Componentes customizados:**
- AnnouncementBanner.tsx
- EmptyState.tsx
- LoadingSpinner.tsx
- LoadingState.tsx
- NewFeatureBadge.tsx
- TableSkeleton.tsx
- VirtualizedList.tsx
- sound-wave-indicator.tsx
- stat-card.tsx
- use-toast.ts

**Stories (Storybook):**
- Alert.stories.tsx
- Avatar.stories.tsx
- Badge.stories.tsx
- Button.stories.tsx
- Card.stories.tsx
- Checkbox.stories.tsx
- Dialog.stories.tsx
- Dropdown.stories.tsx
- Form.stories.tsx
- Input.stories.tsx
- Modal.stories.tsx
- Progress.stories.tsx
- Radio.stories.tsx
- Select.stories.tsx
- Skeleton.stories.tsx
- Slider.stories.tsx
- Switch.stories.tsx
- Table.stories.tsx
- Tabs.stories.tsx
- Toast.stories.tsx
- Tooltip.stories.tsx

#### `virtualized/` (2 componentes)

- VirtualGrid.tsx
- VirtualList.tsx

#### `voice/` (2 componentes)

- EnhancedVoiceSearch.tsx
- index.ts

#### Componentes na Raiz (14 arquivos)

- BulkActionsBar.tsx
- DataImporter.tsx
- DuplicateButton.tsx
- ErrorBoundary.tsx
- ExportDropdown.tsx
- InfiniteScrollList.tsx
- LazyImage.tsx
- LoadingScreen.tsx
- NavLink.tsx
- NotificationCenter.tsx
- NotificationPreferences.tsx
- SavedFiltersDropdown.tsx
- SearchInput.tsx
- VersionHistory.tsx

---

### `src/contexts/` (8 contexts)

| Context | Descrição |
|---------|-----------|
| AuthContext.tsx | Autenticação e sessão |
| CollectionsContext.tsx | Gestão de coleções |
| ComparisonContext.tsx | Comparação de produtos |
| FavoritesContext.tsx | Produtos favoritos |
| GamificationContext.tsx | Sistema de gamificação |
| ProductsContext.tsx | Gestão de produtos |
| QuickQuoteContext.tsx | Cotação rápida |
| ThemeContext.tsx | Tema (claro/escuro) |

---

### `src/hooks/` (78 hooks)

| Hook | Descrição |
|------|-----------|
| use-mobile.tsx | Detecção de dispositivo móvel |
| use-toast.ts | Sistema de toast |
| use2FA.ts | Autenticação 2FA |
| useAIRecommendations.ts | Recomendações IA |
| useAllowedIPs.ts | IPs permitidos |
| useAuditTrail.ts | Trilha de auditoria |
| useBIMetrics.ts | Métricas BI |
| useBitrixSync.ts | Sync Bitrix (síncrono) |
| useBitrixSyncAsync.ts | Sync Bitrix (assíncrono) |
| useBulkActions.ts | Ações em lote |
| useBulkActions.tsx | Ações em lote (TSX) |
| useBulkSelection.ts | Seleção em lote |
| useCRUD.ts | Operações CRUD |
| useCaptcha.ts | Captcha |
| useCategories.ts | Categorias |
| useClientMutations.ts | Mutações de clientes |
| useClients.ts | Dados de clientes |
| useCollections.ts | Coleções |
| useColors.ts | Cores |
| useComparison.ts | Comparação |
| useConfirmDialog.ts | Diálogo de confirmação |
| useContextualSuggestions.ts | Sugestões contextuais |
| useDebounce.ts | Debounce |
| useDebouncedSearch.ts | Busca com debounce |
| useDeviceDetection.ts | Detecção de dispositivo |
| useDuplicate.ts | Duplicação |
| useErrorHandler.ts | Tratamento de erros |
| useExpertConversations.tsx | Conversas com expert |
| useExport.tsx | Exportação |
| useExportData.tsx | Exportação de dados |
| useFavorites.ts | Favoritos |
| useFollowUpReminders.ts | Lembretes de follow-up |
| useGamification.ts | Gamificação |
| useGeoBlocking.ts | Bloqueio geográfico |
| useGiftsData.ts | Dados de gifts |
| useIPValidation.ts | Validação de IP |
| useImport.tsx | Importação |
| useImportData.tsx | Importação de dados |
| useInfiniteScroll.ts | Scroll infinito |
| useKeyboardShortcuts.ts | Atalhos de teclado |
| useNotifications.ts | Notificações |
| useOnboarding.ts | Onboarding |
| useOptimisticFavorites.ts | Favoritos otimistas |
| useOrders.ts | Pedidos |
| usePasswordBreachCheck.tsx | Verificação de breach |
| usePasswordResetRealtimeNotifications.ts | Reset de senha realtime |
| usePasswordResetRequests.ts | Requisições de reset |
| usePerformanceMonitor.tsx | Monitor de performance |
| usePrefetch.ts | Prefetch |
| usePriceHistory.ts | Histórico de preços |
| useProductAnalytics.ts | Analytics de produtos |
| useProductMutations.ts | Mutações de produtos |
| useProducts.ts | Dados de produtos |
| useProductsPaginated.ts | Produtos paginados |
| usePushNotifications.tsx | Push notifications |
| useQuoteApproval.ts | Aprovação de cotação |
| useQuoteComments.ts | Comentários de cotação |
| useQuoteHistory.ts | Histórico de cotação |
| useQuoteTemplates.ts | Templates de cotação |
| useQuoteVersions.ts | Versões de cotação |
| useQuotes.ts | Cotações |
| useRBAC.tsx | Controle de acesso |
| useRFMAnalysis.tsx | Análise RFM |
| useRateLimitCheck.ts | Verificação de rate limit |
| useReauthentication.ts | Reautenticação |
| useRewardsStore.ts | Loja de recompensas |
| useSalesGoals.ts | Metas de vendas |
| useSavedFilters.ts | Filtros salvos |
| useSearch.ts | Busca |
| useSessionManager.ts | Gerenciador de sessão |
| useSmartConfirm.ts | Confirmação inteligente |
| useSoftDelete.ts | Exclusão suave |
| useSpeechRecognition.ts | Reconhecimento de voz |
| useSupplierComparison.ts | Comparação de fornecedores |
| useSupplierMutations.ts | Mutações de fornecedores |
| useSuppliers.ts | Fornecedores |
| useVersions.ts | Versões |
| useVoiceCommandHistory.ts | Histórico de comandos de voz |
| useVoiceCommands.ts | Comandos de voz |
| useVoiceFeedback.ts | Feedback de voz |
| useWebAuthn.ts | WebAuthn |

---

### `src/pages/` (41 páginas)

| Página | Descrição |
|--------|-----------|
| AdminPanel.tsx | Painel administrativo |
| AdminPersonalizationPage.tsx | Personalização admin |
| Auth.tsx | Autenticação |
| BIDashboard.tsx | Dashboard BI |
| BitrixSyncPage.tsx | Sync Bitrix v1 |
| BitrixSyncPageV2.tsx | Sync Bitrix v2 |
| ClientDetail.tsx | Detalhe do cliente |
| ClientList.tsx | Lista de clientes |
| CollectionDetailPage.tsx | Detalhe de coleção |
| CollectionsPage.tsx | Coleções |
| ComparePage.tsx | Comparação |
| CustomizableDashboard.tsx | Dashboard customizável |
| FavoritesPage.tsx | Favoritos |
| FiltersPage.tsx | Filtros |
| Index.tsx | Página inicial |
| MagicUp.tsx | MagicUp |
| MockupGenerator.tsx | Gerador de mockups |
| NotFound.tsx | 404 |
| NotFoundPage.tsx | 404 (alternativo) |
| OrderDetailPage.tsx | Detalhe do pedido |
| OrdersListPage.tsx | Lista de pedidos |
| PermissionsPage.tsx | Permissões |
| PersonalizationSimulator.tsx | Simulador de personalização |
| ProductDetail.tsx | Detalhe do produto |
| ProfilePage.tsx | Perfil do usuário |
| PublicQuoteApproval.tsx | Aprovação pública |
| QuoteBuilderPage.tsx | Construtor de cotação |
| QuoteTemplatesPage.tsx | Templates de cotação |
| QuoteViewPage.tsx | Visualização de cotação |
| QuotesDashboardPage.tsx | Dashboard de cotações |
| QuotesKanbanPage.tsx | Kanban de cotações |
| QuotesListPage.tsx | Lista de cotações |
| RateLimitDashboardPage.tsx | Dashboard rate limit |
| ResetPassword.tsx | Reset de senha |
| RewardsStorePage.tsx | Loja de recompensas |
| RolePermissionsPage.tsx | Permissões por role |
| RolesPage.tsx | Roles |
| SSOCallbackPage.tsx | Callback SSO |
| Security.tsx | Segurança |
| SystemStatusPage.tsx | Status do sistema |
| TrendsPage.tsx | Tendências |

---

### `src/lib/` (28 pastas, 50+ arquivos)

#### `a11y/` (Acessibilidade)
- focus-trap.ts
- screen-reader.ts

#### `analytics/` (Analytics)
- event-tracker.ts
- user-behavior.ts

#### `animations/` (Animações)
- spring.ts
- transitions.ts

#### `auth/` (Autenticação)
- jwt.ts
- lockout.ts
- password-policy.ts
- session-manager.ts
- token-refresh.ts

#### `automation/` (Automação)
- rule-engine.ts

#### `cache/` (Cache)
- index.ts
- redis.ts

#### `crypto/` (Criptografia)
- encryption.ts
- hashing.ts

#### `experiments/` (Experimentos)
- ab-testing.ts
- feature-flags.ts

#### `export/` (Exportação)
- csv-exporter.ts
- pdf-report.ts

#### `gestures/` (Gestos)
- pinch-zoom.ts
- swipe.ts

#### `i18n/` (Internacionalização)
- currency-formatter.ts
- date-formatter.ts
- number-formatter.ts
- timezone.ts

#### `images/` (Imagens)
- optimizer.ts
- thumbnails.ts

#### `logging/` (Logging)
- logger.ts

#### `monitoring/` (Monitoramento)
- apm.ts
- sentry.ts

#### `network/` (Rede)
- detector.ts

#### `notifications/` (Notificações)
- fcm.ts
- push-manager.ts

#### `offline/` (Offline)
- cache-strategy.ts
- sync-manager.ts

#### `performance/` (Performance)
- lazy-loader.ts
- prefetch.ts
- web-vitals.ts

#### `pwa/` (PWA)
- register-sw.ts

#### `realtime/` (Realtime)
- presence.ts
- subscription-manager.ts

#### `sanitize/` (Sanitização)
- input-sanitizer.ts
- xss-protection.ts

#### `scheduler/` (Agendamento)
- cron-jobs.ts
- task-queue.ts

#### `state/` (Estado)
- hydration.ts
- persist.ts

#### `sync/` (Sincronização)
- background-sync.ts
- conflict-resolution.ts

#### `validation/` (Validação)
- schemas.ts

#### `validations/` (Validações)
- index.ts

#### `websocket/` (WebSocket)
- client.ts
- server.ts

#### Arquivos na Raiz de lib/
- api-error-handler.tsx
- aria-helpers.ts
- date-utils.ts
- giftsStoreSchemas.ts
- locale-config.ts
- notifications.ts
- onboarding-steps.ts
- runtime-validator.ts
- supabase-health-check.ts
- sw-register.ts
- theme-check.ts
- utils.ts

---

### `src/features/` (7 pastas)

#### `ai/`
- ProductRecommendationEngine.ts
- recommendations.ts

#### `analytics/`
- BIDashboard.tsx
- RFMSegmentation.ts

#### `auth/`
- BiometricAuth.ts
- MFA.tsx
- OAuth2.ts
- TwoFactorAuth.ts

#### `automation/`
- WorkflowBuilder.tsx

#### `gdpr/`
- DataDeletion.tsx
- DataExport.tsx

#### `reports/`
- InventoryReport.tsx
- SalesDashboard.tsx

#### `templates/`
- TemplateEditor.tsx
- TemplateEngine.ts

---

### `src/integrations/` (11 integrações)

#### `analytics/`
- GoogleAnalytics.ts
- Mixpanel.ts

#### `hubspot/`
- contact-sync.ts

#### `mercadopago/`
- payment.ts

#### `salesforce/`
- lead-sync.ts

#### `sap/`
- order-sync.ts

#### `sendgrid/`
- EmailService.ts
- templates.ts

#### `stripe/`
- checkout.ts

#### `supabase/`
- client.ts
- types.ts

#### `totvs/`
- stock-sync.ts

#### `whatsapp/`
- WhatsAppService.ts

#### `zapier/`
- actions.ts
- triggers.ts

---

### `src/middleware/` (6 arquivos)

| Middleware | Descrição |
|------------|-----------|
| auth-middleware.ts | Autenticação |
| cors.ts | CORS |
| csrf.ts | Proteção CSRF |
| helmet.ts | Headers de segurança |
| rate-limiter.ts | Rate limiting |
| security-headers.ts | Headers de segurança adicionais |

---

### `src/stores/` (3 stores Zustand)

| Store | Descrição |
|-------|-----------|
| auth-store.ts | Estado de autenticação |
| cart-store.ts | Carrinho de compras |
| ui-store.ts | Estado da UI |

---

### `src/services/` (4 serviços)

| Serviço | Descrição |
|---------|-----------|
| inventory.ts | Gestão de inventário |
| payment-gateway.ts | Gateway de pagamento |
| shipping.ts | Frete |
| tax-calculation.ts | Cálculo de impostos |

---

### `src/i18n/` (4 arquivos)

| Arquivo | Descrição |
|---------|-----------|
| index.ts | Configuração i18next |
| locales/en-US.json | Inglês (EUA) |
| locales/es-ES.json | Espanhol (Espanha) |
| locales/pt-BR.json | Português (Brasil) |

---

### `src/templates/email/` (2 templates)

| Template | Descrição |
|----------|-----------|
| order-confirmation.html | Confirmação de pedido |
| quote-approved.html | Cotação aprovada |

---

### `src/utils/` (6 arquivos)

| Utilitário | Descrição |
|------------|-----------|
| errorHandling.ts | Tratamento de erros |
| excelExport.ts | Exportação Excel |
| personalizationExport.ts | Exportação de personalização |
| proposalPdfGenerator.ts | Gerador de PDF de proposta |
| templateExport.ts | Exportação de templates |
| validation.ts | Validação |

---

### Outros arquivos em src/

| Arquivo | Descrição |
|---------|-----------|
| App.css | Estilos globais da app |
| App.tsx | Componente principal |
| index.css | CSS principal (Tailwind) |
| main.tsx | Entry point |
| tailwind.config.lov.json | Config Tailwind Lovable |
| vite-env.d.ts | Tipos Vite |
| data/mockData.ts | Dados de mock |
| styles/animations.css | Animações CSS |
| styles/responsive.css | CSS responsivo |
| test/setup.ts | Setup de testes |
| types/database.tsx | Tipos do banco |

---

## 📦 PACKAGES (Monorepo)

### `packages/shared-crud/`

```
migrations/
├── 001_saved_filters.sql
└── 002_entity_versions.sql

src/
├── hooks.ts
├── index.ts
└── utils.ts

package.json
README.md
tsconfig.json
```

---

## 🔧 SCRIPTS

### `scripts/` (8 scripts)

| Script | Descrição |
|--------|-----------|
| INTEGRAR_TODOS_16_SISTEMAS.sh | Integração dos 16 sistemas |
| build.sh | Build da aplicação |
| db-backup.sh | Backup do banco |
| db-seed.sh | Seed do banco |
| deploy.sh | Deploy |
| integrar_sistema.sh | Integração de sistema |
| test.sh | Execução de testes |
| verify-build.sh | Verificação de build |

---

## 📊 RESUMO QUANTITATIVO

| Categoria | Quantidade |
|-----------|------------|
| **Páginas** | 41 |
| **Componentes** | 180+ |
| **Hooks** | 78 |
| **Contexts** | 8 |
| **Edge Functions** | 20 |
| **Integrações** | 11 |
| **Testes** | 130+ |
| **Documentação** | 50+ |
| **Workflows CI/CD** | 13 |
| **Scripts** | 8 |
| **Middlewares** | 6 |
| **Stores** | 3 |
| **Serviços** | 4 |
| **Idiomas (i18n)** | 3 |

### **Total Estimado: 600+ arquivos**

---

## 🏗️ TECNOLOGIAS UTILIZADAS

### Frontend
- React 18.3.1
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Framer Motion
- TanStack Query
- Zustand
- React Router DOM
- i18next

### Backend (Supabase/Lovable Cloud)
- PostgreSQL
- Edge Functions (Deno)
- Row Level Security (RLS)
- Realtime

### Integrações
- Bitrix24
- Stripe
- MercadoPago
- SendGrid
- WhatsApp
- HubSpot
- Salesforce
- SAP
- TOTVS
- Zapier
- Google Analytics
- Mixpanel

### DevOps
- GitHub Actions
- Docker
- Vercel
- Netlify
- Sentry
- SonarQube
- Lighthouse CI

### Testes
- Vitest
- Playwright
- Testing Library

---

## 📝 NOTAS

1. Este inventário foi gerado automaticamente a partir da análise do repositório.
2. O projeto é desenvolvido em parceria entre Claude (Anthropic) e Lovable.
3. Alguns arquivos podem ter sido adicionados diretamente ao repositório GitHub.
4. **ATENÇÃO:** Não excluir nenhum arquivo sem autorização explícita.

---

*Última atualização: 06 de Janeiro de 2026*
