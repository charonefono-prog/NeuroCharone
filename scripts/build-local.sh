#!/bin/bash

# Script de Build Local para NeuroLaserMap
# Uso: ./scripts/build-local.sh [ios|android|all]

set -e

PLATFORM=${1:-all}
COLORS_RED='\033[0;31m'
COLORS_GREEN='\033[0;32m'
COLORS_YELLOW='\033[1;33m'
COLORS_BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${COLORS_BLUE}🚀 NeuroLaserMap - Build Local${NC}"
echo -e "${COLORS_BLUE}================================${NC}\n"

# Verificar se EAS CLI está instalado
if ! command -v eas &> /dev/null; then
    echo -e "${COLORS_RED}❌ EAS CLI não encontrado!${NC}"
    echo "Instale com: npm install -g eas-cli"
    exit 1
fi

# Verificar se está logado
if ! eas whoami &> /dev/null; then
    echo -e "${COLORS_YELLOW}⚠️  Você não está logado no EAS${NC}"
    echo "Fazendo login..."
    eas login
fi

# Verificar espaço em disco
DISK_SPACE=$(df . | awk 'NR==2 {print $4}')
if [ "$DISK_SPACE" -lt 20971520 ]; then  # 20 GB em KB
    echo -e "${COLORS_RED}❌ Espaço em disco insuficiente!${NC}"
    echo "Necessário: 20 GB | Disponível: $(($DISK_SPACE / 1048576)) GB"
    exit 1
fi

echo -e "${COLORS_GREEN}✅ Pré-requisitos OK${NC}\n"

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo -e "${COLORS_YELLOW}📦 Instalando dependências...${NC}"
    pnpm install
fi

# Verificar TypeScript
echo -e "${COLORS_YELLOW}🔍 Verificando TypeScript...${NC}"
pnpm check || {
    echo -e "${COLORS_RED}❌ Erros TypeScript encontrados!${NC}"
    exit 1
}

echo -e "${COLORS_GREEN}✅ TypeScript OK${NC}\n"

# Build
case $PLATFORM in
    ios)
        echo -e "${COLORS_BLUE}🍎 Iniciando build para iOS...${NC}"
        eas build --platform ios --local
        ;;
    android)
        echo -e "${COLORS_BLUE}🤖 Iniciando build para Android...${NC}"
        eas build --platform android --local
        ;;
    all)
        echo -e "${COLORS_BLUE}🚀 Iniciando build para iOS e Android...${NC}"
        eas build --platform all --local
        ;;
    *)
        echo -e "${COLORS_RED}❌ Plataforma inválida: $PLATFORM${NC}"
        echo "Use: ./scripts/build-local.sh [ios|android|all]"
        exit 1
        ;;
esac

echo -e "\n${COLORS_GREEN}✅ Build concluído!${NC}"
echo -e "${COLORS_BLUE}📦 Arquivos salvos em: ./dist/${NC}\n"

# Mostrar informações
if [ -f "dist/build-info.json" ]; then
    echo -e "${COLORS_YELLOW}📊 Informações do Build:${NC}"
    cat dist/build-info.json | jq .
fi

echo -e "${COLORS_GREEN}🎉 Pronto para fazer upload nas lojas!${NC}"
