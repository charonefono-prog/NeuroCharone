# TODO - Aplicativo de Mapeamento de Neuromodulação

## Estrutura de Dados e Backend
- [x] Criar schema do banco de dados para usuários (profissionais)
- [x] Criar schema do banco de dados para pacientes
- [x] Criar schema do banco de dados para planos terapêuticos
- [x] Criar schema do banco de dados para sessões de tratamento
- [x] Criar schema para regiões e pontos do capacete
- [x] Implementar APIs tRPC para autenticação
- [x] Implementar APIs tRPC para CRUD de pacientes
- [ ] Implementar APIs tRPC para CRUD de planos terapêuticos
- [ ] Implementar APIs tRPC para CRUD de sessões

## Autenticação
- [ ] Implementar tela de login
- [ ] Implementar tela de cadastro de usuário
- [ ] Implementar tela de recuperação de senha
- [ ] Integrar autenticação com backend
- [ ] Implementar proteção de rotas autenticadas

## Dashboard/Home
- [x] Criar tela de dashboard com estatísticas
- [x] Implementar cards de métricas (total pacientes, sessões hoje, etc)
- [ ] Implementar lista de sessões agendadas para hoje
- [x] Adicionar botão flutuante para novo paciente

## Gerenciamento de Pacientes
- [x] Criar tela de lista de pacientes
- [x] Implementar busca de pacientes por nome
- [x] Implementar filtros de status (ativo/pausado/concluído)
- [ ] Criar tela de cadastro de novo paciente
- [ ] Criar tela de edição de paciente
- [ ] Implementar validação de formulário de paciente
- [ ] Criar tela de perfil do paciente com tabs
- [ ] Implementar funcionalidade de excluir paciente

## Plano Terapêutico
- [ ] Criar estrutura de dados dos pontos do capacete (baseado no manual)
- [ ] Criar tela de visualização do plano terapêutico
- [ ] Criar tela de criação/edição de plano terapêutico
- [ ] Implementar seleção de objetivo terapêutico
- [ ] Implementar seleção de frequência e duração do tratamento
- [ ] Criar componente de visualização do capacete 2D
- [ ] Implementar seleção de regiões e pontos no capacete
- [ ] Adicionar informações contextuais sobre cada região/ponto
- [ ] Implementar legenda de cores das regiões

## Registro de Sessões
- [ ] Criar tela de registro de nova sessão
- [ ] Pré-preencher pontos do plano terapêutico atual
- [ ] Implementar campos de duração, intensidade e observações
- [ ] Permitir modificação de pontos durante a sessão
- [ ] Implementar agendamento da próxima sessão
- [ ] Salvar sessão no banco de dados
- [ ] Criar tela de histórico de sessões
- [ ] Implementar filtros por período no histórico
- [ ] Implementar visualização expandida de detalhes da sessão

## Relatórios
- [ ] Criar tela de seleção de tipo de relatório
- [ ] Implementar seleção de período para relatórios
- [ ] Criar template de relatório individual do paciente
- [ ] Criar template de relatório de progresso
- [ ] Criar template de relatório de sessões por período
- [ ] Implementar geração de PDF dos relatórios
- [ ] Adicionar dados do profissional nos relatórios (Carlos Charone - CREFONO 9-10025-5)
- [ ] Implementar funcionalidade de compartilhamento de PDF

## Configurações e Perfil
- [x] Criar tela de perfil do profissional
- [ ] Implementar edição de dados profissionais
- [ ] Implementar seleção de tema (claro/escuro/automático)
- [ ] Implementar configurações de notificações
- [x] Implementar funcionalidade de logout
- [x] Criar tela "Sobre" com informações do desenvolvedor

## Navegação
- [x] Configurar bottom tabs (Home, Pacientes, Sessões, Perfil)
- [x] Adicionar ícones aos tabs
- [x] Implementar navegação entre telas
- [x] Implementar proteção de rotas

## UI/UX
- [x] Configurar paleta de cores personalizada
- [ ] Criar componentes reutilizáveis (cards, botões, inputs)
- [x] Implementar feedback visual (loading, sucesso, erro)
- [ ] Adicionar animações sutis de transição
- [ ] Implementar confirmações para ações destrutivas
- [x] Garantir responsividade para diferentes tamanhos de tela
- [x] Implementar suporte a modo escuro
## Branding
- [x] Gerar logo personalizado do aplicativo
- [x] Atualizar app.config.ts com nome e informações do app
- [x] Configurar splash screen
- [x] Configurar favicondo aplicativo

## Testes e Refinamentos
- [ ] Testar fluxo completo de cadastro de paciente
- [ ] Testar fluxo completo de criação de plano terapêutico
- [ ] Testar fluxo completo de registro de sessão
- [ ] Testar geração de relatórios PDF
- [ ] Verificar validações de formulários
- [ ] Testar autenticação e proteção de rotas
- [ ] Verificar performance com dados de teste
- [ ] Corrigir bugs identificados

## Documentação
- [ ] Criar README.md com instruções de uso
- [ ] Documentar estrutura de dados
- [ ] Documentar APIs disponíveis

## Correções Urgentes
- [x] Corrigir problema de autenticação - botão de login não funciona
- [x] Implementar tela de login funcional ou remover proteção de autenticação para testes

## Correções de Texto
- [x] Corrigir todas as referências de CREFITO para CREFONO

## Simplificação do Aplicativo
- [x] Remover sistema de autenticação OAuth
- [x] Converter para aplicativo local sem login
- [x] Implementar AsyncStorage para dados locais
- [x] Criar funcionalidades básicas de CRUD de pacientes
- [x] Adicionar dados de exemplo para demonstração

## Formulário de Cadastro de Pacientes
- [x] Criar componente de modal de cadastro
- [x] Adicionar campos: nome, data de nascimento, telefone, diagnóstico
- [x] Implementar validação de campos obrigatórios
- [x] Integrar com AsyncStorage para salvar paciente
- [x] Adicionar botão flutuante "+" na tela de pacientes
- [x] Atualizar lista após cadastro

## Tela de Detalhes do Paciente
- [x] Criar tela de detalhes com navegação
- [x] Implementar sistema de abas (informações, plano, histórico)
- [x] Aba de informações pessoais completas
- [x] Aba de plano terapêutico ativo
- [x] Aba de histórico de sessões
- [x] Adicionar navegação ao tocar no paciente

## Formulário de Registro de Sessões
- [x] Criar modal de registro de sessão
- [x] Implementar seleção interativa de pontos do capacete
- [x] Adicionar campos: duração, intensidade, observações
- [x] Integrar com AsyncStorage para salvar sessão
- [x] Atualizar histórico após registro

## Problemas Reportados pelo Usuário
- [x] Corrigir navegação - não consegue abrir detalhes do paciente
- [x] Criar formulário de cadastro de plano terapêutico
- [x] Implementar visualização 3D do capacete com marcação interativa
- [x] Integrar visualização do capacete no formulário de sessão
- [x] Adicionar imagem do capacete nas áreas de seleção

## Novas Funcionalidades Solicitadas
- [x] Criar modal de edição de pacientes
- [x] Adicionar botão de editar na tela de detalhes do paciente
- [x] Implementar gráficos de evolução do tratamento
- [x] Adicionar visualização gráfica na aba de histórico
- [x] Implementar exportação de relatórios em HTML
- [x] Adicionar botão de compartilhar relatório

## Informações das Regiões Cerebrais
- [x] Adicionar descrições detalhadas de cada região cerebral
- [x] Criar modal informativo ao tocar em região/ponto
- [x] Incluir funções e indicações terapêuticas de cada área

## Sistema de Pesquisa Avançada
- [x] Criar componente de modal de filtros avançados
- [x] Implementar filtro por diagnóstico
- [x] Implementar filtro por período de tratamento (data início/fim)
- [x] Implementar filtro por regiões cerebrais estimuladas
- [x] Implementar filtro por status do paciente
- [x] Adicionar combinação de múltiplos filtros
- [x] Integrar filtros na tela de pacientes
- [x] Adicionar indicador visual de filtros ativos
- [x] Implementar botão de limpar todos os filtros

## Correções de Campos e Unidades
- [x] Alterar campo "Intensidade" para "Joules" em todos os formulários
- [x] Adicionar campo "Minutos" para duração da aplicação
- [x] Atualizar formulário de sessão com Joules e Minutos
- [x] Atualizar formulário de plano terapêutico com Joules e Minutos
- [x] Adicionar função específica de cada ponto do capacete (baseado no manual)
- [x] Exibir função do ponto ao clicar no capacete
- [x] Atualizar visualização de sessões com Joules e Minutos

## Alteração de Nome do Aplicativo
- [x] Alterar nome de "NeuroMap" para "NeuroLaserMap" no app.config.ts
- [x] Atualizar nome em todas as telas e componentes
- [x] Atualizar documentação (design.md, README, etc)

## Modal de Informação dos Pontos
- [x] Integrar PointInfoModal no helmet-3d-selector
- [x] Adicionar toque longo nos pontos para exibir informações
- [x] Implementar animação de abertura do modal
- [x] Testar modal em todos os pontos do capacete

## Relatórios em PDF Nativos
- [ ] Instalar biblioteca de geração de PDF (react-native-pdf ou similar)
- [ ] Criar template de PDF profissional
- [ ] Adicionar gráficos ao PDF
- [ ] Implementar exportação e compartilhamento de PDF
- [ ] Substituir exportação HTML por PDF

## Sistema de Backup Automático
- [x] Criar função de exportação de dados em JSON
- [x] Implementar agendamento de backup semanal
- [x] Adicionar opção manual de backup/restauração
- [x] Implementar compartilhamento de arquivo de backup
- [x] Adicionar importação de dados do backup

## Modo Escuro/Claro Manual
- [x] Criar contexto de tema com estado persistente
- [x] Adicionar botão de alternância na tela de perfil
- [x] Implementar animação de transição entre temas
- [x] Testar alternância em todas as telas

## Relatórios Estatísticos Avançados
- [x] Criar componente de gráfico de distribuição de diagnósticos
- [x] Criar componente de gráfico de regiões mais estimuladas
- [x] Criar componente de gráfico de taxa de adesão ao tratamento
- [x] Adicionar seção de estatísticas no dashboard
- [x] Implementar filtros de período para estatísticas

## Sistema de Lembretes de Sessões
- [x] Configurar permissões de notificações
- [x] Criar função de agendamento de lembretes
- [x] Adicionar opção de configurar antecedência do lembrete
- [x] Implementar notificação push para sessões
- [x] Adicionar gerenciamento de lembretes na tela de sessões

## Exportação de Dados em Excel/CSV
- [x] Criar função de exportação de pacientes em CSV
- [x] Criar função de exportação de sessões em CSV
- [x] Criar função de exportação de estatísticas em CSV
- [x] Adicionar botão de exportar na tela de pacientes
- [x] Adicionar botão de exportar na tela de sessões
- [x] Adicionar botão de exportar nas estatísticas avançadas
- [x] Implementar compartilhamento do arquivo CSV

## Histórico de Alterações (Auditoria)
- [x] Criar schema de histórico de alterações
- [x] Implementar função de registro de alterações
- [x] Adicionar histórico ao criar paciente
- [x] Adicionar histórico ao editar paciente
- [x] Adicionar histórico ao excluir paciente
- [x] Adicionar histórico ao criar plano terapêutico
- [x] Adicionar histórico ao criar sessão
- [x] Criar componente de visualização de histórico
- [x] Integrar visualização de histórico na tela de detalhes do paciente

## Templates de Planos Terapêuticos Personalizáveis
- [x] Criar schema de templates de planos no AsyncStorage
- [x] Criar tela de gerenciamento de templates
- [x] Implementar CRUD de templates (criar, editar, excluir)
- [x] Adicionar campos: nome do template, objetivo, regiões alvo, pontos alvo, frequência, duração
- [x] Criar modal de seleção de template ao criar novo plano
- [x] Implementar aplicação de template no formulário de plano
- [x] Inicializar templates padrão (Depressão, Ansiedade, Dor Crônica, Insônia, TDAH)
- [ ] Adicionar opção de salvar plano atual como template
- [ ] Integrar templates na tela de perfil ou configurações

## Geração de PDF Nativo
- [x] Instalar biblioteca react-native-pdf-lib ou similar
- [x] Criar função de geração de PDF para relatório de paciente
- [x] Adicionar cabeçalho com logo e informações profissionais
- [x] Incluir dados do paciente no PDF
- [x] Incluir estatísticas do tratamento no PDF
- [x] Incluir histórico de sessões no PDF
- [x] Adicionar rodapé com assinatura do profissional
- [x] Implementar compartilhamento do PDF gerado
- [x] Substituir exportação HTML por PDF na tela de detalhes

## Sistema de Avaliação de Progresso
- [x] Adicionar campo de avaliação de sintomas inicial no schema de paciente
- [x] Adicionar campo de avaliação de progresso no formulário de sessão
- [x] Criar escala de avaliação (0-10)
- [x] Implementar gráfico de evolução de sintomas ao longo do tempo
- [x] Adicionar comparação antes/depois do tratamento
- [x] Criar indicadores de melhora/piora/estagnação
- [x] Integrar gráficos de progresso na tela de detalhes do paciente
- [x] Adicionar campo de avaliação inicial no formulário de cadastro de paciente
- [ ] Adicionar análise de efetividade por região cerebral estimulada
- [ ] Adicionar relatório de efetividade nas estatísticas avançadas

## Tela de Gerenciamento de Templates
- [x] Criar tela de gerenciamento de templates no perfil
- [x] Listar todos os templates (padrão e personalizados)
- [x] Implementar formulário de criação de novo template
- [x] Implementar formulário de edição de template existente
- [x] Implementar exclusão de template com confirmação
- [x] Adicionar indicador visual para templates padrão (não editáveis)
- [x] Adicionar navegação para tela de templates no menu de perfil

## Campo de Avaliação Inicial no Cadastro
- [x] Adicionar campo de avaliação inicial (0-10) no formulário de cadastro
- [x] Adicionar campo de avaliação inicial no formulário de edição
- [x] Implementar validação (apenas 0-10)
- [x] Adicionar explicação da escala no formulário
- [ ] Atualizar dados de exemplo com avaliação inicial

## Análise de Efetividade por Região
- [x] Criar componente de análise de efetividade
- [x] Calcular correlação entre regiões estimuladas e melhora de sintomas
- [x] Criar visualização gráfica da efetividade por região
- [x] Adicionar ranking de regiões mais efetivas
- [x] Integrar análise nas estatísticas avançadas
- [ ] Adicionar filtro por diagnóstico na análise

## Exportação Excel/CSV
- [x] Instalar biblioteca para geração de Excel (xlsx)
- [x] Criar função de exportação de lista de pacientes
- [x] Criar função de exportação de sessões
- [x] Criar função de exportação de estatísticas
- [x] Adicionar botão de exportação na tela inicial
- [ ] Adicionar botão de exportação na lista de pacientes
- [ ] Adicionar botão de exportação nas estatísticas avançadas
- [x] Implementar compartilhamento do arquivo gerado

## Gráficos de Evolução Individual
- [x] Criar componente de gráfico de linha para evolução de sintomas
- [x] Integrar gráfico na tela de detalhes do paciente
- [x] Adicionar eixo X com datas das sessões
- [x] Adicionar eixo Y com scores de sintomas (0-10)
- [x] Adicionar linha de baseline (avaliação inicial)
- [x] Adicionar indicadores visuais de melhora/piora
- [x] Adicionar cálculo de melhora percentual

## Sistema de Notificações de Lembretes
- [x] Verificar se notificações já estão configuradas
- [x] Criar função de agendamento de notificação para sessão
- [x] Criar função de cancelamento de notificação
- [x] Adicionar configuração de antecedência no perfil
- [ ] Adicionar campo de data/hora agendada no formulário de sessão
- [ ] Integrar agendamento ao criar sessão futura
- [x] Integrar cancelamento ao excluir sessão

## Agendamento de Sessões Futuras
- [x] Adicionar campo de data/hora no formulário de criação de sessão
- [x] Adicionar seletor de data e hora (DateTimePicker)
- [x] Validar que data agendada é futura
- [x] Atualizar schema de Session para incluir campo de agendamento
- [x] Integrar agendamento de notificação ao criar sessão futura
- [ ] Integrar cancelamento de notificação ao excluir sessão
- [x] Adicionar visualização de sessões agendadas na tela inicial
- [x] Adicionar filtro de sessões passadas/futuras no histórico

## Relatório Comparativo de Efetividade
- [x] Criar componente de relatório comparativo
- [x] Calcular tempo médio de tratamento por diagnóstico
- [x] Calcular taxa de melhora média por diagnóstico
- [x] Calcular número de sessões médio por diagnóstico
- [x] Criar visualização em tabela comparativa
- [x] Adicionar insights automáticos
- [x] Integrar relatório nas estatísticas avançadas
- [x] Adicionar filtro por período de tempo

## Backup Automático em Nuvem
- [ ] Criar endpoints no servidor para sincronização
- [ ] Implementar upload de dados para servidor
- [ ] Implementar download de dados do servidor
- [ ] Adicionar detecção de conflitos de sincronização
- [ ] Criar interface de configuração de backup
- [ ] Adicionar indicador de status de sincronização
- [ ] Implementar sincronização automática em intervalos
- [ ] Adicionar opção de sincronização manual

## Upload de Fotos e V\u00eddeos no Registro do Paciente
- [x] Instalar expo-image-picker
- [x] Adicionar campo de m\u00eddia no schema de Patient
- [x] Criar componente de seletor de fotos/v\u00eddeos
- [x] Criar componente de galeria de m\u00eddia
- [x] Adicionar visualiza\u00e7\u00e3o de fotos em tela cheia
- [x] Adicionar reprodutor de v\u00eddeo
- [x] Integrar galeria na tela de detalhes do paciente
- [x] Adicionar op\u00e7\u00e3o de excluir m\u00eddia
- [x] Adicionar data de captura para cada m\u00eddia
- [ ] Adicionar legendas/descri\u00e7\u00f5es edit\u00e1veis para cada m\u00eddia
## Correção de Botões de Informação no Capacete 3D
- [x] Investigar por que botões de informação não estão acionando
- [x] Corrigir handlers de clique nos botões de informação
- [x] Testar funcionamento dos botões em todos os pontos

## Correção de Botões de Informação nos Pontos Individuais
- [x] Investigar por que botões de informação nos pontos individuais não estão acionando
- [x] Separar botão de informação do botão de seleção
- [x] Adicionar botão circular de informação ao lado de cada ponto
- [x] Adicionar mapeamento de ícones faltantes (info.circle, xmark, photo.fill, camera.fill, play.fill)

## Correção de Geração de Relatório PDF
- [x] Investigar onde está o botão de geração de relatório
- [x] Verificar por que a geração não estava funcionando
- [x] Adicionar import faltante de Alert
- [x] Corrigir funcionalidade de geração de PDF

## Correção de Botão de Relatório Não Respondendo
- [x] Verificar se onPress está conectado ao botão
- [x] Verificar erros no console (writeAsStringAsync não funciona na web)
- [x] Adicionar suporte para web com download direto
- [x] Manter suporte mobile com FileSystem e Sharing
- [x] Remover logs de debug

## Visualizador 3D Interativo do Capacete
- [ ] Copiar modelos STL (Front e Back) para assets
- [ ] Instalar Three.js e bibliotecas de renderização 3D
- [ ] Criar componente visualizador 3D com rotação
- [ ] Implementar clique em pontos específicos
- [ ] Adicionar áreas anatômicas (Broca, Wernicke, Linguagem, Motora)
- [ ] Integrar com sistema 10-20
- [ ] Sincronizar clique com informações no capacete
- [ ] Remover imagem lateral e deixar apenas capacete 3D
- [ ] Testar em web e mobile

## Melhorias do Visualizador 3D
- [x] Sincronização bidirecional entre capacete 3D e 2D
- [x] Modo de comparação com visualização transparente
- [x] Captura de screenshot da visualização 3D
- [x] Integração de screenshot nos relatórios PDF
- [x] Modo de rotação automática do capacete 3D
- [x] Zoom e pan do capacete 3D (mouse wheel e drag)
- [x] Exibição de coordenadas 10-20 no capacete 3D


## Simplificar Visualização do Capacete no Plano Terapêutico
- [x] Remover seletor de visualização (Vista Superior/Lateral)
- [x] Deixar apenas imagem frontal do capacete
- [x] Adicionar botão "Visualizar em 3D" para acessar visualizador 3D
- [x] Simplificar interface do componente Helmet3DSelector

## Melhorias Prioritárias do Visualizador 3D - PRÓXIMAS
- [ ] Adicionar labels de coordenadas 10-20 ao capacete 3D
  - [ ] Implementar texto 3D usando Three.js TextGeometry
  - [ ] Posicionar labels próximos aos pontos do capacete
  - [ ] Fazer labels visíveis em diferentes ângulos de rotação
  - [ ] Adicionar opção de mostrar/ocultar labels
- [ ] Melhorar raycasting para dispositivos móveis
  - [ ] Aumentar raio de detecção dos pontos clicáveis
  - [ ] Implementar feedback visual ao passar sobre ponto
  - [ ] Testar em dispositivos móveis reais
- [ ] Integrar screenshots 3D nos relatórios PDF
  - [ ] Adicionar função de captura de canvas 3D
  - [ ] Integrar screenshot nos relatórios PDF
  - [ ] Adicionar legenda "Visualização 3D do Capacete"

## Implementação de Texto 3D no Capacete
- [x] Adicionar texto 3D com coordenadas 10-20 ao capacete 3D
  - [x] Criar função para gerar texto 3D para cada ponto usando Canvas Sprites
  - [x] Posicionar labels próximos aos pontos do capacete
  - [x] Fazer labels visíveis em diferentes ângulos de rotação
  - [x] Adicionar toggle para mostrar/ocultar labels (botão 🏷️)
  - [x] Testar em web


## Remoção do Visualizador 3D e Adição de Novos Templates
- [ ] Remover visualizador 3D do aplicativo
  - [ ] Remover rota /helmet-3d
  - [ ] Remover botão "Visualizar em 3D" do Helmet3DSelector
  - [ ] Remover componentes relacionados ao 3D
- [ ] Adicionar 6 novos templates de planos terapêuticos
  - [ ] Template: Afasia
  - [ ] Template: Seletividade alimentar
  - [ ] Template: Disfagia
  - [ ] Template: Zumbido
  - [ ] Template: Linguagem oral
  - [ ] Template: Linguagem social


## Correção de Campo de Duração
- [x] Corrigir texto "Duração (minutos)" com erro Unicode
  - [x] Localizar campo com caracteres corrompidos
  - [x] Corrigir para exibir corretamente
  - [x] Validar compilação

## Remoção de Botão "Visualizar em 3D"
- [x] Remover botão "Visualizar em 3D" da interface de seleção de pontos
  - [x] Localizar botão no componente helmet-3d-selector.tsx
  - [x] Remover código do botão
  - [x] Validar compilação

## Melhorias Prioritárias - Nova Sessão
- [x] Melhorar raycasting para dispositivos móveis
  - [x] Aumentar raio de detecção dos pontos clicáveis (hit detection)
  - [x] Implementar feedback visual ao passar sobre ponto (hover effect)
  - [x] Adicionar haptic feedback ao selecionar ponto
  - [x] Testar em web
- [x] Implementar sistema de busca nos planos terapêuticos
  - [x] Criar componente de busca com campo de texto (PlanSearchModal)
  - [x] Implementar filtro por keywords (afasia, Broca, linguagem, etc.)
  - [x] Filtrar por objetivo do tratamento
  - [x] Filtrar por regiões cerebrais
  - [x] Integrar busca na tela de seleção de templates
  - [x] Criar 17 testes unitários (todos passando)


## Integração de Protocolos Prontos e Melhorias - NOVA SESSÃO
- [x] Criar 12 protocolos prontos baseados no manual
  - [x] Protocolo Afasia de Broca
  - [x] Protocolo Ataxia Cerebelar
  - [x] Protocolo Zumbido (Tinnitus)
  - [x] Protocolo Apraxia de Fala
  - [x] Protocolo Disartria
  - [x] Protocolo Seletividade Alimentar
  - [x] Protocolo Parkinson
  - [x] Protocolo Alzheimer Precoce
  - [x] Protocolo TEA
  - [x] Protocolo Linguagem Social
  - [x] Protocolo VPPB
  - [x] Protocolo Depressão Resistente
- [x] Integrar protocolos prontos no sistema de templates
- [x] Criar sistema de busca com palavras-chave do manual
- [x] Adicionar botão "Novo Plano" na tela principal
- [x] Criar 27 testes unitários (todos passando)
- [x] Validar compilação TypeScript


## Correções Críticas - Sessão Atual
- [x] Corrigir abas não clicáveis na tela de pacientes
- [x] Implementar funcionalidade de desativar/reativar pacientes
- [x] Implementar funcionalidade de excluir pacientes
- [x] Adicionar animação de piscada contínua ao clicar em ponto do capacete

## Melhorias Prioritárias - Sessão 3

### 1. Filtro Visual por Cor de Região
- [ ] Criar componente de toggle para filtrar regiões
- [ ] Implementar destaque visual de região selecionada
- [ ] Integrar no visualizador de capacete
- [ ] Adicionar opção "Todas as cores" como padrão

### 2. Relatório PDF com Visualização do Capacete
- [ ] Implementar captura de canvas do capacete
- [ ] Adicionar imagem do capacete aos PDFs
- [ ] Incluir legenda com pontos selecionados
- [ ] Testar em diferentes navegadores

### 3. Histórico de Buscas Recentes
- [ ] Criar storage para guardar buscas (AsyncStorage)
- [ ] Implementar UI para mostrar últimas 5 buscas
- [ ] Adicionar botão para limpar histórico
- [ ] Integrar no modal de busca de protocolos
