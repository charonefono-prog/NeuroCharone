# Guia Completo: Publicação do NeuroLaserMap na Google Play Store

**Desenvolvido por:** Carlos Charone (CRFa 9-10025-5)  
**Aplicativo:** NeuroLaserMap - Mapeamento de Neuromodulação  
**Data:** Janeiro de 2026

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Etapa 1: Preparar a Conta de Desenvolvedor](#etapa-1-preparar-a-conta-de-desenvolvedor)
4. [Etapa 2: Gerar Chave de Assinatura](#etapa-2-gerar-chave-de-assinatura)
5. [Etapa 3: Construir o APK](#etapa-3-construir-o-apk)
6. [Etapa 4: Configurar a Listagem na Play Store](#etapa-4-configurar-a-listagem-na-play-store)
7. [Etapa 5: Enviar para Revisão](#etapa-5-enviar-para-revisão)
8. [Etapa 6: Monitorar e Manter](#etapa-6-monitorar-e-manter)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O NeuroLaserMap é um aplicativo móvel para mapeamento de neuromodulação com laser. Este guia fornece instruções passo a passo para publicar o aplicativo na Google Play Store, permitindo que profissionais de saúde o instalem em seus dispositivos Android.

### Características do Aplicativo

- **Registro de Pacientes**: Gerenciamento completo de dados de pacientes
- **Planos Terapêuticos**: Suporte a múltiplos planos simultâneos e sequenciais
- **Visualização 3D**: Capacete anatômico com marcação de pontos de estimulação
- **Sessões de Tratamento**: Registro detalhado de cada sessão
- **Relatórios em PDF**: Exportação de progresso e histórico
- **Gráficos de Progresso**: Visualização de evolução do tratamento

---

## 📦 Pré-requisitos

Antes de começar, você precisará de:

1. **Conta de Desenvolvedor Google Play** (já configurada - R$ 25 USD pagos)
2. **Computador com Node.js** instalado (versão 18+)
3. **Expo CLI** instalado globalmente
4. **Git** instalado
5. **Credenciais Expo** (token de autenticação)
6. **Chave de assinatura Android** (será gerada)

### Instalação de Ferramentas Necessárias

Se você ainda não tem as ferramentas instaladas, execute:

```bash
# Instalar Node.js (se necessário)
# Visite: https://nodejs.org/

# Instalar Expo CLI
npm install -g eas-cli

# Verificar instalação
eas --version
```

---

## 🔐 Etapa 1: Preparar a Conta de Desenvolvedor

### 1.1 Acessar Google Play Console

1. Acesse [Google Play Console](https://play.google.com/console)
2. Faça login com sua conta Google
3. Você deve ver a tela inicial com a opção de criar um novo aplicativo

### 1.2 Criar Novo Aplicativo

1. Clique em **"Criar aplicativo"**
2. Preencha os dados:
   - **Nome do aplicativo**: `NeuroLaserMap`
   - **Idioma padrão**: Português (Brasil)
   - **Tipo de aplicativo**: Aplicativo
   - **Categoria**: Médico
3. Aceite os termos e clique em **"Criar"**

### 1.3 Configurar Informações Básicas

Na seção **"Informações do aplicativo"**:

- **Nome do aplicativo**: NeuroLaserMap
- **Descrição curta**: Mapeamento de neuromodulação com laser
- **Descrição completa**: 
  ```
  NeuroLaserMap é um aplicativo profissional para mapeamento 
  de neuromodulação com laser, desenvolvido por Carlos Charone (CRFa 9-10025-5).
  
  Funcionalidades:
  - Registro e gerenciamento de pacientes
  - Planos terapêuticos personalizados
  - Visualização 3D do capacete anatômico
  - Marcação de pontos de estimulação
  - Registro de sessões de tratamento
  - Gráficos de progresso e evolução
  - Exportação de relatórios em PDF
  
  Desenvolvido para profissionais de saúde que utilizam 
  terapia com laser para neuromodulação.
  ```

---

## 🔑 Etapa 2: Gerar Chave de Assinatura

### 2.1 Gerar Chave com Expo

No seu computador, na pasta do projeto, execute:

```bash
# Fazer login no Expo
eas login

# Quando solicitado, insira:
# Email: seu_email@gmail.com
# Senha: sua_senha_expo

# Gerar chave de assinatura
eas build --platform android --local
```

Isso gerará uma chave de assinatura que será salva localmente.

### 2.2 Alternativa: Gerar Chave Manual

Se preferir gerar a chave manualmente:

```bash
# Gerar keystore
keytool -genkey -v -keystore ~/neurolasermap.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias neurolasermap

# Quando solicitado, preencha:
# Senha: (escolha uma senha segura)
# Nome: Carlos Charone
# Organização: NeuroLaserMap
# Cidade: (sua cidade)
# Estado: (seu estado)
# País: BR
```

**Importante**: Guarde a senha da chave em local seguro!

---

## 🔨 Etapa 3: Construir o APK

### 3.1 Preparar o Projeto

```bash
# Clonar o repositório (se necessário)
git clone <seu_repositorio>
cd neuromodulation_mapper

# Instalar dependências
pnpm install

# Verificar se não há erros
pnpm check
```

### 3.2 Construir com EAS Build

```bash
# Fazer login no Expo (se não estiver logado)
eas login

# Construir APK para produção
eas build --platform android --non-interactive

# Isso pode levar 10-15 minutos
# Você receberá um link para download quando estiver pronto
```

### 3.3 Construir Localmente (Alternativa)

Se o EAS Build falhar, você pode construir localmente:

```bash
# Instalar Android SDK (se necessário)
# Visite: https://developer.android.com/studio

# Construir APK
eas build --platform android --local

# O APK será salvo em: ./dist/
```

---

## 📱 Etapa 4: Configurar a Listagem na Play Store

### 4.1 Adicionar Screenshots

Na Google Play Console, vá para **"Listagem de apps"** → **"Screenshots"**:

1. Adicione pelo menos 2 screenshots (máximo 8)
2. Tamanho recomendado: 1080 x 1920 pixels
3. Exemplos de screenshots:
   - Tela inicial com lista de pacientes
   - Visualização 3D do capacete
   - Gráfico de progresso
   - Formulário de sessão

### 4.2 Adicionar Ícone do Aplicativo

1. Vá para **"Listagem de apps"** → **"Ícone do aplicativo"**
2. Faça upload do arquivo: `assets/images/icon.png`
3. Tamanho: 512 x 512 pixels

### 4.3 Configurar Classificação de Conteúdo

1. Vá para **"Classificação de conteúdo"**
2. Preencha o questionário:
   - Violência: Nenhuma
   - Conteúdo sexual: Nenhum
   - Linguagem: Nenhuma
   - Álcool/Tabaco/Drogas: Nenhum
   - Dados pessoais: Sim (coleta dados de pacientes)
3. Clique em **"Salvar"**

### 4.4 Configurar Privacidade

1. Vá para **"Política de privacidade"**
2. Adicione um link para sua política de privacidade (ou deixe em branco por enquanto)
3. Marque: "Este aplicativo coleta dados pessoais"

---

## 📤 Etapa 5: Enviar para Revisão

### 5.1 Fazer Upload do APK

1. Na Google Play Console, vá para **"Versão"** → **"Produção"**
2. Clique em **"Criar nova versão"**
3. Faça upload do arquivo APK que você construiu
4. Preencha as notas de versão:
   ```
   Versão 1.0.0 - Lançamento Inicial
   
   - Registro e gerenciamento de pacientes
   - Planos terapêuticos personalizados
   - Visualização 3D do capacete anatômico
   - Marcação de pontos de estimulação
   - Registro de sessões de tratamento
   - Gráficos de progresso
   - Exportação de relatórios em PDF
   ```

### 5.2 Revisar Antes de Publicar

1. Verifique todos os dados:
   - Nome do aplicativo
   - Descrição
   - Screenshots
   - Ícone
   - Versão do APK
2. Clique em **"Revisar"**
3. Clique em **"Publicar"**

### 5.3 Aguardar Revisão

- A Google normalmente revisa aplicativos em **2-4 horas**
- Você receberá um email quando o aplicativo for aprovado ou rejeitado
- Se rejeitado, corrija os problemas e reenvie

---

## 📊 Etapa 6: Monitorar e Manter

### 6.1 Após a Publicação

1. Acesse **"Análise"** para ver:
   - Número de instalações
   - Taxa de retenção
   - Avaliações e comentários
   - Relatórios de erros

### 6.2 Atualizar o Aplicativo

Para lançar uma nova versão:

```bash
# Atualizar versão no app.config.ts
# Exemplo: "version": "1.0.1"

# Construir novo APK
eas build --platform android

# Fazer upload na Google Play Console
# Seguir os mesmos passos da Etapa 5
```

### 6.3 Responder a Comentários

1. Vá para **"Comentários"** na Google Play Console
2. Responda às avaliações dos usuários
3. Isso melhora a visibilidade do aplicativo

---

## 🆘 Troubleshooting

### Problema: "APK não assinado"

**Solução**: Certifique-se de que você gerou a chave de assinatura corretamente:

```bash
# Verificar se a chave existe
ls -la ~/neurolasermap.keystore

# Se não existir, gerar novamente
keytool -genkey -v -keystore ~/neurolasermap.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias neurolasermap
```

### Problema: "Erro ao fazer upload do APK"

**Solução**: Verifique se:

1. O APK foi construído corretamente
2. O arquivo não está corrompido
3. Você tem permissão para fazer upload
4. A versão do APK é maior que a anterior

### Problema: "Aplicativo rejeitado pela Google"

**Solução**: Verifique os motivos da rejeição:

1. Vá para **"Versão"** → **"Produção"**
2. Procure por mensagens de erro
3. Corrija os problemas (geralmente relacionados a privacidade ou segurança)
4. Reenvie o APK

### Problema: "EAS Build falha com erro de Gradle"

**Solução**: Tente construir localmente:

```bash
# Instalar Android Studio
# https://developer.android.com/studio

# Construir com Android Studio
eas build --platform android --local
```

---

## 📞 Suporte

Se você encontrar problemas durante o processo:

1. **Documentação Expo**: https://docs.expo.dev/build/setup/
2. **Google Play Console Help**: https://support.google.com/googleplay/android-developer
3. **Stack Overflow**: Procure por "Expo Android build"

---

## ✅ Checklist Final

Antes de publicar, verifique:

- [ ] Conta de desenvolvedor Google Play criada e ativa
- [ ] Chave de assinatura gerada e segura
- [ ] APK construído e testado
- [ ] Screenshots adicionados (mínimo 2)
- [ ] Ícone do aplicativo configurado
- [ ] Descrição e nome do aplicativo preenchidos
- [ ] Classificação de conteúdo concluída
- [ ] Política de privacidade adicionada
- [ ] Versão do APK verificada
- [ ] Notas de versão preenchidas
- [ ] Revisão final concluída

---

## 📝 Notas Importantes

1. **Segurança da Chave**: Nunca compartilhe sua chave de assinatura. Ela é necessária para atualizar o aplicativo.

2. **Dados de Pacientes**: O NeuroLaserMap coleta dados pessoais. Certifique-se de ter uma política de privacidade clara.

3. **Atualizações**: Sempre teste o aplicativo em um dispositivo Android real antes de publicar uma atualização.

4. **Versão**: Sempre incremente o número de versão ao atualizar (ex: 1.0.0 → 1.0.1 → 1.1.0).

5. **Suporte**: Considere criar um email de suporte para os usuários entrarem em contato.

---

**Desenvolvido por:** Carlos Charone (CRFa 9-10025-5)  
**NeuroLaserMap** - Mapeamento de Neuromodulação com Laser
