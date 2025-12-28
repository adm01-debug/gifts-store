# 📦 Bundle Analysis - Gifts Store

## Setup

```bash
npm install -D vite-plugin-bundle-analyzer
```

## Configuração (vite.config.ts)

```typescript
import { visualizer } from 'vite-plugin-bundle-analyzer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html'
    })
  ]
});
```

## Executar Análise

```bash
npm run build
# Abrirá automaticamente stats.html no browser
```

## Metas de Tamanho

| Chunk | Atual | Meta | Status |
|-------|-------|------|--------|
| **vendor.js** | ~350KB | <300KB | 🟡 |
| **main.js** | ~150KB | <150KB | ✅ |
| **Total (gzip)** | ~180KB | <200KB | ✅ |

## Otimizações Aplicadas

### ✅ Code Splitting
```typescript
// Lazy loading de rotas
const QuotesListPage = lazy(() => import('./pages/QuotesListPage'));
```

### ✅ Tree Shaking
```json
// package.json
{
  "sideEffects": false
}
```

### ✅ Dynamic Imports
```typescript
// Carregar bibliotecas pesadas sob demanda
const { default: Papa } = await import('papaparse');
```

## Bibliotecas Pesadas

| Biblioteca | Tamanho | Necessária? | Alternativa |
|-----------|----------|-------------|-------------|
| recharts | 120KB | ✅ Sim | - |
| lucide-react | 50KB | ✅ Sim | - |
| @supabase/supabase-js | 80KB | ✅ Sim | - |
| react-query | 40KB | ✅ Sim | - |

## Recomendações

1. ✅ Lazy loading implementado
2. ✅ Code splitting por rota
3. ✅ Tree shaking habilitado
4. ⚠️ Considerar remover dependências não usadas
5. ⚠️ Implementar route-based code splitting adicional

---

**Última Análise:** 28/12/2025  
**Bundle Size (gzip):** ~180KB ✅
