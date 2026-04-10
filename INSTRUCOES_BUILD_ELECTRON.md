# Instruções de Build - NeuroLaserMap Electron

**Como compilar o aplicativo para Windows e macOS**

Versão: 1.0.0 | Janeiro de 2026

---

## 📋 Pré-requisitos

Antes de começar o build, você precisa ter instalado:

### Para Windows

1. **Node.js 14+** - https://nodejs.org/
2. **Python 3.6+** - https://www.python.org/
3. **Visual Studio Build Tools** - https://visualstudio.microsoft.com/downloads/
4. **Git** - https://git-scm.com/

### Para macOS

1. **Node.js 14+** - https://nodejs.org/
2. **Xcode Command Line Tools** - Execute `xcode-select --install`
3. **Git** - Geralmente já incluído no macOS

### Para Linux

1. **Node.js 14+** - https://nodejs.org/
2. **Build essentials** - Execute `sudo apt-get install build-essential`
3. **Git** - https://git-scm.com/

---

## 🚀 Como Fazer o Build

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/neuromodulation_mapper.git
cd neuromodulation_mapper
```

### Passo 2: Instalar Dependências

```bash
npm install
# ou
pnpm install
```

### Passo 3: Compilar a Aplicação Web

```bash
npm run build
# ou
pnpm build
```

Este comando compila a aplicação React e gera os arquivos estáticos na pasta `dist/`.

### Passo 4: Fazer o Build do Electron

#### Para Windows

```bash
npm run electron-build:win
```

Isto criará um arquivo `.exe` na pasta `dist-electron/`. O arquivo será nomeado algo como `NeuroLaserMap-Setup-1.0.0.exe`.

#### Para macOS

```bash
npm run electron-build:mac
```

Isto criará um arquivo `.dmg` na pasta `dist-electron/`. O arquivo será nomeado algo como `NeuroLaserMap-1.0.0.dmg`.

#### Para Linux

```bash
npm run electron-build:linux
```

Isto criará um arquivo `.AppImage` na pasta `dist-electron/`.

#### Para Todas as Plataformas

```bash
npm run electron-build:all
```

Isto criará instaladores para Windows, macOS e Linux simultaneamente.

---

## 📦 Estrutura de Arquivos Gerados

Após o build, você encontrará os seguintes arquivos na pasta `dist-electron/`:

### Windows

- `NeuroLaserMap-Setup-1.0.0.exe` - Instalador NSIS (recomendado)
- `NeuroLaserMap-1.0.0.exe` - Versão portável (não requer instalação)

### macOS

- `NeuroLaserMap-1.0.0.dmg` - Instalador DMG
- `NeuroLaserMap-1.0.0.zip` - Arquivo ZIP com o aplicativo

### Linux

- `NeuroLaserMap-1.0.0.AppImage` - Aplicativo AppImage
- `neurolasermap_1.0.0_amd64.deb` - Pacote Debian

---

## 🔐 Assinatura de Código (Opcional)

Para distribuir o aplicativo profissionalmente, você deve assinar o código. Isto evita avisos de segurança.

### Windows

1. Obtenha um certificado de assinatura de código
2. Configure as variáveis de ambiente:
   ```bash
   set WIN_CSC_LINK=caminho/para/certificado.pfx
   set WIN_CSC_KEY_PASSWORD=sua_senha
   ```
3. Execute o build normalmente

### macOS

1. Obtenha um certificado de desenvolvedor Apple
2. Configure as variáveis de ambiente:
   ```bash
   export CSC_LINK=caminho/para/certificado.p12
   export CSC_KEY_PASSWORD=sua_senha
   ```
3. Execute o build normalmente

---

## 🧪 Testar Localmente

Para testar o aplicativo Electron localmente antes de fazer o build final:

```bash
npm run electron-dev
```

Isto iniciará o aplicativo em modo desenvolvimento com o DevTools aberto.

---

## 📝 Configuração do electron-builder

A configuração do electron-builder está no arquivo `electron-builder.json`. Você pode personalizar:

- **Nome do aplicativo**: `"productName"`
- **ID da aplicação**: `"appId"`
- **Ícone do aplicativo**: `"icon"`
- **Diretório de saída**: `"directories.output"`
- **Arquivos incluídos**: `"files"`

---

## 🐛 Solução de Problemas

### Problema: "Erro ao compilar no Windows"

**Solução**: Verifique se você tem o Visual Studio Build Tools instalado. Se não tiver:

1. Baixe o Visual Studio Build Tools
2. Execute o instalador
3. Selecione "Desktop development with C++"
4. Conclua a instalação
5. Tente o build novamente

### Problema: "Erro ao compilar no macOS"

**Solução**: Instale o Xcode Command Line Tools:

```bash
xcode-select --install
```

### Problema: "Arquivo muito grande"

**Solução**: O instalador Electron geralmente tem 150-300 MB. Isto é normal. Se quiser reduzir o tamanho:

1. Remova dependências desnecessárias
2. Use a versão portável em vez do instalador
3. Comprima o arquivo com 7-Zip ou WinRAR

### Problema: "Erro de permissão ao assinar código"

**Solução**: Verifique se:

1. O caminho do certificado está correto
2. A senha do certificado está correta
3. O certificado não expirou

---

## 📤 Distribuição

Após gerar os instaladores, você pode:

1. **Hospedar em um servidor web** - Coloque os arquivos `.exe`, `.dmg` ou `.AppImage` em um servidor
2. **Usar um serviço de distribuição** - Considere usar serviços como GitHub Releases
3. **Criar um instalador centralizado** - Use um sistema de atualização automática

---

## 🔄 Atualização Automática

Para implementar atualizações automáticas, você pode usar `electron-updater`:

```bash
npm install electron-updater
```

E configurar no arquivo `main.js`:

```javascript
const { autoUpdater } = require('electron-updater');

autoUpdater.checkForUpdatesAndNotify();
```

---

## 📚 Referências

- [Documentação do Electron](https://www.electronjs.org/docs)
- [Documentação do electron-builder](https://www.electron.build/)
- [Guia de Distribuição do Electron](https://www.electronjs.org/docs/tutorial/distribution)

---

**NeuroLaserMap Electron** - Instruções de Build

Versão 1.0.0 | Janeiro de 2026
