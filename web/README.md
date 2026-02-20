# NeuroLaserMap - Versão Web

Sistema web de gerenciamento de pacientes e escalas clínicas com autenticação e painel de admin.

## 🚀 Início Rápido

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em: `http://localhost:3001`

### Build para Produção

```bash
npm run build
npm start
```

## 🔐 Credenciais de Teste

### Admin
- **Email:** `charonejr@gmail.com`
- **Senha:** `442266`

### Usuários de Teste
- **Email:** `teste1@email.com` | **Senha:** `senha123`
- **Email:** `teste2@email.com` | **Senha:** `senha123`

## 📁 Estrutura do Projeto

```
web/
├── src/
│   ├── pages/
│   │   ├── index.tsx           # Página inicial (redirecionamento)
│   │   ├── login.tsx           # Página de login
│   │   ├── register.tsx        # Página de registro
│   │   ├── dashboard.tsx       # Dashboard do usuário
│   │   ├── admin.tsx           # Painel de admin
│   │   └── api/
│   │       └── auth/
│   │           ├── login.ts    # API de login
│   │           └── register.ts # API de registro
│   ├── lib/
│   │   └── auth.ts             # Funções de autenticação
│   └── styles/
│       └── globals.css         # Estilos globais
├── next.config.js              # Configuração do Next.js
├── tsconfig.json               # Configuração do TypeScript
├── package.json                # Dependências
└── .env.local                  # Variáveis de ambiente
```

## 🔄 Fluxo de Autenticação

1. **Login:** Usuário entra com email e senha
2. **Token JWT:** Sistema gera token válido por 24 horas
3. **Armazenamento:** Token e dados do usuário são salvos no localStorage
4. **Redirecionamento:** Admin → `/admin`, Usuário → `/dashboard`
5. **Logout:** Remove token e redireciona para login

## 👥 Funcionalidades

### Para Usuários
- ✅ Login com email e senha
- ✅ Registro de nova conta
- ✅ Dashboard pessoal
- ✅ Gerenciamento de pacientes
- ✅ Preenchimento de escalas
- ✅ Logout

### Para Admin
- ✅ Login com credenciais especiais
- ✅ Painel de administração
- ✅ Gerenciamento de usuários
- ✅ Criar/editar/deletar usuários
- ✅ Resetar senhas
- ✅ Ver estatísticas
- ✅ Logout

## 🔧 Configuração de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
JWT_SECRET=charone_neurolasermap_secret_2026
DATABASE_URL=postgresql://user:password@localhost:5432/neurolasermap
```

## 📦 Dependências Principais

- **Next.js 16:** Framework React
- **React 19:** Biblioteca UI
- **TypeScript:** Tipagem estática
- **JWT:** Autenticação com tokens
- **bcryptjs:** Hash de senhas
- **Axios:** Cliente HTTP

## 🚀 Deploy

### Vercel (Recomendado)

```bash
vercel deploy
```

### Docker

```bash
docker build -t neurolasermap-web .
docker run -p 3001:3001 neurolasermap-web
```

## 📝 Notas

- A versão web é **independente** do app mobile
- Cada usuário tem seus próprios dados isolados
- Não há sincronização entre web e mobile
- O banco de dados é compartilhado (quando integrado)

## 🐛 Troubleshooting

### Erro: "NextRouter was not mounted"
- Certifique-se de que está usando `useRouter` apenas em componentes do lado do cliente
- Use `useEffect` com verificação de `isClient`

### Erro: "Cannot find module"
- Execute `npm install` novamente
- Limpe o cache: `rm -rf .next node_modules`
- Reinstale: `npm install`

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com o desenvolvedor.
