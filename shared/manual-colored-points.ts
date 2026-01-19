/**
 * 35 PONTOS COLORIDOS DO MANUAL - Sistema 10-20
 * Apenas os pontos visíveis e coloridos na imagem do capacete
 * Fonte: Manual de Adesivos - Imagem colorida com 35 pontos exatos
 */

export interface ColoredPoint {
  name: string;
  color: string;
  region: string;
  applications: string[];
  description: string;
}

export interface ColoredRegion {
  id: string;
  name: string;
  colorHex: string;
  points: string[];
  applications: string[];
}

/**
 * 35 PONTOS COLORIDOS EXATOS DA IMAGEM:
 * Rosa (3): Fp1, Fp2, Fpz
 * Laranja (5): AF3, AF4, AFz, AF7, AF8
 * Amarelo (5): F3, F4, F1, F2, Fz
 * Ciano (13): FC3, FC1, FCz, FC2, FC4, C5, C3, C1, Cz, C2, C4, C6, CP3, CP1, CPz, CP2, CP4
 * Verde (4): T9, T3, T4, T10
 * Roxo (5): P3, P1, Pz, P2, P4
 * Rosa claro (3): O1, Oz, O2
 */

export const COLORED_POINTS: ColoredPoint[] = [
  // ROSA - Frontal Anterior (3 pontos)
  {
    name: "Fp1",
    color: "#FF69B4",
    region: "Frontal Anterior",
    applications: ["Depressão", "Ansiedade", "Transtorno do humor"],
    description: "Ponto frontal anterior esquerdo - Processamento emocional e regulação do humor"
  },
  {
    name: "Fp2",
    color: "#FF69B4",
    region: "Frontal Anterior",
    applications: ["Depressão", "Ansiedade", "Transtorno do humor"],
    description: "Ponto frontal anterior direito - Processamento emocional e regulação do humor"
  },
  {
    name: "Fpz",
    color: "#FF69B4",
    region: "Frontal Anterior",
    applications: ["Depressão", "Ansiedade", "Regulação emocional"],
    description: "Ponto frontal anterior central - Integração emocional bilateral"
  },

  // LARANJA - Frontal Média (5 pontos)
  {
    name: "AF3",
    color: "#FFA500",
    region: "Frontal Média",
    applications: ["Atenção", "Foco", "Concentração"],
    description: "Ponto frontal médio esquerdo - Atenção e foco"
  },
  {
    name: "AF4",
    color: "#FFA500",
    region: "Frontal Média",
    applications: ["Atenção", "Foco", "Concentração"],
    description: "Ponto frontal médio direito - Atenção e foco"
  },
  {
    name: "AFz",
    color: "#FFA500",
    region: "Frontal Média",
    applications: ["Atenção", "Foco", "Integração atencional"],
    description: "Ponto frontal médio central - Integração atencional bilateral"
  },
  {
    name: "AF7",
    color: "#FFA500",
    region: "Frontal Média",
    applications: ["Atenção", "Foco"],
    description: "Ponto frontal médio esquerdo anterior - Atenção"
  },
  {
    name: "AF8",
    color: "#FFA500",
    region: "Frontal Média",
    applications: ["Atenção", "Foco"],
    description: "Ponto frontal médio direito anterior - Atenção"
  },

  // AMARELO - Frontal Central (5 pontos)
  {
    name: "F3",
    color: "#FFFF00",
    region: "Frontal Central",
    applications: ["Afasia", "Linguagem expressiva", "Broca"],
    description: "Ponto frontal central esquerdo - Área de Broca (produção de fala)"
  },
  {
    name: "F4",
    color: "#FFFF00",
    region: "Frontal Central",
    applications: ["Afasia", "Linguagem expressiva"],
    description: "Ponto frontal central direito - Linguagem expressiva"
  },
  {
    name: "F1",
    color: "#FFFF00",
    region: "Frontal Central",
    applications: ["Linguagem", "Coordenação motora"],
    description: "Ponto frontal central esquerdo mediano - Linguagem"
  },
  {
    name: "F2",
    color: "#FFFF00",
    region: "Frontal Central",
    applications: ["Linguagem", "Coordenação motora"],
    description: "Ponto frontal central direito mediano - Linguagem"
  },
  {
    name: "Fz",
    color: "#FFFF00",
    region: "Frontal Central",
    applications: ["Linguagem bilateral", "Coordenação"],
    description: "Ponto frontal central mediano - Integração bilateral"
  },

  // CIANO - Central / Sensório-Motora (13 pontos)
  {
    name: "FC3",
    color: "#00CED1",
    region: "Central / Sensório-Motora",
    applications: ["Controle motor", "Sensação"],
    description: "Ponto frontocentral esquerdo - Integração sensório-motora"
  },
  {
    name: "FC1",
    color: "#00CED1",
    region: "Central / Sensório-Motora",
    applications: ["Controle motor", "Sensação"],
    description: "Ponto frontocentral esquerdo mediano - Integração sensório-motora"
  },
  {
    name: "FCz",
    color: "#00CED1",
    region: "Central / Sensório-Motora",
    applications: ["Controle motor", "Coordenação bilateral"],
    description: "Ponto frontocentral central - Integração motora bilateral"
  },
  {
    name: "FC2",
    color: "#00CED1",
    region: "Central / Sensório-Motora",
    applications: ["Controle motor", "Sensação"],
    description: "Ponto frontocentral direito mediano - Integração sensório-motora"
  },
  {
    name: "FC4",
    color: "#00CED1",
    region: "Central / Sensório-Motora",
    applications: ["Controle motor", "Sensação", "Coordenação"],
    description: "Ponto frontocentral direito - Integração sensório-motora"
  },
  {
    name: "C5",
    color: "#00CED1",
    region: "Central / Sensório-Motora",
    applications: ["Controle motor", "Sensação"],
    description: "Ponto central esquerdo anterior - Controle motor e sensação"
  },
  {
    name: "C3",
    color: "#00CED1",
    region: "Central / Sensório-Motora",
    applications: ["Controle motor", "Parkinson", "Tremor"],
    description: "Ponto central esquerdo - Controle motor e sensação"
  },
  {
    name: "C1",
    color: "#00CED1",
    region: "Central / Sensório-Motora",
    applications: ["Controle motor", "Sensação"],
    description: "Ponto central esquerdo mediano - Integração sensório-motora"
  },
  {
    name: "Cz",
    color: "#00CED1",
    region: "Central / Sensório-Motora",
    applications: ["Controle motor", "Coordenação bilateral"],
    description: "Ponto central mediano - Integração motora bilateral"
  },
  {
    name: "C2",
    color: "#00CED1",
    region: "Central / Sensório-Motora",
    applications: ["Controle motor", "Sensação"],
    description: "Ponto central direito mediano - Integração sensório-motora"
  },
  {
    name: "C4",
    color: "#00CED1",
    region: "Central / Sensório-Motora",
    applications: ["Controle motor", "Parkinson", "Tremor"],
    description: "Ponto central direito - Controle motor e sensação"
  },
  {
    name: "C6",
    color: "#00CED1",
    region: "Central / Sensório-Motora",
    applications: ["Controle motor", "Sensação"],
    description: "Ponto central direito anterior - Controle motor e sensação"
  },
  {
    name: "CP3",
    color: "#00CED1",
    region: "Central / Sensório-Motora",
    applications: ["Integração sensório-motora", "Propriocepção"],
    description: "Ponto centroparietal esquerdo - Integração sensório-motora"
  },
  {
    name: "CP1",
    color: "#00CED1",
    region: "Central / Sensório-Motora",
    applications: ["Integração sensório-motora"],
    description: "Ponto centroparietal esquerdo mediano - Integração sensório-motora"
  },
  {
    name: "CPz",
    color: "#00CED1",
    region: "Central / Sensório-Motora",
    applications: ["Integração sensório-motora bilateral"],
    description: "Ponto centroparietal central - Integração bilateral"
  },
  {
    name: "CP2",
    color: "#00CED1",
    region: "Central / Sensório-Motora",
    applications: ["Integração sensório-motora"],
    description: "Ponto centroparietal direito mediano - Integração sensório-motora"
  },
  {
    name: "CP4",
    color: "#00CED1",
    region: "Central / Sensório-Motora",
    applications: ["Integração sensório-motora", "Propriocepção"],
    description: "Ponto centroparietal direito - Integração sensório-motora"
  },

  // VERDE - Temporal (4 pontos)
  {
    name: "T9",
    color: "#00FF00",
    region: "Temporal",
    applications: ["Processamento auditivo", "Memória"],
    description: "Ponto temporal esquerdo anterior - Processamento auditivo"
  },
  {
    name: "T3",
    color: "#00FF00",
    region: "Temporal",
    applications: ["Zumbido", "Memória", "Wernicke"],
    description: "Ponto temporal esquerdo - Área de Wernicke (compreensão de linguagem)"
  },
  {
    name: "T4",
    color: "#00FF00",
    region: "Temporal",
    applications: ["Zumbido", "Memória", "Wernicke"],
    description: "Ponto temporal direito - Área de Wernicke (compreensão de linguagem)"
  },
  {
    name: "T10",
    color: "#00FF00",
    region: "Temporal",
    applications: ["Processamento auditivo", "Memória"],
    description: "Ponto temporal direito anterior - Processamento auditivo"
  },

  // ROXO - Parietal (5 pontos)
  {
    name: "P3",
    color: "#9370DB",
    region: "Parietal",
    applications: ["Integração sensorial", "Discalculia"],
    description: "Ponto parietal esquerdo - Integração sensorial e espacial"
  },
  {
    name: "P1",
    color: "#9370DB",
    region: "Parietal",
    applications: ["Integração sensorial"],
    description: "Ponto parietal esquerdo mediano - Integração sensorial"
  },
  {
    name: "Pz",
    color: "#9370DB",
    region: "Parietal",
    applications: ["Integração sensorial bilateral"],
    description: "Ponto parietal central - Integração sensorial bilateral"
  },
  {
    name: "P2",
    color: "#9370DB",
    region: "Parietal",
    applications: ["Integração sensorial"],
    description: "Ponto parietal direito mediano - Integração sensorial"
  },
  {
    name: "P4",
    color: "#9370DB",
    region: "Parietal",
    applications: ["Integração sensorial", "Discalculia"],
    description: "Ponto parietal direito - Integração sensorial e espacial"
  },

  // ROSA CLARO - Occipital (3 pontos)
  {
    name: "O1",
    color: "#FFB6C1",
    region: "Occipital",
    applications: ["Processamento visual", "Enxaqueca"],
    description: "Ponto occipital esquerdo - Processamento visual"
  },
  {
    name: "Oz",
    color: "#FFB6C1",
    region: "Occipital",
    applications: ["Processamento visual bilateral"],
    description: "Ponto occipital central - Processamento visual bilateral"
  },
  {
    name: "O2",
    color: "#FFB6C1",
    region: "Occipital",
    applications: ["Processamento visual", "Enxaqueca"],
    description: "Ponto occipital direito - Processamento visual"
  },
];

export const COLORED_REGIONS: ColoredRegion[] = [
  {
    id: "region-frontal-anterior",
    name: "Frontal Anterior",
    colorHex: "#FF69B4",
    points: ["Fp1", "Fp2", "Fpz"],
    applications: ["Depressão", "Ansiedade", "Regulação emocional"]
  },
  {
    id: "region-frontal-media",
    name: "Frontal Média",
    colorHex: "#FFA500",
    points: ["AF3", "AF4", "AFz", "AF7", "AF8"],
    applications: ["Atenção", "Foco", "Concentração"]
  },
  {
    id: "region-frontal-central",
    name: "Frontal Central",
    colorHex: "#FFFF00",
    points: ["F3", "F4", "F1", "F2", "Fz"],
    applications: ["Afasia", "Linguagem expressiva", "Broca"]
  },
  {
    id: "region-central-sensoriomotora",
    name: "Central / Sensório-Motora",
    colorHex: "#00CED1",
    points: ["FC3", "FC1", "FCz", "FC2", "FC4", "C5", "C3", "C1", "Cz", "C2", "C4", "C6", "CP3", "CP1", "CPz", "CP2", "CP4"],
    applications: ["Controle motor", "Sensação", "Parkinson", "Coordenação"]
  },
  {
    id: "region-temporal",
    name: "Temporal",
    colorHex: "#00FF00",
    points: ["T9", "T3", "T4", "T10"],
    applications: ["Zumbido", "Memória", "Wernicke", "Processamento auditivo"]
  },
  {
    id: "region-parietal",
    name: "Parietal",
    colorHex: "#9370DB",
    points: ["P3", "P1", "Pz", "P2", "P4"],
    applications: ["Integração sensorial", "Discalculia", "Espacialidade"]
  },
  {
    id: "region-occipital",
    name: "Occipital",
    colorHex: "#FFB6C1",
    points: ["O1", "Oz", "O2"],
    applications: ["Processamento visual", "Enxaqueca"]
  },
];

export function getPointByName(name: string): ColoredPoint | undefined {
  return COLORED_POINTS.find(p => p.name === name);
}

export function getPointsByRegion(regionName: string): ColoredPoint[] {
  return COLORED_POINTS.filter(p => p.region === regionName);
}

export function getAllColoredPointNames(): string[] {
  return COLORED_POINTS.map(p => p.name);
}

export function getRegionByName(name: string): ColoredRegion | undefined {
  return COLORED_REGIONS.find(r => r.name === name);
}
