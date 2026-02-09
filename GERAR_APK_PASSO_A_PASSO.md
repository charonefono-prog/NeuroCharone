# Como Gerar o APK do NeuroLaserMap - Passo a Passo

**Desenvolvido por:** Carlos Charone (CRFa 9-10025-5)  
**Data:** Janeiro de 2026

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:

1. **Node.js** instalado (versão 18 ou superior)
   - Verifique: `node --version`

2. **pnpm** instalado (gerenciador de pacotes)
   - Verifique: `pnpm --version`
   - Se não tiver: `npm install -g pnpm`

3. **Expo CLI** instalado
   - Verifique: `eas --version`
   - Se não tiver: `npm install -g eas-cli`

4. **Git** instalado
   - Verifique: `git --version`

5. **Conta Expo** criada
   - Visite: https://expo.dev/signup

---

## 🚀 Passo 1: Preparar o Projeto

### 1.1 Clonar o Repositório

```bash
# Se você tiver o projeto em um repositório Git
git clone <seu_repositorio_url>
cd neuromodulation_mapper

# Se você já tem o projeto localmente
cd /caminho/para/neuromodulation_mapper
```

### 1.2 Instalar Dependências

```bash
# Instalar todas as dependências
pnpm install

# Isso pode levar alguns minutos
```

### 1.3 Verificar Instalação

```bash
# Verificar se não há erros
pnpm check

# Iniciar servidor de desenvolvimento (teste rápido)
pnpm dev

# Pressione Ctrl+C para parar
```

---

## 🔐 Passo 2: Autenticar com Expo

### 2.1 Fazer Login

```bash
# Fazer login no Expo
eas login

# Quando solicitado, insira:
# Email: seu_email@gmail.com
# Senha: sua_senha_expo

# Ou use token (mais seguro):
export EXPO_TOKEN=seu_token_aqui
```

### 2.2 Verificar Autenticação

```bash
# Verificar se está logado
eas whoami

# Você deve ver seu email/username
```

---

## 📦 Passo 3: Configurar Projeto EAS

### 3.1 Inicializar EAS (Primeira Vez)

Se esta é a primeira vez que você está construindo:

```bash
# Inicializar EAS
eas init

# Quando solicitado:
# - Escolha "Create a new EAS project"
# - Ou selecione o projeto existente
```

### 3.2 Verificar Configuração

```bash
# Verificar se eas.json existe
cat eas.json

# Deve conter algo como:
# {
#   "cli": { "version": ">= 5.0.0" },
#   "build": {
#     "preview": { "android": { "buildType": "apk" } },
#     "production": {}
#   }
# }
```

---

## 🔨 Passo 4: Construir o APK

### Opção A: Usar EAS Build (Recomendado)

Este método constrói o APK nos servidores da Expo (mais confiável):

```bash
# Construir APK para produção
eas build --platform android

# Quando solicitado:
# - Escolha "production" ou "preview"
# - Selecione "APK" como tipo de build

# Isso pode levar 10-15 minutos
```

### Opção B: Construir Localmente

Se você tiver Android SDK instalado:

```bash
# Construir localmente
eas build --platform android --local

# O APK será salvo em: ./dist/
```

### Opção C: Usar Android Studio (Alternativa)

Se as opções anteriores falharem:

1. Instale Android Studio: https://developer.android.com/studio
2. Abra o projeto em Android Studio
3. Vá para: Build → Build Bundle(s) / APK(s) → Build APK(s)
4. Aguarde a compilação

---

## 📥 Passo 5: Baixar o APK

### Se Usar EAS Build

1. Após o build ser concluído, você receberá um link
2. Clique no link ou copie a URL
3. O arquivo será baixado automaticamente
4. Salve em um local seguro (ex: `~/Downloads/neurolasermap.apk`)

### Se Usar Build Local

```bash
# O arquivo estará em:
ls -la dist/

# Você verá algo como:
# neuromodulation_mapper-1.0.0.apk
```

---

## ✅ Passo 6: Verificar o APK

### 6.1 Verificar Tamanho

```bash
# Verificar tamanho do arquivo
ls -lh neurolasermap.apk

# Deve ter entre 50-100 MB
```

### 6.2 Verificar Assinatura

```bash
# Verificar se o APK está assinado corretamente
jarsigner -verify -verbose neurolasermap.apk

# Deve mostrar: "jar verified"
```

---

## 📱 Passo 7: Instalar em Dispositivo (Opcional)

### Método 1: Transferência USB

```bash
# Conectar dispositivo Android via USB
# Ativar "Depuração USB" nas configurações do dispositivo

# Instalar APK
adb install neurolasermap.apk

# Aguarde a mensagem: "Success"
```

### Método 2: Compartilhar por Email

1. Anexe o arquivo `neurolasermap.apk` a um email
2. Envie para o dispositivo
3. Abra o email no dispositivo
4. Clique no arquivo para instalar

### Método 3: Google Drive

1. Faça upload do arquivo para Google Drive
2. Compartilhe o link
3. Abra o link no dispositivo Android
4. Clique em "Instalar"

---

## 🎪 Passo 8: Publicar na Google Play Store

Veja o guia completo em: **GUIA_PUBLICACAO_PLAY_STORE.md**

Resumo rápido:

1. Acesse Google Play Console
2. Crie novo aplicativo
3. Faça upload do APK
4. Preencha informações (descrição, screenshots, etc.)
5. Envie para revisão

---

## 🆘 Troubleshooting

### Problema: "eas init: EAS project not configured"

**Solução:**

```bash
# Executar init
eas init

# Ou configurar manualmente o eas.json
cat > eas.json << 'EOF'
{
  "cli": { "version": ">= 5.0.0" },
  "build": {
    "preview": { "android": { "buildType": "apk" } },
    "production": {}
  }
}
EOF
```

### Problema: "Build failed: Could not resolve dependencies"

**Solução:**

```bash
# Limpar cache e reinstalar
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Tentar build novamente
eas build --platform android
```

### Problema: "Gradle build failed"

**Solução:**

1. Verifique se todas as dependências foram instaladas
2. Tente construir localmente em vez de usar EAS Build
3. Verifique se o Android SDK está atualizado

### Problema: "APK não instala no dispositivo"

**Solução:**

1. Verifique se o dispositivo permite instalação de fontes desconhecidas
2. Verifique se o arquivo não está corrompido
3. Tente instalar com: `adb install -r neurolasermap.apk`

---

## 📊 Resumo do Processo

| Etapa | Tempo | Descrição |
|-------|-------|-----------|
| Preparar Projeto | 5 min | Instalar dependências |
| Autenticar | 2 min | Fazer login no Expo |
| Configurar EAS | 2 min | Inicializar projeto |
| Construir APK | 15 min | Build nos servidores Expo |
| Baixar | 2 min | Download do arquivo |
| Testar | 5 min | Instalar em dispositivo |
| **Total** | **~31 min** | **Processo completo** |

---

## 🎯 Próximas Ações

Após gerar o APK:

1. ✅ Testar em um dispositivo real
2. ✅ Coletar feedback
3. ✅ Fazer upload na Google Play Console
4. ✅ Aguardar aprovação
5. ✅ Publicar para usuários

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique a documentação: https://docs.expo.dev/build/setup/
2. Procure no Stack Overflow por "Expo Android build"
3. Abra uma issue no repositório do projeto

---

**Desenvolvido por:** Carlos Charone (CRFa 9-10025-5)  
**NeuroLaserMap** - Mapeamento de Neuromodulação com Laser

Versão 1.0.0 | Janeiro de 2026
