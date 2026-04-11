// Templates de Tratamento por Escala Clínica
const TREATMENT_TEMPLATES = {
  comer: {
    name: 'Tratamento de Disfagia (Escala do Comer)',
    scale: 'Escala do Comer (EAT-10)',
    description: 'Protocolo para tratamento de dificuldades de deglutição',
    targetRegions: ['Frontal', 'Motor', 'Central'],
    recommendedPoints: ['F3', 'F4', 'C3', 'C4', 'M1', 'M2'],
    frequency: 3,
    duration: 12,
    intensity: 'Moderada',
    goals: [
      'Melhorar coordenação de deglutição',
      'Reduzir aspiração',
      'Aumentar força muscular faríngea',
      'Normalizar reflexo de deglutição'
    ],
    expectedImprovement: '30-50% em 4 semanas',
    sessionDuration: 30,
    notes: 'Avaliar antes e após cada ciclo com EAT-10. Progressão gradual de intensidade.'
  },
  
  tinnitus: {
    name: 'Tratamento de Zumbido (THI)',
    scale: 'Escala Breve de Zumbido (THI)',
    description: 'Protocolo para redução de zumbido e incômodo auditivo',
    targetRegions: ['Temporal', 'Parietal', 'Central'],
    recommendedPoints: ['T3', 'T4', 'P3', 'P4', 'Cz', 'Pz'],
    frequency: 2,
    duration: 16,
    intensity: 'Leve a Moderada',
    goals: [
      'Reduzir intensidade percebida do zumbido',
      'Diminuir incômodo e interferência no sono',
      'Melhorar concentração',
      'Reduzir ansiedade relacionada'
    ],
    expectedImprovement: '20-40% em 8 semanas',
    sessionDuration: 25,
    notes: 'Zumbido é subjetivo. Avaliar qualidade de vida. Combinar com técnicas de masking.'
  },
  
  boston: {
    name: 'Tratamento de Afasia (Escala de Boston)',
    scale: 'Escala de Boston para Diagnóstico de Afasia (BNT)',
    description: 'Protocolo para recuperação de linguagem e nomeação',
    targetRegions: ['Frontal', 'Temporal', 'Motor'],
    recommendedPoints: ['F3', 'F7', 'T3', 'T5', 'M1'],
    frequency: 3,
    duration: 20,
    intensity: 'Moderada a Alta',
    goals: [
      'Melhorar nomeação de objetos',
      'Aumentar fluência de fala',
      'Recuperar vocabulário',
      'Melhorar compreensão auditiva'
    ],
    expectedImprovement: '40-60% em 8-12 semanas',
    sessionDuration: 40,
    notes: 'Combinar com fonoaudiologia. Avaliar BNT a cada 4 semanas. Progressão estruturada.'
  },
  
  sara: {
    name: 'Tratamento de Ataxia Cerebelar (SARA)',
    scale: 'Escala de Ataxia de Friedreich (SARA)',
    description: 'Protocolo para melhora de coordenação e equilíbrio',
    targetRegions: ['Central', 'Motor', 'Parietal'],
    recommendedPoints: ['C3', 'C4', 'Cz', 'Pz', 'M1', 'M2'],
    frequency: 3,
    duration: 24,
    intensity: 'Moderada',
    goals: [
      'Melhorar coordenação motora',
      'Aumentar estabilidade postural',
      'Reduzir tremor intencional',
      'Melhorar marcha e equilíbrio'
    ],
    expectedImprovement: '25-35% em 12 semanas',
    sessionDuration: 35,
    notes: 'Avaliar SARA mensalmente. Combinar com fisioterapia. Progressão gradual.'
  },
  
  qcs: {
    name: 'Tratamento de Déficit Social (QCS)',
    scale: 'Questionário de Comunicação Social (QCS)',
    description: 'Protocolo para melhora de habilidades sociais e comunicação',
    targetRegions: ['Frontal', 'Temporal', 'Parietal'],
    recommendedPoints: ['F3', 'F4', 'T3', 'T4', 'P3', 'P4'],
    frequency: 2,
    duration: 16,
    intensity: 'Leve a Moderada',
    goals: [
      'Melhorar interação social',
      'Aumentar empatia e teoria da mente',
      'Reduzir isolamento social',
      'Melhorar comunicação não-verbal'
    ],
    expectedImprovement: '30-45% em 8-12 semanas',
    sessionDuration: 30,
    notes: 'Avaliar QCS a cada 4 semanas. Combinar com terapia comportamental. Foco em generalização.'
  },
  
  depression: {
    name: 'Tratamento de Depressão',
    scale: 'Escala de Depressão (PHQ-9)',
    description: 'Protocolo para redução de sintomas depressivos',
    targetRegions: ['Frontal', 'Temporal'],
    recommendedPoints: ['F3', 'F7', 'T3'],
    frequency: 3,
    duration: 12,
    intensity: 'Moderada',
    goals: [
      'Melhorar humor',
      'Aumentar motivação',
      'Reduzir fadiga',
      'Melhorar sono'
    ],
    expectedImprovement: '40-50% em 6-8 semanas',
    sessionDuration: 30,
    notes: 'Avaliar PHQ-9 semanalmente. Combinar com psicoterapia. Monitorar ideação suicida.'
  },
  
  anxiety: {
    name: 'Tratamento de Ansiedade',
    scale: 'Escala de Ansiedade (GAD-7)',
    description: 'Protocolo para redução de sintomas ansiosos',
    targetRegions: ['Frontal', 'Central'],
    recommendedPoints: ['F4', 'Fz', 'Cz'],
    frequency: 2,
    duration: 12,
    intensity: 'Leve a Moderada',
    goals: [
      'Reduzir preocupação excessiva',
      'Diminuir sintomas físicos de ansiedade',
      'Melhorar qualidade de sono',
      'Aumentar relaxamento'
    ],
    expectedImprovement: '35-45% em 6-8 semanas',
    sessionDuration: 25,
    notes: 'Avaliar GAD-7 semanalmente. Combinar com técnicas de relaxamento. Progressão gradual.'
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
    description: template.description
  }));
}

// Função para aplicar template ao plano
function applyTemplate(templateId, plan) {
  const template = getTemplate(templateId);
  if (!template) return null;
  
  return {
    ...plan,
    objective: template.description,
    targetRegions: template.targetRegions,
    targetPoints: template.recommendedPoints,
    frequency: template.frequency,
    totalDuration: template.duration,
    intensity: template.intensity,
    sessionDuration: template.sessionDuration,
    goals: template.goals,
    expectedImprovement: template.expectedImprovement,
    templateId: templateId,
    templateName: template.name
  };
}

// Renderizar seletor de templates em HTML
function renderTemplateSelector() {
  const templates = listTemplates();
  return `
    <div class="fg">
      <label>Selecionar Template de Tratamento</label>
      <select id="np-template" onchange="onTemplateSelect(this.value)">
        <option value="">-- Selecione um template --</option>
        ${templates.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
      </select>
    </div>
    <div id="np-template-info" style="background:var(--surface);padding:10px;border-radius:6px;margin-bottom:10px;font-size:12px;display:none">
      <div id="np-template-desc"></div>
      <div id="np-template-goals" style="margin-top:8px"></div>
    </div>
  `;
}

// Callback quando template é selecionado
function onTemplateSelect(templateId) {
  const template = getTemplate(templateId);
  const infoDiv = document.getElementById('np-template-info');
  
  if (template) {
    infoDiv.style.display = 'block';
    document.getElementById('np-template-desc').innerHTML = `
      <strong>${template.name}</strong><br>
      ${template.description}<br>
      <strong>Escala:</strong> ${template.scale}<br>
      <strong>Frequência:</strong> ${template.frequency}x/semana<br>
      <strong>Duração:</strong> ${template.duration} sessões<br>
      <strong>Melhora Esperada:</strong> ${template.expectedImprovement}
    `;
    
    document.getElementById('np-template-goals').innerHTML = `
      <strong>Objetivos:</strong><br>
      ${template.goals.map(g => `• ${g}`).join('<br>')}
    `;
    
    // Pré-preencher campos do formulário
    document.getElementById('np-freq').value = template.frequency;
    document.getElementById('np-dur').value = template.duration;
    document.getElementById('np-obj').value = template.description;
    
    // Selecionar regiões automaticamente
    document.querySelectorAll('.np-region').forEach(el => {
      el.checked = template.targetRegions.includes(el.value);
    });
  } else {
    infoDiv.style.display = 'none';
  }
}
