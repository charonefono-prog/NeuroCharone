/**
 * Referência fidedigna do Manual de Adesivos - Sistema 10-20
 * Fonte: adesivosmanual(3).pdf
 * 
 * Este arquivo contém as informações oficiais do manual sobre:
 * - Regiões cerebrais e suas aplicações clínicas
 * - Pontos do sistema 10-20 em destaque (coloridos no manual)
 * - Palavras-chave para busca
 */

export interface RegionInfo {
  id: string;
  name: string;
  abbreviation: string;
  color: string;
  applications: string[];
  keywords: string[];
  points: string[];
}

export const BRAIN_REGIONS: RegionInfo[] = [
  {
    id: "fp",
    name: "Região Frontal Anterior",
    abbreviation: "Fp",
    color: "#FF69B4", // Rosa/Pink
    applications: [
      "Depressão maior resistente",
      "Transtornos de ansiedade generalizada",
      "Reabilitação de funções executivas",
      "Controle de impulsividade em TDAH"
    ],
    keywords: ["Depressão", "Ansiedade", "TDAH", "Executivas", "Impulsividade"],
    points: ["Fp1", "Fp2", "Fpz"]
  },
  {
    id: "af",
    name: "Região Frontal Média",
    abbreviation: "AF",
    color: "#FFA500", // Laranja
    applications: [
      "Treinamento de foco atencional",
      "Monitoramento de fadiga cognitiva em ambientes de alta performance",
      "Modulação da tomada de decisão"
    ],
    keywords: ["Foco", "Atenção", "Fadiga cognitiva", "Decisão", "Performance"],
    points: ["AF3", "AF4", "AFz"]
  },
  {
    id: "f",
    name: "Região Frontal Central",
    abbreviation: "F",
    color: "#FFFF00", // Amarelo
    applications: [
      "Tratamento de afasias expressivas (Broca)",
      "Reabilitação de coordenação motora fina",
      "Suporte em transtornos do espectro autista"
    ],
    keywords: ["Afasia", "Broca", "Linguagem expressiva", "Coordenação motora", "Autismo"],
    points: ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "Fz"]
  },
  {
    id: "c",
    name: "Região Central / Sensório-Motora",
    abbreviation: "C/FC/CP",
    color: "#00CED1", // Ciano/Turquesa
    applications: [
      "Manejo de dor crônica neuropática",
      "Reabilitação pós-AVC (hemiparesias)",
      "Controle de tremores em Parkinson",
      "Epilepsias focais"
    ],
    keywords: ["Dor crônica", "AVC", "Hemiparesia", "Tremor", "Parkinson", "Epilepsia", "Neuropática"],
    points: ["C1", "C2", "C3", "C4", "C5", "C6", "Cz", "FC1", "FC2", "FC5", "FC6", "FCz", "CP1", "CP2", "CP5", "CP6", "CPz"]
  },
  {
    id: "t",
    name: "Região Temporal",
    abbreviation: "T",
    color: "#00AA00", // Verde
    applications: [
      "Reabilitação de memória em Alzheimer precoce",
      "Tratamento de zumbido (tinnitus)",
      "Distúrbios de compreensão de linguagem (Wernicke)"
    ],
    keywords: ["Memória", "Alzheimer", "Zumbido", "Tinnitus", "Linguagem", "Wernicke", "Compreensão"],
    points: ["T3", "T4", "T5", "T6"]
  },
  {
    id: "p",
    name: "Região Parietal",
    abbreviation: "P",
    color: "#9370DB", // Roxo/Púrpura
    applications: [
      "Tratamento de discalculia",
      "Correção de negligência espacial unilateral",
      "Suporte em distúrbios de integração sensorial"
    ],
    keywords: ["Discalculia", "Negligência espacial", "Integração sensorial", "Espacial"],
    points: ["P1", "P2", "P3", "P4", "P5", "P6", "Pz"]
  },
  {
    id: "po",
    name: "Região Parieto-Occipital",
    abbreviation: "PO",
    color: "#9370DB", // Roxo/Púrpura (mais escuro)
    applications: [
      "Melhora da coordenação visomotora em atletas",
      "Reabilitação de ataxia óptica",
      "Distúrbios de percepção de profundidade"
    ],
    keywords: ["Coordenação visomotora", "Ataxia", "Visão", "Percepção profundidade"],
    points: ["PO3", "PO4", "POz"]
  },
  {
    id: "o",
    name: "Região Occipital",
    abbreviation: "O",
    color: "#FF6B6B", // Vermelho/Rosa claro
    applications: [
      "Tratamento de enxaquecas com aura visual",
      "Suporte em cegueira cortical",
      "Modulação de distúrbios do processamento visual primário"
    ],
    keywords: ["Enxaqueca", "Aura visual", "Cegueira cortical", "Visão", "Processamento visual"],
    points: ["O1", "O2", "Oz"]
  },
  {
    id: "iz",
    name: "Região Cerebelar",
    abbreviation: "Iz/Inf-O",
    color: "#808080", // Cinza
    applications: [
      "Reabilitação de equilíbrio e marcha",
      "Tratamento de ataxias cerebelares",
      "Suporte em distúrbios de timing motor e coordenação"
    ],
    keywords: ["Equilíbrio", "Marcha", "Ataxia", "Cerebelar", "Coordenação", "Timing motor"],
    points: ["Iz", "Inf-O"]
  }
];

/**
 * Pontos em destaque do manual (coloridos)
 * Estes são os pontos principais com aplicações clínicas específicas
 */
export const HIGHLIGHTED_POINTS = [
  // Frontal Anterior (Pink)
  "Fp1", "Fp2", "Fpz",
  // Frontal Média (Orange)
  "AF3", "AF4", "AFz",
  // Frontal Central (Yellow)
  "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "Fz",
  // Central/Sensório-Motora (Cyan)
  "C1", "C2", "C3", "C4", "C5", "C6", "Cz",
  "FC1", "FC2", "FC5", "FC6", "FCz",
  "CP1", "CP2", "CP5", "CP6", "CPz",
  // Temporal (Green)
  "T3", "T4", "T5", "T6",
  // Parietal (Purple)
  "P1", "P2", "P3", "P4", "P5", "P6", "Pz",
  // Parieto-Occipital (Dark Purple)
  "PO3", "PO4", "POz",
  // Occipital (Red/Pink)
  "O1", "O2", "Oz",
  // Cerebelar (Gray)
  "Iz", "Inf-O"
];

/**
 * Mapa de palavras-chave para busca
 * Permite encontrar regiões/pontos por condições clínicas
 */
export const KEYWORD_TO_REGION: Record<string, string[]> = {
  // Depressão
  "depressão": ["fp"],
  "depressivo": ["fp"],
  
  // Ansiedade
  "ansiedade": ["fp"],
  "ansioso": ["fp"],
  
  // TDAH
  "tdah": ["fp"],
  "hiperatividade": ["fp"],
  "impulsividade": ["fp"],
  
  // Atenção
  "atenção": ["af"],
  "foco": ["af"],
  "concentração": ["af"],
  
  // Fadiga cognitiva
  "fadiga cognitiva": ["af"],
  "cansaço mental": ["af"],
  
  // Linguagem
  "linguagem": ["f", "t"],
  "afasia": ["f"],
  "broca": ["f"],
  "wernicke": ["t"],
  "expressiva": ["f"],
  "compreensão": ["t"],
  
  // Coordenação motora
  "coordenação motora": ["f"],
  "motora fina": ["f"],
  
  // Autismo
  "autismo": ["f"],
  "espectro autista": ["f"],
  "tea": ["f"],
  
  // Dor
  "dor crônica": ["c"],
  "dor neuropática": ["c"],
  "neuropática": ["c"],
  
  // AVC
  "avc": ["c"],
  "acidente vascular": ["c"],
  "hemiparesia": ["c"],
  "paresia": ["c"],
  
  // Parkinson
  "parkinson": ["c"],
  "tremor": ["c"],
  
  // Epilepsia
  "epilepsia": ["c"],
  "convulsão": ["c"],
  "crise": ["c"],
  
  // Memória
  "memória": ["t"],
  "alzheimer": ["t"],
  "demência": ["t"],
  
  // Zumbido
  "zumbido": ["t"],
  "tinnitus": ["t"],
  "acúfeno": ["t"],
  
  // Discalculia
  "discalculia": ["p"],
  "cálculo": ["p"],
  "matemática": ["p"],
  
  // Negligência espacial
  "negligência": ["p"],
  "espacial": ["p"],
  "unilateral": ["p"],
  
  // Integração sensorial
  "integração sensorial": ["p"],
  "sensorial": ["p"],
  
  // Visão
  "visão": ["po", "o"],
  "visomotor": ["po"],
  "coordenação visomotora": ["po"],
  "ataxia óptica": ["po"],
  "percepção profundidade": ["po"],
  
  // Enxaqueca
  "enxaqueca": ["o"],
  "migraine": ["o"],
  "cefaleia": ["o"],
  "aura visual": ["o"],
  
  // Cegueira cortical
  "cegueira cortical": ["o"],
  "cortical": ["o"],
  
  // Processamento visual
  "processamento visual": ["o"],
  "visual": ["o"],
  
  // Equilíbrio
  "equilíbrio": ["iz"],
  "marcha": ["iz"],
  "ataxia": ["iz"],
  "cerebelar": ["iz"],
  "coordenação": ["iz"],
  "timing motor": ["iz"]
};

/**
 * Função para buscar regiões por palavra-chave
 */
export function searchRegionsByKeyword(keyword: string): RegionInfo[] {
  const normalizedKeyword = keyword.toLowerCase().trim();
  const regionIds = KEYWORD_TO_REGION[normalizedKeyword] || [];
  
  return BRAIN_REGIONS.filter(region => regionIds.includes(region.id));
}

/**
 * Função para obter informações de uma região
 */
export function getRegionInfo(regionId: string): RegionInfo | undefined {
  return BRAIN_REGIONS.find(region => region.id === regionId);
}

/**
 * Função para obter todas as palavras-chave disponíveis
 */
export function getAllKeywords(): string[] {
  return Object.keys(KEYWORD_TO_REGION).sort();
}
