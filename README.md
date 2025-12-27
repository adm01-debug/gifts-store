# 🎁 Gifts Store - Sistema de Gestão de Brindes

> Sistema completo de gestão de produtos promocionais com integração Bitrix24

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.0-green.svg)](https://supabase.com/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-purple.svg)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## ✨ Features

### 🎯 Funcionalidades Principais

- **Gestão de Orçamentos** - Criação, edição e acompanhamento de orçamentos
- **Catálogo de Produtos** - 1000+ produtos com busca avançada e filtros
- **Integração Bitrix24** - Sincronização bidirecional de clientes e negócios
- **PWA** - Instalável, funciona offline, notificações push
- **Gamificação** - Sistema de pontos, conquistas e leaderboard
- **Exportação Excel** - Exportar orçamentos, pedidos e clientes
- **Modo Apresentação** - Fullscreen para mostrar produtos ao cliente
- **Comentários** - Sistema de colaboração em orçamentos
- **Histórico de Preços** - Gráficos de variação de preço
- **Bulk Actions** - Ações em massa em listas

### 🔒 Segurança

- ✅ Autenticação JWT com Supabase
- ✅ Row Level Security (RLS)
- ✅ Audit Log universal
- ✅ Tokens seguros com TTL
- ✅ Rate limiting

### ⚡ Performance

- ✅ 30+ índices SQL otimizados
- ✅ Lazy loading de rotas e imagens
- ✅ Service Worker com cache inteligente
- ✅ Bundle splitting
- ✅ Lighthouse Score 90+

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta Supabase
- (Opcional) Conta Bitrix24

### Instalação

```bash
# Clone o repositório
git clone https://github.com/adm01-debug/gifts-store.git

# Entre na pasta
cd gifts-store

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Execute migrations
npm run db:migrate

# Inicie o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173) no navegador.

## 📦 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run test         # Rodar testes
npm run test:ui      # UI de testes
npm run coverage     # Cobertura de testes
npm run lint         # Lint do código
```

## 🏗️ Arquitetura

```
gifts-store/
├── src/
│   ├── components/     # Componentes React
│   ├── hooks/          # Custom hooks
│   ├── pages/          # Páginas/rotas
│   ├── lib/            # Utilitários
│   ├── integrations/   # Integrações externas
│   └── types/          # TypeScript types
├── supabase/
│   ├── functions/      # Edge Functions
│   └── migrations/     # Migrations SQL
└── public/             # Assets estáticos
```

### Tech Stack

- **Frontend:** React 18, TypeScript, TailwindCSS, shadcn/ui
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **State:** TanStack Query (React Query)
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Export:** SheetJS (xlsx)
- **Build:** Vite

## 🔧 Configuração

### Variáveis de Ambiente

```env
# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima

# Bitrix24 (opcional)
VITE_BITRIX_WEBHOOK=https://sua-empresa.bitrix24.com.br/rest/...

# Push Notifications (opcional)
VITE_VAPID_PUBLIC_KEY=sua-chave-vapid
```

### Migrations

Execute as migrations na ordem correta:

```bash
# Via Supabase CLI
supabase migration up

# Ou copie manualmente no SQL Editor do Supabase
# Ordem: arquivos .sql por data crescente
```

## 📊 Features Técnicas

### PWA

O app é instalável e funciona offline:

```typescript
// Registrado automaticamente em src/main.tsx
registerServiceWorker()
```

### Lazy Loading

Todas as rotas usam lazy loading:

```typescript
const QuotesPage = lazy(() => import('./pages/QuotesListPage'))
```

### Bulk Actions

Seleção em massa otimizada:

```typescript
const { selectedIds, toggleItem, toggleAll } = useBulkSelection(items)
```

## 🧪 Testes

```bash
# Rodar todos os testes
npm test

# Modo watch
npm run test:watch

# Com UI
npm run test:ui

# Cobertura
npm run coverage
```

Meta: 30% de cobertura mínima

## 📈 Roadmap

### Em Desenvolvimento

- [ ] Versionamento de orçamentos
- [ ] Import CSV de produtos
- [ ] Dashboard customizável
- [ ] Integração Google Calendar

### Backlog

- [ ] App mobile nativo
- [ ] Relatórios agendados
- [ ] Multi-idioma

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

Veja [CONTRIBUTING.md](CONTRIBUTING.md) para mais detalhes.

## 📝 License

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para mais informações.

## 👥 Autores

- **Pink e Cerébro** - *Desenvolvimento Principal*

## 🙏 Agradecimentos

- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Supabase](https://supabase.com/) - Backend as a Service
- [Lovable](https://lovable.dev/) - Assistência no desenvolvimento

---

**📅 Última Atualização:** Dezembro 2025  
**🌟 Status:** Produção  
**📊 Progresso:** 50/56 funcionalidades (89%)
