# Guia da Página de Downloads - NeuroLaserMap

**Como usar a página de downloads com sistema de registro e aprovação**

Versão: 1.0.0 | Janeiro de 2026

---

## 📋 Visão Geral

A página de downloads do NeuroLaserMap inclui:

1. **downloads.html** - Página pública onde usuários se registram
2. **admin.html** - Painel de administração para você gerenciar registros

---

## 🌐 Como Funciona

### Fluxo de Usuário

1. Usuário acessa `downloads.html`
2. Preenche o formulário de registro com seus dados
3. Seleciona a versão desejada (Windows, macOS ou Expo Go)
4. Clica em "Registrar e Receber Download"
5. Recebe mensagem de confirmação
6. Aguarda aprovação por e-mail

### Fluxo de Administrador (Você)

1. Acessa `admin.html`
2. Vê lista de registros pendentes
3. Clica em "Aprovar" para autorizar o download
4. Usuário recebe e-mail com link de download
5. Pode visualizar estatísticas e exportar dados

---

## 🚀 Como Usar

### Passo 1: Hospedar as Páginas

Você precisa hospedar os arquivos HTML em um servidor web. Opções:

**Opção A: GitHub Pages (Gratuito)**
1. Crie um repositório no GitHub
2. Faça upload dos arquivos `downloads.html` e `admin.html`
3. Ative GitHub Pages nas configurações
4. Acesse: `https://seu-usuario.github.io/seu-repo/downloads.html`

**Opção B: Netlify (Gratuito)**
1. Vá para [netlify.com](https://netlify.com)
2. Clique em "Drop files here to add a project"
3. Arraste os arquivos HTML
4. Pronto! Você terá um link público

**Opção C: Seu próprio servidor**
1. Coloque os arquivos em um servidor web (Apache, Nginx, etc)
2. Acesse via seu domínio

### Passo 2: Compartilhar Link de Downloads

Compartilhe o link da página `downloads.html` com seus usuários:

```
https://seu-site.com/downloads.html
```

Você pode colocar esse link em:
- Site da sua clínica
- E-mail de marketing
- Redes sociais
- Documentação

### Passo 3: Gerenciar Registros

Para gerenciar os registros:

1. Acesse `admin.html` no seu navegador
2. Veja a lista de registros pendentes
3. Clique em "Ver" para ver detalhes completos
4. Clique em "Aprovar" para autorizar o download
5. O usuário receberá um e-mail com o link

---

## 📊 Painel de Administração

### Estatísticas

O painel mostra:
- **Total de Registros** - Quantos usuários se registraram
- **Pendentes** - Aguardando sua aprovação
- **Aprovados** - Já receberam acesso
- **Rejeitados** - Solicitações recusadas

### Filtros

Você pode filtrar por:
- **Todos** - Ver todos os registros
- **Pendentes** - Apenas os que aguardam aprovação
- **Aprovados** - Apenas os aprovados
- **Rejeitados** - Apenas os rejeitados

### Busca

Use a caixa de busca para procurar por:
- Nome do usuário
- E-mail
- Telefone

### Ações

Para cada registro, você pode:
- **Ver** - Visualizar detalhes completos
- **Aprovar** - Autorizar o download (envia e-mail)
- **Rejeitar** - Recusar a solicitação

### Exportar Dados

Clique em "Exportar CSV" para baixar todos os registros em formato Excel:
- Nome
- E-mail
- Telefone
- Profissão
- Instituição
- Versão desejada
- Status
- Data de registro

---

## 📧 Sistema de E-mail

### Notificações para Você

Quando um usuário se registra, você recebe uma notificação com:
- Nome completo
- E-mail
- Telefone
- Profissão
- Instituição
- Versão desejada
- Timestamp do registro

### Notificações para o Usuário

Quando você aprova um registro, o usuário recebe:
- Confirmação de aprovação
- Links de download para Windows e macOS
- Link do Expo Go
- Instruções de instalação

---

## 🔧 Configuração Avançada

### Adicionar Links de Download Reais

No arquivo `downloads.html`, procure por:

```html
<option value="Windows">Windows (.exe)</option>
<option value="macOS">macOS (.dmg)</option>
```

Você pode adicionar links reais de download. Procure pela função `downloadFile()` e adicione:

```javascript
function downloadFile(platform) {
    const links = {
        'Windows': 'https://seu-site.com/downloads/NeuroLaserMap-Setup.exe',
        'macOS': 'https://seu-site.com/downloads/NeuroLaserMap.dmg',
        'Expo Go': 'exps://seu-link'
    };
    window.open(links[platform]);
}
```

### Integrar com Servidor Backend

Para usar um servidor real em vez de localStorage:

1. Crie um endpoint POST em seu servidor:
```
POST /api/registrations
Body: { name, email, phone, profession, institution, message, platform }
```

2. Modifique a função `form.addEventListener('submit', ...)` em `downloads.html`

3. Envie os dados para seu servidor em vez de localStorage

### Enviar E-mails Reais

Para enviar e-mails reais, use um serviço como:
- **SendGrid** - sendgrid.com
- **Mailgun** - mailgun.com
- **AWS SES** - aws.amazon.com/ses
- **Brevo** (ex-Sendinblue) - brevo.com

---

## 💾 Armazenamento de Dados

### Atualmente (localStorage)

Os dados são salvos no navegador do seu computador. Isso significa:
- Dados persistem apenas naquele navegador
- Se você limpar o cache, perde os dados
- Não é seguro para produção

### Em Produção (Recomendado)

Use um banco de dados real:
- **PostgreSQL** - Banco de dados robusto
- **MongoDB** - Banco de dados NoSQL
- **Firebase** - Backend como serviço (Google)
- **Supabase** - Alternativa open-source ao Firebase

---

## 🔐 Segurança

### Proteção de Dados

Para proteger os dados dos usuários:

1. **Use HTTPS** - Sempre use conexão segura
2. **Valide dados** - Valide todos os inputs no servidor
3. **Criptografe** - Criptografe dados sensíveis
4. **Backup** - Faça backup regular dos dados

### Proteção do Painel Admin

Para proteger o painel de administração:

1. **Adicione autenticação** - Exija login e senha
2. **Use HTTPS** - Sempre conexão segura
3. **Restrinja acesso** - Use IP whitelist se possível
4. **Logs de auditoria** - Registre quem aprovou o quê

---

## 📱 Responsividade

As páginas funcionam em:
- ✅ Desktop (Windows, macOS, Linux)
- ✅ Tablet (iPad, Android)
- ✅ Smartphone (iPhone, Android)

---

## 🐛 Solução de Problemas

### Problema: Dados desaparecem ao fechar o navegador

**Solução**: Isso é normal com localStorage. Use um banco de dados real em produção.

### Problema: E-mails não são enviados

**Solução**: Atualmente, os e-mails são apenas simulados. Integre com um serviço de e-mail real.

### Problema: Página não carrega

**Solução**: Verifique se:
1. O arquivo está no local correto
2. O servidor está rodando
3. Não há erros no console do navegador (F12)

### Problema: Formulário não funciona

**Solução**: Verifique:
1. Todos os campos obrigatórios estão preenchidos
2. O e-mail é válido
3. Não há erros no console (F12)

---

## 📝 Checklist de Implantação

Antes de colocar em produção:

- [ ] Hospedar as páginas em um servidor
- [ ] Testar o formulário de registro
- [ ] Testar o painel de administração
- [ ] Configurar e-mails reais
- [ ] Adicionar links de download reais
- [ ] Configurar banco de dados
- [ ] Adicionar autenticação no painel admin
- [ ] Usar HTTPS
- [ ] Testar em dispositivos móveis
- [ ] Fazer backup dos dados

---

## 🎯 Próximas Ações

1. **Hospedar as páginas** - Use GitHub Pages, Netlify ou seu servidor
2. **Configurar e-mails** - Integre com SendGrid ou similar
3. **Adicionar banco de dados** - Use PostgreSQL ou Firebase
4. **Implementar autenticação** - Proteja o painel admin
5. **Customizar design** - Adicione seu logo e cores

---

## 📚 Referências

- [HTML/CSS/JavaScript](https://developer.mozilla.org/pt-BR/)
- [GitHub Pages](https://pages.github.com/)
- [Netlify](https://www.netlify.com/)
- [SendGrid](https://sendgrid.com/)
- [Firebase](https://firebase.google.com/)

---

**NeuroLaserMap** - Guia da Página de Downloads

Versão 1.0.0 | Janeiro de 2026
