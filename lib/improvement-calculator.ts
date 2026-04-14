/**
 * Módulo centralizado para cálculos de melhora em escalas clínicas.
 * 
 * REGRA FUNDAMENTAL:
 * - Escalas INVERSAS (score alto = pior): melhora = score DIMINUI
 * - Escalas DIRETAS (score alto = melhor): melhora = score AUMENTA
 * 
 * CLASSIFICAÇÃO DEFINITIVA (23 escalas):
 * 
 * INVERSAS (18 escalas) - score alto = pior:
 *   eat10, grbasi, phq9, phq44, mdq, conners, vanderbilt, oddrs,
 *   snapiv, mdsupdrs, amisos, dsfs, stopbang, sara, pdq39, saliva,
 *   btss, hb
 * 
 * DIRETAS (5 escalas) - score alto = melhor:
 *   doss, bdae, cm, qcs, fois
 * 
 * TODOS os cálculos de melhora DEVEM usar estas funções.
 * Nunca calcular melhora diretamente nos componentes.
 */

import type { ScaleType } from "./clinical-scales";

/**
 * Lista COMPLETA de escalas inversas onde score ALTO = pior sintoma.
 * Para estas escalas, quando o score DIMINUI, o paciente MELHOROU.
 * 
 * VERIFICAÇÃO CLÍNICA:
 * - EAT-10: 0=sem risco disfagia, 40=risco severo → INVERSA
 * - GRBASI: 0%=voz normal, 100%=alteração severa → INVERSA
 * - PHQ-9: 0=sem depressão, 27=severa → INVERSA
 * - PHQ-44: 0=sem depressão, alto=severa → INVERSA
 * - MDQ: 0=baixo risco bipolar, 13=alto risco → INVERSA
 * - CONNERS: 0=sem TDAH, 30=severo → INVERSA
 * - VANDERBILT: 0=sem TDAH, 24=severo → INVERSA
 * - ODDRS: 0=sem sintomas, 24=severos → INVERSA
 * - SNAP-IV: 0%=sem TDAH, 100%=severo → INVERSA
 * - MDS-UPDRS: 0=muito leve, 260=muito severa → INVERSA
 * - A-MISO-S: 0%=sem misofonia, 100%=severa → INVERSA
 * - DSFS: 0=salivação normal, alto=severa → INVERSA
 * - STOP-Bang: 0=baixo risco apneia, 8=alto risco → INVERSA
 * - SARA: 0=sem ataxia, 40=severa → INVERSA
 * - PDQ-39: 0%=QV excelente, 100%=prejudicada → INVERSA
 * - SALIVA: 0=normal, 16=severa → INVERSA
 * - BTSS: 0=sem zumbido, 24=severo → INVERSA
 * - HB: 1=normal, 6=paralisia total → INVERSA
 */
export const INVERSE_SCALES: ScaleType[] = [
  "eat10",
  "grbasi",
  "phq9",
  "phq44",
  "mdq",
  "conners",
  "vanderbilt",
  "oddrs",
  "snapiv",
  "mdsupdrs",
  "amisos",
  "dsfs",
  "stopbang",
  "sara",
  "pdq39",
  "saliva",
  "btss",
  "hb",
];

/**
 * Lista COMPLETA de escalas diretas onde score ALTO = melhor.
 * Para estas escalas, quando o score AUMENTA, o paciente MELHOROU.
 * 
 * VERIFICAÇÃO CLÍNICA:
 * - DOSS: 1=disfagia severa, 7=função normal → DIRETA
 * - BDAE: 0=afasia severa, 25=sem afasia → DIRETA
 * - CM: 0%=comunicação mínima, 100%=excelente → DIRETA
 * - QCS: 0%=severamente prejudicada, 100%=excelente → DIRETA
 * - FOIS: 1=nenhuma ingestão oral, 7=total sem restrições → DIRETA
 */
export const DIRECT_SCALES: ScaleType[] = [
  "doss",
  "bdae",
  "cm",
  "qcs",
  "fois",
];

/**
 * Verifica se uma escala é inversa (score alto = pior).
 */
export function isInverseScale(scaleType: string): boolean {
  return INVERSE_SCALES.includes(scaleType.toLowerCase() as ScaleType);
}

/**
 * Verifica se uma escala é direta (score alto = melhor).
 */
export function isDirectScale(scaleType: string): boolean {
  return DIRECT_SCALES.includes(scaleType.toLowerCase() as ScaleType);
}

/**
 * Calcula a melhora absoluta entre dois scores.
 * Retorna valor POSITIVO se houve melhora, 0 se não houve.
 */
export function calculateAbsoluteImprovement(
  scaleType: string,
  firstScore: number,
  lastScore: number
): number {
  const inverse = isInverseScale(scaleType);
  
  if (inverse) {
    // Escala inversa: melhora quando score DIMINUI
    const improvement = firstScore - lastScore;
    return Math.max(0, improvement);
  } else {
    // Escala direta: melhora quando score AUMENTA
    const improvement = lastScore - firstScore;
    return Math.max(0, improvement);
  }
}

/**
 * Calcula a porcentagem de melhora entre dois scores.
 * Retorna valor POSITIVO se houve melhora, 0 se não houve.
 * NUNCA retorna valores negativos.
 * 
 * Exemplos corretos:
 * - EAT-10 (inversa): 38→0 = 100% de melhora
 * - EAT-10 (inversa): 38→19 = 50% de melhora
 * - EAT-10 (inversa): 0→38 = 0% (piorou, não melhorou)
 * - DOSS (direta): 1→7 = 600% de melhora
 * - DOSS (direta): 3→6 = 100% de melhora
 * - DOSS (direta): 7→1 = 0% (piorou)
 */
export function calculateImprovementPercentage(
  scaleType: string,
  firstScore: number,
  lastScore: number
): number {
  if (firstScore === 0 && lastScore === 0) return 0;
  
  const inverse = isInverseScale(scaleType);
  
  if (inverse) {
    // Escala inversa: melhora quando score DIMINUI
    if (firstScore === 0) return 0; // Já estava no melhor possível
    const improvement = ((firstScore - lastScore) / firstScore) * 100;
    return Math.max(0, Math.round(improvement * 10) / 10);
  } else {
    // Escala direta: melhora quando score AUMENTA
    if (firstScore === 0) {
      return lastScore > 0 ? 100 : 0;
    }
    const improvement = ((lastScore - firstScore) / firstScore) * 100;
    return Math.max(0, Math.round(improvement * 10) / 10);
  }
}

/**
 * Calcula a variação entre dois scores, podendo ser positiva ou negativa.
 * Positivo = melhora, Negativo = piora.
 * 
 * Para escalas INVERSAS: variação = antes - depois (diminuir é bom)
 * Para escalas DIRETAS: variação = depois - antes (aumentar é bom)
 */
export function calculateVariation(
  scaleType: string,
  firstScore: number,
  lastScore: number
): number {
  const inverse = isInverseScale(scaleType);
  
  if (inverse) {
    return firstScore - lastScore; // Positivo se diminuiu (melhorou)
  } else {
    return lastScore - firstScore; // Positivo se aumentou (melhorou)
  }
}

/**
 * Calcula a porcentagem de variação (pode ser positiva ou negativa).
 * Positivo = melhora, Negativo = piora.
 */
export function calculateVariationPercentage(
  scaleType: string,
  firstScore: number,
  lastScore: number
): number {
  if (firstScore === 0 && lastScore === 0) return 0;
  if (firstScore === 0) return lastScore > 0 ? (isInverseScale(scaleType) ? -100 : 100) : 0;
  
  const inverse = isInverseScale(scaleType);
  
  if (inverse) {
    return Math.round(((firstScore - lastScore) / firstScore) * 1000) / 10;
  } else {
    return Math.round(((lastScore - firstScore) / firstScore) * 1000) / 10;
  }
}

/**
 * Determina se houve melhora entre dois scores.
 */
export function hasImproved(
  scaleType: string,
  firstScore: number,
  lastScore: number
): boolean {
  const inverse = isInverseScale(scaleType);
  
  if (inverse) {
    return lastScore < firstScore;
  } else {
    return lastScore > firstScore;
  }
}

/**
 * Determina se uma mudança de score representa melhora, piora ou estabilidade.
 */
export function getScoreDirection(
  scaleType: string,
  previousScore: number,
  currentScore: number
): "improvement" | "decline" | "stable" {
  if (currentScore === previousScore) return "stable";
  
  const inverse = isInverseScale(scaleType);
  
  if (inverse) {
    return currentScore < previousScore ? "improvement" : "decline";
  } else {
    return currentScore > previousScore ? "improvement" : "decline";
  }
}

/**
 * Calcula dados completos para exibição de melhora.
 * NUNCA retorna valores negativos em percentageImprovement.
 */
export function calculateDisplayImprovement(
  scaleType: string,
  firstScore: number,
  lastScore: number
): {
  absoluteImprovement: number;
  percentageImprovement: number;
  hasImproved: boolean;
  direction: "improvement" | "decline" | "stable";
  label: string;
} {
  const absImprovement = calculateAbsoluteImprovement(scaleType, firstScore, lastScore);
  const pctImprovement = calculateImprovementPercentage(scaleType, firstScore, lastScore);
  const improved = absImprovement > 0;
  const direction = getScoreDirection(scaleType, firstScore, lastScore);
  
  return {
    absoluteImprovement: absImprovement,
    percentageImprovement: pctImprovement,
    hasImproved: improved,
    direction,
    label: improved 
      ? `${pctImprovement.toFixed(1)}% de melhora`
      : direction === "decline" 
        ? "Piora detectada"
        : "Sem alteração",
  };
}
