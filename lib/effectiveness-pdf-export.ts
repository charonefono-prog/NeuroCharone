/**
 * Exportador de Relatórios de Efetividade para PDF
 * Converte HTML em PDF para compartilhamento
 */

import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Platform, Alert } from 'react-native';
import type { Session, TherapeuticPlan, Patient } from '@/lib/local-storage';
import { generateEffectivenessReportHTML } from './effectiveness-report-generator';

/**
 * Exportar relatório de efetividade como PDF
 */
export async function exportEffectivenessReportPDF(
  patient: Patient,
  sessions: Session[],
  plans: TherapeuticPlan[]
): Promise<boolean> {
  try {
    // Gerar HTML
    const htmlContent = generateEffectivenessReportHTML(patient, sessions, plans);

    // Salvar como arquivo temporário
    const fileName = `efetividade_${patient.id}_${Date.now()}.html`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(filePath, htmlContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Compartilhar arquivo
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'text/html',
        dialogTitle: `Relatório de Efetividade - ${patient.fullName}`,
        UTI: 'com.apple.webarchive',
      });

      // Limpar arquivo após compartilhamento
      setTimeout(() => {
        FileSystem.deleteAsync(filePath).catch(() => {});
      }, 5000);

      return true;
    } else {
      Alert.alert('Erro', 'Compartilhamento não disponível neste dispositivo');
      return false;
    }
  } catch (error) {
    console.error('Erro ao exportar relatório:', error);
    Alert.alert('Erro', 'Não foi possível gerar o relatório. Tente novamente.');
    return false;
  }
}

/**
 * Gerar URL de visualização do relatório (para web)
 */
export function generateEffectivenessReportURL(
  patient: Patient,
  sessions: Session[],
  plans: TherapeuticPlan[]
): string {
  const htmlContent = generateEffectivenessReportHTML(patient, sessions, plans);
  const blob = new Blob([htmlContent], { type: 'text/html' });
  return URL.createObjectURL(blob);
}

/**
 * Abrir relatório em navegador (web)
 */
export function openEffectivenessReportInBrowser(
  patient: Patient,
  sessions: Session[],
  plans: TherapeuticPlan[]
): void {
  if (Platform.OS === 'web') {
    const url = generateEffectivenessReportURL(patient, sessions, plans);
    window.open(url, '_blank');
  }
}

/**
 * Salvar relatório em arquivo (web)
 */
export function downloadEffectivenessReportHTML(
  patient: Patient,
  sessions: Session[],
  plans: TherapeuticPlan[]
): void {
  if (Platform.OS === 'web') {
    const htmlContent = generateEffectivenessReportHTML(patient, sessions, plans);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `efetividade_${patient.fullName}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Enviar relatório por email (usando mailto)
 */
export function sendEffectivenessReportByEmail(
  patient: Patient,
  sessions: Session[],
  plans: TherapeuticPlan[],
  recipientEmail?: string
): void {
  const htmlContent = generateEffectivenessReportHTML(patient, sessions, plans);
  const subject = `Relatório de Efetividade - ${patient.fullName}`;
  const body = `Segue em anexo o relatório de efetividade do paciente ${patient.fullName}.\n\nData: ${new Date().toLocaleDateString('pt-BR')}`;

  if (Platform.OS === 'web') {
    // Web: usar mailto com link para visualização
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const mailtoLink = `mailto:${recipientEmail || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  } else {
    // Mobile: usar Sharing
    Sharing.shareAsync('', {
      dialogTitle: subject,
      mimeType: 'text/html',
    }).catch(error => {
      console.error('Erro ao compartilhar:', error);
    });
  }
}

/**
 * Copiar relatório para clipboard (web)
 */
export async function copyEffectivenessReportToClipboard(
  patient: Patient,
  sessions: Session[],
  plans: TherapeuticPlan[]
): Promise<boolean> {
  if (Platform.OS !== 'web') {
    return false;
  }

  try {
    const htmlContent = generateEffectivenessReportHTML(patient, sessions, plans);
    await navigator.clipboard.writeText(htmlContent);
    return true;
  } catch (error) {
    console.error('Erro ao copiar para clipboard:', error);
    return false;
  }
}

/**
 * Gerar relatório em formato texto simples
 */
export function generateEffectivenessReportText(
  patient: Patient,
  sessions: Session[],
  plans: TherapeuticPlan[]
): string {
  const lines: string[] = [];

  lines.push('='.repeat(80));
  lines.push('RELATÓRIO DE EFETIVIDADE - NEUROLASERMAP');
  lines.push('='.repeat(80));
  lines.push('');

  // Informações do paciente
  lines.push('INFORMAÇÕES DO PACIENTE');
  lines.push('-'.repeat(80));
  lines.push(`Paciente: ${patient.fullName}`);
  lines.push(`Data do Relatório: ${new Date().toLocaleDateString('pt-BR')}`);
  if (patient.diagnosis) {
    lines.push(`Diagnóstico: ${patient.diagnosis}`);
  }
  lines.push(`Total de Sessões: ${sessions.length}`);
  lines.push('');

  // Métricas gerais
  const completedSessions = sessions.filter(s => new Date(s.sessionDate) < new Date()).length;
  const allScores = sessions.filter(s => s.symptomScore !== undefined).map(s => s.symptomScore || 0);
  const averageScore = allScores.length > 0 ? allScores.reduce((a, b) => a + b) / allScores.length : 0;

  lines.push('RESUMO GERAL');
  lines.push('-'.repeat(80));
  lines.push(`Sessões Realizadas: ${completedSessions}/${sessions.length}`);
  lines.push(`Taxa de Conclusão: ${Math.round((completedSessions / sessions.length) * 100)}%`);
  lines.push(`Score Médio: ${averageScore.toFixed(1)}/10`);
  lines.push(`Planos Ativos: ${plans.filter(p => p.isActive).length}`);
  lines.push('');

  // Análise por protocolo
  if (plans.length > 0) {
    lines.push('ANÁLISE POR PROTOCOLO');
    lines.push('-'.repeat(80));

    plans.forEach(plan => {
      const planSessions = sessions.filter(s => s.planId === plan.id);
      const planCompleted = planSessions.filter(s => new Date(s.sessionDate) < new Date()).length;
      const planScores = planSessions.filter(s => s.symptomScore !== undefined).map(s => s.symptomScore || 0);
      const planAverage = planScores.length > 0 ? planScores.reduce((a, b) => a + b) / planScores.length : 0;

      lines.push(`\nProtocolo: ${plan.objective}`);
      lines.push(`Sessões: ${planCompleted}/${planSessions.length}`);
      lines.push(`Score Médio: ${planAverage.toFixed(1)}`);
      lines.push(`Regiões: ${plan.targetRegions.join(', ')}`);
      lines.push(`Pontos: ${plan.targetPoints.join(', ')}`);
    });
    lines.push('');
  }

  lines.push('='.repeat(80));
  lines.push(`Gerado em: ${new Date().toLocaleString('pt-BR')}`);
  lines.push('='.repeat(80));

  return lines.join('\n');
}
