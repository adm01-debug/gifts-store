# 📋 Inventário Completo de Funcionalidades e Ferramentas

> Documento de referência para replicação de padrões em outros projetos

---

## 🔐 1. AUTENTICAÇÃO E SEGURANÇA

### 1.1 Autenticação de Usuários
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Login/Registro | `src/pages/Auth.tsx` | Supabase Auth |
| Contexto de Auth | `src/contexts/AuthContext.tsx` | React Context, Supabase |
| Rota Protegida | `src/components/auth/ProtectedRoute.tsx` | React Router DOM |
| Recuperação de Senha | `src/components/auth/ForgotPasswordForm.tsx` | Supabase Auth |
| Reset de Senha | `src/pages/ResetPassword.tsx` | Supabase Auth |
| Aprovação de Reset (Admin) | `src/components/admin/PasswordResetApproval.tsx` | Supabase, React Query |
| Hook de Reset Requests | `src/hooks/usePasswordResetRequests.ts` | Supabase |

### 1.2 Controle de Acesso (RBAC)
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Hook RBAC | `src/hooks/useRBAC.ts` | React, Supabase |
| Tabelas: `roles`, `permissions`, `user_roles` | Supabase Database | PostgreSQL, RLS Policies |

### 1.3 Autenticação de Dois Fatores (2FA)
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Setup 2FA | `src/components/security/TwoFactorSetup.tsx` | otpauth, qrcode.react |
| Hook 2FA | `src/hooks/use2FA.ts` | otpauth |

### 1.4 Restrição por IP
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Gerenciador de IPs | `src/components/security/IPRestrictionManager.tsx` | React, Supabase |
| Hook de IPs Permitidos | `src/hooks/useAllowedIPs.ts` | Supabase |
| Validação de IP | `src/hooks/useIPValidation.ts` | Supabase, fetch API |
| Tabelas: `user_allowed_ips`, `login_attempts` | Supabase Database | PostgreSQL, RLS |

### 1.5 Configurações de Segurança
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Página de Segurança | `src/pages/Security.tsx` | React |
| Configurações Gerais | `src/components/security/SecuritySettings.tsx` | React, Supabase |

---

## 🤖 2. INTELIGÊNCIA ARTIFICIAL

### 2.1 Chat com Especialista IA
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Botão do Chat | `src/components/expert/ExpertChatButton.tsx` | React, Lucide Icons |
| Dialog do Chat | `src/components/expert/ExpertChatDialog.tsx` | Shadcn Dialog |
| Edge Function | `supabase/functions/expert-chat/index.ts` | Deno, Lovable AI Gateway |
| Hook Conversações | `src/hooks/useExpertConversations.ts` | Supabase, React Query |
| Tabelas: `expert_conversations`, `expert_messages` | Supabase Database | PostgreSQL |

### 2.2 Recomendações de IA
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Painel de Recomendações | `src/components/ai/AIRecommendationsPanel.tsx` | React |
| Chat IA | `src/components/ai/AIChat.tsx` | React |
| Hook Recomendações | `src/hooks/useAIRecommendations.ts` | Supabase Functions |
| Edge Function | `supabase/functions/ai-recommendations/index.ts` | Deno, Lovable AI Gateway |

### 2.3 Busca Semântica
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Edge Function | `supabase/functions/semantic-search/index.ts` | Deno, Lovable AI Gateway, Cache TTL |
| RPC Function | `search_products_semantic` | PostgreSQL, pg_trgm |

### 2.4 Busca Visual (por Imagem)
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Edge Function | `supabase/functions/visual-search/index.ts` | Deno, Lovable AI Gateway |
| Análise de imagem e busca por similaridade | Lovable AI | google/gemini-2.5-flash |

### 2.5 Geração de Mockups com IA
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Página Gerador | `src/pages/MockupGenerator.tsx` | React, Fabric.js |
| Edge Function | `supabase/functions/generate-mockup/index.ts` | Deno, Lovable AI Gateway |
| Editor de Posição | `src/components/mockup/LogoPositionEditor.tsx` | Fabric.js |
| Multi-Área | `src/components/mockup/MultiAreaManager.tsx` | React |
| Tabela: `generated_mockups` | Supabase Database | PostgreSQL |

### 2.6 Sugestões Contextuais
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Hook | `src/hooks/useContextualSuggestions.ts` | React |

---

## 📦 3. GESTÃO DE PRODUTOS

### 3.1 Catálogo de Produtos
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Grid de Produtos | `src/components/products/ProductGrid.tsx` | React, TanStack Virtual |
| Lista de Produtos | `src/components/products/ProductList.tsx` | React |
| Card de Produto | `src/components/products/ProductCard.tsx` | React, Framer Motion |
| Detalhes do Produto | `src/pages/ProductDetail.tsx` | React, React Query |
| Galeria de Imagens | `src/components/products/ProductGallery.tsx` | React |
| Variações | `src/components/products/ProductVariations.tsx` | React |
| Produtos Relacionados | `src/components/products/RelatedProducts.tsx` | React |
| Composição de Kit | `src/components/products/KitComposition.tsx` | React |
| Tabela: `products` | Supabase Database | PostgreSQL, Full-Text Search |

### 3.2 Virtualização
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Grid Virtualizado | `src/components/products/VirtualizedProductGrid.tsx` | @tanstack/react-virtual |
| Lista Virtualizada | `src/components/virtualized/` | @tanstack/react-virtual |

### 3.3 Personalização de Produtos
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Regras de Personalização | `src/components/products/ProductPersonalizationRules.tsx` | React |
| Simulador | `src/pages/PersonalizationSimulator.tsx` | React, Fabric.js |
| Admin Personalização | `src/pages/AdminPersonalizationPage.tsx` | React |
| Gerenciador de Técnicas | `src/components/admin/TechniquesManager.tsx` | React, DnD Kit |
| Gerenciador de Grupos | `src/components/admin/ProductGroupsManager.tsx` | React |
| Tabelas: `personalization_techniques`, `personalization_sizes`, `personalization_locations`, `product_components`, `product_component_locations` | Supabase Database | PostgreSQL |

### 3.4 Histórico de Preços
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Gráfico de Preços | `src/components/products/PriceHistoryChart.tsx` | Recharts |
| Hook | `src/hooks/usePriceHistory.ts` | React, Supabase |

### 3.5 Modo Apresentação
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Apresentação | `src/components/products/PresentationMode.tsx` | React, Framer Motion |
| Ações de Compartilhamento | `src/components/products/ShareActions.tsx` | Web Share API |

### 3.6 Sincronização de Produtos
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Webhook de Produtos | `supabase/functions/product-webhook/index.ts` | Deno, Supabase |
| Import CSV | `src/components/admin/ProductImportCSV.tsx` | xlsx |
| Tabela: `product_sync_logs` | Supabase Database | PostgreSQL |

---

## 📝 4. GESTÃO DE ORÇAMENTOS (QUOTES)

### 4.1 CRUD de Orçamentos
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Builder de Orçamento | `src/pages/QuoteBuilderPage.tsx` | React |
| Componente Builder | `src/components/quotes/QuoteBuilder.tsx` | React, DnD Kit |
| Lista de Orçamentos | `src/pages/QuotesListPage.tsx` | React, TanStack Table |
| Visualização | `src/pages/QuoteViewPage.tsx` | React |
| Dashboard | `src/pages/QuotesDashboardPage.tsx` | Recharts |
| Hook Principal | `src/hooks/useQuotes.ts` | Supabase, React Query |
| Tabelas: `quotes`, `quote_items`, `quote_item_personalizations` | Supabase Database | PostgreSQL |

### 4.2 Kanban de Orçamentos
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Página Kanban | `src/pages/QuotesKanbanPage.tsx` | React |
| Board Kanban | `src/components/quotes/QuoteKanbanBoard.tsx` | @dnd-kit/core, @dnd-kit/sortable |

### 4.3 Templates de Orçamento
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Página Templates | `src/pages/QuoteTemplatesPage.tsx` | React |
| Lista de Templates | `src/components/quotes/QuoteTemplatesList.tsx` | React |
| Formulário | `src/components/quotes/QuoteTemplateForm.tsx` | React Hook Form, Zod |
| Seletor | `src/components/quotes/QuoteTemplateSelector.tsx` | React |
| Salvar como Template | `src/components/quotes/SaveAsTemplateButton.tsx` | React |
| Hook | `src/hooks/useQuoteTemplates.ts` | Supabase |
| Tabela: `quote_templates` | Supabase Database | PostgreSQL |

### 4.4 Aprovação de Orçamentos
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Página Pública | `src/pages/PublicQuoteApproval.tsx` | React |
| QR Code | `src/components/quotes/QuoteQRCode.tsx` | qrcode.react |
| Edge Function | `supabase/functions/quote-approval/index.ts` | Deno, Rate Limiter |
| Hook | `src/hooks/useQuoteApproval.ts` | React |
| Tabela: `quote_approval_tokens` | Supabase Database | PostgreSQL |

### 4.5 Histórico e Versões
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Painel de Histórico | `src/components/quotes/QuoteHistoryPanel.tsx` | React |
| Versões | `src/components/quotes/QuoteVersionHistory.tsx` | React |
| Hook Histórico | `src/hooks/useQuoteHistory.ts` | Supabase |
| Hook Versões | `src/hooks/useQuoteVersions.ts` | Supabase |
| Tabela: `quote_history` | Supabase Database | PostgreSQL |

### 4.6 Comentários em Orçamentos
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Componente | `src/components/quotes/QuoteComments.tsx` | React |
| Hook | `src/hooks/useQuoteComments.ts` | Supabase |

### 4.7 Geração de Propostas PDF
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Botão Gerador | `src/components/quotes/ProposalGeneratorButton.tsx` | jspdf, jspdf-autotable |

### 4.8 Sincronização com Bitrix
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Edge Function Sync | `supabase/functions/quote-sync/index.ts` | Deno, N8N Webhooks |

---

## 📋 5. GESTÃO DE PEDIDOS (ORDERS)

### 5.1 CRUD de Pedidos
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Lista de Pedidos | `src/pages/OrdersListPage.tsx` | React, TanStack Table |
| Detalhes do Pedido | `src/pages/OrderDetailPage.tsx` | React |
| Hook | `src/hooks/useOrders.ts` | Supabase, React Query |
| Tabelas: `orders`, `order_items`, `order_history` | Supabase Database | PostgreSQL |

---

## 👥 6. GESTÃO DE CLIENTES

### 6.1 CRUD de Clientes
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Lista de Clientes | `src/pages/ClientList.tsx` | React |
| Detalhes do Cliente | `src/pages/ClientDetail.tsx` | React |
| Componentes | `src/components/clients/` | React |
| Tabela: `bitrix_clients` | Supabase Database | PostgreSQL |

### 6.2 Integração Bitrix24
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Página Sync | `src/pages/BitrixSyncPage.tsx` | React |
| Página Sync V2 | `src/pages/BitrixSyncPageV2.tsx` | React |
| Edge Function | `supabase/functions/bitrix-sync/index.ts` | Deno, Bitrix24 API |
| Hook | `src/hooks/useBitrixSync.ts` | Supabase Functions |
| Hook Async | `src/hooks/useBitrixSyncAsync.ts` | Supabase Functions |
| Tabelas: `bitrix_clients`, `bitrix_deals`, `bitrix_sync_logs` | Supabase Database | PostgreSQL |

### 6.3 Análise RFM
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Hook | `src/hooks/useRFMAnalysis.ts` | React, Supabase |

---

## 🏆 7. GAMIFICAÇÃO

### 7.1 Sistema de Recompensas
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Página da Loja | `src/pages/RewardsStorePage.tsx` | React |
| Loja de Recompensas | `src/components/gamification/RewardsStore.tsx` | React |
| Minhas Recompensas | `src/components/gamification/MyRewards.tsx` | React |
| Leaderboard | `src/components/gamification/SellerLeaderboard.tsx` | React |
| Hook Gamification | `src/hooks/useGamification.ts` | Supabase |
| Hook Rewards Store | `src/hooks/useRewardsStore.ts` | Supabase |
| Tabela: `achievements` | Supabase Database | PostgreSQL |

### 7.2 Metas de Vendas
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Componentes | `src/components/goals/` | React |
| Hook | `src/hooks/useSalesGoals.ts` | Supabase |

---

## 📊 8. ANALYTICS E BI

### 8.1 Dashboard de BI
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Página Dashboard | `src/pages/BIDashboard.tsx` | React, Recharts |
| Hook Métricas | `src/hooks/useBIMetrics.ts` | Supabase |

### 8.2 Dashboard Customizável
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Página | `src/pages/CustomizableDashboard.tsx` | React, DnD Kit |

### 8.3 Tendências
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Página | `src/pages/TrendsPage.tsx` | React, Recharts |

### 8.4 Analytics de Produtos
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Hook | `src/hooks/useProductAnalytics.ts` | Supabase |
| Tabela: `product_views` | Supabase Database | PostgreSQL |

---

## 🔔 9. NOTIFICAÇÕES

### 9.1 Sistema de Notificações
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Componentes | `src/components/notifications/` | React |
| Hook Principal | `src/hooks/useNotifications.ts` | Supabase |
| Tabela: `notifications` | Supabase Database | PostgreSQL |

### 9.2 Notificações Push
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Hook | `src/hooks/usePushNotifications.ts` | Web Push API |
| Service Worker | `src/lib/pwa/` | Service Worker API |

### 9.3 Notificações em Tempo Real
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Admin Realtime | `src/components/admin/AdminRealtimeNotifications.tsx` | Supabase Realtime |
| Hook Password Reset | `src/hooks/usePasswordResetRealtimeNotifications.ts` | Supabase Realtime |

---

## 📁 10. COLEÇÕES E FAVORITOS

### 10.1 Sistema de Favoritos
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Contexto | `src/contexts/FavoritesContext.tsx` | React Context |
| Página | `src/pages/FavoritesPage.tsx` | React |
| Hook | `src/hooks/useFavorites.ts` | React, LocalStorage |

### 10.2 Coleções de Produtos
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Contexto | `src/contexts/CollectionsContext.tsx` | React Context |
| Página Lista | `src/pages/CollectionsPage.tsx` | React |
| Página Detalhe | `src/pages/CollectionDetailPage.tsx` | React |
| Componentes | `src/components/collections/` | React |
| Hook | `src/hooks/useCollections.ts` | Supabase |

### 10.3 Comparação de Produtos
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Contexto | `src/contexts/ComparisonContext.tsx` | React Context |
| Página | `src/pages/ComparePage.tsx` | React |
| Componentes | `src/components/compare/` | React |
| Hook | `src/hooks/useComparison.ts` | React |
| Comparação Fornecedores | `src/hooks/useSupplierComparison.ts` | React |

---

## 🎙️ 11. COMANDOS DE VOZ

### 11.1 Reconhecimento de Fala
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Hook Principal | `src/hooks/useVoiceCommands.ts` | Web Speech API |
| Hook Reconhecimento | `src/hooks/useSpeechRecognition.ts` | Web Speech API |
| Hook Feedback | `src/hooks/useVoiceFeedback.ts` | Web Speech Synthesis API |
| Hook Histórico | `src/hooks/useVoiceCommandHistory.ts` | React |

---

## 📅 12. LEMBRETES E FOLLOW-UP

### 12.1 Sistema de Lembretes
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Componentes | `src/components/reminders/` | React |
| Hook | `src/hooks/useFollowUpReminders.ts` | Supabase |
| Tabela: `follow_up_reminders` | Supabase Database | PostgreSQL |

---

## 📤 13. EXPORTAÇÃO

### 13.1 Export Excel
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Componentes | `src/components/export/` | React |
| Lib | `src/lib/export/` | xlsx |

### 13.2 Export PDF
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Gerador | Múltiplos componentes | jspdf, jspdf-autotable |

---

## 🌐 14. INTERNACIONALIZAÇÃO

### 14.1 Suporte Multi-idioma
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Configuração | `src/i18n/` | date-fns locales |
| Locale Config | `src/lib/locale-config.ts` | date-fns |
| Lib i18n | `src/lib/i18n/` | Custom implementation |

---

## ⚡ 15. PERFORMANCE E CACHE

### 15.1 Caching
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Sistema de Cache | `src/lib/cache/` | Custom implementation |
| Rate Limiter | `supabase/functions/_shared/rate-limiter.ts` | Deno, In-memory cache |

### 15.2 Prefetch
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Hook | `src/hooks/usePrefetch.ts` | React Query |

### 15.3 Monitoramento
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Hook Performance | `src/hooks/usePerformanceMonitor.ts` | Performance API |
| Lib Monitoring | `src/lib/monitoring/` | Custom implementation |

---

## 📱 16. PWA (Progressive Web App)

### 16.1 Service Worker
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Registro SW | `src/lib/sw-register.ts` | Service Worker API |
| Libs PWA | `src/lib/pwa/` | Custom implementation |

### 16.2 Offline Support
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Libs Offline | `src/lib/offline/` | IndexedDB, Cache API |

---

## 🎨 17. UI/UX

### 17.1 Componentes Base
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Componentes UI | `src/components/ui/` | Shadcn/UI, Radix UI |
| Tema | `src/contexts/ThemeContext.tsx` | next-themes |
| Design System | `src/index.css`, `tailwind.config.ts` | Tailwind CSS |

### 17.2 Animações
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Libs Animations | `src/lib/animations/` | Framer Motion |
| Efeitos Visuais | `src/components/effects/` | CSS, Framer Motion |

### 17.3 Drag and Drop
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Sortable Item | `src/components/admin/SortableItem.tsx` | @dnd-kit/sortable |
| Kanban | `src/components/quotes/QuoteKanbanBoard.tsx` | @dnd-kit/core |

### 17.4 Toasts e Dialogs
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Toast Hook | `src/hooks/use-toast.ts` | Sonner |
| Confirm Dialog | `src/hooks/useConfirmDialog.ts` | React |
| Smart Confirm | `src/hooks/useSmartConfirm.ts` | React |

### 17.5 Responsive
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Mobile Hook | `src/hooks/use-mobile.tsx` | React |
| Gestures | `src/lib/gestures/` | Custom implementation |

---

## 🔧 18. UTILITÁRIOS

### 18.1 Debounce e Throttle
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Hook Debounce | `src/hooks/useDebounce.ts` | React |
| Hook Debounced Search | `src/hooks/useDebouncedSearch.ts` | React |

### 18.2 Seleção em Massa
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Hook | `src/hooks/useBulkSelection.ts` | React |

### 18.3 Teclado
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Hook Shortcuts | `src/hooks/useKeyboardShortcuts.ts` | React |

### 18.4 Validações
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Libs | `src/lib/validation/`, `src/lib/validations/` | Zod |
| Runtime Validator | `src/lib/runtime-validator.ts` | Custom |

### 18.5 Data/Hora
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Utils | `src/lib/date-utils.ts` | date-fns |

---

## 🛡️ 19. TRATAMENTO DE ERROS

### 19.1 Error Boundaries
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Error Boundary | `src/components/ErrorBoundary.tsx` | React |
| Enhanced Boundary | `src/components/errors/EnhancedErrorBoundary.tsx` | React |

### 19.2 Error Handlers
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Hook | `src/hooks/useErrorHandler.ts` | React |
| API Handler | `src/lib/api-error-handler.ts` | Custom |
| Logging | `src/lib/logging/` | Custom |

---

## 🔗 20. INTEGRAÇÕES

### 20.1 Supabase
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Cliente | `src/integrations/supabase/client.ts` | @supabase/supabase-js |
| Types | `src/integrations/supabase/types.ts` | TypeScript |

### 20.2 Bitrix24
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Edge Function | `supabase/functions/bitrix-sync/index.ts` | Deno, REST API |
| Webhooks | N8N Integration | N8N Webhooks |

### 20.3 Lovable AI Gateway
| Funcionalidade | Arquivo Principal | Ferramentas/Bibliotecas |
|----------------|-------------------|-------------------------|
| Todas Edge Functions IA | `supabase/functions/*/index.ts` | LOVABLE_API_KEY |
| Modelos Suportados | - | google/gemini-*, openai/gpt-* |

---

## 📚 21. BIBLIOTECAS PRINCIPAIS

| Biblioteca | Versão | Uso Principal |
|------------|--------|---------------|
| React | ^18.3.1 | Framework UI |
| React Router DOM | ^6.30.1 | Roteamento |
| @supabase/supabase-js | ^2.87.1 | Backend/Auth/DB |
| @tanstack/react-query | ^5.83.0 | Estado servidor |
| @tanstack/react-virtual | ^3.13.13 | Virtualização |
| Tailwind CSS | - | Estilização |
| Shadcn/UI + Radix UI | Múltiplas | Componentes UI |
| Framer Motion | ^12.23.26 | Animações |
| React Hook Form | ^7.61.1 | Formulários |
| Zod | ^3.25.76 | Validação |
| date-fns | ^3.6.0 | Manipulação de datas |
| Recharts | ^2.15.4 | Gráficos |
| jspdf + jspdf-autotable | ^3.0.4, ^5.0.2 | Geração PDF |
| xlsx | ^0.18.5 | Export Excel |
| fabric | ^6.9.0 | Canvas/Mockups |
| @dnd-kit/* | Múltiplas | Drag and Drop |
| qrcode.react | ^4.2.0 | QR Codes |
| otpauth | ^9.4.1 | 2FA |
| lucide-react | ^0.462.0 | Ícones |
| Sonner | ^1.7.4 | Toasts |
| next-themes | ^0.3.0 | Temas dark/light |

---

## 🗄️ 22. TABELAS DO BANCO DE DADOS

### Core
- `products` - Catálogo de produtos
- `quotes`, `quote_items`, `quote_item_personalizations` - Orçamentos
- `orders`, `order_items`, `order_history` - Pedidos
- `profiles`, `user_roles`, `roles`, `permissions` - Usuários e RBAC

### Personalização
- `personalization_techniques`, `personalization_sizes`, `personalization_locations`
- `product_components`, `product_component_locations`, `product_component_location_techniques`
- `product_groups`, `product_group_members`, `product_group_components`, `product_group_locations`
- `personalization_simulations`, `generated_mockups`

### Clientes e Integrações
- `bitrix_clients`, `bitrix_deals`, `bitrix_sync_logs`
- `expert_conversations`, `expert_messages`

### Segurança
- `user_allowed_ips`, `login_attempts`
- `password_reset_requests`
- `quote_approval_tokens`

### Outros
- `notifications`, `follow_up_reminders`
- `quote_templates`, `quote_history`
- `product_views`, `product_sync_logs`
- `achievements`

---

## 🔐 23. SECRETS/ENV VARS

| Secret | Uso |
|--------|-----|
| `LOVABLE_API_KEY` | AI Gateway (auto-configurado) |
| `SUPABASE_URL` | Conexão Supabase |
| `SUPABASE_ANON_KEY` | Auth pública |
| `SUPABASE_SERVICE_ROLE_KEY` | Operações admin |
| `BITRIX_WEBHOOK_URL` | Integração Bitrix24 |
| `N8N_WEBHOOK_URL` | Automações N8N |
| `PRODUCT_WEBHOOK_SECRET` | Sync de produtos |

---

*Documento gerado para referência em novos projetos. Atualizado em: 2025-12-31*
