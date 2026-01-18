/**
 * Funções específicas de cada ponto do capacete
 * Baseado no manual de adesivos e Sistema 10-20
 */

export interface PointFunction {
  point: string;
  function: string;
  description: string;
}

export const helmetPointFunctions: PointFunction[] = [
  // Região Frontal Anterior (Rosa/Magenta)
  {
    point: "Fp1",
    function: "Melhora da depressão e afeto positivo",
    description: "Melhora da depressão, aumento do afeto positivo e redução da ruminação mental. Estimulação do córtex pré-frontal dorsolateral esquerdo."
  },
  {
    point: "Fp2",
    function: "Redução de ansiedade e hiperatividade",
    description: "Redução de ansiedade, hiperatividade e impulsividade. Modulação do córtex pré-frontal dorsolateral direito."
  },
  {
    point: "Fpz",
    function: "Controle executivo e atenção",
    description: "Melhora do controle executivo, atenção sustentada e tomada de decisão. Região medial do córtex pré-frontal."
  },
  
  // Região Frontal Média (Laranja)
  {
    point: "F3",
    function: "Memória de trabalho e funções executivas",
    description: "Melhora da memória de trabalho, planejamento e organização. Córtex pré-frontal dorsolateral esquerdo."
  },
  {
    point: "F4",
    function: "Controle inibitório e regulação emocional",
    description: "Melhora do controle inibitório, regulação emocional e redução de impulsividade. Córtex pré-frontal dorsolateral direito."
  },
  {
    point: "Fz",
    function: "Atenção e controle cognitivo",
    description: "Melhora da atenção, controle cognitivo e monitoramento de conflitos. Córtex pré-frontal medial."
  },
  {
    point: "F7",
    function: "Linguagem e memória verbal",
    description: "Melhora da fluência verbal, memória verbal e processamento de linguagem. Córtex frontal inferior esquerdo."
  },
  {
    point: "F8",
    function: "Atenção espacial e memória visual",
    description: "Melhora da atenção espacial, memória visual e reconhecimento facial. Córtex frontal inferior direito."
  },

  // Região Central (Verde)
  {
    point: "C3",
    function: "Controle motor membro superior direito",
    description: "Controle motor fino do membro superior direito, coordenação motora e aprendizado motor. Córtex motor primário esquerdo."
  },
  {
    point: "C4",
    function: "Controle motor membro superior esquerdo",
    description: "Controle motor fino do membro superior esquerdo, coordenação motora e aprendizado motor. Córtex motor primário direito."
  },
  {
    point: "Cz",
    function: "Controle motor bilateral e equilíbrio",
    description: "Controle motor bilateral, equilíbrio e coordenação de movimentos complexos. Córtex motor medial."
  },

  // Região Temporal (Azul)
  {
    point: "T3",
    function: "Memória verbal e processamento auditivo",
    description: "Memória verbal, processamento auditivo e compreensão de linguagem. Córtex temporal superior esquerdo."
  },
  {
    point: "T4",
    function: "Memória visual e reconhecimento",
    description: "Memória visual, reconhecimento de faces e processamento de emoções. Córtex temporal superior direito."
  },
  {
    point: "T5",
    function: "Memória semântica e linguagem",
    description: "Memória semântica, compreensão de linguagem complexa e processamento de significados. Córtex temporal médio esquerdo."
  },
  {
    point: "T6",
    function: "Processamento visuoespacial",
    description: "Processamento visuoespacial, navegação espacial e memória de localização. Córtex temporal médio direito."
  },

  // Região Parietal (Amarelo)
  {
    point: "P3",
    function: "Integração sensorial e atenção espacial esquerda",
    description: "Integração sensorial, atenção espacial e processamento somatossensorial do lado direito. Córtex parietal inferior esquerdo."
  },
  {
    point: "P4",
    function: "Integração sensorial e atenção espacial direita",
    description: "Integração sensorial, atenção espacial e processamento somatossensorial do lado esquerdo. Córtex parietal inferior direito."
  },
  {
    point: "Pz",
    function: "Integração visuomotora e atenção",
    description: "Integração visuomotora, atenção sustentada e processamento de informações espaciais. Córtex parietal medial."
  },

  // Região Occipital (Roxo)
  {
    point: "O1",
    function: "Processamento visual campo direito",
    description: "Processamento visual primário do campo visual direito, detecção de bordas e movimento. Córtex visual primário esquerdo."
  },
  {
    point: "O2",
    function: "Processamento visual campo esquerdo",
    description: "Processamento visual primário do campo visual esquerdo, detecção de bordas e movimento. Córtex visual primário direito."
  },
  {
    point: "Oz",
    function: "Processamento visual central",
    description: "Processamento visual central, acuidade visual e percepção de detalhes finos. Córtex visual primário medial."
  },

  // Pontos Adicionais
  {
    point: "AF7",
    function: "Controle emocional e empatia",
    description: "Regulação emocional, empatia e processamento de expressões faciais. Córtex pré-frontal ventrolateral esquerdo."
  },
  {
    point: "AF8",
    function: "Atenção e vigilância",
    description: "Atenção sustentada, vigilância e detecção de estímulos salientes. Córtex pré-frontal ventrolateral direito."
  },
  {
    point: "FC5",
    function: "Planejamento motor e linguagem",
    description: "Planejamento motor complexo, produção de linguagem e coordenação orofacial. Área de Broca e córtex pré-motor esquerdo."
  },
  {
    point: "FC6",
    function: "Atenção e controle motor",
    description: "Atenção visuoespacial, controle motor e preparação de respostas. Córtex pré-motor direito."
  },
  {
    point: "CP5",
    function: "Integração sensoriomotora",
    description: "Integração sensoriomotora, propriocepção e coordenação de movimentos complexos. Córtex parietal posterior esquerdo."
  },
  {
    point: "CP6",
    function: "Atenção espacial e navegação",
    description: "Atenção espacial, navegação e representação do espaço peripessoal. Córtex parietal posterior direito."
  },
  {
    point: "PO7",
    function: "Processamento visual complexo",
    description: "Processamento visual complexo, reconhecimento de objetos e análise de cenas visuais. Córtex occipitotemporal esquerdo."
  },
  {
    point: "PO8",
    function: "Processamento visuoespacial",
    description: "Processamento visuoespacial, localização de objetos e análise de movimento. Córtex occipitotemporal direito."
  }
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
