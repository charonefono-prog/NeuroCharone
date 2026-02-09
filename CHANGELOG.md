# Changelog - NeuroLaserMap

## Versão 8e41fb2f - Correção de Exportação PDF

### 🔧 Correções Implementadas

#### Erro "Invalid Hook Call" Resolvido
- **Problema**: Erro ao tentar exportar PDF - "Invalid hook call. Hooks can only be called inside of the body of a function component"
- **Causa**: Tentativa de usar hook `useProfessionalInfo()` dentro de função async (onPress)
- **Solução**: Movido hook para o corpo do componente e uso de variável local

### 📝 Mudanças Técnicas

#### 1. **scale-result-screen.tsx**
- Adicionado import de `useProfessionalInfo`
- Adicionado import de `exportAndShareScaleResult`
- Movido hook para corpo do componente: `const { professional } = useProfessionalInfo()`
- Corrigido `handleExportPDF()` para usar `professional` do hook
- Removidos imports duplicados de `Platform`

#### 2. **patient-scales-section.tsx**
- Adicionado import de `useProfessionalInfo`
- Adicionado import de `exportAndShareScaleResult`
- Movido hook para corpo do componente
- Corrigido `onPress` do botão "Exportar Evolução em PDF"
- Removidos imports duplicados

#### 3. **icon-symbol.tsx**
- Adicionado mapeamento de ícone: `"gearshape.fill": "settings"`

#### 4. **_layout.tsx (tabs)**
- Adicionada nova aba "Configurações" ao menu principal

### ✅ Funcionalidades Operacionais

**Exportação de PDF:**
- ✅ Botão "Exportar em PDF" no resultado da escala
- ✅ Botão "Exportar Evolução em PDF" no modal de escalas
- ✅ Dados do profissional carregados automaticamente
- ✅ Compartilhamento via Share API

**Configurações do Profissional:**
- ✅ Nova aba "Configurações" no menu
- ✅ Formulário para dados do profissional (nome, CRM, especialidade)
- ✅ Armazenamento em AsyncStorage
- ✅ Dados aparecem automaticamente nos PDFs exportados

### 🧪 Testes

- ✅ 25/25 testes de escalas clínicas passando
- ✅ TypeScript: Sem erros
- ✅ LSP: Sem erros
- ✅ Build: Sem erros

### 📊 Escalas Disponíveis

**Total: 17 Escalas Clínicas**

**Lote 1 (6 escalas):**
1. Escala do Comer (DOSS)
2. Escala Breve de Zumbido (BTSS)
3. Escala de Boston (BDAE)
4. Communication Matrix
5. Escala SARA
6. Questionário de Comunicação Social (QCS)

**Lote 2 (11 escalas):**
7. PDQ-39
8. FOIS (Functional Oral Intake Scale)
9. DSFS (Drooling Severity and Frequency Scale)
10. Escala GRBASI
11. EAT-10 (Eating Assessment Tool-10)
12. STOP-Bang
13. Escala de House-Brackmann (H-B)
14. PHQ-9 (Patient Health Questionnaire-9)
15. MDQ (Mood Disorder Questionnaire)
16. SNAP-IV
17. A-MISO-S (Amsterdam Misophonia Scale)

### 🎯 Fluxo de Uso

**Exportar Resultado de Escala:**
1. Profissional responde todas as questões da escala
2. Clica no botão "Exportar em PDF"
3. PDF é gerado com dados do profissional e paciente
4. Arquivo é compartilhado via Share API (email, WhatsApp, etc.)

**Exportar Evolução do Paciente:**
1. Profissional acessa página do paciente
2. Clica na aba "Efetividade"
3. Seleciona uma escala aplicada
4. Visualiza gráficos de evolução
5. Clica em "Exportar Evolução em PDF"
6. PDF é gerado e compartilhado

**Configurar Dados do Profissional:**
1. Acessa aba "Configurações"
2. Preenche: Título, Nome, Sobrenome, CRM, Especialidade
3. Clica "Salvar Dados"
4. Dados são salvos em AsyncStorage
5. Aparecem automaticamente em todos os PDFs exportados

### 🔐 Segurança e Dados

- Dados do profissional armazenados localmente em AsyncStorage
- Sem envio de dados para servidores externos
- Compatível com LGPD e regulamentações de privacidade

### 📱 Compatibilidade

- ✅ iOS (Expo Go)
- ✅ Android (Expo Go)
- ✅ Web (Navegador)

### 🚀 Próximos Passos Recomendados

1. **Validação de dados do profissional** - Exibir aviso se profissional não preencheu seus dados antes de exportar
2. **Cache de PDF** - Armazenar PDFs gerados para reenvio sem regenerar
3. **Templates customizáveis** - Permitir escolher layout (simples, completo, comparativo)

---

**Data**: 25 de Janeiro de 2026
**Versão**: 8e41fb2f
**Status**: ✅ Pronto para Produção
