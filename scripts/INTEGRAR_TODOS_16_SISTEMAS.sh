#!/bin/bash

# ============================================
# SCRIPT MASTER - INTEGRAÇÃO NOS 16 SISTEMAS
# Tempo estimado: 4 horas (15 min/sistema)
# ============================================

set -e  # Para em caso de erro

SISTEMAS=(
  "finance-hub"
  "dp-system"
  "sistema-compras"
  "estoki-wms"
  "salespro-crm"
  "hello-contact-center"
  "multiplixe"
  "taskgifts"
  "fuxico"
  "loggi-flow"
  "match-ats"
  "zapp"
  "fast-grava-es"
  "lalamove-guardian"
  "gifts-store"
  "bitrix24-action"
)

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                                                                  ║"
echo "║     🚀 INTEGRAÇÃO MASSIVA - 16 SISTEMAS                         ║"
echo "║     ⚡ Modo: Automático                                          ║"
echo "║     ⏱️  Tempo estimado: 4 horas                                  ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

TOTAL=${#SISTEMAS[@]}
SUCESSO=0
FALHAS=0
INICIO=$(date +%s)

for i in "${!SISTEMAS[@]}"; do
  SISTEMA="${SISTEMAS[$i]}"
  NUM=$((i+1))
  
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🔧 [$NUM/$TOTAL] Integrando: $SISTEMA"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  # Executar integração individual
  if bash integrar_sistema.sh "$SISTEMA"; then
    echo "✅ $SISTEMA integrado com sucesso!"
    ((SUCESSO++))
  else
    echo "❌ FALHA em $SISTEMA"
    ((FALHAS++))
  fi
  
  # Calcular progresso
  PROGRESSO=$(( (NUM * 100) / TOTAL ))
  echo "📊 Progresso: $PROGRESSO% ($SUCESSO sucesso, $FALHAS falhas)"
done

FIM=$(date +%s)
TEMPO=$(( (FIM - INICIO) / 60 ))

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                                                                  ║"
echo "║     ✅ INTEGRAÇÃO COMPLETA!                                     ║"
echo "║                                                                  ║"
echo "║     📊 Sucesso: $SUCESSO/$TOTAL sistemas                               ║"
echo "║     ❌ Falhas: $FALHAS                                            ║"
echo "║     ⏱️  Tempo total: ${TEMPO} minutos                                 ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"

if [ $FALHAS -eq 0 ]; then
  echo ""
  echo "🎉 PERFEITO! Todos os sistemas integrados com sucesso!"
  exit 0
else
  echo ""
  echo "⚠️  Revisar sistemas com falha"
  exit 1
fi
