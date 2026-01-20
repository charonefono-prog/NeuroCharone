#!/bin/bash

# Script para gerar instalador do NeuroLaserMap para macOS
# Execute este arquivo no seu Mac: bash build-macos.sh

echo "========================================"
echo "NeuroLaserMap - Build para macOS"
echo "========================================"
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "ERRO: Node.js não está instalado!"
    echo "Instale via Homebrew:"
    echo "  brew install node"
    exit 1
fi

echo "✓ Node.js encontrado"
node --version
echo ""

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "ERRO: npm não está instalado!"
    exit 1
fi

echo "✓ npm encontrado"
npm --version
echo ""

# Instalar dependências
echo "Instalando dependências..."
npm install

if [ $? -ne 0 ]; then
    echo "ERRO: Falha ao instalar dependências!"
    exit 1
fi

echo "✓ Dependências instaladas"
echo ""

# Fazer build
echo "Gerando instalador para macOS..."
echo "Isso pode levar alguns minutos..."
echo ""

npm run electron-build:mac

if [ $? -ne 0 ]; then
    echo "ERRO: Falha ao gerar instalador!"
    exit 1
fi

echo ""
echo "========================================"
echo "✓ Instalador gerado com sucesso!"
echo "========================================"
echo ""
echo "Os arquivos estão em: dist-electron/"
echo ""
echo "Arquivos gerados:"
echo "- NeuroLaserMap-1.0.0.dmg (Instalador)"
echo "- NeuroLaserMap-1.0.0.zip (Versão comprimida)"
echo ""
echo "Próximas ações:"
echo "1. Teste o instalador clicando duas vezes no .dmg"
echo "2. Compartilhe o arquivo .dmg com seus usuários"
echo "3. Ou faça upload para GitHub Releases"
echo ""
