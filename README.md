# 🎁 Gifts Store - Sistema de Gestão de Brindes

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> Sistema completo de gestão de orçamentos, pedidos e catálogo de produtos promocionais com integração Bitrix24, gamificação e IA.

## ✨ Características Principais

### 🎯 Gestão de Orçamentos
- ✅ Builder visual de orçamentos
- ✅ Aprovação por QR Code
- ✅ Versionamento automático
- ✅ Comentários colaborativos
- ✅ Tags e filtros salvos
- ✅ Exportação para Excel
- ✅ Modo apresentação fullscreen

### 📦 Catálogo de Produtos
- ✅ 50.000+ produtos cadastrados
- ✅ Busca semântica com IA
- ✅ Filtros avançados
- ✅ Histórico de preços
- ✅ Lazy loading otimizado
- ✅ Mockup generator

### 🔄 Integrações
- ✅ Bitrix24 CRM (sync bidirecional)
- ✅ APIs de fornecedores (XBZ, Asia Import, Só Marcas)
- ✅ Lalamove (expedição)
- ✅ WhatsApp (notificações)
- ✅ Google Calendar (lembretes)

### 🎮 Gamificação
- ✅ Sistema de pontos e níveis
- ✅ Conquistas desbloqueáveis
- ✅ Leaderboard de vendedores
- ✅ Metas de vendas
- ✅ Loja de recompensas

### 🤖 IA e Automação
- ✅ Recomendações personalizadas
- ✅ Análise RFM de clientes
- ✅ Busca por voz
- ✅ Chatbot especialista
- ✅ Automações via n8n

### 📱 PWA & Mobile
- ✅ Instalável (Add to Home Screen)
- ✅ Funciona offline
- ✅ Push notifications
- ✅ Cache inteligente
- ✅ Responsivo mobile-first

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+ 
- npm ou pnpm
- Conta Supabase

### Instalação

```bash
# Clone o repositório
git clone https://github.com/adm01-debug/gifts-store.git
cd gifts-store

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# Execute as migrations
npm run migrate

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse: `http://localhost:5173`

## 🏗️ Arquitetura

```
gifts-store/
├── src/
│   ├── components/      # Componentes React
│   │   ├── admin/       # Painel administrativo
│   │   ├── clients/     # Gestão de clientes
│   │   ├── products/    # Catálogo de produtos
│   │   ├── quotes/      # Orçamentos
│   │   └── ui/          # Componentes base (shadcn/ui)
│   ├── hooks/           # Custom hooks
│   ├── pages/           # Páginas/rotas
│   ├── lib/             # Utilitários e configs
│   └── integrations/    # Integrações externas
├── supabase/
│   ├── functions/       # Edge Functions
│   └── migrations/      # Migrations SQL
├── public/
│   ├── sw.js           # Service Worker
│   └── manifest.json   # PWA Manifest
└── docs/               # Documentação
```

## 🗄️ Banco de Dados

### Principais Tabelas

- **products** - Catálogo (50k+ produtos)
- **quotes** - Orçamentos
- **quote_items** - Itens de orçamentos
- **orders** - Pedidos
- **bitrix_clients** - Clientes (sync Bitrix24)
- **sales_goals** - Metas de vendas
- **user_achievements** - Gamificação
- **notifications** - Sistema de notificações

## 🧪 Testes

```bash
# Rodar todos os testes
npm test

# Testes com UI
npm run test:ui

# Cobertura
npm run coverage
```

**Cobertura Atual:** ~30%

## 📊 Performance

| Métrica | Valor |
|---------|-------|
| Lighthouse Score | 90+ |
| First Contentful Paint | <1.5s |
| Bundle Size | <500KB |
| PWA Score | 95+ |

### Otimizações Implementadas

- ✅ Lazy loading de rotas (-60% bundle)
- ✅ Code splitting automático
- ✅ Cache de imagens (SW)
- ✅ 30+ índices SQL
- ✅ Debounce em buscas
- ✅ Virtualização de listas

## 🔒 Segurança

- ✅ Row Level Security (RLS) no Supabase
- ✅ Tokens JWT com 48h TTL
- ✅ Rate limiting (100 req/min)
- ✅ Audit log universal
- ✅ Validação client + server (Zod)
- ✅ LGPD compliance

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **shadcn/ui** - Component library
- **Tanstack Query** - Data fetching
- **Recharts** - Visualizações

### Backend
- **Supabase** - BaaS (PostgreSQL)
- **Edge Functions** - Serverless (Deno)
- **PostgREST** - API automática
- **pg_vector** - Busca semântica

### Integrações
- **Bitrix24** - CRM
- **n8n** - Automações
- **OpenAI** - IA generativa
- **Lalamove** - Logística

## 📝 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build produção
npm run preview      # Preview build
npm test             # Rodar testes
npm run lint         # Linter
npm run format       # Prettier
npm run migrate      # Migrations
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Minha nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

Veja [CONTRIBUTING.md](./CONTRIBUTING.md) para mais detalhes.

## 📄 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](./LICENSE) para mais informações.

## 👥 Equipe

- **Pink e Cerébro** - Desenvolvimento & Arquitetura

## 🌟 Recursos Adicionais

- [📖 Documentação Completa](./docs/)
- [🎨 Guia de Estilo](./docs/STYLE_GUIDE.md)
- [🔧 Configuração](./docs/SETUP.md)
- [🚀 Deploy](./docs/DEPLOY.md)

## 📈 Roadmap

- [ ] App mobile nativo (React Native)
- [ ] Multi-tenancy
- [ ] API pública documentada
- [ ] Marketplace de integrações
- [ ] Dashboard personalizável (drag & drop)
- [ ] Relatórios agendados
- [ ] Fine-tuning modelo IA

---

**Feito com ❤️ por Promo Brindes**

*"Rumo à perfeição, sempre!"* 🚀
