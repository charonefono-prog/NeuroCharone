/**
 * Protocolos Prontos Baseados no Manual - APENAS PONTOS COLORIDOS
 * 12 protocolos pré-configurados para condições clínicas específicas
 * Fonte: Manual de Adesivos - Sistema 10-20 (apenas áreas coloridas)
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
    description: "Protocolo para tratamento de afasias expressivas (Broca) com estimulação da região frontal central responsável pela produção de fala.",
    targetRegions: ["Região Frontal Central (F)"],
    targetPoints: ["F3", "F4", "Fz"],
    frequency: 3,
    totalDuration: 12,
    notes: "Baseado no manual - Região Frontal Central (amarelo). Indicado para afasia não-fluente com dificuldade na expressão verbal.",
    keywords: ["Afasia", "Broca", "Linguagem expressiva", "Fala"]
  },
  
  {
    id: "protocol-ataxia",
    name: "Ataxia Cerebelar",
    condition: "Ataxia",
    objective: "Reabilitação de equilíbrio, marcha e coordenação motora",
    description: "Protocolo para tratamento de ataxias cerebelares com estimulação da região cerebelar para melhorar coordenação e timing motor.",
    targetRegions: ["Região Temporal (T)"],
    targetPoints: ["T3", "T4"],
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
    targetRegions: ["Região Temporal (T)"],
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
    description: "Protocolo para tratamento de apraxia de fala com estimulação da região frontal central.",
    targetRegions: ["Região Frontal Central (F)"],
    targetPoints: ["F3", "F4", "F1", "F2"],
    frequency: 3,
    totalDuration: 12,
    notes: "Baseado no manual - Região Frontal Central (amarelo). Suporte em distúrbios de planejamento motor da fala.",
    keywords: ["Apraxia", "Fala", "Coordenação motora", "Planejamento"]
  },
  
  {
    id: "protocol-disartria",
    name: "Disartria",
    condition: "Disartria",
    objective: "Melhorar articulação e clareza de fala",
    description: "Protocolo para tratamento de disartria com estimulação da região frontal central e sensório-motora.",
    targetRegions: ["Região Frontal Central (F)", "Região Central / Sensório-Motora (C/FC/CP)"],
    targetPoints: ["F3", "F4", "C3", "C4"],
    frequency: 3,
    totalDuration: 10,
    notes: "Baseado no manual - Regiões Frontal Central (amarelo) e Central (ciano). Indicado para disartria de origem neurológica.",
    keywords: ["Disartria", "Fala", "Articulação", "Clareza"]
  },
  
  {
    id: "protocol-seletividade-alimentar",
    name: "Seletividade Alimentar",
    condition: "Seletividade Alimentar",
    objective: "Melhorar aceitação de alimentos e coordenação sensório-motora oral",
    description: "Protocolo para tratamento de seletividade alimentar com estimulação da região sensório-motora.",
    targetRegions: ["Região Central / Sensório-Motora (C/FC/CP)"],
    targetPoints: ["C3", "C4", "CP1", "CP2"],
    frequency: 2,
    totalDuration: 12,
    notes: "Baseado no manual - Região Central / Sensório-Motora (ciano). Suporte em distúrbios sensoriais orais.",
    keywords: ["Seletividade alimentar", "Alimentação", "Sensório-motor", "Oral"]
  },
  
  {
    id: "protocol-parkinson",
    name: "Parkinson",
    condition: "Doença de Parkinson",
    objective: "Controle de tremores, rigidez e melhora da mobilidade",
    description: "Protocolo para tratamento de sintomas motores da doença de Parkinson com estimulação da região sensório-motora.",
    targetRegions: ["Região Central / Sensório-Motora (C/FC/CP)"],
    targetPoints: ["C3", "C4", "Cz", "CP1", "CP2"],
    frequency: 3,
    totalDuration: 12,
    notes: "Baseado no manual - Região Central / Sensório-Motora (ciano). Indicado para controle de tremores e rigidez.",
    keywords: ["Parkinson", "Tremor", "Rigidez", "Mobilidade"]
  },
  
  {
    id: "protocol-alzheimer",
    name: "Alzheimer",
    condition: "Doença de Alzheimer Precoce",
    objective: "Reabilitação de memória e preservação cognitiva",
    description: "Protocolo para tratamento de Alzheimer precoce com estimulação da região temporal responsável pela memória.",
    targetRegions: ["Região Temporal (T)"],
    targetPoints: ["T3", "T4", "T5"],
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
    description: "Protocolo para suporte em transtornos do espectro autista com estimulação da região frontal central.",
    targetRegions: ["Região Frontal Central (F)"],
    targetPoints: ["F3", "F4", "F1", "F2"],
    frequency: 2,
    totalDuration: 12,
    notes: "Baseado no manual - Região Frontal Central (amarelo). Suporte em coordenação motora fina.",
    keywords: ["TEA", "Autismo", "Espectro autista", "Sensorial"]
  },
  
  {
    id: "protocol-linguagem-social",
    name: "Linguagem Social",
    condition: "Distúrbios de Linguagem Social",
    objective: "Melhorar compreensão e produção de linguagem social",
    description: "Protocolo para tratamento de distúrbios de linguagem social com estimulação das regiões frontal e temporal.",
    targetRegions: ["Região Frontal Central (F)", "Região Temporal (T)"],
    targetPoints: ["F3", "F4", "T3", "T4"],
    frequency: 3,
    totalDuration: 12,
    notes: "Baseado no manual - Regiões Frontal Central (amarelo) e Temporal (verde). Indicado para pragmática e compreensão social.",
    keywords: ["Linguagem social", "Pragmática", "Compreensão", "Interação social"]
  },
  
  {
    id: "protocol-vppb",
    name: "VPPB",
    condition: "Vertigem Posicional Paroxística Benigna",
    objective: "Reabilitação de equilíbrio e redução de vertigem",
    description: "Protocolo para tratamento de VPPB com estimulação da região temporal.",
    targetRegions: ["Região Temporal (T)"],
    targetPoints: ["T3", "T4"],
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
    targetRegions: ["Região Frontal Anterior (Fp)"],
    targetPoints: ["Fp1", "Fp2", "Fpz"],
    frequency: 3,
    totalDuration: 12,
    notes: "Baseado no manual - Região Frontal Anterior (rosa). Indicado para depressão resistente a tratamento farmacológico.",
    keywords: ["Depressão", "Humor", "Funções executivas", "Resistente"]
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
