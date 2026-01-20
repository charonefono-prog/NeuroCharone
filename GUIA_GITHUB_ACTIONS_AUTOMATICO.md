# GitHub Actions - Gerar Instaladores Automaticamente

**Guia para gerar .dmg (macOS) e .exe (Windows) automaticamente na nuvem**

Versão: 1.0.0 | Janeiro de 2026

---

## 🎯 O Que É?

**GitHub Actions** é um serviço que:
- ✅ Compila seu código automaticamente
- ✅ Gera instaladores para Windows e macOS
- ✅ Tudo acontece na nuvem (você não precisa fazer nada!)
- ✅ Os arquivos ficam prontos para baixar

---

## 🚀 Como Funciona (3 Passos Simples)

### Passo 1: Fazer Upload do Projeto para GitHub

1. Vá para [github.com](https://github.com)
2. Clique em **"New Repository"** (novo repositório)
3. Preencha:
   - **Repository name**: `neuromodulation_mapper`
   - **Description**: `NeuroLaserMap - Aplicativo de Neuromodulação`
   - **Public** (público, para que todos vejam)
4. Clique em **"Create repository"**

### Passo 2: Fazer Upload dos Arquivos

No seu computador:

1. Abra o Terminal (Mac) ou PowerShell (Windows)
2. Vá para a pasta do projeto:
   ```bash
   cd ~/Documents/neuromodulation_mapper
   ```

3. Execute estes comandos:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/seu-usuario/neuromodulation_mapper.git
   git push -u origin main
   ```

### Passo 3: Criar uma Release para Gerar Instaladores

1. Vá para seu repositório no GitHub
2. Clique em **"Releases"** (lado direito)
3. Clique em **"Create a new release"**
4. Preencha:
   - **Tag version**: `v1.0.0`
   - **Release title**: `NeuroLaserMap 1.0.0`
   - **Description**: Descreva as funcionalidades
5. Clique em **"Publish release"**

**Pronto!** GitHub Actions vai começar a compilar automaticamente!

---

## ⏳ Quanto Tempo Leva?

- **Primeira compilação**: 30-45 minutos (compila Windows e macOS em paralelo)
- **Próximas compilações**: 20-30 minutos

---

## 📥 Baixar os Instaladores

### Opção 1: Pela Release (Recomendado)

1. Vá para **Releases** no seu repositório
2. Procure pela versão `v1.0.0`
3. Você vai ver os arquivos:
   - `NeuroLaserMap-1.0.0.dmg` (macOS)
   - `NeuroLaserMap Setup 1.0.0.exe` (Windows)
4. Clique para baixar

### Opção 2: Pelos Artifacts

1. Vá para **Actions** no seu repositório
2. Procure pelo workflow mais recente
3. Clique nele
4. Procure por **Artifacts**
5. Baixe `macos-installers` ou `windows-installers`

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

### Passo 3: Criar Nova Release

1. Vá para **Releases**
2. Clique em **"Create a new release"**
3. Tag: `v1.1.0`
4. Clique em **"Publish release"**

**GitHub Actions vai compilar automaticamente!**

---

## 🐛 Se Algo Der Errado

### Problema: Workflow Não Executa

**Solução**:
1. Vá para **Actions**
2. Procure pelo workflow
3. Se houver erro, clique para ver os logs
4. Procure a mensagem de erro

### Problema: Compilação Falha

**Solução**:
1. Verifique os logs no GitHub Actions
2. Procure pela mensagem de erro
3. Corrija o código
4. Faça commit e push
5. Crie uma nova release

### Problema: Não Vejo os Arquivos

**Solução**:
1. Aguarde a compilação terminar (30-45 minutos)
2. Atualize a página do GitHub
3. Procure em **Releases** ou **Artifacts**

---

## 📋 Checklist

- [ ] Criei repositório no GitHub
- [ ] Fiz upload dos arquivos
- [ ] Criei uma release (v1.0.0)
- [ ] Aguardei 30-45 minutos
- [ ] Baixei os instaladores
- [ ] Testei os instaladores
- [ ] Pronto para distribuir!

---

## 🎯 Resumo Rápido

| Ação | Tempo | Automático? |
|------|-------|------------|
| Upload para GitHub | 5 min | ❌ Manual |
| Criar Release | 1 min | ❌ Manual |
| Compilar | 30-45 min | ✅ Automático |
| Baixar | 2 min | ❌ Manual |

---

## 💡 Dicas

### Dica 1: Testar Antes de Publicar

Sempre teste os instaladores antes de compartilhar:

1. Baixe o `.dmg` e teste no Mac
2. Baixe o `.exe` e teste no Windows
3. Se tudo funcionar, compartilhe!

### Dica 2: Versioning

Use versioning semântico:
- `v1.0.0` - Versão inicial
- `v1.0.1` - Correção de bug
- `v1.1.0` - Nova funcionalidade
- `v2.0.0` - Grande mudança

### Dica 3: Notas de Release

Sempre descreva o que mudou:

```
## NeuroLaserMap 1.1.0

### Novas Funcionalidades
- Adicionado suporte a múltiplos pacientes
- Melhorado interface de gráficos

### Correções
- Corrigido bug de salvamento de dados
- Melhorada performance

### Instaladores
- macOS: NeuroLaserMap-1.1.0.dmg
- Windows: NeuroLaserMap Setup 1.1.0.exe
```

---

## 🎓 Aprenda Mais

- **GitHub**: [github.com](https://github.com)
- **GitHub Actions**: [docs.github.com/actions](https://docs.github.com/actions)
- **Releases**: [docs.github.com/releases](https://docs.github.com/releases)

---

## 🎉 Próximo Passo

1. Crie repositório no GitHub
2. Faça upload dos arquivos
3. Crie uma release
4. Aguarde 30-45 minutos
5. Baixe os instaladores
6. Teste e distribua!

---

**NeuroLaserMap** - Guia GitHub Actions

Versão 1.0.0 | Janeiro de 2026
