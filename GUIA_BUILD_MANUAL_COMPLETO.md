# Guia Completo: Build Manual do Neuromodulation Mapper

## Versão: 1.0.26
**Data:** 7 de Fevereiro de 2026  
**Status:** ✅ Escalas Completas | ✅ Testes E2E 100% | ✅ Pronto para Produção

---

## 📋 Pré-requisitos

### Para iOS (Xcode)
- Mac com macOS 12.0 ou superior
- Xcode 14.0 ou superior
- CocoaPods instalado (`sudo gem install cocoapods`)
- Conta Apple Developer ativa
- Certificados e Perfis de Provisionamento configurados

### Para Android (Android Studio)
- Android Studio 2021.3.1 ou superior
- Android SDK 33 ou superior
- JDK 11 ou superior
- Keystore configurado para assinatura

---

## 🍎 BUILD PARA iOS (via Xcode)

### Passo 1: Preparar o Código-Fonte

```bash
# Extrair o código-fonte do projeto
cd ~/seu-projeto/neuromodulation_mapper

# Instalar dependências Node.js
npm install
# ou
pnpm install

# Limpar cache anterior (importante!)
rm -rf node_modules/.cache
```

### Passo 2: Gerar Arquivos Nativos iOS

```bash
# Executar o prebuild do Expo
npx expo prebuild --platform ios --clean

# Este comando criará a pasta 'ios' com o projeto Xcode
```

### Passo 3: Instalar Dependências Nativas (CocoaPods)

```bash
cd ios

# Instalar pods
pod install

# Se estiver em Mac com chip M1/M2/M3, use:
# arch -x86_64 pod install

cd ..
```

### Passo 4: Abrir no Xcode

```bash
# Abrir o projeto no Xcode (IMPORTANTE: abra o .xcworkspace, não o .xcodeproj)
open ios/NeuroLaserMap.xcworkspace
```

### Passo 5: Configurar Assinatura

1. No Xcode, clique no ícone azul do projeto (**NeuroLaserMap**) na barra lateral esquerda
2. Vá na aba **"Signing & Capabilities"**
3. Em **"Team"**, selecione sua conta Apple Developer
4. Certifique-se de que o **"Bundle Identifier"** está correto (ex: `space.manus.neuromodulation.mapper`)

### Passo 6: Gerar a Build (Archive)

1. No topo do Xcode, ao lado do botão "Play", selecione **"Any iOS Device (arm64)"** como destino
2. Vá no menu superior: **Product > Archive**
3. O Xcode compilará todo o projeto (pode levar 10-15 minutos)
4. Ao finalizar, abrirá a janela **"Organizer"**

### Passo 7: Distribuir para TestFlight ou App Store

Na janela **"Organizer"**:

1. Clique em **"Distribute App"**
2. Escolha **"App Store Connect"** (para produção)
3. Siga as instruções para:
   - Selecionar o certificado de distribuição
   - Configurar opções de distribuição
   - Enviar para a App Store Connect

### Passo 8: Exportar como IPA (Opcional)

Se preferir exportar apenas o arquivo `.ipa`:

1. Na janela **"Organizer"**, clique em **"Distribute App"**
2. Escolha **"Custom"** ou **"Ad Hoc"**
3. Siga as instruções para exportar o arquivo `.ipa`

---

## 🤖 BUILD PARA ANDROID (via Android Studio)

### Passo 1: Preparar o Código-Fonte

```bash
# Extrair o código-fonte do projeto
cd ~/seu-projeto/neuromodulation_mapper

# Instalar dependências Node.js
npm install
# ou
pnpm install

# Limpar cache anterior
rm -rf node_modules/.cache
```

### Passo 2: Gerar Arquivos Nativos Android

```bash
# Executar o prebuild do Expo
npx expo prebuild --platform android --clean

# Este comando criará a pasta 'android' com o projeto Android
```

### Passo 3: Abrir no Android Studio

```bash
# Abrir o projeto no Android Studio
open -a "Android Studio" android/
```

Ou abra manualmente:
1. Abra Android Studio
2. Clique em **"Open"**
3. Navegue até a pasta `android/` do projeto
4. Clique em **"Open"**

### Passo 4: Configurar Keystore (Assinatura)

Se você ainda não tem um keystore:

```bash
# Criar um novo keystore
keytool -genkey -v -keystore ~/my-release-key.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias my-key-alias
```

Salve as informações de senha e alias com segurança!

### Passo 5: Configurar Assinatura no Android Studio

1. No Android Studio, vá em **File > Project Structure**
2. Clique em **"Signing"** na barra lateral esquerda
3. Clique em **"+"** para adicionar uma nova configuração
4. Preencha:
   - **Store File:** Caminho para seu `my-release-key.keystore`
   - **Store Password:** Senha do keystore
   - **Key Alias:** `my-key-alias`
   - **Key Password:** Senha da chave
5. Clique em **"OK"**

### Passo 6: Selecionar Build Type

1. Vá em **Build > Select Build Variant**
2. Selecione **"release"** (em vez de "debug")

### Passo 7: Gerar APK ou AAB

#### Opção A: Gerar APK (para teste direto no celular)

1. Vá em **Build > Build APK(s)**
2. O Android Studio compilará o projeto
3. Ao finalizar, clique em **"locate"** para encontrar o arquivo `.apk`

#### Opção B: Gerar AAB (para Google Play Store)

1. Vá em **Build > Build Bundle(s) / APK(s) > Build Bundle(s)**
2. O Android Studio compilará o projeto
3. Ao finalizar, clique em **"locate"** para encontrar o arquivo `.aab`

### Passo 8: Instalar no Celular (APK)

```bash
# Conectar o celular via USB com "USB Debugging" ativado
# Depois, execute:
adb install -r app/release/app-release.apk
```

---

## 📦 Estrutura de Versão

**Versão Atual:** `1.0.26`

### Histórico de Mudanças:
- **v1.0.26:** ✅ Escalas PDQ-39, MDS-UPDRS e SALIVA completas | ✅ Testes E2E 100% aprovados
- **v1.0.25:** Build de produção anterior
- **v1.0.0:** Versão inicial

---

## ✅ Checklist Pré-Build

Antes de gerar a build final, verifique:

- [ ] Todas as dependências instaladas (`npm install`)
- [ ] Nenhum erro de compilação TypeScript
- [ ] Testes E2E passando (`node test-e2e.js`)
- [ ] Versão atualizada no `package.json`
- [ ] Certificados e chaves de assinatura configurados
- [ ] Conexão de internet estável
- [ ] Espaço em disco suficiente (mín. 10 GB)

---

## 🔍 Troubleshooting

### Erro: "Pod install failed"
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

### Erro: "Gradle build failed"
```bash
cd android
./gradlew clean
./gradlew build
cd ..
```

### Erro: "Certificate not found"
- Verifique se os certificados estão instalados no Keychain (macOS)
- Regenere os certificados no Apple Developer Portal

### Erro: "Build timeout"
- Aumente a memória disponível para o Gradle
- Edite `android/gradle.properties`:
  ```
  org.gradle.jvmargs=-Xmx4096m
  ```

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs completos no Xcode ou Android Studio
2. Consulte a documentação do Expo: https://docs.expo.dev/
3. Verifique o status dos servidores da Apple e Google

---

## 🎉 Próximos Passos

Após gerar as builds:

1. **Teste no seu dispositivo** antes de enviar para produção
2. **Envie para TestFlight** (iOS) ou **Google Play Console** (Android)
3. **Monitore os testes** de usuários beta
4. **Publique na App Store** e **Google Play Store**

---

**Boa sorte com a build! 🚀**
