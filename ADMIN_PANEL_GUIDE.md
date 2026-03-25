# Guia do Painel de Administração - NeuroLaserMap

**Objetivo:** Gerenciar quem tem acesso ao aplicativo

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Acessar Painel](#acessar-painel)
3. [Gerenciar Usuários](#gerenciar-usuários)
4. [Aprovar/Rejeitar Acesso](#aprovarrejeitar-acesso)
5. [Visualizar Logs](#visualizar-logs)
6. [Comandos SQL](#comandos-sql)

---

## 🎯 Visão Geral

O painel de administração permite que você:

- ✅ Visualizar todos os usuários
- ✅ Aprovar novos usuários
- ✅ Rejeitar usuários
- ✅ Remover usuários
- ✅ Ver histórico de acessos
- ✅ Gerenciar capacetes

---

## 🔐 Acessar Painel

### Pré-requisitos

- Você deve ser **admin** no sistema
- Ter acesso ao banco de dados

### Via Aplicativo

1. Faça login no app
2. Vá para "Configurações"
3. Clique em "Painel de Administração"
4. Digite sua senha de admin

### Via Banco de Dados

```bash
# Conectar ao MySQL
mysql -u root -p neuromodulation_mapper

# Você verá o prompt
mysql>
```

---

## 👥 Gerenciar Usuários

### Visualizar Todos os Usuários

```sql
-- Ver todos os usuários na whitelist
SELECT * FROM access_control;

-- Ver informações específicas
SELECT email, name, isApproved, accessLevel, createdAt FROM access_control;

-- Ver usuários aprovados
SELECT * FROM access_control WHERE isApproved = true;

-- Ver usuários pendentes
SELECT * FROM access_control WHERE isApproved = false AND denialReason IS NULL;

-- Ver usuários rejeitados
SELECT * FROM access_control WHERE denialReason IS NOT NULL;
```

### Adicionar Novo Usuário

```sql
-- Adicionar usuário (não aprovado por padrão)
INSERT INTO access_control (email, name, isApproved, accessLevel, createdAt, updatedAt)
VALUES (
  'usuario@example.com',
  'Dr. João Silva',
  false,
  'user',
  NOW(),
  NOW()
);

-- Com informações do capacete
INSERT INTO access_control (email, name, helmetSerialNumber, helmetModel, isApproved, accessLevel, createdAt, updatedAt)
VALUES (
  'usuario@example.com',
  'Dr. João Silva',
  'HELMET-001',
  'NeuroLaserMap v1.0',
  false,
  'user',
  NOW(),
  NOW()
);
```

### Atualizar Informações do Usuário

```sql
-- Atualizar nome
UPDATE access_control SET name = 'Dr. João Silva' WHERE email = 'usuario@example.com';

-- Atualizar número de série do capacete
UPDATE access_control SET helmetSerialNumber = 'HELMET-001' WHERE email = 'usuario@example.com';

-- Adicionar notas
UPDATE access_control SET notes = 'Usuário de teste' WHERE email = 'usuario@example.com';
```

---

## ✅ Aprovar/Rejeitar Acesso

### Aprovar Usuário

```sql
-- Aprovar usuário
UPDATE access_control 
SET 
  isApproved = true,
  approvedAt = NOW(),
  approvedBy = 'seu-email@example.com',
  accessLevel = 'user'
WHERE email = 'usuario@example.com';

-- Aprovar como profissional
UPDATE access_control 
SET 
  isApproved = true,
  approvedAt = NOW(),
  approvedBy = 'seu-email@example.com',
  accessLevel = 'professional'
WHERE email = 'usuario@example.com';

-- Aprovar como admin
UPDATE access_control 
SET 
  isApproved = true,
  approvedAt = NOW(),
  approvedBy = 'seu-email@example.com',
  accessLevel = 'admin'
WHERE email = 'usuario@example.com';
```

### Rejeitar Usuário

```sql
-- Rejeitar com motivo
UPDATE access_control 
SET 
  isApproved = false,
  denialReason = 'Documentação incompleta',
  approvedBy = 'seu-email@example.com'
WHERE email = 'usuario@example.com';

-- Rejeitar por falta de pagamento
UPDATE access_control 
SET 
  isApproved = false,
  denialReason = 'Pagamento não confirmado',
  approvedBy = 'seu-email@example.com'
WHERE email = 'usuario@example.com';
```

### Remover Usuário

```sql
-- Soft delete (desaprovar)
UPDATE access_control 
SET 
  isApproved = false,
  denialReason = 'Removido pelo admin'
WHERE email = 'usuario@example.com';

-- Hard delete (remover completamente - cuidado!)
DELETE FROM access_control WHERE email = 'usuario@example.com';
```

### Definir Data de Expiração

```sql
-- Acesso expira em 30 dias
UPDATE access_control 
SET expiresAt = DATE_ADD(NOW(), INTERVAL 30 DAY)
WHERE email = 'usuario@example.com';

-- Acesso expira em data específica
UPDATE access_control 
SET expiresAt = '2026-12-31 23:59:59'
WHERE email = 'usuario@example.com';
```

---

## 📊 Visualizar Logs

### Ver Todas as Tentativas de Acesso

```sql
-- Ver todos os logs
SELECT * FROM access_log ORDER BY attemptedAt DESC;

-- Ver últimas 10 tentativas
SELECT * FROM access_log ORDER BY attemptedAt DESC LIMIT 10;

-- Ver tentativas de um usuário
SELECT * FROM access_log 
WHERE email = 'usuario@example.com' 
ORDER BY attemptedAt DESC;

-- Ver tentativas aprovadas
SELECT * FROM access_log 
WHERE status = 'approved' 
ORDER BY attemptedAt DESC;

-- Ver tentativas negadas
SELECT * FROM access_log 
WHERE status = 'denied' 
ORDER BY attemptedAt DESC;
```

### Estatísticas de Acesso

```sql
-- Total de tentativas
SELECT COUNT(*) as total_attempts FROM access_log;

-- Tentativas por status
SELECT status, COUNT(*) as count FROM access_log GROUP BY status;

-- Tentativas por usuário
SELECT email, COUNT(*) as count FROM access_log GROUP BY email ORDER BY count DESC;

-- Tentativas hoje
SELECT COUNT(*) as today_attempts FROM access_log 
WHERE DATE(attemptedAt) = CURDATE();

-- Tentativas esta semana
SELECT COUNT(*) as week_attempts FROM access_log 
WHERE WEEK(attemptedAt) = WEEK(NOW());
```

---

## 📈 Relatórios

### Relatório de Usuários

```sql
-- Relatório completo
SELECT 
  email,
  name,
  isApproved,
  accessLevel,
  helmetSerialNumber,
  createdAt,
  approvedAt,
  expiresAt,
  notes
FROM access_control
ORDER BY createdAt DESC;

-- Relatório de usuários ativos
SELECT 
  email,
  name,
  accessLevel,
  approvedAt,
  expiresAt
FROM access_control
WHERE isApproved = true
AND (expiresAt IS NULL OR expiresAt > NOW())
ORDER BY approvedAt DESC;

-- Relatório de usuários expirados
SELECT 
  email,
  name,
  expiresAt
FROM access_control
WHERE expiresAt < NOW()
ORDER BY expiresAt DESC;
```

### Relatório de Acessos

```sql
-- Acessos por dia
SELECT 
  DATE(attemptedAt) as date,
  COUNT(*) as total,
  SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
  SUM(CASE WHEN status = 'denied' THEN 1 ELSE 0 END) as denied
FROM access_log
GROUP BY DATE(attemptedAt)
ORDER BY date DESC;

-- Usuários mais ativos
SELECT 
  email,
  COUNT(*) as access_count,
  MAX(attemptedAt) as last_access
FROM access_log
WHERE status = 'approved'
GROUP BY email
ORDER BY access_count DESC
LIMIT 10;
```

---

## 🔍 Troubleshooting

### Usuário não consegue fazer login

```sql
-- Verificar se está na whitelist
SELECT * FROM access_control WHERE email = 'usuario@example.com';

-- Verificar se está aprovado
SELECT isApproved FROM access_control WHERE email = 'usuario@example.com';

-- Verificar se expirou
SELECT expiresAt FROM access_control WHERE email = 'usuario@example.com';

-- Ver último log
SELECT * FROM access_log 
WHERE email = 'usuario@example.com' 
ORDER BY attemptedAt DESC 
LIMIT 1;
```

### Usuário foi removido acidentalmente

```sql
-- Recuperar (reativar)
UPDATE access_control 
SET 
  isApproved = true,
  denialReason = NULL,
  approvedAt = NOW()
WHERE email = 'usuario@example.com';
```

### Limpar logs antigos

```sql
-- Deletar logs com mais de 90 dias
DELETE FROM access_log 
WHERE attemptedAt < DATE_SUB(NOW(), INTERVAL 90 DAY);

-- Deletar logs com mais de 1 ano
DELETE FROM access_log 
WHERE attemptedAt < DATE_SUB(NOW(), INTERVAL 1 YEAR);
```

---

## 🎯 Fluxo de Aprovação Recomendado

### 1. Cliente Compra Capacete

```sql
-- Você adiciona o email do cliente
INSERT INTO access_control (email, name, helmetSerialNumber, isApproved, createdAt, updatedAt)
VALUES ('cliente@example.com', 'Cliente Nome', 'HELMET-001', false, NOW(), NOW());
```

### 2. Cliente Tenta Fazer Login

- Sistema verifica se está na whitelist
- Se não aprovado, mostra mensagem: "Acesso pendente de aprovação"

### 3. Você Aprova

```sql
-- Aprovar cliente
UPDATE access_control 
SET isApproved = true, approvedAt = NOW(), approvedBy = 'seu-email@example.com'
WHERE email = 'cliente@example.com';
```

### 4. Cliente Faz Login

- Sistema verifica whitelist
- Acesso liberado!

---

## 📞 Suporte

Para dúvidas sobre SQL:
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [W3Schools SQL Tutorial](https://www.w3schools.com/sql/)

---

**Última atualização:** 14 de Fevereiro de 2026
