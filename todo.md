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
