#!/bin/bash
echo "🔍 Verificando build do Gifts Store..."
echo ""

echo "1️⃣ Instalando dependências..."
npm install --silent

echo "2️⃣ Executando build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build concluído com sucesso!"
    echo "📊 Tamanho do dist:"
    du -sh dist/
else
    echo "❌ Build falhou!"
    exit 1
fi
