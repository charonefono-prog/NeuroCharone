# Guia de Teste - Autenticação PWA

Este guia descreve como testar o sistema de autenticação PWA no navegador.

## 🚀 Acessar a PWA

**URL:** https://8081-ipwt1mvxgwoomsk324iqs-ca7ba40a.us2.manus.computer

## 👤 Credenciais de Teste

### Admin (Carlos Charone)
```
Email: charonejr@gmail.com
Senha: 12345
Status: active (já aprovado)
```

### Usuários Pendentes (aguardando aprovação)
```
1. Edineuzasm
   Email: edineuzasm@hotmail.com
   Senha: senha123
   Status: pending

2. Maria Silva
   Email: maria.silva@example.com
   Senha: senha456
   Status: pending

3. João Santos
   Email: joao.santos@example.com
   Senha: senha789
   Status: pending
```

### Usuários Ativos (já aprovados)
```
1. Ana Costa
   Email: ana.costa@example.com
   Senha: senha000
   Status: active
```

### Usuários Rejeitados
```
1. Pedro Oliveira
   Email: pedro.oliveira@example.com
   Senha: senha111
   Status: rejected
```

---

## 📋 Fluxo de Teste 1: Login como Admin

### Passos:
1. Acesse a PWA
2. Clique em "Login"
3. Digite email: `charonejr@gmail.com`
4. Digite senha: `12345`
5. Clique em "Entrar"

### Resultado Esperado:
- ✅ Login bem-sucedido
- ✅ Redirecionado para home do app
- ✅ Pode acessar aba "Admin"

---

## 📋 Fluxo de Teste 2: Ver Usuários Pendentes no Painel Admin

### Pré-requisitos:
- Estar logado como admin (Carlos Charone)

### Passos:
1. Após login, procure pela aba "Admin" (geralmente última aba)
2. Clique na aba "Admin"
3. Observe a seção "Pendentes"

### Resultado Esperado:
- ✅ Aparecem 3 usuários pendentes:
  - Edineuzasm (edineuzasm@hotmail.com)
  - Maria Silva (maria.silva@example.com)
  - João Santos (joao.santos@example.com)
- ✅ Cada usuário mostra:
  - Nome
  - Email
  - Status: "Pendente" (com badge amarela)
  - Botões: "Aprovar" e "Rejeitar"

---

## 📋 Fluxo de Teste 3: Aprovar Usuário Pendente

### Pré-requisitos:
- Estar no painel Admin
- Ver usuários pendentes

### Passos:
1. Localize "Edineuzasm" na lista
2. Clique no botão "Aprovar"
3. Confirme a ação se solicitado

### Resultado Esperado:
- ✅ Mensagem de sucesso: "Usuário PWA edineuzasm@hotmail.com aprovado"
- ✅ Edineuzasm desaparece da lista de pendentes
- ✅ Agora aparece na lista de "Aprovados"

---

## 📋 Fluxo de Teste 4: Rejeitar Usuário Pendente

### Pré-requisitos:
- Estar no painel Admin
- Ver usuários pendentes

### Passos:
1. Localize "João Santos" na lista
2. Clique no botão "Rejeitar"
3. Confirme a ação se solicitado

### Resultado Esperado:
- ✅ Mensagem de sucesso: "Usuário PWA joao.santos@example.com rejeitado"
- ✅ João Santos desaparece da lista de pendentes
- ✅ Agora aparece na lista de "Rejeitados"

---

## 📋 Fluxo de Teste 5: Login de Usuário Pendente (deve falhar)

### Passos:
1. Faça logout (se necessário)
2. Clique em "Login"
3. Digite email: `maria.silva@example.com`
4. Digite senha: `senha456`
5. Clique em "Entrar"

### Resultado Esperado:
- ❌ Erro: "Account is pending. Please wait for admin approval."
- ❌ Login bloqueado
- ✅ Mensagem clara explicando que precisa de aprovação

---

## 📋 Fluxo de Teste 6: Login de Usuário Aprovado

### Pré-requisitos:
- Ter aprovado um usuário (ex: Edineuzasm)

### Passos:
1. Faça logout (se necessário)
2. Clique em "Login"
3. Digite email: `edineuzasm@hotmail.com`
4. Digite senha: `senha123`
5. Clique em "Entrar"

### Resultado Esperado:
- ✅ Login bem-sucedido
- ✅ Redirecionado para home do app
- ✅ Pode usar o app normalmente

---

## 📋 Fluxo de Teste 7: Registrar Novo Usuário

### Passos:
1. Na tela de login, clique em "Registrar-se" ou "Criar conta"
2. Preencha:
   - Nome: "Teste User"
   - Email: "teste@example.com"
   - Senha: "senha123"
   - Confirmar Senha: "senha123"
3. Clique em "Registrar"

### Resultado Esperado:
- ✅ Mensagem: "Registration successful! Please wait for administrator approval."
- ✅ Redirecionado para login
- ✅ Novo usuário aparece como "Pendente" no painel admin

---

## 📋 Fluxo de Teste 8: Auto-Refresh do Painel Admin

### Pré-requisitos:
- Estar no painel Admin em um navegador/aba

### Passos:
1. Abra a PWA em dois navegadores/abas:
   - Aba 1: Logado como admin
   - Aba 2: Logado como usuário comum
2. Na Aba 1, veja a lista de pendentes
3. Na Aba 2, registre um novo usuário
4. Volte para Aba 1 e clique na aba "Admin"

### Resultado Esperado:
- ✅ A lista é atualizada automaticamente
- ✅ O novo usuário aparece na lista de pendentes
- ✅ Não precisa recarregar a página manualmente

---

## 📋 Fluxo de Teste 9: Logout

### Passos:
1. Estando logado, procure pelo botão/menu de logout
2. Clique em "Sair" ou "Logout"

### Resultado Esperado:
- ✅ Sessão encerrada
- ✅ Redirecionado para tela de login
- ✅ Dados locais limpos (token e usuário)

---

## 🔍 Verificações Técnicas

### Abrir Console do Navegador (F12)

#### Verificar Token JWT:
```javascript
// No console, execute:
localStorage.getItem('auth_token')
```
Deve retornar um token JWT válido (formato: `xxx.yyy.zzz`)

#### Verificar Dados do Usuário:
```javascript
// No console, execute:
JSON.parse(localStorage.getItem('auth_user'))
```
Deve retornar:
```json
{
  "id": "...",
  "name": "...",
  "email": "..."
}
```

#### Verificar Requisições tRPC:
1. Abra a aba "Network" do DevTools
2. Faça login
3. Procure por requisições para `/trpc/pwaAuthTrpc.login`
4. Verifique se a resposta contém o token JWT

---

## 📊 Checklist de Testes

- [ ] Login como admin funciona
- [ ] Painel admin mostra usuários pendentes
- [ ] Botão "Aprovar" funciona
- [ ] Botão "Rejeitar" funciona
- [ ] Usuário pendente não consegue fazer login
- [ ] Usuário aprovado consegue fazer login
- [ ] Novo registro aparece como pendente
- [ ] Auto-refresh do painel funciona
- [ ] Logout funciona
- [ ] Token JWT é gerado corretamente
- [ ] Dados do usuário são salvos no localStorage

---

## 🐛 Troubleshooting

### Problema: "Usuários pendentes não aparecem no painel"
**Solução:**
1. Recarregue a página (F5)
2. Clique na aba Admin novamente
3. Verifique no console se há erros
4. Verifique se o arquivo `users.json` existe

### Problema: "Login falha com erro genérico"
**Solução:**
1. Verifique as credenciais (email e senha)
2. Verifique se o usuário tem status "active"
3. Abra o console e procure por mensagens de erro
4. Verifique se o servidor está rodando

### Problema: "Token expirado após logout"
**Solução:**
1. Limpe o localStorage: `localStorage.clear()`
2. Recarregue a página
3. Faça login novamente

---

## 📝 Notas

- Os usuários de teste são adicionados via script: `node scripts/add-test-users.mjs`
- O arquivo `users.json` contém todos os usuários (deve estar em `.gitignore`)
- Os tokens JWT expiram em 7 dias
- As senhas são armazenadas com hash bcrypt (10 rounds)

---

## 🔗 Referências

- [PWA_AUTHENTICATION_GUIDE.md](./PWA_AUTHENTICATION_GUIDE.md) - Documentação técnica
- [PWA_TRPC_REFERENCE.md](./PWA_TRPC_REFERENCE.md) - Referência de APIs tRPC
- [PWA_QUICK_REFERENCE.md](./PWA_QUICK_REFERENCE.md) - Cartão de referência rápida
