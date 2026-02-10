# Guia de Publicação - NeuroLaserMap v2.0.0

## 📱 Informações do Aplicativo

| Campo | Valor |
|-------|-------|
| **Nome** | NeuroLaserMap |
| **Versão** | 2.0.0 |
| **Bundle ID (iOS)** | space.manus.neuromodulation.mapper.t20260118155822 |
| **Package (Android)** | space.manus.neuromodulation.mapper.t20260118155822 |
| **Descrição** | Sistema de mapeamento de neuromodulação com 17 escalas clínicas, sistema 10-20 EEG e gestão de pacientes |

---

## 🎯 Funcionalidades Principais

### Escalas Clínicas (17 escalas)
- **SARA** - 8 itens (Ataxia)
- **QCS** - 6 itens (Comunicação Social)
- **CM** - 5 itens (Communication Matrix)
- **PDQ-39** - 39 itens (Parkinson - Qualidade de Vida)
- **FOIS** - 7 itens (Ingestão Oral)
- **DSFS** - 2 itens (Salivação de Parkinson)
- **GRBASI** - 6 itens (Qualidade de Voz)
- **EAT-10** - 10 itens (Disfagia)
- **MDS-UPDRS** - 39 itens (Parkinson - Motor)
- **BDAE** - 6 itens (Afasia)
- **DOSS** - 7 itens (Disfagia)
- **BTSS** - 3 itens (Zumbido)
- **MMSE** - 30 itens (Estado Mental)
- **MoCA** - 30 itens (Cognição)
- **FAB** - 18 itens (Funções Executivas)
- **TMT** - 2 itens (Atenção)
- **BDI** - 21 itens (Depressão)

### Sistema 10-20 EEG
- Imagem oficial integrada com 64 pontos mapeados
- Visualização interativa do capacete de fotobiomodulação
- Seleção de pontos para planejamento de tratamento

### Gerenciamento de Pacientes
- Cadastro completo com dados demográficos
- Histórico de sessões e tratamentos
- Exportação de dados em Excel
- Relatórios em PDF com assinatura eletrônica

---

## 📋 Requisitos para Publicação

### Google Play Store (Android)
1. **Conta Google Play Developer**
   - Custo: $25 (único)
   - Acesso: https://play.google.com/console

2. **Arquivo de Build**
   - Formato: `.aab` (Android App Bundle)
   - Tamanho: ~150 MB
   - Assinatura: Gerada automaticamente pelo Expo

3. **Informações Obrigatórias**
   - Descrição breve (80 caracteres)
   - Descrição completa (4000 caracteres)
   - Ícone do app (512x512 px)
   - Screenshots (mínimo 2, máximo 8)
   - Classificação de conteúdo
   - Categoria: Saúde e Fitness

4. **Política de Privacidade**
   - URL obrigatória
   - Deve descrever coleta de dados

5. **Permissões Solicitadas**
   - POST_NOTIFICATIONS (notificações)
   - Acesso a arquivos (para exportação)

### Apple App Store (iOS)
1. **Conta Apple Developer**
   - Custo: $99/ano
   - Acesso: https://developer.apple.com

2. **Arquivo de Build**
   - Formato: `.ipa` (iOS App Package)
   - Tamanho: ~120 MB
   - Certificado: Gerado automaticamente pelo Expo

3. **Informações Obrigatórias**
   - Descrição breve (30 caracteres)
   - Descrição completa (4000 caracteres)
   - Ícone do app (1024x1024 px)
   - Screenshots (mínimo 2 por dispositivo)
   - Classificação de conteúdo
   - Categoria: Medicina

4. **Política de Privacidade**
   - URL obrigatória
   - Deve descrever coleta de dados

5. **Informações Adicionais**
   - Suporte de idioma
   - Versão mínima do iOS: 14.0
   - Orientação: Portrait

---

## 🔧 Processo de Publicação

### Passo 1: Preparar os Builds

```bash
# Gerar build Android
export EXPO_TOKEN="seu_token_aqui"
eas build --platform android

# Gerar build iOS
eas build --platform ios
```

### Passo 2: Google Play Store

1. Acesse https://play.google.com/console
2. Clique em "Criar aplicativo"
3. Preencha informações básicas
4. Vá para "Versão" → "Produção"
5. Faça upload do arquivo `.aab`
6. Preencha descrição, screenshots e política de privacidade
7. Envie para revisão

**Tempo de aprovação:** 1-3 horas

### Passo 3: Apple App Store

1. Acesse https://appstoreconnect.apple.com
2. Clique em "Meus Apps"
3. Clique em "+" para criar novo app
4. Preencha informações básicas
5. Vá para "Versão" → "Compilação"
6. Faça upload do arquivo `.ipa` usando Xcode ou Transporter
7. Preencha descrição, screenshots e política de privacidade
8. Envie para revisão

**Tempo de aprovação:** 24-48 horas

---

## 📸 Recomendações para Screenshots

### Android (Google Play)
- Resolução: 1080x1920 px
- Formato: PNG ou JPEG
- Quantidade: 2-8 screenshots
- Sugestão:
  1. Tela inicial com estatísticas
  2. Listagem de pacientes
  3. Sistema 10-20 EEG
  4. Escalas clínicas
  5. Relatório de efetividade

### iOS (App Store)
- Resolução: 1242x2208 px (iPhone)
- Formato: PNG
- Quantidade: 2-5 screenshots por dispositivo
- Mesmas sugestões do Android

---

## 📝 Descrição do Aplicativo

### Breve (80 caracteres - Android)
```
NeuroLaserMap: Sistema clínico de neuromodulação com 17 escalas
```

### Completa (4000 caracteres)
```
NeuroLaserMap é um sistema completo de mapeamento e gestão de 
neuromodulação, desenvolvido para profissionais de saúde que utilizam 
técnicas de fotobiomodulação e neuroestimulação.

PRINCIPAIS FUNCIONALIDADES:

✅ 17 Escalas Clínicas Completas
- Avaliação de Parkinson (PDQ-39, MDS-UPDRS)
- Avaliação de Disfagia (DOSS, EAT-10, FOIS)
- Avaliação de Afasia (BDAE)
- Avaliação Cognitiva (MMSE, MoCA, FAB)
- Avaliação de Depressão (BDI)
- E mais...

✅ Sistema 10-20 EEG Interativo
- Visualização do capacete de fotobiomodulação
- Seleção de 64 pontos de estimulação
- Mapeamento anatômico preciso

✅ Gestão Completa de Pacientes
- Cadastro de pacientes com histórico
- Planejamento de sessões
- Rastreamento de progresso
- Exportação de relatórios em PDF

✅ Persistência de Dados
- Armazenamento seguro com AsyncStorage
- Sincronização automática
- Backup de dados

BENEFÍCIOS:

• Avaliação padronizada com escalas clínicas validadas
• Planejamento otimizado de tratamentos
• Rastreamento de evolução do paciente
• Relatórios profissionais para documentação
• Interface intuitiva e responsiva

REQUISITOS:

- iOS 14.0 ou superior
- Android 8.0 ou superior
- Conexão com internet (para sincronização)

Desenvolvido por Carlos Charone
```

---

## 🔐 Política de Privacidade

### Template Básico
```
POLÍTICA DE PRIVACIDADE - NeuroLaserMap

1. COLETA DE DADOS
O NeuroLaserMap coleta dados clínicos de pacientes para fins de 
tratamento e pesquisa, incluindo:
- Informações demográficas
- Histórico de sessões
- Respostas de escalas clínicas
- Dados de tratamento

2. USO DE DADOS
Os dados são utilizados exclusivamente para:
- Planejamento de tratamento
- Rastreamento de progresso
- Geração de relatórios
- Pesquisa clínica (com consentimento)

3. SEGURANÇA
Os dados são armazenados localmente no dispositivo com criptografia.

4. CONSENTIMENTO
O usuário deve obter consentimento informado dos pacientes antes 
de coletar dados.

5. CONTATO
Para dúvidas sobre privacidade, entre em contato através do app.
```

---

## ✅ Checklist de Publicação

- [ ] Versão atualizada para 2.0.0
- [ ] Todos os ícones e imagens preparados
- [ ] Screenshots capturados e editados
- [ ] Descrição do app finalizada
- [ ] Política de privacidade publicada
- [ ] Build Android (.aab) gerado
- [ ] Build iOS (.ipa) gerado
- [ ] Conta Google Play Developer criada
- [ ] Conta Apple Developer criada
- [ ] Informações de pagamento configuradas
- [ ] App enviado para revisão no Google Play
- [ ] App enviado para revisão no App Store
- [ ] Monitoramento de aprovação
- [ ] Publicação confirmada

---

## 📞 Suporte

Para dúvidas sobre publicação ou configuração, consulte:
- Documentação Expo: https://docs.expo.dev
- Google Play Console Help: https://support.google.com/googleplay
- Apple App Store Help: https://help.apple.com/app-store-connect

---

**Última atualização:** 10 de Fevereiro de 2026
**Versão:** 2.0.0
