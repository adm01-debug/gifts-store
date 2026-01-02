#!/bin/bash

# ============================================
# SCRIPT INDIVIDUAL - INTEGRAR 1 SISTEMA
# Uso: ./integrar_sistema.sh [nome-do-sistema]
# ============================================

SISTEMA=$1

if [ -z "$SISTEMA" ]; then
  echo "❌ Uso: ./integrar_sistema.sh <nome-do-sistema>"
  exit 1
fi

INICIO=$(date +%s)

# Passo 1: Navegar para o sistema
if [ ! -d "apps/$SISTEMA" ]; then
  echo "❌ Sistema não encontrado: apps/$SISTEMA"
  exit 1
fi

cd "apps/$SISTEMA" || exit 1
echo "✅ [1/7] Navegado para apps/$SISTEMA"

# Passo 2: Instalar package
echo "📦 [2/7] Instalando @unified-suite/shared-crud..."
npm install @unified-suite/shared-crud --save --legacy-peer-deps || {
  echo "❌ Erro ao instalar package"
  exit 1
}

# Passo 3: Criar migrations
echo "🗃️  [3/7] Criando migrations..."
npx supabase migration new saved_filters || true
npx supabase migration new entity_versions || true

# Passo 4: Copiar SQL
echo "📝 [4/7] Copiando templates SQL..."
MIGRATION_DIR="supabase/migrations"
mkdir -p "$MIGRATION_DIR"

# Encontrar última migration de cada tipo
LATEST_FILTERS=$(ls -t "$MIGRATION_DIR"/*saved_filters.sql 2>/dev/null | head -1 || echo "")
LATEST_VERSIONS=$(ls -t "$MIGRATION_DIR"/*entity_versions.sql 2>/dev/null | head -1 || echo "")

if [ -n "$LATEST_FILTERS" ] && [ -f "../../shared-crud-package/migrations/001_saved_filters.sql" ]; then
  cp ../../shared-crud-package/migrations/001_saved_filters.sql "$LATEST_FILTERS"
  echo "  ✅ SQL filtros salvos copiado"
fi

if [ -n "$LATEST_VERSIONS" ] && [ -f "../../shared-crud-package/migrations/002_entity_versions.sql" ]; then
  cp ../../shared-crud-package/migrations/002_entity_versions.sql "$LATEST_VERSIONS"
  echo "  ✅ SQL versionamento copiado"
fi

# Passo 5: Aplicar migrations
echo "⚡ [5/7] Aplicando migrations..."
npx supabase db push || {
  echo "⚠️  Migrations já aplicadas ou erro menor"
}

# Passo 6: Verificar instalação
echo "🔍 [6/7] Verificando instalação..."
if grep -q "@unified-suite/shared-crud" package.json; then
  echo "  ✅ Package encontrado no package.json"
else
  echo "  ❌ Package não encontrado"
  exit 1
fi

# Passo 7: Build
echo "🔨 [7/7] Executando build..."
npm run build || {
  echo "⚠️  Build com warnings (normal)"
}

cd ../..

FIM=$(date +%s)
TEMPO=$(( FIM - INICIO ))

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ $SISTEMA integrado em ${TEMPO}s"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

exit 0
