#!/bin/bash

# Script para construir APK do NeuroLaserMap
# Desenvolvido por Carlos Charone (CRFa 9-10025-5)

set -e

echo "================================"
echo "NeuroLaserMap - Build APK"
echo "================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para imprimir com cor
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# Verificar se estamos no diretório correto
if [ ! -f "app.config.ts" ]; then
    print_error "Erro: app.config.ts não encontrado. Execute este script na raiz do projeto."
    exit 1
fi

print_status "Diretório do projeto verificado"

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    print_info "Instalando dependências..."
    pnpm install
    print_status "Dependências instaladas"
fi

# Verificar se EXPO_TOKEN está definido
if [ -z "$EXPO_TOKEN" ]; then
    print_error "EXPO_TOKEN não definido. Configure a variável de ambiente:"
    echo "export EXPO_TOKEN=seu_token_aqui"
    exit 1
fi

print_status "Token Expo verificado"

# Verificar versão do EAS
print_info "Verificando versão do EAS CLI..."
eas --version

# Tentar fazer login
print_info "Autenticando com Expo..."
eas whoami || print_info "Não autenticado. Tentando com token..."

# Construir APK
print_info "Iniciando build do APK..."
print_info "Isso pode levar 10-15 minutos..."
echo ""

# Usar --local se disponível, senão usar EAS Build
if command -v gradle &> /dev/null; then
    print_info "Gradle detectado. Construindo localmente..."
    eas build --platform android --local
else
    print_info "Usando EAS Build (servidores da Expo)..."
    eas build --platform android --non-interactive
fi

print_status "Build concluído com sucesso!"
echo ""
print_info "Seu APK está pronto para distribuição."
print_info "Verifique o arquivo em ./dist/ ou no link fornecido acima."
