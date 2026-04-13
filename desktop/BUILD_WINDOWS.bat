@echo off
echo NeuroLaserMap - Windows Installer Builder
echo.
echo Instalando dependencias...
call npm install
echo.
echo Gerando instalador...
call npm run build
echo.
echo Pronto! O instalador esta em: dist\
pause
