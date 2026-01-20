#!/bin/bash

# NeuroLaserMap - Gerar Instalador macOS
# Clique duas vezes neste arquivo para gerar o instalador automaticamente

clear

echo "╔════════════════════════════════════════╗"
echo "║   NeuroLaserMap - Gerar Instalador    ║"
echo "║              macOS                    ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Obter o diretório do script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "📁 Diretório do projeto: $SCRIPT_DIR"
echo ""

# Verificar se Node.js está instalado
echo "🔍 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ ERRO: Node.js não está instalado!"
    echo ""
    echo "Instale em: https://nodejs.org/"
    echo "Ou use Homebrew: brew install node"
    echo ""
    read -p "Pressione Enter para sair..."
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js encontrado: $NODE_VERSION"
echo ""

# Ir para o diretório do projeto
cd "$SCRIPT_DIR"

# Instalar dependências
echo "📦 Instalando dependências..."
echo "Isso pode levar alguns minutos..."
echo ""

npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ ERRO: Falha ao instalar dependências!"
    read -p "Pressione Enter para sair..."
    exit 1
fi

echo ""
echo "✅ Dependências instaladas com sucesso!"
echo ""

# Gerar instalador
echo "🔨 Gerando instalador para macOS..."
echo "Isso pode levar 10-20 minutos..."
echo ""

npm run electron-build:mac

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ ERRO: Falha ao gerar instalador!"
    read -p "Pressione Enter para sair..."
    exit 1
fi

echo ""
echo "╔════════════════════════════════════════╗"
echo "║   ✅ SUCESSO!                         ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "📂 O arquivo está em:"
echo "   $SCRIPT_DIR/dist-electron/NeuroLaserMap-1.0.0.dmg"
echo ""
echo "🧪 Para testar:"
echo "   1. Clique duas vezes no arquivo .dmg"
echo "   2. Arraste o NeuroLaserMap para Applications"
echo "   3. Abra o aplicativo"
echo ""
echo "📤 Para distribuir:"
echo "   1. Vá para GitHub Releases"
echo "   2. Faça upload do arquivo .dmg"
echo "   3. Compartilhe o link com seus usuários"
echo ""

read -p "Pressione Enter para sair..."
