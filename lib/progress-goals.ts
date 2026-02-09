/**
 * Sistema de Metas de Progresso por Protocolo
 * Gerencia metas de melhora esperada e alertas de progresso
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TherapeuticPlan, Session } from './local-storage';

export interface ProgressGoal {
  id: string;
  planId: string;
  targetImprovement: number; // Percentual esperado de melhora (0-100)
  initialSymptomScore: number; // Score inicial do paciente
  targetSymptomScore: number; // Score alvo esperado
  startDate: string;
  targetDate: string;
  status: 'on-track' | 'at-risk' | 'achieved' | 'missed';
  alertsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressAlert {
  id: string;
  goalId: string;
  type: 'milestone' | 'at-risk' | 'achieved' | 'missed';
  message: string;
  currentProgress: number;
  createdAt: string;
  read: boolean;
}

const GOALS_KEY = '@neuromap:progress_goals';
const ALERTS_KEY = '@neuromap:progress_alerts';

/**
 * Criar nova meta de progresso
 */
export async function createProgressGoal(
  planId: string,
  targetImprovement: number,
  initialSymptomScore: number,
  targetDate: string
): Promise<ProgressGoal> {
  const goal: ProgressGoal = {
    id: `goal_${Date.now()}`,
    planId,
    targetImprovement,
    initialSymptomScore,
    targetSymptomScore: Math.max(0, initialSymptomScore - (initialSymptomScore * targetImprovement) / 100),
    startDate: new Date().toISOString(),
    targetDate,
    status: 'on-track',
    alertsEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const goals = await getProgressGoals();
  goals.push(goal);
  await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(goals));

  return goal;
}

/**
 * Obter todas as metas de progresso
 */
export async function getProgressGoals(): Promise<ProgressGoal[]> {
  try {
    const data = await AsyncStorage.getItem(GOALS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao obter metas:', error);
    return [];
  }
}

/**
 * Obter metas por plano
 */
export async function getGoalsByPlan(planId: string): Promise<ProgressGoal[]> {
  const goals = await getProgressGoals();
  return goals.filter(g => g.planId === planId);
}

/**
 * Atualizar status da meta baseado no progresso atual
 */
export async function updateGoalStatus(
  goalId: string,
  currentSymptomScore: number,
  sessions: Session[]
): Promise<ProgressGoal | null> {
  const goals = await getProgressGoals();
  const goal = goals.find(g => g.id === goalId);

  if (!goal) return null;

  const now = new Date();
  const targetDate = new Date(goal.targetDate);
  const daysRemaining = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const totalDays = Math.ceil((new Date(goal.targetDate).getTime() - new Date(goal.startDate).getTime()) / (1000 * 60 * 60 * 24));
  const progressPercentage = ((totalDays - daysRemaining) / totalDays) * 100;

  // Calcular progresso esperado vs. real
  const expectedScore = goal.initialSymptomScore - (goal.initialSymptomScore - goal.targetSymptomScore) * (progressPercentage / 100);
  const actualProgress = ((goal.initialSymptomScore - currentSymptomScore) / (goal.initialSymptomScore - goal.targetSymptomScore)) * 100;

  // Determinar status
  let status: ProgressGoal['status'] = 'on-track';
  if (currentSymptomScore <= goal.targetSymptomScore) {
    status = 'achieved';
  } else if (actualProgress < progressPercentage - 10) {
    status = 'at-risk';
  }

  // Atualizar meta
  const updatedGoal: ProgressGoal = {
    ...goal,
    status,
    updatedAt: new Date().toISOString(),
  };

  const updatedGoals = goals.map(g => (g.id === goalId ? updatedGoal : g));
  await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(updatedGoals));

  // Criar alerta se necessário
  if (status === 'achieved' && goal.status !== 'achieved') {
    await createProgressAlert(goalId, 'achieved', `🎉 Meta alcançada! Score reduzido para ${currentSymptomScore.toFixed(1)}`, actualProgress);
  } else if (status === 'at-risk' && goal.status !== 'at-risk') {
    await createProgressAlert(goalId, 'at-risk', `⚠️ Meta em risco! Progresso abaixo do esperado.`, actualProgress);
  }

  return updatedGoal;
}

/**
 * Criar alerta de progresso
 */
export async function createProgressAlert(
  goalId: string,
  type: ProgressAlert['type'],
  message: string,
  currentProgress: number
): Promise<ProgressAlert> {
  const alert: ProgressAlert = {
    id: `alert_${Date.now()}`,
    goalId,
    type,
    message,
    currentProgress,
    createdAt: new Date().toISOString(),
    read: false,
  };

  const alerts = await getProgressAlerts();
  alerts.push(alert);
  await AsyncStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));

  return alert;
}

/**
 * Obter todos os alertas de progresso
 */
export async function getProgressAlerts(): Promise<ProgressAlert[]> {
  try {
    const data = await AsyncStorage.getItem(ALERTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao obter alertas:', error);
    return [];
  }
}

/**
 * Obter alertas não lidos
 */
export async function getUnreadProgressAlerts(): Promise<ProgressAlert[]> {
  const alerts = await getProgressAlerts();
  return alerts.filter(a => !a.read);
}

/**
 * Marcar alerta como lido
 */
export async function markAlertAsRead(alertId: string): Promise<void> {
  const alerts = await getProgressAlerts();
  const updatedAlerts = alerts.map(a => (a.id === alertId ? { ...a, read: true } : a));
  await AsyncStorage.setItem(ALERTS_KEY, JSON.stringify(updatedAlerts));
}

/**
 * Calcular progresso atual em relação à meta
 */
export function calculateProgress(
  initialScore: number,
  currentScore: number,
  targetScore: number
): number {
  const totalRange = initialScore - targetScore;
  if (totalRange === 0) return 100;

  const currentProgress = initialScore - currentScore;
  return Math.min(100, Math.max(0, (currentProgress / totalRange) * 100));
}

/**
 * Calcular dias restantes para atingir meta
 */
export function calculateDaysRemaining(targetDate: string): number {
  const target = new Date(targetDate);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Gerar recomendações baseadas no progresso
 */
export function generateRecommendations(
  goal: ProgressGoal,
  currentScore: number,
  sessions: Session[]
): string[] {
  const recommendations: string[] = [];
  const progress = calculateProgress(goal.initialSymptomScore, currentScore, goal.targetSymptomScore);
  const daysRemaining = calculateDaysRemaining(goal.targetDate);
  const sessionsPerDay = sessions.length / Math.max(1, Math.ceil((new Date().getTime() - new Date(goal.startDate).getTime()) / (1000 * 60 * 60 * 24)));

  if (progress < 25 && daysRemaining > 30) {
    recommendations.push('Aumentar frequência de sessões para acelerar progresso');
  }

  if (progress > 75 && daysRemaining > 14) {
    recommendations.push('Meta pode ser alcançada antes do prazo. Considere aumentar intensidade');
  }

  if (progress < 50 && daysRemaining < 14) {
    recommendations.push('Intensificar tratamento. Tempo limitado para atingir meta');
  }

  if (sessionsPerDay < 0.5) {
    recommendations.push('Aumentar consistência. Mínimo recomendado: 3-4 sessões por semana');
  }

  if (progress >= 90) {
    recommendations.push('Excelente progresso! Mantenha a consistência');
  }

  return recommendations;
}

/**
 * Deletar meta de progresso
 */
export async function deleteProgressGoal(goalId: string): Promise<void> {
  const goals = await getProgressGoals();
  const filtered = goals.filter(g => g.id !== goalId);
  await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(filtered));

  // Deletar alertas relacionados
  const alerts = await getProgressAlerts();
  const filteredAlerts = alerts.filter(a => a.goalId !== goalId);
  await AsyncStorage.setItem(ALERTS_KEY, JSON.stringify(filteredAlerts));
}
