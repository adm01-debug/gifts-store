# 📦 INVENTÁRIO EXAUSTIVO DO PROJETO GIFTS STORE

**Data da Análise:** 30/12/2024  
**Analisado por:** Claude (Anthropic) via Lovable  
**Tipo:** Projeto React + Vite + TypeScript + Supabase (Lovable Cloud)

---

## 🏗️ ESTRUTURA GERAL DO PROJETO

```
gifts-store/
├── .github/                    # Configurações GitHub (CI/CD, templates)
├── .husky/                     # Git hooks (pre-commit, etc)
├── .storybook/                 # Configuração Storybook (não instalado)
├── docs/                       # Documentação do projeto
├── e2e/                        # Testes end-to-end
├── node_modules/               # Dependências
├── public/                     # Assets estáticos
├── scripts/                    # Scripts de build/deploy
├── src/                        # Código fonte principal
├── supabase/                   # Backend (Edge Functions + Migrations)
└── tests/                      # Testes unitários
```

---

## 📁 ESTRUTURA src/ DETALHADA

### 1. COMPONENTES (`src/components/`)

#### UI Base (`src/components/ui/`) - 78 arquivos
Componentes Shadcn/Radix customizados:
- `accordion.tsx`, `alert-dialog.tsx`, `alert.tsx`
- `avatar.tsx`, `badge.tsx`, `breadcrumb.tsx`, `button.tsx`
- `calendar.tsx`, `card.tsx`, `carousel.tsx`, `chart.tsx`
- `checkbox.tsx`, `collapsible.tsx`, `command.tsx`
- `context-menu.tsx`, `dialog.tsx`, `drawer.tsx`
- `dropdown-menu.tsx`, `form.tsx`, `hover-card.tsx`
- `input-otp.tsx`, `input.tsx`, `label.tsx`, `menubar.tsx`
- `navigation-menu.tsx`, `pagination.tsx`, `popover.tsx`
- `progress.tsx`, `radio-group.tsx`, `resizable.tsx`
- `scroll-area.tsx`, `select.tsx`, `separator.tsx`
- `sheet.tsx`, `sidebar.tsx`, `skeleton.tsx`, `slider.tsx`
- `sonner.tsx`, `switch.tsx`, `table.tsx`, `tabs.tsx`
- `textarea.tsx`, `toast.tsx`, `toaster.tsx`, `toggle.tsx`
- `toggle-group.tsx`, `tooltip.tsx`
- **Customizados:** `EmptyState.tsx`, `LoadingSpinner.tsx`, `LoadingState.tsx`, `NewFeatureBadge.tsx`, `TableSkeleton.tsx`, `VirtualizedList.tsx`, `AnnouncementBanner.tsx`, `stat-card.tsx`, `sound-wave-indicator.tsx`
- **Stories (Storybook):** Vários `.stories.tsx` (dependência não instalada)

#### Produtos (`src/components/products/`) - 27 arquivos
- `ProductCard.tsx` - Card de produto
- `ProductCardSkeleton.tsx` - Skeleton loading
- `ProductGrid.tsx` - Grid de produtos
- `ProductList.tsx` - Lista de produtos
- `ProductListItem.tsx` - Item de lista
- `ProductListItemSkeleton.tsx` - Skeleton item
- `ProductGallery.tsx` - Galeria de imagens
- `ProductVariations.tsx` - Variações de cor/tamanho
- `ProductCustomizationOptions.tsx` - Opções de personalização
- `ProductPersonalizationRules.tsx` - Regras de personalização
- `PresentationMode.tsx` - Modo apresentação
- `PriceHistoryChart.tsx` - Histórico de preços
- `RelatedProducts.tsx` - Produtos relacionados
- `ShareActions.tsx` - Ações de compartilhamento
- `VirtualizedProductGrid.tsx` - Grid virtualizado
- `KitComposition.tsx` - Composição de kits
- **__tests__/** - Testes (vitest não instalado)

#### Orçamentos (`src/components/quotes/`) - 29 arquivos
- `QuoteBuilder.tsx` - Construtor de orçamentos
- `QuoteClientSelector.tsx` - Seletor de cliente
- `QuoteProductSelector.tsx` - Seletor de produtos
- `QuoteItemsList.tsx` - Lista de itens
- `QuotePersonalizationSelector.tsx` - Personalização
- `QuoteSummary.tsx` - Resumo do orçamento
- `QuoteComments.tsx` - Comentários
- `QuoteHistoryPanel.tsx` - Histórico
- `QuoteVersionHistory.tsx` - Versões
- `QuoteQRCode.tsx` - QR Code
- `QuoteKanbanBoard.tsx` - Kanban de status
- `QuoteTemplateForm.tsx` - Formulário de template
- `QuoteTemplateSelector.tsx` - Seletor de template
- `QuoteTemplatesList.tsx` - Lista de templates
- `SaveAsTemplateButton.tsx` - Salvar como template
- `AdminTemplatesManager.tsx` - Gerenciador admin
- `ProposalGeneratorButton.tsx` - Gerador de proposta
- `TagManager.tsx` - Gerenciador de tags
- `QuoteCardSkeleton.tsx` - Skeleton

#### Clientes (`src/components/clients/`) - 18 arquivos
- `ClientStats.tsx` - Estatísticas
- `ClientPurchaseHistory.tsx` - Histórico de compras
- `ClientColorPreferences.tsx` - Preferências de cor
- `ClientInteractionsTimeline.tsx` - Timeline
- `ClientRecommendedProducts.tsx` - Recomendações
- `ClientRFMSegmentation.tsx` - Segmentação RFM
- `ClientFilterModal.tsx` - Modal de filtros
- `ClientCardSkeleton.tsx` - Skeleton
- **Stories órfãos** - Componentes referenciados não existem

#### Mockup (`src/components/mockup/`) - 3 arquivos
- `LogoPositionEditor.tsx` - Editor de posição
- `MultiAreaManager.tsx` - Gerenciador multi-área
- `TemplatePreview.tsx` - Preview de template

#### Admin (`src/components/admin/`) - 9 arquivos
- `ProductPersonalizationManager.tsx` - Gerenciador de personalização
- `GroupPersonalizationManager.tsx` - Grupos
- `ProductGroupsManager.tsx` - Grupos de produtos
- `TechniquesManager.tsx` - Técnicas
- `ImageUploadButton.tsx` - Upload de imagem
- `InlineEditField.tsx` - Edição inline
- `SortableItem.tsx` - Item ordenável
- `ProductImportCSV.tsx` - Import CSV
- `AuditLogViewer.tsx` - Visualizador de logs

#### Layout (`src/components/layout/`) - 5 arquivos
- `MainLayout.tsx` - Layout principal
- `Header.tsx` - Cabeçalho
- `Sidebar.tsx` - Barra lateral
- `ProtectedRoute.tsx` - Rota protegida
- `GamificationIndicators.tsx` - Indicadores de gamificação

#### Busca (`src/components/search/`) - 4 arquivos
- `GlobalSearchPalette.tsx` - Paleta de busca global (Cmd+K)
- `AdvancedSearch.tsx` - Busca avançada
- `VoiceSearchOverlay.tsx` - Busca por voz
- `VisualSearchButton.tsx` - Busca visual

#### Filtros (`src/components/filters/`) - 5 arquivos
- `FilterPanel.tsx` - Painel de filtros
- `QuickFiltersBar.tsx` - Barra rápida
- `SavedFiltersDropdown.tsx` - Filtros salvos
- `PresetManager.tsx` - Gerenciador de presets
- `FilterPresets.ts` - Presets padrão

#### AI (`src/components/ai/`) - 2 arquivos
- `AIChat.tsx` - Chat com IA
- `AIRecommendationsPanel.tsx` - Painel de recomendações

#### Expert (`src/components/expert/`) - 2 arquivos
- `ExpertChatButton.tsx` - Botão do chat expert
- `ExpertChatDialog.tsx` - Dialog do chat

#### Gamificação (`src/components/gamification/`) - 3 arquivos
- `RewardsStore.tsx` - Loja de recompensas
- `MyRewards.tsx` - Minhas recompensas
- `SellerLeaderboard.tsx` - Ranking de vendedores

#### Notificações (`src/components/notifications/`) - 1 arquivo
- `NotificationsPopover.tsx` - Popover de notificações

#### Coleções (`src/components/collections/`) - 1 arquivo
- `AddToCollectionModal.tsx` - Modal adicionar à coleção

#### Comparação (`src/components/compare/`) - 3 arquivos
- `CompareBar.tsx` - Barra de comparação
- `SupplierComparisonModal.tsx` - Comparação de fornecedores
- `SyncedZoomGallery.tsx` - Galeria com zoom sincronizado

#### Onboarding (`src/components/onboarding/`) - 3 arquivos
- `OnboardingTour.tsx` - Tour guiado
- `OnboardingChecklist.tsx` - Checklist
- `RestartTourButton.tsx` - Botão reiniciar tour

#### Lembretes (`src/components/reminders/`) - 2 arquivos
- `FollowUpRemindersPopover.tsx` - Popover de follow-up
- `GoogleCalendarSync.tsx` - Sincronização Google Calendar

#### Metas (`src/components/goals/`) - 1 arquivo
- `SalesGoalsCard.tsx` - Card de metas de vendas

#### Efeitos (`src/components/effects/`) - 5 arquivos
- `FloatingReward.tsx` - Recompensa flutuante
- `MiniConfetti.tsx` - Confetti
- `SuccessCelebration.tsx` - Celebração
- `PageTransition.tsx` - Transição de página
- `index.ts` - Exports

#### Erros (`src/components/errors/`) - 4 arquivos
- `ErrorBoundary.tsx` - Boundary de erro
- `EnhancedErrorBoundary.tsx` - Boundary avançado
- `index.ts` - Exports
- **__tests__/** - Testes

#### Comum (`src/components/common/`) - 9 arquivos
- `BulkActionsBar.tsx` - Barra de ações em massa
- `ConfirmDialog.tsx` - Dialog de confirmação
- `EmptyState.tsx` - Estado vazio
- `ErrorBoundary.tsx` - Boundary
- `LazyImage.tsx` - Imagem lazy
- `LoadingSpinner.tsx` - Spinner
- `LoadingState.tsx` - Estado loading
- `StatusBadge.tsx` - Badge de status
- `TableSkeleton.tsx` - Skeleton tabela

#### Virtualizados (`src/components/virtualized/`) - 2 arquivos
- `VirtualGrid.tsx` - Grid virtualizado
- `VirtualList.tsx` - Lista virtualizada

#### Inventário (`src/components/inventory/`) - 1 arquivo
- `StockAlertsIndicator.tsx` - Indicador de alertas de estoque

#### Tema (`src/components/theme/`) - 1 arquivo
- `ThemeToggle.tsx` - Toggle dark/light mode

#### Export (`src/components/export/`) - 3 arquivos
- `ExportQuote.tsx` - Exportar orçamento
- `ExportExcelButton.tsx` - Botão exportar Excel
- **__tests__/** - Testes

---

### 2. PÁGINAS (`src/pages/`) - 32 arquivos

- `Index.tsx` - Página inicial (catálogo)
- `Auth.tsx` - Login/Cadastro
- `ProductDetail.tsx` - Detalhes do produto
- `FiltersPage.tsx` - Página de filtros
- `FavoritesPage.tsx` - Favoritos
- `ComparePage.tsx` - Comparação
- `CollectionsPage.tsx` - Coleções
- `CollectionDetailPage.tsx` - Detalhe da coleção
- `ClientList.tsx` - Lista de clientes
- `ClientDetail.tsx` - Detalhe do cliente
- `QuotesDashboardPage.tsx` - Dashboard orçamentos
- `QuotesListPage.tsx` - Lista de orçamentos
- `QuotesKanbanPage.tsx` - Kanban de orçamentos
- `QuoteBuilderPage.tsx` - Construtor de orçamento
- `QuoteViewPage.tsx` - Visualização do orçamento
- `QuoteTemplatesPage.tsx` - Templates de orçamento
- `OrdersListPage.tsx` - Lista de pedidos
- `OrderDetailPage.tsx` - Detalhe do pedido
- `AdminPanel.tsx` - Painel administrativo
- `AdminPersonalizationPage.tsx` - Admin de personalização
- `PersonalizationSimulator.tsx` - Simulador
- `MockupGenerator.tsx` - Gerador de mockups (IA)
- `ProfilePage.tsx` - Perfil do usuário
- `BitrixSyncPage.tsx` - Sincronização Bitrix24
- `BitrixSyncPageV2.tsx` - Versão 2 do sync
- `BIDashboard.tsx` - Dashboard BI
- `TrendsPage.tsx` - Tendências
- `RewardsStorePage.tsx` - Loja de recompensas
- `PublicQuoteApproval.tsx` - Aprovação pública
- `NotFound.tsx` - 404
- `NotFoundPage.tsx` - 404 alternativo
- `CustomizableDashboard.tsx` - Dashboard customizável

---

### 3. HOOKS (`src/hooks/`) - 44 arquivos

#### Dados e API
- `useQuotes.ts` - CRUD de orçamentos
- `useQuoteTemplates.ts` - Templates
- `useQuoteHistory.ts` - Histórico
- `useQuoteVersions.ts` - Versões
- `useQuoteComments.ts` - Comentários
- `useQuoteApproval.ts` - Aprovação
- `useOrders.ts` - Pedidos
- `useCollections.ts` - Coleções
- `useFavorites.ts` - Favoritos
- `useComparison.ts` - Comparação
- `useNotifications.ts` - Notificações
- `useFollowUpReminders.ts` - Lembretes
- `useSalesGoals.ts` - Metas de vendas
- `useGamification.ts` - Gamificação
- `useRewardsStore.ts` - Loja de recompensas
- `useExpertConversations.ts` - Chat expert

#### Integração
- `useBitrixSync.ts` - Sync Bitrix24
- `useBitrixSyncAsync.ts` - Sync assíncrono

#### Analytics
- `useBIMetrics.ts` - Métricas BI
- `useProductAnalytics.ts` - Analytics de produtos
- `usePriceHistory.ts` - Histórico de preços
- `useRFMAnalysis.ts` - Análise RFM

#### AI
- `useAIRecommendations.ts` - Recomendações IA
- `useContextualSuggestions.ts` - Sugestões contextuais

#### Busca
- `useSearch.ts` - Busca geral
- `useDebouncedSearch.ts` - Busca debounce

#### UX
- `use-mobile.tsx` - Detecção mobile
- `use-toast.ts` - Toast notifications
- `useDebounce.ts` - Debounce genérico
- `useBulkSelection.ts` - Seleção em massa
- `useConfirmDialog.ts` - Dialog de confirmação
- `useSmartConfirm.ts` - Confirmação inteligente
- `useKeyboardShortcuts.ts` - Atalhos de teclado
- `useOnboarding.ts` - Onboarding
- `usePrefetch.ts` - Prefetch
- `useErrorHandler.ts` - Handler de erros
- `usePerformanceMonitor.ts` - Monitor de performance
- `usePushNotifications.ts` - Push notifications
- `useSupplierComparison.ts` - Comparação fornecedores

#### Voz
- `useVoiceCommands.ts` - Comandos de voz
- `useVoiceFeedback.ts` - Feedback de voz
- `useVoiceCommandHistory.ts` - Histórico de comandos
- `useSpeechRecognition.ts` - Reconhecimento de fala

---

### 4. CONTEXTOS (`src/contexts/`) - 5 arquivos

- `AuthContext.tsx` - Autenticação
- `FavoritesContext.tsx` - Favoritos
- `ComparisonContext.tsx` - Comparação
- `CollectionsContext.tsx` - Coleções
- `ThemeContext.tsx` - Tema

---

### 5. BIBLIOTECAS (`src/lib/`) - Estrutura completa

```
src/lib/
├── __tests__/               # Testes
├── a11y/                    # Acessibilidade
├── analytics/               # Analytics
├── animations/              # Animações
├── auth/                    # Autenticação
├── automation/              # Automação
├── cache/                   # Cache
├── crypto/                  # Criptografia
├── experiments/             # Feature flags
├── export/                  # Exportação (PDF, Excel)
├── gestures/                # Gestos touch
├── i18n/                    # Internacionalização
├── images/                  # Processamento imagens
├── logging/                 # Logging
├── monitoring/              # Monitoramento
├── network/                 # Rede
├── notifications/           # Notificações
├── offline/                 # Offline support
├── performance/             # Performance
├── pwa/                     # PWA
├── realtime/                # Realtime
├── sanitize/                # Sanitização
├── scheduler/               # Agendamentos
├── state/                   # Estado
├── sync/                    # Sincronização
├── validation/              # Validações
├── validations/             # Mais validações
├── websocket/               # WebSocket
├── api-error-handler.ts     # Handler de erros API
├── aria-helpers.ts          # Helpers ARIA
├── date-utils.ts            # Utilitários de data
├── locale-config.ts         # Config de locale
├── onboarding-steps.ts      # Steps de onboarding
├── runtime-validator.ts     # Validador runtime
├── sw-register.ts           # Service Worker
├── theme-check.ts           # Verificação de tema
└── utils.ts                 # Utilitários gerais
```

---

### 6. SERVIÇOS (`src/services/`) - 4 arquivos

- `inventory.ts` - Serviço de inventário
- `payment-gateway.ts` - Gateway de pagamento
- `shipping.ts` - Cálculo de frete
- `tax-calculation.ts` - Cálculo de impostos

---

### 7. STORES (`src/stores/`) - 3 arquivos

- `auth-store.ts` - Store de autenticação
- `cart-store.ts` - Store de carrinho
- `ui-store.ts` - Store de UI

---

### 8. FEATURES (`src/features/`) - 7 pastas

- `ai/` - `recommendations.ts` - IA de recomendações
- `analytics/` - `BIDashboard.tsx` - Dashboard BI
- `auth/` - Autenticação
- `automation/` - Automação
- `gdpr/` - `DataExport.tsx` - Exportação GDPR
- `reports/` - `InventoryReport.tsx` - Relatórios
- `templates/` - Templates

---

### 9. INTEGRAÇÕES (`src/integrations/`) - 11 pastas

- `supabase/` - Supabase client e types (auto-gerado)
- `analytics/` - Google Analytics
- `hubspot/` - HubSpot CRM
- `mercadopago/` - Mercado Pago
- `salesforce/` - Salesforce
- `sap/` - SAP
- `sendgrid/` - SendGrid Email
- `stripe/` - Stripe Payments
- `totvs/` - TOTVS ERP
- `whatsapp/` - WhatsApp Business
- `zapier/` - Zapier Automação

---

### 10. UTILITÁRIOS (`src/utils/`) - 4 arquivos

- `excelExport.ts` - Exportação Excel
- `personalizationExport.ts` - Export personalização
- `proposalPdfGenerator.ts` - Gerador PDF de proposta
- `templateExport.ts` - Export de templates

---

### 11. DADOS (`src/data/`) - 1 arquivo

- `mockData.ts` - Dados de mock

---

## 🔧 BACKEND - SUPABASE

### Edge Functions (`supabase/functions/`) - 10 funções

1. **`_shared/`** - Utilitários compartilhados
   - `rate-limiter.ts` - Rate limiting

2. **`ai-recommendations/`** - Recomendações IA
   - Usa Lovable AI Gateway

3. **`bitrix-sync/`** - Sincronização Bitrix24
   - Importa clientes e negócios

4. **`expert-chat/`** - Chat Expert com IA
   - Modelo: `google/gemini-2.5-flash`
   - Busca semântica de produtos
   - Análise de cliente
   - Sugestões de upsell

5. **`generate-mockup/`** - Gerador de Mockups IA
   - Modelo: `google/gemini-2.5-flash-image-preview`
   - Aplica logo em produtos
   - Suporta múltiplas técnicas

6. **`product-webhook/`** - Webhook de produtos
   - Recebe produtos de n8n

7. **`quote-approval/`** - Aprovação de orçamentos
   - Token único para cliente

8. **`quote-sync/`** - Sync de orçamentos

9. **`semantic-search/`** - Busca semântica

10. **`visual-search/`** - Busca visual

---

## 📊 BANCO DE DADOS - TABELAS PRINCIPAIS

### Produtos
- `products` - Catálogo de produtos
- `product_components` - Componentes do produto
- `product_component_locations` - Locais de personalização
- `product_component_location_techniques` - Técnicas por local
- `product_groups` - Grupos de produtos
- `product_group_members` - Membros dos grupos
- `product_views` - Visualizações de produtos
- `product_sync_logs` - Logs de sincronização

### Personalização
- `personalization_techniques` - Técnicas (bordado, silk, etc)
- `personalization_sizes` - Tamanhos disponíveis
- `personalization_locations` - Locais de gravação
- `personalization_simulations` - Simulações salvas

### Orçamentos
- `quotes` - Orçamentos
- `quote_items` - Itens do orçamento
- `quote_item_personalizations` - Personalização dos itens
- `quote_history` - Histórico de alterações
- `quote_templates` - Templates de orçamento
- `quote_approval_tokens` - Tokens de aprovação

### Pedidos
- `orders` - Pedidos
- `order_items` - Itens do pedido
- `order_history` - Histórico do pedido

### Clientes (Bitrix24)
- `bitrix_clients` - Clientes sincronizados
- `bitrix_deals` - Negócios do Bitrix
- `bitrix_sync_logs` - Logs de sync

### Gamificação
- `achievements` - Conquistas
- `seller_achievements` - Conquistas do vendedor
- `seller_gamification` - XP, nível, moedas
- `sales_goals` - Metas de vendas
- `store_rewards` - Recompensas da loja
- `user_rewards` - Recompensas do usuário

### Sistema
- `profiles` - Perfis de usuário
- `user_roles` - Roles (admin, vendedor)
- `user_onboarding` - Status do onboarding
- `notifications` - Notificações
- `follow_up_reminders` - Lembretes de follow-up
- `search_analytics` - Analytics de busca

### IA
- `expert_conversations` - Conversas com Expert
- `expert_messages` - Mensagens do chat
- `generated_mockups` - Mockups gerados

---

## 📝 DOCUMENTAÇÃO (`docs/`) - 31 arquivos

- `ANALISE_EXAUSTIVA_GIFTS_STORE.md`
- `DIAGRAMAS_PROCESSOS_GIFTS_STORE.md`
- `PLANO_EXAUSTIVO_MELHORIAS.md`
- `MELHORIAS_PENDENTES_PLANO_IMPLEMENTACAO.md`
- `MELHORIAS_RESTANTES.md`
- `POLITICA_IDIOMA_PT_BR.md`
- `CONFIGURACAO_LOCALE_PT_BR.md`
- `ACCESSIBILITY.md`
- `API.md`
- `BUNDLE_ANALYSIS.md`
- `BUNDLE_ANALYZER_SETUP.md`
- `DARK_MODE.md`
- `DEPLOYMENT.md`
- `DEPLOY.md`
- `EXCEL_INTEGRATION_GUIDE.md`
- `FORM_VALIDATION.md`
- `MOBILE.md`
- `PERFORMANCE.md`
- `SECURITY.md`
- `TESTING.md`
- `README.md`
- `api.md`
- `architecture.md`
- `code-style.md`
- `commits.md`
- `deployment.md`
- `faq.md`
- `performance.md`
- `security-policy.md`
- `testing.md`
- `troubleshooting.md`
- `workflows.md`

---

## ⚠️ PROBLEMAS CONHECIDOS

### Arquivos Órfãos (Stories/Tests sem dependências)

Os seguintes arquivos referenciam dependências não instaladas:

**Storybook não instalado (`@storybook/react`):**
- `src/components/clients/*.stories.tsx` (8 arquivos)
- `src/components/products/*.stories.tsx` (10 arquivos)
- `src/components/quotes/*.stories.tsx` (10 arquivos)
- `src/components/ui/*.stories.tsx` (16 arquivos)

**Vitest/Testing Library não instalados:**
- `src/components/clients/__tests__/ClientCard.test.tsx`
- `src/components/errors/__tests__/ErrorBoundary.test.tsx`
- `src/components/products/__tests__/PresentationMode.test.tsx`
- `src/components/products/__tests__/ProductCard.test.tsx`
- `src/components/export/__tests__/ExportExcelButton.test.tsx`

**Componentes referenciados que não existem:**
- `ClientCommunication`, `ClientDetails`, `ClientDocuments`
- `ClientForm`, `ClientNotes`, `ClientSegments`
- `ProductDetails`, `ProductFilters`, `ProductImages`
- `ProductPrice`, `ProductReviews`, `ProductSearch`, `ProductStock`
- `QuoteActions`, `QuoteApproval`, `QuoteCard`, `QuoteDetails`
- `QuoteForm`, `QuoteItems`, `QuoteList`, `QuoteStatus`
- `QuoteTimeline`, `QuoteTotal`

---

## 🔑 SECRETS CONFIGURADOS

- `LOVABLE_API_KEY` - API Key para Lovable AI Gateway
- `SUPABASE_DB_URL` - URL do banco
- `SUPABASE_URL` - URL da API
- `SUPABASE_ANON_KEY` - Chave pública
- `SUPABASE_SERVICE_ROLE_KEY` - Chave de serviço
- `SUPABASE_PUBLISHABLE_KEY` - Chave publicável
- `N8N_QUOTE_WEBHOOK_URL` - Webhook n8n para orçamentos
- `N8N_PRODUCT_WEBHOOK_SECRET` - Secret do webhook
- `BITRIX24_WEBHOOK_URL` - Webhook do Bitrix24

---

## 📦 DEPENDÊNCIAS PRINCIPAIS

### Framework
- React 18.3.1
- React Router DOM 6.30.1
- TypeScript

### UI
- Radix UI (todos os primitivos)
- Tailwind CSS + tailwindcss-animate
- Framer Motion 12.x
- Lucide React (ícones)
- Shadcn/ui components

### Estado/Dados
- TanStack React Query 5.x
- Zustand (stores)

### Formulários
- React Hook Form 7.x
- Zod 3.x (validação)

### Tabelas/Listas
- TanStack Virtual 3.x

### Gráficos
- Recharts 2.x

### Export
- jsPDF 3.x
- jspdf-autotable 5.x
- xlsx 0.18.x

### Canvas
- Fabric.js 6.x (editor de mockup)

### DnD
- @dnd-kit (drag and drop)

### Internacionalização
- date-fns 3.x (com locale pt-BR)

---

## 🎯 FUNCIONALIDADES IMPLEMENTADAS

1. ✅ Catálogo de produtos com busca semântica
2. ✅ Sistema de orçamentos completo
3. ✅ Gerador de mockups com IA
4. ✅ Chat Expert com IA (análise de cliente + upsell)
5. ✅ Sincronização Bitrix24
6. ✅ Sistema de gamificação
7. ✅ Filtros avançados e salvos
8. ✅ Modo de apresentação
9. ✅ Comparação de produtos
10. ✅ Coleções personalizadas
11. ✅ Favoritos
12. ✅ Notificações
13. ✅ Follow-up reminders
14. ✅ Metas de vendas
15. ✅ Dashboard BI
16. ✅ Onboarding guiado
17. ✅ PWA ready
18. ✅ Dark/Light mode
19. ✅ Responsivo (mobile-first)
20. ✅ Autenticação com roles

---

*Documento gerado automaticamente em 30/12/2024*
