// Dados das regiões e pontos do capacete baseados no sistema internacional 10-20

export interface HelmetPoint {
  id: string;
  name: string;
  region: string;
  description: string;
  applications: string[];
  position: { x: number; y: number }; // Posição relativa para visualização 2D
}

export interface HelmetRegion {
  id: string;
  name: string;
  color: string;
  colorHex: string;
  points: string[];
  functions: string[];
  networks: string[];
  clinicalApplications: string[];
}

export const helmetRegions: HelmetRegion[] = [
  {
    id: "frontal-anterior",
    name: "Região Frontal Anterior",
    color: "Rosa/Magenta",
    colorHex: "#E91E63",
    points: ["Fp1", "Fpz", "Fp2", "Nz"],
    functions: [
      "Funções executivas",
      "Planejamento",
      "Tomada de decisão",
      "Controle de impulsos",
      "Autorregulação emocional"
    ],
    networks: ["Default Mode Network (DMN)", "Central Executive Network (CEN)"],
    clinicalApplications: [
      "Depressão maior resistente",
      "Transtornos de ansiedade generalizada",
      "Reabilitação de funções executivas",
      "Controle de impulsividade em TDAH"
    ]
  },
  {
    id: "frontal-media",
    name: "Região Frontal Média",
    color: "Laranja",
    colorHex: "#FF9800",
    points: ["AF7", "AF3", "AFz", "AF4", "AF8"],
    functions: [
      "Processamento cognitivo superior",
      "Atenção seletiva",
      "Resolução de problemas",
      "Memória de trabalho",
      "Processamento de linguagem"
    ],
    networks: ["Central Executive Network (CEN)", "Language Network"],
    clinicalApplications: [
      "Treinamento de foco atencional",
      "Monitoramento de fadiga cognitiva",
      "Modulação da tomada de decisão"
    ]
  },
  {
    id: "frontal-central",
    name: "Região Frontal Central",
    color: "Amarelo",
    colorHex: "#FFEB3B",
    points: ["F7", "F3", "F1", "Fz", "F2", "F4", "F8"],
    functions: [
      "Controle motor voluntário",
      "Planejamento motor",
      "Execução de movimentos",
      "Processamento de linguagem expressiva (Área de Broca)"
    ],
    networks: ["Motor Network", "Language Network"],
    clinicalApplications: [
      "Tratamento de afasias expressivas (Broca)",
      "Reabilitação de coordenação motora fina",
      "Suporte em transtornos do espectro autista"
    ]
  },
  {
    id: "central-sensoriomotora",
    name: "Região Central/Sensório-Motora",
    color: "Ciano",
    colorHex: "#00BCD4",
    points: ["FC5", "FC3", "FC1", "FCz", "FC2", "FC4", "FC6", "C5", "C3", "C1", "Cz", "C2", "C4", "C6", "CP5", "CP3", "CP1", "CPz", "CP2", "CP4", "CP6"],
    functions: [
      "Integração sensório-motora",
      "Processamento somatossensorial",
      "Tato, propriocepção, dor, temperatura",
      "Coordenação motora fina"
    ],
    networks: ["Sensorimotor Network", "Dorsal Attention Network"],
    clinicalApplications: [
      "Manejo de dor crônica neuropática",
      "Reabilitação pós-AVC (hemiparesias)",
      "Controle de tremores em Parkinson",
      "Epilepsias focais"
    ]
  },
  {
    id: "temporal",
    name: "Região Temporal",
    color: "Verde",
    colorHex: "#4CAF50",
    points: ["T9", "T7", "T5", "T10", "T8", "T6"],
    functions: [
      "Processamento auditivo",
      "Compreensão linguística (Área de Wernicke)",
      "Memória semântica",
      "Reconhecimento de faces",
      "Processamento emocional"
    ],
    networks: ["Language Network", "Default Mode Network (DMN)", "Salience Network"],
    clinicalApplications: [
      "Reabilitação de memória em Alzheimer precoce",
      "Tratamento de zumbido (tinnitus)",
      "Distúrbios de compreensão de linguagem (Wernicke)"
    ]
  },
  {
    id: "parietal",
    name: "Região Parietal",
    color: "Roxo",
    colorHex: "#9C27B0",
    points: ["P1", "P3", "P5", "Pz", "P2", "P4", "P6"],
    functions: [
      "Processamento somatossensorial",
      "Integração visuoespacial",
      "Atenção espacial",
      "Navegação",
      "Integração multissensorial"
    ],
    networks: ["Dorsal Attention Network", "Default Mode Network", "Sensorimotor Network"],
    clinicalApplications: [
      "Tratamento de discalculia",
      "Correção de negligência espacial unilateral",
      "Suporte em distúrbios de integração sensorial"
    ]
  },
  {
    id: "parieto-occipital",
    name: "Região Parieto-Occipital",
    color: "Roxo Claro",
    colorHex: "#CE93D8",
    points: ["PO7", "PO3", "POz", "PO4", "PO8"],
    functions: [
      "Integração entre processamento parietal e visual",
      "Processamento de informações visuoespaciais complexas",
      "Integração de profundidade"
    ],
    networks: ["Dorsal Attention Network", "Visual Network"],
    clinicalApplications: [
      "Melhora da coordenação visomotora",
      "Reabilitação de ataxia óptica",
      "Distúrbios de percepção de profundidade"
    ]
  },
  {
    id: "occipital",
    name: "Região Occipital",
    color: "Salmão",
    colorHex: "#FF8A80",
    points: ["O1", "Oz", "O2", "Iz"],
    functions: [
      "Processamento visual primário",
      "Processamento de cor, contraste, orientação",
      "Movimento visual",
      "Integração visual"
    ],
    networks: ["Visual Network", "Dorsal Attention Network"],
    clinicalApplications: [
      "Tratamento de enxaquecas com aura visual",
      "Suporte em cegueira cortical",
      "Modulação de distúrbios do processamento visual primário"
    ]
  },
  {
    id: "cerebelar",
    name: "Região Cerebelar",
    color: "Cinza",
    colorHex: "#9E9E9E",
    points: ["Inf-O"],
    functions: [
      "Equilíbrio e marcha",
      "Coordenação motora",
      "Timing motor",
      "Aprendizado motor"
    ],
    networks: ["Motor Network"],
    clinicalApplications: [
      "Reabilitação de equilíbrio e marcha",
      "Tratamento de ataxias cerebelares",
      "Suporte em distúrbios de timing motor e coordenação"
    ]
  }
];

export const helmetPoints: HelmetPoint[] = [
  // Frontal Anterior
  { id: "Fp1", name: "Fp1", region: "frontal-anterior", description: "Frontal Polar Esquerdo", applications: ["Melhora da depressão", "Aumento do afeto positivo", "Redução da ruminação mental"], position: { x: 35, y: 15 } },
  { id: "Fpz", name: "Fpz", region: "frontal-anterior", description: "Frontal Polar Central", applications: ["Estabilização da atenção sustentada", "Integração da autoconsciência executiva"], position: { x: 50, y: 10 } },
  { id: "Fp2", name: "Fp2", region: "frontal-anterior", description: "Frontal Polar Direito", applications: ["Redução da ansiedade", "Controle de impulsividade", "Modulação de estados de hiperalerta"], position: { x: 65, y: 15 } },
  { id: "Nz", name: "Nz", region: "frontal-anterior", description: "Násio (ponto de referência)", applications: ["Ponto de referência anatômico"], position: { x: 50, y: 5 } },
  
  // Frontal Média
  { id: "AF7", name: "AF7", region: "frontal-media", description: "Anterior Frontal 7", applications: ["Otimização da memória de trabalho", "Facilitação do raciocínio lógico-matemático"], position: { x: 25, y: 20 } },
  { id: "AF3", name: "AF3", region: "frontal-media", description: "Anterior Frontal 3", applications: ["Otimização da memória de trabalho", "Facilitação do raciocínio lógico-matemático"], position: { x: 38, y: 22 } },
  { id: "AFz", name: "AFz", region: "frontal-media", description: "Anterior Frontal Central", applications: ["Redução do conflito cognitivo", "Melhora na detecção de erros"], position: { x: 50, y: 18 } },
  { id: "AF4", name: "AF4", region: "frontal-media", description: "Anterior Frontal 4", applications: ["Melhora do monitoramento cognitivo", "Regulação da atenção alternada"], position: { x: 62, y: 22 } },
  { id: "AF8", name: "AF8", region: "frontal-media", description: "Anterior Frontal 8", applications: ["Melhora do monitoramento cognitivo", "Regulação da atenção alternada"], position: { x: 75, y: 20 } },
  
  // Frontal Central
  { id: "F7", name: "F7", region: "frontal-central", description: "Frontal 7", applications: ["Estimulação da fluência verbal", "Reabilitação da produção da fala (Broca)"], position: { x: 15, y: 35 } },
  { id: "F3", name: "F3", region: "frontal-central", description: "Frontal 3 (Broca)", applications: ["Estimulação da fluência verbal", "Reabilitação da produção da fala (Broca)"], position: { x: 32, y: 32 } },
  { id: "F1", name: "F1", region: "frontal-central", description: "Frontal 1", applications: ["Coordenação da intenção motora", "Suporte na motivação para ação"], position: { x: 42, y: 30 } },
  { id: "Fz", name: "Fz", region: "frontal-central", description: "Frontal Central", applications: ["Coordenação da intenção motora", "Suporte na motivação para ação"], position: { x: 50, y: 28 } },
  { id: "F2", name: "F2", region: "frontal-central", description: "Frontal 2", applications: ["Coordenação da intenção motora", "Suporte na motivação para ação"], position: { x: 58, y: 30 } },
  { id: "F4", name: "F4", region: "frontal-central", description: "Frontal 4", applications: ["Modulação da prosódia emocional", "Controle da inibição comportamental"], position: { x: 68, y: 32 } },
  { id: "F8", name: "F8", region: "frontal-central", description: "Frontal 8", applications: ["Modulação da prosódia emocional", "Controle da inibição comportamental"], position: { x: 85, y: 35 } },
  
  // Central/Sensório-Motora
  { id: "C3", name: "C3", region: "central-sensoriomotora", description: "Central 3", applications: ["Reabilitação motora lado direito", "Tratamento de dor crônica"], position: { x: 28, y: 50 } },
  { id: "Cz", name: "Cz", region: "central-sensoriomotora", description: "Central", applications: ["Integração somatossensorial bilateral", "Controle postural central"], position: { x: 50, y: 48 } },
  { id: "C4", name: "C4", region: "central-sensoriomotora", description: "Central 4", applications: ["Reabilitação motora lado esquerdo", "Modulação de espasticidade"], position: { x: 72, y: 50 } },
  
  // Temporal
  { id: "T7", name: "T7", region: "temporal", description: "Temporal 7 (Esq)", applications: ["Melhora da compreensão auditiva", "Consolidação de memórias verbais"], position: { x: 8, y: 50 } },
  { id: "T5", name: "T5", region: "temporal", description: "Temporal 5 (Wernicke)", applications: ["Melhora da compreensão auditiva", "Consolidação de memórias verbais"], position: { x: 12, y: 65 } },
  { id: "T8", name: "T8", region: "temporal", description: "Temporal 8 (Dir)", applications: ["Processamento não-verbal", "Reconhecimento de faces"], position: { x: 92, y: 50 } },
  { id: "T6", name: "T6", region: "temporal", description: "Temporal 6", applications: ["Processamento não-verbal", "Reconhecimento de faces"], position: { x: 88, y: 65 } },
  
  // Parietal
  { id: "P3", name: "P3", region: "parietal", description: "Parietal 3", applications: ["Suporte em leitura, escrita e cálculos"], position: { x: 30, y: 68 } },
  { id: "Pz", name: "Pz", region: "parietal", description: "Parietal Central", applications: ["Integração da atenção visual-espacial"], position: { x: 50, y: 65 } },
  { id: "P4", name: "P4", region: "parietal", description: "Parietal 4", applications: ["Navegação espacial", "Percepção da imagem corporal"], position: { x: 70, y: 68 } },
  
  // Parieto-Occipital
  { id: "PO7", name: "PO7", region: "parieto-occipital", description: "Parieto-Occipital 7", applications: ["Refinamento da busca visual"], position: { x: 22, y: 78 } },
  { id: "POz", name: "POz", region: "parieto-occipital", description: "Parieto-Occipital Central", applications: ["Integração do fluxo visual"], position: { x: 50, y: 75 } },
  { id: "PO8", name: "PO8", region: "parieto-occipital", description: "Parieto-Occipital 8", applications: ["Coordenação visão-movimento"], position: { x: 78, y: 78 } },
  
  // Occipital
  { id: "O1", name: "O1", region: "occipital", description: "Occipital 1", applications: ["Estimulação da acuidade visual"], position: { x: 38, y: 88 } },
  { id: "Oz", name: "Oz", region: "occipital", description: "Occipital Central", applications: ["Redução de auras visuais", "Estabilização da visão central"], position: { x: 50, y: 85 } },
  { id: "O2", name: "O2", region: "occipital", description: "Occipital 2", applications: ["Estimulação da acuidade visual"], position: { x: 62, y: 88 } },
  { id: "Iz", name: "Iz", region: "occipital", description: "Ínio (ponto de referência)", applications: ["Ponto de referência anatômico"], position: { x: 50, y: 92 } },
  
  // Cerebelar
  { id: "Inf-O", name: "Inf-O", region: "cerebelar", description: "Inferior Occipital (Cerebelar)", applications: ["Equilíbrio dinâmico", "Precisão do timing motor"], position: { x: 50, y: 95 } }
];

// Função auxiliar para obter região por ID
export function getRegionById(regionId: string): HelmetRegion | undefined {
  return helmetRegions.find(r => r.id === regionId);
}

// Função auxiliar para obter ponto por ID
export function getPointById(pointId: string): HelmetPoint | undefined {
  return helmetPoints.find(p => p.id === pointId);
}

// Função auxiliar para obter pontos de uma região
export function getPointsByRegion(regionId: string): HelmetPoint[] {
  return helmetPoints.filter(p => p.region === regionId);
}
