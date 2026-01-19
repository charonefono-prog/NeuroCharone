/**
 * Serviço de Feedback Pós-Ciclo
 * Gerencia avaliações de pacientes sobre o impacto do tratamento
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CycleFeedback {
  id: string;
  cycleId: string;
  patientId: string;
  createdAt: string;
  
  // Avaliação de Sintomas (1-10)
  symptomReduction: number; // Redução de sintomas
  painLevel: number; // Nível de dor
  energyLevel: number; // Nível de energia
  sleepQuality: number; // Qualidade do sono
  moodImprovement: number; // Melhora do humor
  
  // Satisfação Geral (1-10)
  overallSatisfaction: number;
  recommendToOthers: boolean;
  
  // Observações
  positiveEffects: string; // Efeitos positivos observados
  sideEffects: string; // Efeitos colaterais (se houver)
  additionalNotes: string; // Notas adicionais
  
  // Comparação com ciclo anterior
  comparedToPreviousCycle: 'better' | 'same' | 'worse' | 'first_cycle';
  
  // Disposição para continuar
  willingToContinue: boolean;
  suggestedChanges: string;
}

export interface FeedbackAnalysis {
  cycleId: string;
  averageSymptomReduction: number;
  averagePainLevel: number;
  averageEnergyLevel: number;
  averageSleepQuality: number;
  averageMoodImprovement: number;
  averageSatisfaction: number;
  recommendationRate: number; // Percentual que recomendaria
  totalFeedbacks: number;
  commonPositiveEffects: string[];
  commonSideEffects: string[];
}

const FEEDBACK_STORAGE_KEY = '@neurolasermap_cycle_feedbacks';

/**
 * Salvar feedback de ciclo
 */
export async function saveCycleFeedback(feedback: CycleFeedback): Promise<void> {
  try {
    const feedbacks = await getCycleFeedbacks();
    feedbacks.push(feedback);
    await AsyncStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedbacks));
  } catch (error) {
    console.error('Erro ao salvar feedback:', error);
    throw error;
  }
}

/**
 * Obter todos os feedbacks
 */
export async function getCycleFeedbacks(): Promise<CycleFeedback[]> {
  try {
    const data = await AsyncStorage.getItem(FEEDBACK_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao obter feedbacks:', error);
    return [];
  }
}

/**
 * Obter feedbacks de um ciclo específico
 */
export async function getCycleFeedbacksById(cycleId: string): Promise<CycleFeedback[]> {
  try {
    const feedbacks = await getCycleFeedbacks();
    return feedbacks.filter(f => f.cycleId === cycleId);
  } catch (error) {
    console.error('Erro ao obter feedbacks do ciclo:', error);
    return [];
  }
}

/**
 * Obter feedbacks de um paciente
 */
export async function getPatientFeedbacks(patientId: string): Promise<CycleFeedback[]> {
  try {
    const feedbacks = await getCycleFeedbacks();
    return feedbacks.filter(f => f.patientId === patientId);
  } catch (error) {
    console.error('Erro ao obter feedbacks do paciente:', error);
    return [];
  }
}

/**
 * Analisar feedbacks de um ciclo
 */
export async function analyzeCycleFeedback(cycleId: string): Promise<FeedbackAnalysis> {
  try {
    const feedbacks = await getCycleFeedbacksById(cycleId);

    if (feedbacks.length === 0) {
      return {
        cycleId,
        averageSymptomReduction: 0,
        averagePainLevel: 0,
        averageEnergyLevel: 0,
        averageSleepQuality: 0,
        averageMoodImprovement: 0,
        averageSatisfaction: 0,
        recommendationRate: 0,
        totalFeedbacks: 0,
        commonPositiveEffects: [],
        commonSideEffects: [],
      };
    }

    const avg = (values: number[]) => values.reduce((a, b) => a + b, 0) / values.length;

    // Extrair efeitos comuns
    const allPositiveEffects = feedbacks
      .flatMap(f => f.positiveEffects.split(',').map(e => e.trim()))
      .filter(e => e.length > 0);
    
    const allSideEffects = feedbacks
      .flatMap(f => f.sideEffects.split(',').map(e => e.trim()))
      .filter(e => e.length > 0);

    const getTopItems = (items: string[], limit: number = 3): string[] => {
      const counts = new Map<string, number>();
      items.forEach(item => {
        counts.set(item, (counts.get(item) || 0) + 1);
      });
      return Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([item]) => item);
    };

    return {
      cycleId,
      averageSymptomReduction: avg(feedbacks.map(f => f.symptomReduction)),
      averagePainLevel: avg(feedbacks.map(f => f.painLevel)),
      averageEnergyLevel: avg(feedbacks.map(f => f.energyLevel)),
      averageSleepQuality: avg(feedbacks.map(f => f.sleepQuality)),
      averageMoodImprovement: avg(feedbacks.map(f => f.moodImprovement)),
      averageSatisfaction: avg(feedbacks.map(f => f.overallSatisfaction)),
      recommendationRate: (feedbacks.filter(f => f.recommendToOthers).length / feedbacks.length) * 100,
      totalFeedbacks: feedbacks.length,
      commonPositiveEffects: getTopItems(allPositiveEffects),
      commonSideEffects: getTopItems(allSideEffects),
    };
  } catch (error) {
    console.error('Erro ao analisar feedback:', error);
    throw error;
  }
}

/**
 * Deletar feedback
 */
export async function deleteCycleFeedback(feedbackId: string): Promise<void> {
  try {
    const feedbacks = await getCycleFeedbacks();
    const filtered = feedbacks.filter(f => f.id !== feedbackId);
    await AsyncStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Erro ao deletar feedback:', error);
    throw error;
  }
}

/**
 * Gerar resumo de feedback para relatório
 */
export function generateFeedbackSummary(analysis: FeedbackAnalysis): string {
  return `
Resumo de Feedback do Ciclo:
- Total de Avaliações: ${analysis.totalFeedbacks}
- Redução de Sintomas: ${analysis.averageSymptomReduction.toFixed(1)}/10
- Nível de Dor: ${analysis.averagePainLevel.toFixed(1)}/10
- Nível de Energia: ${analysis.averageEnergyLevel.toFixed(1)}/10
- Qualidade do Sono: ${analysis.averageSleepQuality.toFixed(1)}/10
- Melhora do Humor: ${analysis.averageMoodImprovement.toFixed(1)}/10
- Satisfação Geral: ${analysis.averageSatisfaction.toFixed(1)}/10
- Taxa de Recomendação: ${analysis.recommendationRate.toFixed(1)}%
- Efeitos Positivos Comuns: ${analysis.commonPositiveEffects.join(', ') || 'Nenhum relatado'}
- Efeitos Colaterais Comuns: ${analysis.commonSideEffects.join(', ') || 'Nenhum relatado'}
  `;
}
