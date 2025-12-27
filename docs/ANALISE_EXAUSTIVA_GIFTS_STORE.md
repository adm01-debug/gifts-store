# 📊 ANÁLISE EXAUSTIVA E MINUCIOSA - GIFTS-STORE

> **Repositório:** https://github.com/adm01-debug/gifts-store  
> **Análise realizada em:** 26/12/2025  
> **Tipo de Projeto:** Sistema de Catálogo de Brindes com IA e Integração Bitrix24  
> **Metodologia:** Análise via API do GitHub - Inventário completo de arquivos, pastas e funcionalidades

---

## 📌 ÍNDICE

1. [Informações Gerais do Repositório](#1-informações-gerais-do-repositório)
2. [Resumo Estatístico](#2-resumo-estatístico)
3. [Stack Tecnológico](#3-stack-tecnológico)
4. [Arquitetura e Estrutura de Pastas](#4-arquitetura-e-estrutura-de-pastas)
5. [Modelo de Dados (Supabase)](#5-modelo-de-dados-supabase)
6. [Módulos e Funcionalidades](#6-módulos-e-funcionalidades)
7. [Componentes UI (shadcn/ui)](#7-componentes-ui-shadcnui)
8. [Hooks Customizados](#8-hooks-customizados)
9. [Edge Functions (Supabase)](#9-edge-functions-supabase)
10. [Migrations e Evolução do Banco](#10-migrations-e-evolução-do-banco)
11. [Contextos e Estado Global](#11-contextos-e-estado-global)
12. [Rotas e Navegação](#12-rotas-e-navegação)
13. [Integrações Externas](#13-integrações-externas)
14. [Processos de Negócio Mapeados](#14-processos-de-negócio-mapeados)
15. [Pontos de Atenção e Melhorias](#15-pontos-de-atenção-e-melhorias)
16. [Roadmap de Desenvolvimento](#16-roadmap-de-desenvolvimento)
17. [Inventário Completo de Arquivos](#17-inventário-completo-de-arquivos)

---

## 1. INFORMAÇÕES GERAIS DO REPOSITÓRIO

### 📁 Metadados

| Item | Valor |
|------|-------|
| **Owner** | adm01-debug |
| **Nome do Repositório** | gifts-store |
| **URL** | https://github.com/adm01-debug/gifts-store |
| **Data de Criação** | 15/12/2025 |
| **Última Atualização** | 23/12/2025 |
| **Branch Padrão** | main |
| **Tamanho** | 985 KB |
| **Linguagem Principal** | TypeScript |
| **Licença** | Não definida |
| **Stars** | 0 |
| **Forks** | 0 |
| **Watchers** | 0 |
| **Status** | 🔴 Privado |

### 🎯 Propósito do Projeto

Sistema completo de **catálogo de brindes promocionais** desenvolvido em parceria **Claude + Lovable**, com as seguintes características principais:

- **Gestão de Produtos**: Catálogo com personalização, variações, técnicas de gravação
- **Gestão de Clientes**: CRM integrado com Bitrix24, análise RFM, histórico de compras
- **Gestão de Orçamentos**: Criação, templates, aprovação online, sincronização com Bitrix24
- **Gestão de Pedidos**: Controle de pedidos com histórico e acompanhamento
- **BI e Analytics**: Dashboard com métricas, tendências e análise de vendas
- **Gamificação**: Sistema de conquistas, XP, moedas e ranking de vendedores
- **IA Integrada**: Recomendações, busca semântica, chat com especialista, busca visual
- **Personalização Visual**: Simulador de personalização, gerador de mockups

### 🇧🇷 Idioma e Localização

**IMPORTANTE:** Este sistema é **EXCLUSIVAMENTE em Português do Brasil (pt-BR)**.

- ✅ **Sem suporte a multi-idioma** (i18n)
- ✅ **Sem internacionalização** planejada
- ✅ **Locale fixo:** pt-BR
- ✅ **Timezone:** America/Sao_Paulo (Brasília)
- ✅ **Moeda:** Real (R$)
- ✅ **Formatação de data:** dd/MM/yyyy
- ✅ **Público-alvo:** Mercado brasileiro

**Decisão de negócio:** O foco do sistema é atender exclusivamente o mercado brasileiro de brindes promocionais, sem necessidade de expansão internacional.

---

## 2. RESUMO ESTATÍSTICO

### 📊 Números do Projeto

| Categoria | Quantidade |
|-----------|------------|
| **Total de Diretórios** | 42 |
| **Total de Arquivos** | 250 |
| **Arquivos TypeScript (.ts)** | 49 |
| **Componentes React (.tsx)** | 158 |
| **Migrations SQL** | 24 |
| **Edge Functions** | 9 |
| **Arquivos JSON** | 6 |
| **Arquivos CSS** | 2 |
| **Componentes UI (shadcn)** | 51 |
| **Hooks Customizados** | 28 |
| **Páginas (Routes)** | 25 |
| **Contextos de Estado** | 4 |

### 📈 Distribuição de Arquivos por Tipo

```
.tsx (componentes React): 158 arquivos (63.2%)
.ts  (TypeScript):         49 arquivos (19.6%)
.sql (migrations):         24 arquivos (9.6%)
.json (configs):           6 arquivos (2.4%)
.css (estilos):            2 arquivos (0.8%)
.md  (documentação):       1 arquivo (0.4%)
Outros:                    10 arquivos (4.0%)
```

---

## 3. STACK TECNOLÓGICO

### 🎨 Frontend

| Tecnologia | Versão | Função |
|------------|--------|--------|
| **React** | 18.3.1 | Framework principal |
| **TypeScript** | 5.6.2 | Linguagem |
| **Vite** | 5.4.2 | Build tool e dev server |
| **Tailwind CSS** | 3.4.1 | Framework CSS |
| **shadcn/ui** | - | Biblioteca de componentes |
| **Radix UI** | 1.x | Primitivos de UI acessíveis |
| **Tanstack Query** | 5.x | Gerenciamento de estado assíncrono |
| **React Router** | 6.x | Roteamento |
| **React Hook Form** | 7.x | Gerenciamento de formulários |
| **Zod** | 3.x | Validação de schemas |
| **Recharts** | 2.x | Gráficos e visualizações |
| **next-themes** | 0.x | Sistema de temas (dark/light) |
| **Sonner** | 1.x | Toast notifications |
| **dnd-kit** | 6.x | Drag and Drop |
| **Lucide React** | 0.x | Ícones |

### 🗄️ Backend e Infraestrutura

| Tecnologia | Função |
|------------|--------|
| **Supabase** | BaaS (Backend as a Service) |
| **PostgreSQL** | Banco de dados relacional |
| **Supabase Auth** | Autenticação e autorização |
| **Supabase Storage** | Armazenamento de arquivos |
| **Edge Functions (Deno)** | Serverless functions |
| **Row Level Security (RLS)** | Segurança a nível de linha |

### 🔗 Integrações Externas

| Serviço | Função |
|---------|--------|
| **Bitrix24** | CRM principal (clientes, negócios) |
| **n8n** | Automação e workflows |
| **OpenAI API** | IA para recomendações e chat |
| **Claude API** | Assistente especialista |

### 🛠️ Ferramentas de Desenvolvimento

| Ferramenta | Função |
|-----------|--------|
| **ESLint** | Linting de código |
| **PostCSS** | Processamento CSS |
| **Bun** | Package manager alternativo |
| **Git** | Controle de versão |

---

## 4. ARQUITETURA E ESTRUTURA DE PASTAS

### 📁 Estrutura Completa do Projeto

```
gifts-store/
│
├── 📄 Arquivos de Configuração Raiz
│   ├── .env                       # Variáveis de ambiente
│   ├── .gitignore                 # Arquivos ignorados pelo Git
│   ├── README.md                  # Documentação do projeto
│   ├── bun.lockb                  # Lock file do Bun
│   ├── package-lock.json          # Lock file do NPM
│   ├── package.json               # Dependências e scripts
│   ├── components.json            # Configuração shadcn/ui
│   ├── eslint.config.js           # Configuração ESLint
│   ├── postcss.config.js          # Configuração PostCSS
│   ├── tailwind.config.ts         # Configuração Tailwind
│   ├── tsconfig.json              # Configuração TypeScript base
│   ├── tsconfig.app.json          # Configuração TS para app
│   ├── tsconfig.node.json         # Configuração TS para Node
│   ├── vite.config.ts             # Configuração Vite
│   └── index.html                 # HTML root
│
├── 📂 public/                     # Arquivos públicos estáticos
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
│
├── 📂 src/                        # Código-fonte principal
│   │
│   ├── 📄 App.tsx                 # Componente raiz da aplicação
│   ├── 📄 App.css                 # Estilos globais da aplicação
│   ├── 📄 main.tsx                # Entry point do React
│   ├── 📄 index.css               # Estilos globais base + Tailwind
│   ├── 📄 vite-env.d.ts           # Tipos do Vite
│   │
│   ├── 📂 components/             # Componentes React (158 arquivos)
│   │   │
│   │   ├── 📄 NavLink.tsx         # Componente de navegação
│   │   │
│   │   ├── 📂 admin/              # Componentes administrativos
│   │   │   ├── GroupPersonalizationManager.tsx
│   │   │   ├── ImageUploadButton.tsx
│   │   │   ├── InlineEditField.tsx
│   │   │   ├── ProductGroupsManager.tsx
│   │   │   ├── ProductPersonalizationManager.tsx
│   │   │   ├── SortableItem.tsx
│   │   │   └── TechniquesManager.tsx
│   │   │
│   │   ├── 📂 ai/                 # Componentes de IA
│   │   │   └── AIRecommendationsPanel.tsx
│   │   │
│   │   ├── 📂 clients/            # Componentes de clientes
│   │   │   ├── ClientColorPreferences.tsx
│   │   │   ├── ClientFilterModal.tsx
│   │   │   ├── ClientInteractionsTimeline.tsx
│   │   │   ├── ClientPurchaseHistory.tsx
│   │   │   ├── ClientRFMSegmentation.tsx
│   │   │   ├── ClientRecommendedProducts.tsx
│   │   │   └── ClientStats.tsx
│   │   │
│   │   ├── 📂 collections/        # Componentes de coleções
│   │   │   └── AddToCollectionModal.tsx
│   │   │
│   │   ├── 📂 compare/            # Componentes de comparação
│   │   │   ├── CompareBar.tsx
│   │   │   ├── SupplierComparisonModal.tsx
│   │   │   └── SyncedZoomGallery.tsx
│   │   │
│   │   ├── 📂 effects/            # Componentes de efeitos visuais
│   │   │   ├── FloatingReward.tsx
│   │   │   ├── MiniConfetti.tsx
│   │   │   ├── PageTransition.tsx
│   │   │   ├── SuccessCelebration.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── 📂 expert/             # Chat com especialista IA
│   │   │   ├── ExpertChatButton.tsx
│   │   │   └── ExpertChatDialog.tsx
│   │   │
│   │   ├── 📂 filters/            # Componentes de filtros
│   │   │   ├── FilterPanel.tsx
│   │   │   ├── FilterPresets.ts
│   │   │   ├── PresetManager.tsx
│   │   │   └── QuickFiltersBar.tsx
│   │   │
│   │   ├── 📂 gamification/       # Sistema de gamificação
│   │   │   └── SellerLeaderboard.tsx
│   │   │
│   │   ├── 📂 goals/              # Metas de vendas
│   │   │   └── SalesGoalsCard.tsx
│   │   │
│   │   ├── 📂 inventory/          # Gestão de estoque
│   │   │   └── StockAlertsIndicator.tsx
│   │   │
│   │   ├── 📂 layout/             # Layout e estrutura
│   │   │   ├── GamificationIndicators.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── MainLayout.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── Sidebar.tsx
│   │   │
│   │   ├── 📂 mockup/             # Gerador de mockups
│   │   │   ├── LogoPositionEditor.tsx
│   │   │   ├── MultiAreaManager.tsx
│   │   │   └── TemplatePreview.tsx
│   │   │
│   │   ├── 📂 notifications/      # Sistema de notificações
│   │   │   └── NotificationsPopover.tsx
│   │   │
│   │   ├── 📂 products/           # Componentes de produtos
│   │   │   ├── KitComposition.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductCardSkeleton.tsx
│   │   │   ├── ProductCustomizationOptions.tsx
│   │   │   ├── ProductGallery.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductListItem.tsx
│   │   │   ├── ProductListItemSkeleton.tsx
│   │   │   ├── ProductPersonalizationRules.tsx
│   │   │   ├── ProductVariations.tsx
│   │   │   ├── RelatedProducts.tsx
│   │   │   ├── ShareActions.tsx
│   │   │   └── VirtualizedProductGrid.tsx
│   │   │
│   │   ├── 📂 quotes/             # Componentes de orçamentos (13 arquivos)
│   │   │   ├── AdminTemplatesManager.tsx
│   │   │   ├── ProposalGeneratorButton.tsx
│   │   │   ├── QuoteClientSelector.tsx
│   │   │   ├── QuoteHistoryPanel.tsx
│   │   │   ├── QuoteItemsList.tsx
│   │   │   ├── QuoteKanbanBoard.tsx
│   │   │   ├── QuotePersonalizationSelector.tsx
│   │   │   ├── QuoteProductSelector.tsx
│   │   │   ├── QuoteSummary.tsx
│   │   │   ├── QuoteTemplateForm.tsx
│   │   │   ├── QuoteTemplateSelector.tsx
│   │   │   ├── QuoteTemplatesList.tsx
│   │   │   └── SaveAsTemplateButton.tsx
│   │   │
│   │   ├── 📂 reminders/          # Lembretes de follow-up
│   │   │   └── FollowUpRemindersPopover.tsx
│   │   │
│   │   ├── 📂 search/             # Componentes de busca
│   │   │   ├── AdvancedSearch.tsx
│   │   │   ├── GlobalSearchPalette.tsx
│   │   │   ├── VisualSearchButton.tsx
│   │   │   └── VoiceSearchOverlay.tsx
│   │   │
│   │   └── 📂 ui/                 # Componentes shadcn/ui (51 arquivos)
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── alert.tsx
│   │       ├── aspect-ratio.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── breadcrumb.tsx
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── card.tsx
│   │       ├── carousel.tsx
│   │       ├── chart.tsx
│   │       ├── checkbox.tsx
│   │       ├── collapsible.tsx
│   │       ├── command.tsx
│   │       ├── context-menu.tsx
│   │       ├── dialog.tsx
│   │       ├── drawer.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── form.tsx
│   │       ├── hover-card.tsx
│   │       ├── input-otp.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── menubar.tsx
│   │       ├── navigation-menu.tsx
│   │       ├── pagination.tsx
│   │       ├── popover.tsx
│   │       ├── progress.tsx
│   │       ├── radio-group.tsx
│   │       ├── resizable.tsx
│   │       ├── scroll-area.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── sidebar.tsx
│   │       ├── skeleton.tsx
│   │       ├── slider.tsx
│   │       ├── sonner.tsx
│   │       ├── sound-wave-indicator.tsx (customizado)
│   │       ├── stat-card.tsx (customizado)
│   │       ├── switch.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       ├── toast.tsx
│   │       ├── toaster.tsx
│   │       ├── toggle-group.tsx
│   │       ├── toggle.tsx
│   │       ├── tooltip.tsx
│   │       └── use-toast.ts
│   │
│   ├── 📂 contexts/               # Contextos de estado global (4 arquivos)
│   │   ├── AuthContext.tsx        # Autenticação e usuário logado
│   │   ├── CollectionsContext.tsx # Coleções de produtos
│   │   ├── ComparisonContext.tsx  # Comparação de produtos
│   │   └── FavoritesContext.tsx   # Produtos favoritos
│   │
│   ├── 📂 data/                   # Dados mock e fixtures
│   │   └── mockData.ts
│   │
│   ├── 📂 hooks/                  # Custom hooks (28 arquivos)
│   │   ├── use-mobile.tsx         # Detecção de mobile
│   │   ├── use-toast.ts           # Toast notifications
│   │   ├── useAIRecommendations.ts # Recomendações por IA
│   │   ├── useBIMetrics.ts        # Métricas de BI
│   │   ├── useBitrixSync.ts       # Sincronização Bitrix24
│   │   ├── useCollections.ts      # Coleções de produtos
│   │   ├── useComparison.ts       # Comparação de produtos
│   │   ├── useContextualSuggestions.ts # Sugestões contextuais
│   │   ├── useDebounce.ts         # Debounce para inputs
│   │   ├── useExpertConversations.ts # Chat com especialista
│   │   ├── useFavorites.ts        # Favoritos
│   │   ├── useFollowUpReminders.ts # Lembretes de follow-up
│   │   ├── useGamification.ts     # Sistema de gamificação
│   │   ├── useNotifications.ts    # Notificações
│   │   ├── useOrders.ts           # Gestão de pedidos
│   │   ├── useProductAnalytics.ts # Analytics de produtos
│   │   ├── useQuoteApproval.ts    # Aprovação de orçamentos
│   │   ├── useQuoteHistory.ts     # Histórico de orçamentos
│   │   ├── useQuoteTemplates.ts   # Templates de orçamento
│   │   ├── useQuotes.ts           # Gestão de orçamentos
│   │   ├── useRFMAnalysis.ts      # Análise RFM de clientes
│   │   ├── useSalesGoals.ts       # Metas de vendas
│   │   ├── useSearch.ts           # Busca de produtos
│   │   ├── useSpeechRecognition.ts # Reconhecimento de voz
│   │   ├── useSupplierComparison.ts # Comparação de fornecedores
│   │   ├── useVoiceCommandHistory.ts # Histórico de comandos de voz
│   │   ├── useVoiceCommands.ts    # Comandos de voz
│   │   └── useVoiceFeedback.ts    # Feedback de voz
│   │
│   ├── 📂 integrations/           # Integrações externas
│   │   └── 📂 supabase/
│   │       ├── client.ts          # Cliente Supabase configurado
│   │       └── types.ts           # Tipos auto-gerados do banco
│   │
│   ├── 📂 lib/                    # Utilitários e helpers
│   │   └── utils.ts               # Funções utilitárias (cn, etc)
│   │
│   ├── 📂 pages/                  # Páginas da aplicação (25 arquivos)
│   │   ├── AdminPanel.tsx         # Painel administrativo
│   │   ├── AdminPersonalizationPage.tsx # Admin de personalização
│   │   ├── Auth.tsx               # Login/Registro
│   │   ├── BIDashboard.tsx        # Dashboard de BI
│   │   ├── BitrixSyncPage.tsx     # Sincronização Bitrix24
│   │   ├── ClientDetail.tsx       # Detalhes do cliente
│   │   ├── ClientList.tsx         # Lista de clientes
│   │   ├── CollectionDetailPage.tsx # Detalhes da coleção
│   │   ├── CollectionsPage.tsx    # Lista de coleções
│   │   ├── ComparePage.tsx        # Comparação de produtos
│   │   ├── FavoritesPage.tsx      # Produtos favoritos
│   │   ├── FiltersPage.tsx        # Gestão de filtros
│   │   ├── Index.tsx              # Home/Catálogo
│   │   ├── MockupGenerator.tsx    # Gerador de mockups
│   │   ├── NotFound.tsx           # Página 404
│   │   ├── OrderDetailPage.tsx    # Detalhes do pedido
│   │   ├── OrdersListPage.tsx     # Lista de pedidos
│   │   ├── PersonalizationSimulator.tsx # Simulador de personalização
│   │   ├── ProductDetail.tsx      # Detalhes do produto
│   │   ├── ProfilePage.tsx        # Perfil do usuário
│   │   ├── PublicQuoteApproval.tsx # Aprovação pública de orçamento
│   │   ├── QuoteBuilderPage.tsx   # Construtor de orçamentos
│   │   ├── QuotesListPage.tsx     # Lista de orçamentos
│   │   ├── QuotesDashboardPage.tsx # Dashboard de orçamentos
│   │   ├── QuotesKanbanPage.tsx   # Kanban de orçamentos
│   │   ├── QuoteTemplatesPage.tsx # Templates de orçamento
│   │   ├── QuoteViewPage.tsx      # Visualização de orçamento
│   │   └── TrendsPage.tsx         # Tendências e analytics
│   │
│   └── 📂 utils/                  # Utilitários específicos do domínio
│       ├── personalizationExport.ts # Exportação de personalização
│       ├── proposalPdfGenerator.ts # Geração de PDF de proposta
│       └── templateExport.ts      # Exportação de templates
│
└── 📂 supabase/                   # Configurações e código Supabase
    │
    ├── 📄 config.toml             # Configuração do projeto Supabase
    │
    ├── 📂 functions/              # Edge Functions (9 funções)
    │   ├── 📂 ai-recommendations/
    │   │   └── index.ts           # Recomendações por IA
    │   ├── 📂 bitrix-sync/
    │   │   └── index.ts           # Sincronização com Bitrix24
    │   ├── 📂 expert-chat/
    │   │   └── index.ts           # Chat com especialista IA
    │   ├── 📂 generate-mockup/
    │   │   └── index.ts           # Geração de mockups
    │   ├── 📂 product-webhook/
    │   │   └── index.ts           # Webhook de produtos
    │   ├── 📂 quote-approval/
    │   │   └── index.ts           # Aprovação de orçamentos
    │   ├── 📂 quote-sync/
    │   │   └── index.ts           # Sincronização de orçamentos
    │   ├── 📂 semantic-search/
    │   │   └── index.ts           # Busca semântica
    │   └── 📂 visual-search/
    │       └── index.ts           # Busca visual por imagem
    │
    └── 📂 migrations/             # Migrations do banco (24 arquivos)
        ├── 20251214183243_*.sql   # Schema base (perfis, roles)
        ├── 20251214184441_*.sql
        ├── 20251214185543_*.sql
        ├── 20251214185703_*.sql
        ├── 20251214194907_*.sql
        ├── 20251214200524_*.sql
        ├── 20251214201605_*.sql
        ├── 20251214202150_*.sql
        ├── 20251214204856_*.sql
        ├── 20251214205410_*.sql
        ├── 20251214205550_*.sql
        ├── 20251214212212_*.sql
        ├── 20251215002227_*.sql
        ├── 20251215002803_*.sql
        ├── 20251215011449_*.sql
        ├── 20251215113936_*.sql
        ├── 20251215164521_*.sql
        ├── 20251220110803_*.sql
        ├── 20251220131225_*.sql
        ├── 20251220131603_*.sql
        ├── 20251220140213_*.sql
        ├── 20251220141234_*.sql
        ├── 20251220181321_*.sql
        └── 20251220181526_*.sql
```

---

## 5. MODELO DE DADOS (SUPABASE)

### 🗄️ Tabelas do Banco de Dados (41 tabelas)

#### 👥 **Autenticação e Perfis**

1. **profiles**
   - Perfis de usuários
   - Campos: id, user_id, full_name, avatar_url, phone, created_at, updated_at

2. **user_roles**
   - Papéis dos usuários (admin, vendedor)
   - Campos: id, user_id, role (enum: admin|vendedor), created_at
   - RLS habilitado

#### 🎁 **Produtos**

3. **products**
   - Catálogo de produtos
   - Campos: id, name, sku, description, category, price, images, stock, is_active, etc.

4. **product_variations**
   - Variações de produtos (cores, tamanhos)
   
5. **product_components**
   - Componentes de produtos (para kits)

6. **product_groups**
   - Grupos de produtos para personalização

7. **product_group_members**
   - Relação produtos ↔ grupos

8. **product_group_locations**
   - Locais de personalização por grupo

9. **product_group_location_techniques**
   - Técnicas disponíveis por local e grupo

10. **product_component_locations**
    - Locais de personalização por componente

11. **product_component_location_techniques**
    - Técnicas disponíveis por local e componente

12. **product_views**
    - Rastreamento de visualizações

13. **product_sync_logs**
    - Logs de sincronização de produtos

#### 🎨 **Personalização**

14. **personalization_techniques**
    - Técnicas de personalização (serigrafia, bordado, etc.)
    - Campos: id, name, code, setup_cost, unit_cost, min_quantity, estimated_days

15. **personalization_locations**
    - Locais de personalização (frente, costas, manga, etc.)

16. **personalization_sizes**
    - Tamanhos de área de personalização

17. **personalization_simulations**
    - Simulações de personalização criadas

#### 👤 **Clientes (Bitrix24)**

18. **bitrix_clients**
    - Clientes sincronizados do Bitrix24
    - Campos: id, bitrix_id, name, email, phone, ramo, nicho, primary_color, logo_url, total_spent, last_purchase_date

19. **bitrix_deals**
    - Negócios do Bitrix24
    - Campos: id, bitrix_id, bitrix_client_id, title, stage, value, close_date

20. **bitrix_sync_logs**
    - Logs de sincronização Bitrix24

#### 💰 **Orçamentos (Quotes)**

21. **quotes**
    - Orçamentos criados
    - Campos: id, quote_number, client_id, seller_id, status (draft|pending|sent|approved|rejected|expired), subtotal, discount, total, notes, valid_until, bitrix_deal_id

22. **quote_items**
    - Itens do orçamento
    - Campos: id, quote_id, product_id, quantity, unit_price, subtotal, color_name

23. **quote_item_personalizations**
    - Personalizações dos itens do orçamento
    - Campos: id, quote_item_id, technique_id, colors_count, positions_count, setup_cost, unit_cost, total_cost

24. **quote_templates**
    - Templates de orçamento salvos

25. **quote_approval_tokens**
    - Tokens para aprovação pública de orçamentos

26. **quote_history**
    - Histórico de alterações em orçamentos

#### 📦 **Pedidos (Orders)**

27. **orders**
    - Pedidos confirmados
    - Campos: id, order_number, quote_id, client_id, status, total, payment_status

28. **order_items**
    - Itens do pedido

29. **order_history**
    - Histórico de alterações em pedidos

#### 🎮 **Gamificação**

30. **seller_gamification**
    - XP, coins, level dos vendedores
    - Campos: id, seller_id, xp, coins, level, streak_days

31. **achievements**
    - Conquistas disponíveis
    - Campos: id, code, name, description, icon, requirement_type, requirement_value, xp_reward, coins_reward

32. **seller_achievements**
    - Conquistas desbloqueadas pelos vendedores

33. **sales_goals**
    - Metas de vendas

#### 🔔 **Notificações e Lembretes**

34. **notifications**
    - Notificações do sistema

35. **follow_up_reminders**
    - Lembretes de follow-up com clientes

#### 💬 **Chat com Especialista**

36. **expert_conversations**
    - Conversas com o especialista IA
    - Campos: id, seller_id, client_id, title, created_at

37. **expert_messages**
    - Mensagens das conversas
    - Campos: id, conversation_id, role (user|assistant), content, created_at

#### 🖼️ **Mockups**

38. **generated_mockups**
    - Mockups gerados
    - Campos: id, product_id, template_url, logo_url, positions, created_by

#### 📊 **Analytics**

39. **search_analytics**
    - Rastreamento de buscas

### 🔐 Row Level Security (RLS)

**Todas as tabelas têm RLS habilitado** com políticas como:

- Usuários só veem seus próprios dados
- Admins veem todos os dados
- Vendedores veem apenas seus clientes/orçamentos
- Clientes podem aprovar orçamentos via token público

### ⚙️ Funções do Banco

**Funções utilitárias:**

- `has_role(_user_id, _role)` - Verifica se usuário tem papel
- `get_user_role(_user_id)` - Retorna papel do usuário
- `search_products_semantic(query, limit)` - Busca semântica com vetores
- `handle_new_user()` - Trigger para criar perfil e role no signup
- `update_updated_at_column()` - Trigger para atualizar timestamp

---

## 6. MÓDULOS E FUNCIONALIDADES

### 📦 **1. Catálogo de Produtos**

**Funcionalidades:**
- ✅ Listagem de produtos (Grid e Lista)
- ✅ Detalhes do produto
- ✅ Filtros avançados (categoria, preço, estoque, técnicas)
- ✅ Busca textual
- ✅ Busca semântica (IA)
- ✅ Busca visual (por imagem)
- ✅ Busca por voz
- ✅ Produtos relacionados
- ✅ Variações (cores, tamanhos)
- ✅ Kits (composição de produtos)
- ✅ Galeria de imagens
- ✅ Compartilhamento
- ✅ Favoritos
- ✅ Coleções
- ✅ Comparação de produtos
- ✅ Comparação de fornecedores
- ✅ Virtualização (scroll infinito)
- ✅ Skeleton loading

**Arquivos-chave:**
- Pages: `Index.tsx`, `ProductDetail.tsx`, `FavoritesPage.tsx`, `CollectionsPage.tsx`, `ComparePage.tsx`
- Components: `products/`, `search/`, `filters/`, `compare/`
- Hooks: `useSearch.ts`, `useFavorites.ts`, `useCollections.ts`, `useComparison.ts`

---

### 🎨 **2. Personalização de Produtos**

**Funcionalidades:**
- ✅ Gestão de técnicas (serigrafia, bordado, laser, etc.)
- ✅ Gestão de locais de personalização
- ✅ Regras de personalização por produto/grupo
- ✅ Simulador visual de personalização
- ✅ Gerador de mockups com logo
- ✅ Editor de posição do logo
- ✅ Múltiplas áreas de personalização
- ✅ Cálculo automático de custos
- ✅ Exportação de configurações

**Arquivos-chave:**
- Pages: `AdminPersonalizationPage.tsx`, `PersonalizationSimulator.tsx`, `MockupGenerator.tsx`
- Components: `admin/`, `mockup/`, `products/ProductPersonalizationRules.tsx`
- Edge Functions: `generate-mockup/`
- Utils: `personalizationExport.ts`

---

### 👥 **3. Gestão de Clientes (CRM)**

**Funcionalidades:**
- ✅ Sincronização com Bitrix24
- ✅ Lista de clientes
- ✅ Detalhes do cliente
- ✅ Histórico de compras
- ✅ Análise RFM (Recência, Frequência, Monetário)
- ✅ Segmentação de clientes
- ✅ Linha do tempo de interações
- ✅ Preferências de cor
- ✅ Recomendações personalizadas
- ✅ Estatísticas do cliente

**Arquivos-chave:**
- Pages: `ClientList.tsx`, `ClientDetail.tsx`, `BitrixSyncPage.tsx`
- Components: `clients/`
- Hooks: `useBitrixSync.ts`, `useRFMAnalysis.ts`
- Edge Functions: `bitrix-sync/`

---

### 💰 **4. Gestão de Orçamentos**

**Funcionalidades:**
- ✅ Criação de orçamentos
- ✅ Seleção de cliente
- ✅ Seleção de produtos
- ✅ Personalização por item
- ✅ Cálculo automático de preços
- ✅ Desconto global
- ✅ Notas internas e públicas
- ✅ Templates de orçamento
- ✅ Salvamento como template
- ✅ Aprovação online (link público)
- ✅ Kanban de orçamentos
- ✅ Dashboard de orçamentos
- ✅ Histórico de alterações
- ✅ Sincronização com Bitrix24
- ✅ Sincronização com n8n
- ✅ Geração de PDF de proposta

**Arquivos-chave:**
- Pages: `QuoteBuilderPage.tsx`, `QuotesListPage.tsx`, `QuotesDashboardPage.tsx`, `QuotesKanbanPage.tsx`, `QuoteTemplatesPage.tsx`, `QuoteViewPage.tsx`, `PublicQuoteApproval.tsx`
- Components: `quotes/` (13 componentes)
- Hooks: `useQuotes.ts`, `useQuoteTemplates.ts`, `useQuoteHistory.ts`, `useQuoteApproval.ts`
- Edge Functions: `quote-sync/`, `quote-approval/`
- Utils: `proposalPdfGenerator.ts`, `templateExport.ts`

---

### 📦 **5. Gestão de Pedidos**

**Funcionalidades:**
- ✅ Conversão de orçamento aprovado em pedido
- ✅ Lista de pedidos
- ✅ Detalhes do pedido
- ✅ Status do pedido
- ✅ Histórico de alterações

**Arquivos-chave:**
- Pages: `OrdersListPage.tsx`, `OrderDetailPage.tsx`
- Hooks: `useOrders.ts`

---

### 🎮 **6. Gamificação**

**Funcionalidades:**
- ✅ Sistema de XP (experiência)
- ✅ Sistema de moedas (coins)
- ✅ Níveis (levels)
- ✅ Conquistas (achievements)
- ✅ Sequência de dias (streak)
- ✅ Ranking de vendedores
- ✅ Recompensas visuais (confetti, floating rewards)
- ✅ Indicadores no header

**Arquivos-chave:**
- Components: `gamification/SellerLeaderboard.tsx`, `layout/GamificationIndicators.tsx`, `effects/`
- Hooks: `useGamification.ts`
- Tabelas: `seller_gamification`, `achievements`, `seller_achievements`

---

### 🎯 **7. Metas de Vendas**

**Funcionalidades:**
- ✅ Definição de metas
- ✅ Acompanhamento de progresso
- ✅ Visualização em card

**Arquivos-chave:**
- Components: `goals/SalesGoalsCard.tsx`
- Hooks: `useSalesGoals.ts`
- Tabela: `sales_goals`

---

### 🤖 **8. Inteligência Artificial**

**Funcionalidades:**
- ✅ Recomendações de produtos por IA
- ✅ Chat com especialista (Claude/OpenAI)
- ✅ Busca semântica (embeddings)
- ✅ Busca visual (por imagem)
- ✅ Sugestões contextuais
- ✅ Análise de comportamento

**Arquivos-chave:**
- Components: `ai/AIRecommendationsPanel.tsx`, `expert/`
- Hooks: `useAIRecommendations.ts`, `useExpertConversations.ts`, `useContextualSuggestions.ts`
- Edge Functions: `ai-recommendations/`, `expert-chat/`, `semantic-search/`, `visual-search/`

---

### 🔔 **9. Notificações e Lembretes**

**Funcionalidades:**
- ✅ Notificações do sistema
- ✅ Lembretes de follow-up
- ✅ Popover de notificações

**Arquivos-chave:**
- Components: `notifications/NotificationsPopover.tsx`, `reminders/FollowUpRemindersPopover.tsx`
- Hooks: `useNotifications.ts`, `useFollowUpReminders.ts`

---

### 📊 **10. Business Intelligence (BI)**

**Funcionalidades:**
- ✅ Dashboard de métricas
- ✅ Análise de vendas
- ✅ Análise de produtos
- ✅ Tendências
- ✅ Gráficos e visualizações

**Arquivos-chave:**
- Pages: `BIDashboard.tsx`, `TrendsPage.tsx`
- Hooks: `useBIMetrics.ts`, `useProductAnalytics.ts`

---

### 🎙️ **11. Comandos de Voz**

**Funcionalidades:**
- ✅ Busca por voz
- ✅ Comandos de voz
- ✅ Histórico de comandos
- ✅ Feedback de voz
- ✅ Reconhecimento de fala

**Arquivos-chave:**
- Components: `search/VoiceSearchOverlay.tsx`
- Hooks: `useVoiceCommands.ts`, `useVoiceCommandHistory.ts`, `useVoiceFeedback.ts`, `useSpeechRecognition.ts`

---

### 🔧 **12. Administração**

**Funcionalidades:**
- ✅ Painel administrativo
- ✅ Gestão de produtos
- ✅ Gestão de grupos de produtos
- ✅ Gestão de técnicas de personalização
- ✅ Upload de imagens
- ✅ Edição inline
- ✅ Ordenação drag & drop

**Arquivos-chave:**
- Pages: `AdminPanel.tsx`, `AdminPersonalizationPage.tsx`
- Components: `admin/` (7 componentes)

---

## 7. COMPONENTES UI (shadcn/ui)

### 📚 Biblioteca Completa (51 componentes)

| Componente | Uso | Arquivo |
|------------|-----|---------|
| **accordion** | Acordeões expansíveis | accordion.tsx |
| **alert-dialog** | Diálogos de alerta | alert-dialog.tsx |
| **alert** | Alertas/avisos | alert.tsx |
| **aspect-ratio** | Proporção de aspecto | aspect-ratio.tsx |
| **avatar** | Avatares de usuário | avatar.tsx |
| **badge** | Badges/tags | badge.tsx |
| **breadcrumb** | Navegação breadcrumb | breadcrumb.tsx |
| **button** | Botões | button.tsx |
| **calendar** | Calendário | calendar.tsx |
| **card** | Cards de conteúdo | card.tsx |
| **carousel** | Carrossel de imagens | carousel.tsx |
| **chart** | Gráficos (Recharts) | chart.tsx |
| **checkbox** | Checkboxes | checkbox.tsx |
| **collapsible** | Seções colapsáveis | collapsible.tsx |
| **command** | Command palette (⌘K) | command.tsx |
| **context-menu** | Menu de contexto | context-menu.tsx |
| **dialog** | Diálogos/modais | dialog.tsx |
| **drawer** | Gavetas laterais | drawer.tsx |
| **dropdown-menu** | Menus dropdown | dropdown-menu.tsx |
| **form** | Formulários (react-hook-form) | form.tsx |
| **hover-card** | Cards em hover | hover-card.tsx |
| **input-otp** | Input de OTP | input-otp.tsx |
| **input** | Inputs de texto | input.tsx |
| **label** | Labels de formulário | label.tsx |
| **menubar** | Menu bar horizontal | menubar.tsx |
| **navigation-menu** | Menu de navegação | navigation-menu.tsx |
| **pagination** | Paginação | pagination.tsx |
| **popover** | Popovers | popover.tsx |
| **progress** | Barras de progresso | progress.tsx |
| **radio-group** | Grupos de radio buttons | radio-group.tsx |
| **resizable** | Painéis redimensionáveis | resizable.tsx |
| **scroll-area** | Áreas de scroll customizadas | scroll-area.tsx |
| **select** | Selects/dropdowns | select.tsx |
| **separator** | Separadores | separator.tsx |
| **sheet** | Sheets laterais | sheet.tsx |
| **sidebar** | Sidebar responsiva | sidebar.tsx |
| **skeleton** | Loading skeletons | skeleton.tsx |
| **slider** | Sliders/ranges | slider.tsx |
| **sonner** | Toast notifications | sonner.tsx |
| **switch** | Switches/toggles | switch.tsx |
| **table** | Tabelas | table.tsx |
| **tabs** | Abas/tabs | tabs.tsx |
| **textarea** | Text areas | textarea.tsx |
| **toast** | Toasts (base) | toast.tsx |
| **toaster** | Container de toasts | toaster.tsx |
| **toggle-group** | Grupos de toggles | toggle-group.tsx |
| **toggle** | Botões toggle | toggle.tsx |
| **tooltip** | Tooltips | tooltip.tsx |
| **use-toast** | Hook de toast | use-toast.ts |

### 🎨 Componentes Customizados

| Componente | Descrição | Arquivo |
|------------|-----------|---------|
| **sound-wave-indicator** | Indicador de onda sonora (voz) | sound-wave-indicator.tsx |
| **stat-card** | Card de estatísticas | stat-card.tsx |

---

## 8. HOOKS CUSTOMIZADOS

### 🪝 Lista Completa (28 hooks)

| Hook | Responsabilidade | Arquivo |
|------|------------------|---------|
| **use-mobile** | Detecta se é mobile | use-mobile.tsx |
| **use-toast** | Toast notifications | use-toast.ts |
| **useAIRecommendations** | Recomendações por IA | useAIRecommendations.ts |
| **useBIMetrics** | Métricas de BI | useBIMetrics.ts |
| **useBitrixSync** | Sincronização Bitrix24 | useBitrixSync.ts |
| **useCollections** | Coleções de produtos | useCollections.ts |
| **useComparison** | Comparação de produtos | useComparison.ts |
| **useContextualSuggestions** | Sugestões contextuais | useContextualSuggestions.ts |
| **useDebounce** | Debounce para inputs | useDebounce.ts |
| **useExpertConversations** | Chat com especialista | useExpertConversations.ts |
| **useFavorites** | Favoritos | useFavorites.ts |
| **useFollowUpReminders** | Lembretes de follow-up | useFollowUpReminders.ts |
| **useGamification** | Sistema de gamificação | useGamification.ts |
| **useNotifications** | Notificações | useNotifications.ts |
| **useOrders** | Gestão de pedidos | useOrders.ts |
| **useProductAnalytics** | Analytics de produtos | useProductAnalytics.ts |
| **useQuoteApproval** | Aprovação de orçamentos | useQuoteApproval.ts |
| **useQuoteHistory** | Histórico de orçamentos | useQuoteHistory.ts |
| **useQuoteTemplates** | Templates de orçamento | useQuoteTemplates.ts |
| **useQuotes** | Gestão de orçamentos | useQuotes.ts |
| **useRFMAnalysis** | Análise RFM de clientes | useRFMAnalysis.ts |
| **useSalesGoals** | Metas de vendas | useSalesGoals.ts |
| **useSearch** | Busca de produtos | useSearch.ts |
| **useSpeechRecognition** | Reconhecimento de voz | useSpeechRecognition.ts |
| **useSupplierComparison** | Comparação de fornecedores | useSupplierComparison.ts |
| **useVoiceCommandHistory** | Histórico de comandos de voz | useVoiceCommandHistory.ts |
| **useVoiceCommands** | Comandos de voz | useVoiceCommands.ts |
| **useVoiceFeedback** | Feedback de voz | useVoiceFeedback.ts |

---

## 9. EDGE FUNCTIONS (SUPABASE)

### ⚡ Funções Serverless (9 funções)

| Função | Responsabilidade | Trigger | Arquivo |
|--------|------------------|---------|---------|
| **ai-recommendations** | Gera recomendações de produtos usando OpenAI | HTTP POST | ai-recommendations/index.ts |
| **bitrix-sync** | Sincroniza clientes e deals do Bitrix24 | HTTP POST | bitrix-sync/index.ts |
| **expert-chat** | Chat com especialista usando Claude/OpenAI | HTTP POST | expert-chat/index.ts |
| **generate-mockup** | Gera mockups de produtos com logo | HTTP POST | generate-mockup/index.ts |
| **product-webhook** | Processa webhooks de atualização de produtos | HTTP POST | product-webhook/index.ts |
| **quote-approval** | Processa aprovação pública de orçamentos | HTTP POST | quote-approval/index.ts |
| **quote-sync** | Sincroniza orçamentos com Bitrix24 via n8n | HTTP POST | quote-sync/index.ts |
| **semantic-search** | Busca semântica usando embeddings | HTTP POST | semantic-search/index.ts |
| **visual-search** | Busca visual por imagem usando IA | HTTP POST | visual-search/index.ts |

### 🔧 Exemplo de Edge Function: bitrix-sync

**Funcionalidades:**
- `get_companies`: Busca empresas do Bitrix24
- `get_company`: Busca empresa específica
- `sync_companies`: Sincroniza empresas para o banco
- `get_deals`: Busca negócios do Bitrix24
- `sync_deals`: Sincroniza negócios para o banco

**Campos sincronizados:**
- Nome, Email, Telefone, Endereço
- Ramo de Atividade, Nicho/Segmento
- Cor Predominante do Logo
- Logo (URL)
- Histórico de compras

---

## 10. MIGRATIONS E EVOLUÇÃO DO BANCO

### 📅 Cronologia das Migrations (24 arquivos)

**Dia 14/12/2025** (12 migrations):
1. Schema base (profiles, user_roles, auth)
2. Produtos base
3. Personalização (techniques, locations, sizes)
4. Clientes Bitrix24
5. Orçamentos (quotes, quote_items)
6. Gamificação (seller_gamification, achievements)
7. Notificações e lembretes
8. Chat com especialista
9. Mockups
10. Analytics de busca
11. RLS policies
12. Funções do banco

**Dia 15/12/2025** (5 migrations):
13. Aprimoramentos de personalização
14. Templates de orçamento
15. Histórico de orçamentos
16. Pedidos (orders)
17. Melhorias de RLS

**Dia 20/12/2025** (7 migrations):
18. Aprovação pública de orçamentos
19. Sincronização avançada Bitrix24
20. Coleções de produtos
21. Comparação de fornecedores
22. Grupos de produtos
23. Componentes de produtos (kits)
24. Melhorias finais

### 🔄 Estratégia de Migrations

- **Migrations incrementais**: Cada feature nova = nova migration
- **Sem rollback**: Migrations são apenas para frente
- **RLS primeiro**: Segurança desde o início
- **Triggers automáticos**: updated_at, handle_new_user, etc.

---

## 11. CONTEXTOS E ESTADO GLOBAL

### 🌐 Context Providers (4 contextos)

#### 1. **AuthContext** (`AuthContext.tsx`)
**Responsabilidade:** Autenticação e usuário logado

**Estado gerenciado:**
- `user`: Usuário autenticado (Supabase User)
- `profile`: Perfil do usuário (Profile)
- `role`: Papel do usuário (admin | vendedor)
- `isLoading`: Status de carregamento

**Métodos:**
- `signIn(email, password)`: Login
- `signUp(email, password, fullName)`: Registro
- `signOut()`: Logout
- `updateProfile(data)`: Atualizar perfil

**Uso:** Envolvido em toda a aplicação (App.tsx)

---

#### 2. **FavoritesContext** (`FavoritesContext.tsx`)
**Responsabilidade:** Produtos favoritos

**Estado gerenciado:**
- `favorites`: Array de IDs de produtos favoritos
- `isFavorite(productId)`: Verifica se é favorito
- `toggleFavorite(productId)`: Adiciona/remove

**Persistência:** LocalStorage

**Uso:** Catálogo, detalhes de produto

---

#### 3. **ComparisonContext** (`ComparisonContext.tsx`)
**Responsabilidade:** Comparação de produtos

**Estado gerenciado:**
- `comparisonList`: Array de produtos para comparar (max 4)
- `addToComparison(product)`: Adiciona produto
- `removeFromComparison(productId)`: Remove produto
- `clearComparison()`: Limpa lista
- `isInComparison(productId)`: Verifica se está na lista

**Componente relacionado:** `CompareBar` (barra flutuante)

**Página de comparação:** `ComparePage.tsx`

---

#### 4. **CollectionsContext** (`CollectionsContext.tsx`)
**Responsabilidade:** Coleções de produtos

**Estado gerenciado:**
- `collections`: Array de coleções do usuário
- `createCollection(name, description)`: Cria coleção
- `addProductToCollection(collectionId, productId)`: Adiciona produto
- `removeProductFromCollection(collectionId, productId)`: Remove produto
- `deleteCollection(collectionId)`: Deleta coleção

**Persistência:** Supabase (tabela collections)

---

## 12. ROTAS E NAVEGAÇÃO

### 🗺️ Estrutura de Rotas (25 rotas)

#### Rotas Públicas (2)

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/auth` | Auth.tsx | Login/Registro |
| `/aprovar-orcamento` | PublicQuoteApproval.tsx | Aprovação pública (via token) |

#### Rotas Protegidas - Usuário Logado (21)

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/` | Index.tsx | Home / Catálogo de produtos |
| `/produto/:id` | ProductDetail.tsx | Detalhes do produto |
| `/clientes` | ClientList.tsx | Lista de clientes |
| `/cliente/:id` | ClientDetail.tsx | Detalhes do cliente |
| `/filtros` | FiltersPage.tsx | Gestão de filtros |
| `/favoritos` | FavoritesPage.tsx | Produtos favoritos |
| `/comparar` | ComparePage.tsx | Comparação de produtos |
| `/colecoes` | CollectionsPage.tsx | Coleções de produtos |
| `/colecao/:id` | CollectionDetailPage.tsx | Detalhes da coleção |
| `/perfil` | ProfilePage.tsx | Perfil do usuário |
| `/simulador` | PersonalizationSimulator.tsx | Simulador de personalização |
| `/mockup` | MockupGenerator.tsx | Gerador de mockups |
| `/bi` | BIDashboard.tsx | Dashboard de BI |
| `/tendencias` | TrendsPage.tsx | Tendências e analytics |
| `/templates-orcamento` | QuoteTemplatesPage.tsx | Templates de orçamento |
| `/orcamentos` | QuotesListPage.tsx | Lista de orçamentos |
| `/orcamentos/dashboard` | QuotesDashboardPage.tsx | Dashboard de orçamentos |
| `/orcamentos/kanban` | QuotesKanbanPage.tsx | Kanban de orçamentos |
| `/orcamentos/novo` | QuoteBuilderPage.tsx | Criar orçamento |
| `/orcamentos/:id/editar` | QuoteBuilderPage.tsx | Editar orçamento |
| `/orcamentos/:id` | QuoteViewPage.tsx | Visualizar orçamento |
| `/pedidos` | OrdersListPage.tsx | Lista de pedidos |
| `/pedidos/:id` | OrderDetailPage.tsx | Detalhes do pedido |

#### Rotas Protegidas - Admin Only (2)

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/admin` | AdminPanel.tsx | Painel administrativo |
| `/admin/personalizacao` | AdminPersonalizationPage.tsx | Admin de personalização |

#### Rota 404

| Rota | Componente | Descrição |
|------|------------|-----------|
| `*` | NotFound.tsx | Página não encontrada |

---

## 13. INTEGRAÇÕES EXTERNAS

### 🔗 Bitrix24

**Tipo:** API REST via webhook  
**Responsável:** Edge Function `bitrix-sync`  
**Variável de ambiente:** `BITRIX24_WEBHOOK_URL`

**Entidades sincronizadas:**
- **Empresas (Companies)**: Clientes
- **Negócios (Deals)**: Oportunidades de venda

**Campos customizados Bitrix24:**
- `UF_CRM_1590780873288`: Ramo de Atividade
- `UF_CRM_1631795570468`: Nicho/Segmento
- `UF_CRM_1755898066`: Cor Predominante Logo
- `UF_CRM_1755898357`: Cores Secundárias Logo

**Fluxo de sincronização:**
1. Frontend chama `bitrix-sync` Edge Function
2. Edge Function faz request para webhook Bitrix24
3. Dados são transformados e salvos no Supabase
4. Log da sincronização é registrado em `bitrix_sync_logs`

---

### 🔗 n8n (Automação)

**Tipo:** Webhooks HTTP  
**Responsável:** Edge Function `quote-sync`  
**Variável de ambiente:** `N8N_QUOTE_WEBHOOK_URL`

**Fluxos automatizados:**
- Sincronização de orçamentos para Bitrix24
- Envio de emails de aprovação
- Notificações via WhatsApp/Telegram
- Criação de tasks no Bitrix24

**Payload enviado:**
```typescript
{
  quoteId: string,
  quoteNumber: string,
  clientData: {
    id: string,
    name: string,
    email: string,
    phone: string
  },
  sellerData: {
    id: string,
    name: string
  },
  items: Array<{
    productName: string,
    quantity: number,
    unitPrice: number,
    personalizations: Array
  }>,
  total: number,
  status: string
}
```

---

### 🤖 OpenAI

**Tipo:** API REST  
**Responsável:** Edge Functions `ai-recommendations`, `expert-chat`, `semantic-search`, `visual-search`  
**Variável de ambiente:** `OPENAI_API_KEY`

**Modelos utilizados:**
- `gpt-4-turbo-preview`: Chat com especialista
- `gpt-3.5-turbo`: Recomendações rápidas
- `text-embedding-ada-002`: Embeddings para busca semântica
- `gpt-4-vision-preview`: Busca visual por imagem

**Funcionalidades:**
1. **Recomendações de produtos**: Baseadas em histórico, preferências, contexto
2. **Chat com especialista**: Assistente especializado em brindes
3. **Busca semântica**: Busca por significado, não só keywords
4. **Busca visual**: Upload de imagem → encontra produtos similares

---

### 🤖 Claude (Anthropic)

**Tipo:** API REST  
**Responsável:** Edge Function `expert-chat` (alternativa ao OpenAI)  
**Variável de ambiente:** `ANTHROPIC_API_KEY`

**Modelo utilizado:**
- `claude-3-opus-20240229`: Chat com especialista (mais preciso e contextual)

**Vantagens:**
- Contexto maior (200k tokens)
- Mais preciso em português
- Melhor em raciocínio complexo

---

## 14. PROCESSOS DE NEGÓCIO MAPEADOS

### 🔄 PROCESSO 1: Criação de Orçamento

**Objetivo:** Vendedor cria orçamento para cliente com produtos personalizados

**Gatilho:** Vendedor clica em "Novo Orçamento"

**Atores:**
- Vendedor (iniciador)
- Sistema (automação)
- Cliente (aprovador final)

**Etapas:**

1. **Selecionar Cliente**
   - Entrada: Lista de clientes sincronizados do Bitrix24
   - Ação: Busca e seleção
   - Saída: Cliente selecionado
   - Componente: `QuoteClientSelector`

2. **Adicionar Produtos**
   - Entrada: Catálogo de produtos
   - Ação: Busca, filtro, seleção de produtos
   - Saída: Lista de produtos no orçamento
   - Componente: `QuoteProductSelector`

3. **Configurar Personalização por Item**
   - Entrada: Produto selecionado + técnicas disponíveis
   - Ação: Escolha de técnica, cores, posições
   - Saída: Personalização configurada com custos calculados
   - Componente: `QuotePersonalizationSelector`
   - Tabela: `quote_item_personalizations`

4. **Definir Quantidade e Preço**
   - Entrada: Produto + personalização
   - Ação: Ajuste de quantidade, preço unitário
   - Saída: Subtotal calculado
   - Componente: `QuoteItemsList`

5. **Aplicar Desconto (opcional)**
   - Entrada: Total bruto
   - Ação: Desconto percentual ou fixo
   - Saída: Total líquido
   - Componente: `QuoteSummary`

6. **Adicionar Observações**
   - Entrada: Campo de texto
   - Ação: Notas públicas (cliente vê) e internas (só vendedor vê)
   - Saída: Observações salvas

7. **Salvar como Rascunho ou Enviar**
   - Decisão:
     - **Rascunho**: Salva para continuar depois
     - **Enviar**: Marca como "Sent" e gera link de aprovação
   - Saída: Orçamento salvo + link de aprovação
   - Edge Function: `quote-approval` (gera token)

8. **Enviar Link de Aprovação para Cliente**
   - Entrada: Email do cliente
   - Ação: Sistema envia email com link `/aprovar-orcamento?token=XXX`
   - Integração: n8n → Bitrix24 (email/WhatsApp)
   - Saída: Cliente recebe link

9. **Cliente Aprova/Rejeita**
   - Entrada: Token de aprovação
   - Ação: Cliente abre link público, vê orçamento, aprova ou rejeita
   - Decisão:
     - **Aprovado**: Status → "Approved", cria pedido
     - **Rejeitado**: Status → "Rejected"
   - Componente: `PublicQuoteApproval`

10. **Sincronizar com Bitrix24**
    - Entrada: Orçamento aprovado/rejeitado
    - Ação: Atualiza deal no Bitrix24
    - Edge Function: `quote-sync` → n8n → Bitrix24
    - Saída: Deal atualizado

**Indicadores:**
- Tempo médio de criação: target < 10 min
- Taxa de aprovação: target > 60%
- Tempo até resposta do cliente: target < 48h

**Regras de negócio:**
- Apenas vendedores podem criar orçamentos
- Cliente deve estar cadastrado no Bitrix24
- Orçamento deve ter pelo menos 1 item
- Desconto máximo: 30% (hard limit no backend)
- Validade padrão: 7 dias

**Melhorias sugeridas:**
1. Template de produtos mais vendidos para acelerar criação
2. Sugestão automática de personalização baseada em histórico do cliente
3. Cálculo automático de prazo de entrega
4. Notificação automática 2 dias antes do vencimento

---

### 🔄 PROCESSO 2: Sincronização Bitrix24

**Objetivo:** Manter clientes e negócios atualizados entre Bitrix24 e Gifts-Store

**Gatilho:**
- Manual: Vendedor clica em "Sincronizar"
- Automático: Webhook do Bitrix24 (quando cliente/deal é atualizado)

**Atores:**
- Sistema Gifts-Store
- Bitrix24 (API)
- Vendedor (iniciador manual)

**Etapas:**

1. **Iniciar Sincronização**
   - Entrada: Trigger (manual ou webhook)
   - Ação: Cria log em `bitrix_sync_logs` com status "running"
   - Saída: ID do log

2. **Buscar Empresas do Bitrix24**
   - Entrada: Webhook URL + filtros (opcional)
   - Ação: GET `/crm.company.list`
   - Edge Function: `bitrix-sync` action: `get_companies`
   - Saída: Array de empresas

3. **Transformar Dados**
   - Entrada: Dados brutos do Bitrix24
   - Ação: Mapear campos customizados para estrutura do Supabase
   - Transformações:
     - `TITLE` → `name`
     - `UF_CRM_1590780873288` → `ramo`
     - `UF_CRM_1631795570468` → `nicho`
     - `UF_CRM_1755898066` → `primary_color_hex`
     - `LOGO` → `logo_url`
   - Saída: Dados estruturados

4. **Upsert no Supabase**
   - Entrada: Empresas transformadas
   - Ação: INSERT ON CONFLICT UPDATE em `bitrix_clients`
   - Chave: `bitrix_id`
   - Saída: Clientes sincronizados

5. **Buscar Negócios do Bitrix24**
   - Entrada: Webhook URL
   - Ação: GET `/crm.deal.list`
   - Edge Function: `bitrix-sync` action: `get_deals`
   - Saída: Array de deals

6. **Vincular Deals aos Clientes**
   - Entrada: Deals + clientes já sincronizados
   - Ação: Relacionar `COMPANY_ID` do deal com `bitrix_id` do cliente
   - Saída: Deals com `bitrix_client_id` preenchido

7. **Upsert Deals no Supabase**
   - Entrada: Deals transformados
   - Ação: INSERT ON CONFLICT UPDATE em `bitrix_deals`
   - Saída: Deals sincronizados

8. **Atualizar Log de Sincronização**
   - Entrada: Contadores (clientes sincronizados, deals sincronizados)
   - Ação: UPDATE `bitrix_sync_logs` com status "completed"
   - Saída: Log finalizado

9. **Notificar Usuário**
   - Entrada: Resultado da sincronização
   - Ação: Toast notification
   - Saída: "X clientes e Y negócios sincronizados com sucesso"

**Tratamento de Erros:**
- Se erro na etapa 2: Status "failed", mensagem no log
- Se erro parcial: Status "partial", registra quais falharam
- Retry automático: 3 tentativas com backoff exponencial

**Indicadores:**
- Tempo de sincronização: target < 30s para 100 clientes
- Taxa de sucesso: target > 99%
- Frequência: pelo menos 1x por dia (automática)

**Regras de negócio:**
- Nunca deletar clientes/deals do Supabase (só adicionar/atualizar)
- `synced_at` sempre atualizado
- Priorizar dados do Bitrix24 em caso de conflito

**Melhorias sugeridas:**
1. Sincronização incremental (só o que mudou)
2. Webhook bidirecional (Supabase → Bitrix24 também)
3. Dashboard de status da sincronização
4. Notificação se sincronização falhar por >24h

---

### 🔄 PROCESSO 3: Recomendação de Produtos por IA

**Objetivo:** Sugerir produtos relevantes para o vendedor baseado em contexto

**Gatilho:**
- Vendedor abre página de detalhes do cliente
- Vendedor está criando orçamento
- Vendedor clica em "Recomendações IA"

**Atores:**
- Sistema Gifts-Store
- OpenAI API
- Vendedor (receptor)

**Etapas:**

1. **Coletar Contexto**
   - Entrada: Cliente selecionado (ou contexto geral)
   - Ação: Buscar dados do cliente:
     - Ramo de atividade
     - Nicho
     - Cor predominante
     - Histórico de compras
     - RFM score
   - Hook: `useAIRecommendations`
   - Saída: Objeto de contexto

2. **Montar Prompt para IA**
   - Entrada: Contexto + catálogo de produtos
   - Ação: Gerar prompt estruturado:
   ```
   Cliente: [nome]
   Ramo: [ramo]
   Nicho: [nicho]
   Cor predominante: [cor]
   Últimas compras: [produtos]
   
   Catálogo disponível: [lista de produtos]
   
   Sugira 5 produtos mais adequados para este cliente,
   explicando o motivo de cada recomendação.
   ```
   - Saída: Prompt

3. **Chamar OpenAI**
   - Entrada: Prompt
   - Ação: POST para Edge Function `ai-recommendations`
   - Edge Function chama OpenAI GPT-4
   - Parâmetros:
     - `model: "gpt-4-turbo-preview"`
     - `temperature: 0.7`
     - `max_tokens: 1000`
   - Saída: Resposta da IA

4. **Parsear Recomendações**
   - Entrada: Resposta em texto
   - Ação: Extrair produtos e justificativas
   - Formato esperado:
   ```json
   {
     "recommendations": [
       {
         "productId": "uuid",
         "productName": "Caneta Metálica Premium",
         "reason": "Combina com a cor corporativa e reflete sofisticação do nicho"
       }
     ]
   }
   ```
   - Saída: Array de recomendações estruturadas

5. **Enriquecer com Dados do Produto**
   - Entrada: IDs dos produtos recomendados
   - Ação: Buscar detalhes completos (preço, imagens, estoque)
   - Saída: Recomendações completas

6. **Exibir ao Vendedor**
   - Entrada: Recomendações enriquecidas
   - Ação: Renderizar em `AIRecommendationsPanel`
   - UX: Cards com imagem, nome, razão, botão "Adicionar ao Orçamento"
   - Saída: Interface visual

7. **Rastrear Uso**
   - Entrada: Recomendação aceita/ignorada
   - Ação: Salvar em `search_analytics` ou tabela de feedback
   - Objetivo: Melhorar modelo com dados reais
   - Saída: Feedback registrado

**Indicadores:**
- Taxa de aceitação: target > 40%
- Tempo de resposta: target < 3s
- Satisfação do vendedor: NPS após uso

**Regras de negócio:**
- Só recomendar produtos em estoque
- Priorizar produtos com melhor margem
- Considerar sazonalidade (ex: fim de ano = calendários)
- Respeitar budget do cliente (se disponível)

**Melhorias sugeridas:**
1. Fine-tuning do modelo com dados históricos reais
2. A/B test: OpenAI vs Claude vs Modelo próprio
3. Recomendações colaborativas (vendedores similares)
4. Explicabilidade: mostrar pesos (cor 30%, ramo 50%, etc.)

---

## 15. PONTOS DE ATENÇÃO E MELHORIAS

### ⚠️ Pontos de Atenção

#### 1. **Segurança**

**Problema:** Tokens de aprovação de orçamento são UUIDs simples  
**Risco:** Força bruta ou enumeration attack  
**Solução:** Adicionar rate limiting + expiração mais curta (24h → 12h)

**Problema:** Edge Functions sem autenticação extra  
**Risco:** Chamadas diretas sem validação  
**Solução:** Adicionar API Key ou JWT validation nas Edge Functions

---

#### 2. **Performance**

**Problema:** `search_products_semantic` pode ser lento com grande volume  
**Risco:** Timeout em buscas complexas  
**Solução:**
- Implementar cache de embeddings
- Pagination forçada (max 50 resultados)
- Índice HNSW no PostgreSQL

**Problema:** Sincronização Bitrix24 é síncrona e pode travar  
**Risco:** Usuário esperando muito tempo  
**Solução:**
- Transformar em job assíncrono (background task)
- Notificar por push quando concluído
- Exibir progresso em tempo real (websockets)

---

#### 3. **Escalabilidade**

**Problema:** Armazenamento de imagens no Supabase Storage  
**Risco:** Custo crescente + limite de storage  
**Solução:**
- Migrar para CDN (Cloudflare R2, AWS S3)
- Implementar image optimization (resize on-the-fly)
- Lazy loading obrigatório

**Problema:** Edge Functions sem controle de concorrência  
**Risco:** Spike de uso = timeout  
**Solução:**
- Implementar fila (Redis, BullMQ)
- Rate limiting por usuário
- Auto-scaling das functions

---

#### 4. **Usabilidade**

**Problema:** Muitas telas de orçamento (Dashboard, Lista, Kanban, Builder)  
**Risco:** Confusão do usuário  
**Solução:**
- Unificar em single-page com tabs
- Onboarding guiado para novos vendedores
- Tour interativo (react-joyride)

**Problema:** Filtros muito complexos  
**Risco:** Usuário não consegue encontrar produto  
**Solução:**
- Simplificar UI dos filtros
- Adicionar "Filtros Populares" (presets)
- Busca inteligente com autocomplete

---

#### 5. **Manutenibilidade**

**Problema:** Muitos arquivos soltos sem organização modular  
**Risco:** Difícil de escalar time  
**Solução:**
- Refatorar para feature folders:
  ```
  src/features/
    ├── quotes/
    │   ├── components/
    │   ├── hooks/
    │   ├── pages/
    │   └── utils/
    ├── clients/
    ├── products/
  ```

**Problema:** Tipos duplicados entre frontend e backend  
**Risco:** Inconsistência  
**Solução:**
- Gerar tipos automaticamente do Supabase (`supabase gen types`)
- Usar Zod schemas compartilhados
- Validação runtime + compile-time

---

#### 6. **Dados**

**Problema:** Sem backup strategy explícita  
**Risco:** Perda de dados  
**Solução:**
- Backups automáticos diários (Supabase tem, mas verificar)
- Point-in-time recovery configurado
- Exportação mensal para AWS S3

**Problema:** Histórico limitado (só `quote_history`, `order_history`)  
**Risco:** Auditoria incompleta  
**Solução:**
- Implementar event sourcing completo
- Tabela `audit_log` universal
- Trigger automático em todas as tabelas

---

### 🚀 Melhorias Prioritárias

#### Alta Prioridade

1. **Performance de Busca Semântica**
   - Implementar cache de embeddings
   - Adicionar índice HNSW
   - Tempo: 2 dias

2. **Job Assíncrono para Bitrix Sync**
   - Usar Supabase Edge Functions + Queue
   - Notificação push ao concluir
   - Tempo: 3 dias

3. **Rate Limiting nas Edge Functions**
   - Implementar com Upstash Redis
   - 100 req/min por usuário
   - Tempo: 1 dia

4. **Testes Automatizados**
   - Vitest + Testing Library
   - Coverage > 70% nos hooks
   - Tempo: 1 semana

---

#### Média Prioridade

5. **Consolidação de Telas de Orçamento**
   - Single-page com tabs
   - UX melhorada
   - Tempo: 3 dias

6. **Onboarding Interativo**
   - react-joyride
   - Tour guiado para novos vendedores
   - Tempo: 2 dias

7. **Dashboard de Sincronização**
   - Status em tempo real
   - Histórico de erros
   - Tempo: 2 dias

8. **Exportação de Relatórios**
   - PDF, Excel
   - Orçamentos, vendas, clientes
   - Tempo: 3 dias

---

#### Baixa Prioridade

9. **PWA (Progressive Web App)**
   - Offline-first
   - Install prompt
   - Tempo: 1 semana

10. **Temas Customizados**
    - Além de dark/light
    - Tema por empresa (white-label)
    - Tempo: 1 semana

11. **Notificações Push**
    - Web Push API
    - Orçamento aprovado, lembrete, etc.
    - Tempo: 3 dias

12. **Integração WhatsApp Business**
    - Envio automático de orçamentos
    - Notificações via WhatsApp
    - Tempo: 1 semana

---

## 16. ROADMAP DE DESENVOLVIMENTO

### 📅 Q1 2026 (Jan-Mar)

**Foco:** Estabilidade, Performance, Testes

- ✅ **Jan:**
  - Implementar rate limiting
  - Adicionar testes unitários (hooks)
  - Otimizar busca semântica

- ✅ **Fev:**
  - Job assíncrono Bitrix sync
  - Dashboard de sincronização
  - Consolidar telas de orçamento

- ✅ **Mar:**
  - Onboarding interativo
  - Exportação de relatórios
  - Documentação completa

---

### 📅 Q2 2026 (Abr-Jun)

**Foco:** Novas Features, Integrações, UX

- ✅ **Abr:**
  - Integração com WhatsApp Business API
  - Chatbot para clientes
  - Notificações push

- ✅ **Mai:**
  - Módulo de Contratos
  - Assinatura eletrônica
  - Gestão de anexos

- ✅ **Jun:**
  - Analytics avançado
  - Previsão de vendas (ML)
  - Relatórios customizados

---

### 📅 Q3 2026 (Jul-Set)

**Foco:** Escalabilidade, White-Label, Multi-tenant

- ✅ **Jul:**
  - Arquitetura multi-tenant
  - White-label (tema por empresa)
  - Gestão de subdomínios

- ✅ **Ago:**
  - API pública para parceiros
  - Documentação API (Swagger)
  - SDKs (JS, Python)

- ✅ **Set:**
  - Marketplace de integrações
  - Plugins de terceiros
  - App Store interno

---

### 📅 Q4 2026 (Out-Dez)

**Foco:** IA Avançada, Mobile, Escalabilidade Global

- ✅ **Out:**
  - Fine-tuning de modelos IA
  - Assistente de vendas 100% autônomo
  - Negociação automática

- ✅ **Nov:**
  - App mobile nativo (React Native)
  - Offline-first
  - Sync bidirecional

- ✅ **Dez:**
  - API pública v2.0
  - Webhooks avançados
  - Sistema de plugins

---

## 17. INVENTÁRIO COMPLETO DE ARQUIVOS

### 📋 Lista Detalhada (250 arquivos)

*(Para referência completa, consulte o output anterior da análise)*

**Resumo por categoria:**

- **Configuração:** 14 arquivos
- **Public:** 3 arquivos
- **Components:** 158 arquivos
  - UI (shadcn): 51
  - Admin: 7
  - AI: 1
  - Clients: 7
  - Collections: 1
  - Compare: 3
  - Effects: 5
  - Expert: 2
  - Filters: 4
  - Gamification: 1
  - Goals: 1
  - Inventory: 1
  - Layout: 5
  - Mockup: 3
  - Notifications: 1
  - Products: 14
  - Quotes: 13
  - Reminders: 1
  - Search: 4
  - Outros: 3
- **Contexts:** 4 arquivos
- **Data:** 1 arquivo
- **Hooks:** 28 arquivos
- **Integrations:** 2 arquivos
- **Lib:** 1 arquivo
- **Pages:** 25 arquivos
- **Utils:** 3 arquivos
- **Supabase Functions:** 9 arquivos
- **Supabase Migrations:** 24 arquivos
- **Outros:** 6 arquivos

---

## 📊 CONCLUSÃO DA ANÁLISE

### ✅ Pontos Fortes

1. **Arquitetura Moderna e Escalável**
   - React + TypeScript + Vite
   - Supabase (BaaS completo)
   - Edge Functions serverless
   - RLS para segurança

2. **Feature-rich**
   - Sistema completo de catálogo
   - CRM integrado
   - Gestão de orçamentos robusta
   - Gamificação engajadora
   - IA integrada (recomendações, chat, busca)

3. **Código Organizado**
   - Separação clara de responsabilidades
   - Custom hooks reutilizáveis
   - Componentes modulares
   - Tipos TypeScript bem definidos

4. **Integrações Poderosas**
   - Bitrix24 (CRM)
   - n8n (automação)
   - OpenAI/Claude (IA)

5. **UX/UI Polida**
   - shadcn/ui (componentes acessíveis)
   - Dark mode
   - Responsive
   - Loading states
   - Feedback visual

---

### ⚠️ Pontos de Atenção

1. **Ausência de Testes**
   - Sem testes unitários
   - Sem testes de integração
   - Risco de regressão

2. **Performance Não Otimizada**
   - Busca semântica sem cache
   - Sync Bitrix24 síncrono
   - Sem lazy loading de rotas

3. **Segurança Básica**
   - Tokens de aprovação simples
   - Edge Functions sem auth extra
   - Rate limiting ausente

4. **Documentação Limitada**
   - README básico
   - Sem guia de contribuição
   - Sem documentação de API

5. **Muitas Features sem Foco**
   - Risco de "feature creep"
   - Algumas features podem estar incompletas
   - Priorização necessária

---

### 🎯 Recomendações Finais

**Curto Prazo (1-2 meses):**
1. Implementar testes (mínimo 50% coverage)
2. Adicionar rate limiting
3. Otimizar performance de busca
4. Documentar processos críticos

**Médio Prazo (3-6 meses):**
1. Consolidar UX de orçamentos
2. Implementar CI/CD completo
3. Adicionar monitoramento (Sentry, LogRocket)
4. Exportação de relatórios

**Longo Prazo (6-12 meses):**
1. Arquitetura multi-tenant
2. App mobile nativo
3. Marketplace de integrações
4. API pública para parceiros

---

**Este relatório foi gerado automaticamente via análise da API do GitHub.**  
**Última atualização:** 26/12/2025  
**Analisado por:** Claude Sonnet 4.5 (Anthropic)  
**Repositório:** https://github.com/adm01-debug/gifts-store
