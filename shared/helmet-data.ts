// Dados das regiões e pontos do capacete baseados no sistema internacional 10-20
// APENAS OS 35 PONTOS COLORIDOS DA IMAGEM

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
    color: "Rosa",
    colorHex: "#FF69B4",
    points: ["Fp1", "Fpz", "Fp2"],
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
    colorHex: "#FFA500",
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
    colorHex: "#FFFF00",
    points: ["F3", "F1", "Fz", "F2", "F4"],
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
    colorHex: "#00CED1",
    points: ["FC3", "FC1", "FCz", "FC2", "FC4", "C5", "C3", "C1", "Cz", "C2", "C4", "C6", "CP3", "CP1", "CPz", "CP2", "CP4"],
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
    colorHex: "#00FF00",
    points: ["T9", "T3", "T4", "T10"],
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
    colorHex: "#9370DB",
    points: ["P3", "P1", "Pz", "P2", "P4"],
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
    id: "occipital",
    name: "Região Occipital",
    color: "Rosa Claro",
    colorHex: "#FFB6C1",
    points: ["O1", "Oz", "O2"],
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
  }
];

export const helmetPoints: HelmetPoint[] = [
  // Frontal Anterior (Rosa) - 3 pontos
  { id: "Fp1", name: "Fp1", region: "frontal-anterior", description: "Frontal Polar Esquerdo", applications: ["Melhora da depressão", "Aumento do afeto positivo", "Redução da ruminação mental"], position: { x: 35, y: 15 } },
  { id: "Fpz", name: "Fpz", region: "frontal-anterior", description: "Frontal Polar Central", applications: ["Estabilização da atenção sustentada", "Integração da autoconsciência executiva"], position: { x: 50, y: 10 } },
  { id: "Fp2", name: "Fp2", region: "frontal-anterior", description: "Frontal Polar Direito", applications: ["Redução da ansiedade", "Controle de impulsividade", "Modulação de estados de hiperalerta"], position: { x: 65, y: 15 } },
  
  // Frontal Média (Laranja) - 5 pontos
  { id: "AF7", name: "AF7", region: "frontal-media", description: "Anterior Frontal 7", applications: ["Otimização da memória de trabalho", "Facilitação do raciocínio lógico-matemático"], position: { x: 25, y: 20 } },
  { id: "AF3", name: "AF3", region: "frontal-media", description: "Anterior Frontal 3", applications: ["Otimização da memória de trabalho", "Facilitação do raciocínio lógico-matemático"], position: { x: 38, y: 22 } },
  { id: "AFz", name: "AFz", region: "frontal-media", description: "Anterior Frontal Central", applications: ["Redução do conflito cognitivo", "Melhora na detecção de erros"], position: { x: 50, y: 18 } },
  { id: "AF4", name: "AF4", region: "frontal-media", description: "Anterior Frontal 4", applications: ["Melhora do monitoramento cognitivo", "Regulação da atenção alternada"], position: { x: 62, y: 22 } },
  { id: "AF8", name: "AF8", region: "frontal-media", description: "Anterior Frontal 8", applications: ["Melhora do monitoramento cognitivo", "Regulação da atenção alternada"], position: { x: 75, y: 20 } },
  
  // Frontal Central (Amarelo) - 5 pontos
  { id: "F3", name: "F3", region: "frontal-central", description: "Frontal 3 (Broca)", applications: ["Estimulação da fluência verbal", "Reabilitação da produção da fala (Broca)"], position: { x: 32, y: 32 } },
  { id: "F1", name: "F1", region: "frontal-central", description: "Frontal 1", applications: ["Coordenação da intenção motora", "Suporte na motivação para ação"], position: { x: 42, y: 30 } },
  { id: "Fz", name: "Fz", region: "frontal-central", description: "Frontal Central", applications: ["Coordenação da intenção motora", "Suporte na motivação para ação"], position: { x: 50, y: 28 } },
  { id: "F2", name: "F2", region: "frontal-central", description: "Frontal 2", applications: ["Coordenação da intenção motora", "Suporte na motivação para ação"], position: { x: 58, y: 30 } },
  { id: "F4", name: "F4", region: "frontal-central", description: "Frontal 4", applications: ["Modulação da prosódia emocional", "Controle da inibição comportamental"], position: { x: 68, y: 32 } },
  
  // Central/Sensório-Motora (Ciano) - 17 pontos
  { id: "FC3", name: "FC3", region: "central-sensoriomotora", description: "Frontocentral 3", applications: ["Integração sensório-motora"], position: { x: 32, y: 42 } },
  { id: "FC1", name: "FC1", region: "central-sensoriomotora", description: "Frontocentral 1", applications: ["Integração sensório-motora"], position: { x: 42, y: 40 } },
  { id: "FCz", name: "FCz", region: "central-sensoriomotora", description: "Frontocentral Central", applications: ["Integração sensório-motora bilateral"], position: { x: 50, y: 38 } },
  { id: "FC2", name: "FC2", region: "central-sensoriomotora", description: "Frontocentral 2", applications: ["Integração sensório-motora"], position: { x: 58, y: 40 } },
  { id: "FC4", name: "FC4", region: "central-sensoriomotora", description: "Frontocentral 4", applications: ["Integração sensório-motora"], position: { x: 68, y: 42 } },
  { id: "C5", name: "C5", region: "central-sensoriomotora", description: "Central 5", applications: ["Controle motor e sensação"], position: { x: 20, y: 50 } },
  { id: "C3", name: "C3", region: "central-sensoriomotora", description: "Central 3", applications: ["Reabilitação motora lado direito", "Tratamento de dor crônica"], position: { x: 28, y: 50 } },
  { id: "C1", name: "C1", region: "central-sensoriomotora", description: "Central 1", applications: ["Integração sensório-motora"], position: { x: 42, y: 50 } },
  { id: "Cz", name: "Cz", region: "central-sensoriomotora", description: "Central", applications: ["Integração somatossensorial bilateral", "Controle postural central"], position: { x: 50, y: 48 } },
  { id: "C2", name: "C2", region: "central-sensoriomotora", description: "Central 2", applications: ["Integração sensório-motora"], position: { x: 58, y: 50 } },
  { id: "C4", name: "C4", region: "central-sensoriomotora", description: "Central 4", applications: ["Reabilitação motora lado esquerdo", "Modulação de espasticidade"], position: { x: 72, y: 50 } },
  { id: "C6", name: "C6", region: "central-sensoriomotora", description: "Central 6", applications: ["Controle motor e sensação"], position: { x: 80, y: 50 } },
  { id: "CP3", name: "CP3", region: "central-sensoriomotora", description: "Centroparietal 3", applications: ["Integração sensório-motora"], position: { x: 28, y: 60 } },
  { id: "CP1", name: "CP1", region: "central-sensoriomotora", description: "Centroparietal 1", applications: ["Integração sensório-motora"], position: { x: 42, y: 60 } },
  { id: "CPz", name: "CPz", region: "central-sensoriomotora", description: "Centroparietal Central", applications: ["Integração sensório-motora bilateral"], position: { x: 50, y: 58 } },
  { id: "CP2", name: "CP2", region: "central-sensoriomotora", description: "Centroparietal 2", applications: ["Integração sensório-motora"], position: { x: 58, y: 60 } },
  { id: "CP4", name: "CP4", region: "central-sensoriomotora", description: "Centroparietal 4", applications: ["Integração sensório-motora"], position: { x: 72, y: 60 } },
  
  // Temporal (Verde) - 4 pontos
  { id: "T9", name: "T9", region: "temporal", description: "Temporal 9", applications: ["Processamento auditivo", "Memória"], position: { x: 5, y: 45 } },
  { id: "T3", name: "T3", region: "temporal", description: "Temporal 3 (Wernicke)", applications: ["Melhora da compreensão auditiva", "Consolidação de memórias verbais"], position: { x: 8, y: 50 } },
  { id: "T4", name: "T4", region: "temporal", description: "Temporal 4", applications: ["Processamento não-verbal", "Reconhecimento de faces"], position: { x: 92, y: 50 } },
  { id: "T10", name: "T10", region: "temporal", description: "Temporal 10", applications: ["Processamento auditivo", "Memória"], position: { x: 95, y: 45 } },
  
  // Parietal (Roxo) - 5 pontos
  { id: "P3", name: "P3", region: "parietal", description: "Parietal 3", applications: ["Suporte em leitura, escrita e cálculos"], position: { x: 30, y: 68 } },
  { id: "P1", name: "P1", region: "parietal", description: "Parietal 1", applications: ["Integração sensorial"], position: { x: 42, y: 68 } },
  { id: "Pz", name: "Pz", region: "parietal", description: "Parietal Central", applications: ["Integração da atenção visual-espacial"], position: { x: 50, y: 65 } },
  { id: "P2", name: "P2", region: "parietal", description: "Parietal 2", applications: ["Integração sensorial"], position: { x: 58, y: 68 } },
  { id: "P4", name: "P4", region: "parietal", description: "Parietal 4", applications: ["Navegação espacial", "Percepção da imagem corporal"], position: { x: 70, y: 68 } },
  
  // Occipital (Rosa Claro) - 3 pontos
  { id: "O1", name: "O1", region: "occipital", description: "Occipital 1", applications: ["Estimulação da acuidade visual"], position: { x: 38, y: 88 } },
  { id: "Oz", name: "Oz", region: "occipital", description: "Occipital Central", applications: ["Redução de auras visuais", "Estabilização da visão central"], position: { x: 50, y: 85 } },
  { id: "O2", name: "O2", region: "occipital", description: "Occipital 2", applications: ["Estimulação da acuidade visual"], position: { x: 62, y: 88 } }
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
