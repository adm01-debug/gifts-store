# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não Lançado]

### Planejado
- Versionamento de orçamentos
- Import CSV de produtos em massa
- Dashboard customizável com widgets
- Integração Google Calendar
- Relatórios agendados

## [2.0.0] - 2025-12-27

### 🎉 Adicionado

#### Features Principais
- **PWA Completo** - App instalável com funcionamento offline
- **Comentários em Orçamentos** - Sistema de colaboração com thread
- **Filtros Salvos** - Salvar e reutilizar filtros por contexto
- **Histórico de Preços** - Gráfico temporal de alterações de preço
- **Bulk Actions** - Seleção em massa com barra de ações flutuante
- **Exportação Excel** - Em orçamentos, pedidos e clientes
- **Modo Apresentação** - Fullscreen para produtos
- **QR Code** - Para aprovação de orçamentos
- **Tags** - Sistema de organização de orçamentos
- **Push Notifications** - Notificações web push (requer VAPID)
- **Audit Log** - Rastreamento universal de mudanças

#### Componentes
- QuoteComments - Thread de comentários
- SavedFiltersDropdown - Gerenciador de filtros
- PriceHistoryChart - Gráfico de preços com Recharts
- BulkActionsBar - Barra de ações em massa
- LazyImage - Imagem com lazy loading
- LoadingState/EmptyState - Estados universais
- QuoteCardSkeleton, TableSkeleton - Loading skeletons

#### Hooks
- useQuoteComments - Gerenciar comentários
- usePriceHistory - Histórico de alterações
- useBulkSelection - Seleção em massa
- useDebouncedSearch - Busca com debounce
- useKeyboardShortcuts - Atalhos de teclado
- usePushNotifications - Web Push API

### ⚡ Melhorado

#### Performance
- **+30 índices SQL** - Performance 10-100x em queries
- **Cache de Imagens** - Service Worker com cache-first strategy
- **Lazy Loading** - Componente LazyImage otimizado
- **Bundle Splitting** - Code splitting em todas as rotas

#### UX/UI
- Estados de loading consistentes
- Feedback visual aprimorado
- Atalhos de teclado globais (Ctrl+K, Ctrl+N, etc)
- Skeleton screens em todas as listas

#### Testes
- 8 arquivos de teste criados
- ~15% de cobertura inicial
- Vitest + Testing Library configurados

### 🔒 Segurança

- Tokens de aprovação seguros (48h TTL + invalidação automática)
- Rate limiting em 3 níveis
- Audit log com triggers automáticos
- Validação client + server com Zod

### 🐛 Corrigido

- Componentes criados mas não integrados (10 integrações)
- Service Worker não registrado
- Dependências de teste faltando

### 📝 Documentação

- README completo com badges
- CHANGELOG criado
- Comentários em migrations SQL

## [1.0.0] - 2025-12-20

### Adicionado

#### Base do Sistema
- Autenticação com Supabase
- Gestão de produtos
- Sistema de orçamentos
- Integração Bitrix24
- Gamificação básica
- Dashboard BI

#### Componentes Core
- ProductCard com variantes
- QuoteBuilder completo
- ClientList com filtros
- AdminPanel com tabs

#### Infraestrutura
- 26 migrations SQL iniciais
- 10 Edge Functions
- RLS completo
- 133 componentes React
- 33 hooks customizados

## Tipos de Mudanças

- `Adicionado` - para novas funcionalidades
- `Modificado` - para mudanças em funcionalidades existentes
- `Obsoleto` - para funcionalidades que serão removidas
- `Removido` - para funcionalidades removidas
- `Corrigido` - para correções de bugs
- `Segurança` - para correções de vulnerabilidades

---

**Formato do Versionamento:**
- **Major (X.0.0)** - Mudanças incompatíveis
- **Minor (0.X.0)** - Novas funcionalidades compatíveis
- **Patch (0.0.X)** - Correções de bugs
