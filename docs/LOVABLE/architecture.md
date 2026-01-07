# Arquitetura - Gifts Store

## Visão Geral
Sistema de gestão de produtos promocionais com integração Bitrix24 e Supabase.

## Stack Tecnológico
- **Frontend:** React 18 + TypeScript + Vite
- **UI:** Tailwind CSS + Shadcn/ui
- **Estado:** TanStack Query + Zustand
- **Backend:** Supabase (PostgreSQL + Auth)
- **CRM:** Bitrix24 API
- **Deploy:** Vercel

## Estrutura de Pastas
```
src/
├── components/     # Componentes reutilizáveis
├── features/       # Features por domínio
├── hooks/          # Custom hooks
├── lib/            # Utilitários e helpers
├── pages/          # Páginas/rotas
└── services/       # Serviços externos
```

## Fluxo de Dados
1. UI dispara ação
2. Hook/Service faz request
3. TanStack Query gerencia cache
4. Supabase/Bitrix24 responde
5. UI atualiza reactivamente
