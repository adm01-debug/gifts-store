# ✅ CHECKLIST EXECUTIVO - INTEGRAÇÃO CRUD

**Para cada sistema, seguir este checklist rigorosamente.**

---

## 📋 CHECKLIST POR SISTEMA

### PRÉ-INTEGRAÇÃO

- [ ] Sistema está funcionando em dev
- [ ] Backup do banco de dados feito
- [ ] Branch Git criada (feat/crud-integration)
- [ ] Shared package disponível no monorepo

---

### ETAPA 1: INSTALAÇÃO (2 min)

- [ ] Navegou para `apps/[SISTEMA]`
- [ ] Executou `npm install @unified-suite/shared-crud`
- [ ] Package aparece no `package.json`
- [ ] Executou `npm install` (instalar deps)
- [ ] Zero erros no terminal

**Comando de verificação:**
```bash
npm list @unified-suite/shared-crud
# Deve mostrar: @unified-suite/shared-crud@1.0.0
```

---

### ETAPA 2: MIGRATIONS SQL (5 min)

- [ ] Criou migration: `npx supabase migration new saved_filters`
- [ ] Criou migration: `npx supabase migration new fulltext_search`
- [ ] Copiou SQL do template
- [ ] Adaptou nomes de tabelas (se necessário)
- [ ] Revisou SQL (sem erros de sintaxe)
- [ ] Executou `npx supabase db push`
- [ ] Zero erros na aplicação
- [ ] Verificou: `npx supabase db diff` (sem diferenças)

**Verificação no banco:**
```sql
-- Deve existir:
SELECT * FROM saved_filters LIMIT 1;
-- Deve existir (adaptar nome):
SELECT * FROM [TABELA]_search_index LIMIT 1;
```

---

### ETAPA 3: CÓDIGO (5 min)

- [ ] Importou componentes do shared package
- [ ] Adicionou `SavedFiltersDropdown` na UI
- [ ] Adicionou `BuscaAvancada` na UI
- [ ] Adicionou `FileImporter` (modal/página)
- [ ] Criou schema Zod para import
- [ ] Conectou handlers (onImport, onSearch, etc)
- [ ] Zero erros TypeScript (`npm run build`)
- [ ] Zero warnings no console

**Imports necessários:**
```typescript
import {
  SavedFiltersDropdown,
  BuscaAvancada,
  FileImporter,
  useBuscaFulltext,
} from '@unified-suite/shared-crud';
```

---

### ETAPA 4: TEMPLATES (2 min)

- [ ] Criou pasta `public/templates/`
- [ ] Criou arquivo `.csv` com headers corretos
- [ ] Testou template (download + upload)
- [ ] Headers correspondem ao schema Zod

**Exemplo de header CSV:**
```csv
campo1,campo2,campo3,data,valor
```

---

### ETAPA 5: TESTES (1 min)

**Busca Fulltext:**
- [ ] Digite termo → filtra resultados
- [ ] Busca vazia → mostra todos
- [ ] Feedback visual (loading spinner)
- [ ] Contador de resultados funciona

**Filtros Salvos:**
- [ ] Aplica filtros complexos
- [ ] Clica "Salvar Filtro"
- [ ] Dá nome ao filtro
- [ ] Filtro aparece no dropdown
- [ ] Aplica filtro salvo → funciona
- [ ] Define filtro padrão (estrela)
- [ ] Deleta filtro → remove

**Import CSV:**
- [ ] Download template funciona
- [ ] Upload arquivo válido → preview OK
- [ ] Upload arquivo inválido → mostra erros
- [ ] Confirma import → dados aparecem
- [ ] Validação Zod funciona

**Import Excel:**
- [ ] Upload .xlsx funciona
- [ ] Validação funciona
- [ ] Import completa com sucesso

---

### ETAPA 6: DOCUMENTAÇÃO (opcional)

- [ ] Atualizou README do sistema
- [ ] Documentou schemas Zod usados
- [ ] Criou exemplos de CSV válidos

---

### PÓS-INTEGRAÇÃO

- [ ] Commit: `git commit -m "feat: integrate advanced CRUD"`
- [ ] Push: `git push origin feat/crud-integration`
- [ ] PR criado (se necessário)
- [ ] Testes em staging (se aplicável)
- [ ] Deploy em produção
- [ ] Monitora erros (24h)

---

## 🔍 VERIFICAÇÃO FINAL

### Teste End-to-End Completo

1. **Busca:**
   - Buscar "teste" → deve filtrar
   - Limpar busca → volta ao normal

2. **Filtros:**
   - Aplicar 3+ filtros
   - Salvar como "Meu Filtro"
   - Recarregar página
   - Aplicar filtro salvo
   - Verificar se funciona

3. **Import:**
   - Baixar template CSV
   - Preencher 5 linhas
   - Upload
   - Conferir preview
   - Importar
   - Verificar dados na tabela

**Se todos passarem:** ✅ Sistema integrado!

---

## 🎯 CRITÉRIOS DE SUCESSO

**Mínimo aceitável:**
- [ ] Package instalado sem erros
- [ ] Migrations aplicadas
- [ ] Ao menos 1 funcionalidade funcionando

**Ideal:**
- [ ] Todas as 4 funcionalidades funcionando
- [ ] Zero erros TypeScript
- [ ] Zero warnings
- [ ] Testes manuais 100% pass
- [ ] Template CSV criado

**Excelente:**
- [ ] Tudo do ideal +
- [ ] Documentação atualizada
- [ ] Exemplos criados
- [ ] Testes automatizados (opcional)

---

## ⏱️ CONTROLE DE TEMPO

| Etapa | Tempo Planejado | Tempo Real | Status |
|-------|-----------------|------------|--------|
| Instalação | 2 min | __ min | ☐ |
| Migrations | 5 min | __ min | ☐ |
| Código | 5 min | __ min | ☐ |
| Templates | 2 min | __ min | ☐ |
| Testes | 1 min | __ min | ☐ |
| **TOTAL** | **15 min** | **__ min** | ☐ |

**Se ultrapassar 20 min:** Parar e revisar o que está travando.

---

## 📞 QUANDO PEDIR AJUDA

**Peça ajuda se:**
- Migrations falharem 2x seguidas
- Erros TypeScript não resolverem em 5 min
- Importação não funcionar após 3 tentativas
- Tempo total > 25 minutos

**Canais de suporte:**
- Slack: #dev-crud-shared
- GitHub Issues
- Email: dev@promobrindes.com.br

---

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║     ✅ CHECKLIST PRONTO PARA EXECUÇÃO                           ║
║     🎯 Meta: 15 minutos por sistema                             ║
║     📊 Siga rigorosamente para garantir qualidade               ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```
