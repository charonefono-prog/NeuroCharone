/**
 * Sistema de Alertas de Severidade para Escalas Clínicas
 * Monitora scores e gera alertas quando necessário
 */

import { ScaleResponse } from "./clinical-scales";

export interface SeverityAlert {
  scaleType: string;
  scaleName: string;
  severity: "low" | "medium" | "high" | "critical";
  score: number;
  maxScore: number;
  message: string;
  recommendation: string;
  timestamp: string;
}

// Definição de limiares de severidade por escala
const SEVERITY_THRESHOLDS: Record<string, { low: number; medium: number; high: number; critical: number }> = {
  oddrs: { low: 6, medium: 12, high: 18, critical: 24 },
  conners: { low: 10, medium: 20, high: 30, critical: 40 },
  vanderbilt: { low: 8, medium: 16, high: 20, critical: 24 },
  phq9: { low: 4, medium: 9, high: 14, critical: 19 },
  mdsupdrs: { low: 5, medium: 10, high: 15, critical: 20 },
  hb: { low: 2, medium: 3, high: 4, critical: 5 },
  eat10: { low: 10, medium: 20, high: 30, critical: 40 },
};

// Mensagens personalizadas por escala
const ALERT_MESSAGES: Record<string, Record<string, string>> = {
  oddrs: {
    low: "Sintomas mínimos de transtorno opositivo desafiador",
    medium: "Sintomas leves detectados - acompanhamento recomendado",
    high: "Sintomas moderados - intervenção comportamental indicada",
    critical: "Sintomas severos - avaliação clínica urgente necessária",
  },
  conners: {
    low: "Sem indicadores significativos de TDAH",
    medium: "Possíveis sintomas leves de TDAH - avaliar",
    high: "Sintomas moderados de TDAH - diagnóstico recomendado",
    critical: "Sintomas severos de TDAH - avaliação especializada urgente",
  },
  vanderbilt: {
    low: "Sem indicadores significativos de TDAH",
    medium: "Possíveis sintomas leves de TDAH",
    high: "Sintomas moderados de TDAH detectados",
    critical: "Sintomas severos de TDAH - intervenção urgente",
  },
  phq9: {
    low: "Sem depressão ou sintomas mínimos",
    medium: "Depressão leve - acompanhamento recomendado",
    high: "Depressão moderada - tratamento indicado",
    critical: "Depressão severa - avaliação urgente e possível internação",
  },
  mdsupdrs: {
    low: "Rigidez mínima ou ausente",
    medium: "Rigidez leve - monitorar",
    high: "Rigidez moderada - ajuste terapêutico considerado",
    critical: "Rigidez severa - revisão urgente do tratamento",
  },
  hb: {
    low: "Função facial normal ou paralisia leve",
    medium: "Paralisia moderada - reabilitação recomendada",
    high: "Paralisia moderadamente severa - intervenção indicada",
    critical: "Paralisia severa ou total - avaliação urgente",
  },
  eat10: {
    low: "Sem dificuldade de deglutição significativa",
    medium: "Dificuldade leve de deglutição",
    high: "Dificuldade moderada - avaliação fonoaudiológica",
    critical: "Dificuldade severa - risco de aspiração - intervenção urgente",
  },
};

// Recomendações personalizadas
const RECOMMENDATIONS: Record<string, Record<string, string>> = {
  oddrs: {
    low: "Manter acompanhamento regular",
    medium: "Implementar estratégias comportamentais em casa e escola",
    high: "Considerar terapia comportamental estruturada",
    critical: "Referência urgente para psiquiatria infantil",
  },
  conners: {
    low: "Acompanhamento periódico",
    medium: "Avaliação neuropsicológica completa",
    high: "Considerar medicação + terapia comportamental",
    critical: "Encaminhamento urgente para especialista TDAH",
  },
  vanderbilt: {
    low: "Monitoramento regular",
    medium: "Avaliação neuropsicológica",
    high: "Terapia comportamental + possível medicação",
    critical: "Avaliação urgente com especialista",
  },
  phq9: {
    low: "Acompanhamento de rotina",
    medium: "Psicoterapia recomendada",
    high: "Considerar antidepressivo + psicoterapia",
    critical: "Avaliação urgente - risco de suicídio deve ser avaliado",
  },
  mdsupdrs: {
    low: "Manter tratamento atual",
    medium: "Revisar aderência ao tratamento",
    high: "Ajuste de medicação considerado",
    critical: "Avaliação urgente do esquema terapêutico",
  },
  hb: {
    low: "Acompanhamento periódico",
    medium: "Fisioterapia facial recomendada",
    high: "Terapia intensiva + possível eletroestimulação",
    critical: "Avaliação urgente - possível cirurgia considerada",
  },
  eat10: {
    low: "Acompanhamento regular",
    medium: "Avaliação fonoaudiológica",
    high: "Terapia de deglutição + modificação de dieta",
    critical: "Avaliação urgente - possível sonda nasogástrica",
  },
};

/**
 * Avalia severidade de um score e gera alerta se necessário
 */
export function checkSeverityAlert(scaleResponse: ScaleResponse): SeverityAlert | null {
  const thresholds = SEVERITY_THRESHOLDS[scaleResponse.scaleType];
  if (!thresholds) return null;

  const score = scaleResponse.totalScore;
  let severity: "low" | "medium" | "high" | "critical" = "low";

  if (score >= thresholds.critical) {
    severity = "critical";
  } else if (score >= thresholds.high) {
    severity = "high";
  } else if (score >= thresholds.medium) {
    severity = "medium";
  }

  // Apenas gera alerta se severidade for média ou acima
  if (severity === "low") return null;

  const messages = ALERT_MESSAGES[scaleResponse.scaleType] || {};
  const recommendations = RECOMMENDATIONS[scaleResponse.scaleType] || {};

  return {
    scaleType: scaleResponse.scaleType,
    scaleName: scaleResponse.scaleName,
    severity,
    score,
    maxScore: 100, // Será ajustado conforme necessário
    message: messages[severity] || `Alerta de severidade ${severity}`,
    recommendation: recommendations[severity] || "Consulte um profissional",
    timestamp: new Date().toISOString(),
  };
}

/**
 * Compara scores de duas avaliações da mesma escala para detectar deterioração
 */
export function checkDeterioration(
  previousScore: ScaleResponse,
  currentScore: ScaleResponse,
  deteriorationThreshold: number = 5
): SeverityAlert | null {
  if (previousScore.scaleType !== currentScore.scaleType) return null;

  const scoreDifference = currentScore.totalScore - previousScore.totalScore;

  if (scoreDifference >= deteriorationThreshold) {
    return {
      scaleType: currentScore.scaleType,
      scaleName: currentScore.scaleName,
      severity: "high",
      score: currentScore.totalScore,
      maxScore: 100,
      message: `Deterioração detectada: score aumentou ${scoreDifference} pontos`,
      recommendation: "Avaliação clínica urgente recomendada",
      timestamp: new Date().toISOString(),
    };
  }

  return null;
}

/**
 * Gera relatório comparativo entre ODDRS e SNAP-IV para diagnóstico diferencial
 */
export function generateBehavioralComparativeReport(
  oddrsResponse: ScaleResponse,
  snapivResponse: ScaleResponse
): {
  oddrsScore: number;
  snapivScore: number;
  comparison: string;
  diagnosis: string;
  recommendation: string;
} {
  const oddrsScore = oddrsResponse.totalScore;
  const snapivScore = snapivResponse.totalScore;

  let comparison = "";
  let diagnosis = "";
  let recommendation = "";

  // Análise comparativa
  if (oddrsScore > snapivScore) {
    comparison = "Sintomas de oposição/desafio predominam sobre sintomas de TDAH";
    diagnosis = "Provável Transtorno Opositivo Desafiador (TOD) com possível TDAH comórbido";
    recommendation = "Terapia comportamental focada em oposição + avaliação TDAH";
  } else if (snapivScore > oddrsScore) {
    comparison = "Sintomas de TDAH predominam sobre sintomas de oposição/desafio";
    diagnosis = "Provável TDAH com possível TOD comórbido";
    recommendation = "Terapia TDAH + avaliação comportamental";
  } else {
    comparison = "Sintomas de TDAH e oposição/desafio estão equilibrados";
    diagnosis = "Possível TDAH com TOD comórbido";
    recommendation = "Abordagem integrada: medicação TDAH + terapia comportamental";
  }

  return {
    oddrsScore,
    snapivScore,
    comparison,
    diagnosis,
    recommendation,
  };
}
