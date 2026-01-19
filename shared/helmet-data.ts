// Dados das regiões e pontos do capacete baseados no manual NEUROADESIVO FINAL
// APENAS OS PONTOS E ÁREAS DO DOCUMENTO

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
    id: "referencia",
    name: "Referência",
    color: "Cinza",
    colorHex: "#999999",
    points: ["Nz", "Iz"],
    functions: ["Referência anatômica", "Ponto de calibração"],
    networks: [],
    clinicalApplications: []
  },
  {
    id: "frontal-anterior",
    name: "Frontal Anterior",
    color: "Rosa",
    colorHex: "#FF69B4",
    points: ["Fp1", "Fp2", "Fpz"],
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
    id: "frontal-anterior-media",
    name: "Frontal Anterior-Média",
    color: "Laranja",
    colorHex: "#FFA500",
    points: ["AF3", "AF4", "AFz"],
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
    id: "frontal-media",
    name: "Frontal Média",
    color: "Amarelo",
    colorHex: "#FFFF00",
    points: ["F3", "F4", "F7", "F8", "Fz"],
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
    name: "Central/Sensório-Motora",
    color: "Ciano",
    colorHex: "#00CED1",
    points: ["FC1", "FC2", "FC5", "FC6", "C3", "C4", "Cz", "CP1", "CP2", "CP5", "CP6"],
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
    name: "Temporal",
    color: "Verde",
    colorHex: "#00FF00",
    points: ["T3", "T4", "T5", "T6"],
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
    name: "Parietal",
    color: "Roxo Claro",
    colorHex: "#9370DB",
    points: ["P3", "P4", "Pz"],
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
    id: "occipital-anterior",
    name: "Occipital Anterior",
    color: "Roxo Escuro",
    colorHex: "#8B008B",
    points: ["PO2", "PO3", "PO4"],
    functions: [
      "Processamento visual anterior",
      "Integração visual-espacial",
      "Processamento de movimento visual"
    ],
    networks: ["Visual Network", "Dorsal Attention Network"],
    clinicalApplications: [
      "Tratamento de distúrbios visuais",
      "Modulação de processamento visual"
    ]
  },
  {
    id: "occipital",
    name: "Occipital",
    color: "Salmão",
    colorHex: "#FA8072",
    points: ["O1", "O2", "Oz"],
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
  // Referência (Cinza) - 2 pontos
  { id: "Nz", name: "Nz", region: "referencia", description: "Nasion - Referência frontal", applications: ["Ponto de referência anatômica"], position: { x: 50, y: 5 } },
  { id: "Iz", name: "Iz", region: "referencia", description: "Inion - Referência occipital", applications: ["Ponto de referência anatômica"], position: { x: 50, y: 95 } },
  
  // Frontal Anterior (Rosa) - 3 pontos
  { id: "Fp1", name: "Fp1", region: "frontal-anterior", description: "Frontal Polar Esquerdo", applications: ["Melhora da depressão", "Aumento do afeto positivo", "Redução da ruminação mental"], position: { x: 35, y: 15 } },
  { id: "Fp2", name: "Fp2", region: "frontal-anterior", description: "Frontal Polar Direito", applications: ["Redução da ansiedade", "Controle de impulsividade", "Modulação de estados de hiperalerta"], position: { x: 65, y: 15 } },
  { id: "Fpz", name: "Fpz", region: "frontal-anterior", description: "Frontal Polar Central", applications: ["Estabilização da atenção sustentada", "Integração da autoconsciência executiva"], position: { x: 50, y: 12 } },
  
  // Frontal Anterior-Média (Laranja) - 3 pontos
  { id: "AF3", name: "AF3", region: "frontal-anterior-media", description: "Anterior Frontal 3", applications: ["Otimização da memória de trabalho", "Facilitação do raciocínio lógico-matemático"], position: { x: 38, y: 22 } },
  { id: "AF4", name: "AF4", region: "frontal-anterior-media", description: "Anterior Frontal 4", applications: ["Melhora do monitoramento cognitivo", "Regulação da atenção alternada"], position: { x: 62, y: 22 } },
  { id: "AFz", name: "AFz", region: "frontal-anterior-media", description: "Anterior Frontal Central", applications: ["Redução do conflito cognitivo", "Melhora na detecção de erros"], position: { x: 50, y: 20 } },
  
  // Frontal Média (Amarelo) - 5 pontos
  { id: "F3", name: "F3", region: "frontal-media", description: "Frontal 3 (Broca)", applications: ["Estimulação da fluência verbal", "Reabilitação da produção da fala (Broca)"], position: { x: 32, y: 32 } },
  { id: "F4", name: "F4", region: "frontal-media", description: "Frontal 4", applications: ["Modulação da prosódia emocional", "Controle da inibição comportamental"], position: { x: 68, y: 32 } },
  { id: "F7", name: "F7", region: "frontal-media", description: "Frontal 7", applications: ["Processamento cognitivo superior"], position: { x: 25, y: 30 } },
  { id: "F8", name: "F8", region: "frontal-media", description: "Frontal 8", applications: ["Processamento cognitivo superior"], position: { x: 75, y: 30 } },
  { id: "Fz", name: "Fz", region: "frontal-media", description: "Frontal Central", applications: ["Coordenação da intenção motora", "Suporte na motivação para ação"], position: { x: 50, y: 30 } },
  
  // Central/Sensório-Motora (Ciano) - 11 pontos
  { id: "FC1", name: "FC1", region: "central-sensoriomotora", description: "Frontocentral 1", applications: ["Integração sensório-motora"], position: { x: 42, y: 40 } },
  { id: "FC2", name: "FC2", region: "central-sensoriomotora", description: "Frontocentral 2", applications: ["Integração sensório-motora"], position: { x: 58, y: 40 } },
  { id: "FC5", name: "FC5", region: "central-sensoriomotora", description: "Frontocentral 5", applications: ["Integração sensório-motora"], position: { x: 25, y: 38 } },
  { id: "FC6", name: "FC6", region: "central-sensoriomotora", description: "Frontocentral 6", applications: ["Integração sensório-motora"], position: { x: 75, y: 38 } },
  { id: "C3", name: "C3", region: "central-sensoriomotora", description: "Central 3", applications: ["Reabilitação motora lado direito", "Tratamento de dor crônica"], position: { x: 28, y: 50 } },
  { id: "C4", name: "C4", region: "central-sensoriomotora", description: "Central 4", applications: ["Reabilitação motora lado esquerdo", "Modulação de espasticidade"], position: { x: 72, y: 50 } },
  { id: "Cz", name: "Cz", region: "central-sensoriomotora", description: "Central", applications: ["Integração somatossensorial bilateral", "Controle postural central"], position: { x: 50, y: 50 } },
  { id: "CP1", name: "CP1", region: "central-sensoriomotora", description: "Centroparietal 1", applications: ["Integração sensório-motora"], position: { x: 42, y: 60 } },
  { id: "CP2", name: "CP2", region: "central-sensoriomotora", description: "Centroparietal 2", applications: ["Integração sensório-motora"], position: { x: 58, y: 60 } },
  { id: "CP5", name: "CP5", region: "central-sensoriomotora", description: "Centroparietal 5", applications: ["Integração sensório-motora"], position: { x: 25, y: 58 } },
  { id: "CP6", name: "CP6", region: "central-sensoriomotora", description: "Centroparietal 6", applications: ["Integração sensório-motora"], position: { x: 75, y: 58 } },
  
  // Temporal (Verde) - 4 pontos
  { id: "T3", name: "T3", region: "temporal", description: "Temporal 3 (Wernicke)", applications: ["Melhora da compreensão auditiva", "Consolidação de memórias verbais"], position: { x: 8, y: 50 } },
  { id: "T4", name: "T4", region: "temporal", description: "Temporal 4", applications: ["Processamento não-verbal", "Reconhecimento de faces"], position: { x: 92, y: 50 } },
  { id: "T5", name: "T5", region: "temporal", description: "Temporal 5", applications: ["Processamento auditivo", "Memória"], position: { x: 5, y: 65 } },
  { id: "T6", name: "T6", region: "temporal", description: "Temporal 6", applications: ["Processamento auditivo", "Memória"], position: { x: 95, y: 65 } },
  
  // Parietal (Roxo Claro) - 3 pontos
  { id: "P3", name: "P3", region: "parietal", description: "Parietal 3", applications: ["Suporte em leitura, escrita e cálculos"], position: { x: 30, y: 68 } },
  { id: "P4", name: "P4", region: "parietal", description: "Parietal 4", applications: ["Navegação espacial", "Percepção da imagem corporal"], position: { x: 70, y: 68 } },
  { id: "Pz", name: "Pz", region: "parietal", description: "Parietal Central", applications: ["Integração da atenção visual-espacial"], position: { x: 50, y: 68 } },
  
  // Occipital Anterior (Roxo Escuro) - 3 pontos
  { id: "PO2", name: "PO2", region: "occipital-anterior", description: "Parieto-Occipital 2", applications: ["Processamento visual anterior"], position: { x: 58, y: 78 } },
  { id: "PO3", name: "PO3", region: "occipital-anterior", description: "Parieto-Occipital 3", applications: ["Processamento visual anterior"], position: { x: 42, y: 78 } },
  { id: "PO4", name: "PO4", region: "occipital-anterior", description: "Parieto-Occipital 4", applications: ["Processamento visual anterior"], position: { x: 58, y: 78 } },
  
  // Occipital (Salmão) - 3 pontos
  { id: "O1", name: "O1", region: "occipital", description: "Occipital 1", applications: ["Estimulação da acuidade visual"], position: { x: 38, y: 88 } },
  { id: "O2", name: "O2", region: "occipital", description: "Occipital 2", applications: ["Estimulação da acuidade visual"], position: { x: 62, y: 88 } },
  { id: "Oz", name: "Oz", region: "occipital", description: "Occipital Central", applications: ["Redução de auras visuais", "Estabilização da visão central"], position: { x: 50, y: 85 } }
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
