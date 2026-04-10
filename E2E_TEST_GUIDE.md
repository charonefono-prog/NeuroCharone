# Guia de Teste End-to-End Completo

## Objetivo
Validar o fluxo completo do NeuroLaserMaps desde o cadastro profissional até a exportação de relatórios.

---

## Fase 1: Cadastro Profissional

### Passos:
1. Abra o app no Expo Go
2. Acesse a aba **Perfil**
3. Preencha os dados profissionais:
   - **Nome:** João Silva
   - **Especialidade:** Fonoaudiologia
   - **Número de Registro:** CRM-123456
   - **Email:** joao@example.com
   - **Telefone:** 11987654321

### Validação:
- ✅ Dados são salvos corretamente
- ✅ Dados aparecem na aba Perfil
- ✅ Dados aparecem nos PDFs exportados

---

## Fase 2: Criação de Paciente

### Passos:
1. Acesse a aba **Pacientes**
2. Clique em "Adicionar Paciente"
3. Preencha os dados:
   - **Nome:** Maria Santos
   - **Data de Nascimento:** 15/05/1990
   - **Diagnóstico:** Disfonia Funcional
   - **Email:** maria@example.com
   - **Telefone:** 11988888888

### Validação:
- ✅ Paciente aparece na lista de pacientes
- ✅ Status inicial é "Ativo"
- ✅ Dados são salvos corretamente

---

## Fase 3: Criação de Plano Terapêutico

### Passos:
1. Clique no paciente criado
2. Acesse a seção **Plano Terapêutico**
3. Preencha os dados:
   - **Objetivo:** Restaurar qualidade vocal
   - **Regiões Alvo:** Laringe, Faringe
   - **Pontos Alvo:** Fp1, Fp2, F3, F4
   - **Frequência:** 2 vezes por semana
   - **Duração Total:** 60 minutos

### Validação:
- ✅ Plano é criado e associado ao paciente
- ✅ Pontos alvo são salvos corretamente

---

## Fase 4: Aplicação de Escala Clínica (Inicial)

### Passos:
1. Acesse a aba **Escalas**
2. Selecione **Escala do Comer (DOSS)**
3. Preencha as respostas:
   - Questão 1: Valor 3 (Purê)
   - Questão 2: Valor 3 (Risco alto)
   - Questão 3: Valor 3 (Dependência)
4. Clique em **Salvar Escala**

### Validação:
- ✅ Escala é calculada automaticamente
- ✅ Score total aparece (ex: 9)
- ✅ Interpretação é exibida (ex: "Disfagia severa")
- ✅ Escala aparece no histórico do paciente

---

## Fase 5: Registro de Sessão

### Passos:
1. Acesse a aba **Sessões** (ou similar)
2. Crie nova sessão:
   - **Data:** Hoje
   - **Duração:** 30 minutos
   - **Pontos Estimulados:** Fp1, Fp2, F3, F4
   - **Joules:** 100
   - **Avaliação de Sintomas:** 7/10
   - **Observações:** Sessão bem tolerada

### Validação:
- ✅ Sessão é registrada
- ✅ Dados aparecem no histórico

---

## Fase 6: Aplicação de Escala Clínica (Final)

### Passos:
1. Acesse a aba **Escalas**
2. Selecione novamente **Escala do Comer (DOSS)**
3. Preencha com valores melhores:
   - Questão 1: Valor 7 (Normal)
   - Questão 2: Valor 7 (Segura)
   - Questão 3: Valor 7 (Independência)
4. Clique em **Salvar Escala**

### Validação:
- ✅ Nova escala é salva
- ✅ Score total é maior (ex: 21)
- ✅ Interpretação muda (ex: "Normal")
- ✅ Histórico mostra ambas as escalas

---

## Fase 7: Visualizar Efetividade

### Passos:
1. Acesse a aba **Efetividade**
2. Selecione o paciente
3. Verifique os dados exibidos

### Validação:
- ✅ Escalas aplicadas aparecem listadas
- ✅ Gráfico de evolução é exibido
- ✅ Mostra primeira e última pontuação
- ✅ Calcula % de melhora (ex: +133%)
- ✅ Dados do profissional aparecem

---

## Fase 8: Exportar PDF de Escala

### Passos:
1. Acesse a aba **Escalas**
2. Selecione uma escala do histórico
3. Clique em **Exportar PDF**
4. Verifique o PDF gerado

### Validação PDF:
- ✅ Nome do paciente aparece
- ✅ Data da avaliação aparece
- ✅ Respostas são listadas
- ✅ Score total aparece
- ✅ Interpretação aparece
- ✅ Dados profissionais aparecem (nome, CRM, especialidade)
- ✅ Logo do NeuroLaserMaps aparece no header
- ✅ Número de protocolo único aparece no rodapé
- ✅ QR code aparece no rodapé
- ✅ "Desenvolvido por: Carlos Charone" aparece apenas no rodapé
- ✅ Sem dados hardcoded (ex: sem "CRFa 9 - 10025-5")

---

## Fase 9: Exportar PDF de Efetividade

### Passos:
1. Acesse a aba **Efetividade**
2. Selecione o paciente
3. Clique em **Exportar Relatório**
4. Verifique o PDF gerado

### Validação PDF:
- ✅ Nome do paciente aparece
- ✅ Todas as escalas aplicadas aparecem
- ✅ Gráfico de evolução aparece
- ✅ Dados profissionais aparecem
- ✅ Logo do NeuroLaserMaps aparece
- ✅ Número de protocolo único aparece
- ✅ QR code aparece
- ✅ "Desenvolvido por: Carlos Charone" aparece apenas no rodapé
- ✅ Interpretações aparecem

---

## Fase 10: Marcar Paciente como Concluído

### Passos:
1. Acesse a aba **Pacientes**
2. Clique no paciente "Maria Santos"
3. Clique em **Concluir Tratamento** (ou botão similar)
4. Confirme a ação

### Validação:
- ✅ Status do paciente muda para "Concluído"
- ✅ Paciente aparece na aba "Concluindo" ou com status diferente
- ✅ Opção de "Reabrir" aparece se necessário

---

## Fase 11: Testar Atualização de Lista

### Passos:
1. Crie um novo paciente
2. Volte para a aba **Pacientes**
3. Verifique se o novo paciente aparece na lista

### Validação:
- ✅ Novo paciente aparece imediatamente
- ✅ Lista é atualizada sem precisar reabrir o app

---

## Fase 12: Testar Múltiplas Escalas

### Passos:
1. Selecione um paciente
2. Aplique 2-3 escalas diferentes (DOSS, PHQ9, etc.)
3. Acesse a aba **Efetividade**

### Validação:
- ✅ Todas as escalas aparecem listadas
- ✅ Cada escala tem seu próprio gráfico
- ✅ Dados não se misturam

---

## Checklist Final

| Item | Status |
|------|--------|
| Cadastro profissional funciona | ✅ |
| Criação de paciente funciona | ✅ |
| Plano terapêutico funciona | ✅ |
| Aplicação de escalas funciona | ✅ |
| Registro de sessões funciona | ✅ |
| Aba Efetividade exibe dados | ✅ |
| PDF de escala exporta corretamente | ✅ |
| PDF de efetividade exporta corretamente | ✅ |
| Dados profissionais aparecem nos PDFs | ✅ |
| "Desenvolvido por: Carlos Charone" aparece apenas no rodapé | ✅ |
| QR code aparece nos PDFs | ✅ |
| Número de protocolo aparece nos PDFs | ✅ |
| Status de paciente pode ser alterado | ✅ |
| Lista de pacientes atualiza automaticamente | ✅ |
| Múltiplas escalas funcionam | ✅ |

---

## Notas Importantes

1. **Dados Profissionais:** Sempre verificar se os dados cadastrados aparecem nos PDFs, não dados hardcoded
2. **Rodapé:** "Desenvolvido por: Carlos Charone" deve aparecer APENAS no rodapé dos PDFs
3. **QR Code:** Deve ser escaneável e conter o número de protocolo
4. **Gráficos:** Devem mostrar evolução clara entre primeira e última aplicação
5. **Sem Erros:** Nenhuma mensagem de erro deve aparecer durante o fluxo

---

## Próximos Passos Após Validação

1. Adicionar campo de conselho profissional (CRFa, CRM, CREFITO)
2. Implementar validação de formato de registro
3. Adicionar notificações Toast para confirmações
4. Implementar histórico de alterações
