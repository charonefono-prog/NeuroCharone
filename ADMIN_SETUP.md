# 🧠 Guia de Administração - NeuroLaserMap

## Para o Proprietário (Você)

---

## 🎯 Objetivo

Este guia explica como você gerencia seus clientes e controla o acesso ao NeuroLaserMap.

---

## 📱 Acesso ao App

### **URL do App:**
```
https://8081-ikam3zx9nucybs2xd49lv-0e325296.us1.manus.computer
```

**Quando o domínio propagar (24-48h):**
```
https://neurolasermap.com.br
```

---

## 🔑 Gerenciar Usuários

### **Adicionar um Cliente:**

1. **Cliente compra o capacete**
2. **Você recebe o email do cliente**
3. **Execute no banco de dados:**

```sql
INSERT INTO access_control (email, name, isApproved, accessLevel, createdAt, updatedAt)
VALUES (
  'cliente@example.com',
  'Nome do Cliente',
  true,
  'user',
  NOW(),
  NOW()
);
```

4. **Gere um QR Code** (veja abaixo)
5. **Compartilhe com o cliente**

---

### **Bloquear um Cliente:**

```sql
UPDATE access_control 
SET isApproved = false
WHERE email = 'cliente@example.com';
```

---

### **Ver Todos os Clientes:**

```sql
SELECT email, name, isApproved, createdAt FROM access_control;
```

---

## 📱 Gerar QR Code

### **Passo 1: Acesse o app**
```
https://8081-ikam3zx9nucybs2xd49lv-0e325296.us1.manus.computer
```

### **Passo 2: Procure por "Gerar QR Code"**
- Clique no botão de QR Code
- Ele vai gerar um código único

### **Passo 3: Compartilhe**
- Tire uma screenshot
- Envie para o cliente por WhatsApp/Email

---

## 📊 Monitorar Clientes

### **Ver Atividade:**
```sql
SELECT email, createdAt, isApproved FROM access_control ORDER BY createdAt DESC;
```

### **Ver Pacientes de um Cliente:**
```sql
SELECT * FROM patients WHERE userId = (SELECT id FROM users WHERE email = 'cliente@example.com');
```

---

## 🔐 Segurança

- ✅ Cada cliente tem seu próprio login
- ✅ Dados isolados por usuário
- ✅ Senhas criptografadas
- ✅ Backup automático

---

## 💾 Backup de Dados

**Seus dados são salvos automaticamente no banco de dados.**

Para backup manual:
1. Acesse o painel de banco de dados
2. Clique em "Exportar"
3. Salve o arquivo

---

## 📞 Suporte

Se tiver dúvidas:
- 📧 Email: seu-email@example.com
- 💬 WhatsApp: (XX) XXXXX-XXXX

---

## 🚀 Próximos Passos

1. ✅ Adicione seus primeiros clientes
2. ✅ Gere QR Codes
3. ✅ Compartilhe com seus clientes
4. ✅ Comece a vender!

---

**Boa sorte com o NeuroLaserMap!** 🙏

*Desenvolvido por Carlos Charone*
