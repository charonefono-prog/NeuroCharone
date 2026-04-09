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

## Alerta Visual com Relação Bidirecional - Nova Sessão
- [x] Implementar estado compartilhado para ponto selecionado
- [x] Criar animações de destaque (borda colorida, escala, mudança de fundo)
- [x] Integrar alerta visual no helmet-3d-selector (capacete)
- [x] Integrar alerta visual na seção de pontos individuais
- [x] Testar funcionamento em web e mobile
- [x] Validar compilação TypeScript


## Formatação de Interface - Nova Sessão
- [x] Formatar título "Pacientes" com melhor tipografia
- [x] Alterar "CREFONO" para "CRFa 9 - 10025-5" no aplicativo


## Correção de Erro ao Gerar Relatório - Nova Sessão
- [x] Remover nome "Carlos Charone" do relatório (privacidade)
- [x] Alterar "CREFONO" para "CRFa 9 - 10025-5" no relatório
- [x] Mudar extensão de .html para .htm para evitar conflitos
- [x] Melhorar tratamento de erros na geração de relatório


## Revisão de Tipografia - Nova Sessão
- [x] Criar padrão de tipografia consistente
- [x] Revisar e ajustar fontes em telas principais
- [x] Revisar e ajustar fontes em componentes
- [x] Testar e validar mudanças


## Correção de Erro no Histórico de Atendimentos - Nova Sessão
- [x] Corrigir erro de componente com nome em minúscula
- [x] Adicionar resumo do plano terapêutico na página de histórico
- [x] Exibir informações do plano criado inicialmente
- [x] Testar renderização da página


## Correção de Cálculo de Melhora - Nova Sessão
- [x] Corrigir percentagem de melhora quando score inicial é zero
- [x] Implementar fórmula que lida com divisão por zero
- [x] Testar com diferentes valores de score
- [x] Validar renderização da percentagem corrigida


## Gráfico de Evolução de Sintomas - Nova Sessão
- [x] Criar componente de gráfico em linha
- [x] Integrar gráfico na aba Antes/Depois
- [x] Estilizar com cores da marca
- [x] Testar com dados de múltiplas sessões


## Tooltip Interativo no Gráfico - Nova Sessão
- [x] Adicionar estado de tooltip e detecção de toque
- [x] Implementar animação do tooltip
- [x] Exibir informações da sessão no tooltip
- [x] Testar interatividade em mobile e web


## Correção de Erro no Upload de Vídeo - Nova Sessão
- [x] Diagnosticar erro ao adicionar upload de vídeo
- [x] Corrigir funcionalidade de upload
- [x] Testar upload em mobile e web


## Remover Suporte a Vídeo - Nova Sessão
- [x] Remover imports de VideoView e useVideoPlayer
- [x] Remover mediaTypes "videos" do ImagePicker
- [x] Remover renderização condicional de vídeo
- [x] Simplificar componente para apenas fotos


## Estabilidade e Manutenção do Servidor
- [x] Validar integridade de todas as dependências
- [x] Criar script de verificação de saúde do servidor
- [x] Implementar monitoramento de performance
- [x] Criar testes automatizados para evitar regressões
- [x] Documentar troubleshooting de problemas comuns
- [ ] Criar checkpoint estável antes da publicação


## Escalas Clínicas - Novas Funcionalidades
- [x] Remover botão de compartilhamento do perfil
- [x] Remover exportação em PDF do perfil (temporariamente)
- [x] Corrigir erros de exportação de relatório
- [x] Criar estrutura de dados para escalas clínicas
- [x] Implementar Escala do Comer (Dysphagia Outcome and Severity Scale)
- [x] Implementar Escala Breve de Zumbido (Brief Tinnitus Severity Scale)
- [x] Implementar Escala de Boston (Boston Diagnostic Aphasia Examination)
- [x] Implementar Communication Matrix
- [x] Implementar Escala SARA (Scale for Assessment and Rating of Ataxia)
- [x] Implementar Questionário de Comunicação Social (QCS)
- [x] Criar sistema de cálculos automáticos para escalas
- [x] Implementar visualização de gráficos de evolução
- [x] Criar tela de escalas clínicas com seleção de paciente
- [x] Implementar armazenamento de múltiplas aplicações da mesma escala
- [x] Criar gráficos comparativos de evolução
- [x] Implementar exportação em PDF com escalas e gráficos
- [x] Testar todas as escalas e cálculos

## Novas Escalas Clínicas - Lote 2
- [x] Implementar PDQ-39 (Parkinson's Disease Questionnaire)
- [x] Implementar FOIS (Functional Oral Intake Scale)
- [x] Implementar DSFS (Drooling Severity and Frequency Scale)
- [x] Implementar Escala GRBASI
- [x] Implementar EAT-10 (Eating Assessment Tool-10)
- [x] Implementar STOP-Bang
- [x] Implementar Escala de House-Brackmann (H-B)
- [x] Implementar PHQ-9 (Patient Health Questionnaire-9)
- [x] Implementar MDQ (Mood Disorder Questionnaire)
- [x] Implementar SNAP-IV
- [x] Implementar A-MISO-S (Amsterdam Misophonia Scale)
- [x] Testar todas as novas escalas
- [x] Validar cálculos e interpretações
- [x] Corrigir cálculo de porcentagem nas escalas


## Exportacao de Escalas - Novas Funcionalidades
- [x] Adicionar botao de exportar em PDF no resultado da escala
- [x] Adicionar botao de exportar evolucao em PDF na aba de efetividade
- [x] Implementar gerador de PDF para resultado individual
- [x] Implementar gerador de PDF para evolucao completa com graficos
- [x] Testar exportacao de PDF para todas as escalas
- [x] Criar tela de configuracao de profissional (nome, CRM, especialidade)
- [x] Armazenar dados do profissional em AsyncStorage
- [x] Integrar dados do profissional na geracao de PDF
- [x] Implementar compartilhamento de arquivo PDF
- [ ] Testar exportacao e compartilhamento de PDF

## Correccao de Erros - PDF
- [x] Investigar e corrigir erro ao exportar PDF
- [x] Validar funcao exportAndShareScaleResult
- [x] Testar exportacao com dados reais


## Visualizacao de Historico para Pacientes
- [x] Criar tela de login/autenticacao para pacientes
- [x] Implementar visualizacao de historico de escalas do paciente
- [x] Criar graficos de evolucao pessoal
- [ ] Adicionar filtros por data e tipo de escala
- [ ] Implementar compartilhamento de relatorio pessoal


## Atualizacao de Escalas - Lote 3
- [x] Atualizar Escala de House-Brackmann com informacoes detalhadas dos 6 graus
- [x] Adicionar escala MDS-UPDRS (Movement Disorder Society - Unified Parkinson's Disease Rating Scale)
- [x] Testar novas escalas


## Novas Escalas - Lote 4
- [x] Adicionar escala ODDRS (Oppositional Defiant Disorder Rating Scale)


## Próximos Passos - Implementação Completa
- [x] Adicionar escala CONNERS (ADHD Rating Scale)
- [x] Adicionar escala VANDERBILT (ADHD Rating Scale)
- [x] Criar relatório comparativo de comportamento (ODDRS + SNAP-IV)
- [x] Implementar alertas de severidade para escalas críticas
- [x] Testar todas as novas funcionalidades

## Correccao de Bugs - Porcentagem
- [x] Corrigir cálculo de porcentagem para CONNERS e VANDERBILT (mostrando 0%)
- [x] Adicionar imagem do sistema 10-20 EEG em 2D nas telas de Plano Terapêutico e Nova Sessão


## Painel Visual de Admin (Próxima Fase)
- [ ] Criar página web de admin dashboard
- [ ] Implementar interface visual para gerenciar whitelist
- [ ] Adicionar funcionalidade de adicionar usuário
- [ ] Adicionar funcionalidade de aprovar/rejeitar usuário
- [ ] Adicionar funcionalidade de bloquear/desbloquear usuário
- [ ] Adicionar funcionalidade de remover usuário
- [ ] Implementar visualização de log de acessos
- [ ] Implementar estatísticas de acesso
- [ ] Adicionar busca e filtros de usuários
- [ ] Implementar autenticação para admin panel

## Email de Notificação (Próxima Fase)
- [ ] Configurar serviço de email (SendGrid, Nodemailer, etc)
- [ ] Implementar função de envio de email
- [ ] Adicionar email de notificação quando cliente tenta fazer login
- [ ] Adicionar email de confirmação quando usuário é aprovado
- [ ] Adicionar email de rejeição quando usuário é negado
- [ ] Implementar template de email profissional
- [ ] Adicionar configuração de email do admin
- [ ] Testar envio de emails


## Conversão para PWA (Progressive Web App)
- [x] Instalar dependências PWA (workbox, etc)
- [x] Criar service worker para suporte offline
- [x] Configurar manifest.json
- [x] Adicionar ícones PWA
- [x] Implementar cache de dados
- [x] Testar instalação em celular
- [x] Configurar HTTPS
- [x] Testar funcionalidade offline
- [x] Implementar sincronização de dados quando online
- [ ] Adicionar notificações push (opcional)

## Sistema de Autenticação com Email/Senha
- [x] Criar AuthContext para gerenciar estado de login
- [x] Implementar tela de Login (email + senha)
- [x] Implementar tela de Registro (cadastro novo usuário)
- [x] Integrar proteção de rotas (só acessa se logado)
- [x] Implementar validação de email
- [x] Implementar validação de senha (mínimo 6 caracteres)
- [x] Integrar com backend (API de login/registro)
- [x] Testar fluxo completo de autenticação
- [x] Criar testes unitários para autenticação

## Fix Build Travado
- [x] Cancelar builds antigos travados no Expo
- [x] Identificar causa do erro: package-lock.json desatualizado
- [x] Regenerar package-lock.json com versões corretas
- [ ] Salvar checkpoint com alterações pendentes
- [ ] Rebuild Android APK
- [ ] Rebuild iOS

## Correção Build iOS e Checkpoint
- [x] Corrigir erro do iOS build - módulo lightningcss não encontrado no Metro config
- [x] Salvar checkpoint para resolver aviso de "alterações não empacotadas"
- [x] Iniciar novo build iOS após correção

## Correção Manus Publish Docker Build
- [x] Remover lightningcss-darwin-arm64/x64 do optionalDependencies (causa erro no Docker Linux)
- [x] Usar eas.json para instalar lightningcss darwin binaries apenas no EAS Build (via postinstall script)
- [x] Salvar checkpoint para resolver "alterações não empacotadas"

## Bug: Timeline/Histórico não responde ao toque no Android
- [x] Implementar swipe lateral entre abas na tela do paciente (Android)
- [x] Corrigir ScrollView aninhado no EffectivenessDashboard
- [x] Escrever teste end-to-end completo de todas as funções
- [x] Salvar checkpoint

## Atualização Imagem Capacete e Correção Testes
- [x] Atualizar imagem do capacete para nova versão (com cores mais claras)
- [x] Corrigir COLORED_POINTS para bater com 35 pontos da imagem
- [x] Corrigir testes ready-protocols (23 protocolos)
- [x] Corrigir testes manual-validation (35 pontos)
- [x] Corrigir testes helmet-point-functions
- [x] Corrigir testes eeg-image
- [x] Salvar checkpoint

## Bug: Tela do paciente travada no Android - não rola verticalmente
- [x] Corrigir conflito de gestos - GestureDetector do swipe lateral bloqueia scroll vertical
- [x] Testar e salvar checkpoint
- [ ] Compilar novo APK (aguardando)

## Bug: Backend não publica - lightningcss falha no Docker
- [x] Remover lightningcss das dependências principais ou torná-lo opcional para Docker
- [x] Salvar checkpoint e testar publicação

## Fix Android Scroll + Backend Publish (Feb 2026)
- [x] Refatorar gesture handler para não bloquear scroll vertical no Android
- [x] Adicionar detecção de scroll ativo (isScrolling ref)
- [x] Aumentar activeOffsetX para [-40,40] e adicionar minDistance(20)
- [x] Verificar ratio horizontal/vertical antes de trocar aba
- [x] Adicionar nestedScrollEnabled no ScrollView principal
- [x] Criar testes unitários para lógica de gesture vs scroll (14 testes)
- [x] Todos os 384 testes passando
- [x] Salvar checkpoint final
- [ ] Compilar novo APK Android
- [ ] Compilar iOS


## Sessão 15 de Fevereiro - Resumo
- [x] Corrigido scroll/swipe conflict no Android
- [x] Gerado novo keystore Android (SHA1: 98:93:5E:04:35:E3:6F:E2:81:F1:2D:7F:4C:93:11:84:85:A8:E4:3D)
- [x] Exportado certificado PEM para Google Play reset
- [x] Configurados certificados iOS (Distribution + Provisioning Profile)
- [x] APK e IPA compilados com sucesso

## Próximas ações
- [ ] Confirmar aprovação do reset da upload key no Google Play
- [ ] Fornecer Expo Token para build final do AAB
- [ ] Rebuild AAB com nova chave
- [ ] Upload AAB no Google Play Console
- [ ] Criar app no App Store Connect (se publicar iOS)
- [ ] Upload IPA na App Store


## 🔧 CORREÇÃO APLICADA - Bug do Campo de Objetivos (Android)

### Bug Crítico 4: Campo de Objetivos Trava no Android
- [x] Campo de objetivo do ciclo trava ao digitar no Android
- [x] Funcionava apenas no iOS
- [x] Substituído Alert.prompt() por TextInput nativo
- [x] 12 testes passando - validado para Android/iOS
- [x] Suporta múltiplas linhas (3 linhas visíveis)
- [x] returnKeyType="done" + blurOnSubmit para melhor UX
- [x] Funciona com caracteres especiais
- [x] Limpa campo após salvar ciclo

**Mudanças no arquivo:**
- `/home/ubuntu/neuromodulation_mapper/app/(tabs)/cycles.tsx` - Linhas 172-187
- Adicionado `TextInput` ao import de react-native
- Substituído Alert.prompt por TextInput nativo
- Adicionado teste em `__tests__/cycles-textinput.test.ts`


## 🔄 ROTAÇÃO DE TELA IMPLEMENTADA

### Suporte a Orientação Vertical e Horizontal
- [x] Configurado app.config.ts com orientation: "default"
- [x] Criado hook useOrientation para detectar mudanças
- [x] Adaptado layout de ciclos para portrait e landscape
- [x] 16 testes de orientação passando
- [x] 412 testes totais passando (sem quebras)
- [x] Suporta múltiplas resoluções (iPhone, Android)
- [x] Adapta padding, gap, fontes automaticamente

**Arquivos criados/modificados:**
- `hooks/use-orientation.ts` - Hook para detectar orientação
- `app/(tabs)/cycles.tsx` - Layout adaptado para landscape
- `__tests__/orientation.test.ts` - 16 testes de validação
- `app.config.ts` - orientation: "default" (linha 45)

**Como usar em outras telas:**
```tsx
import { useOrientation } from '@/hooks/use-orientation';

export default function MyScreen() {
  const { isPortrait, isLandscape, width, height } = useOrientation();
  
  return (
    <View className={isPortrait ? 'gap-4' : 'gap-2'}>
      {/* Seu conteúdo aqui */}
    </View>
  );
}
```


## 🐛 BUGS CORRIGIDOS - Sessão e Relatório

### Bug 1: Home Não Atualiza Sessão Registrada
- [x] Adicionado useFocusEffect ao arquivo sessions.tsx
- [x] Agora recarrega dados quando volta da tela de criar nova sessão
- [x] Home atualiza automaticamente com novas sessões
- [x] Arquivo: app/(tabs)/sessions.tsx (linhas 5-6, 20-24)

### Bug 2: Relatório Gera Códigos em Vez de PDF
- [x] Alterado tipo MIME de text/plain para text/html
- [x] Arquivo salvo como .html em vez de .htm
- [x] Relatório agora exibe como documento formatado
- [x] Compatível com web e mobile (FileSystem + Sharing)
- [x] Arquivo: lib/pdf-generator-native.ts (linhas 17, 22, 26, 49-51, 56)

**Testes:**
- [x] 412/413 testes passando
- [x] Nenhuma regressão introduzida
- [x] Ambas as correções validadas


## 🔧 CORREÇÃO APLICADA - Travamento de Scroll em Seleções

### Bug: Rolagem de Pacientes Trava ao Selecionar Escala
- [x] Identificado problema com FlatList + scrollEnabled=false em Modals
- [x] Substituído FlatList por ScrollView com nestedScrollEnabled=true em 3 locais
- [x] Corrigido em scales.tsx (modal de escalas)
- [x] Corrigido em scales.tsx (modal de pacientes)
- [x] Corrigido em treatment-timeline.tsx (timeline)
- [x] 412/413 testes passando - sem regressões
- [x] Scroll agora funciona perfeitamente em todas as seleções


## CORREÇÃO DEFINITIVA - Cálculos de Melhora (CRÍTICO)
- [x] Revisar e corrigir TODOS os cálculos de melhora em scale-chart.tsx
- [x] Revisar e corrigir TODOS os cálculos de melhora em comparative-charts.tsx
- [x] Revisar e corrigir TODOS os cálculos de melhora em effectiveness-dashboard.tsx
- [x] Garantir que escalas inversas (18) e diretas (5) calculem melhora corretamente
- [x] Exemplo: EAT-10 de 38→0 deve mostrar 100% de melhora (não 0%)
- [x] Exemplo: Variação de 38→0 deve mostrar +38 de melhora (não -38)
- [x] Remover qualquer exibição de valores negativos
- [x] Escrever testes unitários para validar todos os cálculos (123 testes passando)
- [x] Testar com dados reais e confirmar resultados corretos
- [x] Verificar minuciosamente a direção de CADA escala (direta vs inversa) com base na definição clínica
- [x] Corrigir scale-storage.ts (calculateImprovement e getScaleStatistics com classificação errada)
- [x] Corrigir multi-patient-comparison.tsx
- [x] Corrigir symptom-evolution-line-chart.tsx
- [x] Corrigir symptom-progress-chart.tsx
- [x] Corrigir before-after-comparison.tsx
- [x] Corrigir symptom-evolution-chart.tsx
- [x] Corrigir comparative-effectiveness-report.tsx
- [x] Corrigir effectiveness-analysis.tsx
- [x] Criar módulo centralizado improvement-calculator.ts com funções reutilizáveis
- [x] Adicionar BTSS e HB à lista de escalas inversas (estavam faltando)


## Redesign de Gráficos - Padrão Científico
- [x] Pesquisar padrões visuais de gráficos em publicações científicas
- [x] Corrigir terminologia: "Estabilidade" substituído por "Sem alteração" em 6 arquivos
- [x] Redesenhar gráfico de Evolução da Escala (barras) com padrão científico
- [x] Redesenhar gráfico de Tendência com padrão científico (linha com marcadores circulares, eixos rotulados)
- [x] Melhorar legenda com terminologia clínica correta (Baseline, Follow-up, Pré/Pós-tratamento)
- [x] Adicionar eixos Y com rótulos de score e eixos X com datas
- [x] Usar cores padronizadas de publicações científicas (azul #1E40AF, verde #16A34A, vermelho #DC2626)
- [x] Testar todos os gráficos redesenhados (535 testes passando)
- [x] Adicionar tabela de dados numéricos com Baseline/Follow-up
- [x] Adicionar Resumo Estatístico com variação absoluta e percentual
- [x] Indicar direção da escala (score menor/maior = melhor resultado clínico)


## BUG - Conflito de Identificação do Profissional
- [x] Investigar as duas áreas de registro do profissional que estão conflitando
- [x] Corrigir exportação de documentos que mostra N/A em vez do nome do profissional
- [x] Corrigir assinatura eletrônica nos documentos exportados
- [x] Unificar sistema de identificação do profissional em uma única fonte de dados ("professionalProfile")
- [x] Migração automática de dados legados (@professional_info → professionalProfile)
- [x] Session PDF agora carrega dados do profissional automaticamente do AsyncStorage
- [x] Effectiveness PDF agora mostra nome, conselho, registro e assinatura do profissional
- [x] Tela de Configurações simplificada (redireciona ao Perfil para edição)
- [x] Perfil sempre regenera assinatura eletrônica quando dados mudam


## Zoom na Imagem do Sistema 10-20
- [x] Investigar implementação atual da imagem do sistema 10-20
- [x] Implementar zoom efetivo com pinch-to-zoom e pan
- [x] Garantir que o zoom funcione bem em Android e iOS (cross-platform)
- [x] Adicionar botões de zoom +/- para acessibilidade
- [x] Adicionar duplo toque para zoom rápido (2.5x)
- [x] Botão de reset para voltar ao tamanho original
- [x] Criar componente reutilizável ZoomableImage
- [x] Integrar ZoomableImage no helmet-3d-selector.tsx
- [x] Indicador de nível de zoom atual (1.0x a 5.0x)


## Novo Ícone do App
- [x] Processar imagem fornecida pelo usuário como novo ícone (cérebro com rede neural em fundo azul)
- [x] Copiar para icon.png, splash-icon.png, favicon.png, android-icon-foreground.png
- [x] Atualizar logoUrl no app.config.ts


## Imagem de Branding na Home
- [x] Processar e salvar imagem de branding no projeto (branding-hero.jpg)
- [x] Integrar na tela Home como hero compacto (120x120 com bordas arredondadas)


## Sistema de Backup/Restauração JSON Completo
- [x] Reescrever backup-system.ts com 16 chaves AsyncStorage (TODOS os dados do app)
- [x] Exportar: pacientes, sessões, escalas, planos, perfil, templates, ciclos, metas, logs, notificações
- [x] Importar com validação de arquivo JSON
- [x] Suportar backup v1 (antigo) com migração automática para v2
- [x] Detectar conflitos (paciente/plano/sessão já existente)
- [x] Modal de resumo do backup antes de importar
- [x] Opções de resolução: Sobrescrever Todos / Manter Dados Atuais
- [x] Resumo final da importação com contagem de itens adicionados/atualizados
- [x] Integrar botões na tela de Configurações com design profissional
- [x] Mostrar data do último backup
- [x] Funcional em iOS e Android (expo-document-picker + expo-sharing)
- [x] 535 testes passando


## BUG - Importação de Backup não efetiva dados
- [x] Investigar por que o resumo aparece mas os dados não são salvos no AsyncStorage
- [x] Corrigir leitura do arquivo JSON via expo-document-picker (3 abordagens de fallback)
- [x] Garantir que importBackupData grava corretamente no AsyncStorage (writeJson com verificação)
- [x] Adicionar logs detalhados para debug
- [x] Aceitar múltiplos tipos MIME (application/json, text/plain, */*) para compatibilidade
- [x] Mostrar alerta de erro interno se importação falhar


## BUG CORRIGIDO - Erro de Build "pnpm install failed"
- [x] Remover package-lock.json conflitante
- [x] Regenerar pnpm-lock.yaml com todas as dependências atualizadas
- [x] Versão atualizada para 10.0.0 (iOS) e versionCode 100 (Android)
- [x] Build agora pronto para publicação nas lojas


## FIX - Android AAB assinado com keystore errada
- [x] Configurar EAS credentials com nova-chave-upload.jks do usuário
- [x] Rebuild Android AAB com a keystore correta (SHA1 esperado: ED:51:54:B1:CA:43:E6:56:68:97:41:44:FE:36:B4:8D:3F:51:FC:0B)
- [x] Verificar SHA1 do AAB gerado antes de entregar

## FIX - iOS Build: lightningcss.darwin-arm64.node missing
- [x] Fix lightningcss native module not found on EAS macOS ARM64 build server
- [x] Rebuild iOS IPA successfully

## BUG - Tela de Escalas: imagem sobrepondo
- [ ] Corrigir imagem de baixo se sobressaindo/sobrepondo na tela de Escalas

## FIX - iOS Bundle ID mismatch no App Store Connect
- [x] Identificar Bundle ID correto registrado no App Store Connect
- [x] Corrigir Bundle ID no app.config.ts
- [x] Rebuild iOS IPA com Bundle ID correto
- [x] Reconfigurar provisioning profile para novo Bundle ID (reutilizado L63YU489L8)

## PWA Admin (Gerenciamento de Acesso) - COMPLETED
- [x] Criar PWA com login/registro de usuários
- [x] Painel admin para aprovar/bloquear usuários
- [x] Listar usuários por status (pendentes, aprovados, bloqueados)
- [x] Configurar API no servidor para gerenciamento de usuários

## PWA NeuroLaserMap (Versão Web para Usuários) - COMPLETED
- [x] Criar PWA com dashboard de pacientes
- [x] Tela de lista de pacientes com busca e filtros
- [x] Tela de adicionar/editar paciente
- [x] Tela de sessões
- [x] Tela de escalas
- [x] Tela de ciclos
- [x] Tela de efetividade/relatórios
- [x] Exportar dados
- [x] Tema claro/escuro com botão manual
- [x] Touch-screen otimizado

## PWA App - Clone EXATO do App Mobile Original
- [x] Capturar todas as telas do app original (9 abas)
- [x] Ler código fonte de todas as telas
- [x] Recriar PWA como clone exato (cores, fontes, layout, figuras, funcionalidades)
- [x] Testar todas as telas e funcionalidades
- [x] Home: Dashboard com estatísticas, ações rápidas, estatísticas avançadas
- [x] Escalas: 23 escalas clínicas com botão Aplicar Escala e busca
- [x] Ciclos: Gerenciamento de ciclos terapêuticos com criação de novo ciclo
- [x] Pacientes: Lista com busca, filtros (Todos/Ativos/Pausados/Concluídos), FAB adicionar
- [x] Nova Sessão: Histórico de sessões com FAB para nova sessão
- [x] Perfil: Informações profissionais, tema escuro, estatísticas
- [x] Config: Exportar/Importar dados, backup, segurança, recalcular
- [x] Efetividade: Métricas gerais, gráfico evolução, relatório por paciente
- [x] Admin: Capacete de neuromodulação SVG, sistema EEG 10-20, mapa de pontos interativo
- [x] Dados de exemplo (4 pacientes, 2 sessões, 23 escalas)
- [x] Tema claro/escuro com toggle manual
- [x] Persistência em localStorage

## BUG - PWA retorna Not Found no deploy
- [x] Diagnosticar por que /pwa/app/ retorna Not Found no domínio publicado
- [x] Corrigir servidor para servir PWA corretamente no deploy (PROJECT_ROOT robusto)
- [x] Rebuild produção (pnpm build)
- [x] Salvar checkpoint e testar no domínio publicado

## BUG - PWA Not Found no deploy (gateway só roteia /api/*)
- [x] Diagnosticar: gateway de produção só encaminha /api/* ao Express
- [x] Mover rotas PWA para /api/pwa/app/ e /api/pwa/admin/
- [x] Manter rotas /pwa/ para dev local
- [x] Rebuild produção
- [ ] Testar no domínio publicado com novo endereço /api/pwa/app/

## Converter Expo Web em PWA Instalável
- [x] Pesquisar como transformar Expo web (Metro) em PWA
- [x] Adicionar manifest.json, meta tags e service worker
- [x] Configurar ícones e splash para PWA (logo192.png, logo512.png, favicon.ico)
- [x] Criar app/+html.tsx com PWA meta tags (modo static)
- [x] Verificar que o visual é idêntico ao app mobile (mesmo código Expo)
- [ ] Testar instalação como PWA no celular (usuário)
