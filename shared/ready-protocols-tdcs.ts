/**
 * Protocolos Prontos para tDCS (Estimulação Transcraniana por Corrente Contínua)
 * 12 protocolos pré-configurados adaptados para tDCS
 * Baseado no Sistema 10-20 EEG
 */

export interface ReadyProtocolTDCS {
  id: string;
  name: string;
  condition: string;
  objective: string;
  description: string;
  targetRegions: string[];
  targetPoints: string[];
  frequency: number; // sessões por semana
  totalDuration: number; // semanas
  // Parâmetros específicos de tDCS
  intensity: number; // mA (tipicamente 1-2 mA)
  duration: number; // minutos por sessão
  polarity: "anodal" | "cathodal" | "bilateral"; // polaridade
  notes: string;
  keywords: string[];
}

export const READY_PROTOCOLS_TDCS: ReadyProtocolTDCS[] = [
  {
    id: "tdcs-protocol-afasia",
    name: "Afasia (tDCS)",
    condition: "Afasia",
    objective: "Melhorar linguagem expressiva e reabilitação de coordenação motora fina",
    description: "Protocolo tDCS para tratamento de afasias expressivas (Broca) com estimulação anodal da região frontal média.",
    targetRegions: ["frontal-media"],
    targetPoints: ["F3", "F4", "Fz"],
    frequency: 3,
    totalDuration: 12,
    intensity: 1.5,
    duration: 20,
    polarity: "anodal",
    notes: "Estimulação anodal em F3 (área de Broca). Eletrodo de referência em Fp2. Indicado para afasia não-fluente.",
    keywords: ["Afasia", "Broca", "Linguagem expressiva", "Fala", "tDCS"]
  },

  {
    id: "tdcs-protocol-ataxia",
    name: "Ataxia Cerebelar (tDCS)",
    condition: "Ataxia",
    objective: "Reabilitação de equilíbrio, marcha e coordenação motora",
    description: "Protocolo tDCS para tratamento de ataxias cerebelares com estimulação da região temporal.",
    targetRegions: ["temporal"],
    targetPoints: ["T3", "T4", "T5", "T6"],
    frequency: 2,
    totalDuration: 10,
    intensity: 1.5,
    duration: 20,
    polarity: "anodal",
    notes: "Estimulação bilateral das regiões temporais. Suporte em distúrbios de timing motor e coordenação.",
    keywords: ["Ataxia", "Equilíbrio", "Marcha", "Coordenação", "Cerebelar", "tDCS"]
  },

  {
    id: "tdcs-protocol-zumbido",
    name: "Zumbido (tDCS)",
    condition: "Tinnitus",
    objective: "Redução de zumbido e melhora da qualidade de vida auditiva",
    description: "Protocolo tDCS para tratamento de zumbido com estimulação cathodal da região temporal.",
    targetRegions: ["temporal"],
    targetPoints: ["T3", "T4"],
    frequency: 2,
    totalDuration: 8,
    intensity: 2.0,
    duration: 20,
    polarity: "cathodal",
    notes: "Estimulação cathodal em T3/T4 (córtex auditivo primário). Eletrodo de referência em Fp2.",
    keywords: ["Zumbido", "Tinnitus", "Audição", "Som", "tDCS"]
  },

  {
    id: "tdcs-protocol-apraxia",
    name: "Apraxia (tDCS)",
    condition: "Apraxia de Fala",
    objective: "Melhorar coordenação motora de fala e planejamento motor",
    description: "Protocolo tDCS para tratamento de apraxia de fala com estimulação anodal da região frontal média.",
    targetRegions: ["frontal-media"],
    targetPoints: ["F3", "F4", "F7", "F8", "Fz"],
    frequency: 3,
    totalDuration: 12,
    intensity: 1.5,
    duration: 20,
    polarity: "anodal",
    notes: "Estimulação anodal bilateral em F3/F4. Suporte em distúrbios de planejamento motor da fala.",
    keywords: ["Apraxia", "Fala", "Coordenação motora", "Planejamento", "tDCS"]
  },

  {
    id: "tdcs-protocol-disartria",
    name: "Disartria (tDCS)",
    condition: "Disartria",
    objective: "Melhorar articulação e clareza de fala",
    description: "Protocolo tDCS para tratamento de disartria com estimulação bilateral da região frontal média e sensório-motora.",
    targetRegions: ["frontal-media", "central-sensoriomotora"],
    targetPoints: ["F3", "F4", "Fz", "C3", "C4", "Cz"],
    frequency: 3,
    totalDuration: 10,
    intensity: 1.5,
    duration: 20,
    polarity: "bilateral",
    notes: "Estimulação bilateral: anodal em F3/C3, cathodal em F4/C4. Indicado para disartria de origem neurológica.",
    keywords: ["Disartria", "Fala", "Articulação", "Clareza", "tDCS"]
  },

  {
    id: "tdcs-protocol-seletividade-alimentar",
    name: "Seletividade Alimentar (tDCS)",
    condition: "Seletividade Alimentar",
    objective: "Melhorar aceitação de alimentos e coordenação sensório-motora oral",
    description: "Protocolo tDCS para tratamento de seletividade alimentar com estimulação da região sensório-motora.",
    targetRegions: ["central-sensoriomotora"],
    targetPoints: ["C3", "C4", "Cz", "CP1", "CP2"],
    frequency: 2,
    totalDuration: 12,
    intensity: 1.5,
    duration: 20,
    polarity: "anodal",
    notes: "Estimulação anodal em C3/C4 (córtex motor/sensório-motor). Suporte em distúrbios sensoriais orais.",
    keywords: ["Seletividade alimentar", "Alimentação", "Sensório-motor", "Oral", "tDCS"]
  },

  {
    id: "tdcs-protocol-parkinson",
    name: "Parkinson (tDCS)",
    condition: "Doença de Parkinson",
    objective: "Controle de tremores, rigidez e melhora da mobilidade",
    description: "Protocolo tDCS para tratamento de sintomas motores da doença de Parkinson com estimulação anodal da região sensório-motora.",
    targetRegions: ["central-sensoriomotora"],
    targetPoints: ["C3", "C4", "Cz", "CP1", "CP2", "CP5", "CP6"],
    frequency: 3,
    totalDuration: 12,
    intensity: 2.0,
    duration: 20,
    polarity: "anodal",
    notes: "Estimulação anodal bilateral em C3/C4. Indicado para controle de tremores e rigidez.",
    keywords: ["Parkinson", "Tremor", "Rigidez", "Mobilidade", "tDCS"]
  },

  {
    id: "tdcs-protocol-alzheimer",
    name: "Alzheimer (tDCS)",
    condition: "Doença de Alzheimer Precoce",
    objective: "Reabilitação de memória e preservação cognitiva",
    description: "Protocolo tDCS para tratamento de Alzheimer precoce com estimulação anodal da região temporal.",
    targetRegions: ["temporal"],
    targetPoints: ["T3", "T4", "T5", "T6"],
    frequency: 2,
    totalDuration: 16,
    intensity: 1.5,
    duration: 20,
    polarity: "anodal",
    notes: "Estimulação anodal bilateral em T3/T4 (córtex temporal medial). Suporte em reabilitação de memória.",
    keywords: ["Alzheimer", "Memória", "Cognitivo", "Demência", "tDCS"]
  },

  {
    id: "tdcs-protocol-tea",
    name: "TEA (tDCS)",
    condition: "Transtorno do Espectro Autista",
    objective: "Suporte em coordenação motora e processamento sensorial",
    description: "Protocolo tDCS para suporte em transtornos do espectro autista com estimulação anodal da região frontal média.",
    targetRegions: ["frontal-media"],
    targetPoints: ["F3", "F4", "F7", "F8", "Fz"],
    frequency: 2,
    totalDuration: 12,
    intensity: 1.5,
    duration: 20,
    polarity: "anodal",
    notes: "Estimulação anodal bilateral em F3/F4. Suporte em coordenação motora fina e processamento sensorial.",
    keywords: ["TEA", "Autismo", "Espectro autista", "Sensorial", "tDCS"]
  },

  {
    id: "tdcs-protocol-linguagem-social",
    name: "Linguagem Social (tDCS)",
    condition: "Déficit de Linguagem Social",
    objective: "Melhorar habilidades de comunicação e interação social",
    description: "Protocolo tDCS para melhora de linguagem social com estimulação anodal da região frontal média.",
    targetRegions: ["frontal-media"],
    targetPoints: ["F3", "F4", "F7", "F8"],
    frequency: 2,
    totalDuration: 10,
    intensity: 1.5,
    duration: 20,
    polarity: "anodal",
    notes: "Estimulação anodal bilateral em F3/F4 (área de Broca e pré-motora). Suporte em pragmática linguística.",
    keywords: ["Linguagem social", "Comunicação", "Interação social", "Pragmática", "tDCS"]
  },

  {
    id: "tdcs-protocol-depressao",
    name: "Depressão (tDCS)",
    condition: "Transtorno Depressivo Maior",
    objective: "Melhora do humor e redução de sintomas depressivos",
    description: "Protocolo tDCS para tratamento de depressão com estimulação anodal da região dorsolateral pré-frontal esquerda.",
    targetRegions: ["frontal-dorsolateral"],
    targetPoints: ["F3", "F7"],
    frequency: 5,
    totalDuration: 4,
    intensity: 2.0,
    duration: 30,
    polarity: "anodal",
    notes: "Estimulação anodal em F3 (DLPFC esquerdo), eletrodo de referência em Fp2. Protocolo intensivo.",
    keywords: ["Depressão", "Humor", "Sintomas depressivos", "Transtorno do humor", "tDCS"]
  },

  {
    id: "tdcs-protocol-ansiedade",
    name: "Ansiedade (tDCS)",
    condition: "Transtorno de Ansiedade",
    objective: "Redução de sintomas de ansiedade e melhora do controle emocional",
    description: "Protocolo tDCS para tratamento de ansiedade com estimulação anodal da região dorsolateral pré-frontal.",
    targetRegions: ["frontal-dorsolateral"],
    targetPoints: ["F3", "F4"],
    frequency: 3,
    totalDuration: 8,
    intensity: 1.5,
    duration: 20,
    polarity: "anodal",
    notes: "Estimulação anodal bilateral em F3/F4 (DLPFC). Suporte em regulação emocional.",
    keywords: ["Ansiedade", "Transtorno de ansiedade", "Controle emocional", "Regulação", "tDCS"]
  },

  {
    id: "tdcs-protocol-dor-cronica",
    name: "Dor Crônica (tDCS)",
    condition: "Dor Crônica",
    objective: "Redução de dor crônica e melhora da qualidade de vida",
    description: "Protocolo tDCS para tratamento de dor crônica com estimulação anodal da região motora primária.",
    targetRegions: ["central-sensoriomotora"],
    targetPoints: ["C3", "C4", "Cz"],
    frequency: 3,
    totalDuration: 10,
    intensity: 2.0,
    duration: 20,
    polarity: "anodal",
    notes: "Estimulação anodal em C3/C4 (córtex motor primário). Indicado para dor crônica neuropática e musculoesquelética.",
    keywords: ["Dor crônica", "Neuropática", "Musculoesquelética", "Qualidade de vida", "tDCS"]
  }
];
