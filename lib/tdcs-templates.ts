/**
 * Módulo tDCS (Estimulação Transcraniana por Corrente Contínua)
 * Independente do LASER mas com mesma arquitetura de planos terapêuticos
 * Totalmente funcional e registrável
 */

export type TDCSIndication = 
  | "depression" 
  | "anxiety" 
  | "pain" 
  | "cognitive" 
  | "motor-recovery" 
  | "addiction" 
  | "migraine" 
  | "tinnitus";

export type TDCSPolarity = "anodal" | "cathodal" | "bilateral";

export interface TDCSTemplate {
  id: string;
  name: string;
  indication: TDCSIndication;
  polarity: TDCSPolarity;
  intensity: number; // em mA
  duration: number; // em minutos
  frequency: number; // em Hz
  sessionsPerWeek: number;
  totalSessions: number;
  electrodePositions: {
    anode: string;
    cathode: string;
  };
  contraindications: string[];
  expectedResults: string[];
  notes: string;
}

export interface TDCSTherapyPlan {
  id: string;
  patientId: string;
  templateId: string;
  startDate: string;
  endDate: string;
  sessionsCompleted: number;
  electrodePositions: {
    anode: string;
    cathode: string;
  };
  frequency: number; // sessões por semana
  status: "active" | "completed" | "paused";
  notes: string;
  comparativeResults?: {
    laserPlanId?: string;
    laserResults?: string;
    tdcsResults?: string;
  };
}

// ============================================
// TEMPLATES tDCS - Protocolos Independentes
// ============================================

export const TDCS_TEMPLATES: TDCSTemplate[] = [
  // 1. DEPRESSÃO
  {
    id: "tdcs_001",
    name: "Depressão Leve a Moderada",
    indication: "depression",
    polarity: "anodal",
    intensity: 2,
    duration: 20,
    frequency: 0.5,
    sessionsPerWeek: 5,
    totalSessions: 10,
    electrodePositions: {
      anode: "F3 (Córtex pré-frontal dorsolateral esquerdo)",
      cathode: "Fp2 (Fronte direita)"
    },
    contraindications: ["Epilepsia não controlada", "Implante metálico cerebral", "Gravidez"],
    expectedResults: ["Melhora de humor em 40-60%", "Redução de anedonia", "Melhora cognitiva"],
    notes: "Protocolo baseado em estudos de TMS - tDCS para depressão"
  },
  {
    id: "tdcs_002",
    name: "Depressão Severa",
    indication: "depression",
    polarity: "anodal",
    intensity: 2,
    duration: 30,
    frequency: 1,
    sessionsPerWeek: 5,
    totalSessions: 20,
    electrodePositions: {
      anode: "F3 (Córtex pré-frontal dorsolateral esquerdo)",
      cathode: "Fp2 (Fronte direita)"
    },
    contraindications: ["Epilepsia não controlada", "Implante metálico cerebral"],
    expectedResults: ["Remissão em 50-70%", "Melhora significativa de sintomas"],
    notes: "Protocolo intensivo - avaliar após 10 sessões"
  },
  {
    id: "tdcs_003",
    name: "Depressão Resistente a Medicamentos",
    indication: "depression",
    polarity: "bilateral",
    intensity: 2,
    duration: 30,
    frequency: 1,
    sessionsPerWeek: 5,
    totalSessions: 25,
    electrodePositions: {
      anode: "F3 (Esquerda) + F4 (Direita)",
      cathode: "Mastóide bilateral"
    },
    contraindications: ["Epilepsia não controlada", "Implante metálico cerebral"],
    expectedResults: ["Resposta em 40-50% dos casos", "Melhora de resistência ao tratamento"],
    notes: "Protocolo para depressão refratária"
  },

  // 2. ANSIEDADE
  {
    id: "tdcs_004",
    name: "Ansiedade Generalizada",
    indication: "anxiety",
    polarity: "cathodal",
    intensity: 1.5,
    duration: 20,
    frequency: 0.5,
    sessionsPerWeek: 3,
    totalSessions: 12,
    electrodePositions: {
      anode: "Mastóide direita",
      cathode: "F4 (Córtex pré-frontal dorsolateral direito)"
    },
    contraindications: ["Transtorno bipolar", "Psicose"],
    expectedResults: ["Redução de ansiedade em 30-50%", "Melhora de sono"],
    notes: "Protocolo para ansiedade generalizada"
  },
  {
    id: "tdcs_005",
    name: "Transtorno de Pânico",
    indication: "anxiety",
    polarity: "anodal",
    intensity: 2,
    duration: 20,
    frequency: 0.5,
    sessionsPerWeek: 4,
    totalSessions: 12,
    electrodePositions: {
      anode: "F3 (Córtex pré-frontal dorsolateral esquerdo)",
      cathode: "Mastóide direita"
    },
    contraindications: ["Transtorno bipolar", "Psicose"],
    expectedResults: ["Redução de frequência de ataques", "Redução de intensidade"],
    notes: "Combinar com terapia cognitivo-comportamental"
  },
  {
    id: "tdcs_006",
    name: "Fobia Social",
    indication: "anxiety",
    polarity: "anodal",
    intensity: 1.5,
    duration: 20,
    frequency: 0.5,
    sessionsPerWeek: 3,
    totalSessions: 10,
    electrodePositions: {
      anode: "F3 (Córtex pré-frontal dorsolateral esquerdo)",
      cathode: "Fp2 (Fronte direita)"
    },
    contraindications: ["Transtorno bipolar"],
    expectedResults: ["Melhora de confiança social", "Redução de evitação"],
    notes: "Protocolo para fobia social"
  },

  // 3. DOR
  {
    id: "tdcs_007",
    name: "Dor Crônica - Nível Leve",
    indication: "pain",
    polarity: "anodal",
    intensity: 2,
    duration: 20,
    frequency: 0.5,
    sessionsPerWeek: 3,
    totalSessions: 10,
    electrodePositions: {
      anode: "M1 (Córtex motor primário - lado contralateral à dor)",
      cathode: "Mastóide ipsilateral"
    },
    contraindications: ["Epilepsia não controlada", "Implante metálico"],
    expectedResults: ["Redução de dor em 30-50%", "Melhora de qualidade de vida"],
    notes: "Protocolo motor para dor crônica"
  },
  {
    id: "tdcs_008",
    name: "Dor Crônica - Nível Moderado",
    indication: "pain",
    polarity: "anodal",
    intensity: 2,
    duration: 20,
    frequency: 1,
    sessionsPerWeek: 4,
    totalSessions: 15,
    electrodePositions: {
      anode: "M1 (Córtex motor primário)",
      cathode: "Mastóide ipsilateral"
    },
    contraindications: ["Epilepsia não controlada"],
    expectedResults: ["Redução de dor em 50-70%", "Melhora funcional"],
    notes: "Protocolo intensivo para dor crônica"
  },
  {
    id: "tdcs_009",
    name: "Fibromialgia",
    indication: "pain",
    polarity: "bilateral",
    intensity: 2,
    duration: 20,
    frequency: 1,
    sessionsPerWeek: 4,
    totalSessions: 16,
    electrodePositions: {
      anode: "M1 bilateral",
      cathode: "Mastóide bilateral"
    },
    contraindications: ["Epilepsia não controlada"],
    expectedResults: ["Redução de dor generalizada", "Melhora de fadiga"],
    notes: "Protocolo para fibromialgia"
  },

  // 4. COGNITIVO
  {
    id: "tdcs_010",
    name: "Déficit Cognitivo Leve",
    indication: "cognitive",
    polarity: "anodal",
    intensity: 1.5,
    duration: 20,
    frequency: 0.5,
    sessionsPerWeek: 3,
    totalSessions: 10,
    electrodePositions: {
      anode: "F3 (Córtex pré-frontal dorsolateral esquerdo)",
      cathode: "Mastóide direita"
    },
    contraindications: ["Demência avançada"],
    expectedResults: ["Melhora de memória em 20-30%", "Melhora de atenção"],
    notes: "Protocolo para déficit cognitivo leve"
  },
  {
    id: "tdcs_011",
    name: "Comprometimento Cognitivo Leve (CCL)",
    indication: "cognitive",
    polarity: "anodal",
    intensity: 2,
    duration: 20,
    frequency: 0.5,
    sessionsPerWeek: 3,
    totalSessions: 12,
    electrodePositions: {
      anode: "F3 (Córtex pré-frontal dorsolateral esquerdo)",
      cathode: "Mastóide direita"
    },
    contraindications: ["Demência avançada"],
    expectedResults: ["Desaceleração de declínio cognitivo", "Melhora de memória"],
    notes: "Protocolo preventivo para CCL"
  },
  {
    id: "tdcs_012",
    name: "Reabilitação Cognitiva Pós-AVC",
    indication: "cognitive",
    polarity: "anodal",
    intensity: 2,
    duration: 20,
    frequency: 1,
    sessionsPerWeek: 4,
    totalSessions: 15,
    electrodePositions: {
      anode: "Córtex pré-frontal dorsolateral (lado lesado)",
      cathode: "Mastóide contralateral"
    },
    contraindications: ["AVC agudo"],
    expectedResults: ["Melhora de funções cognitivas", "Aceleração de recuperação"],
    notes: "Protocolo pós-AVC para reabilitação cognitiva"
  },

  // 5. RECUPERAÇÃO MOTORA
  {
    id: "tdcs_013",
    name: "Paresia Pós-AVC",
    indication: "motor-recovery",
    polarity: "anodal",
    intensity: 2,
    duration: 20,
    frequency: 1,
    sessionsPerWeek: 4,
    totalSessions: 15,
    electrodePositions: {
      anode: "M1 (Córtex motor primário - lado lesado)",
      cathode: "Mastóide contralateral"
    },
    contraindications: ["AVC agudo"],
    expectedResults: ["Melhora de força em 30-50%", "Melhora de funcionalidade"],
    notes: "Protocolo para recuperação motora pós-AVC"
  },
  {
    id: "tdcs_014",
    name: "Reabilitação de Membro Superior Pós-AVC",
    indication: "motor-recovery",
    polarity: "anodal",
    intensity: 2,
    duration: 20,
    frequency: 1,
    sessionsPerWeek: 4,
    totalSessions: 16,
    electrodePositions: {
      anode: "M1 (Área de representação da mão - lado lesado)",
      cathode: "Mastóide contralateral"
    },
    contraindications: ["AVC agudo"],
    expectedResults: ["Melhora de destreza", "Recuperação de função"],
    notes: "Combinar com fisioterapia intensiva"
  },
  {
    id: "tdcs_015",
    name: "Parkinson - Bradicinesia",
    indication: "motor-recovery",
    polarity: "anodal",
    intensity: 2,
    duration: 20,
    frequency: 0.5,
    sessionsPerWeek: 3,
    totalSessions: 12,
    electrodePositions: {
      anode: "M1 (Córtex motor primário)",
      cathode: "Mastóide contralateral"
    },
    contraindications: ["Demência avançada"],
    expectedResults: ["Melhora de velocidade de movimento", "Melhora de funcionalidade"],
    notes: "Protocolo para bradicinesia em Parkinson"
  },

  // 6. ADIÇÃO
  {
    id: "tdcs_016",
    name: "Dependência de Álcool",
    indication: "addiction",
    polarity: "anodal",
    intensity: 2,
    duration: 20,
    frequency: 0.5,
    sessionsPerWeek: 3,
    totalSessions: 12,
    electrodePositions: {
      anode: "F3 (Córtex pré-frontal dorsolateral esquerdo)",
      cathode: "Fp2 (Fronte direita)"
    },
    contraindications: ["Intoxicação aguda", "Síndrome de abstinência severa"],
    expectedResults: ["Redução de craving em 40-50%", "Melhora de controle de impulso"],
    notes: "Combinar com terapia comportamental"
  },
  {
    id: "tdcs_017",
    name: "Dependência de Tabaco",
    indication: "addiction",
    polarity: "anodal",
    intensity: 2,
    duration: 20,
    frequency: 0.5,
    sessionsPerWeek: 3,
    totalSessions: 10,
    electrodePositions: {
      anode: "F3 (Córtex pré-frontal dorsolateral esquerdo)",
      cathode: "Fp2 (Fronte direita)"
    },
    contraindications: ["Nenhuma específica"],
    expectedResults: ["Redução de craving", "Melhora de taxa de cessação"],
    notes: "Protocolo para cessação de tabagismo"
  },
  {
    id: "tdcs_018",
    name: "Dependência de Cocaína",
    indication: "addiction",
    polarity: "anodal",
    intensity: 2,
    duration: 20,
    frequency: 1,
    sessionsPerWeek: 4,
    totalSessions: 15,
    electrodePositions: {
      anode: "F3 (Córtex pré-frontal dorsolateral esquerdo)",
      cathode: "Fp2 (Fronte direita)"
    },
    contraindications: ["Intoxicação aguda"],
    expectedResults: ["Redução de craving", "Melhora de controle de impulso"],
    notes: "Protocolo para dependência de cocaína"
  },

  // 7. ENXAQUECA
  {
    id: "tdcs_019",
    name: "Enxaqueca Episódica",
    indication: "migraine",
    polarity: "cathodal",
    intensity: 1.5,
    duration: 20,
    frequency: 0.5,
    sessionsPerWeek: 2,
    totalSessions: 8,
    electrodePositions: {
      anode: "Mastóide",
      cathode: "Córtex visual primário (Oz)"
    },
    contraindications: ["Enxaqueca com aura complexa"],
    expectedResults: ["Redução de frequência", "Redução de intensidade"],
    notes: "Protocolo preventivo para enxaqueca"
  },
  {
    id: "tdcs_020",
    name: "Enxaqueca Crônica",
    indication: "migraine",
    polarity: "cathodal",
    intensity: 2,
    duration: 20,
    frequency: 1,
    sessionsPerWeek: 3,
    totalSessions: 12,
    electrodePositions: {
      anode: "Mastóide",
      cathode: "Córtex visual primário (Oz)"
    },
    contraindications: ["Enxaqueca com aura complexa"],
    expectedResults: ["Redução de dias com enxaqueca", "Redução de medicação"],
    notes: "Protocolo para enxaqueca crônica"
  },

  // 8. ZUMBIDO
  {
    id: "tdcs_021",
    name: "Zumbido Subjetivo",
    indication: "tinnitus",
    polarity: "cathodal",
    intensity: 1.5,
    duration: 20,
    frequency: 0.5,
    sessionsPerWeek: 3,
    totalSessions: 10,
    electrodePositions: {
      anode: "Mastóide",
      cathode: "Córtex auditivo primário (T3/T4)"
    },
    contraindications: ["Nenhuma específica"],
    expectedResults: ["Redução de intensidade", "Melhora de qualidade de vida"],
    notes: "Protocolo para zumbido subjetivo"
  },
  {
    id: "tdcs_022",
    name: "Zumbido Resistente",
    indication: "tinnitus",
    polarity: "cathodal",
    intensity: 2,
    duration: 20,
    frequency: 1,
    sessionsPerWeek: 4,
    totalSessions: 15,
    electrodePositions: {
      anode: "Mastóide",
      cathode: "Córtex auditivo primário (T3/T4)"
    },
    contraindications: ["Nenhuma específica"],
    expectedResults: ["Redução de zumbido em 30-40%", "Melhora de incômodo"],
    notes: "Protocolo para zumbido resistente a tratamento"
  }
];

// Função para obter template por ID
export function getTDCSTemplate(id: string): TDCSTemplate | undefined {
  return TDCS_TEMPLATES.find(template => template.id === id);
}

// Função para obter templates por indicação
export function getTDCSTemplatesByIndication(indication: TDCSIndication): TDCSTemplate[] {
  return TDCS_TEMPLATES.filter(template => template.indication === indication);
}

// Função para criar plano de terapia tDCS
export function createTDCSTherapyPlan(
  patientId: string,
  templateId: string,
  startDate: string
): TDCSTherapyPlan | null {
  const template = getTDCSTemplate(templateId);
  if (!template) return null;

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + (template.totalSessions / template.sessionsPerWeek) * 7);

  return {
    id: `tdcs_plan_${Date.now()}`,
    patientId,
    templateId,
    startDate,
    endDate: endDate.toISOString().split('T')[0],
    sessionsCompleted: 0,
    electrodePositions: template.electrodePositions,
    frequency: template.sessionsPerWeek,
    status: "active",
    notes: ""
  };
}

// Função para comparar resultados entre LASER e tDCS
export function compareTherapyResults(
  laserPlanId: string,
  tdcsPlanId: string,
  laserResults: string,
  tdcsResults: string
): TDCSTherapyPlan["comparativeResults"] {
  return {
    laserPlanId,
    laserResults,
    tdcsResults
  };
}
