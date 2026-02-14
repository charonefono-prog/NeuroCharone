# Guia de Domínio - NeuroLaserMap

**Objetivo:** Transformar sua URL temporária em um domínio profissional

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Passo 1: Comprar Domínio](#passo-1-comprar-domínio)
3. [Passo 2: Configurar DNS](#passo-2-configurar-dns)
4. [Passo 3: Testar Domínio](#passo-3-testar-domínio)
5. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

### Antes (URL Temporária)
```
https://8081-ikam3zx9nucybs2xd49lv-0e325296.us1.manus.computer
```

### Depois (Domínio Profissional)
```
https://neurolasermap.com.br
```

**Custo:** R$ 30-50/ano (muito barato!)

---

## 🛒 Passo 1: Comprar Domínio

### Opção 1: Registro.br (Recomendado para Brasil)

**Site:** https://www.registro.br/

**Passos:**

1. Acesse https://www.registro.br/
2. Clique em "Registrar Domínio"
3. Digite o nome desejado (ex: `neurolasermap`)
4. Escolha a extensão (`.com.br`, `.med.br`, `.net.br`, etc)
5. Clique em "Buscar"
6. Se disponível, clique em "Registrar"
7. Preencha seus dados
8. Escolha o período (1 ano = ~R$ 40)
9. Faça o pagamento
10. Confirme o email

**Extensões Recomendadas:**
- `.com.br` - Mais comum
- `.med.br` - Para profissionais de saúde
- `.net.br` - Alternativa

### Opção 2: Namecheap (Internacional)

**Site:** https://www.namecheap.com/

**Passos:**

1. Acesse https://www.namecheap.com/
2. Digite o domínio na barra de busca
3. Escolha a extensão (`.com`, `.app`, `.health`, etc)
4. Clique em "Add to Cart"
5. Preencha seus dados
6. Escolha o período
7. Faça o pagamento
8. Confirme o email

**Extensões Recomendadas:**
- `.com` - Mais profissional
- `.app` - Moderno
- `.health` - Específico para saúde

### Opção 3: GoDaddy

**Site:** https://www.godaddy.com/

Processo similar ao Namecheap.

---

## 🔧 Passo 2: Configurar DNS

Depois de comprar o domínio, você precisa apontar para o servidor da Manus.

### Informações do Servidor Manus

```
Host: seu-dominio.com.br
Tipo: CNAME
Valor: 8081-ikam3zx9nucybs2xd49lv-0e325296.us1.manus.computer
```

### Configurar no Registro.br

1. Acesse https://www.registro.br/ e faça login
2. Vá para "Meus Domínios"
3. Clique no seu domínio
4. Clique em "Editar Zona"
5. Procure por "CNAME"
6. Clique em "Adicionar Registro"
7. Preencha:
   - **Nome:** @ (ou deixe em branco)
   - **Tipo:** CNAME
   - **Valor:** `8081-ikam3zx9nucybs2xd49lv-0e325296.us1.manus.computer`
8. Clique em "Salvar"

### Configurar no Namecheap

1. Acesse https://www.namecheap.com/ e faça login
2. Vá para "Domain List"
3. Clique em "Manage" ao lado do seu domínio
4. Vá para "Advanced DNS"
5. Clique em "Add New Record"
6. Preencha:
   - **Type:** CNAME Record
   - **Host:** @ (ou www)
   - **Value:** `8081-ikam3zx9nucybs2xd49lv-0e325296.us1.manus.computer`
   - **TTL:** 30 min (padrão)
7. Clique em "Save"

### Configurar no GoDaddy

1. Acesse https://www.godaddy.com/ e faça login
2. Vá para "My Products"
3. Clique em "Manage" ao lado do seu domínio
4. Vá para "DNS"
5. Clique em "Add"
6. Preencha:
   - **Type:** CNAME
   - **Name:** @ (ou www)
   - **Value:** `8081-ikam3zx9nucybs2xd49lv-0e325296.us1.manus.computer`
7. Clique em "Save"

---

## ✅ Passo 3: Testar Domínio

### Aguardar Propagação

**Tempo:** 24-48 horas (às vezes mais rápido)

Você pode verificar o status em:
https://www.whatsmydns.net/

### Testar Acesso

Depois que a propagação terminar:

```bash
# 1. Verificar DNS
nslookup seu-dominio.com.br

# 2. Acessar no navegador
https://seu-dominio.com.br
```

### Verificar Certificado SSL

```bash
# Verificar se HTTPS funciona
curl -I https://seu-dominio.com.br
```

---

## 🔐 Configuração de SSL/HTTPS

O SSL é automático na Manus! Você não precisa fazer nada.

Seu domínio terá:
- ✅ HTTPS automático
- ✅ Certificado válido
- ✅ Renovação automática

---

## 📝 Atualizar Configurações

Depois que o domínio estiver funcionando, você pode atualizar:

### 1. Arquivo `app.config.ts`

```typescript
const env = {
  appName: "NeuroLaserMap",
  appSlug: "neurolasermap",
  logoUrl: "",
  scheme: schemeFromBundleId,
  iosBundleId: bundleId,
  androidPackage: bundleId,
  // Adicione seu domínio aqui
  domain: "https://seu-dominio.com.br",
};
```

### 2. Arquivo `index.html`

```javascript
// Atualize as URLs
const OAUTH_URL = 'https://seu-dominio.com.br/api/oauth/authorize';
const CALLBACK_URL = 'https://seu-dominio.com.br/index.html';
const EXPO_URL = 'exps://seu-dominio.com.br';
```

### 3. Variáveis de Ambiente

```env
# .env.local
MANUS_REDIRECT_URI=https://seu-dominio.com.br/api/oauth/callback
```

---

## 🔗 URLs Finais

Depois de configurar o domínio:

| Serviço | URL |
|---------|-----|
| **Login Page** | https://seu-dominio.com.br/index.html |
| **App (Web/Expo)** | https://seu-dominio.com.br |
| **Backend API** | https://seu-dominio.com.br/api |
| **OAuth Callback** | https://seu-dominio.com.br/api/oauth/callback |

---

## 🐛 Troubleshooting

### Domínio não funciona

```bash
# 1. Verificar DNS
nslookup seu-dominio.com.br

# Esperado:
# seu-dominio.com.br canonical name = 8081-ikam3zx9nucybs2xd49lv-0e325296.us1.manus.computer

# 2. Aguardar propagação (24-48 horas)

# 3. Limpar cache DNS
ipconfig /flushdns  # Windows
sudo dscacheutil -flushcache  # macOS
sudo systemctl restart systemd-resolved  # Linux
```

### HTTPS não funciona

- Aguarde 24 horas para o certificado ser emitido
- Verifique se o DNS está correto
- Tente em um navegador diferente

### Redirecionamento não funciona

- Verifique se o CNAME está correto
- Aguarde propagação DNS
- Limpe o cache do navegador (Ctrl+Shift+Delete)

---

## 📞 Suporte

Se tiver dúvidas:

1. **Registro.br:** https://www.registro.br/suporte
2. **Namecheap:** https://www.namecheap.com/support/
3. **GoDaddy:** https://www.godaddy.com/help

---

## ✨ Próximos Passos

1. ✅ Compre o domínio
2. ✅ Configure o DNS
3. ✅ Aguarde propagação
4. ✅ Teste o acesso
5. ✅ Atualize as configurações
6. ✅ Compartilhe o novo link com clientes

---

**Última atualização:** 14 de Fevereiro de 2026
