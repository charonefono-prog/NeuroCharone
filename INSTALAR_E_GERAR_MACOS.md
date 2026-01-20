# NeuroLaserMap - Gerar Instalador no macOS (Automático)

**Guia super simples para gerar o .dmg automaticamente**

---

## 🚀 Como Fazer (3 Passos Simples)

### Passo 1: Baixar o Projeto

1. Vá para: https://github.com/seu-usuario/neuromodulation_mapper
2. Clique em **Code** (botão verde)
3. Clique em **Download ZIP**
4. Extraia o arquivo em `~/Documents/`

### Passo 2: Abrir o Terminal

1. Pressione `Cmd + Espaço`
2. Digite `Terminal`
3. Pressione `Enter`

### Passo 3: Copiar e Colar Este Comando

Cole este comando inteiro no Terminal e pressione Enter:

```bash
cd ~/Documents/neuromodulation_mapper && npm install && npm run electron-build:mac
```

**Pronto!** O script vai:
1. ✅ Ir para a pasta do projeto
2. ✅ Instalar todas as dependências
3. ✅ Gerar o instalador .dmg

---

## ⏳ Quanto Tempo Leva?

- **Primeira vez**: 15-25 minutos
- **Próximas vezes**: 5-10 minutos

---

## 📂 Onde Está o Arquivo?

Após terminar, o arquivo estará aqui:

```
~/Documents/neuromodulation_mapper/dist-electron/NeuroLaserMap-1.0.0.dmg
```

---

## 🧪 Testar o Instalador

1. Abra a pasta `dist-electron/`
2. Clique duas vezes em `NeuroLaserMap-1.0.0.dmg`
3. Arraste o ícone do NeuroLaserMap para a pasta Applications
4. Pronto! Abra o aplicativo

---

## 🐛 Se Algo Der Errado

### Erro: "command not found: npm"

**Solução**: Node.js não foi instalado corretamente
1. Abra o arquivo `node-v24.13.0.pkg` novamente
2. Clique em **Instalar**
3. Reinicie o Mac
4. Tente novamente

### Erro: "Permission denied"

**Solução**: Cole este comando primeiro:

```bash
sudo chown -R $(whoami) ~/Documents/neuromodulation_mapper
```

Depois tente novamente.

### Erro: "Cannot find module"

**Solução**: Execute este comando:

```bash
cd ~/Documents/neuromodulation_mapper && rm -rf node_modules && npm install
```

---

## ✅ Checklist

- [ ] Node.js instalado
- [ ] Projeto baixado em `~/Documents/`
- [ ] Terminal aberto
- [ ] Comando colado e executado
- [ ] Aguardou terminar (15-25 minutos)
- [ ] Arquivo .dmg gerado
- [ ] Testou o instalador
- [ ] Pronto para distribuir!

---

## 📤 Distribuir o Instalador

Agora você tem o arquivo `NeuroLaserMap-1.0.0.dmg` pronto para compartilhar!

### Opção 1: GitHub Releases (Recomendado)

1. Vá para seu repositório no GitHub
2. Clique em **Releases**
3. Clique em **Create a new release**
4. Preencha:
   - Tag: `v1.0.0`
   - Título: `NeuroLaserMap 1.0.0`
5. Clique em **Attach binaries**
6. Arraste o arquivo `NeuroLaserMap-1.0.0.dmg`
7. Clique em **Publish release**

### Opção 2: Google Drive

1. Abra Google Drive
2. Clique em **Novo → Upload de arquivo**
3. Selecione `NeuroLaserMap-1.0.0.dmg`
4. Compartilhe o link com seus usuários

### Opção 3: Dropbox

1. Abra Dropbox
2. Arraste o arquivo para a pasta
3. Clique com botão direito → Compartilhar
4. Copie o link

---

## 🎉 Pronto!

Você agora tem um instalador profissional do NeuroLaserMap para macOS!

**Próximas ações:**
1. Teste o instalador no seu Mac
2. Distribua o arquivo .dmg
3. Seus usuários podem instalar clicando duas vezes

---

**NeuroLaserMap** - Guia Automático macOS

Versão 1.0.0 | Janeiro de 2026
