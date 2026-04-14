# 🧠 NeuroLaserMap - Guia Completo Passo a Passo

## Para: Carlos Charone (Proprietário)

---

# 📋 ÍNDICE

1. [Entender a Arquitetura](#entender-a-arquitetura)
2. [Vender o Capacete](#vender-o-capacete)
3. [Adicionar Cliente na Whitelist](#adicionar-cliente-na-whitelist)
4. [Gerar QR Code](#gerar-qr-code)
5. [Cliente Instala e Usa](#cliente-instala-e-usa)
6. [Gerenciar Clientes](#gerenciar-clientes)
7. [Troubleshooting](#troubleshooting)

---

# 1️⃣ ENTENDER A ARQUITETURA

## O que é NeuroLaserMap?

**NeuroLaserMap** é um app de mapeamento cerebral com fotobiomodulação transcraniana.

### Componentes:

| Componente | O que é | Onde fica |
|-----------|---------|----------|
| **App React Native** | O aplicativo que seus clientes usam | Expo Go (celular) |
| **Banco de Dados** | Armazena pacientes, sessões, dados | Servidor Manus |
| **Servidor** | Gerencia login, dados, segurança | Manus Cloud |
| **Whitelist** | Lista de emails aprovados | Banco de Dados |

---

## Como Funciona:

```
┌─────────────────────────────────────┐
│  SEU CLIENTE                        │
│  - Instala Expo Go                  │
│  - Escaneia QR Code                 │
│  - Faz Login                        │
└──────────────┬──────────────────────┘
               │ (autenticação)
┌──────────────▼──────────────────────┐
│  SERVIDOR MANUS                     │
│  - Verifica se email está na        │
│    whitelist                        │
│  - Se SIM → Libera acesso           │
│  - Se NÃO → Bloqueia                │
└──────────────┬──────────────────────┘
               │ (dados isolados)
┌──────────────▼──────────────────────┐
│  BANCO DE DADOS                     │
│  - Salva pacientes do cliente       │
│  - Salva sessões                    │
│  - Salva planos terapêuticos        │
└─────────────────────────────────────┘
```

---

# 2️⃣ VENDER O CAPACETE

## Passo 1: Cliente Compra

1. Você vende o **capacete físico**
2. Cliente paga
3. Você recebe o **email do cliente**

---

## Passo 2: Você Recebe o Email

**Exemplo:**
```
Cliente: João Silva
Email: joao.silva@example.com
```

---

# 3️⃣ ADICIONAR CLIENTE NA WHITELIST

## Como Adicionar na Whitelist:

### **Opção 1: Via Painel de Banco de Dados (Mais Fácil)**

1. **Acesse o painel de banco:**
   - Clique no botão "Database" (Management UI)
   - Você verá a interface do banco

2. **Procure pela tabela `access_control`**

3. **Clique em "Insert"** (ou "Adicionar novo registro")

4. **Preencha os campos:**
   - `email`: joao.silva@example.com
   - `name`: João Silva
   - `isApproved`: true (✅ marcado)
   - `accessLevel`: user

5. **Clique em "Save"** (Salvar)

---

### **Opção 2: Via SQL (Mais Rápido)**

1. **Abra o painel de banco**
2. **Clique em "Execute SQL"** (ou "Query")
3. **Cole este comando:**

```sql
INSERT INTO access_control (email, name, isApproved, accessLevel, createdAt, updatedAt)
VALUES (
  'joao.silva@example.com',
  'João Silva',
  true,
  'user',
  NOW(),
  NOW()
);
```

4. **Clique em "Execute"** (Executar)
5. **Você verá:** "✅ 1 row inserted"

---

## Verificar se Foi Adicionado:

```sql
SELECT email, name, isApproved FROM access_control WHERE email = 'joao.silva@example.com';
```

**Resultado esperado:**
```
email                  | name         | isApproved
joao.silva@example.com | João Silva   | true
```

---

# 4️⃣ GERAR QR CODE

## Como Funciona:

O QR Code é um código que o cliente escaneia com o celular para abrir o app no Expo Go.

---

## Passo 1: Acesse o App

1. **Abra:** https://8081-ikam3zx9nucybs2xd49lv-0e325296.us1.manus.computer
2. **Faça login com suas credenciais**
3. **Procure pelo botão "Gerar QR Code"** (ou "QR")

---

## Passo 2: Compartilhe o QR Code

1. **Tire uma screenshot** do QR Code
2. **Envie para o cliente por:**
   - WhatsApp
   - Email
   - Telegram
   - Outro app

---

## Passo 3: Cliente Escaneia

1. **Cliente abre Expo Go**
2. **Clica em "Scan QR Code"**
3. **Aponta para o QR Code**
4. **O app abre automaticamente**

---

# 5️⃣ CLIENTE INSTALA E USA

## Passo 1: Cliente Instala Expo Go

### **iPhone:**
1. Abre App Store
2. Procura "Expo Go"
3. Clica "Instalar"
4. Aguarda instalação

### **Android:**
1. Abre Google Play
2. Procura "Expo Go"
3. Clica "Instalar"
4. Aguarda instalação

---

## Passo 2: Cliente Escaneia QR Code

1. Abre Expo Go
2. Clica em "Scan QR Code" (câmera)
3. Aponta para o QR Code que você enviou
4. Aguarda carregar

---

## Passo 3: Cliente Faz Login

1. **Email:** joao.silva@example.com
2. **Senha:** (a senha que o cliente criou)
3. **Clica em "Entrar"**

---

## Passo 4: Cliente Usa o App

Agora o cliente vê:
- ✅ Dashboard (estatísticas)
- ✅ Lista de pacientes
- ✅ Adicionar novo paciente
- ✅ Plano terapêutico
- ✅ Sessões
- ✅ Relatórios

---

# 6️⃣ GERENCIAR CLIENTES

## Ver Todos os Clientes:

```sql
SELECT email, name, isApproved, createdAt FROM access_control ORDER BY createdAt DESC;
```

---

## Bloquear um Cliente:

Se o cliente não pagou ou você quer bloquear:

```sql
UPDATE access_control 
SET isApproved = false
WHERE email = 'joao.silva@example.com';
```

**Resultado:** Cliente tenta fazer login → Bloqueado ❌

---

## Desbloquear um Cliente:

```sql
UPDATE access_control 
SET isApproved = true
WHERE email = 'joao.silva@example.com';
```

**Resultado:** Cliente consegue fazer login novamente ✅

---

## Remover um Cliente:

```sql
DELETE FROM access_control 
WHERE email = 'joao.silva@example.com';
```

---

## Ver Pacientes de um Cliente:

```sql
SELECT p.* FROM patients p
INNER JOIN users u ON p.userId = u.id
WHERE u.email = 'joao.silva@example.com';
```

---

# 7️⃣ TROUBLESHOOTING

## Problema: Cliente Não Consegue Fazer Login

### **Verificar:**

1. **Email está na whitelist?**
   ```sql
   SELECT * FROM access_control WHERE email = 'joao.silva@example.com';
   ```

2. **Email está aprovado?**
   ```sql
   SELECT isApproved FROM access_control WHERE email = 'joao.silva@example.com';
   ```

3. **Se não está aprovado:**
   ```sql
   UPDATE access_control 
   SET isApproved = true
   WHERE email = 'joao.silva@example.com';
   ```

---

## Problema: Cliente Perdeu os Dados

### **Verificar:**

1. **Dados estão no banco?**
   ```sql
   SELECT * FROM patients WHERE userId = (SELECT id FROM users WHERE email = 'joao.silva@example.com');
   ```

2. **Se os dados estão lá, o cliente precisa:**
   - Fechar o app completamente
   - Abrir Expo Go de novo
   - Escanear o QR Code
   - Fazer login novamente

---

## Problema: QR Code Não Funciona

### **Solução:**

1. **Gere um QR Code novo**
2. **Tire uma screenshot clara**
3. **Envie para o cliente**
4. **Cliente escaneia de novo**

---

## Problema: App Está Lento

### **Solução:**

1. **Cliente fecha o app completamente**
2. **Cliente aguarda 10 segundos**
3. **Cliente abre Expo Go de novo**
4. **Cliente escaneia o QR Code**

---

# 📞 RESUMO RÁPIDO

## Para Vender:

1. ✅ Cliente compra capacete
2. ✅ Você recebe email
3. ✅ Você adiciona na whitelist (SQL)
4. ✅ Você gera QR Code
5. ✅ Você envia QR Code para cliente
6. ✅ Cliente instala Expo Go
7. ✅ Cliente escaneia QR Code
8. ✅ Cliente faz login
9. ✅ Cliente usa o app

---

## Para Gerenciar:

- **Ver clientes:** `SELECT * FROM access_control;`
- **Bloquear:** `UPDATE ... SET isApproved = false;`
- **Desbloquear:** `UPDATE ... SET isApproved = true;`
- **Remover:** `DELETE FROM access_control;`

---

## URLs Importantes:

| O que | URL |
|------|-----|
| **App** | https://8081-ikam3zx9nucybs2xd49lv-0e325296.us1.manus.computer |
| **Banco de Dados** | Management UI → Database |
| **Domínio (em 24-48h)** | https://neurolasermap.com.br |

---

## Contato:

- 📧 Email: seu-email@example.com
- 💬 WhatsApp: (XX) XXXXX-XXXX

---

**Boa sorte com o NeuroLaserMap!** 🙏

*Desenvolvido por Carlos Charone*
*Data: 14 de Fevereiro de 2026*
