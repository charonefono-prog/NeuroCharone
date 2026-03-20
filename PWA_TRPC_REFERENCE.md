# PWA Authentication tRPC Reference

Esta documentação descreve as procedures tRPC para autenticação PWA (Progressive Web App) do aplicativo NeuroLaserMap.

## Visão Geral

O sistema de autenticação PWA foi migrado de HTTP endpoints para **tRPC procedures** para melhor type-safety, validação automática e integração com o cliente React.

### Localização do Código

- **Router tRPC**: `/server/routers/pwa-auth-trpc.ts`
- **Integração**: `/server/routers.ts` (namespace: `pwaAuthTrpc`)
- **Cliente**: `lib/trpc.ts` (auto-gerado)
- **Context**: `lib/auth-context.tsx` (usa tRPC mutations)
- **Admin Tab**: `app/(tabs)/admin.tsx` (usa tRPC queries/mutations)

## Procedures Disponíveis

### 1. `register` (Mutation)

Registra um novo usuário PWA com status "pending".

**Input:**
```typescript
{
  name: string;      // Nome do usuário (mín. 2 caracteres)
  email: string;     // Email válido
  password: string;  // Senha (mín. 6 caracteres)
}
```

**Output:**
```typescript
{
  success: boolean;
  message: string;
}
```

**Exemplo de Uso (React):**
```typescript
import { trpc } from '@/lib/trpc';

const registerMutation = trpc.pwaAuthTrpc.register.useMutation();

const handleRegister = async () => {
  try {
    const result = await registerMutation.mutateAsync({
      name: "João Silva",
      email: "joao@example.com",
      password: "senha123"
    });
    console.log(result.message); // "User registered successfully..."
  } catch (error) {
    console.error(error.message); // "Email already registered"
  }
};
```

**Comportamento:**
- Cria novo usuário com status `pending`
- Hash da senha com bcrypt (10 rounds)
- Persiste em `users.json`
- Rejeita email duplicado

---

### 2. `login` (Mutation)

Faz login de um usuário PWA com status "active".

**Input:**
```typescript
{
  email: string;
  password: string;
}
```

**Output:**
```typescript
{
  success: boolean;
  token: string;        // JWT token (válido por 7 dias)
  user: {
    id: string;
    name: string;
    email: string;
  };
}
```

**Exemplo de Uso (React):**
```typescript
const loginMutation = trpc.pwaAuthTrpc.login.useMutation();

const handleLogin = async () => {
  try {
    const result = await loginMutation.mutateAsync({
      email: "joao@example.com",
      password: "senha123"
    });
    
    // Salvar token e dados do usuário
    localStorage.setItem('auth_token', result.token);
    localStorage.setItem('auth_user', JSON.stringify(result.user));
  } catch (error) {
    if (error.message.includes("pending")) {
      console.log("Aguardando aprovação do admin");
    } else {
      console.log("Credenciais inválidas");
    }
  }
};
```

**Comportamento:**
- Valida credenciais com bcrypt
- Rejeita se status não for "active"
- Gera JWT token com expiração de 7 dias
- Retorna dados do usuário

---

### 3. `logout` (Mutation)

Confirma logout do usuário.

**Input:** Nenhum

**Output:**
```typescript
{
  success: boolean;
  message: string;
}
```

**Exemplo de Uso (React):**
```typescript
const logoutMutation = trpc.pwaAuthTrpc.logout.useMutation();

const handleLogout = async () => {
  await logoutMutation.mutateAsync();
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  // Redirecionar para login
};
```

---

### 4. `getPendingUsers` (Query)

Lista todos os usuários com status "pending" (apenas para admin).

**Input:** Nenhum

**Output:**
```typescript
Array<{
  id: string;
  name: string;
  email: string;
  status: "pending";
  createdAt: string;  // ISO timestamp
  approvedAt: null;
}>
```

**Exemplo de Uso (React):**
```typescript
const pendingUsersQuery = trpc.pwaAuthTrpc.getPendingUsers.useQuery();

// Dados carregam automaticamente
if (pendingUsersQuery.isLoading) return <div>Carregando...</div>;

// Refetch manual
const handleRefresh = () => {
  pendingUsersQuery.refetch();
};

// Usar dados
pendingUsersQuery.data?.forEach(user => {
  console.log(`${user.name} (${user.email}) - Pendente desde ${user.createdAt}`);
});
```

---

### 5. `approveUser` (Mutation)

Aprova um usuário PWA pendente (admin only).

**Input:**
```typescript
{
  email: string;
}
```

**Output:**
```typescript
{
  success: boolean;
  message: string;
}
```

**Exemplo de Uso (React):**
```typescript
const approveMutation = trpc.pwaAuthTrpc.approveUser.useMutation();

const handleApprove = async (email: string) => {
  try {
    const result = await approveMutation.mutateAsync({ email });
    console.log(result.message); // "User user@example.com approved"
    
    // Refetch pending users
    await pendingUsersQuery.refetch();
  } catch (error) {
    console.error(error.message);
  }
};
```

**Comportamento:**
- Muda status de "pending" para "active"
- Define `approvedAt` com timestamp atual
- Persiste em `users.json`

---

### 6. `rejectUser` (Mutation)

Rejeita um usuário PWA pendente (admin only).

**Input:**
```typescript
{
  email: string;
}
```

**Output:**
```typescript
{
  success: boolean;
  message: string;
}
```

**Exemplo de Uso (React):**
```typescript
const rejectMutation = trpc.pwaAuthTrpc.rejectUser.useMutation();

const handleReject = async (email: string) => {
  try {
    const result = await rejectMutation.mutateAsync({ email });
    console.log(result.message); // "User user@example.com rejected"
    
    // Refetch pending users
    await pendingUsersQuery.refetch();
  } catch (error) {
    console.error(error.message);
  }
};
```

**Comportamento:**
- Muda status de "pending" para "rejected"
- Persiste em `users.json`

---

### 7. `verifyToken` (Query)

Verifica se um JWT token é válido.

**Input:**
```typescript
{
  token: string;
}
```

**Output:**
```typescript
{
  valid: boolean;
  user?: {
    email: string;
    name: string;
    id: string;
    iat: number;  // Issued at
    exp: number;  // Expiration
  };
  error?: string;
}
```

**Exemplo de Uso (React):**
```typescript
const verifyQuery = trpc.pwaAuthTrpc.verifyToken.useQuery({
  token: localStorage.getItem('auth_token') || ''
});

if (verifyQuery.data?.valid) {
  console.log("Token válido, usuário:", verifyQuery.data.user);
} else {
  console.log("Token inválido:", verifyQuery.data?.error);
}
```

---

## Integração com Auth Context

O `AuthProvider` em `lib/auth-context.tsx` usa tRPC mutations:

```typescript
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const loginMutation = trpc.pwaAuthTrpc.login.useMutation();
  const registerMutation = trpc.pwaAuthTrpc.register.useMutation();
  const logoutMutation = trpc.pwaAuthTrpc.logout.useMutation();

  const login = async (email: string, password: string) => {
    const result = await loginMutation.mutateAsync({ email, password });
    // ... salvar token e usuário
  };

  const register = async (email: string, name: string, password: string) => {
    const result = await registerMutation.mutateAsync({ email, name, password });
    // ... mostrar mensagem de sucesso
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
    // ... limpar dados locais
  };

  // ...
}
```

---

## Integração com Admin Tab

O painel de admin em `app/(tabs)/admin.tsx` usa tRPC queries/mutations:

```typescript
export default function AdminScreen() {
  const pendingUsersQuery = trpc.pwaAuthTrpc.getPendingUsers.useQuery();
  const approveMutation = trpc.pwaAuthTrpc.approveUser.useMutation();
  const rejectMutation = trpc.pwaAuthTrpc.rejectUser.useMutation();

  useFocusEffect(
    React.useCallback(() => {
      // Refetch quando aba é focada
      pendingUsersQuery.refetch();
    }, [pendingUsersQuery])
  );

  const approvePWAUser = async (email: string) => {
    await approveMutation.mutateAsync({ email });
    await pendingUsersQuery.refetch();
  };

  // ...
}
```

---

## Fluxo de Autenticação PWA

### Registro

1. Usuário preenche formulário (nome, email, senha)
2. Cliente chama `register` mutation
3. Servidor cria usuário com status `pending`
4. Usuário recebe mensagem: "Aguardando aprovação do admin"
5. Admin vê usuário na lista de pendentes

### Aprovação

1. Admin vê usuário pendente no painel
2. Admin clica "Aprovar"
3. Cliente chama `approveUser` mutation
4. Servidor muda status para `active`
5. Usuário pode fazer login

### Login

1. Usuário preenche email e senha
2. Cliente chama `login` mutation
3. Servidor valida credenciais e status
4. Se status for `active`, retorna JWT token
5. Cliente salva token e dados do usuário
6. Usuário é redirecionado para app

### Logout

1. Usuário clica "Sair"
2. Cliente chama `logout` mutation
3. Cliente limpa token e dados locais
4. Usuário é redirecionado para login

---

## Tratamento de Erros

Todos os erros tRPC são capturados e podem ser tratados:

```typescript
try {
  const result = await mutation.mutateAsync(input);
} catch (error) {
  if (error.data?.code === 'BAD_REQUEST') {
    console.log("Validação falhou:", error.message);
  } else if (error.data?.code === 'UNAUTHORIZED') {
    console.log("Não autorizado");
  } else {
    console.log("Erro desconhecido:", error.message);
  }
}
```

---

## Testes

Todos os procedures tRPC têm testes unitários em `__tests__/pwa-auth-trpc.test.ts`:

```bash
npm test -- __tests__/pwa-auth-trpc.test.ts
```

**Cobertura:**
- ✓ Registro com status pending
- ✓ Rejeição de email duplicado
- ✓ Login com credenciais válidas
- ✓ Rejeição de login para pendente
- ✓ Rejeição de senha inválida
- ✓ Listagem de usuários pendentes
- ✓ Aprovação de usuário
- ✓ Rejeição de usuário
- ✓ Verificação de token válido
- ✓ Rejeição de token inválido
- ✓ Rejeição de token expirado

---

## Segurança

### Senhas
- Hash com bcrypt (10 rounds)
- Nunca armazenadas em plain text
- Comparação segura com bcrypt.compare()

### Tokens JWT
- Assinados com `JWT_SECRET` (env var)
- Expiração: 7 dias
- Verificação de assinatura obrigatória

### Persistência
- Arquivo `users.json` (deve estar em `.gitignore`)
- Sincronização automática em cada operação
- Backup recomendado

---

## Próximos Passos

- [ ] Remover HTTP endpoints `/api/pwaAuth.*` (manter apenas tRPC)
- [ ] Implementar 2FA (two-factor authentication)
- [ ] Adicionar notificações por email
- [ ] Implementar recuperação de senha
- [ ] Adicionar rate limiting
- [ ] Implementar audit log

---

## Referências

- [tRPC Documentation](https://trpc.io/)
- [JWT.io](https://jwt.io/)
- [bcrypt.js](https://github.com/dcodeIO/bcrypt.js)
- [PWA_AUTHENTICATION_GUIDE.md](./PWA_AUTHENTICATION_GUIDE.md)
