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
 * Rosa (3): Fp1, Fpz, Fp2
 * Laranja (3): AF3, AFz, AF4
 * Amarelo (5): F7, F3, Fz, F4, F8
 * Ciano (11): FC5, FC1, FC2, FC6, C3, Cz, C4, CP5, CP1, CP2, CP6
 * Verde (4): T3, T4, T5, T6
 * Roxo claro (3): P3, Pz, P4
 * Roxo escuro (3): PO3, POz, PO4
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
    name: "Fpz",
    color: "#FF69B4",
    region: "Frontal Anterior",
    applications: ["Depressão", "Ansiedade", "Regulação emocional"],
    description: "Ponto frontal anterior central - Integração emocional bilateral"
  },
  {
    name: "Fp2",
    color: "#FF69B4",
    region: "Frontal Anterior",
    applications: ["Depressão", "Ansiedade", "Transtorno do humor"],
    description: "Ponto frontal anterior direito - Processamento emocional e regulação do humor"
  },

  // LARANJA - Frontal Média (3 pontos)
  {
    name: "AF3",
    color: "#FFA500",
    region: "Frontal Média",
    applications: ["Atenção", "Foco", "Concentração"],
    description: "Ponto frontal médio esquerdo - Atenção e foco"
  },
  {
    name: "AFz",
    color: "#FFA500",
    region: "Frontal Média",
    applications: ["Atenção", "Foco", "Integração atencional"],
    description: "Ponto frontal médio central - Integração atencional bilateral"
  },
  {
    name: "AF4",
    color: "#FFA500",
    region: "Frontal Média",
    applications: ["Atenção", "Foco", "Concentração"],
    description: "Ponto frontal médio direito - Atenção e foco"
  },

  // AMARELO - Frontal Central (5 pontos)
  {
    name: "F7",
    color: "#FFFF00",
    region: "Frontal Central",
    applications: ["Linguagem expressiva", "Broca", "Afasia"],
    description: "Ponto frontal lateral esquerdo - Área de Broca (produção de fala)"
  },
  {
    name: "F3",
    color: "#FFFF00",
    region: "Frontal Central",
    applications: ["Afasia", "Linguagem expressiva", "Broca"],
    description: "Ponto frontal central esquerdo - Área de Broca (produção de fala)"
  },
  {
    name: "Fz",
    color: "#FFFF00",
    region: "Frontal Central",
    applications: ["Linguagem bilateral", "Coordenação"],
    description: "Ponto frontal central mediano - Integração bilateral"
  },
  {
    name: "F4",
    color: "#FFFF00",
    region: "Frontal Central",
    applications: ["Afasia", "Linguagem expressiva"],
    description: "Ponto frontal central direito - Linguagem expressiva"
  },
  {
    name: "F8",
    color: "#FFFF00",
    region: "Frontal Central",
    applications: ["Linguagem expressiva", "Prosódia"],
    description: "Ponto frontal lateral direito - Prosódia e linguagem"
  },

  // CIANO - Central / Sensório-Motora (11 pontos)
  {
    name: "FC5",
    color: "#00CED1",
    region: "Central / Sensório-Motora",
    applications: ["Controle motor", "Sensação", "Coordenação"],
    description: "Ponto frontocentral esquerdo lateral - Integração sensório-motora"
  },
  {
    name: "FC1",
    color: "#00CED1",
    region: "Central / Sensório-Motora",
    applications: ["Controle motor", "Sensação"],
    description: "Ponto frontocentral esquerdo mediano - Integração sensório-motora"
  },
  {
    name: "FC2",
    color: "#00CED1",
    region: "Central / Sensório-Motora",
    applications: ["Controle motor", "Sensação"],
    description: "Ponto frontocentral direito mediano - Integração sensório-motora"
  },
  {
    name: "FC6",
    color: "#00CED1",
    region: "Central / Sensório-Motora",
    applications: ["Controle motor", "Sensação", "Coordenação"],
    description: "Ponto frontocentral direito lateral - Integração sensório-motora"
  },
  {
    name: "C3",
    color: "#00CED1",
    region: "Central / Sensório-Motora",
    applications: ["Controle motor", "Parkinson", "Tremor"],
    description: "Ponto central esquerdo - Controle motor e sensação"
  },
  {
    name: "Cz",
    color: "#00CED1",
    region: "Central / Sensório-Motora",
    applications: ["Controle motor", "Coordenação bilateral"],
    description: "Ponto central mediano - Integração motora bilateral"
  },
  {
    name: "C4",
    color: "#00CED1",
    region: "Central / Sensório-Motora",
    applications: ["Controle motor", "Parkinson", "Tremor"],
    description: "Ponto central direito - Controle motor e sensação"
  },
  {
    name: "CP5",
    color: "#00CED1",
    region: "Central / Sensório-Motora",
    applications: ["Integração sensório-motora", "Propriocepção"],
    description: "Ponto centroparietal esquerdo lateral - Integração sensório-motora"
  },
  {
    name: "CP1",
    color: "#00CED1",
    region: "Central / Sensório-Motora",
    applications: ["Integração sensório-motora"],
    description: "Ponto centroparietal esquerdo mediano - Integração sensório-motora"
  },
  {
    name: "CP2",
    color: "#00CED1",
    region: "Central / Sensório-Motora",
    applications: ["Integração sensório-motora"],
    description: "Ponto centroparietal direito mediano - Integração sensório-motora"
  },
  {
    name: "CP6",
    color: "#00CED1",
    region: "Central / Sensório-Motora",
    applications: ["Integração sensório-motora", "Propriocepção"],
    description: "Ponto centroparietal direito lateral - Integração sensório-motora"
  },

  // VERDE - Temporal (4 pontos)
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
    name: "T5",
    color: "#00FF00",
    region: "Temporal",
    applications: ["Processamento auditivo", "Memória", "Linguagem"],
    description: "Ponto temporal posterior esquerdo - Processamento auditivo e memória"
  },
  {
    name: "T6",
    color: "#00FF00",
    region: "Temporal",
    applications: ["Processamento auditivo", "Memória", "Linguagem"],
    description: "Ponto temporal posterior direito - Processamento auditivo e memória"
  },

  // ROXO CLARO - Parietal (3 pontos)
  {
    name: "P3",
    color: "#9370DB",
    region: "Parietal",
    applications: ["Integração sensorial", "Discalculia"],
    description: "Ponto parietal esquerdo - Integração sensorial e espacial"
  },
  {
    name: "Pz",
    color: "#9370DB",
    region: "Parietal",
    applications: ["Integração sensorial bilateral"],
    description: "Ponto parietal central - Integração sensorial bilateral"
  },
  {
    name: "P4",
    color: "#9370DB",
    region: "Parietal",
    applications: ["Integração sensorial", "Discalculia"],
    description: "Ponto parietal direito - Integração sensorial e espacial"
  },

  // ROXO ESCURO - Parieto-Occipital (3 pontos)
  {
    name: "PO3",
    color: "#800080",
    region: "Parieto-Occipital",
    applications: ["Integração visuoespacial", "Processamento visual"],
    description: "Ponto parieto-occipital esquerdo - Integração visuoespacial"
  },
  {
    name: "POz",
    color: "#800080",
    region: "Parieto-Occipital",
    applications: ["Integração visuoespacial bilateral"],
    description: "Ponto parieto-occipital central - Integração visuoespacial bilateral"
  },
  {
    name: "PO4",
    color: "#800080",
    region: "Parieto-Occipital",
    applications: ["Integração visuoespacial", "Processamento visual"],
    description: "Ponto parieto-occipital direito - Integração visuoespacial"
  },

  // ROSA CLARO / VERMELHO - Occipital (3 pontos)
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
    points: ["Fp1", "Fpz", "Fp2"],
    applications: ["Depressão", "Ansiedade", "Regulação emocional"]
  },
  {
    id: "region-frontal-media",
    name: "Frontal Média",
    colorHex: "#FFA500",
    points: ["AF3", "AFz", "AF4"],
    applications: ["Atenção", "Foco", "Concentração"]
  },
  {
    id: "region-frontal-central",
    name: "Frontal Central",
    colorHex: "#FFFF00",
    points: ["F7", "F3", "Fz", "F4", "F8"],
    applications: ["Afasia", "Linguagem expressiva", "Broca", "Prosódia"]
  },
  {
    id: "region-central-sensoriomotora",
    name: "Central / Sensório-Motora",
    colorHex: "#00CED1",
    points: ["FC5", "FC1", "FC2", "FC6", "C3", "Cz", "C4", "CP5", "CP1", "CP2", "CP6"],
    applications: ["Controle motor", "Sensação", "Parkinson", "Coordenação"]
  },
  {
    id: "region-temporal",
    name: "Temporal",
    colorHex: "#00FF00",
    points: ["T3", "T4", "T5", "T6"],
    applications: ["Zumbido", "Memória", "Wernicke", "Processamento auditivo"]
  },
  {
    id: "region-parietal",
    name: "Parietal",
    colorHex: "#9370DB",
    points: ["P3", "Pz", "P4"],
    applications: ["Integração sensorial", "Discalculia", "Espacialidade"]
  },
  {
    id: "region-parieto-occipital",
    name: "Parieto-Occipital",
    colorHex: "#800080",
    points: ["PO3", "POz", "PO4"],
    applications: ["Integração visuoespacial", "Processamento visual"]
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
