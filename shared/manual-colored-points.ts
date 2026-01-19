/**
 * Pontos Coloridos do Manual - Apenas áreas com adesivos
 * Baseado na imagem do manual com cores específicas
 * Cada cor representa uma região funcional
 */

export interface ColoredPoint {
  name: string;
  color: string;
  region: string;
  applications: string[];
  description: string;
}

export const COLORED_POINTS: ColoredPoint[] = [
  // ROSA - Região Frontal Anterior (Fp)
  {
    name: "Fp1",
    color: "#FF69B4", // Rosa
    region: "Região Frontal Anterior (Fp)",
    applications: ["Depressão maior resistente", "Transtornos de ansiedade generalizada", "Reabilitação de funções executivas", "Controle de impulsividade em TDAH"],
    description: "Região frontal anterior esquerda. Aplicações: Depressão maior resistente, transtornos de ansiedade generalizada, reabilitação de funções executivas e controle de impulsividade em TDAH."
  },
  {
    name: "Fpz",
    color: "#FF69B4", // Rosa
    region: "Região Frontal Anterior (Fp)",
    applications: ["Depressão maior resistente", "Transtornos de ansiedade generalizada", "Reabilitação de funções executivas", "Controle de impulsividade em TDAH"],
    description: "Região frontal anterior central. Aplicações: Depressão maior resistente, transtornos de ansiedade generalizada, reabilitação de funções executivas e controle de impulsividade em TDAH."
  },
  {
    name: "Fp2",
    color: "#FF69B4", // Rosa
    region: "Região Frontal Anterior (Fp)",
    applications: ["Depressão maior resistente", "Transtornos de ansiedade generalizada", "Reabilitação de funções executivas", "Controle de impulsividade em TDAH"],
    description: "Região frontal anterior direita. Aplicações: Depressão maior resistente, transtornos de ansiedade generalizada, reabilitação de funções executivas e controle de impulsividade em TDAH."
  },

  // LARANJA - Região Frontal Média (AF)
  {
    name: "AF3",
    color: "#FFA500", // Laranja
    region: "Região Frontal Média (AF)",
    applications: ["Treinamento de foco atencional", "Monitoramento de fadiga cognitiva", "Ambientes de alta performance", "Modulação da tomada de decisão"],
    description: "Região frontal média esquerda. Aplicações: Treinamento de foco atencional, monitoramento de fadiga cognitiva em ambientes de alta performance e modulação da tomada de decisão."
  },
  {
    name: "AFz",
    color: "#FFA500", // Laranja
    region: "Região Frontal Média (AF)",
    applications: ["Treinamento de foco atencional", "Monitoramento de fadiga cognitiva", "Ambientes de alta performance", "Modulação da tomada de decisão"],
    description: "Região frontal média central. Aplicações: Treinamento de foco atencional, monitoramento de fadiga cognitiva em ambientes de alta performance e modulação da tomada de decisão."
  },
  {
    name: "AF4",
    color: "#FFA500", // Laranja
    region: "Região Frontal Média (AF)",
    applications: ["Treinamento de foco atencional", "Monitoramento de fadiga cognitiva", "Ambientes de alta performance", "Modulação da tomada de decisão"],
    description: "Região frontal média direita. Aplicações: Treinamento de foco atencional, monitoramento de fadiga cognitiva em ambientes de alta performance e modulação da tomada de decisão."
  },

  // AMARELO - Região Frontal Central (F)
  {
    name: "F7",
    color: "#FFFF00", // Amarelo
    region: "Região Frontal Central (F)",
    applications: ["Tratamento de afasias expressivas (Broca)", "Reabilitação de coordenação motora fina", "Suporte em transtornos do espectro autista"],
    description: "Região frontal central esquerda lateral. Aplicações: Tratamento de afasias expressivas (Broca), reabilitação de coordenação motora fina e suporte em transtornos do espectro autista."
  },
  {
    name: "F3",
    color: "#FFFF00", // Amarelo
    region: "Região Frontal Central (F)",
    applications: ["Tratamento de afasias expressivas (Broca)", "Reabilitação de coordenação motora fina", "Suporte em transtornos do espectro autista"],
    description: "Região frontal central esquerda. Aplicações: Tratamento de afasias expressivas (Broca), reabilitação de coordenação motora fina e suporte em transtornos do espectro autista."
  },
  {
    name: "Fz",
    color: "#FFFF00", // Amarelo
    region: "Região Frontal Central (F)",
    applications: ["Tratamento de afasias expressivas (Broca)", "Reabilitação de coordenação motora fina", "Suporte em transtornos do espectro autista"],
    description: "Região frontal central. Aplicações: Tratamento de afasias expressivas (Broca), reabilitação de coordenação motora fina e suporte em transtornos do espectro autista."
  },
  {
    name: "F4",
    color: "#FFFF00", // Amarelo
    region: "Região Frontal Central (F)",
    applications: ["Tratamento de afasias expressivas (Broca)", "Reabilitação de coordenação motora fina", "Suporte em transtornos do espectro autista"],
    description: "Região frontal central direita. Aplicações: Tratamento de afasias expressivas (Broca), reabilitação de coordenação motora fina e suporte em transtornos do espectro autista."
  },
  {
    name: "F8",
    color: "#FFFF00", // Amarelo
    region: "Região Frontal Central (F)",
    applications: ["Tratamento de afasias expressivas (Broca)", "Reabilitação de coordenação motora fina", "Suporte em transtornos do espectro autista"],
    description: "Região frontal central direita lateral. Aplicações: Tratamento de afasias expressivas (Broca), reabilitação de coordenação motora fina e suporte em transtornos do espectro autista."
  },

  // CIANO - Região Central / Sensório-Motora (C/FC/CP)
  {
    name: "FC1",
    color: "#00CED1", // Ciano
    region: "Região Central / Sensório-Motora (C/FC/CP)",
    applications: ["Manejo de dor crônica neuropática", "Reabilitação pós-AVC (hemipareisas)", "Controle de tremores em Parkinson", "Epilepsias focais"],
    description: "Região sensório-motora frontal central esquerda. Aplicações: Manejo de dor crônica neuropática, reabilitação pós-AVC, controle de tremores em Parkinson e epilepsias focais."
  },
  {
    name: "FC5",
    color: "#00CED1", // Ciano
    region: "Região Central / Sensório-Motora (C/FC/CP)",
    applications: ["Manejo de dor crônica neuropática", "Reabilitação pós-AVC (hemipareisas)", "Controle de tremores em Parkinson", "Epilepsias focais"],
    description: "Região sensório-motora frontal central esquerda lateral. Aplicações: Manejo de dor crônica neuropática, reabilitação pós-AVC, controle de tremores em Parkinson e epilepsias focais."
  },
  {
    name: "FC2",
    color: "#00CED1", // Ciano
    region: "Região Central / Sensório-Motora (C/FC/CP)",
    applications: ["Manejo de dor crônica neuropática", "Reabilitação pós-AVC (hemipareisas)", "Controle de tremores em Parkinson", "Epilepsias focais"],
    description: "Região sensório-motora frontal central direita. Aplicações: Manejo de dor crônica neuropática, reabilitação pós-AVC, controle de tremores em Parkinson e epilepsias focais."
  },
  {
    name: "FC6",
    color: "#00CED1", // Ciano
    region: "Região Central / Sensório-Motora (C/FC/CP)",
    applications: ["Manejo de dor crônica neuropática", "Reabilitação pós-AVC (hemipareisas)", "Controle de tremores em Parkinson", "Epilepsias focais"],
    description: "Região sensório-motora frontal central direita lateral. Aplicações: Manejo de dor crônica neuropática, reabilitação pós-AVC, controle de tremores em Parkinson e epilepsias focais."
  },
  {
    name: "FCz",
    color: "#00CED1", // Ciano
    region: "Região Central / Sensório-Motora (C/FC/CP)",
    applications: ["Manejo de dor crônica neuropática", "Reabilitação pós-AVC (hemipareisas)", "Controle de tremores em Parkinson", "Epilepsias focais"],
    description: "Região sensório-motora frontal central. Aplicações: Manejo de dor crônica neuropática, reabilitação pós-AVC, controle de tremores em Parkinson e epilepsias focais."
  },
  {
    name: "C1",
    color: "#00CED1", // Ciano
    region: "Região Central / Sensório-Motora (C/FC/CP)",
    applications: ["Manejo de dor crônica neuropática", "Reabilitação pós-AVC (hemipareisas)", "Controle de tremores em Parkinson", "Epilepsias focais"],
    description: "Região sensório-motora central esquerda. Aplicações: Manejo de dor crônica neuropática, reabilitação pós-AVC, controle de tremores em Parkinson e epilepsias focais."
  },
  {
    name: "Cz",
    color: "#00CED1", // Ciano
    region: "Região Central / Sensório-Motora (C/FC/CP)",
    applications: ["Manejo de dor crônica neuropática", "Reabilitação pós-AVC (hemipareisas)", "Controle de tremores em Parkinson", "Epilepsias focais"],
    description: "Região sensório-motora central. Aplicações: Manejo de dor crônica neuropática, reabilitação pós-AVC, controle de tremores em Parkinson e epilepsias focais."
  },
  {
    name: "C2",
    color: "#00CED1", // Ciano
    region: "Região Central / Sensório-Motora (C/FC/CP)",
    applications: ["Manejo de dor crônica neuropática", "Reabilitação pós-AVC (hemipareisas)", "Controle de tremores em Parkinson", "Epilepsias focais"],
    description: "Região sensório-motora central direita. Aplicações: Manejo de dor crônica neuropática, reabilitação pós-AVC, controle de tremores em Parkinson e epilepsias focais."
  },
  {
    name: "C3",
    color: "#00CED1", // Ciano
    region: "Região Central / Sensório-Motora (C/FC/CP)",
    applications: ["Manejo de dor crônica neuropática", "Reabilitação pós-AVC (hemipareisas)", "Controle de tremores em Parkinson", "Epilepsias focais"],
    description: "Região sensório-motora central esquerda lateral. Aplicações: Manejo de dor crônica neuropática, reabilitação pós-AVC, controle de tremores em Parkinson e epilepsias focais."
  },
  {
    name: "C4",
    color: "#00CED1", // Ciano
    region: "Região Central / Sensório-Motora (C/FC/CP)",
    applications: ["Manejo de dor crônica neuropática", "Reabilitação pós-AVC (hemipareisas)", "Controle de tremores em Parkinson", "Epilepsias focais"],
    description: "Região sensório-motora central direita lateral. Aplicações: Manejo de dor crônica neuropática, reabilitação pós-AVC, controle de tremores em Parkinson e epilepsias focais."
  },
  {
    name: "C5",
    color: "#00CED1", // Ciano
    region: "Região Central / Sensório-Motora (C/FC/CP)",
    applications: ["Manejo de dor crônica neuropática", "Reabilitação pós-AVC (hemipareisas)", "Controle de tremores em Parkinson", "Epilepsias focais"],
    description: "Região sensório-motora central esquerda. Aplicações: Manejo de dor crônica neuropática, reabilitação pós-AVC, controle de tremores em Parkinson e epilepsias focais."
  },
  {
    name: "C6",
    color: "#00CED1", // Ciano
    region: "Região Central / Sensório-Motora (C/FC/CP)",
    applications: ["Manejo de dor crônica neuropática", "Reabilitação pós-AVC (hemipareisas)", "Controle de tremores em Parkinson", "Epilepsias focais"],
    description: "Região sensório-motora central direita. Aplicações: Manejo de dor crônica neuropática, reabilitação pós-AVC, controle de tremores em Parkinson e epilepsias focais."
  },
  {
    name: "CP1",
    color: "#00CED1", // Ciano
    region: "Região Central / Sensório-Motora (C/FC/CP)",
    applications: ["Manejo de dor crônica neuropática", "Reabilitação pós-AVC (hemipareisas)", "Controle de tremores em Parkinson", "Epilepsias focais"],
    description: "Região sensório-motora central-parietal esquerda. Aplicações: Manejo de dor crônica neuropática, reabilitação pós-AVC, controle de tremores em Parkinson e epilepsias focais."
  },
  {
    name: "CPz",
    color: "#00CED1", // Ciano
    region: "Região Central / Sensório-Motora (C/FC/CP)",
    applications: ["Manejo de dor crônica neuropática", "Reabilitação pós-AVC (hemipareisas)", "Controle de tremores em Parkinson", "Epilepsias focais"],
    description: "Região sensório-motora central-parietal. Aplicações: Manejo de dor crônica neuropática, reabilitação pós-AVC, controle de tremores em Parkinson e epilepsias focais."
  },
  {
    name: "CP2",
    color: "#00CED1", // Ciano
    region: "Região Central / Sensório-Motora (C/FC/CP)",
    applications: ["Manejo de dor crônica neuropática", "Reabilitação pós-AVC (hemipareisas)", "Controle de tremores em Parkinson", "Epilepsias focais"],
    description: "Região sensório-motora central-parietal direita. Aplicações: Manejo de dor crônica neuropática, reabilitação pós-AVC, controle de tremores em Parkinson e epilepsias focais."
  },
  {
    name: "CP5",
    color: "#00CED1", // Ciano
    region: "Região Central / Sensório-Motora (C/FC/CP)",
    applications: ["Manejo de dor crônica neuropática", "Reabilitação pós-AVC (hemipareisas)", "Controle de tremores em Parkinson", "Epilepsias focais"],
    description: "Região sensório-motora central-parietal esquerda lateral. Aplicações: Manejo de dor crônica neuropática, reabilitação pós-AVC, controle de tremores em Parkinson e epilepsias focais."
  },
  {
    name: "CP6",
    color: "#00CED1", // Ciano
    region: "Região Central / Sensório-Motora (C/FC/CP)",
    applications: ["Manejo de dor crônica neuropática", "Reabilitação pós-AVC (hemipareisas)", "Controle de tremores em Parkinson", "Epilepsias focais"],
    description: "Região sensório-motora central-parietal direita lateral. Aplicações: Manejo de dor crônica neuropática, reabilitação pós-AVC, controle de tremores em Parkinson e epilepsias focais."
  },

  // VERDE - Região Temporal (T)
  {
    name: "T3",
    color: "#00FF00", // Verde
    region: "Região Temporal (T)",
    applications: ["Reabilitação de memória em Alzheimer precoce", "Tratamento de zumbido (tinnitus)", "Distúrbios de compreensão de linguagem (Wernicke)"],
    description: "Região temporal esquerda. Aplicações: Reabilitação de memória em Alzheimer precoce, tratamento de zumbido (tinnitus) e distúrbios de compreensão de linguagem (Wernicke)."
  },
  {
    name: "T4",
    color: "#00FF00", // Verde
    region: "Região Temporal (T)",
    applications: ["Reabilitação de memória em Alzheimer precoce", "Tratamento de zumbido (tinnitus)", "Distúrbios de compreensão de linguagem (Wernicke)"],
    description: "Região temporal direita. Aplicações: Reabilitação de memória em Alzheimer precoce, tratamento de zumbido (tinnitus) e distúrbios de compreensão de linguagem (Wernicke)."
  },
  {
    name: "T5",
    color: "#00FF00", // Verde
    region: "Região Temporal (T)",
    applications: ["Reabilitação de memória em Alzheimer precoce", "Tratamento de zumbido (tinnitus)", "Distúrbios de compreensão de linguagem (Wernicke)"],
    description: "Região temporal esquerda posterior. Aplicações: Reabilitação de memória em Alzheimer precoce, tratamento de zumbido (tinnitus) e distúrbios de compreensão de linguagem (Wernicke)."
  },
  {
    name: "T6",
    color: "#00FF00", // Verde
    region: "Região Temporal (T)",
    applications: ["Reabilitação de memória em Alzheimer precoce", "Tratamento de zumbido (tinnitus)", "Distúrbios de compreensão de linguagem (Wernicke)"],
    description: "Região temporal direita posterior. Aplicações: Reabilitação de memória em Alzheimer precoce, tratamento de zumbido (tinnitus) e distúrbios de compreensão de linguagem (Wernicke)."
  },

  // ROXO - Região Parietal (P) e Parieto-Occipital (PO)
  {
    name: "P3",
    color: "#9370DB", // Roxo
    region: "Região Parietal (P)",
    applications: ["Tratamento de discalculia", "Correção de negligência espacial unilateral", "Suporte em distúrbios de integração sensorial"],
    description: "Região parietal esquerda. Aplicações: Tratamento de discalculia, correção de negligência espacial unilateral e suporte em distúrbios de integração sensorial."
  },
  {
    name: "Pz",
    color: "#9370DB", // Roxo
    region: "Região Parietal (P)",
    applications: ["Tratamento de discalculia", "Correção de negligência espacial unilateral", "Suporte em distúrbios de integração sensorial"],
    description: "Região parietal central. Aplicações: Tratamento de discalculia, correção de negligência espacial unilateral e suporte em distúrbios de integração sensorial."
  },
  {
    name: "P4",
    color: "#9370DB", // Roxo
    region: "Região Parietal (P)",
    applications: ["Tratamento de discalculia", "Correção de negligência espacial unilateral", "Suporte em distúrbios de integração sensorial"],
    description: "Região parietal direita. Aplicações: Tratamento de discalculia, correção de negligência espacial unilateral e suporte em distúrbios de integração sensorial."
  },
  {
    name: "PO3",
    color: "#9370DB", // Roxo
    region: "Região Parieto-Occipital (PO)",
    applications: ["Melhora da coordenação visomotora em atletas", "Reabilitação de ataxia óptica", "Distúrbios de percepção de profundidade"],
    description: "Região parieto-occipital esquerda. Aplicações: Melhora da coordenação visomotora em atletas, reabilitação de ataxia óptica e distúrbios de percepção de profundidade."
  },
  {
    name: "POz",
    color: "#9370DB", // Roxo
    region: "Região Parieto-Occipital (PO)",
    applications: ["Melhora da coordenação visomotora em atletas", "Reabilitação de ataxia óptica", "Distúrbios de percepção de profundidade"],
    description: "Região parieto-occipital central. Aplicações: Melhora da coordenação visomotora em atletas, reabilitação de ataxia óptica e distúrbios de percepção de profundidade."
  },
  {
    name: "PO4",
    color: "#9370DB", // Roxo
    region: "Região Parieto-Occipital (PO)",
    applications: ["Melhora da coordenação visomotora em atletas", "Reabilitação de ataxia óptica", "Distúrbios de percepção de profundidade"],
    description: "Região parieto-occipital direita. Aplicações: Melhora da coordenação visomotora em atletas, reabilitação de ataxia óptica e distúrbios de percepção de profundidade."
  },

  // ROSA CLARO - Região Occipital (O)
  {
    name: "O1",
    color: "#FFB6C1", // Rosa claro
    region: "Região Occipital (O)",
    applications: ["Tratamento de enxaquecas com aura visual", "Suporte em cegueira cortical", "Modulação de distúrbios do processamento visual primário"],
    description: "Região occipital esquerda. Aplicações: Tratamento de enxaquecas com aura visual, suporte em cegueira cortical e modulação de distúrbios do processamento visual primário."
  },
  {
    name: "Oz",
    color: "#FFB6C1", // Rosa claro
    region: "Região Occipital (O)",
    applications: ["Tratamento de enxaquecas com aura visual", "Suporte em cegueira cortical", "Modulação de distúrbios do processamento visual primário"],
    description: "Região occipital central. Aplicações: Tratamento de enxaquecas com aura visual, suporte em cegueira cortical e modulação de distúrbios do processamento visual primário."
  },
  {
    name: "O2",
    color: "#FFB6C1", // Rosa claro
    region: "Região Occipital (O)",
    applications: ["Tratamento de enxaquecas com aura visual", "Suporte em cegueira cortical", "Modulação de distúrbios do processamento visual primário"],
    description: "Região occipital direita. Aplicações: Tratamento de enxaquecas com aura visual, suporte em cegueira cortical e modulação de distúrbios do processamento visual primário."
  },
];

export const COLORED_REGIONS = [
  {
    name: "Região Frontal Anterior (Fp)",
    color: "#FF69B4",
    applications: ["Depressão maior resistente", "Transtornos de ansiedade generalizada", "Reabilitação de funções executivas", "Controle de impulsividade em TDAH"],
  },
  {
    name: "Região Frontal Média (AF)",
    color: "#FFA500",
    applications: ["Treinamento de foco atencional", "Monitoramento de fadiga cognitiva", "Ambientes de alta performance", "Modulação da tomada de decisão"],
  },
  {
    name: "Região Frontal Central (F)",
    color: "#FFFF00",
    applications: ["Tratamento de afasias expressivas (Broca)", "Reabilitação de coordenação motora fina", "Suporte em transtornos do espectro autista"],
  },
  {
    name: "Região Central / Sensório-Motora (C/FC/CP)",
    color: "#00CED1",
    applications: ["Manejo de dor crônica neuropática", "Reabilitação pós-AVC (hemipareisas)", "Controle de tremores em Parkinson", "Epilepsias focais"],
  },
  {
    name: "Região Temporal (T)",
    color: "#00FF00",
    applications: ["Reabilitação de memória em Alzheimer precoce", "Tratamento de zumbido (tinnitus)", "Distúrbios de compreensão de linguagem (Wernicke)"],
  },
  {
    name: "Região Parietal (P)",
    color: "#9370DB",
    applications: ["Tratamento de discalculia", "Correção de negligência espacial unilateral", "Suporte em distúrbios de integração sensorial"],
  },
  {
    name: "Região Parieto-Occipital (PO)",
    color: "#9370DB",
    applications: ["Melhora da coordenação visomotora em atletas", "Reabilitação de ataxia óptica", "Distúrbios de percepção de profundidade"],
  },
  {
    name: "Região Occipital (O)",
    color: "#FFB6C1",
    applications: ["Tratamento de enxaquecas com aura visual", "Suporte em cegueira cortical", "Modulação de distúrbios do processamento visual primário"],
  },
];

export function getColoredPointByName(name: string): ColoredPoint | undefined {
  return COLORED_POINTS.find(p => p.name === name);
}

export function getColoredPointsByRegion(region: string): ColoredPoint[] {
  return COLORED_POINTS.filter(p => p.region === region);
}

export function getAllColoredPointNames(): string[] {
  return COLORED_POINTS.map(p => p.name);
}
