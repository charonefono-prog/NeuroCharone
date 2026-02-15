/**
 * Funções específicas de cada ponto do capacete
 * Baseado no manual de adesivos e Sistema 10-20
 * 35 pontos coloridos exatos da imagem
 */

export interface PointFunction {
  point: string;
  function: string;
  description: string;
}

export const helmetPointFunctions: PointFunction[] = [
  // Região Frontal Anterior (Rosa) - 3 pontos
  {
    point: "Fp1",
    function: "Melhora da depressão e afeto positivo",
    description: "Melhora da depressão, aumento do afeto positivo e redução da ruminação mental. Estimulação do córtex pré-frontal dorsolateral esquerdo."
  },
  {
    point: "Fpz",
    function: "Controle executivo e atenção",
    description: "Melhora do controle executivo, atenção sustentada e tomada de decisão. Região medial do córtex pré-frontal."
  },
  {
    point: "Fp2",
    function: "Redução de ansiedade e hiperatividade",
    description: "Redução de ansiedade, hiperatividade e impulsividade. Modulação do córtex pré-frontal dorsolateral direito."
  },

  // Região Frontal Média (Laranja) - 3 pontos
  {
    point: "AF3",
    function: "Memória de trabalho e raciocínio lógico",
    description: "Otimização da memória de trabalho, facilitação do raciocínio lógico-matemático e processamento cognitivo superior. Córtex pré-frontal dorsolateral esquerdo."
  },
  {
    point: "AFz",
    function: "Redução de conflito cognitivo",
    description: "Redução do conflito cognitivo, melhora na detecção de erros e monitoramento de performance. Córtex pré-frontal medial."
  },
  {
    point: "AF4",
    function: "Monitoramento cognitivo e atenção alternada",
    description: "Melhora do monitoramento cognitivo, regulação da atenção alternada e flexibilidade mental. Córtex pré-frontal dorsolateral direito."
  },

  // Região Frontal Central (Amarelo) - 5 pontos
  {
    point: "F7",
    function: "Linguagem e memória verbal",
    description: "Melhora da fluência verbal, memória verbal e processamento de linguagem. Córtex frontal inferior esquerdo. Estimulação da fluência verbal e reabilitação da produção da fala."
  },
  {
    point: "F3",
    function: "Memória de trabalho e funções executivas - Broca",
    description: "Melhora da memória de trabalho, planejamento e organização. Córtex pré-frontal dorsolateral esquerdo. Área de Broca - estimulação da fluência verbal e reabilitação da produção da fala."
  },
  {
    point: "Fz",
    function: "Atenção e controle cognitivo",
    description: "Melhora da atenção, controle cognitivo e monitoramento de conflitos. Córtex pré-frontal medial. Coordenação da intenção motora bilateral."
  },
  {
    point: "F4",
    function: "Controle inibitório e regulação emocional",
    description: "Melhora do controle inibitório, regulação emocional e redução de impulsividade. Córtex pré-frontal dorsolateral direito. Modulação da prosódia emocional e controle da inibição comportamental."
  },
  {
    point: "F8",
    function: "Atenção espacial e memória visual",
    description: "Melhora da atenção espacial, memória visual e reconhecimento facial. Córtex frontal inferior direito. Modulação da prosódia emocional e controle da inibição comportamental."
  },

  // Região Central/Sensório-Motora (Ciano) - 11 pontos
  {
    point: "FC5",
    function: "Planejamento motor e linguagem",
    description: "Planejamento motor complexo, produção de linguagem e coordenação orofacial. Área de Broca e córtex pré-motor esquerdo."
  },
  {
    point: "FC1",
    function: "Integração sensório-motora esquerda",
    description: "Integração sensório-motora, propriocepção e coordenação de movimentos. Córtex motor primário esquerdo."
  },
  {
    point: "FC2",
    function: "Integração sensório-motora direita",
    description: "Integração sensório-motora, propriocepção e coordenação de movimentos. Córtex motor primário direito."
  },
  {
    point: "FC6",
    function: "Atenção e controle motor",
    description: "Atenção visuoespacial, controle motor e preparação de respostas. Córtex pré-motor direito."
  },
  {
    point: "C3",
    function: "Controle motor membro superior direito",
    description: "Controle motor fino do membro superior direito, coordenação motora e aprendizado motor. Córtex motor primário esquerdo."
  },
  {
    point: "Cz",
    function: "Controle motor bilateral e equilíbrio",
    description: "Controle motor bilateral, equilíbrio e coordenação de movimentos complexos. Córtex motor medial. Integração somatossensorial bilateral e controle postural central."
  },
  {
    point: "C4",
    function: "Controle motor membro superior esquerdo",
    description: "Controle motor fino do membro superior esquerdo, coordenação motora e aprendizado motor. Córtex motor primário direito."
  },
  {
    point: "CP5",
    function: "Integração sensoriomotora",
    description: "Integração sensoriomotora, propriocepção e coordenação de movimentos complexos. Córtex parietal posterior esquerdo."
  },
  {
    point: "CP1",
    function: "Integração sensorial medial esquerda",
    description: "Integração sensorial, processamento somatossensorial e propriocepção. Córtex parietal posterior esquerdo medial."
  },
  {
    point: "CP2",
    function: "Integração sensorial medial direita",
    description: "Integração sensorial, processamento somatossensorial e propriocepção. Córtex parietal posterior direito medial."
  },
  {
    point: "CP6",
    function: "Atenção espacial e navegação",
    description: "Atenção espacial, navegação e representação do espaço peripessoal. Córtex parietal posterior direito."
  },

  // Região Temporal (Verde) - 4 pontos
  {
    point: "T3",
    function: "Memória verbal e linguagem - Wernicke",
    description: "Memória verbal, compreensão de linguagem complexa e processamento de significados. Córtex temporal médio esquerdo. Área de Wernicke - melhora da compreensão auditiva e consolidação de memórias verbais."
  },
  {
    point: "T4",
    function: "Processamento não-verbal e reconhecimento",
    description: "Processamento não-verbal, reconhecimento de faces e processamento de emoções. Córtex temporal médio direito. Reconhecimento de faces e processamento emocional."
  },
  {
    point: "T5",
    function: "Processamento auditivo posterior esquerdo",
    description: "Processamento auditivo posterior, memória semântica e integração de linguagem. Córtex temporal posterior esquerdo."
  },
  {
    point: "T6",
    function: "Processamento auditivo posterior direito",
    description: "Processamento auditivo posterior, reconhecimento de faces e processamento de emoções. Córtex temporal posterior direito."
  },

  // Região Parietal (Roxo Claro) - 3 pontos
  {
    point: "P3",
    function: "Integração sensorial e atenção espacial esquerda",
    description: "Integração sensorial, atenção espacial e processamento somatossensorial do lado direito. Córtex parietal inferior esquerdo. Suporte em leitura, escrita e cálculos."
  },
  {
    point: "Pz",
    function: "Integração visuomotora e atenção",
    description: "Integração visuomotora, atenção sustentada e processamento de informações espaciais. Córtex parietal medial. Integração da atenção visual-espacial."
  },
  {
    point: "P4",
    function: "Integração sensorial e atenção espacial direita",
    description: "Integração sensorial, atenção espacial e processamento somatossensorial do lado esquerdo. Córtex parietal inferior direito. Navegação espacial e percepção da imagem corporal."
  },

  // Região Parieto-Occipital (Roxo Escuro) - 3 pontos
  {
    point: "PO3",
    function: "Integração visuoespacial esquerda",
    description: "Integração visuoespacial, processamento visual anterior e percepção de profundidade. Córtex parieto-occipital esquerdo."
  },
  {
    point: "POz",
    function: "Integração visuoespacial bilateral",
    description: "Integração visuoespacial bilateral, processamento visual central e percepção de movimento. Córtex parieto-occipital medial."
  },
  {
    point: "PO4",
    function: "Integração visuoespacial direita",
    description: "Integração visuoespacial, processamento visual anterior e percepção de profundidade. Córtex parieto-occipital direito."
  },

  // Região Occipital (Rosa Claro/Salmão) - 3 pontos
  {
    point: "O1",
    function: "Processamento visual campo direito",
    description: "Processamento visual primário do campo visual direito, detecção de bordas e movimento. Córtex visual primário esquerdo. Estimulação da acuidade visual."
  },
  {
    point: "Oz",
    function: "Processamento visual central",
    description: "Processamento visual central, acuidade visual e percepção de detalhes finos. Córtex visual primário medial. Redução de auras visuais e estabilização da visão central."
  },
  {
    point: "O2",
    function: "Processamento visual campo esquerdo",
    description: "Processamento visual primário do campo visual esquerdo, detecção de bordas e movimento. Córtex visual primário direito. Estimulação da acuidade visual."
  },
];

/**
 * Busca a função específica de um ponto do capacete
 */
export function getPointFunction(point: string): PointFunction | undefined {
  return helmetPointFunctions.find(p => p.point === point);
}

/**
 * Busca todas as funções de uma lista de pontos
 */
export function getPointsFunctions(points: string[]): PointFunction[] {
  return points
    .map(point => getPointFunction(point))
    .filter((pf): pf is PointFunction => pf !== undefined);
}
