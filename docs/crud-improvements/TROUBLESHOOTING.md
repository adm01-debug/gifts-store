# 🔧 TROUBLESHOOTING - PROBLEMAS COMUNS

---

## ❌ ERRO: "Cannot find module '@unified-suite/shared-crud'"

**Sintomas:**
```
Error: Cannot find module '@unified-suite/shared-crud'
```

**Causa:** Package não instalado ou cache NPM corrompido

**Solução:**
```bash
# 1. Limpar cache NPM
npm cache clean --force

# 2. Deletar node_modules
rm -rf node_modules package-lock.json

# 3. Reinstalar
npm install

# 4. Instalar shared package
npm install @unified-suite/shared-crud

# 5. Verificar
npm list @unified-suite/shared-crud
```

**Se persistir:**
```bash
# Voltar à raiz do monorepo
cd ../..
npm install
npm run build # Build do shared package
cd apps/[SEU-SISTEMA]
npm install
```

---

## ❌ ERRO: Migration falha - "table already exists"

**Sintomas:**
```
Error: relation "saved_filters" already exists
```

**Causa:** Tabela foi criada anteriormente

**Solução:**
```sql
-- Opção 1: Usar IF NOT EXISTS
CREATE TABLE IF NOT EXISTS saved_filters (...);

-- Opção 2: Dropar e recriar (CUIDADO: perde dados)
DROP TABLE IF EXISTS saved_filters CASCADE;
CREATE TABLE saved_filters (...);

-- Opção 3: Usar migration rollback
npx supabase migration rollback
```

---

## ❌ ERRO: TypeScript não reconhece tipos do shared package

**Sintomas:**
```typescript
// Red squiggly lines
import { SavedFiltersDropdown } from '@unified-suite/shared-crud';
```

**Causa:** Tipos não compilados ou tsconfig incorreto

**Solução:**
```bash
# 1. Build do shared package
cd ../../packages/shared-crud
npm run build

# 2. Verificar se dist/ foi criado
ls -la dist/

# 3. Voltar ao sistema
cd ../../apps/[SEU-SISTEMA]

# 4. Reiniciar TypeScript no VSCode
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

**Adicionar ao tsconfig.json (se necessário):**
```json
{
  "compilerOptions": {
    "paths": {
      "@unified-suite/shared-crud": ["../../packages/shared-crud/src"]
    }
  }
}
```

---

## ❌ ERRO: Import CSV retorna 100% erros

**Sintomas:**
- Upload CSV → todos os registros com erro

**Causa 1:** Headers não correspondem ao schema Zod

**Solução:**
```typescript
// Verificar schema vs CSV headers
const schema = z.object({
  nome: z.string(),  // CSV deve ter coluna "nome"
  preco: z.number(), // CSV deve ter coluna "preco"
});

// CSV correto:
// nome,preco
// Produto A,100
// Produto B,200
```

**Causa 2:** Tipos incompatíveis

**Solução:**
```typescript
// Use z.coerce para converter strings
const schema = z.object({
  preco: z.coerce.number(), // Converte "100" → 100
  data: z.coerce.date(),    // Converte "2025-01-01" → Date
});
```

---

## ❌ ERRO: Busca fulltext não retorna resultados

**Sintomas:**
- Busca qualquer termo → 0 resultados

**Causa:** Materialized view não foi criada ou está vazia

**Solução:**
```sql
-- 1. Verificar se view existe
SELECT * FROM pg_matviews 
WHERE matviewname = '[NOME]_search_index';

-- 2. Verificar conteúdo
SELECT * FROM [NOME]_search_index LIMIT 10;

-- 3. Refresh manual
REFRESH MATERIALIZED VIEW [NOME]_search_index;

-- 4. Verificar trigger
SELECT tgname FROM pg_trigger 
WHERE tgrelid = '[TABELA]'::regclass;
```

**Se view estiver vazia:**
- Verifique se tabela original tem dados
- Verifique filtro `WHERE deleted_at IS NULL`

---

## ❌ ERRO: Filtro salvo não persiste

**Sintomas:**
- Salva filtro → reload → filtro sumiu

**Causa:** RLS não configurado ou user_id incorreto

**Solução:**
```sql
-- Verificar RLS
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'saved_filters';
-- rowsecurity deve ser TRUE

-- Verificar policies
SELECT * FROM pg_policies 
WHERE tablename = 'saved_filters';

-- Recriar policies
DROP POLICY IF EXISTS "Users can manage own filters" ON saved_filters;

CREATE POLICY "Users can view own filters"
ON saved_filters FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own filters"
ON saved_filters FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own filters"
ON saved_filters FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own filters"
ON saved_filters FOR DELETE
USING (auth.uid() = user_id);
```

---

## ❌ ERRO: Performance lenta na busca

**Sintomas:**
- Busca demora > 2 segundos

**Causa:** Índices não criados

**Solução:**
```sql
-- Verificar índices
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = '[NOME]_search_index';

-- Criar índice GIN (fulltext)
CREATE INDEX idx_[NOME]_search_gin 
ON [NOME]_search_index 
USING GIN(search_vector);

-- Criar índice trigram (fuzzy search)
CREATE INDEX idx_[NOME]_search_trgm 
ON [NOME]_search_index 
USING GIN([COLUNA] gin_trgm_ops);

-- Analisar query
EXPLAIN ANALYZE
SELECT * FROM [NOME]_search_index
WHERE search_vector @@ to_tsquery('portuguese', 'termo');
```

---

## ❌ ERRO: Import Excel não funciona

**Sintomas:**
- Upload .xlsx → nada acontece

**Causa:** Biblioteca XLSX não instalada

**Solução:**
```bash
npm install xlsx
npm install --save-dev @types/xlsx
```

**Verificar se está importado:**
```typescript
import * as XLSX from 'xlsx';
```

---

## ❌ ERRO: Componentes não renderizam

**Sintomas:**
- Tela branca ou erro no console

**Causa:** Dependências do shadcn/ui faltando

**Solução:**
```bash
# Instalar dependências do shadcn
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-dialog
npm install lucide-react
npm install sonner
```

---

## ⚠️ WARNING: Slow queries

**Sintomas:**
- Console mostra "Slow query detected"

**Solução:**
```sql
-- Adicionar índices compostos
CREATE INDEX idx_[TABELA]_composite 
ON [TABELA](campo1, campo2, deleted_at);

-- Usar partial index
CREATE INDEX idx_[TABELA]_active 
ON [TABELA](id) 
WHERE deleted_at IS NULL;
```

---

## 📞 ESCALATION MATRIX

**Nível 1 - Self-service (0-15 min)**
- Consultar este troubleshooting
- Consultar README do shared package
- Consultar GitHub Issues

**Nível 2 - Peer support (15-30 min)**
- Slack: #dev-crud-shared
- Pair programming com colega

**Nível 3 - Tech lead (30+ min)**
- Email: dev@promobrindes.com.br
- GitHub Issue com label "help-wanted"

---

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║     🔧 95% DOS PROBLEMAS TÊM SOLUÇÃO NESTE DOC                  ║
║     ⏱️  Tempo médio de resolução: < 10 minutos                  ║
║     📖 Sempre consultar antes de escalar                        ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```
