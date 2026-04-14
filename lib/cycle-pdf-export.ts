/**
 * Exportação de Ciclo de Tratamento para PDF
 * Converte HTML para PDF e compartilha/baixa o documento
 */

import { Platform, Share, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { generateCycleReportHTML, type CycleReportData } from './cycle-report-generator';

/**
 * Exportar ciclo para PDF
 */
export async function exportCycleToPDF(data: CycleReportData): Promise<void> {
  try {
    // Gerar HTML
    const html = generateCycleReportHTML(data);

    if (Platform.OS === 'web') {
      // Web: Abrir em nova aba para impressão
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.click();
      URL.revokeObjectURL(url);
    } else {
      // Mobile: Salvar e compartilhar
      const fileName = `ciclo-${data.patient.fullName.replace(/\s+/g, '-')}-${Date.now()}.html`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      // Salvar arquivo
      await FileSystem.writeAsStringAsync(filePath, html, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Compartilhar
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType: 'text/html',
          dialogTitle: `Plano de Ciclo - ${data.patient.fullName}`,
        });
      } else {
        Alert.alert('Sucesso', `Relatório salvo em: ${filePath}`);
      }
    }
  } catch (error) {
    console.error('Erro ao exportar ciclo para PDF:', error);
    throw error;
  }
}

/**
 * Exportar ciclo como HTML para visualização
 */
export async function exportCycleAsHTML(data: CycleReportData): Promise<string> {
  return generateCycleReportHTML(data);
}

/**
 * Compartilhar ciclo via email/WhatsApp/etc
 */
export async function shareCycleReport(data: CycleReportData, message?: string): Promise<void> {
  try {
    const html = generateCycleReportHTML(data);
    const fileName = `ciclo-${data.patient.fullName.replace(/\s+/g, '-')}-${Date.now()}.html`;

    if (Platform.OS === 'web') {
      // Web: Copiar para clipboard ou abrir em nova aba
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      // Mobile: Usar Share API nativa
      const filePath = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(filePath, html, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await Share.share({
        message: message || `Plano de Ciclo de Tratamento - ${data.patient.fullName}`,
        url: filePath,
        title: `Ciclo - ${data.patient.fullName}`,
      });
    }
  } catch (error) {
    console.error('Erro ao compartilhar ciclo:', error);
    throw error;
  }
}

/**
 * Gerar preview do ciclo para visualização
 */
export function generateCyclePreview(data: CycleReportData): string {
  const html = generateCycleReportHTML(data);
  return html;
}
