/**
 * Sistema de Escalas Clínicas
 * 6 escalas profissionais com cálculos automáticos
 */

export type ScaleType = 
  | "doss" 
  | "btss" 
  | "bdae" 
  | "cm" 
  | "sara" 
  | "qcs";

export interface ScaleResponse {
  id: string;
  patientId: string;
  patientName: string;
  scaleType: ScaleType;
  scaleName: string;
  date: string;
  answers: Record<string, number | string>;
  totalScore: number;
  interpretation: string;
  notes?: string;
}

// ============================================
// 1. ESCALA DO COMER (Dysphagia Outcome and Severity Scale - DOSS)
// ============================================
export const DOSS_SCALE = {
  type: "doss" as ScaleType,
  name: "Escala do Comer (DOSS)",
  description: "Avalia a gravidade da disfagia e o resultado funcional",
  totalItems: 7,
  items: [
    {
      id: "doss_1",
      question: "Consistência da dieta",
      options: [
        { value: 7, label: "Normal" },
        { value: 6, label: "Modificada minoramente" },
        { value: 5, label: "Modificada moderadamente" },
        { value: 4, label: "Modificada significativamente" },
        { value: 3, label: "Purê" },
        { value: 2, label: "Líquido espesso" },
        { value: 1, label: "Líquido fino" },
      ],
    },
    {
      id: "doss_2",
      question: "Segurança da deglutição",
      options: [
        { value: 7, label: "Segura" },
        { value: 6, label: "Segura com estratégias" },
        { value: 5, label: "Mínimo risco de aspiração" },
        { value: 4, label: "Risco moderado de aspiração" },
        { value: 3, label: "Risco alto de aspiração" },
        { value: 2, label: "Aspiração penetrante" },
        { value: 1, label: "Aspiração silenciosa" },
      ],
    },
    {
      id: "doss_3",
      question: "Independência funcional",
      options: [
        { value: 7, label: "Independente" },
        { value: 6, label: "Independente com modificações" },
        { value: 5, label: "Supervisionado" },
        { value: 4, label: "Mínima assistência" },
        { value: 3, label: "Assistência moderada" },
        { value: 2, label: "Máxima assistência" },
        { value: 1, label: "Dependente total" },
      ],
    },
    {
      id: "doss_4",
      question: "Necessidade de sonda nasogástrica",
      options: [
        { value: 7, label: "Não" },
        { value: 1, label: "Sim" },
      ],
    },
    {
      id: "doss_5",
      question: "Necessidade de nutrição parenteral",
      options: [
        { value: 7, label: "Não" },
        { value: 1, label: "Sim" },
      ],
    },
    {
      id: "doss_6",
      question: "Capacidade de tomar medicamentos por via oral",
      options: [
        { value: 7, label: "Sim, todos" },
        { value: 5, label: "Sim, alguns" },
        { value: 1, label: "Não" },
      ],
    },
    {
      id: "doss_7",
      question: "Qualidade de vida relacionada à alimentação",
      options: [
        { value: 7, label: "Excelente" },
        { value: 5, label: "Boa" },
        { value: 3, label: "Razoável" },
        { value: 1, label: "Pobre" },
      ],
    },
  ],
  calculateScore: (answers: Record<string, number | string>) => {
    const values = Object.values(answers).filter(v => typeof v === 'number') as number[];
    const total = values.reduce((a, b) => a + b, 0);
    const average = total / values.length;
    
    let interpretation = "";
    if (average >= 6) interpretation = "Função normal ou mínimas dificuldades";
    else if (average >= 5) interpretation = "Disfagia leve";
    else if (average >= 4) interpretation = "Disfagia moderada";
    else if (average >= 3) interpretation = "Disfagia moderada a severa";
    else interpretation = "Disfagia severa";
    
    return { score: Math.round(average * 10) / 10, interpretation };
  },
};

// ============================================
// 2. ESCALA BREVE DE ZUMBIDO (Brief Tinnitus Severity Scale - BTSS)
// ============================================
export const BTSS_SCALE = {
  type: "btss" as ScaleType,
  name: "Escala Breve de Zumbido (BTSS)",
  description: "Avalia a gravidade do zumbido em 3 dimensões",
  totalItems: 3,
  items: [
    {
      id: "btss_1",
      question: "Qual é a intensidade do seu zumbido? (0-10)",
      options: Array.from({ length: 11 }, (_, i) => ({
        value: i,
        label: i === 0 ? "Nenhum" : i === 10 ? "Insuportável" : String(i),
      })),
    },
    {
      id: "btss_2",
      question: "Quanto o zumbido afeta sua vida diária? (0-10)",
      options: Array.from({ length: 11 }, (_, i) => ({
        value: i,
        label: i === 0 ? "Nenhum impacto" : i === 10 ? "Impacto severo" : String(i),
      })),
    },
    {
      id: "btss_3",
      question: "Qual é o seu nível de incômodo com o zumbido? (0-10)",
      options: Array.from({ length: 11 }, (_, i) => ({
        value: i,
        label: i === 0 ? "Nenhum incômodo" : i === 10 ? "Incômodo máximo" : String(i),
      })),
    },
  ],
  calculateScore: (answers: Record<string, number | string>) => {
    const values = Object.values(answers).filter(v => typeof v === 'number') as number[];
    const total = values.reduce((a, b) => a + b, 0);
    
    let interpretation = "";
    if (total <= 6) interpretation = "Zumbido leve";
    else if (total <= 12) interpretation = "Zumbido moderado";
    else if (total <= 18) interpretation = "Zumbido moderado a severo";
    else interpretation = "Zumbido severo";
    
    return { score: total, interpretation };
  },
};

// ============================================
// 3. ESCALA DE BOSTON (Boston Diagnostic Aphasia Examination - BDAE)
// ============================================
export const BDAE_SCALE = {
  type: "bdae" as ScaleType,
  name: "Escala de Boston (BDAE)",
  description: "Avalia afasia em múltiplos domínios linguísticos",
  totalItems: 6,
  items: [
    {
      id: "bdae_1",
      question: "Fluência da fala",
      options: [
        { value: 4, label: "Normal" },
        { value: 3, label: "Levemente reduzida" },
        { value: 2, label: "Moderadamente reduzida" },
        { value: 1, label: "Severamente reduzida" },
        { value: 0, label: "Sem fala" },
      ],
    },
    {
      id: "bdae_2",
      question: "Compreensão auditiva",
      options: [
        { value: 4, label: "Normal" },
        { value: 3, label: "Levemente prejudicada" },
        { value: 2, label: "Moderadamente prejudicada" },
        { value: 1, label: "Severamente prejudicada" },
        { value: 0, label: "Sem compreensão" },
      ],
    },
    {
      id: "bdae_3",
      question: "Repetição",
      options: [
        { value: 4, label: "Normal" },
        { value: 3, label: "Levemente prejudicada" },
        { value: 2, label: "Moderadamente prejudicada" },
        { value: 1, label: "Severamente prejudicada" },
        { value: 0, label: "Impossível" },
      ],
    },
    {
      id: "bdae_4",
      question: "Nomeação",
      options: [
        { value: 4, label: "Normal" },
        { value: 3, label: "Levemente prejudicada" },
        { value: 2, label: "Moderadamente prejudicada" },
        { value: 1, label: "Severamente prejudicada" },
        { value: 0, label: "Impossível" },
      ],
    },
    {
      id: "bdae_5",
      question: "Leitura",
      options: [
        { value: 4, label: "Normal" },
        { value: 3, label: "Levemente prejudicada" },
        { value: 2, label: "Moderadamente prejudicada" },
        { value: 1, label: "Severamente prejudicada" },
        { value: 0, label: "Impossível" },
      ],
    },
    {
      id: "bdae_6",
      question: "Escrita",
      options: [
        { value: 4, label: "Normal" },
        { value: 3, label: "Levemente prejudicada" },
        { value: 2, label: "Moderadamente prejudicada" },
        { value: 1, label: "Severamente prejudicada" },
        { value: 0, label: "Impossível" },
      ],
    },
  ],
  calculateScore: (answers: Record<string, number | string>) => {
    const values = Object.values(answers).filter(v => typeof v === 'number') as number[];
    const total = values.reduce((a, b) => a + b, 0);
    
    let interpretation = "";
    if (total >= 20) interpretation = "Sem afasia ou afasia mínima";
    else if (total >= 15) interpretation = "Afasia leve";
    else if (total >= 10) interpretation = "Afasia moderada";
    else if (total >= 5) interpretation = "Afasia moderada a severa";
    else interpretation = "Afasia severa";
    
    return { score: total, interpretation };
  },
};

// ============================================
// 4. COMMUNICATION MATRIX
// ============================================
export const CM_SCALE = {
  type: "cm" as ScaleType,
  name: "Communication Matrix",
  description: "Avalia habilidades de comunicação funcional",
  totalItems: 5,
  items: [
    {
      id: "cm_1",
      question: "Compreensão de palavras isoladas",
      options: [
        { value: 4, label: "Compreende consistentemente" },
        { value: 3, label: "Compreende frequentemente" },
        { value: 2, label: "Compreende ocasionalmente" },
        { value: 1, label: "Compreende raramente" },
        { value: 0, label: "Não compreende" },
      ],
    },
    {
      id: "cm_2",
      question: "Expressão de necessidades",
      options: [
        { value: 4, label: "Expressa claramente" },
        { value: 3, label: "Expressa com clareza moderada" },
        { value: 2, label: "Expressa com dificuldade" },
        { value: 1, label: "Expressa minimamente" },
        { value: 0, label: "Não expressa" },
      ],
    },
    {
      id: "cm_3",
      question: "Participação em conversação",
      options: [
        { value: 4, label: "Participa ativamente" },
        { value: 3, label: "Participa com apoio" },
        { value: 2, label: "Participa minimamente" },
        { value: 1, label: "Participa raramente" },
        { value: 0, label: "Não participa" },
      ],
    },
    {
      id: "cm_4",
      question: "Uso de gestos e sinais",
      options: [
        { value: 4, label: "Usa consistentemente" },
        { value: 3, label: "Usa frequentemente" },
        { value: 2, label: "Usa ocasionalmente" },
        { value: 1, label: "Usa raramente" },
        { value: 0, label: "Não usa" },
      ],
    },
    {
      id: "cm_5",
      question: "Inteligibilidade da fala",
      options: [
        { value: 4, label: "Totalmente inteligível" },
        { value: 3, label: "Geralmente inteligível" },
        { value: 2, label: "Parcialmente inteligível" },
        { value: 1, label: "Minimamente inteligível" },
        { value: 0, label: "Não inteligível" },
      ],
    },
  ],
  calculateScore: (answers: Record<string, number | string>) => {
    const values = Object.values(answers).filter(v => typeof v === 'number') as number[];
    const total = values.reduce((a, b) => a + b, 0);
    const percentage = (total / (values.length * 4)) * 100;
    
    let interpretation = "";
    if (percentage >= 80) interpretation = "Comunicação funcional excelente";
    else if (percentage >= 60) interpretation = "Comunicação funcional boa";
    else if (percentage >= 40) interpretation = "Comunicação funcional moderada";
    else if (percentage >= 20) interpretation = "Comunicação funcional limitada";
    else interpretation = "Comunicação funcional mínima";
    
    return { score: Math.round(percentage), interpretation };
  },
};

// ============================================
// 5. ESCALA SARA (Scale for Assessment and Rating of Ataxia)
// ============================================
export const SARA_SCALE = {
  type: "sara" as ScaleType,
  name: "Escala SARA",
  description: "Avalia ataxia cerebelar em múltiplos domínios",
  totalItems: 8,
  items: [
    {
      id: "sara_1",
      question: "Marcha",
      options: [
        { value: 0, label: "Normal" },
        { value: 1, label: "Levemente anormal" },
        { value: 2, label: "Moderadamente anormal" },
        { value: 3, label: "Severamente anormal" },
        { value: 4, label: "Impossível" },
      ],
    },
    {
      id: "sara_2",
      question: "Postura",
      options: [
        { value: 0, label: "Normal" },
        { value: 1, label: "Levemente anormal" },
        { value: 2, label: "Moderadamente anormal" },
        { value: 3, label: "Severamente anormal" },
        { value: 4, label: "Impossível" },
      ],
    },
    {
      id: "sara_3",
      question: "Fala",
      options: [
        { value: 0, label: "Normal" },
        { value: 1, label: "Levemente anormal" },
        { value: 2, label: "Moderadamente anormal" },
        { value: 3, label: "Severamente anormal" },
        { value: 4, label: "Impossível" },
      ],
    },
    {
      id: "sara_4",
      question: "Nistagmo",
      options: [
        { value: 0, label: "Ausente" },
        { value: 1, label: "Presente" },
      ],
    },
    {
      id: "sara_5",
      question: "Teste dedo-nariz",
      options: [
        { value: 0, label: "Normal" },
        { value: 1, label: "Levemente anormal" },
        { value: 2, label: "Moderadamente anormal" },
        { value: 3, label: "Severamente anormal" },
        { value: 4, label: "Impossível" },
      ],
    },
    {
      id: "sara_6",
      question: "Teste calcanhar-tíbia",
      options: [
        { value: 0, label: "Normal" },
        { value: 1, label: "Levemente anormal" },
        { value: 2, label: "Moderadamente anormal" },
        { value: 3, label: "Severamente anormal" },
        { value: 4, label: "Impossível" },
      ],
    },
    {
      id: "sara_7",
      question: "Tremor cinético",
      options: [
        { value: 0, label: "Ausente" },
        { value: 1, label: "Leve" },
        { value: 2, label: "Moderado" },
        { value: 3, label: "Severo" },
      ],
    },
    {
      id: "sara_8",
      question: "Dismetria",
      options: [
        { value: 0, label: "Ausente" },
        { value: 1, label: "Presente" },
      ],
    },
  ],
  calculateScore: (answers: Record<string, number | string>) => {
    const values = Object.values(answers).filter(v => typeof v === 'number') as number[];
    const total = values.reduce((a, b) => a + b, 0);
    
    let interpretation = "";
    if (total === 0) interpretation = "Sem ataxia";
    else if (total <= 10) interpretation = "Ataxia leve";
    else if (total <= 20) interpretation = "Ataxia moderada";
    else if (total <= 30) interpretation = "Ataxia moderada a severa";
    else interpretation = "Ataxia severa";
    
    return { score: total, interpretation };
  },
};

// ============================================
// 6. QUESTIONÁRIO DE COMUNICAÇÃO SOCIAL (QCS)
// ============================================
export const QCS_SCALE = {
  type: "qcs" as ScaleType,
  name: "Questionário de Comunicação Social (QCS)",
  description: "Avalia habilidades de comunicação social e pragmática",
  totalItems: 6,
  items: [
    {
      id: "qcs_1",
      question: "Iniciação de conversação",
      options: [
        { value: 5, label: "Sempre inicia" },
        { value: 4, label: "Frequentemente inicia" },
        { value: 3, label: "Ocasionalmente inicia" },
        { value: 2, label: "Raramente inicia" },
        { value: 1, label: "Nunca inicia" },
      ],
    },
    {
      id: "qcs_2",
      question: "Manutenção de tópico de conversa",
      options: [
        { value: 5, label: "Sempre mantém" },
        { value: 4, label: "Frequentemente mantém" },
        { value: 3, label: "Ocasionalmente mantém" },
        { value: 2, label: "Raramente mantém" },
        { value: 1, label: "Nunca mantém" },
      ],
    },
    {
      id: "qcs_3",
      question: "Respeito a turnos de fala",
      options: [
        { value: 5, label: "Sempre respeita" },
        { value: 4, label: "Frequentemente respeita" },
        { value: 3, label: "Ocasionalmente respeita" },
        { value: 2, label: "Raramente respeita" },
        { value: 1, label: "Nunca respeita" },
      ],
    },
    {
      id: "qcs_4",
      question: "Uso de contato visual apropriado",
      options: [
        { value: 5, label: "Sempre apropriado" },
        { value: 4, label: "Frequentemente apropriado" },
        { value: 3, label: "Ocasionalmente apropriado" },
        { value: 2, label: "Raramente apropriado" },
        { value: 1, label: "Nunca apropriado" },
      ],
    },
    {
      id: "qcs_5",
      question: "Compreensão de contexto social",
      options: [
        { value: 5, label: "Sempre compreende" },
        { value: 4, label: "Frequentemente compreende" },
        { value: 3, label: "Ocasionalmente compreende" },
        { value: 2, label: "Raramente compreende" },
        { value: 1, label: "Nunca compreende" },
      ],
    },
    {
      id: "qcs_6",
      question: "Adaptação à audiência",
      options: [
        { value: 5, label: "Sempre se adapta" },
        { value: 4, label: "Frequentemente se adapta" },
        { value: 3, label: "Ocasionalmente se adapta" },
        { value: 2, label: "Raramente se adapta" },
        { value: 1, label: "Nunca se adapta" },
      ],
    },
  ],
  calculateScore: (answers: Record<string, number | string>) => {
    const values = Object.values(answers).filter(v => typeof v === 'number') as number[];
    const total = values.reduce((a, b) => a + b, 0);
    const percentage = (total / (values.length * 5)) * 100;
    
    let interpretation = "";
    if (percentage >= 80) interpretation = "Comunicação social excelente";
    else if (percentage >= 60) interpretation = "Comunicação social boa";
    else if (percentage >= 40) interpretation = "Comunicação social moderada";
    else if (percentage >= 20) interpretation = "Comunicação social prejudicada";
    else interpretation = "Comunicação social severamente prejudicada";
    
    return { score: Math.round(percentage), interpretation };
  },
};

// Array com todas as escalas
export const ALL_SCALES = [DOSS_SCALE, BTSS_SCALE, BDAE_SCALE, CM_SCALE, SARA_SCALE, QCS_SCALE];

// Função para obter uma escala específica
export function getScale(type: ScaleType) {
  return ALL_SCALES.find(scale => scale.type === type);
}

// Função para calcular score de uma escala
export function calculateScaleScore(scaleType: ScaleType, answers: Record<string, number | string>) {
  const scale = getScale(scaleType);
  if (!scale) return { score: 0, interpretation: "Escala não encontrada" };
  return scale.calculateScore(answers);
}
