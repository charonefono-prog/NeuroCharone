/**
 * Sistema de Armazenamento de Respostas de Escalas
 * Gerencia múltiplas aplicações da mesma escala por paciente
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScaleResponse, ScaleType, calculateScaleScore } from "./clinical-scales";

const SCALES_KEY = "clinical_scales_responses";

export interface ScaleHistory {
  patientId: string;
  scaleType: ScaleType;
  responses: ScaleResponse[];
}

/**
 * Salvar resposta de uma escala
 */
export async function saveScaleResponse(response: ScaleResponse): Promise<boolean> {
  try {
    const allResponses = await getAllScaleResponses();
    allResponses.push(response);
    await AsyncStorage.setItem(SCALES_KEY, JSON.stringify(allResponses));
    return true;
  } catch (error) {
    console.error("Erro ao salvar resposta da escala:", error);
    return false;
  }
}

/**
 * Obter todas as respostas de escalas
 */
export async function getAllScaleResponses(): Promise<ScaleResponse[]> {
  try {
    const data = await AsyncStorage.getItem(SCALES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Erro ao obter respostas das escalas:", error);
    return [];
  }
}

/**
 * Obter respostas de um paciente específico
 */
export async function getPatientScaleResponses(patientId: string): Promise<ScaleResponse[]> {
  try {
    const allResponses = await getAllScaleResponses();
    return allResponses.filter(r => r.patientId === patientId);
  } catch (error) {
    console.error("Erro ao obter respostas do paciente:", error);
    return [];
  }
}

/**
 * Obter respostas de uma escala específica para um paciente
 */
export async function getPatientScaleHistory(patientId: string, scaleType: ScaleType): Promise<ScaleResponse[]> {
  try {
    const allResponses = await getAllScaleResponses();
    return allResponses.filter(r => r.patientId === patientId && r.scaleType === scaleType);
  } catch (error) {
    console.error("Erro ao obter histórico da escala:", error);
    return [];
  }
}

/**
 * Deletar uma resposta de escala
 */
export async function deleteScaleResponse(responseId: string): Promise<boolean> {
  try {
    const allResponses = await getAllScaleResponses();
    const filtered = allResponses.filter(r => r.id !== responseId);
    await AsyncStorage.setItem(SCALES_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Erro ao deletar resposta da escala:", error);
    return false;
  }
}

/**
 * Atualizar uma resposta de escala
 */
export async function updateScaleResponse(responseId: string, updates: Partial<ScaleResponse>): Promise<boolean> {
  try {
    const allResponses = await getAllScaleResponses();
    const index = allResponses.findIndex(r => r.id === responseId);
    if (index === -1) return false;
    
    allResponses[index] = { ...allResponses[index], ...updates };
    await AsyncStorage.setItem(SCALES_KEY, JSON.stringify(allResponses));
    return true;
  } catch (error) {
    console.error("Erro ao atualizar resposta da escala:", error);
    return false;
  }
}

/**
 * Obter evolução de um paciente em uma escala específica
 */
export async function getScaleEvolution(patientId: string, scaleType: ScaleType): Promise<ScaleResponse[]> {
  try {
    const history = await getPatientScaleHistory(patientId, scaleType);
    return history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (error) {
    console.error("Erro ao obter evolução da escala:", error);
    return [];
  }
}

/**
 * Calcular melhoria entre duas aplicações da escala
 */
export function calculateImprovement(oldScore: number, newScore: number, scaleType: ScaleType): {
  improvement: number;
  percentage: number;
  direction: "better" | "worse" | "stable";
} {
  const improvement = newScore - oldScore;
  
  // Algumas escalas melhoram com pontuação mais alta, outras com mais baixa
  const improvementScales: ScaleType[] = ["cm", "qcs", "btss"];
  const declineScales: ScaleType[] = ["doss", "bdae", "sara"];
  
  let direction: "better" | "worse" | "stable" = "stable";
  
  if (improvement > 0) {
    direction = improvementScales.includes(scaleType) ? "better" : "worse";
  } else if (improvement < 0) {
    direction = declineScales.includes(scaleType) ? "better" : "worse";
  }
  
  const percentage = oldScore !== 0 ? Math.abs((improvement / oldScore) * 100) : 0;
  
  return {
    improvement: Math.abs(improvement),
    percentage: Math.round(percentage),
    direction,
  };
}

/**
 * Obter estatísticas de uma escala para um paciente
 */
export async function getScaleStatistics(patientId: string, scaleType: ScaleType): Promise<{
  totalApplications: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  latestScore: number;
  trend: "improving" | "declining" | "stable";
}> {
  try {
    const history = await getScaleEvolution(patientId, scaleType);
    
    if (history.length === 0) {
      return {
        totalApplications: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        latestScore: 0,
        trend: "stable",
      };
    }
    
    const scores = history.map(h => h.totalScore);
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);
    const latestScore = scores[scores.length - 1];
    
    // Calcular tendência
    let trend: "improving" | "declining" | "stable" = "stable";
    if (history.length >= 2) {
      const improvementScales: ScaleType[] = ["cm", "qcs", "btss"];
      const lastScore = scores[scores.length - 1];
      const previousScore = scores[scores.length - 2];
      
      if (improvementScales.includes(scaleType)) {
        if (lastScore > previousScore) trend = "improving";
        else if (lastScore < previousScore) trend = "declining";
      } else {
        if (lastScore < previousScore) trend = "improving";
        else if (lastScore > previousScore) trend = "declining";
      }
    }
    
    return {
      totalApplications: history.length,
      averageScore: Math.round(averageScore * 10) / 10,
      highestScore,
      lowestScore,
      latestScore,
      trend,
    };
  } catch (error) {
    console.error("Erro ao obter estatísticas da escala:", error);
    return {
      totalApplications: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      latestScore: 0,
      trend: "stable",
    };
  }
}

/**
 * Exportar dados de escalas para um paciente
 */
export async function exportPatientScalesData(patientId: string): Promise<string> {
  try {
    const responses = await getPatientScaleResponses(patientId);
    return JSON.stringify(responses, null, 2);
  } catch (error) {
    console.error("Erro ao exportar dados de escalas:", error);
    return "{}";
  }
}

/**
 * Limpar todas as respostas de escalas (cuidado!)
 */
export async function clearAllScaleResponses(): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(SCALES_KEY);
    return true;
  } catch (error) {
    console.error("Erro ao limpar respostas das escalas:", error);
    return false;
  }
}
