@echo off
REM Script para gerar instalador do NeuroLaserMap para Windows
REM Execute este arquivo no seu computador Windows

echo ========================================
echo NeuroLaserMap - Build para Windows
echo ========================================
echo.

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js não está instalado!
    echo Baixe em: https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js encontrado
node --version
echo.

REM Verificar se npm está instalado
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: npm não está instalado!
    pause
    exit /b 1
)

echo ✓ npm encontrado
npm --version
echo.

REM Instalar dependências
echo Instalando dependências...
call npm install
if errorlevel 1 (
    echo ERRO: Falha ao instalar dependências!
    pause
    exit /b 1
)

echo ✓ Dependências instaladas
echo.

REM Fazer build
echo Gerando instalador para Windows...
echo Isso pode levar alguns minutos...
echo.

call npm run electron-build:win

if errorlevel 1 (
    echo ERRO: Falha ao gerar instalador!
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✓ Instalador gerado com sucesso!
echo ========================================
echo.
echo Os arquivos estão em: dist-electron\
echo.
echo Arquivos gerados:
echo - NeuroLaserMap Setup 1.0.0.exe (Instalador)
echo - NeuroLaserMap 1.0.0.exe (Versão portável)
echo.
echo Próximas ações:
echo 1. Teste o instalador clicando duas vezes
echo 2. Compartilhe o arquivo .exe com seus usuários
echo 3. Ou faça upload para GitHub Releases
echo.
pause
