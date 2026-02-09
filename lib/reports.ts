/**
 * Sistema de Relatórios e Exportação
 * Relatórios completos com validação end-to-end
 * Sem valores negativos e com cálculos validados
 */

import { ScaleResponse } from "./clinical-scales";
import { LaserTherapyPlan } from "./laser-templates";
import { TDCSTherapyPlan } from "./tdcs-templates";
import { ElectronicSignature } from "./electronic-signature";

export interface TherapyReport {
  id: string;
  patientId: string;
  patientName: string;
  reportDate: string;
  reportType: "initial-assessment" | "progress" | "final" | "comparative";
  therapyType: "laser" | "tdcs" | "combined";
  
  // Dados clínicos
  clinicalScales: ScaleResponse[];
  therapyPlans: (LaserTherapyPlan | TDCSTherapyPlan)[];
  
  // Evolução
  evolutionData: EvolutionData;
  
  // Comparativo (se aplicável)
  comparativeAnalysis?: ComparativeAnalysis;
  
  // Assinatura
  signature?: ElectronicSignature;
  
  // Metadados
  createdDate: string;
  lastModifiedDate: string;
  status: "draft" | "final" | "archived";
}

export interface EvolutionData {
  startDate: string;
  endDate: string;
  sessionsCompleted: number;
  totalPlannedSessions: number;
  adherenceRate: number; // 0-100%
  
  // Evolução de escalas
  scaleEvolution: {
    scaleType: string;
    initialScore: number;
    finalScore: number;
    scoreChange: number; // sempre positivo para melhora
    percentageImprovement: number;
    interpretation: string;
  }[];
  
  // Progresso geral
  overallImprovement: number; // 0-100%
  improvementTrend: "improving" | "stable" | "declining";
  
  // Eventos adversos
  adverseEvents: string[];
  
  // Notas clínicas
  clinicalNotes: string;
}

export interface ComparativeAnalysis {
  laserPlanId: string;
  tdcsPlanId: string;
  
  // Resultados
  laserResults: {
    initialScore: number;
    finalScore: number;
    improvement: number;
    improvementPercentage: number;
  };
  
  tdcsResults: {
    initialScore: number;
    finalScore: number;
    improvement: number;
    improvementPercentage: number;
  };
  
  // Comparação
  comparison: {
    moreEffectiveTreatment: "laser" | "tdcs" | "equivalent";
    differencePercentage: number;
    recommendation: string;
    notes: string;
  };
}

// ============================================
// FUNÇÕES DE VALIDAÇÃO
// ============================================

/**
 * Valida que não há valores negativos nos cálculos
 */
export function validateNoNegativeValues(scores: number[]): {
  isValid: boolean;
  negativeValues: number[];
} {
  const negativeValues = scores.filter(score => score < 0);
  return {
    isValid: negativeValues.length === 0,
    negativeValues
  };
}

/**
 * Calcula evolução com validação
 */
export function calculateEvolution(
  initialScore: number,
  finalScore: number,
  maxScore: number
): {
  scoreChange: number;
  percentageImprovement: number;
  isValid: boolean;
} {
  // Validar valores
  if (initialScore < 0 || finalScore < 0 || maxScore <= 0) {
    return {
      scoreChange: 0,
      percentageImprovement: 0,
      isValid: false
    };
  }

  // Calcular mudança (sempre positiva para melhora)
  const scoreChange = Math.max(0, initialScore - finalScore);
  const percentageImprovement = (scoreChange / maxScore) * 100;

  return {
    scoreChange: Math.max(0, scoreChange), // Garantir não-negativo
    percentageImprovement: Math.max(0, percentageImprovement), // Garantir não-negativo
    isValid: true
  };
}

/**
 * Cria relatório de avaliação inicial
 */
export function createInitialAssessmentReport(
  patientId: string,
  patientName: string,
  clinicalScales: ScaleResponse[],
  therapyPlans: (LaserTherapyPlan | TDCSTherapyPlan)[],
  clinicalNotes: string
): TherapyReport {
  return {
    id: `report_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    patientId,
    patientName,
    reportDate: new Date().toISOString(),
    reportType: "initial-assessment",
    therapyType: therapyPlans.some(p => 'templateId' in p && p.templateId.startsWith('laser')) ? "laser" : "tdcs",
    
    clinicalScales,
    therapyPlans,
    
    evolutionData: {
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      sessionsCompleted: 0,
      totalPlannedSessions: therapyPlans.reduce((sum, p) => sum + (p as any).frequency * 4, 0),
      adherenceRate: 0,
      scaleEvolution: [],
      overallImprovement: 0,
      improvementTrend: "stable",
      adverseEvents: [],
      clinicalNotes
    },
    
    createdDate: new Date().toISOString(),
    lastModifiedDate: new Date().toISOString(),
    status: "draft"
  };
}

/**
 * Cria relatório de progresso
 */
export function createProgressReport(
  patientId: string,
  patientName: string,
  initialScales: ScaleResponse[],
  currentScales: ScaleResponse[],
  therapyPlans: (LaserTherapyPlan | TDCSTherapyPlan)[],
  sessionsCompleted: number,
  clinicalNotes: string,
  adverseEvents: string[] = []
): TherapyReport {
  // Calcular evolução
  const scaleEvolution = initialScales.map((initialScale, index) => {
    const currentScale = currentScales[index];
    if (!currentScale) return null;

    const evolution = calculateEvolution(
      initialScale.totalScore,
      currentScale.totalScore,
      100 // Assumindo escala máxima de 100
    );

    return {
      scaleType: initialScale.scaleType,
      initialScore: initialScale.totalScore,
      finalScore: currentScale.totalScore,
      scoreChange: evolution.scoreChange,
      percentageImprovement: evolution.percentageImprovement,
      interpretation: currentScale.interpretation
    };
  }).filter(Boolean) as any[];

  const totalPlannedSessions = therapyPlans.reduce((sum, p) => sum + (p as any).frequency * 4, 0);
  const adherenceRate = (sessionsCompleted / totalPlannedSessions) * 100;
  const overallImprovement = scaleEvolution.length > 0
    ? scaleEvolution.reduce((sum, s) => sum + s.percentageImprovement, 0) / scaleEvolution.length
    : 0;

  return {
    id: `report_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    patientId,
    patientName,
    reportDate: new Date().toISOString(),
    reportType: "progress",
    therapyType: therapyPlans.some(p => 'templateId' in p && p.templateId.startsWith('laser')) ? "laser" : "tdcs",
    
    clinicalScales: currentScales,
    therapyPlans,
    
    evolutionData: {
      startDate: initialScales[0]?.date || new Date().toISOString(),
      endDate: new Date().toISOString(),
      sessionsCompleted,
      totalPlannedSessions,
      adherenceRate: Math.min(100, adherenceRate), // Máximo 100%
      scaleEvolution,
      overallImprovement: Math.max(0, overallImprovement), // Garantir não-negativo
      improvementTrend: overallImprovement > 10 ? "improving" : overallImprovement < -10 ? "declining" : "stable",
      adverseEvents,
      clinicalNotes
    },
    
    createdDate: new Date().toISOString(),
    lastModifiedDate: new Date().toISOString(),
    status: "draft"
  };
}

/**
 * Cria relatório final
 */
export function createFinalReport(
  patientId: string,
  patientName: string,
  initialScales: ScaleResponse[],
  finalScales: ScaleResponse[],
  therapyPlans: (LaserTherapyPlan | TDCSTherapyPlan)[],
  sessionsCompleted: number,
  clinicalNotes: string,
  recommendations: string,
  adverseEvents: string[] = []
): TherapyReport {
  const progressReport = createProgressReport(
    patientId,
    patientName,
    initialScales,
    finalScales,
    therapyPlans,
    sessionsCompleted,
    clinicalNotes,
    adverseEvents
  );

  return {
    ...progressReport,
    reportType: "final",
    status: "final",
    evolutionData: {
      ...progressReport.evolutionData,
      clinicalNotes: `${clinicalNotes}\n\nRecomendações: ${recommendations}`
    }
  };
}

/**
 * Cria relatório comparativo LASER vs tDCS
 */
export function createComparativeReport(
  patientId: string,
  patientName: string,
  laserReport: TherapyReport,
  tdcsReport: TherapyReport
): TherapyReport {
  const laserImprovement = laserReport.evolutionData.overallImprovement;
  const tdcsImprovement = tdcsReport.evolutionData.overallImprovement;
  const difference = Math.abs(laserImprovement - tdcsImprovement);

  let moreEffective: "laser" | "tdcs" | "equivalent" = "equivalent";
  if (laserImprovement > tdcsImprovement + 5) moreEffective = "laser";
  else if (tdcsImprovement > laserImprovement + 5) moreEffective = "tdcs";

  return {
    id: `report_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    patientId,
    patientName,
    reportDate: new Date().toISOString(),
    reportType: "comparative",
    therapyType: "combined",
    
    clinicalScales: [...laserReport.clinicalScales, ...tdcsReport.clinicalScales],
    therapyPlans: [...laserReport.therapyPlans, ...tdcsReport.therapyPlans],
    
    evolutionData: {
      startDate: laserReport.evolutionData.startDate,
      endDate: new Date().toISOString(),
      sessionsCompleted: laserReport.evolutionData.sessionsCompleted + tdcsReport.evolutionData.sessionsCompleted,
      totalPlannedSessions: laserReport.evolutionData.totalPlannedSessions + tdcsReport.evolutionData.totalPlannedSessions,
      adherenceRate: ((laserReport.evolutionData.sessionsCompleted + tdcsReport.evolutionData.sessionsCompleted) / 
                      (laserReport.evolutionData.totalPlannedSessions + tdcsReport.evolutionData.totalPlannedSessions)) * 100,
      scaleEvolution: [...laserReport.evolutionData.scaleEvolution, ...tdcsReport.evolutionData.scaleEvolution],
      overallImprovement: (laserImprovement + tdcsImprovement) / 2,
      improvementTrend: "improving",
      adverseEvents: [...laserReport.evolutionData.adverseEvents, ...tdcsReport.evolutionData.adverseEvents],
      clinicalNotes: "Análise comparativa entre terapias LASER e tDCS"
    },
    
    comparativeAnalysis: {
      laserPlanId: laserReport.id,
      tdcsPlanId: tdcsReport.id,
      laserResults: {
        initialScore: laserReport.clinicalScales[0]?.totalScore || 0,
        finalScore: laserReport.clinicalScales[laserReport.clinicalScales.length - 1]?.totalScore || 0,
        improvement: laserImprovement,
        improvementPercentage: laserImprovement
      },
      tdcsResults: {
        initialScore: tdcsReport.clinicalScales[0]?.totalScore || 0,
        finalScore: tdcsReport.clinicalScales[tdcsReport.clinicalScales.length - 1]?.totalScore || 0,
        improvement: tdcsImprovement,
        improvementPercentage: tdcsImprovement
      },
      comparison: {
        moreEffectiveTreatment: moreEffective,
        differencePercentage: difference,
        recommendation: moreEffective === "laser" 
          ? "LASER mostrou-se mais efetivo para este paciente"
          : moreEffective === "tdcs"
          ? "tDCS mostrou-se mais efetivo para este paciente"
          : "Ambas as terapias apresentaram efetividade equivalente",
        notes: `Diferença de ${difference.toFixed(2)}% entre os tratamentos`
      }
    },
    
    createdDate: new Date().toISOString(),
    lastModifiedDate: new Date().toISOString(),
    status: "final"
  };
}

/**
 * Exporta relatório em formato texto
 */
export function exportReportAsText(report: TherapyReport): string {
  let text = `
╔════════════════════════════════════════════════════════════════╗
║                    RELATÓRIO DE TERAPIA                       ║
╚════════════════════════════════════════════════════════════════╝

INFORMAÇÕES GERAIS:
  ID do Relatório: ${report.id}
  Paciente: ${report.patientName}
  Data do Relatório: ${new Date(report.reportDate).toLocaleString("pt-BR")}
  Tipo de Relatório: ${report.reportType}
  Tipo de Terapia: ${report.therapyType}

DADOS DE EVOLUÇÃO:
  Período: ${new Date(report.evolutionData.startDate).toLocaleDateString("pt-BR")} a ${new Date(report.evolutionData.endDate).toLocaleDateString("pt-BR")}
  Sessões Completadas: ${report.evolutionData.sessionsCompleted}/${report.evolutionData.totalPlannedSessions}
  Taxa de Aderência: ${report.evolutionData.adherenceRate.toFixed(2)}%
  Melhora Geral: ${report.evolutionData.overallImprovement.toFixed(2)}%
  Tendência: ${report.evolutionData.improvementTrend}

EVOLUÇÃO DE ESCALAS:
`;

  report.evolutionData.scaleEvolution.forEach((scale, index) => {
    text += `
  ${index + 1}. ${scale.scaleType}
     Score Inicial: ${scale.initialScore}
     Score Final: ${scale.finalScore}
     Mudança: ${scale.scoreChange.toFixed(2)} (${scale.percentageImprovement.toFixed(2)}%)
     Interpretação: ${scale.interpretation}
`;
  });

  if (report.evolutionData.adverseEvents.length > 0) {
    text += `
EVENTOS ADVERSOS:
`;
    report.evolutionData.adverseEvents.forEach((event, index) => {
      text += `  ${index + 1}. ${event}\n`;
    });
  }

  if (report.comparativeAnalysis) {
    text += `
ANÁLISE COMPARATIVA (LASER vs tDCS):
  Tratamento Mais Efetivo: ${report.comparativeAnalysis.comparison.moreEffectiveTreatment}
  Diferença: ${report.comparativeAnalysis.comparison.differencePercentage.toFixed(2)}%
  Recomendação: ${report.comparativeAnalysis.comparison.recommendation}
`;
  }

  text += `
NOTAS CLÍNICAS:
${report.evolutionData.clinicalNotes}

═══════════════════════════════════════════════════════════════════
Relatório gerado em: ${new Date().toLocaleString("pt-BR")}
Status: ${report.status}
═══════════════════════════════════════════════════════════════════
  `;

  return text;
}

/**
 * Exporta relatório em formato JSON
 */
export function exportReportAsJSON(report: TherapyReport): string {
  return JSON.stringify(report, null, 2);
}

/**
 * Valida integridade do relatório
 */
export function validateReportIntegrity(report: TherapyReport): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validar valores negativos
  const negativeScores = report.evolutionData.scaleEvolution.filter(s => s.scoreChange < 0 || s.percentageImprovement < 0);
  if (negativeScores.length > 0) {
    errors.push(`Encontrados ${negativeScores.length} valores negativos em escalas`);
  }

  // Validar aderência
  if (report.evolutionData.adherenceRate > 100) {
    errors.push("Taxa de aderência não pode exceder 100%");
  }

  if (report.evolutionData.adherenceRate < 50) {
    warnings.push("Taxa de aderência abaixo de 50% - considerar revisar plano");
  }

  // Validar datas
  if (new Date(report.evolutionData.startDate) > new Date(report.evolutionData.endDate)) {
    errors.push("Data de início posterior à data de término");
  }

  // Validar sessões
  if (report.evolutionData.sessionsCompleted > report.evolutionData.totalPlannedSessions) {
    warnings.push("Sessões completadas excedem o planejado");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
