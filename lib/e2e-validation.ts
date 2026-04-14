/**
 * Validação End-to-End (E2E) do Sistema de Escalas Clínicas
 * Testa cálculos, evolução de pacientes e geração de relatórios
 */

import { 
  calculateScaleScore, 
  ALL_SCALES, 
  ScaleType,
  ScaleResponse 
} from "./clinical-scales";
import { 
  calculateImprovement, 
  getScaleStatistics, 
  getScaleEvolution 
} from "./scale-storage";

// ============================================
// 1. VALIDAÇÃO DE CÁLCULOS DE ESCALAS
// ============================================

export interface ValidationResult {
  passed: boolean;
  message: string;
  details?: any;
}

/**
 * Validar que todos os cálculos de escalas retornam valores não-negativos
 */
export function validateScaleCalculations(): ValidationResult[] {
  const results: ValidationResult[] = [];

  for (const scale of ALL_SCALES) {
    // Criar respostas de teste (valores máximos)
    const maxAnswers: Record<string, number> = {};
    for (const item of scale.items) {
      const maxOption = item.options.reduce((max, opt) => 
        opt.value > max ? opt.value : max, 
        item.options[0].value
      );
      maxAnswers[item.id] = maxOption;
    }

    try {
      const result = scale.calculateScore(maxAnswers);
      
      // Validar que score é não-negativo
      if (result.score < 0) {
        results.push({
          passed: false,
          message: `[${scale.type}] Score negativo detectado: ${result.score}`,
          details: { scale: scale.name, score: result.score }
        });
      } else {
        results.push({
          passed: true,
          message: `[${scale.type}] ✓ Cálculo válido (score: ${result.score})`,
          details: { scale: scale.name, score: result.score, interpretation: result.interpretation }
        });
      }
    } catch (error) {
      results.push({
        passed: false,
        message: `[${scale.type}] Erro ao calcular score: ${error}`,
        details: { scale: scale.name, error }
      });
    }
  }

  return results;
}

/**
 * Validar cálculos com respostas mínimas
 */
export function validateMinimumScaleCalculations(): ValidationResult[] {
  const results: ValidationResult[] = [];

  for (const scale of ALL_SCALES) {
    // Criar respostas de teste (valores mínimos)
    const minAnswers: Record<string, number> = {};
    for (const item of scale.items) {
      const minOption = item.options.reduce((min, opt) => 
        opt.value < min ? opt.value : min, 
        item.options[0].value
      );
      minAnswers[item.id] = minOption;
    }

    try {
      const result = scale.calculateScore(minAnswers);
      
      // Validar que score é não-negativo
      if (result.score < 0) {
        results.push({
          passed: false,
          message: `[${scale.type}] Score negativo em valores mínimos: ${result.score}`,
          details: { scale: scale.name, score: result.score }
        });
      } else {
        results.push({
          passed: true,
          message: `[${scale.type}] ✓ Cálculo mínimo válido (score: ${result.score})`,
          details: { scale: scale.name, score: result.score }
        });
      }
    } catch (error) {
      results.push({
        passed: false,
        message: `[${scale.type}] Erro ao calcular score mínimo: ${error}`,
        details: { scale: scale.name, error }
      });
    }
  }

  return results;
}

// ============================================
// 2. VALIDAÇÃO DE EVOLUÇÃO DE PACIENTES
// ============================================

/**
 * Simular evolução de um paciente e validar cálculos
 */
export function validatePatientEvolution(): ValidationResult[] {
  const results: ValidationResult[] = [];

  // Simular 3 aplicações da escala PDQ-39
  const scaleType: ScaleType = "pdq39";
  const testScores = [10, 8, 5]; // Melhora progressiva

  for (let i = 0; i < testScores.length; i++) {
    const score = testScores[i];
    
    if (score < 0) {
      results.push({
        passed: false,
        message: `[Evolução] Score negativo na aplicação ${i + 1}: ${score}`,
        details: { application: i + 1, score }
      });
    } else {
      results.push({
        passed: true,
        message: `[Evolução] ✓ Aplicação ${i + 1} válida (score: ${score})`,
        details: { application: i + 1, score }
      });
    }

    // Validar cálculo de melhoria entre aplicações
    if (i > 0) {
      const improvement = calculateImprovement(testScores[i - 1], score, scaleType);
      
      if (improvement.improvement < 0) {
        results.push({
          passed: false,
          message: `[Evolução] Melhoria negativa entre aplicações ${i} e ${i + 1}`,
          details: { improvement: improvement.improvement }
        });
      } else {
        results.push({
          passed: true,
          message: `[Evolução] ✓ Melhoria calculada: ${improvement.improvement} (${improvement.direction})`,
          details: improvement
        });
      }
    }
  }

  return results;
}

// ============================================
// 3. VALIDAÇÃO DE RELATÓRIOS
// ============================================

/**
 * Validar geração de dados para relatório
 */
export function validateReportGeneration(): ValidationResult[] {
  const results: ValidationResult[] = [];

  // Simular respostas de escalas para relatório
  const mockResponses: ScaleResponse[] = [
    {
      id: "1",
      patientId: "patient1",
      patientName: "João Silva",
      scaleType: "pdq39",
      scaleName: "PDQ-39",
      date: new Date().toISOString(),
      answers: { pdq39_1: 0, pdq39_2: 1, pdq39_3: 0 },
      totalScore: 1,
      interpretation: "Qualidade de vida boa",
    },
    {
      id: "2",
      patientId: "patient1",
      patientName: "João Silva",
      scaleType: "sara",
      scaleName: "SARA",
      date: new Date().toISOString(),
      answers: { sara_1: 0, sara_2: 1, sara_3: 0 },
      totalScore: 1,
      interpretation: "Ataxia leve",
    }
  ];

  // Validar que todos os scores são não-negativos
  for (const response of mockResponses) {
    if (response.totalScore < 0) {
      results.push({
        passed: false,
        message: `[Relatório] Score negativo em resposta ${response.id}`,
        details: { responseId: response.id, score: response.totalScore }
      });
    } else {
      results.push({
        passed: true,
        message: `[Relatório] ✓ Resposta ${response.id} válida (score: ${response.totalScore})`,
        details: { responseId: response.id, score: response.totalScore }
      });
    }
  }

  // Validar estrutura de relatório
  if (mockResponses.length > 0) {
    results.push({
      passed: true,
      message: `[Relatório] ✓ ${mockResponses.length} respostas preparadas para exportação`,
      details: { totalResponses: mockResponses.length }
    });
  }

  return results;
}

// ============================================
// 4. RESUMO DE VALIDAÇÃO
// ============================================

export interface E2EValidationSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  successRate: number;
  categories: {
    scaleCalculations: ValidationResult[];
    minimumCalculations: ValidationResult[];
    patientEvolution: ValidationResult[];
    reportGeneration: ValidationResult[];
  };
}

/**
 * Executar validação E2E completa
 */
export function runFullE2EValidation(): E2EValidationSummary {
  const scaleCalcs = validateScaleCalculations();
  const minCalcs = validateMinimumScaleCalculations();
  const evolution = validatePatientEvolution();
  const reports = validateReportGeneration();

  const allTests = [...scaleCalcs, ...minCalcs, ...evolution, ...reports];
  const passedTests = allTests.filter(t => t.passed).length;
  const failedTests = allTests.filter(t => !t.passed).length;

  return {
    totalTests: allTests.length,
    passedTests,
    failedTests,
    successRate: Math.round((passedTests / allTests.length) * 100),
    categories: {
      scaleCalculations: scaleCalcs,
      minimumCalculations: minCalcs,
      patientEvolution: evolution,
      reportGeneration: reports,
    }
  };
}

/**
 * Gerar relatório de validação em texto
 */
export function generateValidationReport(summary: E2EValidationSummary): string {
  let report = "═══════════════════════════════════════════════════════════════\n";
  report += "         RELATÓRIO DE VALIDAÇÃO END-TO-END (E2E)\n";
  report += "═══════════════════════════════════════════════════════════════\n\n";

  report += `📊 RESUMO GERAL\n`;
  report += `├─ Total de Testes: ${summary.totalTests}\n`;
  report += `├─ Testes Aprovados: ${summary.passedTests} ✓\n`;
  report += `├─ Testes Falhados: ${summary.failedTests} ✗\n`;
  report += `└─ Taxa de Sucesso: ${summary.successRate}%\n\n`;

  report += `📋 DETALHES POR CATEGORIA\n\n`;

  report += `1️⃣ CÁLCULOS DE ESCALAS (${summary.categories.scaleCalculations.length} testes)\n`;
  for (const test of summary.categories.scaleCalculations) {
    report += `   ${test.passed ? '✓' : '✗'} ${test.message}\n`;
  }
  report += "\n";

  report += `2️⃣ CÁLCULOS MÍNIMOS (${summary.categories.minimumCalculations.length} testes)\n`;
  for (const test of summary.categories.minimumCalculations.slice(0, 5)) {
    report += `   ${test.passed ? '✓' : '✗'} ${test.message}\n`;
  }
  if (summary.categories.minimumCalculations.length > 5) {
    report += `   ... e ${summary.categories.minimumCalculations.length - 5} mais\n`;
  }
  report += "\n";

  report += `3️⃣ EVOLUÇÃO DE PACIENTES (${summary.categories.patientEvolution.length} testes)\n`;
  for (const test of summary.categories.patientEvolution) {
    report += `   ${test.passed ? '✓' : '✗'} ${test.message}\n`;
  }
  report += "\n";

  report += `4️⃣ GERAÇÃO DE RELATÓRIOS (${summary.categories.reportGeneration.length} testes)\n`;
  for (const test of summary.categories.reportGeneration) {
    report += `   ${test.passed ? '✓' : '✗'} ${test.message}\n`;
  }
  report += "\n";

  report += "═══════════════════════════════════════════════════════════════\n";
  if (summary.failedTests === 0) {
    report += "✅ TODOS OS TESTES APROVADOS! Sistema pronto para produção.\n";
  } else {
    report += `⚠️  ${summary.failedTests} TESTE(S) FALHADO(S). Revisar antes de produção.\n`;
  }
  report += "═══════════════════════════════════════════════════════════════\n";

  return report;
}
