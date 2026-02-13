/**
 * Protocolos Prontos para tDCS (Estimulação Transcraniana por Corrente Contínua)
 * 13 protocolos validados para diferentes condições clínicas
 */

export interface tDCSProtocol {
  id: string;
  name: string;
  condition: string;
  anode: string[];
  cathode: string[];
  intensity: number; // em mA
  duration: number; // em minutos
  frequency: string; // ex: "5x por semana"
  sessions: number;
  polarity: "anodal" | "cathodal" | "bilateral";
  description: string;
  evidence: string;
}

export const TDCS_PROTOCOLS: tDCSProtocol[] = [
  {
    id: "tdcs_depression_dlpfc",
    name: "Depressão - DLPFC Bilateral",
    condition: "Depressão Maior",
    anode: ["F3"],
    cathode: ["F4"],
    intensity: 2.0,
    duration: 20,
    frequency: "5x por semana",
    sessions: 10,
    polarity: "anodal",
    description: "Estimulação do córtex pré-frontal dorsolateral esquerdo para depressão",
    evidence: "Forte evidência em estudos clínicos randomizados"
  },
  {
    id: "tdcs_pain_m1",
    name: "Dor Crônica - M1",
    condition: "Dor Crônica",
    anode: ["C3"],
    cathode: ["Cz"],
    intensity: 2.0,
    duration: 20,
    frequency: "3x por semana",
    sessions: 15,
    polarity: "anodal",
    description: "Estimulação do córtex motor primário para alívio de dor",
    evidence: "Evidência moderada para dor crônica"
  },
  {
    id: "tdcs_anxiety_dlpfc_right",
    name: "Ansiedade - DLPFC Direito",
    condition: "Transtorno de Ansiedade",
    anode: ["F4"],
    cathode: ["F3"],
    intensity: 1.5,
    duration: 20,
    frequency: "5x por semana",
    sessions: 10,
    polarity: "anodal",
    description: "Estimulação do DLPFC direito para redução de ansiedade",
    evidence: "Evidência em desenvolvimento"
  },
  {
    id: "tdcs_tinnitus_temporal",
    name: "Zumbido - Temporal",
    condition: "Zumbido",
    anode: ["T4"],
    cathode: ["T3"],
    intensity: 2.0,
    duration: 20,
    frequency: "5x por semana",
    sessions: 10,
    polarity: "cathodal",
    description: "Inibição do córtex temporal para redução de zumbido",
    evidence: "Evidência moderada"
  },
  {
    id: "tdcs_stroke_motor",
    name: "AVC - Recuperação Motora",
    condition: "Acidente Vascular Cerebral",
    anode: ["C3"],
    cathode: ["C4"],
    intensity: 1.5,
    duration: 20,
    frequency: "5x por semana",
    sessions: 10,
    polarity: "anodal",
    description: "Estimulação do hemisfério lesado para recuperação motora",
    evidence: "Forte evidência em reabilitação pós-AVC"
  },
  {
    id: "tdcs_aphasia_broca",
    name: "Afasia - Área de Broca",
    condition: "Afasia",
    anode: ["F7"],
    cathode: ["F8"],
    intensity: 1.5,
    duration: 20,
    frequency: "5x por semana",
    sessions: 10,
    polarity: "anodal",
    description: "Estimulação da área de Broca para melhora de linguagem",
    evidence: "Evidência moderada em afasia"
  },
  {
    id: "tdcs_migraine_visual",
    name: "Migrânea - Córtex Visual",
    condition: "Migrânea",
    anode: ["O1"],
    cathode: ["O2"],
    intensity: 2.0,
    duration: 20,
    frequency: "3x por semana",
    sessions: 12,
    polarity: "cathodal",
    description: "Inibição do córtex visual occipital para prevenção de migrânea",
    evidence: "Evidência em desenvolvimento"
  },
  {
    id: "tdcs_fibromialgia_m1",
    name: "Fibromialgia - M1 Bilateral",
    condition: "Fibromialgia",
    anode: ["C3"],
    cathode: ["C4"],
    intensity: 2.0,
    duration: 20,
    frequency: "3x por semana",
    sessions: 15,
    polarity: "bilateral",
    description: "Estimulação bilateral do córtex motor para fibromialgia",
    evidence: "Evidência moderada"
  },
  {
    id: "tdcs_ptsd_dlpfc",
    name: "TEPT - DLPFC Bilateral",
    condition: "Transtorno de Estresse Pós-Traumático",
    anode: ["F3"],
    cathode: ["F4"],
    intensity: 2.0,
    duration: 20,
    frequency: "5x por semana",
    sessions: 10,
    polarity: "anodal",
    description: "Estimulação do DLPFC para regulação emocional em TEPT",
    evidence: "Evidência em desenvolvimento"
  },
  {
    id: "tdcs_ocd_dlpfc",
    name: "TOC - DLPFC",
    condition: "Transtorno Obsessivo-Compulsivo",
    anode: ["F3"],
    cathode: ["Fp2"],
    intensity: 2.0,
    duration: 20,
    frequency: "5x por semana",
    sessions: 10,
    polarity: "anodal",
    description: "Estimulação do DLPFC para redução de compulsões",
    evidence: "Evidência moderada"
  },
  {
    id: "tdcs_cognition_pfc",
    name: "Cognição - PFC Bilateral",
    condition: "Comprometimento Cognitivo Leve",
    anode: ["Fz"],
    cathode: ["Pz"],
    intensity: 1.5,
    duration: 20,
    frequency: "3x por semana",
    sessions: 12,
    polarity: "anodal",
    description: "Estimulação do córtex pré-frontal para melhora cognitiva",
    evidence: "Evidência em desenvolvimento"
  },
  {
    id: "tdcs_addiction_dlpfc",
    name: "Dependência - DLPFC",
    condition: "Dependência de Substâncias",
    anode: ["F3"],
    cathode: ["F4"],
    intensity: 2.0,
    duration: 20,
    frequency: "5x por semana",
    sessions: 10,
    polarity: "anodal",
    description: "Estimulação do DLPFC para redução de craving",
    evidence: "Evidência moderada"
  },
  {
    id: "tdcs_parkinsons_motor",
    name: "Parkinson - Córtex Motor",
    condition: "Doença de Parkinson",
    anode: ["C3"],
    cathode: ["C4"],
    intensity: 1.5,
    duration: 20,
    frequency: "3x por semana",
    sessions: 15,
    polarity: "bilateral",
    description: "Estimulação bilateral para sintomas motores de Parkinson",
    evidence: "Evidência moderada"
  },
];

export function getTDCSProtocolById(id: string): tDCSProtocol | undefined {
  return TDCS_PROTOCOLS.find(p => p.id === id);
}

export function getTDCSProtocolsByCondition(condition: string): tDCSProtocol[] {
  return TDCS_PROTOCOLS.filter(p => p.condition.toLowerCase().includes(condition.toLowerCase()));
}
