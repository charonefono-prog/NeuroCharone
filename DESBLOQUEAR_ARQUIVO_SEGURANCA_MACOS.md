# Como Desbloquear Arquivo Bloqueado por Segurança do macOS

**Solução para quando o macOS não deixa executar o arquivo `.command`**

Versão: 1.0.0 | Janeiro de 2026

---

## 🔒 O Que Está Acontecendo?

O macOS tem um sistema de segurança chamado **Gatekeeper** que bloqueia arquivos baixados da internet.

Você pode ver mensagens como:
- "Não é possível abrir porque o desenvolvedor não pode ser verificado"
- "Arquivo está danificado"
- "Não tem permissão para abrir"

Isso é **normal e seguro**. Vamos desbloquear!

---

## ✅ Solução 1: Clique com Botão Direito + Abrir (Mais Fácil)

Este é o método **mais simples** e **funciona na maioria dos casos**.

### Passo 1: Clique com Botão Direito

1. Localize o arquivo `gerar-instalador.command`
2. **Clique com botão direito** (ou Ctrl+clique) no arquivo
3. Uma janela com opções vai aparecer

### Passo 2: Selecione "Abrir"

1. Procure pela opção **"Abrir"** (ou "Open" em inglês)
2. Clique nela

### Passo 3: Confirme

1. Uma mensagem pode aparecer perguntando se tem certeza
2. Clique em **"Abrir"** novamente
3. Digite sua senha do Mac se pedir

### Passo 4: Pronto!

O arquivo vai executar e o Terminal vai abrir!

---

## ✅ Solução 2: Remover Atributo de Quarentena (Se Solução 1 Não Funcionar)

Se a Solução 1 não funcionou, use o Terminal:

### Passo 1: Abra o Terminal

1. Pressione `Cmd + Espaço`
2. Digite `Terminal`
3. Pressione `Enter`

### Passo 2: Cole Este Comando

Copie exatamente este comando:

```bash
xattr -d com.apple.quarantine ~/Documents/neuromodulation_mapper/gerar-instalador.command
```

**Se o arquivo está em outro lugar:**
- Se está em `Desktop`: `~/Desktop/neuromodulation_mapper/gerar-instalador.command`
- Se está em `Downloads`: `~/Downloads/neuromodulation_mapper/gerar-instalador.command`

### Passo 3: Cole no Terminal

1. Clique na janela do Terminal
2. Pressione `Cmd + V` para colar
3. Pressione `Enter`

### Passo 4: Aguarde

O Terminal pode pedir sua senha. Se pedir:

1. Digite sua senha do Mac
2. Pressione `Enter`
3. A senha **não aparece** enquanto você digita (normal!)

### Passo 5: Feche o Terminal

Se não aparecer nenhuma mensagem de erro, funcionou!

Agora você pode clicar duas vezes no arquivo normalmente.

---

## ✅ Solução 3: Desabilitar Gatekeeper Temporariamente

**⚠️ Aviso**: Esta solução é mais técnica. Use apenas se as anteriores não funcionarem.

### Passo 1: Abra o Terminal

1. Pressione `Cmd + Espaço`
2. Digite `Terminal`
3. Pressione `Enter`

### Passo 2: Cole Este Comando

```bash
sudo spctl --master-disable
```

### Passo 3: Digite Sua Senha

1. Digite sua senha do Mac
2. Pressione `Enter`

### Passo 4: Agora Tente Executar o Arquivo

Clique duas vezes em `gerar-instalador.command`

### Passo 5: Reabilitar Gatekeeper (Importante!)

Depois de terminar, **reabilite o Gatekeeper** para segurança:

```bash
sudo spctl --master-enable
```

---

## 🧪 Teste Rápido

Depois de desbloquear, teste assim:

1. Clique duas vezes em `gerar-instalador.command`
2. Uma janela de Terminal deve abrir
3. Você verá mensagens de progresso
4. Aguarde 15-25 minutos

Se funcionou, ótimo! Se não, tente a próxima solução.

---

## 🐛 Solução de Problemas

### Problema: "Ainda Não Deixa Abrir"

**Solução**:
1. Tente a Solução 2 (remover atributo de quarentena)
2. Se não funcionar, tente a Solução 3 (desabilitar Gatekeeper)

### Problema: "Comando Não Encontrado"

**Solução**:
1. Verifique se o arquivo está realmente na pasta
2. Verifique o caminho (Documents, Desktop, Downloads?)
3. Ajuste o comando com o caminho correto

### Problema: "Permission Denied"

**Solução**:
1. Digite sua senha quando pedir
2. Se não pedir, tente novamente
3. Se ainda não funcionar, reinicie o Mac

### Problema: "Arquivo Não Existe"

**Solução**:
1. Procure o arquivo no Finder
2. Copie o caminho completo
3. Cole no comando do Terminal

---

## 💡 Dicas Importantes

### Dica 1: Drag and Drop para Encontrar o Caminho

Se não tem certeza do caminho:

1. Abra o Terminal
2. Digite: `xattr -d com.apple.quarantine `
3. Arraste o arquivo `gerar-instalador.command` para o Terminal
4. Pressione `Enter`

### Dica 2: Verificar Atributos

Para ver se o arquivo tem atributos de quarentena:

```bash
xattr ~/Documents/neuromodulation_mapper/gerar-instalador.command
```

Se aparecer `com.apple.quarantine`, precisa remover.

### Dica 3: Copiar Arquivo Novamente

Se nada funcionar:

1. Delete o arquivo `gerar-instalador.command`
2. Baixe novamente do GitHub
3. Tente novamente

---

## 📋 Checklist

Siga estes passos em ordem:

- [ ] Tentei a Solução 1 (Clique com botão direito + Abrir)
- [ ] Se não funcionou, tentei a Solução 2 (Remover atributo)
- [ ] Se ainda não funcionou, tentei a Solução 3 (Desabilitar Gatekeeper)
- [ ] Testei clicando duas vezes no arquivo
- [ ] Terminal abriu com sucesso
- [ ] Aguardei 15-25 minutos
- [ ] Arquivo .dmg foi gerado

---

## 🎯 Resumo Rápido

| Solução | Dificuldade | Funciona |
|---------|------------|----------|
| Solução 1 (Botão Direito) | ⭐ Muito Fácil | 80% |
| Solução 2 (xattr) | ⭐⭐ Fácil | 95% |
| Solução 3 (Gatekeeper) | ⭐⭐⭐ Médio | 100% |

**Recomendação**: Comece pela Solução 1. Se não funcionar, tente a Solução 2.

---

## 📞 Precisa de Ajuda?

Se tiver dúvidas:

1. Releia este guia com calma
2. Tente uma solução diferente
3. Procure ajuda em comunidades macOS
4. Consulte a documentação do macOS

---

## 🎓 Aprenda Mais

Se quer entender melhor:

- **O que é Gatekeeper?** - Sistema de segurança do macOS que verifica arquivos
- **O que é com.apple.quarantine?** - Atributo que marca arquivos como "quarentenados"
- **Por que o macOS faz isso?** - Para proteger seu computador de arquivos perigosos

---

## 🎉 Próximo Passo

Depois de desbloquear o arquivo:

1. Clique duas vezes em `gerar-instalador.command`
2. Aguarde 15-25 minutos
3. O instalador `.dmg` será gerado
4. Teste o instalador
5. Distribua com seus usuários!

---

**NeuroLaserMap** - Guia de Desbloqueio de Segurança macOS

Versão 1.0.0 | Janeiro de 2026
