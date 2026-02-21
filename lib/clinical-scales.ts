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
  | "qcs"
  | "pdq39"
  | "fois"
  | "dsfs"
  | "grbasi"
  | "eat10"
  | "stopbang"
  | "hb"
  | "phq9"
  | "phq44"
  | "mdq"
  | "snapiv"
  | "amisos"
  | "mdsupdrs"
  | "oddrs"
  | "conners"
  | "vanderbilt"
  | "saliva";

// Escala de SALIVA de Parkinson - Avaliação de Salivação
export interface FacialParalysisAnalysis {
  grade: number;
  symmetry: string;
  eyeFunction: string;
  mouthFunction: string;
  recommendations: string[];
}

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

// ============================================
// 7. PDQ-39 (Parkinson's Disease Questionnaire)
// ============================================
export const PDQ39_SCALE = {
  type: "pdq39" as ScaleType,
  name: "PDQ-39 (Questionário de Doença de Parkinson)",
  description: "Avalia qualidade de vida em pacientes com Parkinson",
  totalItems: 39,
  items: [
    { id: "pdq39_1", question: "Teve dificuldade para fazer atividades diárias?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_2", question: "Teve dificuldade para se concentrar?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_3", question: "Teve depressão?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_4", question: "Teve ansiedade?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_5", question: "Teve problemas de memória?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_6", question: "Teve dificuldade para dormir?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_7", question: "Teve problemas de equilíbrio?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_8", question: "Teve tremor?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_9", question: "Teve rigidez muscular?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_10", question: "Teve lentidão de movimento?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_11", question: "Teve problemas de fala?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_12", question: "Teve problemas de escrita?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_13", question: "Teve dificuldade para se vestir?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_14", question: "Teve dificuldade para comer?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_15", question: "Teve dificuldade para tomar banho?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_16", question: "Teve dificuldade para ir ao banheiro?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_17", question: "Teve dificuldade para se locomover dentro de casa?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_18", question: "Teve dificuldade para sair de casa?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_19", question: "Teve dificuldade para usar transporte público?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_20", question: "Teve dificuldade para fazer compras?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_21", question: "Teve dificuldade para cozinhar?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_22", question: "Teve dificuldade para limpar a casa?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_23", question: "Teve dificuldade para cuidar das finanças?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_24", question: "Teve dificuldade para usar o telefone?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_25", question: "Teve dificuldade para usar o computador?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_26", question: "Teve dificuldade para se comunicar com outras pessoas?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_27", question: "Teve dificuldade para participar de atividades sociais?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_28", question: "Teve dificuldade para manter relacionamentos?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_29", question: "Teve dificuldade para expressar emoções?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_30", question: "Teve dificuldade para sentir prazer?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_31", question: "Teve dificuldade para se sentir esperançoso?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_32", question: "Teve dificuldade para se sentir motivado?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_33", question: "Teve dificuldade para se sentir com energia?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_34", question: "Teve dificuldade para se sentir calmo?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_35", question: "Teve dificuldade para se sentir feliz?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_36", question: "Teve dificuldade para se sentir confiante?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_37", question: "Teve dificuldade para se sentir seguro?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_38", question: "Teve dificuldade para se sentir independente?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
    { id: "pdq39_39", question: "Teve dificuldade para se sentir com controle sobre sua vida?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Ocasionalmente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Sempre" }] },
  ],
  calculateScore: (answers: Record<string, number | string>) => {
    const values = Object.values(answers).filter(v => typeof v === 'number') as number[];
    const total = values.reduce((a, b) => a + b, 0);
    const percentage = (total / (values.length * 3)) * 100;
    let interpretation = "";
    if (percentage <= 25) interpretation = "Qualidade de vida excelente";
    else if (percentage <= 50) interpretation = "Qualidade de vida boa";
    else if (percentage <= 75) interpretation = "Qualidade de vida moderada";
    else interpretation = "Qualidade de vida prejudicada";
    return { score: Math.round(percentage), interpretation };
  },
};

// ============================================
// 8. FOIS (Functional Oral Intake Scale)
// ============================================
export const FOIS_SCALE = {
  type: "fois" as ScaleType,
  name: "FOIS (Escala Funcional de Ingestão Oral)",
  description: "Avalia o nível funcional de ingestão oral",
  totalItems: 7,
  items: [
    { id: "fois_1", question: "Nível de ingestão oral", options: [{ value: 1, label: "Nenhuma ingestão oral" }, { value: 2, label: "Nutrição por sonda, mínima ingestão oral" }, { value: 3, label: "Nutrição por sonda, ingestão oral de alguns alimentos" }, { value: 4, label: "Nutrição por sonda, ingestão oral de refeições" }, { value: 5, label: "Ingestão oral total, requer modificação" }, { value: 6, label: "Ingestão oral total, sem restrições" }, { value: 7, label: "Ingestão oral total, sem restrições" }] },
  ],
  calculateScore: (answers: Record<string, number | string>) => {
    const values = Object.values(answers).filter(v => typeof v === 'number') as number[];
    const score = values[0] || 0;
    let interpretation = "";
    if (score <= 2) interpretation = "Ingestão oral mínima ou nenhuma";
    else if (score <= 4) interpretation = "Ingestão oral com suplementação";
    else if (score <= 6) interpretation = "Ingestão oral total com modificações";
    else interpretation = "Ingestão oral total sem restrições";
    return { score, interpretation };
  },
};

// ============================================
// 9. DSFS (Drooling Severity and Frequency Scale)
// ============================================
export const DSFS_SCALE = {
  type: "dsfs" as ScaleType,
  name: "DSFS (Escala de Severidade e Frequência de Salivação)",
  description: "Avalia severidade e frequência de salivação excessiva",
  totalItems: 2,
  items: [
    { id: "dsfs_1", question: "Frequência de salivação", options: [{ value: 1, label: "Nunca" }, { value: 2, label: "Raramente" }, { value: 3, label: "Ocasionalmente" }, { value: 4, label: "Frequentemente" }, { value: 5, label: "Constantemente" }] },
    { id: "dsfs_2", question: "Severidade da salivação", options: [{ value: 1, label: "Seco" }, { value: 2, label: "Levemente úmido" }, { value: 3, label: "Moderadamente úmido" }, { value: 4, label: "Muito úmido" }, { value: 5, label: "Babando constantemente" }] },
  ],
  calculateScore: (answers: Record<string, number | string>) => {
    const values = Object.values(answers).filter(v => typeof v === 'number') as number[];
    const total = values.reduce((a, b) => a + b, 0);
    let interpretation = "";
    if (total <= 3) interpretation = "Salivação normal";
    else if (total <= 5) interpretation = "Salivação leve";
    else if (total <= 7) interpretation = "Salivação moderada";
    else interpretation = "Salivação severa";
    return { score: total, interpretation };
  },
};

// ============================================
// 10. GRBASI (Escala GRBASI)
// ============================================
export const GRBASI_SCALE = {
  type: "grbasi" as ScaleType,
  name: "Escala GRBASI (Avaliação de Voz)",
  description: "Avalia qualidade de voz através de 6 parâmetros",
  totalItems: 6,
  items: [
    { id: "grbasi_1", question: "Grau de rouquidão", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderado" }, { value: 3, label: "Severo" }] },
    { id: "grbasi_2", question: "Aspereza", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderado" }, { value: 3, label: "Severo" }] },
    { id: "grbasi_3", question: "Respiração", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderado" }, { value: 3, label: "Severo" }] },
    { id: "grbasi_4", question: "Astenia", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderado" }, { value: 3, label: "Severo" }] },
    { id: "grbasi_5", question: "Tensão", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderado" }, { value: 3, label: "Severo" }] },
    { id: "grbasi_6", question: "Instabilidade", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderado" }, { value: 3, label: "Severo" }] },
  ],
  calculateScore: (answers: Record<string, number | string>) => {
    const values = Object.values(answers).filter(v => typeof v === 'number') as number[];
    const total = values.reduce((a, b) => a + b, 0);
    const percentage = (total / (values.length * 3)) * 100;
    let interpretation = "";
    if (percentage <= 25) interpretation = "Voz normal";
    else if (percentage <= 50) interpretation = "Alteração leve de voz";
    else if (percentage <= 75) interpretation = "Alteração moderada de voz";
    else interpretation = "Alteração severa de voz";
    return { score: Math.round(percentage), interpretation };
  },
};

// ============================================
// 11. EAT-10 (Eating Assessment Tool-10)
// ============================================
export const EAT10_SCALE = {
  type: "eat10" as ScaleType,
  name: "EAT-10 (Ferramenta de Avaliação de Deglutição-10)",
  description: "Avalia sintomas de dificuldade de deglutição",
  totalItems: 10,
  items: [
    { id: "eat10_1", question: "Meu problema de deglutição me impede de comer completamente?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }, { value: 2, label: "Muito" }, { value: 3, label: "Extremamente" }, { value: 4, label: "Impossível" }] },
    { id: "eat10_2", question: "Meu problema de deglutição me impede de beber completamente?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }, { value: 2, label: "Muito" }, { value: 3, label: "Extremamente" }, { value: 4, label: "Impossível" }] },
    { id: "eat10_3", question: "Tenho que tomar medicamentos para ajudar a engolir?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }, { value: 2, label: "Muito" }, { value: 3, label: "Extremamente" }, { value: 4, label: "Impossível" }] },
    { id: "eat10_4", question: "Tenho dificuldade em engolir alimentos sólidos?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }, { value: 2, label: "Muito" }, { value: 3, label: "Extremamente" }, { value: 4, label: "Impossível" }] },
    { id: "eat10_5", question: "Tenho dificuldade em engolir líquidos?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }, { value: 2, label: "Muito" }, { value: 3, label: "Extremamente" }, { value: 4, label: "Impossível" }] },
    { id: "eat10_6", question: "Tenho dificuldade em engolir saliva?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }, { value: 2, label: "Muito" }, { value: 3, label: "Extremamente" }, { value: 4, label: "Impossível" }] },
    { id: "eat10_7", question: "Preciso de mais tempo para comer?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }, { value: 2, label: "Muito" }, { value: 3, label: "Extremamente" }, { value: 4, label: "Impossível" }] },
    { id: "eat10_8", question: "Tenho medo de engasgar ao comer?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }, { value: 2, label: "Muito" }, { value: 3, label: "Extremamente" }, { value: 4, label: "Impossível" }] },
    { id: "eat10_9", question: "Meu problema de deglutição afeta minha nutrição?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }, { value: 2, label: "Muito" }, { value: 3, label: "Extremamente" }, { value: 4, label: "Impossível" }] },
    { id: "eat10_10", question: "Meu problema de deglutição afeta minha qualidade de vida?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }, { value: 2, label: "Muito" }, { value: 3, label: "Extremamente" }, { value: 4, label: "Impossível" }] },
  ],
  calculateScore: (answers: Record<string, number | string>) => {
    const values = Object.values(answers).filter(v => typeof v === 'number') as number[];
    const total = values.reduce((a, b) => a + b, 0);
    let interpretation = "";
    if (total <= 10) interpretation = "Sem risco de disfagia";
    else if (total <= 20) interpretation = "Risco leve de disfagia";
    else if (total <= 30) interpretation = "Risco moderado de disfagia";
    else interpretation = "Risco severo de disfagia";
    return { score: total, interpretation };
  },
};

// ============================================
// 12. STOP-Bang (Escala STOP-Bang)
// ============================================
export const STOPBANG_SCALE = {
  type: "stopbang" as ScaleType,
  name: "STOP-Bang (Escala de Apneia do Sono)",
  description: "Avalia risco de apneia obstrutiva do sono",
  totalItems: 8,
  items: [
    { id: "stopbang_1", question: "Ronca alto (mais alto que conversa)?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }] },
    { id: "stopbang_2", question: "Sente cansaço ou sonolência durante o dia?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }] },
    { id: "stopbang_3", question: "Já lhe disseram que para de respirar enquanto dorme?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }] },
    { id: "stopbang_4", question: "Tem pressão alta?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }] },
    { id: "stopbang_5", question: "IMC > 35?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }] },
    { id: "stopbang_6", question: "Idade > 50 anos?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }] },
    { id: "stopbang_7", question: "Circunferência do pescoço > 40 cm?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }] },
    { id: "stopbang_8", question: "Sexo masculino?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }] },
  ],
  calculateScore: (answers: Record<string, number | string>) => {
    const values = Object.values(answers).filter(v => typeof v === 'number') as number[];
    const total = values.reduce((a, b) => a + b, 0);
    let interpretation = "";
    if (total <= 2) interpretation = "Baixo risco de apneia";
    else if (total <= 4) interpretation = "Risco intermediário de apneia";
    else interpretation = "Alto risco de apneia";
    return { score: total, interpretation };
  },
};

// ============================================
// 13. House-Brackmann (H-B) - Escala de Paralisia Facial
// ============================================
export const HB_SCALE = {
  type: "hb" as ScaleType,
  name: "Escala de House-Brackmann (Paralisia Facial)",
  description: "Avalia grau de paralisia facial com criterios clinicos detalhados",
  totalItems: 1,
  items: [
    { 
      id: "hb_1", 
      question: "Grau de paralisia facial", 
      options: [
        { value: 1, label: "I - Normal", description: "Funcao facial normal em todas as areas" },
        { value: 2, label: "II - Disfuncao Leve", description: "Geral: leve fraqueza notavel apenas a inspeccao. Palpebra: sem repouso, simetria e tonus normais. Ao movimento: sem movimento. Teste: funcao boa a moderada. Olho: fechamento completo com minimo esforco. Boca: leve assimetria" },
        { value: 3, label: "III - Disfuncao Moderada", description: "Geral: diferenca obvia mas nao desfigurante entre os dois lados. Palpebra: notaveis mas nao severos. Ao movimento: sem movimento. Teste: movimento moderado a leve. Olho: fechamento completo com esforco. Boca: levemente flacida com o maximo esforco" },
        { value: 4, label: "IV - Disfuncao Moderadamente Severa", description: "Geral: fraqueza obvia e/ou assimetria desfigurante. Ao movimento: sem repouso e tonus normais. Teste: nenhum movimento. Olho: fechamento incompleto. Boca: assimetria com o maximo esforco" },
        { value: 5, label: "V - Disfuncao Severa", description: "Geral: apenas uma movimentacao discretamente perceptivel. Ao movimento: sem repouso: assimetria. Teste: nenhum movimento. Olho: fechamento incompleto. Boca: movimento discreto" },
        { value: 6, label: "VI - Paralisia Total", description: "Nenhum movimento" }
      ]
    },
  ],
  calculateScore: (answers: Record<string, number | string>) => {
    const values = Object.values(answers).filter(v => typeof v === 'number') as number[];
    const score = values[0] || 0;
    const labels = ["Normal", "Disfuncao Leve", "Disfuncao Moderada", "Disfuncao Moderadamente Severa", "Disfuncao Severa", "Paralisia Total"];
    return { score, interpretation: labels[score - 1] || "Desconhecido" };
  },
};

// ============================================
// 14. PHQ-9 (Patient Health Questionnaire-9)
// ============================================
export const PHQ9_SCALE = {
  type: "phq9" as ScaleType,
  name: "PHQ-9 (Questionário de Saúde do Paciente-9)",
  description: "Avalia sintomas de depressão",
  totalItems: 9,
  items: [
    { id: "phq9_1", question: "Pouco interesse ou prazer em fazer coisas?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Vários dias" }, { value: 2, label: "Mais da metade dos dias" }, { value: 3, label: "Quase todos os dias" }] },
    { id: "phq9_2", question: "Se sentir deprimido, depressivo ou sem esperança?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Vários dias" }, { value: 2, label: "Mais da metade dos dias" }, { value: 3, label: "Quase todos os dias" }] },
    { id: "phq9_3", question: "Dificuldade em adormecer, manter o sono ou dormir demais?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Vários dias" }, { value: 2, label: "Mais da metade dos dias" }, { value: 3, label: "Quase todos os dias" }] },
    { id: "phq9_4", question: "Cansaço ou falta de energia?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Vários dias" }, { value: 2, label: "Mais da metade dos dias" }, { value: 3, label: "Quase todos os dias" }] },
    { id: "phq9_5", question: "Falta de apetite ou comer demais?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Vários dias" }, { value: 2, label: "Mais da metade dos dias" }, { value: 3, label: "Quase todos os dias" }] },
    { id: "phq9_6", question: "Sentir-se mal consigo mesmo ou fracasso?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Vários dias" }, { value: 2, label: "Mais da metade dos dias" }, { value: 3, label: "Quase todos os dias" }] },
    { id: "phq9_7", question: "Dificuldade em se concentrar?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Vários dias" }, { value: 2, label: "Mais da metade dos dias" }, { value: 3, label: "Quase todos os dias" }] },
    { id: "phq9_8", question: "Falar ou agir tão lentamente que outros notam ou o oposto?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Vários dias" }, { value: 2, label: "Mais da metade dos dias" }, { value: 3, label: "Quase todos os dias" }] },
    { id: "phq9_9", question: "Pensamentos de que seria melhor estar morto ou se machucar?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Vários dias" }, { value: 2, label: "Mais da metade dos dias" }, { value: 3, label: "Quase todos os dias" }] },
  ],
  calculateScore: (answers: Record<string, number | string>) => {
    const values = Object.values(answers).filter(v => typeof v === 'number') as number[];
    const total = values.reduce((a, b) => a + b, 0);
    let interpretation = "";
    if (total <= 4) interpretation = "Sem depressão";
    else if (total <= 9) interpretation = "Depressão leve";
    else if (total <= 14) interpretation = "Depressão moderada";
    else if (total <= 19) interpretation = "Depressão moderadamente severa";
    else interpretation = "Depressão severa";
    return { score: total, interpretation };
  },
};

// ============================================
// 15. MDQ (Mood Disorder Questionnaire)
// ============================================
export const MDQ_SCALE = {
  type: "mdq" as ScaleType,
  name: "MDQ (Questionário de Transtorno de Humor)",
  description: "Avalia risco de transtorno bipolar",
  totalItems: 13,
  items: [
    { id: "mdq_1", question: "Teve períodos de grande energia ou atividade?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }] },
    { id: "mdq_2", question: "Nestes períodos, dormia menos do que o normal?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }] },
    { id: "mdq_3", question: "Falava mais ou mais rápido do que o normal?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }] },
    { id: "mdq_4", question: "Seus pensamentos corriam?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }] },
    { id: "mdq_5", question: "Tinha dificuldade em se concentrar?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }] },
    { id: "mdq_6", question: "Tinha mais confiança do que o normal?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }] },
    { id: "mdq_7", question: "Gastava dinheiro de forma irresponsável?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }] },
    { id: "mdq_8", question: "Teve comportamento sexual incomum?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }] },
    { id: "mdq_9", question: "Estava mais irritável do que o normal?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }] },
    { id: "mdq_10", question: "Fez coisas que tiveram consequências negativas?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }] },
    { id: "mdq_11", question: "Estes períodos duraram vários dias?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }] },
    { id: "mdq_12", question: "Causaram problemas em casa, trabalho ou socialmente?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }] },
    { id: "mdq_13", question: "Teve mais de um período assim?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }] },
  ],
  calculateScore: (answers: Record<string, number | string>) => {
    const values = Object.values(answers).filter(v => typeof v === 'number') as number[];
    const total = values.reduce((a, b) => a + b, 0);
    let interpretation = "";
    if (total <= 5) interpretation = "Baixo risco de transtorno bipolar";
    else if (total <= 8) interpretation = "Risco moderado de transtorno bipolar";
    else interpretation = "Alto risco de transtorno bipolar";
    return { score: total, interpretation };
  },
};

// ============================================
// 16. SNAP-IV (Escala SNAP-IV)
// ============================================
export const SNAPIV_SCALE = {
  type: "snapiv" as ScaleType,
  name: "SNAP-IV (Escala de Avaliação de TDAH)",
  description: "Avalia sintomas de Transtorno de Déficit de Atenção e Hiperatividade",
  totalItems: 18,
  items: [
    { id: "snapiv_1", question: "Não consegue prestar atenção aos detalhes?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Às vezes" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "snapiv_2", question: "Tem dificuldade em manter a atenção?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Às vezes" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "snapiv_3", question: "Parece não ouvir quando falam com ele?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Às vezes" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "snapiv_4", question: "Tem dificuldade em seguir instruções?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Às vezes" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "snapiv_5", question: "Tem dificuldade em organizar tarefas?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Às vezes" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "snapiv_6", question: "Evita tarefas que requerem esforço mental?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Às vezes" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "snapiv_7", question: "Perde coisas necessárias?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Às vezes" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "snapiv_8", question: "Se distrai facilmente?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Às vezes" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "snapiv_9", question: "É esquecido nas atividades diárias?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Às vezes" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "snapiv_10", question: "Mexe com as mãos ou pés?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Às vezes" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "snapiv_11", question: "Se mexe na cadeira?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Às vezes" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "snapiv_12", question: "Sai do lugar quando deveria ficar sentado?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Às vezes" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "snapiv_13", question: "Tem dificuldade em brincar tranquilamente?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Às vezes" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "snapiv_14", question: "Fala demais?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Às vezes" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "snapiv_15", question: "Tem dificuldade em esperar sua vez?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Às vezes" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "snapiv_16", question: "Interrompe ou invade os outros?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Às vezes" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "snapiv_17", question: "Tem dificuldade em controlar o temperamento?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Às vezes" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "snapiv_18", question: "Tem dificuldade em aceitar críticas?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Às vezes" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
  ],
  calculateScore: (answers: Record<string, number | string>) => {
    const values = Object.values(answers).filter(v => typeof v === 'number') as number[];
    const total = values.reduce((a, b) => a + b, 0);
    const percentage = (total / (values.length * 3)) * 100;
    let interpretation = "";
    if (percentage <= 25) interpretation = "Sem sintomas de TDAH";
    else if (percentage <= 50) interpretation = "Sintomas leves de TDAH";
    else if (percentage <= 75) interpretation = "Sintomas moderados de TDAH";
    else interpretation = "Sintomas severos de TDAH";
    return { score: Math.round(percentage), interpretation };
  },
};

// ============================================
// 17. A-MISO-S (Amsterdam Misophonia Scale)
// ============================================
export const AMISOS_SCALE = {
  type: "amisos" as ScaleType,
  name: "A-MISO-S (Escala de Misofonia de Amsterdã)",
  description: "Avalia sintomas de misofonia (sensibilidade a sons)",
  totalItems: 14,
  items: [
    { id: "amisos_1", question: "Sente raiva quando ouve certos sons?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Um pouco" }, { value: 2, label: "Moderadamente" }, { value: 3, label: "Bastante" }, { value: 4, label: "Extremamente" }] },
    { id: "amisos_2", question: "Sente nojo quando ouve certos sons?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Um pouco" }, { value: 2, label: "Moderadamente" }, { value: 3, label: "Bastante" }, { value: 4, label: "Extremamente" }] },
    { id: "amisos_3", question: "Sente ansiedade quando ouve certos sons?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Um pouco" }, { value: 2, label: "Moderadamente" }, { value: 3, label: "Bastante" }, { value: 4, label: "Extremamente" }] },
    { id: "amisos_4", question: "Sente vontade de evitar situações com certos sons?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Um pouco" }, { value: 2, label: "Moderadamente" }, { value: 3, label: "Bastante" }, { value: 4, label: "Extremamente" }] },
    { id: "amisos_5", question: "Estes sons afetam sua qualidade de vida?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Um pouco" }, { value: 2, label: "Moderadamente" }, { value: 3, label: "Bastante" }, { value: 4, label: "Extremamente" }] },
    { id: "amisos_6", question: "Estes sons afetam seus relacionamentos?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Um pouco" }, { value: 2, label: "Moderadamente" }, { value: 3, label: "Bastante" }, { value: 4, label: "Extremamente" }] },
    { id: "amisos_7", question: "Estes sons afetam seu trabalho ou estudos?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Um pouco" }, { value: 2, label: "Moderadamente" }, { value: 3, label: "Bastante" }, { value: 4, label: "Extremamente" }] },
    { id: "amisos_8", question: "Sente que não consegue controlar sua reação?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Um pouco" }, { value: 2, label: "Moderadamente" }, { value: 3, label: "Bastante" }, { value: 4, label: "Extremamente" }] },
    { id: "amisos_9", question: "Sente que sua reação é exagerada?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Um pouco" }, { value: 2, label: "Moderadamente" }, { value: 3, label: "Bastante" }, { value: 4, label: "Extremamente" }] },
    { id: "amisos_10", question: "Sente que os outros não entendem sua reação?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Um pouco" }, { value: 2, label: "Moderadamente" }, { value: 3, label: "Bastante" }, { value: 4, label: "Extremamente" }] },
    { id: "amisos_11", question: "Estes sons causam tensão muscular?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Um pouco" }, { value: 2, label: "Moderadamente" }, { value: 3, label: "Bastante" }, { value: 4, label: "Extremamente" }] },
    { id: "amisos_12", question: "Estes sons causam aceleração do coração?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Um pouco" }, { value: 2, label: "Moderadamente" }, { value: 3, label: "Bastante" }, { value: 4, label: "Extremamente" }] },
    { id: "amisos_13", question: "Estes sons causam tremor?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Um pouco" }, { value: 2, label: "Moderadamente" }, { value: 3, label: "Bastante" }, { value: 4, label: "Extremamente" }] },
    { id: "amisos_14", question: "Estes sons causam suor?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Um pouco" }, { value: 2, label: "Moderadamente" }, { value: 3, label: "Bastante" }, { value: 4, label: "Extremamente" }] },
  ],
  calculateScore: (answers: Record<string, number | string>) => {
    const values = Object.values(answers).filter(v => typeof v === 'number') as number[];
    const total = values.reduce((a, b) => a + b, 0);
    const percentage = (total / (values.length * 4)) * 100;
    let interpretation = "";
    if (percentage <= 25) interpretation = "Sem sintomas de misofonia";
    else if (percentage <= 50) interpretation = "Sintomas leves de misofonia";
    else if (percentage <= 75) interpretation = "Sintomas moderados de misofonia";
    else interpretation = "Sintomas severos de misofonia";
    return { score: Math.round(percentage), interpretation };
  },
};

// ============================================
// 20. CONNERS (ADHD Rating Scale - Conners)
// ============================================
export const CONNERS_SCALE = {
  type: "conners" as ScaleType,
  name: "CONNERS (Escala de Avaliacao de TDAH - Conners)",
  description: "Avalia sintomas de TDAH em criancas e adolescentes",
  totalItems: 10,
  items: [
    { id: "conners_1", question: "Tem dificuldade em prestar atencao?", options: [{ value: 0, label: "Nao" }, { value: 1, label: "Um pouco" }, { value: 2, label: "Bastante" }, { value: 3, label: "Muito" }] },
    { id: "conners_2", question: "E impulsivo?", options: [{ value: 0, label: "Nao" }, { value: 1, label: "Um pouco" }, { value: 2, label: "Bastante" }, { value: 3, label: "Muito" }] },
    { id: "conners_3", question: "Nao consegue ficar quieto?", options: [{ value: 0, label: "Nao" }, { value: 1, label: "Um pouco" }, { value: 2, label: "Bastante" }, { value: 3, label: "Muito" }] },
    { id: "conners_4", question: "Nao consegue esperar sua vez?", options: [{ value: 0, label: "Nao" }, { value: 1, label: "Um pouco" }, { value: 2, label: "Bastante" }, { value: 3, label: "Muito" }] },
    { id: "conners_5", question: "Frequentemente distrai-se facilmente?", options: [{ value: 0, label: "Nao" }, { value: 1, label: "Um pouco" }, { value: 2, label: "Bastante" }, { value: 3, label: "Muito" }] },
    { id: "conners_6", question: "Tem dificuldade em seguir instrucoes?", options: [{ value: 0, label: "Nao" }, { value: 1, label: "Um pouco" }, { value: 2, label: "Bastante" }, { value: 3, label: "Muito" }] },
    { id: "conners_7", question: "Fala excessivamente?", options: [{ value: 0, label: "Nao" }, { value: 1, label: "Um pouco" }, { value: 2, label: "Bastante" }, { value: 3, label: "Muito" }] },
    { id: "conners_8", question: "Tem dificuldade em organizar tarefas?", options: [{ value: 0, label: "Nao" }, { value: 1, label: "Um pouco" }, { value: 2, label: "Bastante" }, { value: 3, label: "Muito" }] },
    { id: "conners_9", question: "Frequentemente perde coisas necessarias?", options: [{ value: 0, label: "Nao" }, { value: 1, label: "Um pouco" }, { value: 2, label: "Bastante" }, { value: 3, label: "Muito" }] },
    { id: "conners_10", question: "Frequentemente interrompe ou invade?", options: [{ value: 0, label: "Nao" }, { value: 1, label: "Um pouco" }, { value: 2, label: "Bastante" }, { value: 3, label: "Muito" }] },
  ],
  calculateScore: (answers: Record<string, number | string>) => {
    const values = Object.values(answers).filter(v => typeof v === 'number') as number[];
    const total = values.reduce((a, b) => a + b, 0);
    let interpretation = "";
    if (total <= 10) interpretation = "Sem sintomas de TDAH";
    else if (total <= 20) interpretation = "Sintomas leves de TDAH";
    else if (total <= 30) interpretation = "Sintomas moderados de TDAH";
    else interpretation = "Sintomas severos de TDAH";
    return { score: total, interpretation };
  },
};

// ============================================
// 21. VANDERBILT (ADHD Rating Scale - Vanderbilt)
// ============================================
export const VANDERBILT_SCALE = {
  type: "vanderbilt" as ScaleType,
  name: "VANDERBILT (Escala de Avaliacao de TDAH - Vanderbilt)",
  description: "Avalia sintomas de TDAH e transtornos comorbidos",
  totalItems: 8,
  items: [
    { id: "vanderbilt_1", question: "Nao consegue prestar atencao aos detalhes?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Raramente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "vanderbilt_2", question: "Tem dificuldade em manter a atencao?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Raramente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "vanderbilt_3", question: "Nao parece ouvir quando falam diretamente?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Raramente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "vanderbilt_4", question: "Tem dificuldade em organizar tarefas?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Raramente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "vanderbilt_5", question: "E relutante em tarefas que requerem esforco mental?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Raramente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "vanderbilt_6", question: "Frequentemente perde coisas necessarias?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Raramente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "vanderbilt_7", question: "E facilmente distraido por estimulos externos?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Raramente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "vanderbilt_8", question: "E esquecido em atividades diarias?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Raramente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
  ],
  calculateScore: (answers: Record<string, number | string>) => {
    const values = Object.values(answers).filter(v => typeof v === 'number') as number[];
    const total = values.reduce((a, b) => a + b, 0);
    let interpretation = "";
    if (total <= 8) interpretation = "Sem sintomas de TDAH";
    else if (total <= 16) interpretation = "Sintomas leves de TDAH";
    else if (total <= 20) interpretation = "Sintomas moderados de TDAH";
    else interpretation = "Sintomas severos de TDAH";
    return { score: total, interpretation };
  },
};

// ============================================
// 19. ODDRS (Oppositional Defiant Disorder Rating Scale)
// ============================================
export const ODDRS_SCALE = {
  type: "oddrs" as ScaleType,
  name: "ODDRS (Escala de Avaliacao do Transtorno Opositivo Desafiador)",
  description: "Avalia sintomas de transtorno opositivo desafiador em criancas e adolescentes",
  totalItems: 8,
  items: [
    { id: "oddrs_1", question: "Frequentemente perde a paciencia?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Raramente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "oddrs_2", question: "Frequentemente discute com adultos?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Raramente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "oddrs_3", question: "Frequentemente desafia ou se recusa a obedecer regras?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Raramente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "oddrs_4", question: "Frequentemente faz coisas para irritar outras pessoas?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Raramente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "oddrs_5", question: "Frequentemente culpa outras pessoas por seus erros?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Raramente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "oddrs_6", question: "Frequentemente e facilmente se sente ofendido?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Raramente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "oddrs_7", question: "Frequentemente e facilmente se sente raivoso?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Raramente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
    { id: "oddrs_8", question: "Frequentemente e facilmente e rancoroso ou vingativo?", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Raramente" }, { value: 2, label: "Frequentemente" }, { value: 3, label: "Muito frequentemente" }] },
  ],
  calculateScore: (answers: Record<string, number | string>) => {
    const values = Object.values(answers).filter(v => typeof v === 'number') as number[];
    const total = values.reduce((a, b) => a + b, 0);
    let interpretation = "";
    if (total <= 6) interpretation = "Sintomas minimos ou ausentes";
    else if (total <= 12) interpretation = "Sintomas leves";
    else if (total <= 18) interpretation = "Sintomas moderados";
    else interpretation = "Sintomas severos";
    return { score: total, interpretation };
  },
};

// ============================================
// 18. MDS-UPDRS (Movement Disorder Society - Unified Parkinson's Disease Rating Scale)
// ============================================
export const MDSUPDRS_SCALE = {
  type: "mdsupdrs" as ScaleType,
  name: "MDS-UPDRS (Escala Unificada de Avaliacao da Doenca de Parkinson)",
  description: "Avalia sintomas motores e nao-motores em Parkinson - 65 itens",
  totalItems: 65,
  items: [
    // PARTE I: Experiências não-motoras da vida diária (13 itens)
    { id: "mdsupdrs_1", question: "Complexidade cognitiva", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_2", question: "Depressão", options: [{ value: 0, label: "Nenhuma" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_3", question: "Ansiedade", options: [{ value: 0, label: "Nenhuma" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_4", question: "Apatia", options: [{ value: 0, label: "Nenhuma" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_5", question: "Problemas de sono noturno", options: [{ value: 0, label: "Nenhum" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderado" }, { value: 3, label: "Severo" }, { value: 4, label: "Muito severo" }] },
    { id: "mdsupdrs_6", question: "Sonolência diurna", options: [{ value: 0, label: "Nenhuma" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_7", question: "Dor e parestesias", options: [{ value: 0, label: "Nenhuma" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_8", question: "Urgência urinária", options: [{ value: 0, label: "Nenhuma" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_9", question: "Constipação", options: [{ value: 0, label: "Nenhuma" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_10", question: "Luz brilhante", options: [{ value: 0, label: "Nenhuma" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_11", question: "Dificuldade em saborear ou cheirar", options: [{ value: 0, label: "Nenhuma" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_12", question: "Tontura ao ficar de pé", options: [{ value: 0, label: "Nenhuma" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_13", question: "Fadiga", options: [{ value: 0, label: "Nenhuma" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    
    // PARTE II: Experiências motoras da vida diária (13 itens)
    { id: "mdsupdrs_14", question: "Fala", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_15", question: "Salivação", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_16", question: "Deglutição", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_17", question: "Escrita", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_18", question: "Tremor de repouso", options: [{ value: 0, label: "Ausente" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderado" }, { value: 3, label: "Severo" }, { value: 4, label: "Muito severo" }] },
    { id: "mdsupdrs_19", question: "Tremor de ação", options: [{ value: 0, label: "Ausente" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderado" }, { value: 3, label: "Severo" }, { value: 4, label: "Muito severo" }] },
    { id: "mdsupdrs_20", question: "Rigidez", options: [{ value: 0, label: "Ausente" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_21", question: "Bradicinesia", options: [{ value: 0, label: "Ausente" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_22", question: "Postura", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_23", question: "Marcha", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_24", question: "Estabilidade postural", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_25", question: "Expressão facial", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_26", question: "Movimento ocular", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    
    // PARTE III: Exame motor (33 itens)
    { id: "mdsupdrs_27", question: "Fala - Volume", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_28", question: "Fala - Clareza", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_29", question: "Tremor de repouso - Mão direita", options: [{ value: 0, label: "Ausente" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderado" }, { value: 3, label: "Severo" }, { value: 4, label: "Muito severo" }] },
    { id: "mdsupdrs_30", question: "Tremor de repouso - Mão esquerda", options: [{ value: 0, label: "Ausente" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderado" }, { value: 3, label: "Severo" }, { value: 4, label: "Muito severo" }] },
    { id: "mdsupdrs_31", question: "Tremor de repouso - Perna direita", options: [{ value: 0, label: "Ausente" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderado" }, { value: 3, label: "Severo" }, { value: 4, label: "Muito severo" }] },
    { id: "mdsupdrs_32", question: "Tremor de repouso - Perna esquerda", options: [{ value: 0, label: "Ausente" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderado" }, { value: 3, label: "Severo" }, { value: 4, label: "Muito severo" }] },
    { id: "mdsupdrs_33", question: "Tremor de ação - Mão direita", options: [{ value: 0, label: "Ausente" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderado" }, { value: 3, label: "Severo" }, { value: 4, label: "Muito severo" }] },
    { id: "mdsupdrs_34", question: "Tremor de ação - Mão esquerda", options: [{ value: 0, label: "Ausente" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderado" }, { value: 3, label: "Severo" }, { value: 4, label: "Muito severo" }] },
    { id: "mdsupdrs_35", question: "Rigidez - Pescoço", options: [{ value: 0, label: "Ausente" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_36", question: "Rigidez - Braço direito", options: [{ value: 0, label: "Ausente" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_37", question: "Rigidez - Braço esquerdo", options: [{ value: 0, label: "Ausente" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_38", question: "Rigidez - Perna direita", options: [{ value: 0, label: "Ausente" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_39", question: "Rigidez - Perna esquerda", options: [{ value: 0, label: "Ausente" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_40", question: "Batida de dedo - Direita", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_41", question: "Batida de dedo - Esquerda", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_42", question: "Movimento de mão - Direita", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_43", question: "Movimento de mão - Esquerda", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_44", question: "Pronação/Supinação - Direita", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_45", question: "Pronação/Supinação - Esquerda", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_46", question: "Toque de dedo com polegar - Direita", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_47", question: "Toque de dedo com polegar - Esquerda", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_48", question: "Abertura de mão - Direita", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_49", question: "Abertura de mão - Esquerda", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_50", question: "Levantamento de perna - Direita", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_51", question: "Levantamento de perna - Esquerda", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_52", question: "Levantamento de assento", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_53", question: "Postura", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_54", question: "Marcha", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_55", question: "Congelamento da marcha", options: [{ value: 0, label: "Ausente" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderado" }, { value: 3, label: "Severo" }, { value: 4, label: "Muito severo" }] },
    { id: "mdsupdrs_56", question: "Estabilidade postural", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_57", question: "Disartria", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_58", question: "Distonia", options: [{ value: 0, label: "Ausente" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_59", question: "Discinesia", options: [{ value: 0, label: "Ausente" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_60", question: "Acinesia", options: [{ value: 0, label: "Ausente" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_61", question: "Sialorreia", options: [{ value: 0, label: "Ausente" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_62", question: "Dificuldade para se levantar da cadeira", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_63", question: "Dificuldade para virar na cama", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_64", question: "Dificuldade para caminhar", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
    { id: "mdsupdrs_65", question: "Dificuldade para subir escadas", options: [{ value: 0, label: "Normal" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }, { value: 4, label: "Muito severa" }] },
  ],
  calculateScore: (answers: Record<string, number | string>) => {
    const values = Object.values(answers).filter(v => typeof v === 'number') as number[];
    const total = values.reduce((a, b) => a + b, 0);
    let interpretation = "";
    if (total <= 20) interpretation = "Parkinson muito leve";
    else if (total <= 40) interpretation = "Parkinson leve";
    else if (total <= 60) interpretation = "Parkinson moderada";
    else if (total <= 80) interpretation = "Parkinson moderadamente severa";
    else if (total <= 120) interpretation = "Parkinson severa";
    else interpretation = "Parkinson muito severa";
    return { score: total, interpretation };
  },
};

// ============================================
// 19. PHQ-44 (Patient Health Questionnaire-44 - Versão Expandida de Depressão)
// ============================================
export const PHQ44_SCALE = {
  type: "phq44" as ScaleType,
  name: "PHQ-44 (Questionário de Saúde do Paciente-44 - Depressão Expandida)",
  description: "Avalia sintomas de depressão com 44 perguntas detalhadas",
  totalItems: 44,
  items: [
    // Sintomas principais (9 itens do PHQ-9)
    { id: "phq44_1", question: "Pouco interesse ou prazer em fazer coisas?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Vários dias" }, { value: 2, label: "Mais da metade dos dias" }, { value: 3, label: "Quase todos os dias" }] },
    { id: "phq44_2", question: "Se sentir deprimido, depressivo ou sem esperança?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Vários dias" }, { value: 2, label: "Mais da metade dos dias" }, { value: 3, label: "Quase todos os dias" }] },
    { id: "phq44_3", question: "Dificuldade em adormecer, manter o sono ou dormir demais?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Vários dias" }, { value: 2, label: "Mais da metade dos dias" }, { value: 3, label: "Quase todos os dias" }] },
    { id: "phq44_4", question: "Cansaço ou falta de energia?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Vários dias" }, { value: 2, label: "Mais da metade dos dias" }, { value: 3, label: "Quase todos os dias" }] },
    { id: "phq44_5", question: "Falta de apetite ou comer demais?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Vários dias" }, { value: 2, label: "Mais da metade dos dias" }, { value: 3, label: "Quase todos os dias" }] },
    { id: "phq44_6", question: "Sentir-se mal consigo mesmo ou fracaço?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Vários dias" }, { value: 2, label: "Mais da metade dos dias" }, { value: 3, label: "Quase todos os dias" }] },
    { id: "phq44_7", question: "Dificuldade em se concentrar?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Vários dias" }, { value: 2, label: "Mais da metade dos dias" }, { value: 3, label: "Quase todos os dias" }] },
    { id: "phq44_8", question: "Falar ou agir tão lentamente que outros notam ou o oposto?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Vários dias" }, { value: 2, label: "Mais da metade dos dias" }, { value: 3, label: "Quase todos os dias" }] },
    { id: "phq44_9", question: "Pensamentos de que seria melhor estar morto ou se machucar?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Vários dias" }, { value: 2, label: "Mais da metade dos dias" }, { value: 3, label: "Quase todos os dias" }] },
    
    // Sintomas adicionais de depressão (35 itens)
    { id: "phq44_10", question: "Sentir-se infeliz ou triste?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_11", question: "Perda de interesse em atividades que antes gostava?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_12", question: "Sentimentos de culpa ou remorso?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_13", question: "Dificuldade em tomar decisões?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_14", question: "Sentir-se sem valor ou inadequado?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_15", question: "Dificuldade em se concentrar em tarefas?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_16", question: "Perda de memória ou esquecimento?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_17", question: "Dificuldade em dormir no início da noite?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_18", question: "Acordar no meio da noite?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_19", question: "Acordar cedo demais?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_20", question: "Dormir demais?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_21", question: "Falta de apetite?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_22", question: "Comer demais?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_23", question: "Ganho de peso?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_24", question: "Perda de peso?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_25", question: "Falta de motivação?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_26", question: "Sensação de desesperço?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_27", question: "Sensação de vazio?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_28", question: "Dificuldade em expressar emoções?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_29", question: "Isolamento social?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_30", question: "Dificuldade em manter relacionamentos?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_31", question: "Irritabilidade ou raiva fácil?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_32", question: "Choro fácil?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_33", question: "Pensamentos negativos recorrentes?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_34", question: "Preocupação excessiva?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_35", question: "Ansiedade ou pânico?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_36", question: "Tensão muscular ou dores?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_37", question: "Dores de cabeça?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_38", question: "Problemas digestivos?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_39", question: "Tontura ou vertigem?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_40", question: "Falta de ar ou dificuldade em respirar?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_41", question: "Sensação de aperto no peito?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_42", question: "Palpitações ou batida cardíaca acelerada?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_43", question: "Suores noturnos?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
    { id: "phq44_44", question: "Pensamentos de morte ou suicídio?", options: [{ value: 0, label: "Não" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderada" }, { value: 3, label: "Severa" }] },
  ],
  calculateScore: (answers: Record<string, number | string>) => {
    const values = Object.values(answers).filter(v => typeof v === 'number') as number[];
    const total = values.reduce((a, b) => a + b, 0);
    let interpretation = "";
    if (total <= 10) interpretation = "Sem depressão";
    else if (total <= 25) interpretation = "Depressão leve";
    else if (total <= 50) interpretation = "Depressão moderada";
    else if (total <= 75) interpretation = "Depressão moderadamente severa";
    else interpretation = "Depressão severa";
    return { score: total, interpretation };
  },
};

// ============================================
// 20. SALIVA (Escala de Salivação de Parkinson)
// ============================================
export const SALIVA_SCALE = {
  type: "saliva" as ScaleType,
  name: "Escala de SALIVA de Parkinson",
  description: "Avaliação de Salivação em pacientes com Parkinson",
  totalItems: 4,
  items: [
    { id: "saliva_1", question: "Boca seca ou úmida?", options: [{ value: 0, label: "Seca" }, { value: 1, label: "Levemente úmida" }, { value: 2, label: "Moderadamente úmida" }, { value: 3, label: "Muito úmida" }, { value: 4, label: "Babando" }] },
    { id: "saliva_2", question: "Frequência de salivação excessiva", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Raramente" }, { value: 2, label: "Ocasionalmente" }, { value: 3, label: "Frequentemente" }, { value: 4, label: "Constantemente" }] },
    { id: "saliva_3", question: "Impacto na fala e deglutição", options: [{ value: 0, label: "Nenhum" }, { value: 1, label: "Leve" }, { value: 2, label: "Moderado" }, { value: 3, label: "Severo" }, { value: 4, label: "Muito severo" }] },
    { id: "saliva_4", question: "Necessidade de lenços ou toalhas", options: [{ value: 0, label: "Nunca" }, { value: 1, label: "Raramente" }, { value: 2, label: "Ocasionalmente" }, { value: 3, label: "Frequentemente" }, { value: 4, label: "Constantemente" }] },
  ],
  calculateScore: (answers: Record<string, number | string>) => {
    const values = Object.values(answers).filter(v => typeof v === 'number') as number[];
    const total = values.reduce((a, b) => a + b, 0);
    let interpretation = "";
    if (total <= 4) interpretation = "Salivação normal ou mínima";
    else if (total <= 8) interpretation = "Salivação leve";
    else if (total <= 12) interpretation = "Salivação moderada";
    else interpretation = "Salivação severa";
    return { score: total, interpretation };
  },
};

// Array com todas as escalas
export const ALL_SCALES = [
  DOSS_SCALE, BTSS_SCALE, BDAE_SCALE, CM_SCALE, SARA_SCALE, QCS_SCALE,
  PDQ39_SCALE, FOIS_SCALE, DSFS_SCALE, GRBASI_SCALE, EAT10_SCALE,
  STOPBANG_SCALE, HB_SCALE, PHQ9_SCALE, PHQ44_SCALE, MDQ_SCALE, SNAPIV_SCALE, AMISOS_SCALE, ODDRS_SCALE, CONNERS_SCALE, VANDERBILT_SCALE, MDSUPDRS_SCALE, SALIVA_SCALE
];

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
