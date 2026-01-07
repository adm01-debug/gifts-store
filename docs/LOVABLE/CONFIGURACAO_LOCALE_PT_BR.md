# 🇧🇷 REMOÇÃO DE i18n E CONFIGURAÇÃO PT-BR - GIFTS-STORE

> **Data:** 26/12/2025  
> **Repositório:** https://github.com/adm01-debug/gifts-store  
> **Objetivo:** Remover estrutura de i18n e garantir 100% pt-BR

---

## 📊 RESULTADO DA ANÁLISE

### ✅ **BOA NOTÍCIA: QUASE TUDO JÁ ESTÁ CORRETO!**

O projeto **gifts-store** **NÃO possui estrutura de i18n** implementada:

- ✅ **Sem arquivos de tradução** (locales/, i18n/, translations/)
- ✅ **Sem dependências de i18n** (react-i18next, next-i18next, react-intl)
- ✅ **Sem uso de funções de tradução** (useTranslation, t(), etc)
- ✅ **Código majoritariamente em português** (validações, mensagens, UI)

---

## ⚠️ **ÚNICO PONTO DE ATENÇÃO: LOCALE DE DATA**

### 📅 **Bibliotecas de Data Encontradas:**

O projeto usa:
- **date-fns** v3.6.0
- **react-day-picker** v8.10.1

Essas bibliotecas precisam de **configuração explícita de locale pt-BR** para formatar datas corretamente.

---

## 🔧 **AÇÕES NECESSÁRIAS**

### 1️⃣ **Configurar locale pt-BR no Componente Calendar**

**Arquivo:** `src/components/ui/calendar.tsx`

**Problema:** O componente não tem locale configurado, então pode exibir nomes de meses/dias em inglês.

**Solução:**

```tsx
// ANTES (código atual)
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      // ... resto do código
      {...props}
    />
  );
}
```

```tsx
// DEPOIS (com locale pt-BR)
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { ptBR } from "date-fns/locale"; // ← ADICIONAR

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      locale={ptBR} // ← ADICIONAR
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      // ... resto do código
      {...props}
    />
  );
}
```

---

### 2️⃣ **Criar Utilitário de Formatação de Data**

**Arquivo a criar:** `src/lib/date-utils.ts`

**Motivo:** Centralizar formatação de datas em português

**Código:**

```typescript
// src/lib/date-utils.ts

import { format, formatDistance, formatRelative, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formata uma data no padrão brasileiro
 * @param date - Data a ser formatada (Date, string ISO, timestamp)
 * @param pattern - Padrão de formatação (default: dd/MM/yyyy)
 * @returns String formatada em português
 */
export function formatDate(
  date: Date | string | number,
  pattern: string = 'dd/MM/yyyy'
): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  return format(parsedDate, pattern, { locale: ptBR });
}

/**
 * Formata data e hora no padrão brasileiro
 * @param date - Data a ser formatada
 * @returns String no formato "dd/MM/yyyy HH:mm"
 */
export function formatDateTime(date: Date | string | number): string {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
}

/**
 * Formata apenas a hora
 * @param date - Data a ser formatada
 * @returns String no formato "HH:mm"
 */
export function formatTime(date: Date | string | number): string {
  return formatDate(date, 'HH:mm');
}

/**
 * Formata data em formato relativo (ex: "há 2 dias")
 * @param date - Data a ser formatada
 * @param baseDate - Data base para comparação (default: agora)
 * @returns String formatada em português
 */
export function formatDateRelative(
  date: Date | string | number,
  baseDate: Date = new Date()
): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  return formatDistance(parsedDate, baseDate, { 
    locale: ptBR,
    addSuffix: true 
  });
}

/**
 * Formata data em formato relativo completo
 * Ex: "ontem às 15:30", "hoje às 10:00"
 */
export function formatDateRelativeFull(
  date: Date | string | number,
  baseDate: Date = new Date()
): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  return formatRelative(parsedDate, baseDate, { locale: ptBR });
}

/**
 * Formata data para exibição em lista/tabela
 * Ex: "25 Dez 2025, 14:30"
 */
export function formatDateCompact(date: Date | string | number): string {
  return formatDate(date, "dd MMM yyyy, HH:mm");
}

/**
 * Formata data por extenso
 * Ex: "25 de dezembro de 2025"
 */
export function formatDateLong(date: Date | string | number): string {
  return formatDate(date, "dd 'de' MMMM 'de' yyyy");
}

/**
 * Formata dia da semana
 * Ex: "Segunda-feira", "Terça-feira"
 */
export function formatWeekday(date: Date | string | number): string {
  return formatDate(date, 'EEEE');
}

/**
 * Formata mês e ano
 * Ex: "Dezembro de 2025"
 */
export function formatMonthYear(date: Date | string | number): string {
  return formatDate(date, "MMMM 'de' yyyy");
}

/**
 * Verifica se uma data é hoje
 */
export function isToday(date: Date | string | number): boolean {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  const today = new Date();
  return (
    parsedDate.getDate() === today.getDate() &&
    parsedDate.getMonth() === today.getMonth() &&
    parsedDate.getFullYear() === today.getFullYear()
  );
}

/**
 * Verifica se uma data é ontem
 */
export function isYesterday(date: Date | string | number): boolean {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    parsedDate.getDate() === yesterday.getDate() &&
    parsedDate.getMonth() === yesterday.getMonth() &&
    parsedDate.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * Verifica se uma data é amanhã
 */
export function isTomorrow(date: Date | string | number): boolean {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    parsedDate.getDate() === tomorrow.getDate() &&
    parsedDate.getMonth() === tomorrow.getMonth() &&
    parsedDate.getFullYear() === tomorrow.getFullYear()
  );
}

/**
 * Formata data inteligente (hoje/ontem/amanhã ou data normal)
 */
export function formatDateSmart(date: Date | string | number): string {
  if (isToday(date)) return 'Hoje';
  if (isYesterday(date)) return 'Ontem';
  if (isTomorrow(date)) return 'Amanhã';
  return formatDate(date);
}
```

---

### 3️⃣ **Substituir Formatações Manuais de Data**

**Buscar e substituir** em todos os arquivos do projeto:

**Padrões a buscar:**
```typescript
// ❌ EVITAR formatação manual
new Date().toLocaleDateString()
new Date().toLocaleString()
date.toISOString().split('T')[0]
format(date, 'dd/MM/yyyy') // sem locale
```

**Substituir por:**
```typescript
// ✅ USAR utilitário centralizado
import { formatDate, formatDateTime } from '@/lib/date-utils';

formatDate(date)          // dd/MM/yyyy
formatDateTime(date)      // dd/MM/yyyy HH:mm
formatDateRelative(date)  // "há 2 dias"
formatDateSmart(date)     // "Hoje", "Ontem", ou data
```

---

### 4️⃣ **Adicionar Configuração Global de Locale (Opcional)**

**Arquivo a criar:** `src/lib/locale-config.ts`

**Motivo:** Garantir que todas as instâncias usem pt-BR

**Código:**

```typescript
// src/lib/locale-config.ts

import { setDefaultOptions } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Configura locale padrão do date-fns para pt-BR
 * Deve ser chamado no início da aplicação (main.tsx)
 */
export function setupLocale() {
  setDefaultOptions({
    locale: ptBR,
    weekStartsOn: 0, // Domingo = 0, Segunda = 1
  });
}
```

**Usar em:** `src/main.tsx`

```tsx
// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { setupLocale } from './lib/locale-config'; // ← ADICIONAR

setupLocale(); // ← ADICIONAR (antes do render)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

---

### 5️⃣ **Configurar Timezone para Brasília (Opcional)**

Se o sistema precisa trabalhar especificamente com timezone de Brasília:

**Opção 1: Forçar UTC-3 no backend (Supabase)**

Nas migrations, garantir que datas sejam armazenadas com timezone:

```sql
-- Exemplo: coluna created_at sempre em UTC-3
created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'America/Sao_Paulo')
```

**Opção 2: Converter no frontend ao exibir**

```typescript
// src/lib/date-utils.ts

import { toZonedTime } from 'date-fns-tz';

const BRASILIA_TIMEZONE = 'America/Sao_Paulo';

export function toBrasiliaTime(date: Date | string | number): Date {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  return toZonedTime(parsedDate, BRASILIA_TIMEZONE);
}
```

**Nota:** Para timezone, precisa instalar:
```bash
npm install date-fns-tz
```

---

## 📝 **CHECKLIST DE IMPLEMENTAÇÃO**

### ✅ **Tarefas Obrigatórias:**

- [ ] 1. Adicionar locale pt-BR no componente `calendar.tsx`
- [ ] 2. Criar arquivo `src/lib/date-utils.ts` com funções utilitárias
- [ ] 3. Buscar e substituir formatações manuais de data
- [ ] 4. Testar calendário (deve exibir meses/dias em português)
- [ ] 5. Testar formatação de datas em orçamentos/pedidos
- [ ] 6. Verificar componentes que usam datas:
  - [ ] `QuoteHistoryPanel`
  - [ ] `ClientInteractionsTimeline`
  - [ ] `OrderDetailPage`
  - [ ] `BIDashboard` (gráficos de tempo)
  - [ ] `NotificationsPopover` (tempo relativo)

### 🔧 **Tarefas Opcionais (Recomendadas):**

- [ ] 7. Criar `src/lib/locale-config.ts`
- [ ] 8. Chamar `setupLocale()` em `main.tsx`
- [ ] 9. Instalar `date-fns-tz` se precisar timezone específico
- [ ] 10. Adicionar testes para funções de data

---

## 🧪 **TESTES A REALIZAR**

Após implementar as mudanças:

### 1. **Calendário**
- Abrir qualquer página com o componente `Calendar`
- Verificar se os nomes dos meses estão em português
- Verificar se os dias da semana estão em português
- Exemplo esperado: "Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"

### 2. **Formatação de Datas**
- Verificar orçamentos: data de criação, validade
- Verificar pedidos: data do pedido
- Verificar histórico: "há 2 dias", "ontem", "hoje"
- Formato esperado: `25/12/2025` ou `25 de dezembro de 2025`

### 3. **Gráficos e BI**
- Dashboard: eixo X de gráficos de tempo
- Formato esperado: "Jan", "Fev", "Mar" (não "Jan", "Feb", "Mar")

### 4. **Notificações**
- Tempo relativo: "há 5 minutos", "há 2 horas", "há 3 dias"
- Não deve aparecer "5 minutes ago", "2 hours ago"

---

## 📦 **EXEMPLO DE USO DAS FUNÇÕES**

### **Antes:**
```tsx
// ❌ Inconsistente e sem locale
<div>{new Date(quote.created_at).toLocaleDateString()}</div>
<div>{format(quote.valid_until, 'dd/MM/yyyy')}</div>
<div>{new Date(order.created_at).toISOString().split('T')[0]}</div>
```

### **Depois:**
```tsx
// ✅ Consistente e em português
import { formatDate, formatDateTime, formatDateRelative } from '@/lib/date-utils';

<div>{formatDate(quote.created_at)}</div>
<div>{formatDate(quote.valid_until)}</div>
<div>{formatDateTime(order.created_at)}</div>
<div>{formatDateRelative(notification.created_at)}</div>
```

---

## 🎨 **EXEMPLOS DE OUTPUT**

Com as configurações corretas, você verá:

| Função | Input | Output em pt-BR |
|--------|-------|-----------------|
| `formatDate()` | 2025-12-25 | 25/12/2025 |
| `formatDateTime()` | 2025-12-25T14:30 | 25/12/2025 14:30 |
| `formatDateLong()` | 2025-12-25 | 25 de dezembro de 2025 |
| `formatDateRelative()` | 2 dias atrás | há 2 dias |
| `formatWeekday()` | 2025-12-25 | Quarta-feira |
| `formatMonthYear()` | 2025-12-25 | Dezembro de 2025 |
| `formatDateSmart()` | hoje | Hoje |
| `formatDateSmart()` | ontem | Ontem |
| `formatDateSmart()` | 2025-12-23 | 23/12/2025 |

---

## 🚀 **PASSOS PARA IMPLEMENTAÇÃO RÁPIDA**

### **Script de Deploy:**

```bash
# 1. Clonar repo (se ainda não tiver)
git clone https://github.com/adm01-debug/gifts-store.git
cd gifts-store

# 2. Criar branch
git checkout -b fix/locale-pt-br

# 3. Criar arquivos novos
mkdir -p src/lib
touch src/lib/date-utils.ts
touch src/lib/locale-config.ts

# 4. Editar calendar.tsx (adicionar locale)
# (fazer manualmente ou via editor)

# 5. Editar main.tsx (adicionar setupLocale)
# (fazer manualmente ou via editor)

# 6. Testar localmente
npm run dev

# 7. Commit e push
git add .
git commit -m "feat: configurar locale pt-BR para datas"
git push origin fix/locale-pt-br

# 8. Abrir PR no GitHub
```

---

## ✅ **RESUMO FINAL**

### ❌ **NÃO É NECESSÁRIO:**
- Remover dependências de i18n (não existem)
- Remover arquivos de tradução (não existem)
- Alterar código que use `useTranslation` (não usa)
- Remover imports de i18next (não tem)

### ✅ **O QUE FAZER:**
1. Adicionar `locale={ptBR}` no componente Calendar
2. Criar utilitário `date-utils.ts`
3. Substituir formatações manuais de data
4. Testar exibição de datas em todo o sistema

### ⏱️ **Tempo estimado:** 1-2 horas

### 🎯 **Resultado esperado:**
Sistema 100% em português do Brasil, com datas, calendários e formatações corretas.

---

**Última atualização:** 26/12/2025  
**Status:** ✅ Análise concluída, implementação pendente
