# Guia de Distribuição Alternativa - NeuroLaserMap

**Desenvolvido por:** Carlos Charone (CRFa 9-10025-5)  
**Data:** Janeiro de 2026

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Método 1: Expo Go (Mais Rápido)](#método-1-expo-go-mais-rápido)
3. [Método 2: APK Standalone (Mais Profissional)](#método-2-apk-standalone-mais-profissional)
4. [Método 3: Publicação na Google Play Store](#método-3-publicação-na-google-play-store)
5. [Comparação de Métodos](#comparação-de-métodos)

---

## 🎯 Visão Geral

Existem três formas principais de distribuir o NeuroLaserMap para seus usuários. Cada uma tem vantagens e desvantagens. Este guia ajuda você a escolher a melhor opção.

---

## 🚀 Método 1: Expo Go (Mais Rápido)

### O que é Expo Go?

Expo Go é um aplicativo que permite executar aplicativos React Native sem precisar compilar um APK. É perfeito para testes e distribuição rápida.

### Vantagens

✅ Instalação em segundos  
✅ Sem necessidade de compilar APK  
✅ Atualizações automáticas  
✅ Funciona em qualquer dispositivo Android  
✅ Perfeito para testes e demonstrações  

### Desvantagens

❌ Requer o aplicativo Expo Go instalado  
❌ Não funciona offline  
❌ Menos profissional que um APK standalone  

### Como Usar

#### Passo 1: Instalar Expo Go

1. No seu dispositivo Android, abra a **Google Play Store**
2. Procure por **"Expo Go"**
3. Clique em **"Instalar"**
4. Aguarde a instalação

#### Passo 2: Gerar QR Code

No seu computador, na pasta do projeto:

```bash
# Iniciar o servidor de desenvolvimento
pnpm dev

# Você verá um QR code no terminal
# Ou acesse: http://localhost:8081
```

#### Passo 3: Escanear QR Code

1. Abra o aplicativo **Expo Go** no seu dispositivo
2. Clique em **"Escanear código QR"**
3. Aponte a câmera para o QR code exibido no computador
4. O aplicativo será carregado automaticamente

#### Passo 4: Compartilhar com Outros

Para compartilhar com outros usuários:

1. Faça login no Expo:
   ```bash
   eas login
   ```

2. Publique o projeto:
   ```bash
   eas update
   ```

3. Compartilhe o link:
   ```
   https://expo.dev/@seu_usuario/neuromodulation_mapper
   ```

Os usuários podem abrir este link no Expo Go e o aplicativo será carregado automaticamente.

---

## 📱 Método 2: APK Standalone (Mais Profissional)

### O que é um APK Standalone?

Um APK é um arquivo executável Android que pode ser instalado diretamente em um dispositivo, sem precisar do Expo Go.

### Vantagens

✅ Aplicativo profissional e independente  
✅ Funciona offline (após instalação)  
✅ Pode ser distribuído por qualquer meio  
✅ Pronto para Google Play Store  
✅ Melhor experiência do usuário  

### Desvantagens

❌ Requer compilação (leva 10-15 minutos)  
❌ Arquivo maior (~50-100 MB)  
❌ Atualizações requerem nova compilação  

### Como Gerar APK

#### Opção A: Usando EAS Build (Recomendado)

```bash
# Fazer login no Expo
eas login

# Construir APK
eas build --platform android

# Você receberá um link para download
# O arquivo será: neuromodulation_mapper.apk
```

#### Opção B: Construir Localmente

```bash
# Instalar Android Studio
# https://developer.android.com/studio

# Construir APK localmente
eas build --platform android --local

# O APK será salvo em: ./dist/
```

### Como Instalar APK

#### Método 1: Transferência USB

1. Conecte o dispositivo ao computador via USB
2. Copie o arquivo `.apk` para o dispositivo
3. No dispositivo, abra o gerenciador de arquivos
4. Localize o arquivo `.apk`
5. Clique para instalar

#### Método 2: Email ou WhatsApp

1. Envie o arquivo `.apk` por email ou WhatsApp
2. No dispositivo, abra o email/WhatsApp
3. Clique no arquivo `.apk`
4. Clique em "Instalar"

#### Método 3: Download Direto

1. Hospede o arquivo em um servidor (Google Drive, Dropbox, etc.)
2. Compartilhe o link com os usuários
3. Os usuários clicam no link e fazem download
4. Após download, clicam em "Instalar"

---

## 🎪 Método 3: Publicação na Google Play Store

### O que é Google Play Store?

A Google Play Store é a loja oficial de aplicativos Android. Publicar lá torna seu aplicativo acessível para milhões de usuários.

### Vantagens

✅ Distribuição profissional  
✅ Alcance global  
✅ Atualizações automáticas para usuários  
✅ Análise de uso e feedback  
✅ Credibilidade profissional  

### Desvantagens

❌ Requer revisão da Google (2-4 horas)  
❌ Taxa de desenvolvedor ($25 USD)  
❌ Políticas de privacidade obrigatórias  
❌ Processo mais complexo  

### Como Publicar

Veja o guia completo em: **GUIA_PUBLICACAO_PLAY_STORE.md**

---

## 📊 Comparação de Métodos

| Aspecto | Expo Go | APK Standalone | Google Play Store |
|---------|---------|---|---|
| **Tempo de Setup** | 5 minutos | 15 minutos | 1-2 horas |
| **Facilidade** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Profissionalismo** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Alcance** | Limitado | Médio | Global |
| **Atualizações** | Automáticas | Manual | Automáticas |
| **Custo** | Grátis | Grátis | $25 USD (uma vez) |
| **Offline** | Não | Sim | Sim |
| **Melhor para** | Testes | Distribuição Interna | Produção |

---

## 🎯 Recomendação

### Para Testes e Demonstrações
👉 **Use Expo Go**

### Para Distribuição Interna
👉 **Use APK Standalone**

### Para Produção e Público Geral
👉 **Use Google Play Store**

---

## 🔧 Troubleshooting

### Problema: "Expo Go não encontra o servidor"

**Solução**: Verifique se o computador e o dispositivo estão na mesma rede Wi-Fi.

```bash
# Verificar IP do computador
ipconfig getifaddr en0  # macOS
hostname -I             # Linux
ipconfig                # Windows

# Iniciar servidor com IP específico
EXPO_TUNNEL=localhost pnpm dev
```

### Problema: "APK não instala"

**Solução**: Verifique se:

1. Você habilitou "Instalar de fontes desconhecidas" nas configurações do Android
2. O arquivo não está corrompido
3. Você tem espaço suficiente no dispositivo

### Problema: "Google Play Store rejeita o APK"

**Solução**: Verifique:

1. Se a política de privacidade está preenchida
2. Se o ícone do aplicativo está correto
3. Se a descrição é clara e profissional
4. Se não há conteúdo violento ou inapropriado

---

## 📞 Próximos Passos

1. **Escolha o método** que melhor se adequa ao seu caso
2. **Siga o guia específico** para esse método
3. **Teste o aplicativo** em um dispositivo real
4. **Recolha feedback** dos usuários
5. **Faça atualizações** conforme necessário

---

## 📝 Notas Importantes

1. **Segurança**: Nunca compartilhe sua chave de assinatura ou token Expo
2. **Privacidade**: Certifique-se de ter uma política de privacidade clara
3. **Testes**: Sempre teste em um dispositivo real antes de publicar
4. **Versão**: Mantenha um controle de versão claro (1.0.0, 1.0.1, etc.)
5. **Suporte**: Considere criar um canal de suporte para os usuários

---

**Desenvolvido por:** Carlos Charone (CRFa 9-10025-5)  
**NeuroLaserMap** - Mapeamento de Neuromodulação com Laser
