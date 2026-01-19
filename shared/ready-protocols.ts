/**
 * Protocolos Prontos Baseados no Manual
 * 12 protocolos pré-configurados para condições clínicas específicas
 * Fonte: Manual de Adesivos - Sistema 10-20
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
    name: "Afasia de Broca",
    condition: "Afasia Expressiva",
    objective: "Melhorar linguagem expressiva e reabilitação de coordenação motora fina",
    description: "Protocolo para tratamento de afasias expressivas (Broca) com estimulação da região frontal central responsável pela produção de fala.",
    targetRegions: ["Região Frontal Central (F)"],
    targetPoints: ["F3", "F4", "Fz"],
    frequency: 3,
    totalDuration: 12,
    notes: "Baseado no manual - Região Frontal Central. Indicado para afasia não-fluente com dificuldade na expressão verbal.",
    keywords: ["Afasia", "Broca", "Linguagem expressiva", "Fala"]
  },
  
  {
    id: "protocol-ataxia",
    name: "Ataxia Cerebelar",
    condition: "Ataxia",
    objective: "Reabilitação de equilíbrio, marcha e coordenação motora",
    description: "Protocolo para tratamento de ataxias cerebelares com estimulação da região cerebelar para melhorar coordenação e timing motor.",
    targetRegions: ["Região Cerebelar (Iz/Inf-O)"],
    targetPoints: ["Iz", "Inf-O"],
    frequency: 2,
    totalDuration: 10,
    notes: "Baseado no manual - Região Cerebelar. Suporte em distúrbios de timing motor e coordenação.",
    keywords: ["Ataxia", "Equilíbrio", "Marcha", "Coordenação", "Cerebelar"]
  },
  
  {
    id: "protocol-tinnitus",
    name: "Zumbido (Tinnitus)",
    condition: "Zumbido",
    objective: "Reduzir percepção de zumbido e melhorar qualidade auditiva",
    description: "Protocolo para tratamento de zumbido com estimulação da região temporal responsável pelo processamento auditivo.",
    targetRegions: ["Região Temporal (T)"],
    targetPoints: ["T3", "T4", "T5", "T6"],
    frequency: 2,
    totalDuration: 8,
    notes: "Baseado no manual - Região Temporal. Tratamento de zumbido (tinnitus) com acúfeno.",
    keywords: ["Zumbido", "Tinnitus", "Acúfeno", "Auditivo"]
  },
  
  {
    id: "protocol-apraxia",
    name: "Apraxia de Fala",
    condition: "Apraxia",
    objective: "Melhorar coordenação motora da fala e planejamento motor",
    description: "Protocolo para apraxia de fala com estimulação da região frontal central para reabilitação de coordenação motora fina e planejamento motor.",
    targetRegions: ["Região Frontal Central (F)"],
    targetPoints: ["F3", "F4", "F1", "F2"],
    frequency: 3,
    totalDuration: 12,
    notes: "Baseado no manual - Região Frontal Central. Suporte em transtornos de coordenação motora fina.",
    keywords: ["Apraxia", "Fala", "Coordenação motora", "Planejamento motor"]
  },
  
  {
    id: "protocol-dysarthria",
    name: "Disartria",
    condition: "Disartria",
    objective: "Melhorar articulação de fala e controle motor orofacial",
    description: "Protocolo para disartria com estimulação da região frontal central para reabilitação de coordenação motora fina e articulação.",
    targetRegions: ["Região Frontal Central (F)", "Região Central/Sensório-Motora (C)"],
    targetPoints: ["F3", "F4", "C3", "C4"],
    frequency: 3,
    totalDuration: 10,
    notes: "Baseado no manual - Regiões Frontal Central e Sensório-Motora. Melhora de articulação e controle motor.",
    keywords: ["Disartria", "Articulação", "Fala", "Controle motor"]
  },
  
  {
    id: "protocol-selectivity",
    name: "Seletividade Alimentar",
    condition: "Seletividade Alimentar",
    objective: "Melhorar aceitação alimentar e integração sensorial",
    description: "Protocolo para seletividade alimentar com estimulação da região sensório-motora para melhorar integração sensorial e aceitação de alimentos.",
    targetRegions: ["Região Central/Sensório-Motora (C/FC/CP)"],
    targetPoints: ["C3", "C4", "CP3", "CP4"],
    frequency: 2,
    totalDuration: 12,
    notes: "Baseado no manual - Região Sensório-Motora. Suporte em distúrbios de integração sensorial.",
    keywords: ["Seletividade alimentar", "Integração sensorial", "Alimentação", "Sensorial"]
  },
  
  {
    id: "protocol-parkinson",
    name: "Doença de Parkinson",
    condition: "Parkinson",
    objective: "Controle de tremores e melhora de coordenação motora",
    description: "Protocolo para Parkinson com estimulação da região sensório-motora para controle de tremores e melhora da coordenação motora.",
    targetRegions: ["Região Central/Sensório-Motora (C/FC/CP)"],
    targetPoints: ["C3", "C4", "Cz", "CP3", "CP4"],
    frequency: 3,
    totalDuration: 12,
    notes: "Baseado no manual - Região Sensório-Motora. Controle de tremores em Parkinson e epilepsias focais.",
    keywords: ["Parkinson", "Tremor", "Coordenação motora", "Movimento"]
  },
  
  {
    id: "protocol-alzheimer",
    name: "Alzheimer Precoce",
    condition: "Alzheimer",
    objective: "Reabilitação de memória e manutenção de função cognitiva",
    description: "Protocolo para Alzheimer precoce com estimulação da região temporal para reabilitação de memória e preservação de função cognitiva.",
    targetRegions: ["Região Temporal (T)"],
    targetPoints: ["T3", "T4", "T5"],
    frequency: 2,
    totalDuration: 16,
    notes: "Baseado no manual - Região Temporal. Reabilitação de memória em Alzheimer precoce.",
    keywords: ["Alzheimer", "Memória", "Demência", "Cognitivo"]
  },
  
  {
    id: "protocol-tea",
    name: "Transtorno do Espectro Autista",
    condition: "TEA",
    objective: "Suporte em transtornos do espectro autista e melhora de coordenação motora",
    description: "Protocolo para TEA com estimulação da região frontal central para suporte em transtornos do espectro autista e reabilitação de coordenação motora.",
    targetRegions: ["Região Frontal Central (F)"],
    targetPoints: ["F3", "F4", "F7", "F8"],
    frequency: 2,
    totalDuration: 12,
    notes: "Baseado no manual - Região Frontal Central. Suporte em transtornos do espectro autista.",
    keywords: ["TEA", "Autismo", "Espectro autista", "Coordenação motora"]
  },
  
  {
    id: "protocol-social-language",
    name: "Linguagem Social",
    condition: "Distúrbios de Linguagem Social",
    objective: "Melhorar compreensão e produção de linguagem social",
    description: "Protocolo para distúrbios de linguagem social com estimulação de regiões temporal e frontal para melhorar compreensão (Wernicke) e expressão social.",
    targetRegions: ["Região Temporal (T)", "Região Frontal Central (F)"],
    targetPoints: ["T3", "T4", "F3", "F4"],
    frequency: 3,
    totalDuration: 12,
    notes: "Baseado no manual - Regiões Temporal (Wernicke) e Frontal Central. Melhora de compreensão e expressão de linguagem social.",
    keywords: ["Linguagem social", "Compreensão", "Expressão", "Interação social"]
  },
  
  {
    id: "protocol-vppb",
    name: "Vertigem Posicional Paroxística Benigna",
    condition: "VPPB",
    objective: "Reabilitação de equilíbrio e redução de vertigem",
    description: "Protocolo para VPPB com estimulação da região cerebelar para reabilitação de equilíbrio e redução de sintomas vertiginosos.",
    targetRegions: ["Região Cerebelar (Iz/Inf-O)"],
    targetPoints: ["Iz", "Inf-O"],
    frequency: 2,
    totalDuration: 8,
    notes: "Baseado no manual - Região Cerebelar. Reabilitação de equilíbrio e marcha em distúrbios de timing motor.",
    keywords: ["VPPB", "Vertigem", "Equilíbrio", "Posicional"]
  },
  
  {
    id: "protocol-depression",
    name: "Depressão Resistente",
    condition: "Depressão",
    objective: "Tratamento de depressão maior resistente e melhora de funções executivas",
    description: "Protocolo para depressão maior resistente com estimulação da região frontal anterior para melhora de humor e funções executivas.",
    targetRegions: ["Região Frontal Anterior (Fp)"],
    targetPoints: ["Fp1", "Fp2"],
    frequency: 3,
    totalDuration: 12,
    notes: "Baseado no manual - Região Frontal Anterior. Depressão maior resistente e transtornos de ansiedade.",
    keywords: ["Depressão", "Humor", "Executivas", "Resistente"]
  }
];

/**
 * Obter protocolo por ID
 */
export function getProtocolById(id: string): ReadyProtocol | undefined {
  return READY_PROTOCOLS.find(protocol => protocol.id === id);
}

/**
 * Buscar protocolos por condição
 */
export function searchProtocolsByCondition(condition: string): ReadyProtocol[] {
  const lowerCondition = condition.toLowerCase();
  return READY_PROTOCOLS.filter(protocol =>
    protocol.condition.toLowerCase().includes(lowerCondition) ||
    protocol.name.toLowerCase().includes(lowerCondition) ||
    protocol.keywords.some(k => k.toLowerCase().includes(lowerCondition))
  );
}

/**
 * Obter todos os protocolos
 */
export function getAllProtocols(): ReadyProtocol[] {
  return READY_PROTOCOLS;
}

/**
 * Obter lista de condições disponíveis
 */
export function getAvailableConditions(): string[] {
  return READY_PROTOCOLS.map(p => p.condition).sort();
}
