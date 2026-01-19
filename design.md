# Design do Aplicativo de Mapeamento de Neuromodulação

## Visão Geral
Aplicativo móvel profissional para mapeamento de neuromodulação craniana, permitindo que profissionais de saúde registrem pacientes, criem planos terapêuticos personalizados, visualizem o capacete anatômico com pontos de estimulação baseados no sistema 10-20, registrem sessões de tratamento e gerem relatórios detalhados.

## Orientação e Uso
- **Orientação**: Portrait (9:16) - uso com uma mão
- **Plataforma**: iOS e Android
- **Estilo**: Seguir Apple Human Interface Guidelines (HIG)
- **Público**: Profissionais de saúde (neurologistas, fisioterapeutas, terapeutas)

## Paleta de Cores
- **Primary (Azul Médico)**: `#0066CC` - Confiança, profissionalismo, saúde
- **Secondary (Verde Saúde)**: `#00A86B` - Sucesso, bem-estar, progresso
- **Background Light**: `#FFFFFF`
- **Background Dark**: `#1A1A1A`
- **Surface Light**: `#F5F7FA`
- **Surface Dark**: `#2D2D2D`
- **Text Primary**: `#1A1A1A` (light) / `#FFFFFF` (dark)
- **Text Secondary**: `#6B7280` (light) / `#9CA3AF` (dark)
- **Border**: `#E5E7EB` (light) / `#374151` (dark)
- **Error**: `#DC2626`
- **Warning**: `#F59E0B`
- **Success**: `#10B981`

## Lista de Telas

### 1. Tela de Login/Autenticação
**Conteúdo**:
- Logo do aplicativo (ícone de capacete + cérebro estilizado)
- Campo de email
- Campo de senha
- Botão "Entrar"
- Link "Esqueci minha senha"
- Link "Criar conta"

**Funcionalidade**:
- Autenticação de usuário via backend
- Validação de campos
- Feedback visual de erros

### 2. Tela Principal (Home/Dashboard)
**Conteúdo**:
- Header com saudação e foto do profissional
- Cards com estatísticas rápidas:
  - Total de pacientes
  - Sessões hoje
  - Sessões esta semana
  - Pacientes ativos
- Lista de sessões agendadas para hoje
- Botão flutuante "+" para adicionar novo paciente

**Funcionalidade**:
- Visualização rápida de métricas
- Acesso rápido às sessões do dia
- Navegação para outras seções

### 3. Tela de Lista de Pacientes
**Conteúdo**:
- Barra de busca no topo
- Lista de pacientes com:
  - Nome do paciente
  - Idade
  - Última sessão
  - Status do tratamento (ativo/pausado/concluído)
- Botão flutuante "+" para adicionar novo paciente
- Filtros (todos/ativos/pausados/concluídos)

**Funcionalidade**:
- Busca por nome
- Filtros de status
- Navegação para perfil do paciente
- Adicionar novo paciente

### 4. Tela de Cadastro/Edição de Paciente
**Conteúdo**:
- Formulário com campos:
  - Nome completo
  - Data de nascimento
  - CPF
  - Telefone
  - Email
  - Endereço
  - Diagnóstico principal
  - Observações médicas
- Botões "Salvar" e "Cancelar"

**Funcionalidade**:
- Validação de campos obrigatórios
- Salvar dados no banco
- Editar dados existentes

### 5. Tela de Perfil do Paciente
**Conteúdo**:
- Header com foto/iniciais, nome e idade
- Tabs:
  - **Informações**: Dados cadastrais
  - **Plano Terapêutico**: Plano atual
  - **Histórico**: Lista de sessões realizadas
  - **Relatórios**: Acesso a relatórios em PDF
- Botão "Editar Paciente"
- Botão "Nova Sessão"

**Funcionalidade**:
- Visualização completa dos dados
- Navegação entre abas
- Acesso rápido a ações

### 6. Tela de Plano Terapêutico
**Conteúdo**:
- Informações do plano:
  - Objetivo terapêutico
  - Região(ões) alvo(s)
  - Pontos específicos de estimulação
  - Frequência (sessões por semana)
  - Duração total do tratamento
  - Observações
- Visualização do capacete com pontos marcados
- Botões "Editar Plano" e "Iniciar Sessão"

**Funcionalidade**:
- Criar/editar plano terapêutico
- Selecionar regiões e pontos no capacete
- Definir protocolo de tratamento

### 7. Tela de Seleção de Pontos no Capacete
**Conteúdo**:
- Visualização 3D/2D do capacete com todas as regiões coloridas:
  - Rosa/Magenta: Frontal Anterior (Fp)
  - Laranja: Frontal Média (AF)
  - Amarelo: Frontal Central (F)
  - Ciano: Central/Sensório-Motora (C/FC/CP)
  - Verde: Temporal (T)
  - Roxo: Parietal (P)
  - Roxo Claro: Parieto-Occipital (PO)
  - Salmão: Occipital (O)
  - Cinza: Cerebelar
- Lista de pontos disponíveis por região
- Checkbox para selecionar pontos
- Informações sobre cada ponto (função, aplicações clínicas)
- Botão "Confirmar Seleção"

**Funcionalidade**:
- Seleção múltipla de pontos
- Visualização interativa do capacete
- Informações contextuais sobre cada região/ponto

### 8. Tela de Registro de Sessão
**Conteúdo**:
- Header com nome do paciente
- Visualização do capacete com pontos do plano marcados
- Campos:
  - Data e hora da sessão
  - Duração da sessão
  - Pontos estimulados (pré-preenchido do plano)
  - Intensidade aplicada
  - Observações da sessão
  - Reações do paciente
  - Próxima sessão agendada
- Botões "Salvar Sessão" e "Cancelar"

**Funcionalidade**:
- Registrar sessão realizada
- Modificar pontos se necessário
- Agendar próxima sessão
- Adicionar observações

### 9. Tela de Histórico de Sessões
**Conteúdo**:
- Lista cronológica de sessões com:
  - Data e hora
  - Duração
  - Pontos estimulados
  - Observações resumidas
- Filtros por período (última semana/mês/todos)
- Cada item expansível para ver detalhes completos
- Botão "Gerar Relatório"

**Funcionalidade**:
- Visualizar histórico completo
- Expandir/colapsar detalhes
- Filtrar por período
- Gerar relatório em PDF

### 10. Tela de Relatórios
**Conteúdo**:
- Opções de relatório:
  - Relatório individual do paciente
  - Relatório de progresso
  - Relatório de sessões por período
- Seleção de período (data início/fim)
- Preview do relatório
- Botões "Gerar PDF" e "Compartilhar"

**Funcionalidade**:
- Gerar relatórios personalizados
- Exportar em PDF
- Compartilhar via email/WhatsApp

### 11. Tela de Configurações/Perfil do Profissional
**Conteúdo**:
- Foto e nome do profissional
- Informações profissionais:
  - Nome completo
  - Especialidade
  - Registro profissional (CRM/CREFONO)
  - Email
  - Telefone
- Configurações do app:
  - Tema (claro/escuro/automático)
  - Notificações
  - Idioma
- Botão "Sair"

**Funcionalidade**:
- Editar perfil profissional
- Ajustar configurações
- Logout

## Fluxos Principais de Usuário

### Fluxo 1: Adicionar Novo Paciente e Criar Plano
1. Usuário toca no botão "+" na tela principal ou lista de pacientes
2. Preenche formulário de cadastro
3. Salva paciente
4. Sistema redireciona para perfil do paciente
5. Usuário toca em "Criar Plano Terapêutico"
6. Seleciona objetivo terapêutico
7. Toca em "Selecionar Pontos no Capacete"
8. Visualiza capacete e seleciona regiões/pontos
9. Confirma seleção
10. Define frequência e duração do tratamento
11. Salva plano terapêutico

### Fluxo 2: Registrar Sessão de Tratamento
1. Usuário acessa perfil do paciente
2. Toca em "Nova Sessão" ou "Iniciar Sessão"
3. Sistema carrega plano terapêutico atual
4. Usuário visualiza capacete com pontos marcados
5. Preenche dados da sessão (duração, intensidade, observações)
6. Salva sessão
7. Sistema atualiza histórico e estatísticas

### Fluxo 3: Gerar Relatório
1. Usuário acessa perfil do paciente
2. Navega para aba "Relatórios"
3. Seleciona tipo de relatório
4. Define período (se aplicável)
5. Visualiza preview
6. Toca em "Gerar PDF"
7. Sistema gera PDF com:
   - Dados do paciente
   - Dados do profissional
   - Plano terapêutico
   - Histórico de sessões
   - Gráficos de progresso
8. Usuário compartilha ou salva PDF

## Componentes Visuais Específicos

### Componente: Visualização do Capacete
- Representação 2D do capacete em vista superior
- Círculos/pontos coloridos representando cada região
- Pontos selecionados destacados com borda mais grossa
- Legenda de cores ao lado
- Interativo: toque em região mostra informações
- Zoom e pan para facilitar visualização

### Componente: Card de Paciente
- Layout horizontal com:
  - Avatar/iniciais à esquerda
  - Nome e idade no centro
  - Status (badge colorido) à direita
- Última sessão em texto menor abaixo do nome
- Toque no card abre perfil do paciente

### Componente: Card de Sessão
- Data e hora no topo
- Duração e pontos estimulados
- Observações resumidas (2 linhas)
- Ícone de expansão para ver detalhes completos

### Componente: Estatísticas (Dashboard)
- Cards com ícone, número grande e label
- Animação sutil ao carregar
- Cores diferenciadas por tipo de métrica

## Navegação

### Estrutura de Tabs (Bottom Navigation)
1. **Home** (ícone: casa) - Dashboard
2. **Pacientes** (ícone: pessoas) - Lista de pacientes
3. **Sessões** (ícone: calendário) - Agenda de sessões
4. **Perfil** (ícone: usuário) - Configurações e perfil do profissional

## Considerações de UX

1. **Feedback Visual**: Sempre fornecer feedback imediato ao usuário (loading, sucesso, erro)
2. **Confirmações**: Solicitar confirmação antes de ações destrutivas (excluir paciente, cancelar sessão)
3. **Validação**: Validar campos em tempo real com mensagens claras
4. **Acessibilidade**: Tamanhos de fonte ajustáveis, contraste adequado, suporte a leitores de tela
5. **Performance**: Listas virtualizadas para grandes quantidades de dados
6. **Offline**: Permitir visualização de dados mesmo sem conexão (sincronizar quando online)
7. **Segurança**: Dados sensíveis criptografados, logout automático após inatividade

## Assinatura do Aplicativo
- Desenvolvido por: Carlos Charone
- CREFONO: 9-10025-5
- Informações exibidas em: Tela de login, relatórios PDF, tela "Sobre"
