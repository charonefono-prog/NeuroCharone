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
    point: "AF7",
    function: "Controle emocional e empatia",
    description: "Regulação emocional, empatia e processamento de expressões faciais. Córtex pré-frontal ventrolateral esquerdo. Otimização da memória de trabalho e facilitação do raciocínio lógico-matemático."
  },
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
  {
    point: "AF8",
    function: "Atenção e vigilância",
    description: "Atenção sustentada, vigilância e detecção de estímulos salientes. Córtex pré-frontal ventrolateral direito."
  },

  // Região Frontal Central (Amarelo)
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
    point: "F1",
    function: "Coordenação da intenção motora",
    description: "Coordenação da intenção motora, suporte na motivação para ação e planejamento motor. Córtex pré-motor esquerdo."
  },
  {
    point: "Fz",
    function: "Atenção e controle cognitivo",
    description: "Melhora da atenção, controle cognitivo e monitoramento de conflitos. Córtex pré-frontal medial. Coordenação da intenção motora bilateral."
  },
  {
    point: "F2",
    function: "Coordenação motora e motivação",
    description: "Coordenação da intenção motora, suporte na motivação para ação e planejamento motor. Córtex pré-motor direito."
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

  // Região Central/Sensório-Motora (Ciano)
  {
    point: "FC5",
    function: "Planejamento motor e linguagem",
    description: "Planejamento motor complexo, produção de linguagem e coordenação orofacial. Área de Broca e córtex pré-motor esquerdo."
  },
  {
    point: "FC3",
    function: "Controle motor fino esquerdo",
    description: "Controle motor fino do lado direito, coordenação motora e aprendizado motor. Córtex motor primário esquerdo."
  },
  {
    point: "FC1",
    function: "Integração sensório-motora esquerda",
    description: "Integração sensório-motora, propriocepção e coordenação de movimentos. Córtex motor primário esquerdo."
  },
  {
    point: "FCz",
    function: "Controle motor bilateral",
    description: "Controle motor bilateral, equilíbrio e coordenação de movimentos complexos. Córtex motor medial."
  },
  {
    point: "FC2",
    function: "Integração sensório-motora direita",
    description: "Integração sensório-motora, propriocepção e coordenação de movimentos. Córtex motor primário direito."
  },
  {
    point: "FC4",
    function: "Controle motor fino direito",
    description: "Controle motor fino do lado esquerdo, coordenação motora e aprendizado motor. Córtex motor primário direito."
  },
  {
    point: "FC6",
    function: "Atenção e controle motor",
    description: "Atenção visuoespacial, controle motor e preparação de respostas. Córtex pré-motor direito."
  },
  {
    point: "C5",
    function: "Controle motor periférico esquerdo",
    description: "Controle motor fino do membro superior direito, coordenação motora e aprendizado motor. Córtex motor primário esquerdo lateral."
  },
  {
    point: "C3",
    function: "Controle motor membro superior direito",
    description: "Controle motor fino do membro superior direito, coordenação motora e aprendizado motor. Córtex motor primário esquerdo."
  },
  {
    point: "C1",
    function: "Controle motor medial direito",
    description: "Controle motor fino do lado direito, coordenação motora e aprendizado motor. Córtex motor primário esquerdo medial."
  },
  {
    point: "Cz",
    function: "Controle motor bilateral e equilíbrio",
    description: "Controle motor bilateral, equilíbrio e coordenação de movimentos complexos. Córtex motor medial. Integração somatossensorial bilateral e controle postural central."
  },
  {
    point: "C2",
    function: "Controle motor medial esquerdo",
    description: "Controle motor fino do lado esquerdo, coordenação motora e aprendizado motor. Córtex motor primário direito medial."
  },
  {
    point: "C4",
    function: "Controle motor membro superior esquerdo",
    description: "Controle motor fino do membro superior esquerdo, coordenação motora e aprendizado motor. Córtex motor primário direito."
  },
  {
    point: "C6",
    function: "Controle motor periférico direito",
    description: "Controle motor fino do membro superior esquerdo, coordenação motora e aprendizado motor. Córtex motor primário direito lateral."
  },
  {
    point: "CP5",
    function: "Integração sensoriomotora",
    description: "Integração sensoriomotora, propriocepção e coordenação de movimentos complexos. Córtex parietal posterior esquerdo."
  },
  {
    point: "CP3",
    function: "Processamento somatossensorial esquerdo",
    description: "Processamento somatossensorial, tato, propriocepção e dor. Córtex parietal posterior esquerdo."
  },
  {
    point: "CP1",
    function: "Integração sensorial medial esquerda",
    description: "Integração sensorial, processamento somatossensorial e propriocepção. Córtex parietal posterior esquerdo medial."
  },
  {
    point: "CPz",
    function: "Integração sensório-motora bilateral",
    description: "Integração sensório-motora bilateral, propriocepção e coordenação. Córtex parietal posterior medial."
  },
  {
    point: "CP2",
    function: "Integração sensorial medial direita",
    description: "Integração sensorial, processamento somatossensorial e propriocepção. Córtex parietal posterior direito medial."
  },
  {
    point: "CP4",
    function: "Processamento somatossensorial direito",
    description: "Processamento somatossensorial, tato, propriocepção e dor. Córtex parietal posterior direito."
  },
  {
    point: "CP6",
    function: "Atenção espacial e navegação",
    description: "Atenção espacial, navegação e representação do espaço peripessoal. Córtex parietal posterior direito."
  },

  // Região Temporal (Verde)
  {
    point: "T9",
    function: "Processamento auditivo inferior esquerdo",
    description: "Processamento auditivo inferior, compreensão de linguagem e memória semântica. Córtex temporal superior esquerdo."
  },
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
    point: "T10",
    function: "Processamento auditivo inferior direito",
    description: "Processamento auditivo inferior, reconhecimento de faces e processamento de emoções. Córtex temporal superior direito."
  },

  // Região Parietal (Roxo)
  {
    point: "P1",
    function: "Integração sensorial medial esquerda",
    description: "Integração sensorial, atenção espacial e processamento somatossensorial medial. Córtex parietal inferior esquerdo medial."
  },
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
    point: "P2",
    function: "Integração sensorial medial direita",
    description: "Integração sensorial, atenção espacial e processamento somatossensorial medial. Córtex parietal inferior direito medial."
  },
  {
    point: "P4",
    function: "Integração sensorial e atenção espacial direita",
    description: "Integração sensorial, atenção espacial e processamento somatossensorial do lado esquerdo. Córtex parietal inferior direito. Navegação espacial e percepção da imagem corporal."
  },


  // Região Occipital (Salmão)
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
