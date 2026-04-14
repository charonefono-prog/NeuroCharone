# Guia de Atualização Automática - NeuroLaserMap Electron

**Como configurar e usar o sistema de atualização automática**

Versão: 1.0.0 | Janeiro de 2026

---

## 📋 O que é Atualização Automática?

O sistema de atualização automática do NeuroLaserMap permite que os usuários recebam novas versões do aplicativo automaticamente, sem precisar desinstalar e reinstalar manualmente. Quando uma nova versão está disponível, o usuário recebe uma notificação e pode escolher atualizar com um clique.

---

## 🔧 Como Funciona

### Fluxo de Atualização

1. **Verificação** - O aplicativo verifica se há atualizações disponíveis a cada hora
2. **Notificação** - Se uma nova versão for encontrada, o usuário recebe uma notificação
3. **Download** - O usuário clica em "Baixar" e o novo instalador é baixado
4. **Instalação** - Após o download, o usuário clica em "Instalar Agora"
5. **Reinício** - O aplicativo reinicia com a nova versão

### Componentes

- **electron-updater** - Biblioteca que gerencia as atualizações
- **GitHub Releases** - Servidor que hospeda os arquivos de atualização
- **UpdateNotificationComponent** - Interface que mostra as notificações ao usuário

---

## 🚀 Como Configurar

### Passo 1: Preparar o GitHub

1. Crie um repositório GitHub para o NeuroLaserMap (se ainda não tiver)
2. Vá para **Settings → Developer settings → Personal access tokens**
3. Clique em **Generate new token**
4. Selecione o escopo `repo` (acesso completo ao repositório)
5. Copie o token gerado

### Passo 2: Configurar Variáveis de Ambiente

No seu computador, configure as variáveis de ambiente:

**Windows (PowerShell):**
```powershell
$env:GH_TOKEN = "seu_token_github"
$env:GITHUB_TOKEN = "seu_token_github"
```

**macOS/Linux (Terminal):**
```bash
export GH_TOKEN="seu_token_github"
export GITHUB_TOKEN="seu_token_github"
```

### Passo 3: Atualizar electron-builder.json

Adicione a configuração de publicação ao arquivo `electron-builder.json`:

```json
{
  "publish": {
    "provider": "github",
    "owner": "seu-usuario",
    "repo": "neuromodulation_mapper",
    "releaseType": "release"
  }
}
```

Substitua:
- `seu-usuario` - Seu nome de usuário no GitHub
- `neuromodulation_mapper` - Nome do seu repositório

### Passo 4: Criar Release no GitHub

1. Vá para seu repositório no GitHub
2. Clique em **Releases** (ou **Tags**)
3. Clique em **Create a new release**
4. Preencha:
   - **Tag version**: v1.0.0 (deve corresponder à versão em package.json)
   - **Release title**: NeuroLaserMap 1.0.0
   - **Description**: Descrição das mudanças
5. Clique em **Publish release**

### Passo 5: Fazer Build e Publicar

Execute o comando de build:

```bash
npm run electron-build:all
```

Isto criará os instaladores e os publicará automaticamente no GitHub Releases.

---

## 📱 Como Usar (Para Usuários)

### Receber Notificação de Atualização

Quando uma nova versão estiver disponível, o NeuroLaserMap mostrará uma notificação na tela com:

- Versão disponível
- Data de lançamento
- Notas de atualização (se disponíveis)
- Botões: "Cancelar" e "Baixar"

### Baixar Atualização

Clique no botão **"Baixar"**. O aplicativo começará a baixar o novo instalador. Você verá:

- Porcentagem do download
- Velocidade de download (MB/s)
- Tempo estimado

**Importante**: Não feche o aplicativo durante o download.

### Instalar Atualização

Após o download ser concluído, você verá uma nova notificação com o botão **"Instalar Agora"**. Clique nele para:

1. Fechar o aplicativo
2. Instalar a nova versão
3. Reiniciar o aplicativo automaticamente

### Verificar Atualizações Manualmente

Se quiser verificar se há atualizações disponíveis:

1. Clique no menu **Ajuda**
2. Selecione **Verificar Atualizações**
3. O aplicativo verificará e mostrará o resultado

---

## 🔐 Segurança

### Assinatura de Código

Para maior segurança, você pode assinar os instaladores:

**Windows:**
```bash
set WIN_CSC_LINK=caminho/para/certificado.pfx
set WIN_CSC_KEY_PASSWORD=sua_senha
npm run electron-build:win
```

**macOS:**
```bash
export CSC_LINK=caminho/para/certificado.p12
export CSC_KEY_PASSWORD=sua_senha
npm run electron-build:mac
```

### Verificação de Integridade

O electron-updater verifica automaticamente a integridade dos arquivos baixados usando checksums.

---

## 🐛 Solução de Problemas

### Problema: "Atualização não aparece"

**Solução**: Verifique se:

1. Você publicou um novo release no GitHub
2. A versão no release é maior que a versão atual
3. O token do GitHub está configurado corretamente
4. O repositório é público (ou o token tem acesso)

### Problema: "Erro ao baixar atualização"

**Solução**: Verifique se:

1. Você tem conexão com a internet
2. O GitHub não está bloqueado pelo firewall
3. O arquivo de atualização foi publicado corretamente no release

### Problema: "Erro ao instalar atualização"

**Solução**: Tente:

1. Fechar o aplicativo completamente
2. Reiniciar o computador
3. Abrir o aplicativo novamente
4. Tentar a atualização novamente

### Problema: "Atualização não reinicia o aplicativo"

**Solução**: Reinicie o aplicativo manualmente. A próxima vez, ele abrirá com a nova versão.

---

## 📊 Monitorar Atualizações

### Logs de Atualização

Os logs de atualização são salvos em:

**Windows:**
```
C:\Users\seu_usuario\AppData\Roaming\NeuroLaserMap\logs\
```

**macOS:**
```
~/Library/Logs/NeuroLaserMap/
```

**Linux:**
```
~/.config/NeuroLaserMap/logs/
```

Procure por arquivos como `electron-updater.log` para ver detalhes.

### Análise de Uso

Para ver quantos usuários atualizaram:

1. Vá para seu repositório no GitHub
2. Clique em **Releases**
3. Veja o número de downloads para cada versão

---

## 🔄 Versioning

### Semântica de Versão

Use o padrão de versionamento semântico:

- **MAJOR.MINOR.PATCH** (ex: 1.2.3)
- **MAJOR**: Mudanças incompatíveis
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções de bugs

Exemplos:
- v1.0.0 - Primeira versão
- v1.1.0 - Nova funcionalidade
- v1.1.1 - Correção de bug
- v2.0.0 - Mudança incompatível

---

## 📝 Checklist de Publicação

Antes de publicar uma nova versão:

- [ ] Atualize a versão em `package.json`
- [ ] Atualize o `CHANGELOG.md` com as mudanças
- [ ] Teste a aplicação completamente
- [ ] Faça commit e push para o GitHub
- [ ] Crie um novo release no GitHub
- [ ] Execute `npm run electron-build:all`
- [ ] Verifique se os arquivos foram publicados no release
- [ ] Teste a atualização em um computador diferente

---

## 🎯 Boas Práticas

1. **Versione tudo** - Sempre atualize a versão em `package.json` antes de publicar
2. **Teste antes** - Teste a atualização em um computador diferente antes de publicar
3. **Documente mudanças** - Sempre escreva notas de atualização claras
4. **Versione incrementalmente** - Não pule versões
5. **Mantenha releases antigos** - Não delete releases antigos no GitHub

---

## 📚 Referências

- [Documentação do electron-updater](https://www.electron.build/auto-update)
- [Documentação do electron-builder](https://www.electron.build/)
- [GitHub Releases API](https://docs.github.com/en/rest/releases)
- [Semântica de Versão](https://semver.org/lang/pt-BR/)

---

## 🎉 Próximas Ações

1. Configure o token do GitHub
2. Crie um release no GitHub
3. Execute o build com `npm run electron-build:all`
4. Teste a atualização
5. Monitore os logs para garantir que está funcionando

---

**NeuroLaserMap Electron** - Guia de Atualização Automática

Versão 1.0.0 | Janeiro de 2026
