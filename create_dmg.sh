#!/bin/bash

# Criar diretório temporário
mkdir -p /tmp/NeuroLaserMap.app/Contents/{MacOS,Resources}

# Copiar arquivos do projeto
cp -r app /tmp/NeuroLaserMap.app/Contents/Resources/
cp -r components /tmp/NeuroLaserMap.app/Contents/Resources/
cp -r lib /tmp/NeuroLaserMap.app/Contents/Resources/
cp -r hooks /tmp/NeuroLaserMap.app/Contents/Resources/
cp -r assets /tmp/NeuroLaserMap.app/Contents/Resources/
cp package.json /tmp/NeuroLaserMap.app/Contents/Resources/
cp app.config.ts /tmp/NeuroLaserMap.app/Contents/Resources/

# Criar Info.plist
cat > /tmp/NeuroLaserMap.app/Contents/Info.plist << 'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>pt_BR</string>
    <key>CFBundleExecutable</key>
    <string>NeuroLaserMap</string>
    <key>CFBundleIdentifier</key>
    <string>com.neurolasermapp.macos</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>NeuroLaserMap</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>NSMainStoryboardFile</key>
    <string>Main</string>
    <key>NSPrincipalClass</key>
    <string>NSApplication</string>
    <key>NSHumanReadableCopyright</key>
    <string>© 2026 NeuroLaserMap. Desenvolvido por Carlos Charone.</string>
</dict>
</plist>
PLIST

# Criar script executável
cat > /tmp/NeuroLaserMap.app/Contents/MacOS/NeuroLaserMap << 'SCRIPT'
#!/bin/bash
# NeuroLaserMap macOS Launcher
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR/../Resources"
npm start
SCRIPT

chmod +x /tmp/NeuroLaserMap.app/Contents/MacOS/NeuroLaserMap

# Copiar ícone
if [ -f "assets/images/icon.png" ]; then
    cp assets/images/icon.png /tmp/NeuroLaserMap.app/Contents/Resources/icon.png
fi

echo "✅ Aplicativo macOS criado em /tmp/NeuroLaserMap.app"
