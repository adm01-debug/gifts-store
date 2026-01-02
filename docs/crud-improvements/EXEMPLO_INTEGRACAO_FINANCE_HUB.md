# 💰 EXEMPLO COMPLETO: INTEGRAÇÃO NO FINANCE HUB

## 🎯 Sistema: Finance Hub (P1 - Crítico)

**Funcionalidades a integrar:**
1. ✅ Filtros Salvos (lançamentos financeiros)
2. ✅ Busca Fulltext (transações, fornecedores, clientes)
3. ✅ Import CSV (lançamentos em lote)
4. ✅ Import Excel (planilhas contábeis)

**Tempo estimado:** 15 minutos

---

## 📋 PASSO A PASSO

### PASSO 1: Instalar Package (2 min)

```bash
cd apps/finance-hub
npm install @unified-suite/shared-crud
```

**Verificar instalação:**
```bash
grep "@unified-suite/shared-crud" package.json
# Deve aparecer nas dependencies
```

---

### PASSO 2: Migrations SQL (5 min)

```bash
# Criar migrations
npx supabase migration new saved_filters
npx supabase migration new fulltext_search

# Anotar números das migrations criadas
# Ex: 20250102120000_saved_filters.sql
```

**Copiar SQL do shared package:**

```bash
# Copiar template de filtros salvos
cp ../../packages/shared-crud/migrations/saved_filters.sql \
   supabase/migrations/20250102120000_saved_filters.sql

# Copiar template de busca fulltext
cp ../../packages/shared-crud/migrations/fulltext_search.sql \
   supabase/migrations/20250102120001_fulltext_search.sql
```

**IMPORTANTE: Adaptar SQL para tabelas do Finance Hub**

Edite `20250102120001_fulltext_search.sql`:

```sql
-- ANTES (template genérico):
CREATE MATERIALIZED VIEW mockup_search_index AS
SELECT id, product_name, variant_name FROM generated_mockups;

-- DEPOIS (Finance Hub específico):
CREATE MATERIALIZED VIEW lancamentos_search_index AS
SELECT 
  id,
  descricao,
  fornecedor,
  categoria,
  observacoes,
  to_tsvector('portuguese', 
    COALESCE(descricao, '') || ' ' ||
    COALESCE(fornecedor, '') || ' ' ||
    COALESCE(categoria, '') || ' ' ||
    COALESCE(observacoes, '')
  ) AS search_vector
FROM lancamentos_financeiros
WHERE deleted_at IS NULL;

CREATE INDEX idx_lancamentos_search 
  ON lancamentos_search_index 
  USING GIN(search_vector);

-- Trigger para auto-refresh
CREATE OR REPLACE FUNCTION refresh_lancamentos_search()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY lancamentos_search_index;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER refresh_lancamentos_search_trigger
AFTER INSERT OR UPDATE OR DELETE ON lancamentos_financeiros
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_lancamentos_search();
```

**Aplicar migrations:**

```bash
npx supabase db push
```

**Verificar se aplicou:**
```bash
npx supabase db diff
# Não deve mostrar diferenças
```

---

### PASSO 3: Integrar Componentes (5 min)

**Arquivo:** `apps/finance-hub/src/pages/Lancamentos.tsx`

```typescript
// ANTES: sem CRUD avançado
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

function LancamentosPage() {
  const [filtros, setFiltros] = useState({});
  
  const { data: lancamentos } = useQuery({
    queryKey: ['lancamentos', filtros],
    queryFn: async () => {
      let query = supabase.from('lancamentos_financeiros').select('*');
      
      if (filtros.categoria) {
        query = query.eq('categoria', filtros.categoria);
      }
      
      const { data } = await query;
      return data;
    },
  });

  return (
    <div>
      {/* Filtros básicos aqui */}
      {/* Tabela de lançamentos */}
    </div>
  );
}
```

```typescript
// DEPOIS: com CRUD avançado
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

// ✅ IMPORTAR DO SHARED PACKAGE
import {
  SavedFiltersDropdown,
  BuscaAvancada,
  FileImporter,
  useBuscaFulltext,
} from '@unified-suite/shared-crud';

function LancamentosPage() {
  const [filtros, setFiltros] = useState({});
  const [busca, setBusca] = useState('');
  const [showImport, setShowImport] = useState(false);

  // ✅ BUSCA FULLTEXT
  const { data: resultadosBusca, isLoading: isBuscando } = useBuscaFulltext(
    'lancamentos_search_index',
    busca,
    ['descricao', 'fornecedor', 'categoria']
  );

  // Query principal (com filtros)
  const { data: lancamentos } = useQuery({
    queryKey: ['lancamentos', filtros, busca],
    queryFn: async () => {
      let query = supabase.from('lancamentos_financeiros').select('*');
      
      // Aplicar busca fulltext
      if (busca && resultadosBusca) {
        const ids = resultadosBusca.map((r: any) => r.id);
        query = query.in('id', ids);
      }
      
      // Aplicar filtros salvos
      if (filtros.categoria) {
        query = query.eq('categoria', filtros.categoria);
      }
      if (filtros.data_inicio) {
        query = query.gte('data', filtros.data_inicio);
      }
      if (filtros.data_fim) {
        query = query.lte('data', filtros.data_fim);
      }
      
      const { data } = await query;
      return data;
    },
  });

  // ✅ SCHEMA PARA IMPORT CSV/EXCEL
  const lancamentoSchema = z.object({
    descricao: z.string().min(1, 'Descrição obrigatória'),
    valor: z.coerce.number().refine((v) => v !== 0, 'Valor não pode ser zero'),
    data: z.coerce.date(),
    categoria: z.enum(['receita', 'despesa', 'investimento']),
    fornecedor: z.string().optional(),
    observacoes: z.string().optional(),
  });

  const handleImport = async (lancamentos: z.infer<typeof lancamentoSchema>[]) => {
    const { error } = await supabase
      .from('lancamentos_financeiros')
      .insert(lancamentos);
    
    if (error) throw error;
    toast.success(`${lancamentos.length} lançamentos importados!`);
    setShowImport(false);
  };

  return (
    <div className="space-y-4">
      {/* ✅ BARRA DE FERRAMENTAS CRUD */}
      <div className="flex gap-2">
        <BuscaAvancada
          onSearch={setBusca}
          placeholder="Buscar lançamentos..."
          isLoading={isBuscando}
          resultCount={resultadosBusca?.length}
        />
        
        <SavedFiltersDropdown
          entityType="lancamentos_financeiros"
          currentFilters={filtros}
          onApplyFilter={setFiltros}
        />
        
        <Button onClick={() => setShowImport(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Importar
        </Button>
      </div>

      {/* ✅ MODAL DE IMPORTAÇÃO */}
      {showImport && (
        <Dialog open={showImport} onOpenChange={setShowImport}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Importar Lançamentos</DialogTitle>
            </DialogHeader>
            <FileImporter
              schema={lancamentoSchema}
              onImport={handleImport}
              fileType="both"
              templateUrl="/templates/lancamentos.csv"
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Tabela de lançamentos (existente) */}
      <DataTable data={lancamentos ?? []} />
    </div>
  );
}
```

---

### PASSO 4: Criar Template CSV (2 min)

**Arquivo:** `apps/finance-hub/public/templates/lancamentos.csv`

```csv
descricao,valor,data,categoria,fornecedor,observacoes
Pagamento Fornecedor X,1500.00,2025-01-15,despesa,Fornecedor X,Nota Fiscal 123
Venda Produto Y,3000.00,2025-01-16,receita,Cliente Y,Pedido 456
Investimento Ações,5000.00,2025-01-17,investimento,Corretora Z,Aplicação mensal
```

---

### PASSO 5: Testar (1 min)

```bash
npm run dev
```

**Checklist de testes:**

1. ✅ **Busca Fulltext:**
   - Digite "Fornecedor" → deve filtrar
   - Digite "Produto" → deve filtrar
   - Busca vazia → mostra todos

2. ✅ **Filtros Salvos:**
   - Aplicar filtros complexos (categoria + data)
   - Clicar "Salvar Filtro Atual"
   - Dar nome: "Despesas Janeiro"
   - Verificar se aparece no dropdown
   - Aplicar filtro salvo → deve funcionar

3. ✅ **Import CSV:**
   - Baixar template
   - Preencher com dados
   - Fazer upload
   - Verificar preview
   - Confirmar importação
   - Verificar dados na tabela

4. ✅ **Import Excel:**
   - Criar .xlsx com mesmas colunas
   - Upload
   - Verificar funcionamento

---

## 🎉 RESULTADO FINAL

**Antes da integração:**
- Busca básica (LIKE simples)
- Filtros não salvos (reconfigurar sempre)
- Import manual (copiar/colar)

**Depois da integração:**
- ⚡ Busca fulltext < 50ms
- 💾 Filtros salvos reutilizáveis
- 📥 Import CSV/Excel com validação
- 🎯 Experiência enterprise-grade

**Tempo total:** 15 minutos  
**Impacto:** ⭐⭐⭐⭐⭐

---

## 📊 MÉTRICAS PÓS-INTEGRAÇÃO

Monitorar durante 1 semana:

```sql
-- Quantos filtros salvos foram criados?
SELECT COUNT(*) FROM saved_filters 
WHERE entity_type = 'lancamentos_financeiros';

-- Qual filtro mais usado?
SELECT name, COUNT(*) as uso
FROM saved_filters
WHERE entity_type = 'lancamentos_financeiros'
  AND is_default = false
GROUP BY name
ORDER BY uso DESC
LIMIT 5;

-- Quantos imports foram feitos?
SELECT DATE(created_at), COUNT(*) 
FROM lancamentos_financeiros
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at);
```

---

**✅ FINANCE HUB INTEGRADO COM SUCESSO!**

**Próximo:** DP System (15 min)
