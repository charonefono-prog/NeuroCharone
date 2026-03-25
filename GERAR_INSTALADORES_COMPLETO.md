# Como Gerar Instaladores para Windows e macOS

**Guia passo a passo para criar os arquivos .exe e .dmg do NeuroLaserMap**

Versão: 1.0.0 | Janeiro de 2026

---

## 📋 Visão Geral

Este guia mostra como gerar os instaladores executáveis:
- **Windows**: Arquivo `.exe` (instalador NSIS)
- **macOS**: Arquivo `.dmg` (imagem de disco)

Os instaladores serão criados na pasta `dist-electron/` do seu projeto.

---

## 🔧 Pré-requisitos

### Windows

1. **Node.js** - Baixe em [nodejs.org](https://nodejs.org/)
   - Versão: 18 ou superior
   - Instale com npm

2. **Git** - Baixe em [git-scm.com](https://git-scm.com/)

3. **Visual Studio Build Tools** (opcional, mas recomendado)
   - Necessário apenas se tiver problemas com módulos nativos

### macOS

1. **Node.js** - Instale via [Homebrew](https://brew.sh/)
   ```bash
   brew install node
   ```

2. **Git** - Já vem com Xcode Command Line Tools
   ```bash
   xcode-select --install
   ```

3. **Xcode Command Line Tools**
   ```bash
   xcode-select --install
   ```

### Linux (para referência)

```bash
sudo apt-get install nodejs npm git build-essential
```

---

## 📥 Passo 1: Baixar o Projeto

### No Windows (PowerShell)

```powershell
# Abra o PowerShell como Administrador
cd C:\Users\seu_usuario\Documents
git clone https://github.com/seu-usuario/neuromodulation_mapper.git
cd neuromodulation_mapper
```

### No macOS (Terminal)

```bash
# Abra o Terminal
cd ~/Documents
git clone https://github.com/seu-usuario/neuromodulation_mapper.git
cd neuromodulation_mapper
```

---

## 📦 Passo 2: Instalar Dependências

Execute este comando em ambos os sistemas:

```bash
npm install
```

Isso vai:
- Instalar todas as dependências do projeto
- Instalar electron-builder
- Instalar electron-updater
- Preparar tudo para o build

**Tempo esperado**: 5-10 minutos

---

## 🔨 Passo 3: Gerar Instaladores

### Opção A: Gerar para Seu Sistema (Recomendado para Começar)

**Windows:**
```bash
npm run electron-build:win
```

**macOS:**
```bash
npm run electron-build:mac
```

### Opção B: Gerar para Ambos os Sistemas (Windows + macOS)

```bash
npm run electron-build:all
```

**Tempo esperado**: 10-20 minutos (primeira vez pode ser mais lento)

---

## 📂 Passo 4: Encontrar os Instaladores

Após o build, os arquivos estarão em:

### Windows

```
dist-electron/
├── NeuroLaserMap Setup 1.0.0.exe    ← Instalador (use este!)
├── NeuroLaserMap 1.0.0.exe          ← Versão portável
└── builder-effective-config.yaml
```

### macOS

```
dist-electron/
├── NeuroLaserMap-1.0.0.dmg         ← Instalador (use este!)
├── NeuroLaserMap-1.0.0.zip         ← Versão comprimida
└── builder-effective-config.yaml
```

---

## 🚀 Passo 5: Testar os Instaladores

### Testar no Windows

1. Abra a pasta `dist-electron/`
2. Clique duas vezes em `NeuroLaserMap Setup 1.0.0.exe`
3. Siga o assistente de instalação
4. O aplicativo será instalado em `C:\Users\seu_usuario\AppData\Local\Programs\NeuroLaserMap`
5. Abra o aplicativo a partir do Menu Iniciar

### Testar no macOS

1. Abra a pasta `dist-electron/`
2. Clique duas vezes em `NeuroLaserMap-1.0.0.dmg`
3. Arraste o ícone do NeuroLaserMap para a pasta Applications
4. Abra o Finder → Applications
5. Clique duas vezes em NeuroLaserMap

---

## 📤 Passo 6: Distribuir os Instaladores

### Opção 1: GitHub Releases (Recomendado)

1. Vá para seu repositório no GitHub
2. Clique em **Releases**
3. Clique em **Create a new release**
4. Preencha:
   - **Tag version**: v1.0.0
   - **Release title**: NeuroLaserMap 1.0.0
   - **Description**: Descrição das funcionalidades
5. Clique em **Attach binaries** e arraste:
   - `NeuroLaserMap Setup 1.0.0.exe`
   - `NeuroLaserMap-1.0.0.dmg`
6. Clique em **Publish release**

### Opção 2: Google Drive

1. Crie uma pasta no Google Drive
2. Faça upload dos arquivos `.exe` e `.dmg`
3. Compartilhe o link com seus usuários

### Opção 3: Seu Site

1. Hospede os arquivos em seu servidor web
2. Adicione links de download na página `downloads.html`
3. Compartilhe o link com seus usuários

### Opção 4: Dropbox

1. Faça upload para o Dropbox
2. Compartilhe o link público
3. Usuários podem baixar diretamente

---

## 🔄 Atualizar Versão

Quando quiser criar uma nova versão:

### Passo 1: Atualizar Versão

Edite `package.json`:

```json
{
  "version": "1.1.0"
}
```

### Passo 2: Fazer Commit

```bash
git add package.json
git commit -m "Bump version to 1.1.0"
git push
```

### Passo 3: Criar Release no GitHub

1. Vá para **Releases**
2. Clique em **Create a new release**
3. Tag: `v1.1.0`
4. Descrição: Notas de atualização

### Passo 4: Fazer Build

```bash
npm run electron-build:all
```

### Passo 5: Fazer Upload dos Arquivos

Arraste os novos arquivos para o release do GitHub.

---

## 🐛 Solução de Problemas

### Problema: "npm: command not found"

**Solução**: Node.js não está instalado
1. Baixe em [nodejs.org](https://nodejs.org/)
2. Instale a versão LTS
3. Reinicie o terminal
4. Tente novamente

### Problema: "electron-builder not found"

**Solução**: Dependências não foram instaladas
```bash
npm install
```

### Problema: Build falha no Windows

**Solução**: Pode ser falta de Visual Studio Build Tools
```bash
npm install --global windows-build-tools
```

### Problema: Build falha no macOS

**Solução**: Pode ser falta de Xcode Command Line Tools
```bash
xcode-select --install
```

### Problema: Arquivo .exe muito grande

**Solução**: Isso é normal! Electron inclui Chromium
- Tamanho típico: 150-200MB
- Depois de instalado: ~300-400MB

### Problema: macOS pede senha para assinar

**Solução**: Isso é normal. Deixe em branco e pressione Enter.

---

## 📊 Tamanho dos Arquivos

Tamanho esperado dos instaladores:

| Arquivo | Tamanho |
|---------|---------|
| NeuroLaserMap Setup 1.0.0.exe | ~150-200 MB |
| NeuroLaserMap-1.0.0.dmg | ~180-220 MB |

---

## 🔐 Assinatura de Código (Opcional)

Para maior segurança, você pode assinar os instaladores:

### Windows

1. Obtenha um certificado de código
2. Configure as variáveis de ambiente:

```powershell
$env:WIN_CSC_LINK = "C:\caminho\para\certificado.pfx"
$env:WIN_CSC_KEY_PASSWORD = "sua_senha"
```

3. Faça o build normalmente

### macOS

1. Obtenha um certificado Apple Developer
2. Configure as variáveis de ambiente:

```bash
export CSC_LINK="/caminho/para/certificado.p12"
export CSC_KEY_PASSWORD="sua_senha"
```

3. Faça o build normalmente

---

## 📝 Checklist de Publicação

Antes de distribuir os instaladores:

- [ ] Testou o instalador no Windows?
- [ ] Testou o instalador no macOS?
- [ ] Atualizou a versão em `package.json`?
- [ ] Criou um release no GitHub?
- [ ] Fez upload dos arquivos `.exe` e `.dmg`?
- [ ] Testou o download dos arquivos?
- [ ] Atualizou a página `downloads.html` com links reais?
- [ ] Informou aos usuários sobre a nova versão?

---

## 🎯 Próximas Ações

1. **Instalar Node.js** - Se ainda não tiver
2. **Clonar o repositório** - Baixe o projeto
3. **Instalar dependências** - Execute `npm install`
4. **Gerar instaladores** - Execute `npm run electron-build:all`
5. **Testar instaladores** - Teste em ambos os sistemas
6. **Publicar no GitHub** - Crie um release
7. **Compartilhar links** - Distribua para seus usuários

---

## 📚 Referências

- [Electron Builder Docs](https://www.electron.build/)
- [Electron Docs](https://www.electronjs.org/docs)
- [Node.js](https://nodejs.org/)
- [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)

---

## 💬 Suporte

Se tiver problemas:

1. Verifique os logs do build
2. Procure a solução em "Solução de Problemas"
3. Consulte a documentação oficial do Electron Builder
4. Procure ajuda em comunidades (Stack Overflow, GitHub Issues)

---

**NeuroLaserMap** - Guia Completo de Geração de Instaladores

Versão 1.0.0 | Janeiro de 2026
