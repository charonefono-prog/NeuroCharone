# PWA - Sistema de Gerenciamento de Acesso

## Estrutura Básica
- [ ] Criar pasta `/pwa` separada do app mobile
- [ ] Criar index.html com estrutura básica
- [ ] Criar CSS para estilo responsivo
- [ ] Criar JavaScript para lógica

## Autenticação
- [ ] Página de Login
- [ ] Página de Registro
- [ ] Sistema de JWT com localStorage
- [ ] Validação de senha
- [ ] Logout

## Painel Admin
- [ ] Listar usuários pendentes
- [ ] Botão Aprovar usuário
- [ ] Botão Bloquear/Rejeitar usuário
- [ ] Listar usuários aprovados
- [ ] Listar usuários bloqueados

## Banco de Dados
- [ ] Criar tabela de usuários (se não existir)
- [ ] Armazenar status (pending, approved, blocked)
- [ ] Armazenar email, senha (hash), data de criação

## Testes
- [ ] Testar registro de novo usuário
- [ ] Testar login com usuário pendente (deve falhar)
- [ ] Testar aprovação de usuário
- [ ] Testar login com usuário aprovado (deve funcionar)
- [ ] Testar bloqueio de usuário
