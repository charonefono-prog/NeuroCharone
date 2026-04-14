# Guia: Como Dar Permissão de Execução ao Arquivo `.command`

**Para usuários sem familiaridade com Terminal**

Versão: 1.0.0 | Janeiro de 2026

---

## 📋 O Que é Permissão de Execução?

No macOS, alguns arquivos precisam de "permissão" para serem executados (rodados). É como uma chave que abre uma porta.

O arquivo `gerar-instalador.command` precisa dessa permissão para funcionar.

---

## ✅ Método 1: Usando o Finder (Mais Fácil)

Este é o método **mais simples** e **não requer Terminal**.

### Passo 1: Localize o Arquivo

1. Abra o **Finder** (ícone de pasta no Dock)
2. Navegue até a pasta onde está `gerar-instalador.command`
3. Você deve ver um arquivo com este nome

### Passo 2: Clique com Botão Direito

1. **Clique com botão direito** (ou Ctrl+clique) no arquivo `gerar-instalador.command`
2. Uma janela vai aparecer com várias opções

### Passo 3: Selecione "Abrir"

1. Clique em **"Abrir"** (ou "Open" se estiver em inglês)
2. Uma mensagem pode aparecer perguntando se você tem certeza
3. Clique em **"Abrir"** novamente

### Passo 4: Pronto!

O macOS vai automaticamente dar a permissão de execução ao arquivo.

**Agora você pode clicar duas vezes no arquivo normalmente!**

---

## ✅ Método 2: Usando o Terminal (Se o Método 1 Não Funcionar)

Se o Método 1 não funcionou, siga estes passos:

### Passo 1: Abra o Terminal

1. Pressione `Cmd + Espaço` (barra de espaço)
2. Digite `Terminal`
3. Pressione `Enter`

Uma janela preta vai abrir. Isso é o Terminal.

### Passo 2: Copie Este Comando

Copie exatamente este texto:

```bash
chmod +x ~/Documents/neuromodulation_mapper/gerar-instalador.command
```

**Observação**: Se você salvou o projeto em outro lugar, ajuste o caminho:
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
3. A senha **não aparece** enquanto você digita (isso é normal!)

### Passo 5: Pronto!

Se não aparecer nenhuma mensagem de erro, a permissão foi dada com sucesso!

---

## ✅ Método 3: Usando as Propriedades do Arquivo

Se os métodos anteriores não funcionarem:

### Passo 1: Clique com Botão Direito

1. Clique com botão direito no arquivo `gerar-instalador.command`
2. Selecione **"Informações"** (ou "Get Info" em inglês)

### Passo 2: Abra a Seção "Compartilhamento e Permissões"

1. Uma janela vai abrir
2. Role para baixo até encontrar **"Compartilhamento e Permissões"**
3. Clique na seta para expandir

### Passo 3: Procure por "Executar"

1. Procure por uma linha que diga algo como:
   - "Você pode: Ler e Escrever"
   - "Você pode: Ler"

2. Se houver uma opção de **"Executar"** ou **"Ler e Escrever"**, clique nela

### Passo 4: Feche a Janela

Feche a janela de Informações. A permissão foi dada!

---

## 🧪 Como Verificar se Funcionou

Depois de dar a permissão, teste assim:

### Teste 1: Ícone do Arquivo

1. Abra o Finder
2. Procure pelo arquivo `gerar-instalador.command`
3. Se o ícone mudou ou parece diferente, a permissão foi dada!

### Teste 2: Clique Duplo

1. Clique duas vezes no arquivo
2. Se uma janela de Terminal abrir, funcionou!
3. Se nada acontecer, tente novamente o Método 1 ou 2

---

## 🐛 Solução de Problemas

### Problema: "Permissão Negada"

**Solução**:
1. Tente o Método 1 novamente
2. Se não funcionar, use o Método 2 com o Terminal
3. Se pedir senha, digite sua senha do Mac

### Problema: "Arquivo Não Encontrado"

**Solução**:
1. Verifique se o arquivo está realmente na pasta
2. Se moveu o arquivo, ajuste o caminho no comando
3. Exemplo: Se está em Desktop, use `~/Desktop/neuromodulation_mapper/gerar-instalador.command`

### Problema: Terminal Mostra Erro

**Solução**:
1. Copie exatamente o comando (sem erros de digitação)
2. Verifique o caminho da pasta
3. Se ainda não funcionar, tente o Método 1

### Problema: Arquivo Não Executa

**Solução**:
1. Clique com botão direito no arquivo
2. Selecione "Abrir"
3. Clique em "Abrir" novamente na mensagem que aparecer

---

## 📝 Checklist

Siga estes passos em ordem:

- [ ] Localizei o arquivo `gerar-instalador.command`
- [ ] Tentei o Método 1 (Finder + Botão Direito)
- [ ] Se não funcionou, tentei o Método 2 (Terminal)
- [ ] Testei clicando duas vezes no arquivo
- [ ] Uma janela de Terminal abriu
- [ ] Aguardei 15-25 minutos
- [ ] O arquivo `.dmg` foi gerado em `dist-electron/`

---

## 💡 Dicas Importantes

### Dica 1: Copiar o Caminho Correto

Se não tem certeza do caminho:

1. Abra o Finder
2. Clique com botão direito na pasta do projeto
3. Segure `Alt` e clique em "Copiar como Caminho"
4. Cole no Terminal

### Dica 2: Drag and Drop

Você pode arrastar o arquivo para o Terminal:

1. Abra o Terminal
2. Digite: `chmod +x `
3. Arraste o arquivo `gerar-instalador.command` para o Terminal
4. Pressione `Enter`

### Dica 3: Salvar o Comando

Se vai usar várias vezes, salve o comando:

1. Abra o Bloco de Notas
2. Cole o comando
3. Salve como `comando.txt`
4. Próxima vez, copie de lá

---

## 🎯 Resumo Rápido

| Método | Dificuldade | Tempo |
|--------|------------|-------|
| Método 1 (Finder) | ⭐ Muito Fácil | 1 minuto |
| Método 2 (Terminal) | ⭐⭐ Fácil | 2 minutos |
| Método 3 (Propriedades) | ⭐⭐⭐ Médio | 3 minutos |

**Recomendação**: Comece pelo Método 1. Se não funcionar, tente o Método 2.

---

## 📞 Precisa de Ajuda?

Se tiver dúvidas:

1. Releia este guia com calma
2. Tente um método diferente
3. Procure ajuda em comunidades macOS
4. Consulte a documentação do macOS

---

## 🎓 Aprenda Mais

Se quer entender melhor:

- **O que é chmod?** - É um comando que muda permissões de arquivos
- **O que é .command?** - É um script que o macOS executa
- **Por que preciso de permissão?** - Por segurança, para evitar executar arquivos perigosos

---

**NeuroLaserMap** - Guia de Permissões de Arquivo

Versão 1.0.0 | Janeiro de 2026

---

## 🎉 Próximo Passo

Depois de dar a permissão ao arquivo:

1. Clique duas vezes em `gerar-instalador.command`
2. Aguarde 15-25 minutos
3. O instalador `.dmg` será gerado automaticamente
4. Teste o instalador
5. Distribua com seus usuários!
