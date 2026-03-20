# NeuroLaserMap PWA - Guia de Autenticação e Aprovação de Usuários

## 📋 Resumo Executivo

O sistema de autenticação PWA foi implementado com as seguintes funcionalidades:

- ✅ **Login com Email/Senha** - Acesso seguro ao PWA
- ✅ **Registro de Usuários** - Novos usuários podem se cadastrar
- ✅ **Aprovação de Usuários** - Você (admin) aprova cadastros pendentes
- ✅ **Painel de Admin Integrado** - Gerenciamento de usuários no app existente
- ✅ **Separação PWA vs Nativo** - iOS/Android não são afetados

---

## 🌐 Links de Acesso

### PWA Web
- **URL:** https://3000-ipwt1mvxgwoomsk324iqs-ca7ba40a.us2.manus.computer
- **Credenciais Admin:** 
  - Email: `charonejr@gmail.com`
  - Senha: `12345`

### Logout
- **URL:** https://3000-ipwt1mvxgwoomsk324iqs-ca7ba40a.us2.manus.computer/logout
- Limpa a sessão e redireciona para login

---

## 🔄 Fluxo de Autenticação

### 1. Novo Usuário se Registra
```
Usuário acessa /register
↓
Preenche: Nome, Email, Senha
↓
Clica em "Cadastrar"
↓
Conta criada com status "pending"
↓
Mensagem: "Aguarde aprovação do administrador"
```

### 2. Admin Aprova Cadastro
```
Você faz login com charonejr@gmail.com / 12345
↓
Clica na aba "Admin"
↓
Vê lista de usuários pendentes
↓
Clica em "Aprovar" ou "Rejeitar"
↓
Usuário recebe confirmação
```

### 3. Usuário Faz Login
```
Usuário acessa /login
↓
Preenche: Email, Senha
↓
Clica em "Entrar"
↓
Se aprovado: Acessa o app
↓
Se pendente: Mensagem de erro
```

---

## 🛠️ Estrutura Técnica

### Servidor (Node.js + Express)

**Arquivo:** `server.js`

**Rotas de Autenticação:**
- `POST /api/pwaAuth.register` - Registrar novo usuário
- `POST /api/pwaAuth.login` - Fazer login
- `POST /api/pwaAuth.logout` - Fazer logout
- `GET /api/pwaAuth.pending-users` - Listar usuários pendentes (admin)
- `POST /api/pwaAuth.approve` - Aprovar usuário (admin)
- `POST /api/pwaAuth.reject` - Rejeitar usuário (admin)

**Rotas de Página:**
- `GET /login` - Página de login
- `GET /register` - Página de registro
- `GET /logout` - Página de logout (limpa sessão)
- `GET /admin` - Painel de admin (separado - não usar)

**Persistência:**
- Arquivo: `users.json`
- Formato: JSON com usuários e seus dados

### App (React Native + Expo)

**Arquivo:** `app/(tabs)/admin.tsx`

**Funcionalidades:**
- Busca usuários PWA via `/api/pwaAuth.pending-users`
- Mostra usuários pendentes com badge "PWA"
- Botões para aprovar/rejeitar
- Auto-refresh ao abrir a aba

**Arquivo:** `lib/api-config.ts`
- Configuração de URL base da API
- Detecta automaticamente porta correta (3000 ou 8081)

---

## 📱 Separação PWA vs iOS/Android

### PWA Web (Porta 3000)
- ✅ Login obrigatório
- ✅ Registro com aprovação
- ✅ Painel de admin integrado
- ✅ Persistência em arquivo JSON

### iOS/Android (Porta 8081)
- ❌ Sem login PWA
- ❌ Sem aprovação de usuários
- ✅ Funcionam normalmente
- ✅ Não são afetados por mudanças no PWA

---

## 🔐 Segurança

### Senhas
- Armazenadas com hash bcrypt
- Nunca em texto plano

### Tokens
- JWT com expiração configurável
- Armazenados em localStorage (PWA)

### Admin
- Apenas você (charonejr@gmail.com) é admin
- Credenciais hardcoded no servidor

---

## 📊 Banco de Dados

### Arquivo: `users.json`

**Estrutura:**
```json
{
  "user@email.com": {
    "id": "unique-id",
    "name": "Nome do Usuário",
    "email": "user@email.com",
    "password": "hash-bcrypt",
    "status": "pending|active|rejected",
    "createdAt": "2026-03-20T22:00:00Z",
    "approvedAt": null
  }
}
```

**Status:**
- `pending` - Aguardando aprovação
- `active` - Aprovado e pode fazer login
- `rejected` - Rejeitado

---

## 🚀 Como Testar

### Teste 1: Registro
1. Acesse https://3000-ipwt1mvxgwoomsk324iqs-ca7ba40a.us2.manus.computer/register
2. Preencha: Nome, Email, Senha
3. Clique em "Cadastrar"
4. Veja a mensagem de sucesso

### Teste 2: Aprovação
1. Acesse https://3000-ipwt1mvxgwoomsk324iqs-ca7ba40a.us2.manus.computer
2. Faça logout: https://3000-ipwt1mvxgwoomsk324iqs-ca7ba40a.us2.manus.computer/logout
3. Faça login com `charonejr@gmail.com` / `12345`
4. Clique na aba "Admin"
5. Veja o usuário registrado em "Pendentes"
6. Clique em "Aprovar"

### Teste 3: Login Aprovado
1. Faça logout
2. Acesse https://3000-ipwt1mvxgwoomsk324iqs-ca7ba40a.us2.manus.computer/login
3. Faça login com o email do usuário aprovado
4. Veja o app carregando

---

## 🔧 Troubleshooting

### Problema: Usuário não aparece em "Pendentes"
**Solução:** Verifique se o usuário foi realmente registrado:
```bash
cat /home/ubuntu/neuromodulation_mapper/users.json
```

### Problema: Logout não funciona
**Solução:** Acesse `/logout` diretamente:
```
https://3000-ipwt1mvxgwoomsk324iqs-ca7ba40a.us2.manus.computer/logout
```

### Problema: API retorna erro 404
**Solução:** Verifique se o servidor está rodando:
```bash
curl http://localhost:3000/api/pwaAuth.pending-users
```

---

## 📝 Próximos Passos Sugeridos

1. **Notificações por Email**
   - Enviar email quando usuário se registra
   - Enviar email quando usuário é aprovado/rejeitado

2. **Procedimento tRPC**
   - Integrar aprovação de usuários via tRPC
   - Melhor integração com o app

3. **Histórico de Aprovações**
   - Aba separada para usuários aprovados/rejeitados
   - Filtros por data e email

4. **Recuperação de Senha**
   - Implementar "Esqueci minha senha"
   - Reset por email

---

## 📞 Suporte

Para dúvidas ou problemas, verifique:
1. Se o servidor está rodando: `webdev_check_status`
2. Se os dados estão no banco: `cat users.json`
3. Se a API responde: `curl http://localhost:3000/api/pwaAuth.pending-users`
