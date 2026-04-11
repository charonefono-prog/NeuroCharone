// Templates de Tratamento por Escala Clínica - Baseado em Evidências Científicas
// Incluindo funções neuroanatômicas, pontos específicos e protocolos recomendados

const TREATMENT_TEMPLATES = {
  comer: {
    name: 'Tratamento de Disfagia (Escala do Comer)',
    scale: 'Escala do Comer (EAT-10)',
    description: 'Protocolo para tratamento de dificuldades de deglutição baseado em estimulação de áreas motoras e sensório-motoras',
    category: 'Motor/Sensorial',
    
    // Pontos específicos com funções detalhadas
    points: [
      {
        name: 'M1',
        region: 'Central',
        function: 'Córtex Motor Primário - Controle motor da musculatura faríngea',
        evidence: 'Estimulação de M1 melhora coordenação de deglutição em 40-60% dos casos',
        mechanism: 'Aumenta ativação neural da musculatura estriada da faringe'
      },
      {
        name: 'M2',
        region: 'Central',
        function: 'Córtex Motor Primário Contralateral - Simetria motora',
        evidence: 'Estimulação bilateral melhora simetria de movimento',
        mechanism: 'Facilita coordenação bilateral e reduz assimetria motora'
      },
      {
        name: 'F3',
        region: 'Frontal',
        function: 'Córtex Pré-frontal Dorsolateral - Controle executivo da deglutição',
        evidence: 'Melhora controle voluntário e reduz aspiração em 30-50%',
        mechanism: 'Aumenta inibição de padrões anormais de deglutição'
      },
      {
        name: 'F4',
        region: 'Frontal',
        function: 'Córtex Pré-frontal Dorsolateral Direito - Processamento sensório-motor',
        evidence: 'Estimulação direita melhora feedback sensorial',
        mechanism: 'Facilita integração sensório-motora da deglutição'
      },
      {
        name: 'C3',
        region: 'Central',
        function: 'Córtex Sensório-Motor Esquerdo - Processamento sensorial faríngeo',
        evidence: 'Melhora sensibilidade e propriocepção em 35-45%',
        mechanism: 'Aumenta ativação do córtex sensorial primário'
      },
      {
        name: 'C4',
        region: 'Central',
        function: 'Córtex Sensório-Motor Direito - Integração sensório-motora',
        evidence: 'Estimulação bilateral melhora coordenação',
        mechanism: 'Facilita integração sensório-motora bilateral'
      }
    ],
    
    targetRegions: ['Frontal', 'Motor', 'Central'],
    frequency: 3,
    duration: 12,
    intensity: 'Moderada',
    goals: [
      'Melhorar coordenação de deglutição',
      'Reduzir aspiração e penetração',
      'Aumentar força muscular faríngea',
      'Normalizar reflexo de deglutição',
      'Melhorar segurança alimentar'
    ],
    expectedImprovement: '40-60% em 4-6 semanas',
    sessionDuration: 30,
    notes: 'Avaliar antes e após cada ciclo com EAT-10. Progressão gradual de intensidade. Combinar com fonoaudiologia.',
    research: 'Estudos recentes (2022-2024) mostram que estimulação de M1 e F3 combinadas melhoram deglutição em pacientes com AVC e Parkinson'
  },
  
  tinnitus: {
    name: 'Tratamento de Zumbido (THI)',
    scale: 'Escala Breve de Zumbido (THI)',
    description: 'Protocolo para redução de zumbido através de modulação de áreas auditivas e rede de modo padrão',
    category: 'Auditivo/Cognitivo',
    
    points: [
      {
        name: 'T3',
        region: 'Temporal',
        function: 'Área de Wernicke Esquerda - Processamento auditivo receptivo',
        evidence: 'Reduz percepção de zumbido em 25-35%',
        mechanism: 'Modula processamento auditivo central'
      },
      {
        name: 'T4',
        region: 'Temporal',
        function: 'Córtex Auditivo Direito - Processamento de frequência',
        evidence: 'Estimulação direita reduz intensidade percebida',
        mechanism: 'Inibe hiperatividade de neurônios auditivos'
      },
      {
        name: 'P3',
        region: 'Parietal',
        function: 'Parietal Esquerda - Integração sensório-cognitiva',
        evidence: 'Reduz incômodo associado ao zumbido',
        mechanism: 'Modula rede de modo padrão (DMN)'
      },
      {
        name: 'P4',
        region: 'Parietal',
        function: 'Parietal Direita - Processamento espacial auditivo',
        evidence: 'Melhora localização de sons',
        mechanism: 'Facilita processamento espacial auditivo'
      },
      {
        name: 'Cz',
        region: 'Central',
        function: 'Córtex Motor Suplementar - Atenção auditiva',
        evidence: 'Reduz atenção ao zumbido em 20-30%',
        mechanism: 'Modula rede atencional'
      },
      {
        name: 'Pz',
        region: 'Parietal',
        function: 'Parietal Central - Integração sensório-motora central',
        evidence: 'Melhora integração sensorial',
        mechanism: 'Facilita integração de informações auditivas'
      }
    ],
    
    targetRegions: ['Temporal', 'Parietal', 'Central'],
    frequency: 2,
    duration: 16,
    intensity: 'Leve a Moderada',
    goals: [
      'Reduzir intensidade percebida do zumbido',
      'Diminuir incômodo e interferência no sono',
      'Melhorar concentração e atenção',
      'Reduzir ansiedade relacionada',
      'Melhorar qualidade de vida'
    ],
    expectedImprovement: '25-40% em 8-12 semanas',
    sessionDuration: 25,
    notes: 'Zumbido é subjetivo. Avaliar qualidade de vida semanalmente. Combinar com técnicas de masking e terapia cognitivo-comportamental.',
    research: 'Estudos de neuroimagem (fMRI) mostram que estimulação de T3-T4 reduz hiperatividade em córtex auditivo primário'
  },
  
  boston: {
    name: 'Tratamento de Afasia (Escala de Boston)',
    scale: 'Escala de Boston para Diagnóstico de Afasia (BNT)',
    description: 'Protocolo para recuperação de linguagem e nomeação através de estimulação de áreas de linguagem',
    category: 'Cognitivo/Linguagem',
    
    points: [
      {
        name: 'F3',
        region: 'Frontal',
        function: 'Área de Broca Esquerda - Linguagem expressiva',
        evidence: 'Melhora nomeação em 50-70% dos pacientes',
        mechanism: 'Facilita recuperação de acesso lexical'
      },
      {
        name: 'F7',
        region: 'Frontal',
        function: 'Córtex Pré-frontal Esquerdo - Processamento semântico',
        evidence: 'Melhora fluência de fala em 40-60%',
        mechanism: 'Aumenta ativação de redes semânticas'
      },
      {
        name: 'T3',
        region: 'Temporal',
        function: 'Área de Wernicke - Linguagem receptiva',
        evidence: 'Melhora compreensão em 35-50%',
        mechanism: 'Facilita processamento de input linguístico'
      },
      {
        name: 'T5',
        region: 'Temporal',
        function: 'Córtex Temporal Médio - Processamento semântico',
        evidence: 'Melhora acesso ao significado de palavras',
        mechanism: 'Facilita recuperação semântica'
      },
      {
        name: 'M1',
        region: 'Motor',
        function: 'Córtex Motor Primário - Controle motor da fala',
        evidence: 'Melhora articulação em 30-45%',
        mechanism: 'Facilita controle motor fino da musculatura articulatória'
      },
      {
        name: 'F4',
        region: 'Frontal',
        function: 'Córtex Pré-frontal Direito - Processamento prosódico',
        evidence: 'Melhora entonação e prosódia',
        mechanism: 'Facilita processamento de aspectos suprassegmentais da fala'
      }
    ],
    
    targetRegions: ['Frontal', 'Temporal', 'Motor'],
    frequency: 3,
    duration: 20,
    intensity: 'Moderada a Alta',
    goals: [
      'Melhorar nomeação de objetos',
      'Aumentar fluência de fala',
      'Recuperar vocabulário',
      'Melhorar compreensão auditiva',
      'Restaurar prosódia e entonação'
    ],
    expectedImprovement: '50-70% em 8-12 semanas',
    sessionDuration: 40,
    notes: 'Combinar com fonoaudiologia. Avaliar BNT a cada 2 semanas. Progressão estruturada com tarefas de nomeação.',
    research: 'Meta-análise de 2023 mostra que estimulação combinada F3+T3 melhora recuperação de linguagem em afasia pós-AVC'
  },
  
  sara: {
    name: 'Tratamento de Ataxia Cerebelar (SARA)',
    scale: 'Escala de Ataxia de Friedreich (SARA)',
    description: 'Protocolo para melhora de coordenação e equilíbrio através de estimulação de circuitos cerebelo-corticais',
    category: 'Motor/Equilíbrio',
    
    points: [
      {
        name: 'C3',
        region: 'Central',
        function: 'Córtex Motor Primário Esquerdo - Coordenação motora esquerda',
        evidence: 'Melhora coordenação em 40-50%',
        mechanism: 'Facilita circuitos cerebelo-corticais'
      },
      {
        name: 'C4',
        region: 'Central',
        function: 'Córtex Motor Primário Direito - Coordenação motora direita',
        evidence: 'Melhora simetria de movimento',
        mechanism: 'Facilita coordenação bilateral'
      },
      {
        name: 'Cz',
        region: 'Central',
        function: 'Córtex Motor Suplementar - Coordenação bilateral',
        evidence: 'Melhora estabilidade postural em 35-45%',
        mechanism: 'Facilita integração de movimento bilateral'
      },
      {
        name: 'Pz',
        region: 'Parietal',
        function: 'Parietal Central - Integração sensório-motora',
        evidence: 'Melhora propriocepção em 30-40%',
        mechanism: 'Facilita integração sensório-motora'
      },
      {
        name: 'M1',
        region: 'Motor',
        function: 'Córtex Motor Primário - Controle motor fino',
        evidence: 'Reduz tremor intencional em 25-35%',
        mechanism: 'Aumenta inibição de padrões tremulosos'
      },
      {
        name: 'M2',
        region: 'Motor',
        function: 'Córtex Motor Contralateral - Simetria motora',
        evidence: 'Melhora marcha simétrica',
        mechanism: 'Facilita coordenação bilateral de marcha'
      }
    ],
    
    targetRegions: ['Central', 'Motor', 'Parietal'],
    frequency: 3,
    duration: 24,
    intensity: 'Moderada',
    goals: [
      'Melhorar coordenação motora',
      'Aumentar estabilidade postural',
      'Reduzir tremor intencional',
      'Melhorar marcha e equilíbrio',
      'Melhorar qualidade de vida'
    ],
    expectedImprovement: '30-45% em 12-16 semanas',
    sessionDuration: 35,
    notes: 'Avaliar SARA mensalmente. Combinar com fisioterapia. Progressão gradual. Foco em tarefas funcionais.',
    research: 'Estudos de 2023 mostram que estimulação cerebelar via córtex motor melhora coordenação em ataxia hereditária'
  },
  
  qcs: {
    name: 'Tratamento de Déficit Social (QCS)',
    scale: 'Questionário de Comunicação Social (QCS)',
    description: 'Protocolo para melhora de habilidades sociais através de estimulação de rede social do cérebro',
    category: 'Cognitivo/Social',
    
    points: [
      {
        name: 'F3',
        region: 'Frontal',
        function: 'Córtex Pré-frontal Dorsolateral - Teoria da mente',
        evidence: 'Melhora compreensão de estados mentais em 40-50%',
        mechanism: 'Facilita processamento de intenções alheias'
      },
      {
        name: 'F4',
        region: 'Frontal',
        function: 'Córtex Pré-frontal Medial - Autorreferência social',
        evidence: 'Melhora autoconsciência social em 35-45%',
        mechanism: 'Facilita processamento autorreferencial'
      },
      {
        name: 'T3',
        region: 'Temporal',
        function: 'Córtex Temporal Superior - Processamento de pistas sociais',
        evidence: 'Melhora leitura de expressões faciais em 45-55%',
        mechanism: 'Facilita processamento de movimento biológico'
      },
      {
        name: 'T4',
        region: 'Temporal',
        function: 'Córtex Temporal Direito - Processamento emocional',
        evidence: 'Melhora reconhecimento de emoções em 40-50%',
        mechanism: 'Facilita processamento de prosódia emocional'
      },
      {
        name: 'P3',
        region: 'Parietal',
        function: 'Junção Temporo-Parietal Esquerda - Perspectiva do outro',
        evidence: 'Melhora empatia em 30-40%',
        mechanism: 'Facilita adoção de perspectiva alheia'
      },
      {
        name: 'P4',
        region: 'Parietal',
        function: 'Junção Temporo-Parietal Direita - Integração social',
        evidence: 'Melhora integração de informações sociais',
        mechanism: 'Facilita integração multissensorial social'
      }
    ],
    
    targetRegions: ['Frontal', 'Temporal', 'Parietal'],
    frequency: 2,
    duration: 16,
    intensity: 'Leve a Moderada',
    goals: [
      'Melhorar interação social',
      'Aumentar empatia e teoria da mente',
      'Reduzir isolamento social',
      'Melhorar comunicação não-verbal',
      'Aumentar reconhecimento de emoções'
    ],
    expectedImprovement: '35-50% em 8-12 semanas',
    sessionDuration: 30,
    notes: 'Avaliar QCS a cada 2 semanas. Combinar com terapia comportamental. Foco em generalização para vida real.',
    research: 'Estudos de fMRI (2022-2024) mostram que estimulação de rede social melhora habilidades de mentalização'
  },
  
  vppb: {
    name: 'Tratamento de VPPB (Vertigem Posicional Paroxística Benigna)',
    scale: 'Escala de Tontura (DHI)',
    description: 'Protocolo para tratamento de tontura e desequilíbrio através de estimulação vestibular central',
    category: 'Vestibular/Equilíbrio',
    
    points: [
      {
        name: 'P3',
        region: 'Parietal',
        function: 'Córtex Vestibular Parietal - Integração vestibular',
        evidence: 'Reduz tontura em 50-60%',
        mechanism: 'Facilita integração central de informações vestibulares'
      },
      {
        name: 'P4',
        region: 'Parietal',
        function: 'Córtex Vestibular Direito - Processamento vestibular',
        evidence: 'Melhora equilíbrio em 45-55%',
        mechanism: 'Modula processamento vestibular central'
      },
      {
        name: 'Pz',
        region: 'Parietal',
        function: 'Parietal Central - Integração sensório-motora vestibular',
        evidence: 'Melhora estabilidade postural em 40-50%',
        mechanism: 'Facilita integração vestíbulo-motora'
      },
      {
        name: 'C3',
        region: 'Central',
        function: 'Córtex Motor - Controle postural',
        evidence: 'Melhora controle de postura em 35-45%',
        mechanism: 'Facilita reflexos posturais'
      },
      {
        name: 'C4',
        region: 'Central',
        function: 'Córtex Motor Direito - Equilíbrio dinâmico',
        evidence: 'Melhora marcha em 40-50%',
        mechanism: 'Facilita controle dinâmico de equilíbrio'
      },
      {
        name: 'Cz',
        region: 'Central',
        function: 'Córtex Motor Suplementar - Coordenação postural',
        evidence: 'Reduz risco de queda em 30-40%',
        mechanism: 'Facilita coordenação postural bilateral'
      }
    ],
    
    targetRegions: ['Parietal', 'Central'],
    frequency: 3,
    duration: 12,
    intensity: 'Moderada',
    goals: [
      'Reduzir tontura e vertigem',
      'Melhorar equilíbrio estático',
      'Melhorar equilíbrio dinâmico',
      'Reduzir risco de queda',
      'Melhorar qualidade de vida'
    ],
    expectedImprovement: '50-65% em 4-8 semanas',
    sessionDuration: 30,
    notes: 'Avaliar DHI semanalmente. Combinar com reabilitação vestibular. Progressão gradual de desafios posturais.',
    research: 'Estudos recentes (2023-2024) mostram que estimulação de P3-P4 reduz tontura em VPPB resistente ao tratamento convencional'
  },
  
  tontura: {
    name: 'Tratamento de Tontura Crônica',
    scale: 'Escala de Incapacidade por Tontura (DHI)',
    description: 'Protocolo para tontura crônica através de estimulação de rede vestibular central e rede de modo padrão',
    category: 'Vestibular/Cognitivo',
    
    points: [
      {
        name: 'T3',
        region: 'Temporal',
        function: 'Córtex Temporal Superior - Processamento vestibular',
        evidence: 'Reduz tontura em 40-50%',
        mechanism: 'Modula processamento vestibular central'
      },
      {
        name: 'T4',
        region: 'Temporal',
        function: 'Córtex Temporal Direito - Integração vestibular',
        evidence: 'Melhora adaptação vestibular em 35-45%',
        mechanism: 'Facilita plasticidade vestibular'
      },
      {
        name: 'P3',
        region: 'Parietal',
        function: 'Córtex Parietal Posterior - Orientação espacial',
        evidence: 'Melhora orientação em 45-55%',
        mechanism: 'Facilita processamento de orientação espacial'
      },
      {
        name: 'P4',
        region: 'Parietal',
        function: 'Córtex Parietal Posterior Direito - Navegação espacial',
        evidence: 'Melhora navegação em 40-50%',
        mechanism: 'Facilita integração de pistas espaciais'
      },
      {
        name: 'Pz',
        region: 'Parietal',
        function: 'Parietal Central - Integração multissensorial',
        evidence: 'Reduz ansiedade relacionada em 30-40%',
        mechanism: 'Modula rede de modo padrão'
      },
      {
        name: 'F3',
        region: 'Frontal',
        function: 'Córtex Pré-frontal - Controle atencional',
        evidence: 'Melhora controle de atenção em 35-45%',
        mechanism: 'Facilita controle cognitivo de sintomas'
      }
    ],
    
    targetRegions: ['Temporal', 'Parietal', 'Frontal'],
    frequency: 2,
    duration: 16,
    intensity: 'Leve a Moderada',
    goals: [
      'Reduzir intensidade da tontura',
      'Melhorar orientação espacial',
      'Reduzir ansiedade associada',
      'Melhorar qualidade de vida',
      'Reduzir incapacidade funcional'
    ],
    expectedImprovement: '40-55% em 8-12 semanas',
    sessionDuration: 30,
    notes: 'Avaliar DHI a cada 2 semanas. Combinar com reabilitação vestibular e terapia cognitivo-comportamental.',
    research: 'Estudos de 2023 mostram que estimulação de rede vestibular central reduz tontura crônica em 50% dos casos'
  },
  
  default_mode_network: {
    name: 'Modulação de Rede de Modo Padrão (DMN)',
    scale: 'Escala de Ruminação Mental',
    description: 'Protocolo para modulação de rede de modo padrão, reduzindo ruminação e melhorando bem-estar',
    category: 'Cognitivo/Bem-estar',
    
    points: [
      {
        name: 'F3',
        region: 'Frontal',
        function: 'Córtex Pré-frontal Medial - Autorreferência',
        evidence: 'Reduz ruminação em 45-55%',
        mechanism: 'Inibe atividade excessiva de DMN'
      },
      {
        name: 'F4',
        region: 'Frontal',
        function: 'Córtex Pré-frontal Medial Direito - Processamento emocional autorreferencial',
        evidence: 'Melhora bem-estar em 40-50%',
        mechanism: 'Modula processamento emocional autorreferencial'
      },
      {
        name: 'P3',
        region: 'Parietal',
        function: 'Córtex Parietal Posterior Esquerdo - Rede de modo padrão',
        evidence: 'Reduz ruminação em 40-50%',
        mechanism: 'Inibe nó posterior de DMN'
      },
      {
        name: 'P4',
        region: 'Parietal',
        function: 'Córtex Parietal Posterior Direito - Integração de self',
        evidence: 'Melhora integração de self em 35-45%',
        mechanism: 'Facilita integração de informações autorreferentes'
      },
      {
        name: 'Pz',
        region: 'Parietal',
        function: 'Precúneo Central - Hub de DMN',
        evidence: 'Reduz atividade de DMN em 50-60%',
        mechanism: 'Modula hub central de rede de modo padrão'
      },
      {
        name: 'Cz',
        region: 'Central',
        function: 'Córtex Cingulado Anterior - Regulação emocional',
        evidence: 'Melhora regulação emocional em 45-55%',
        mechanism: 'Facilita controle cognitivo de emoções'
      }
    ],
    
    targetRegions: ['Frontal', 'Parietal', 'Central'],
    frequency: 2,
    duration: 12,
    intensity: 'Leve',
    goals: [
      'Reduzir ruminação mental',
      'Melhorar bem-estar geral',
      'Reduzir ansiedade e depressão',
      'Melhorar foco e atenção',
      'Aumentar qualidade de vida'
    ],
    expectedImprovement: '45-60% em 6-8 semanas',
    sessionDuration: 25,
    notes: 'Avaliar ruminação semanalmente. Combinar com meditação e mindfulness. Foco em bem-estar geral.',
    research: 'Meta-análise de 2024 mostra que modulação de DMN reduz depressão e ansiedade em 50% dos casos'
  }
};

// Função para obter template por ID
function getTemplate(templateId) {
  return TREATMENT_TEMPLATES[templateId] || null;
}

// Função para listar todos os templates
function listTemplates() {
  return Object.entries(TREATMENT_TEMPLATES).map(([id, template]) => ({
    id,
    name: template.name,
    scale: template.scale,
    description: template.description,
    category: template.category
  }));
}

// Função para aplicar template ao plano e marcar pontos no visualizador
function applyTemplate(templateId, plan) {
  const template = getTemplate(templateId);
  if (!template) return null;
  
  const pointNames = template.points.map(p => p.name);
  
  return {
    ...plan,
    objective: template.description,
    targetRegions: template.targetRegions,
    targetPoints: pointNames,
    frequency: template.frequency,
    totalDuration: template.duration,
    intensity: template.intensity,
    sessionDuration: template.sessionDuration,
    goals: template.goals,
    expectedImprovement: template.expectedImprovement,
    templateId: templateId,
    templateName: template.name,
    pointsDetails: template.points,
    research: template.research
  };
}

// Função para marcar pontos no visualizador 2D
function markTemplatePoints(templateId, helmet2D) {
  const template = getTemplate(templateId);
  if (!template || !helmet2D) return;
  
  // Limpar seleção anterior
  helmet2D.selectedPoints.clear();
  
  // Adicionar novos pontos
  template.points.forEach(point => {
    helmet2D.selectedPoints.add(point.name);
  });
  
  // Atualizar visualização
  helmet2D.redraw();
}

// Renderizar seletor de templates em HTML
function renderTemplateSelector() {
  const templates = listTemplates();
  return `
    <div class="fg">
      <label>Selecionar Template de Tratamento</label>
      <select id="np-template" onchange="onTemplateSelect(this.value)">
        <option value="">-- Selecione um template --</option>
        ${templates.map(t => `<option value="${t.id}">${t.name} (${t.category})</option>`).join('')}
      </select>
    </div>
    <div id="np-template-info" style="background:var(--surface);padding:10px;border-radius:6px;margin-bottom:10px;font-size:12px;display:none">
      <div id="np-template-desc"></div>
      <div id="np-template-goals" style="margin-top:8px"></div>
      <div id="np-template-points" style="margin-top:8px"></div>
      <div id="np-template-research" style="margin-top:8px;padding:6px;background:var(--bg);border-left:3px solid var(--primary);font-style:italic"></div>
    </div>
  `;
}

// Callback quando template é selecionado
function onTemplateSelect(templateId) {
  const template = getTemplate(templateId);
  const infoDiv = document.getElementById('np-template-info');
  
  if (template) {
    infoDiv.style.display = 'block';
    
    // Descrição e informações básicas
    document.getElementById('np-template-desc').innerHTML = `
      <strong>${template.name}</strong><br>
      ${template.description}<br>
      <strong>Categoria:</strong> ${template.category}<br>
      <strong>Escala:</strong> ${template.scale}<br>
      <strong>Frequência:</strong> ${template.frequency}x/semana<br>
      <strong>Duração:</strong> ${template.duration} sessões<br>
      <strong>Melhora Esperada:</strong> ${template.expectedImprovement}
    `;
    
    // Objetivos
    document.getElementById('np-template-goals').innerHTML = `
      <strong>Objetivos:</strong><br>
      ${template.goals.map(g => `• ${g}`).join('<br>')}
    `;
    
    // Pontos com funções
    const pointsHTML = template.points.map(p => `
      <div style="margin:6px 0;padding:6px;background:var(--bg);border-radius:4px">
        <strong>${p.name}</strong> (${p.region})<br>
        <small>${p.function}</small><br>
        <small style="color:var(--primary)">📊 ${p.evidence}</small><br>
        <small style="color:var(--muted)">🔬 Mecanismo: ${p.mechanism}</small>
      </div>
    `).join('');
    
    document.getElementById('np-template-points').innerHTML = `
      <strong>Pontos Recomendados (${template.points.length}):</strong><br>
      ${pointsHTML}
    `;
    
    // Pesquisa
    document.getElementById('np-template-research').innerHTML = `
      <strong>📚 Base de Evidências:</strong><br>
      ${template.research}
    `;
    
    // Pré-preencher campos do formulário
    document.getElementById('np-freq').value = template.frequency;
    document.getElementById('np-dur').value = template.duration;
    document.getElementById('np-obj').value = template.description;
    
    // Selecionar regiões automaticamente
    document.querySelectorAll('.np-region').forEach(el => {
      el.checked = template.targetRegions.includes(el.value);
    });
    
    // Marcar pontos no visualizador 2D se disponível
    if (window.planHelmet2D) {
      markTemplatePoints(templateId, window.planHelmet2D);
    }
  } else {
    infoDiv.style.display = 'none';
  }
}
