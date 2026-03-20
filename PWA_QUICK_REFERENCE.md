# NeuroLaserMap PWA - Quick Reference Card

## 🚀 Acesso Rápido

| O quê | Link |
|------|------|
| **PWA Principal** | https://3000-ipwt1mvxgwoomsk324iqs-ca7ba40a.us2.manus.computer |
| **Login** | https://3000-ipwt1mvxgwoomsk324iqs-ca7ba40a.us2.manus.computer/login |
| **Registro** | https://3000-ipwt1mvxgwoomsk324iqs-ca7ba40a.us2.manus.computer/register |
| **Logout** | https://3000-ipwt1mvxgwoomsk324iqs-ca7ba40a.us2.manus.computer/logout |

## 👤 Credenciais Admin

```
Email: charonejr@gmail.com
Senha: 12345
```

## 📋 Fluxo Rápido

### 1️⃣ Novo usuário se registra
- Acessa `/register`
- Preenche dados
- Clica "Cadastrar"
- **Status:** Pendente

### 2️⃣ Você aprova no painel
- Faz login com suas credenciais
- Clica aba "Admin"
- Vê usuário em "Pendentes"
- Clica "Aprovar"
- **Status:** Ativo

### 3️⃣ Usuário faz login
- Acessa `/login`
- Preenche email/senha
- Clica "Entrar"
- **Resultado:** Acesso ao app

## 🔗 APIs

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/pwaAuth.register` | Registrar novo usuário |
| POST | `/api/pwaAuth.login` | Fazer login |
| POST | `/api/pwaAuth.logout` | Fazer logout |
| GET | `/api/pwaAuth.pending-users` | Listar pendentes (admin) |
| POST | `/api/pwaAuth.approve` | Aprovar usuário (admin) |
| POST | `/api/pwaAuth.reject` | Rejeitar usuário (admin) |

## 💾 Dados

**Arquivo:** `/home/ubuntu/neuromodulation_mapper/users.json`

**Ver usuários:**
```bash
cat /home/ubuntu/neuromodulation_mapper/users.json
```

## ✅ Status de Usuário

| Status | Significado | Pode fazer login? |
|--------|------------|------------------|
| `pending` | Aguardando aprovação | ❌ Não |
| `active` | Aprovado | ✅ Sim |
| `rejected` | Rejeitado | ❌ Não |

## 🔧 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| Não consegue fazer logout | Acesse `/logout` |
| Usuário não aparece em pendentes | Verifique `users.json` |
| API retorna erro | Reinicie o servidor |
| Esqueceu a senha | Não há reset, contate admin |

## 📱 iOS/Android

- ❌ Não têm login PWA
- ✅ Continuam funcionando normalmente
- ✅ Não são afetados por mudanças no PWA

## 🎯 Próximas Ações

1. **Testar fluxo completo** - Registre, aprove, faça login
2. **Adicionar email de notificação** - Avisar quando usuário se registra
3. **Implementar recuperação de senha** - Reset por email
