/**
 * Templates LASER para Neuromodulação
 * 28 templates clínicos baseados em protocolos estabelecidos
 */

export type LaserIndication = 
  | "pain" 
  | "inflammation" 
  | "wound-healing" 
  | "neurological" 
  | "musculoskeletal" 
  | "dermatological" 
  | "vascular" 
  | "lymphatic";

export interface LaserTemplate {
  id: string;
  name: string;
  indication: LaserIndication;
  wavelength: number; // em nanômetros
  power: number; // em mW
  frequency: number; // em Hz
  duration: number; // em segundos
  sessionsPerWeek: number;
  totalSessions: number;
  targetAreas: string[];
  contraindications: string[];
  expectedResults: string[];
  notes: string;
}

export interface LaserTherapyPlan {
  id: string;
  patientId: string;
  templateId: string;
  startDate: string;
  endDate: string;
  sessionsCompleted: number;
  targetAreas: string[];
  frequency: number; // sessões por semana
  status: "active" | "completed" | "paused";
  notes: string;
}

// ============================================
// TEMPLATES LASER - 28 Protocolos
// ============================================

export const LASER_TEMPLATES: LaserTemplate[] = [
  // 1. DOR CRÔNICA
  {
    id: "laser_001",
    name: "Dor Crônica - Nível Leve",
    indication: "pain",
    wavelength: 808,
    power: 50,
    frequency: 2,
    duration: 120,
    sessionsPerWeek: 2,
    totalSessions: 10,
    targetAreas: ["Área afetada"],
    contraindications: ["Câncer ativo", "Gravidez", "Infecção aguda"],
    expectedResults: ["Redução de dor em 30-50%", "Melhora da mobilidade"],
    notes: "Aplicar diretamente sobre a área dolorosa"
  },
  {
    id: "laser_002",
    name: "Dor Crônica - Nível Moderado",
    indication: "pain",
    wavelength: 808,
    power: 100,
    frequency: 5,
    duration: 180,
    sessionsPerWeek: 3,
    totalSessions: 15,
    targetAreas: ["Área afetada", "Pontos de acupuntura"],
    contraindications: ["Câncer ativo", "Gravidez", "Infecção aguda"],
    expectedResults: ["Redução de dor em 50-70%", "Melhora funcional"],
    notes: "Combinar com pontos de acupuntura para melhor resultado"
  },
  {
    id: "laser_003",
    name: "Dor Crônica - Nível Severo",
    indication: "pain",
    wavelength: 1064,
    power: 150,
    frequency: 10,
    duration: 240,
    sessionsPerWeek: 3,
    totalSessions: 20,
    targetAreas: ["Área afetada", "Pontos de acupuntura", "Nervos periféricos"],
    contraindications: ["Câncer ativo", "Gravidez", "Infecção aguda"],
    expectedResults: ["Redução de dor em 70%+", "Retorno às atividades"],
    notes: "Protocolo intensivo - avaliar resposta após 5 sessões"
  },

  // 2. INFLAMAÇÃO
  {
    id: "laser_004",
    name: "Inflamação Aguda",
    indication: "inflammation",
    wavelength: 660,
    power: 30,
    frequency: 1,
    duration: 60,
    sessionsPerWeek: 1,
    totalSessions: 5,
    targetAreas: ["Área inflamada"],
    contraindications: ["Febre alta", "Infecção sistêmica"],
    expectedResults: ["Redução de edema", "Melhora de eritema"],
    notes: "Usar potência baixa para não estimular inflamação"
  },
  {
    id: "laser_005",
    name: "Inflamação Crônica",
    indication: "inflammation",
    wavelength: 808,
    power: 80,
    frequency: 3,
    duration: 150,
    sessionsPerWeek: 2,
    totalSessions: 12,
    targetAreas: ["Área inflamada", "Articulações"],
    contraindications: ["Febre", "Infecção ativa"],
    expectedResults: ["Redução de inflamação", "Melhora de mobilidade"],
    notes: "Protocolo para artrite, tendinite e bursites"
  },

  // 3. CICATRIZAÇÃO E FERIDAS
  {
    id: "laser_006",
    name: "Cicatrização Acelerada",
    indication: "wound-healing",
    wavelength: 660,
    power: 40,
    frequency: 2,
    duration: 90,
    sessionsPerWeek: 2,
    totalSessions: 8,
    targetAreas: ["Ferida", "Bordas da ferida"],
    contraindications: ["Câncer de pele", "Infecção não tratada"],
    expectedResults: ["Aceleração de cicatrização em 30%", "Redução de cicatriz"],
    notes: "Iniciar após limpeza adequada da ferida"
  },
  {
    id: "laser_007",
    name: "Úlceras Diabéticas",
    indication: "wound-healing",
    wavelength: 808,
    power: 60,
    frequency: 3,
    duration: 120,
    sessionsPerWeek: 3,
    totalSessions: 15,
    targetAreas: ["Úlcera", "Bordas", "Tecido perilesional"],
    contraindications: ["Infecção ativa não controlada"],
    expectedResults: ["Cicatrização acelerada", "Redução de profundidade"],
    notes: "Combinar com cuidados locais e controle glicêmico"
  },
  {
    id: "laser_008",
    name: "Queimaduras",
    indication: "wound-healing",
    wavelength: 660,
    power: 25,
    frequency: 1,
    duration: 60,
    sessionsPerWeek: 1,
    totalSessions: 10,
    targetAreas: ["Área queimada"],
    contraindications: ["Queimadura de espessura total"],
    expectedResults: ["Alívio de dor", "Cicatrização acelerada"],
    notes: "Usar após estabilização inicial da queimadura"
  },

  // 4. NEUROLÓGICO
  {
    id: "laser_009",
    name: "Neuropatia Periférica",
    indication: "neurological",
    wavelength: 808,
    power: 100,
    frequency: 5,
    duration: 180,
    sessionsPerWeek: 2,
    totalSessions: 12,
    targetAreas: ["Nervos periféricos", "Pés", "Mãos"],
    contraindications: ["Neuropatia com perda sensorial severa"],
    expectedResults: ["Melhora de sensibilidade", "Redução de parestesias"],
    notes: "Protocolo para diabéticos e pós-quimioterapia"
  },
  {
    id: "laser_010",
    name: "Paralisia de Bell",
    indication: "neurological",
    wavelength: 808,
    power: 80,
    frequency: 3,
    duration: 120,
    sessionsPerWeek: 3,
    totalSessions: 10,
    targetAreas: ["Nervo facial", "Músculos faciais"],
    contraindications: ["Paralisia central"],
    expectedResults: ["Recuperação de movimento", "Melhora de simetria"],
    notes: "Iniciar o mais cedo possível após diagnóstico"
  },
  {
    id: "laser_011",
    name: "Enxaqueca e Cefaleia",
    indication: "neurological",
    wavelength: 660,
    power: 50,
    frequency: 2,
    duration: 90,
    sessionsPerWeek: 2,
    totalSessions: 8,
    targetAreas: ["Pontos de acupuntura", "Cervical"],
    contraindications: ["Cefaleia de causa não diagnosticada"],
    expectedResults: ["Redução de frequência", "Redução de intensidade"],
    notes: "Combinar com relaxamento muscular"
  },
  {
    id: "laser_012",
    name: "Parkinson - Rigidez",
    indication: "neurological",
    wavelength: 808,
    power: 120,
    frequency: 5,
    duration: 180,
    sessionsPerWeek: 2,
    totalSessions: 16,
    targetAreas: ["Músculos rígidos", "Gânglios da base"],
    contraindications: ["Demência avançada"],
    expectedResults: ["Redução de rigidez", "Melhora de mobilidade"],
    notes: "Protocolo específico para Parkinson"
  },

  // 5. MUSCULOESQUELÉTICO
  {
    id: "laser_013",
    name: "Tendinite",
    indication: "musculoskeletal",
    wavelength: 808,
    power: 90,
    frequency: 4,
    duration: 150,
    sessionsPerWeek: 2,
    totalSessions: 10,
    targetAreas: ["Tendão afetado"],
    contraindications: ["Ruptura de tendão"],
    expectedResults: ["Redução de inflamação", "Retorno à atividade"],
    notes: "Combinar com repouso relativo e fisioterapia"
  },
  {
    id: "laser_014",
    name: "Artrite Reumatoide",
    indication: "musculoskeletal",
    wavelength: 808,
    power: 100,
    frequency: 5,
    duration: 180,
    sessionsPerWeek: 3,
    totalSessions: 15,
    targetAreas: ["Articulações afetadas"],
    contraindications: ["Artrite séptica"],
    expectedResults: ["Redução de dor", "Melhora de mobilidade"],
    notes: "Combinar com medicação e fisioterapia"
  },
  {
    id: "laser_015",
    name: "Osteoartrite",
    indication: "musculoskeletal",
    wavelength: 1064,
    power: 110,
    frequency: 5,
    duration: 180,
    sessionsPerWeek: 2,
    totalSessions: 12,
    targetAreas: ["Articulações degeneradas"],
    contraindications: ["Artrite séptica"],
    expectedResults: ["Redução de dor", "Melhora funcional"],
    notes: "Protocolo para joelho, quadril e coluna"
  },
  {
    id: "laser_016",
    name: "Bursite",
    indication: "musculoskeletal",
    wavelength: 808,
    power: 80,
    frequency: 3,
    duration: 120,
    sessionsPerWeek: 2,
    totalSessions: 8,
    targetAreas: ["Bolsa sinovial"],
    contraindications: ["Bursite séptica"],
    expectedResults: ["Redução de edema", "Alívio de dor"],
    notes: "Combinar com repouso e gelo inicial"
  },
  {
    id: "laser_017",
    name: "Esporão de Calcâneo",
    indication: "musculoskeletal",
    wavelength: 808,
    power: 100,
    frequency: 4,
    duration: 150,
    sessionsPerWeek: 2,
    totalSessions: 12,
    targetAreas: ["Calcâneo", "Fáscia plantar"],
    contraindications: ["Nenhuma contraindicação específica"],
    expectedResults: ["Redução de dor", "Melhora da marcha"],
    notes: "Protocolo para fascite plantar"
  },
  {
    id: "laser_018",
    name: "Síndrome do Túnel do Carpo",
    indication: "musculoskeletal",
    wavelength: 808,
    power: 90,
    frequency: 4,
    duration: 150,
    sessionsPerWeek: 2,
    totalSessions: 10,
    targetAreas: ["Punho", "Nervo mediano"],
    contraindications: ["Compressão severa"],
    expectedResults: ["Redução de parestesias", "Melhora de força"],
    notes: "Combinar com órtese e exercícios"
  },

  // 6. DERMATOLÓGICO
  {
    id: "laser_019",
    name: "Acne",
    indication: "dermatological",
    wavelength: 660,
    power: 40,
    frequency: 2,
    duration: 90,
    sessionsPerWeek: 1,
    totalSessions: 8,
    targetAreas: ["Rosto", "Costas"],
    contraindications: ["Isotretinoína recente"],
    expectedResults: ["Redução de lesões", "Melhora de cicatrizes"],
    notes: "Protocolo para acne moderada"
  },
  {
    id: "laser_020",
    name: "Dermatite Atópica",
    indication: "dermatological",
    wavelength: 660,
    power: 30,
    frequency: 1,
    duration: 60,
    sessionsPerWeek: 1,
    totalSessions: 10,
    targetAreas: ["Áreas afetadas"],
    contraindications: ["Infecção ativa"],
    expectedResults: ["Redução de prurido", "Cicatrização de lesões"],
    notes: "Combinar com hidratação e medicação tópica"
  },
  {
    id: "laser_021",
    name: "Psoríase",
    indication: "dermatological",
    wavelength: 808,
    power: 60,
    frequency: 2,
    duration: 120,
    sessionsPerWeek: 2,
    totalSessions: 12,
    targetAreas: ["Placas psoriásicas"],
    contraindications: ["Fototoxicidade"],
    expectedResults: ["Redução de placas", "Melhora de eritema"],
    notes: "Protocolo para psoríase leve a moderada"
  },
  {
    id: "laser_022",
    name: "Cicatrizes Hipertróficas",
    indication: "dermatological",
    wavelength: 660,
    power: 50,
    frequency: 2,
    duration: 90,
    sessionsPerWeek: 1,
    totalSessions: 10,
    targetAreas: ["Cicatriz"],
    contraindications: ["Queloides agressivos"],
    expectedResults: ["Aplanamento de cicatriz", "Melhora de cor"],
    notes: "Protocolo pós-operatório"
  },

  // 7. VASCULAR
  {
    id: "laser_023",
    name: "Úlceras Venosas",
    indication: "vascular",
    wavelength: 808,
    power: 70,
    frequency: 3,
    duration: 120,
    sessionsPerWeek: 2,
    totalSessions: 12,
    targetAreas: ["Úlcera", "Tecido perilesional"],
    contraindications: ["Trombose venosa profunda"],
    expectedResults: ["Cicatrização acelerada", "Redução de edema"],
    notes: "Combinar com compressão e elevação"
  },
  {
    id: "laser_024",
    name: "Insuficiência Vascular",
    indication: "vascular",
    wavelength: 808,
    power: 100,
    frequency: 5,
    duration: 180,
    sessionsPerWeek: 2,
    totalSessions: 15,
    targetAreas: ["Membros afetados"],
    contraindications: ["Trombose ativa"],
    expectedResults: ["Melhora de circulação", "Redução de claudicação"],
    notes: "Protocolo para claudicação intermitente"
  },

  // 8. LINFÁTICO
  {
    id: "laser_025",
    name: "Linfedema Pós-Mastectomia",
    indication: "lymphatic",
    wavelength: 808,
    power: 80,
    frequency: 3,
    duration: 150,
    sessionsPerWeek: 2,
    totalSessions: 12,
    targetAreas: ["Braço afetado", "Axila"],
    contraindications: ["Infecção ativa"],
    expectedResults: ["Redução de edema", "Melhora de mobilidade"],
    notes: "Combinar com drenagem linfática manual"
  },
  {
    id: "laser_026",
    name: "Linfedema Primário",
    indication: "lymphatic",
    wavelength: 808,
    power: 90,
    frequency: 4,
    duration: 150,
    sessionsPerWeek: 2,
    totalSessions: 15,
    targetAreas: ["Membros afetados"],
    contraindications: ["Infecção ativa"],
    expectedResults: ["Redução de edema", "Melhora funcional"],
    notes: "Protocolo de longo prazo"
  },
  {
    id: "laser_027",
    name: "Edema Pós-Operatório",
    indication: "lymphatic",
    wavelength: 660,
    power: 40,
    frequency: 1,
    duration: 90,
    sessionsPerWeek: 1,
    totalSessions: 5,
    targetAreas: ["Área operada"],
    contraindications: ["Infecção de ferida"],
    expectedResults: ["Redução de edema", "Aceleração de recuperação"],
    notes: "Iniciar 48h após cirurgia"
  },
  {
    id: "laser_028",
    name: "Protocolo Geral de Manutenção",
    indication: "pain",
    wavelength: 808,
    power: 70,
    frequency: 2,
    duration: 120,
    sessionsPerWeek: 1,
    totalSessions: 8,
    targetAreas: ["Áreas de manutenção"],
    contraindications: ["Nenhuma específica"],
    expectedResults: ["Manutenção de ganhos", "Prevenção de recidiva"],
    notes: "Protocolo para manutenção após tratamento principal"
  }
];

// Função para obter template por ID
export function getLaserTemplate(id: string): LaserTemplate | undefined {
  return LASER_TEMPLATES.find(template => template.id === id);
}

// Função para obter templates por indicação
export function getLaserTemplatesByIndication(indication: LaserIndication): LaserTemplate[] {
  return LASER_TEMPLATES.filter(template => template.indication === indication);
}

// Função para criar plano de terapia LASER
export function createLaserTherapyPlan(
  patientId: string,
  templateId: string,
  startDate: string,
  targetAreas: string[]
): LaserTherapyPlan | null {
  const template = getLaserTemplate(templateId);
  if (!template) return null;

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + (template.totalSessions / template.sessionsPerWeek) * 7);

  return {
    id: `plan_${Date.now()}`,
    patientId,
    templateId,
    startDate,
    endDate: endDate.toISOString().split('T')[0],
    sessionsCompleted: 0,
    targetAreas,
    frequency: template.sessionsPerWeek,
    status: "active",
    notes: ""
  };
}
