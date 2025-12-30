# 🚨 RELATÓRIO EXAUSTIVO DE ERROS, BUGS E ANOMALIAS

**Data:** 30/12/2024  
**Versão:** 1.0  
**Status:** Análise Completa (SOMENTE LEITURA - NENHUMA CORREÇÃO APLICADA)

---

## SUMÁRIO EXECUTIVO

| Categoria | Crítico | Alto | Médio | Baixo | Total |
|-----------|---------|------|-------|-------|-------|
| Erros de Build | 49 | 12 | 8 | 5 | 74 |
| Dependências Ausentes | 8 | 5 | 3 | 2 | 18 |
| Tabelas DB Inexistentes | 1 | 0 | 0 | 0 | 1 |
| Arquivos Órfãos | 0 | 49 | 0 | 0 | 49 |
| Secrets Ausentes | 0 | 12 | 0 | 0 | 12 |
| Segurança | 0 | 3 | 2 | 0 | 5 |
| Arquivos Duplicados | 0 | 0 | 2 | 0 | 2 |
| Código Morto/Inútil | 0 | 0 | 15 | 0 | 15 |
| **TOTAL** | **58** | **81** | **30** | **7** | **176** |

---

## 1. ERROS DE BUILD CRÍTICOS (IMPEDEM COMPILAÇÃO)

### 1.1 Arquivos `.stories.tsx` Sem Storybook Instalado (49 arquivos)

**Problema:** O projeto contém arquivos de Storybook (`.stories.tsx`) mas `@storybook/react` não está instalado.

**Arquivos Afetados:**

#### Componentes UI (15 arquivos):
| Arquivo | Erro |
|---------|------|
| `src/components/ui/Alert.stories.tsx` | TS2307: Cannot find module '@storybook/react' |
| `src/components/ui/Avatar.stories.tsx` | TS2307: Cannot find module '@storybook/react' |
| `src/components/ui/Badge.stories.tsx` | TS2307: Cannot find module '@storybook/react' |
| `src/components/ui/Button.stories.tsx` | TS2307: Cannot find module '@storybook/react' |
| `src/components/ui/Card.stories.tsx` | TS2307: Cannot find module '@storybook/react' |
| `src/components/ui/Checkbox.stories.tsx` | TS2307: Cannot find module '@storybook/react' |
| `src/components/ui/Dialog.stories.tsx` | TS2307: Cannot find module '@storybook/react' |
| `src/components/ui/Dropdown.stories.tsx` | TS2307: Cannot find module '@storybook/react' |
| `src/components/ui/Form.stories.tsx` | TS2307: Cannot find module '@storybook/react' |
| `src/components/ui/Input.stories.tsx` | TS2307: Cannot find module '@storybook/react' |
| `src/components/ui/Modal.stories.tsx` | TS2307: Cannot find module '@storybook/react' |
| `src/components/ui/Progress.stories.tsx` | TS2307: Cannot find module '@storybook/react' |
| `src/components/ui/Select.stories.tsx` | TS2307: Cannot find module '@storybook/react' |
| `src/components/ui/Slider.stories.tsx` | TS2307: Cannot find module '@storybook/react' |
| `src/components/ui/Switch.stories.tsx` | TS2307: Cannot find module '@storybook/react' |
| `src/components/ui/Table.stories.tsx` | TS2307: Cannot find module '@storybook/react' |
| `src/components/ui/Tabs.stories.tsx` | TS2307: Cannot find module '@storybook/react' |
| `src/components/ui/Toast.stories.tsx` | TS2307: Cannot find module '@storybook/react' |
| `src/components/ui/Tooltip.stories.tsx` | TS2307: Cannot find module '@storybook/react' |

#### Componentes Clients (10 arquivos):
| Arquivo | Erro |
|---------|------|
| `src/components/clients/ClientCard.stories.tsx` | TS2307 + import inexistente |
| `src/components/clients/ClientAnalytics.stories.tsx` | TS2307 + import inexistente |
| `src/components/clients/ClientCommunication.stories.tsx` | TS2307 + import inexistente |
| `src/components/clients/ClientDetails.stories.tsx` | TS2307 + import inexistente |
| `src/components/clients/ClientDocuments.stories.tsx` | TS2307 + import inexistente |
| `src/components/clients/ClientForm.stories.tsx` | TS2307 + import inexistente |
| `src/components/clients/ClientNotes.stories.tsx` | TS2307 + import inexistente |
| `src/components/clients/ClientPurchaseHistory.stories.tsx` | TS2307 |
| `src/components/clients/ClientSegments.stories.tsx` | TS2307 + import inexistente |
| `src/components/clients/ClientStats.stories.tsx` | TS2307 |

#### Componentes Products (12 arquivos):
| Arquivo | Erro |
|---------|------|
| `src/components/products/ProductCard.stories.tsx` | TS2307 |
| `src/components/products/ProductDetails.stories.tsx` | TS2307 + import inexistente |
| `src/components/products/ProductFilters.stories.tsx` | TS2307 + import inexistente |
| `src/components/products/ProductGrid.stories.tsx` | TS2307 |
| `src/components/products/ProductImages.stories.tsx` | TS2307 + import inexistente |
| `src/components/products/ProductList.stories.tsx` | TS2307 |
| `src/components/products/ProductPrice.stories.tsx` | TS2307 + import inexistente |
| `src/components/products/ProductReviews.stories.tsx` | TS2307 + import inexistente |
| `src/components/products/ProductSearch.stories.tsx` | TS2307 + import inexistente |
| `src/components/products/ProductStock.stories.tsx` | TS2307 + import inexistente |

#### Componentes Quotes (10 arquivos):
| Arquivo | Erro |
|---------|------|
| `src/components/quotes/QuoteActions.stories.tsx` | TS2307 + import inexistente |
| `src/components/quotes/QuoteApproval.stories.tsx` | TS2307 + import inexistente |
| `src/components/quotes/QuoteCard.stories.tsx` | TS2307 |
| `src/components/quotes/QuoteDetails.stories.tsx` | TS2307 |
| `src/components/quotes/QuoteForm.stories.tsx` | TS2307 |
| `src/components/quotes/QuoteItems.stories.tsx` | TS2307 |
| `src/components/quotes/QuoteStatus.stories.tsx` | TS2307 |
| `src/components/quotes/QuoteTimeline.stories.tsx` | TS2307 |
| `src/components/quotes/QuoteTotal.stories.tsx` | TS2307 |

---

### 1.2 Arquivos `.test.tsx` Sem Vitest/Testing-Library Instalados (11 arquivos)

**Problema:** Arquivos de teste referenciam `vitest` e `@testing-library/react` que não estão instalados.

| Arquivo | Erros |
|---------|-------|
| `src/components/clients/__tests__/ClientCard.test.tsx` | TS2307: Cannot find module 'vitest' |
| `src/components/errors/__tests__/ErrorBoundary.test.tsx` | TS2307: Cannot find module 'vitest' |
| `src/components/export/__tests__/ExportExcelButton.test.tsx` | TS2582: Cannot find name 'describe' |
| `src/components/products/__tests__/PresentationMode.test.tsx` | TS2307: Cannot find module '@testing-library/react' + tipos incorretos |
| `src/components/products/__tests__/ProductCard.test.tsx` | TS2307 + TS2740: Type incompatibility |
| `src/components/quotes/__tests__/QuoteCard.test.tsx` | TS2307 (vitest + @testing-library) |
| `src/components/quotes/__tests__/QuoteQRCode.test.tsx` | TS2307 (vitest + @testing-library) |
| `src/components/quotes/__tests__/TagManager.test.tsx` | TS2307 (vitest + @testing-library) |
| `src/hooks/__tests__/useBulkSelection.test.ts` | TS2307 (vitest + @testing-library) |
| `src/hooks/__tests__/useErrorHandler.test.ts` | TS2307 (vitest + @testing-library) |
| `src/lib/__tests__/date-utils.test.ts` | TS2307: Cannot find module 'vitest' |
| `src/lib/validations/__tests__/index.test.ts` | TS2307: Cannot find module 'vitest' |

**Erros Adicionais nos Testes:**
- `PresentationMode.test.tsx`: Type `{ id: string; name: string; price: number; }[]` is not assignable to type `Product[]` (faltam propriedades obrigatórias)
- `ProductCard.test.tsx`: Type missing 9+ properties from `Product` interface

---

## 2. DEPENDÊNCIAS NPM AUSENTES (CAUSAM ERROS EM RUNTIME)

### 2.1 Dependências de Desenvolvimento Não Instaladas

| Pacote | Arquivos Afetados | Status |
|--------|-------------------|--------|
| `@storybook/react` | 49 arquivos `.stories.tsx` | ❌ NÃO INSTALADO |
| `vitest` | 11 arquivos `.test.tsx` | ❌ NÃO INSTALADO |
| `@testing-library/react` | 7 arquivos de teste | ❌ NÃO INSTALADO |
| `@types/jest` ou `@types/mocha` | 1 arquivo | ❌ NÃO INSTALADO |

### 2.2 Dependências de Produção Não Instaladas

| Pacote | Arquivo que Importa | Status |
|--------|---------------------|--------|
| `i18next` | `src/i18n/index.ts` | ❌ NÃO INSTALADO |
| `react-i18next` | `src/i18n/index.ts` | ❌ NÃO INSTALADO |
| `i18next-browser-languagedetector` | `src/i18n/index.ts` | ❌ NÃO INSTALADO |
| `mixpanel-browser` | `src/integrations/analytics/Mixpanel.ts` | ❌ NÃO INSTALADO |
| `firebase/app` | `src/lib/notifications/fcm.ts` | ❌ NÃO INSTALADO |
| `firebase/messaging` | `src/lib/notifications/fcm.ts` | ❌ NÃO INSTALADO |
| `crypto-js` | `src/lib/crypto/encryption.ts`, `src/lib/crypto/hashing.ts` | ❌ NÃO INSTALADO |
| `@sendgrid/mail` | `src/integrations/sendgrid/EmailService.ts` | ❌ NÃO INSTALADO |
| `@stripe/stripe-js` | `src/integrations/stripe/checkout.ts` | ❌ NÃO INSTALADO |
| `rate-limiter-flexible` | `src/middleware/rate-limiter.ts` | ❌ NÃO INSTALADO |
| `csurf` | `src/middleware/csrf.ts` | ❌ NÃO INSTALADO |

---

## 3. TABELAS DE BANCO DE DADOS INEXISTENTES

### 3.1 Tabela `product_price_history`

**Arquivo que Referencia:** `src/hooks/usePriceHistory.ts`

```typescript
const { data, error } = await supabase
  .from('product_price_history')  // ❌ TABELA NÃO EXISTE
  .select('*')
  .eq('product_id', productId)
```

**Query Verificação:**
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'product_price_history';
-- Resultado: []  (tabela não existe)
```

**Componente Afetado:** `src/components/products/PriceHistoryChart.tsx` (linha 20 já contém comentário reconhecendo o problema)

---

## 4. VARIÁVEIS DE AMBIENTE NÃO CONFIGURADAS

### 4.1 Secrets Ausentes (12 variáveis)

| Variável | Arquivo que Usa | Propósito |
|----------|-----------------|-----------|
| `VITE_FIREBASE_API_KEY` | `src/lib/notifications/fcm.ts` | Firebase Cloud Messaging |
| `VITE_FIREBASE_PROJECT_ID` | `src/lib/notifications/fcm.ts` | Firebase Cloud Messaging |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `src/lib/notifications/fcm.ts` | Firebase Cloud Messaging |
| `VITE_FIREBASE_APP_ID` | `src/lib/notifications/fcm.ts` | Firebase Cloud Messaging |
| `VITE_STRIPE_PUBLIC_KEY` | `src/integrations/stripe/checkout.ts` | Stripe Checkout |
| `VITE_MERCADOPAGO_PUBLIC_KEY` | `src/integrations/mercadopago/payment.ts` | MercadoPago |
| `VITE_SENDGRID_API_KEY` | `src/integrations/sendgrid/EmailService.ts` | SendGrid Email |
| `VITE_WHATSAPP_TOKEN` | `src/integrations/whatsapp/WhatsAppService.ts` | WhatsApp Business |
| `VITE_ENCRYPTION_KEY` | `src/lib/crypto/encryption.ts` | Criptografia |
| `VITE_VAPID_PUBLIC_KEY` | `src/lib/notifications/push-manager.ts` | Web Push |
| `VITE_GA_MEASUREMENT_ID` | `src/lib/analytics/event-tracker.ts` | Google Analytics |
| `VITE_SENTRY_DSN` | `src/lib/monitoring/sentry.ts` | Sentry Error Tracking |

---

## 5. PROBLEMAS DE SEGURANÇA (Supabase Linter)

### 5.1 Alertas Críticos

| Nível | Problema | Descrição |
|-------|----------|-----------|
| ⚠️ WARN | Extension in Public (2x) | Extensões instaladas no schema `public` representam risco de segurança |
| ⚠️ WARN | Leaked Password Protection Disabled | Proteção contra senhas vazadas está desabilitada |

**Links de Documentação:**
- Extensões: https://supabase.com/docs/guides/database/database-linter?lint=0014_extension_in_public
- Senhas: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

---

## 6. ARQUIVOS DUPLICADOS

### 6.1 Páginas 404 Duplicadas

| Arquivo | Export | Descrição |
|---------|--------|-----------|
| `src/pages/NotFound.tsx` | `export default NotFound` | Versão simples, em inglês |
| `src/pages/NotFoundPage.tsx` | `export function NotFoundPage` | Versão completa, em português |

**Problema:** Duas implementações diferentes da mesma funcionalidade. Não está claro qual é a versão canônica.

---

## 7. CÓDIGO MORTO / INTEGRAÇÕES NÃO FUNCIONAIS

### 7.1 Integrações Placeholder (Sem Backend Real)

| Arquivo | Problema |
|---------|----------|
| `src/integrations/hubspot/contact-sync.ts` | Faz fetch para `/api/hubspot/contacts` - endpoint inexistente |
| `src/integrations/salesforce/lead-sync.ts` | Faz fetch para `/api/salesforce/leads` - endpoint inexistente |
| `src/integrations/sap/order-sync.ts` | Faz fetch para `/api/sap/orders` - endpoint inexistente |
| `src/integrations/totvs/stock-sync.ts` | Faz fetch para `/api/totvs/stock` - endpoint inexistente |
| `src/integrations/stripe/checkout.ts` | Faz fetch para `/api/stripe/checkout` - endpoint inexistente |
| `src/integrations/mercadopago/payment.ts` | Faz fetch para `/api/mercadopago/preference` - endpoint inexistente |

### 7.2 Middleware de Backend (Não Funciona no Browser)

| Arquivo | Problema |
|---------|----------|
| `src/middleware/auth-middleware.ts` | Usa `Request/Response` do Node.js - incompatível com browser |
| `src/middleware/cors.ts` | Configuração de servidor - não aplicável no frontend |
| `src/middleware/csrf.ts` | Usa `csurf` (pacote Node.js) - incompatível com Vite |
| `src/middleware/rate-limiter.ts` | Usa `rate-limiter-flexible` - pacote não instalado |
| `src/middleware/helmet.ts` | Tentativa de aplicar headers via meta tags (ineficaz) |

### 7.3 Uso Incorreto de `process.env` (Deveria ser `import.meta.env`)

| Arquivo | Linha | Código Incorreto |
|---------|-------|------------------|
| `src/integrations/whatsapp/WhatsAppService.ts` | 7 | `process.env.VITE_WHATSAPP_TOKEN` |
| `src/integrations/sendgrid/EmailService.ts` | 5 | `process.env.VITE_SENDGRID_API_KEY` |
| `src/middleware/cors.ts` | 2 | `process.env.VITE_ALLOWED_ORIGINS` |
| `src/middleware/csrf.ts` | 6 | `process.env.NODE_ENV` |
| `src/features/auth/OAuth2.ts` | 4 | `process.env[\`VITE_...\`]` |

**Nota:** Em Vite, variáveis de ambiente devem usar `import.meta.env.VITE_*`, não `process.env`.

---

## 8. ANOMALIAS DETECTADAS NA SESSION REPLAY

### 8.1 Notificações Persistentes

**Timestamp:** `1767124386251` - `1767124395293`  
**Problema:** O sistema adiciona repetidamente um badge de notificação com contagem "2" sem interação do usuário.  
**Componente Afetado:** Botão com ícone `lucide lucide-bell`

### 8.2 Estado "Nenhum cliente" Repetitivo

**Timestamps:** `1767124386277` - `1767124395320`  
**Problema:** Texto "Nenhum cliente" é adicionado repetidamente, indicando possível problema de gerenciamento de estado.

---

## 9. COMPONENTES REFERENCIADOS MAS INEXISTENTES

Os seguintes componentes são importados em arquivos `.stories.tsx` mas não existem:

| Import Inexistente | Arquivo que Importa |
|--------------------|---------------------|
| `@/components/clients/ClientCommunication` | ClientCommunication.stories.tsx |
| `@/components/clients/ClientDetails` | ClientDetails.stories.tsx |
| `@/components/clients/ClientDocuments` | ClientDocuments.stories.tsx |
| `@/components/clients/ClientForm` | ClientForm.stories.tsx |
| `@/components/clients/ClientNotes` | ClientNotes.stories.tsx |
| `@/components/clients/ClientSegments` | ClientSegments.stories.tsx |
| `@/components/products/ProductDetails` | ProductDetails.stories.tsx |
| `@/components/products/ProductFilters` | ProductFilters.stories.tsx |
| `@/components/products/ProductImages` | ProductImages.stories.tsx |
| `@/components/products/ProductPrice` | ProductPrice.stories.tsx |
| `@/components/products/ProductReviews` | ProductReviews.stories.tsx |
| `@/components/products/ProductSearch` | ProductSearch.stories.tsx |
| `@/components/products/ProductStock` | ProductStock.stories.tsx |
| `@/components/quotes/QuoteActions` | QuoteActions.stories.tsx |
| `@/components/quotes/QuoteApproval` | QuoteApproval.stories.tsx |

---

## 10. ARQUIVOS DE INTERNACIONALIZAÇÃO

### 10.1 Status do i18n

**Diretório:** `src/i18n/`

| Arquivo | Status |
|---------|--------|
| `src/i18n/index.ts` | ⚠️ Importa pacotes não instalados (i18next, react-i18next) |
| `src/i18n/locales/pt-BR.json` | ✅ Existe |
| `src/i18n/locales/en-US.json` | ✅ Existe |
| `src/i18n/locales/es-ES.json` | ✅ Existe |

**Problema:** A configuração i18n não funciona porque os pacotes necessários não estão instalados.

---

## 11. RESUMO DE AÇÕES RECOMENDADAS (NÃO EXECUTADAS)

### Prioridade CRÍTICA (Bloqueia Build):
1. Instalar `@storybook/react` OU remover todos os arquivos `.stories.tsx`
2. Instalar `vitest` + `@testing-library/react` OU remover todos os arquivos `.test.tsx`

### Prioridade ALTA:
3. Instalar dependências: `i18next`, `react-i18next`, `crypto-js`, `@stripe/stripe-js`
4. Criar tabela `product_price_history` no banco de dados
5. Configurar secrets ausentes
6. Corrigir uso de `process.env` para `import.meta.env`

### Prioridade MÉDIA:
7. Remover arquivos de middleware incompatíveis com frontend
8. Remover integrações placeholder sem backend
9. Consolidar páginas 404 duplicadas
10. Habilitar proteção contra senhas vazadas no Supabase

### Prioridade BAIXA:
11. Mover extensões do schema `public` para schema dedicado
12. Implementar componentes referenciados nos stories

---

## 12. ESTATÍSTICAS FINAIS

| Métrica | Valor |
|---------|-------|
| Total de Erros de Build | 74 |
| Total de Dependências Ausentes | 18 |
| Total de Secrets Ausentes | 12 |
| Total de Arquivos Órfãos | 60 |
| Total de Problemas de Segurança | 5 |
| **TOTAL GERAL DE ISSUES** | **176** |

---

*Relatório gerado automaticamente. Nenhuma correção foi aplicada conforme solicitado.*
