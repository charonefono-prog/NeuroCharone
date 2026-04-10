/**
 * Protocolos Prontos Baseados no Manual NEUROADESIVO FINAL
 * 12 protocolos pré-configurados para condições clínicas específicas
 * Fonte: Manual de Adesivos - Sistema 10-20 (APENAS PONTOS DO DOCUMENTO)
 */

export interface ReadyProtocol {
  id: string;
  name: string;
  condition: string;
  objective: string;
  description: string;
  targetRegions: string[];
  targetPoints: string[];
  frequency: number; // sessões por semana
  totalDuration: number; // semanas
  notes: string;
  keywords: string[];
}

export const READY_PROTOCOLS: ReadyProtocol[] = [
  {
    id: "protocol-afasia",
    name: "Afasia",
    condition: "Afasia",
    objective: "Melhorar linguagem expressiva e reabilitação de coordenação motora fina",
    description: "Protocolo para tratamento de afasias expressivas (Broca) com estimulação da região frontal média responsável pela produção de fala.",
    targetRegions: ["frontal-media"],
    targetPoints: ["F3", "F4", "Fz"],
    frequency: 3,
    totalDuration: 12,
    notes: "Baseado no manual - Região Frontal Média (amarelo). Indicado para afasia não-fluente com dificuldade na expressão verbal.",
    keywords: ["Afasia", "Broca", "Linguagem expressiva", "Fala"]
  },
  
  {
    id: "protocol-ataxia",
    name: "Ataxia Cerebelar",
    condition: "Ataxia",
    objective: "Reabilitação de equilíbrio, marcha e coordenação motora",
    description: "Protocolo para tratamento de ataxias cerebelares com estimulação da região temporal para melhorar coordenação e timing motor.",
    targetRegions: ["temporal"],
    targetPoints: ["T3", "T4", "T5", "T6"],
    frequency: 2,
    totalDuration: 10,
    notes: "Baseado no manual - Região Temporal (verde). Suporte em distúrbios de timing motor e coordenação.",
    keywords: ["Ataxia", "Equilíbrio", "Marcha", "Coordenação", "Cerebelar"]
  },
  
  {
    id: "protocol-zumbido",
    name: "Zumbido",
    condition: "Tinnitus",
    objective: "Redução de zumbido e melhora da qualidade de vida auditiva",
    description: "Protocolo para tratamento de zumbido (tinnitus) com estimulação da região temporal responsável pelo processamento auditivo.",
    targetRegions: ["temporal"],
    targetPoints: ["T3", "T4"],
    frequency: 2,
    totalDuration: 8,
    notes: "Baseado no manual - Região Temporal (verde). Indicado para zumbido persistente.",
    keywords: ["Zumbido", "Tinnitus", "Audição", "Som"]
  },
  
  {
    id: "protocol-apraxia",
    name: "Apraxia",
    condition: "Apraxia de Fala",
    objective: "Melhorar coordenação motora de fala e planejamento motor",
    description: "Protocolo para tratamento de apraxia de fala com estimulação da região frontal média.",
    targetRegions: ["frontal-media"],
    targetPoints: ["F3", "F4", "F7", "F8", "Fz"],
    frequency: 3,
    totalDuration: 12,
    notes: "Baseado no manual - Região Frontal Média (amarelo). Suporte em distúrbios de planejamento motor da fala.",
    keywords: ["Apraxia", "Fala", "Coordenação motora", "Planejamento"]
  },
  
  {
    id: "protocol-disartria",
    name: "Disartria",
    condition: "Disartria",
    objective: "Melhorar articulação e clareza de fala",
    description: "Protocolo para tratamento de disartria com estimulação da região frontal média e sensório-motora.",
    targetRegions: ["frontal-media", "central-sensoriomotora"],
    targetPoints: ["F3", "F4", "Fz", "C3", "C4", "Cz"],
    frequency: 3,
    totalDuration: 10,
    notes: "Baseado no manual - Regiões Frontal Média (amarelo) e Central/Sensório-Motora (ciano). Indicado para disartria de origem neurológica.",
    keywords: ["Disartria", "Fala", "Articulação", "Clareza"]
  },
  
  {
    id: "protocol-seletividade-alimentar",
    name: "Seletividade Alimentar",
    condition: "Seletividade Alimentar",
    objective: "Melhorar aceitação de alimentos e coordenação sensório-motora oral",
    description: "Protocolo para tratamento de seletividade alimentar com estimulação da região sensório-motora.",
    targetRegions: ["central-sensoriomotora"],
    targetPoints: ["C3", "C4", "Cz", "CP1", "CP2"],
    frequency: 2,
    totalDuration: 12,
    notes: "Baseado no manual - Região Central/Sensório-Motora (ciano). Suporte em distúrbios sensoriais orais.",
    keywords: ["Seletividade alimentar", "Alimentação", "Sensório-motor", "Oral"]
  },
  
  {
    id: "protocol-parkinson",
    name: "Parkinson",
    condition: "Doença de Parkinson",
    objective: "Controle de tremores, rigidez e melhora da mobilidade",
    description: "Protocolo para tratamento de sintomas motores da doença de Parkinson com estimulação da região sensório-motora.",
    targetRegions: ["central-sensoriomotora"],
    targetPoints: ["C3", "C4", "Cz", "CP1", "CP2", "CP5", "CP6"],
    frequency: 3,
    totalDuration: 12,
    notes: "Baseado no manual - Região Central/Sensório-Motora (ciano). Indicado para controle de tremores e rigidez.",
    keywords: ["Parkinson", "Tremor", "Rigidez", "Mobilidade"]
  },
  
  {
    id: "protocol-alzheimer",
    name: "Alzheimer",
    condition: "Doença de Alzheimer Precoce",
    objective: "Reabilitação de memória e preservação cognitiva",
    description: "Protocolo para tratamento de Alzheimer precoce com estimulação da região temporal responsável pela memória.",
    targetRegions: ["temporal"],
    targetPoints: ["T3", "T4", "T5", "T6"],
    frequency: 2,
    totalDuration: 16,
    notes: "Baseado no manual - Região Temporal (verde). Suporte em reabilitação de memória.",
    keywords: ["Alzheimer", "Memória", "Cognitivo", "Demência"]
  },
  
  {
    id: "protocol-tea",
    name: "TEA",
    condition: "Transtorno do Espectro Autista",
    objective: "Suporte em coordenação motora e processamento sensorial",
    description: "Protocolo para suporte em transtornos do espectro autista com estimulação da região frontal média.",
    targetRegions: ["frontal-media"],
    targetPoints: ["F3", "F4", "F7", "F8", "Fz"],
    frequency: 2,
    totalDuration: 12,
    notes: "Baseado no manual - Região Frontal Média (amarelo). Suporte em coordenação motora fina.",
    keywords: ["TEA", "Autismo", "Espectro autista", "Sensorial"]
  },
  
  {
    id: "protocol-linguagem-social",
    name: "Linguagem Social",
    condition: "Distúrbios de Linguagem Social",
    objective: "Melhorar compreensão e produção de linguagem social",
    description: "Protocolo para tratamento de distúrbios de linguagem social com estimulação das regiões frontal e temporal.",
    targetRegions: ["frontal-media", "temporal"],
    targetPoints: ["F3", "F4", "Fz", "T3", "T4"],
    frequency: 3,
    totalDuration: 12,
    notes: "Baseado no manual - Regiões Frontal Média (amarelo) e Temporal (verde). Indicado para pragmática e compreensão social.",
    keywords: ["Linguagem social", "Pragmática", "Compreensão", "Interação social"]
  },
  
  {
    id: "protocol-vppb",
    name: "VPPB",
    condition: "Vertigem Posicional Paroxística Benigna",
    objective: "Reabilitação de equilíbrio e redução de vertigem",
    description: "Protocolo para tratamento de VPPB com estimulação da região temporal.",
    targetRegions: ["temporal"],
    targetPoints: ["T3", "T4", "T5", "T6"],
    frequency: 2,
    totalDuration: 8,
    notes: "Baseado no manual - Região Temporal (verde). Suporte em distúrbios vestibulares.",
    keywords: ["VPPB", "Vertigem", "Equilíbrio", "Vestibular"]
  },
  
  {
    id: "protocol-depressao",
    name: "Depressão",
    condition: "Depressão Maior Resistente",
    objective: "Melhora de sintomas depressivos e reabilitação de funções executivas",
    description: "Protocolo para tratamento de depressão maior resistente com estimulação da região frontal anterior.",
    targetRegions: ["frontal-anterior"],
    targetPoints: ["Fp1", "Fp2", "Fpz"],
    frequency: 3,
    totalDuration: 12,
    notes: "Baseado no manual - Região Frontal Anterior (rosa). Indicado para depressão resistente a tratamento farmacológico.",
    keywords: ["Depressão", "Humor", "Funções executivas", "Resistente"]
  },

  // NOVOS TEMPLATES DE FOTOBIOMODULAÇÃO TRANSCRANIANA
  {
    id: "protocol-tpbm-depressao-resistente",
    name: "Fotobiomodulação - Depressão Resistente",
    condition: "Depressão Resistente",
    objective: "Melhora de sintomas depressivos com fotobiomodulação transcraniana",
    description: "Protocolo de fotobiomodulação transcraniana para depressão resistente a tratamento farmacológico.",
    targetRegions: ["frontal-anterior", "frontal-media"],
    targetPoints: ["Fp1", "Fp2", "Fpz", "F3", "F4", "Fz"],
    frequency: 3,
    totalDuration: 12,
    notes: "Fotobiomodulação transcraniana. 36 sessões totais.",
    keywords: ["Fotobiomodulação", "tPBM", "Depressão", "Resistente"]
  },

  {
    id: "protocol-tpbm-dor-neuropatica",
    name: "Fotobiomodulação - Dor Neuropática",
    condition: "Dor Neuropática",
    objective: "Redução de dor neuropática com fotobiomodulação transcraniana",
    description: "Protocolo de fotobiomodulação transcraniana para manejo de dor neuropática.",
    targetRegions: ["central-sensoriomotora"],
    targetPoints: ["C3", "C4", "Cz", "CP1", "CP2"],
    frequency: 2,
    totalDuration: 10,
    notes: "Fotobiomodulação transcraniana. 20 sessões totais.",
    keywords: ["Fotobiomodulação", "tPBM", "Dor", "Neuropática"]
  },

  {
    id: "protocol-tpbm-parkinson-avancado",
    name: "Fotobiomodulação - Parkinson Avançado",
    condition: "Parkinson Avançado",
    objective: "Melhora de sintomas motores em Parkinson avançado",
    description: "Protocolo de fotobiomodulação transcraniana para sintomas motores em Parkinson.",
    targetRegions: ["central-sensoriomotora"],
    targetPoints: ["C3", "C4", "Cz", "CP1", "CP2", "CP5", "CP6"],
    frequency: 3,
    totalDuration: 12,
    notes: "Fotobiomodulação transcraniana. 36 sessões totais.",
    keywords: ["Fotobiomodulação", "tPBM", "Parkinson", "Motor"]
  },

  {
    id: "protocol-tpbm-avc-recuperacao",
    name: "Fotobiomodulação - AVC Recuperação",
    condition: "Acidente Vascular Cerebral",
    objective: "Recuperação neurológica pós-AVC com fotobiomodulação",
    description: "Protocolo de fotobiomodulação transcraniana para recuperação após acidente vascular cerebral.",
    targetRegions: ["central-sensoriomotora", "frontal-media"],
    targetPoints: ["C3", "C4", "Cz", "F3", "F4", "Fz"],
    frequency: 5,
    totalDuration: 8,
    notes: "Fotobiomodulação transcraniana. 40 sessões totais (intensivo).",
    keywords: ["Fotobiomodulação", "tPBM", "AVC", "Recuperação"]
  },

  {
    id: "protocol-tpbm-ccl",
    name: "Fotobiomodulação - Comprometimento Cognitivo Leve",
    condition: "Comprometimento Cognitivo Leve",
    objective: "Preservação cognitiva em comprometimento cognitivo leve",
    description: "Protocolo de fotobiomodulação transcraniana para preservação de funções cognitivas.",
    targetRegions: ["temporal", "parietal"],
    targetPoints: ["T3", "T4", "T5", "T6", "P3", "P4", "Pz"],
    frequency: 2,
    totalDuration: 16,
    notes: "Fotobiomodulação transcraniana. 32 sessões totais.",
    keywords: ["Fotobiomodulação", "tPBM", "Cognitivo", "Memória"]
  },

  {
    id: "protocol-tpbm-enxaqueca",
    name: "Fotobiomodulação - Enxaqueca Crônica",
    condition: "Enxaqueca Crônica",
    objective: "Redução de frequência e intensidade de enxaquecas",
    description: "Protocolo de fotobiomodulação transcraniana para manejo de enxaqueca crônica.",
    targetRegions: ["frontal-anterior", "parietal"],
    targetPoints: ["Fp1", "Fp2", "Fpz", "P3", "P4", "Pz"],
    frequency: 2,
    totalDuration: 12,
    notes: "Fotobiomodulação transcraniana. 24 sessões totais.",
    keywords: ["Fotobiomodulação", "tPBM", "Enxaqueca", "Dor"]
  },

  {
    id: "protocol-tpbm-tinnitus-avancado",
    name: "Fotobiomodulação - Tinnitus",
    condition: "Tinnitus",
    objective: "Redução de sintomas de tinnitus com fotobiomodulação",
    description: "Protocolo de fotobiomodulação transcraniana para tratamento de tinnitus.",
    targetRegions: ["temporal"],
    targetPoints: ["T3", "T4", "T5", "T6"],
    frequency: 3,
    totalDuration: 10,
    notes: "Fotobiomodulação transcraniana. 30 sessões totais.",
    keywords: ["Fotobiomodulação", "tPBM", "Tinnitus", "Audição"]
  },

  {
    id: "protocol-tpbm-fibromialgia",
    name: "Fotobiomodulação - Fibromialgia",
    condition: "Fibromialgia",
    objective: "Redução de dor generalizada e melhora de qualidade de vida",
    description: "Protocolo de fotobiomodulação transcraniana para manejo de fibromialgia.",
    targetRegions: ["central-sensoriomotora", "frontal-media"],
    targetPoints: ["C3", "C4", "Cz", "CP1", "CP2", "F3", "F4"],
    frequency: 2,
    totalDuration: 12,
    notes: "Fotobiomodulação transcraniana. 24 sessões totais.",
    keywords: ["Fotobiomodulação", "tPBM", "Fibromialgia", "Dor"]
  },

  {
    id: "protocol-tpbm-afasia-avancada",
    name: "Fotobiomodulação - Afasia",
    condition: "Afasia Pós-AVC",
    objective: "Recuperação de linguagem com fotobiomodulação transcraniana",
    description: "Protocolo de fotobiomodulação transcraniana para recuperação de afasia.",
    targetRegions: ["frontal-media", "temporal"],
    targetPoints: ["F3", "F4", "Fz", "T3", "T4"],
    frequency: 4,
    totalDuration: 10,
    notes: "Fotobiomodulação transcraniana. 40 sessões totais.",
    keywords: ["Fotobiomodulação", "tPBM", "Afasia", "Linguagem"]
  },

  {
    id: "protocol-tpbm-ataxia-avancada",
    name: "Fotobiomodulação - Ataxia",
    condition: "Ataxia Cerebelar",
    objective: "Melhora de coordenação e equilíbrio com fotobiomodulação",
    description: "Protocolo de fotobiomodulação transcraniana para ataxia cerebelar.",
    targetRegions: ["temporal", "parietal"],
    targetPoints: ["T3", "T4", "T5", "T6", "P3", "P4"],
    frequency: 3,
    totalDuration: 12,
    notes: "Fotobiomodulação transcraniana. 36 sessões totais.",
    keywords: ["Fotobiomodulação", "tPBM", "Ataxia", "Coordenação"]
  },

  {
    id: "protocol-tpbm-alzheimer-precoce",
    name: "Fotobiomodulação - Alzheimer Precoce",
    condition: "Alzheimer Precoce",
    objective: "Preservação de memória em Alzheimer precoce",
    description: "Protocolo de fotobiomodulação transcraniana para Alzheimer em estágio precoce.",
    targetRegions: ["temporal", "parietal"],
    targetPoints: ["T3", "T4", "T5", "T6", "P3", "P4", "Pz"],
    frequency: 2,
    totalDuration: 16,
    notes: "Fotobiomodulação transcraniana. 32 sessões totais.",
    keywords: ["Fotobiomodulação", "tPBM", "Alzheimer", "Memória"]
  },
];

export function getProtocolById(id: string): ReadyProtocol | undefined {
  return READY_PROTOCOLS.find(p => p.id === id);
}

export function getProtocolsByCondition(condition: string): ReadyProtocol[] {
  return READY_PROTOCOLS.filter(p => 
    p.condition.toLowerCase().includes(condition.toLowerCase()) ||
    p.name.toLowerCase().includes(condition.toLowerCase())
  );
}

export function searchProtocolsByCondition(searchTerm: string): ReadyProtocol[] {
  const term = searchTerm.toLowerCase();
  return READY_PROTOCOLS.filter(p => 
    p.name.toLowerCase().includes(term) ||
    p.condition.toLowerCase().includes(term) ||
    p.keywords.some(k => k.toLowerCase().includes(term))
  );
}

export function getAllProtocols(): ReadyProtocol[] {
  return READY_PROTOCOLS;
}
