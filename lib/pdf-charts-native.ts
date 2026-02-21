/**
 * Serviço de PDF com Gráficos para React Native
 * Usa jsPDF com renderização de SVG para gráficos
 */

import jsPDF from 'jspdf';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

/**
 * Converter SVG para imagem base64
 */
// Função removida - não é necessária em React Native
// export async function svgToBase64(svgString: string): Promise<string> { ... }

/**
 * Gerar gráfico de barras em SVG
 */
export function generateBarChartSVG(
  labels: string[],
  data: number[],
  title: string,
  width: number = 400,
  height: number = 250
): string {
  if (data.length === 0) return '';

  const maxValue = Math.max(...data, 100);
  const barWidth = width / (labels.length * 2.5);
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .chart-title { font-size: 16px; font-weight: bold; fill: #0a7ea4; }
      .chart-label { font-size: 11px; fill: #333; }
      .chart-value { font-size: 10px; fill: #666; font-weight: bold; }
    </style>
    <text x="${width / 2}" y="25" text-anchor="middle" class="chart-title">${title}</text>`;

  // Desenhar eixos
  svg += `<line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#333" stroke-width="1.5"/>`;
  svg += `<line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#333" stroke-width="1.5"/>`;

  // Desenhar barras
  data.forEach((value, index) => {
    const x = padding + (index * chartWidth) / labels.length + barWidth / 2;
    const barHeight = (value / maxValue) * chartHeight;
    const y = height - padding - barHeight;

    svg += `<rect x="${x - barWidth / 2}" y="${y}" width="${barWidth}" height="${barHeight}" fill="#0a7ea4" opacity="0.85"/>`;
    svg += `<text x="${x}" y="${height - padding + 18}" text-anchor="middle" class="chart-label">${labels[index]}</text>`;
    if (barHeight > 30) {
      svg += `<text x="${x}" y="${y - 5}" text-anchor="middle" class="chart-value">${value.toFixed(1)}</text>`;
    }
  });

  svg += '</svg>';
  return svg;
}

/**
 * Gerar gráfico de linha em SVG
 */
export function generateLineChartSVG(
  labels: string[],
  data: number[],
  title: string,
  width: number = 400,
  height: number = 250
): string {
  if (data.length === 0) return '';

  const maxValue = Math.max(...data, 100);
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .chart-title { font-size: 16px; font-weight: bold; fill: #0a7ea4; }
      .chart-label { font-size: 11px; fill: #333; }
      .chart-value { font-size: 10px; fill: #666; font-weight: bold; }
    </style>
    <text x="${width / 2}" y="25" text-anchor="middle" class="chart-title">${title}</text>`;

  // Desenhar eixos
  svg += `<line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#333" stroke-width="1.5"/>`;
  svg += `<line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#333" stroke-width="1.5"/>`;

  // Desenhar linha
  let pathData = '';
  data.forEach((value, index) => {
    const x = padding + (index * chartWidth) / (labels.length - 1 || 1);
    const y = height - padding - (value / maxValue) * chartHeight;
    pathData += `${index === 0 ? 'M' : 'L'} ${x} ${y} `;
  });

  svg += `<path d="${pathData}" stroke="#0a7ea4" stroke-width="2" fill="none"/>`;

  // Desenhar pontos
  data.forEach((value, index) => {
    const x = padding + (index * chartWidth) / (labels.length - 1 || 1);
    const y = height - padding - (value / maxValue) * chartHeight;
    svg += `<circle cx="${x}" cy="${y}" r="3.5" fill="#0a7ea4"/>`;
    svg += `<text x="${x}" y="${height - padding + 18}" text-anchor="middle" class="chart-label">${labels[index]}</text>`;
    if (index % 2 === 0) {
      svg += `<text x="${x}" y="${y - 8}" text-anchor="middle" class="chart-value">${value.toFixed(1)}</text>`;
    }
  });

  svg += '</svg>';
  return svg;
}

/**
 * Criar PDF com gráfico SVG usando jsPDF
 */
export async function createPDFWithChart(
  title: string,
  chartSVG: string,
  content: Array<{ label: string; value: string }>,
  metadata?: {
    date?: string;
    patientName?: string;
    professionalName?: string;
    councilNumber?: string;
  }
): Promise<jsPDF | null> {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 15;

    // Título
    pdf.setFontSize(20);
    pdf.setTextColor(10, 126, 164);
    pdf.text(title, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Metadados
    if (metadata) {
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);

      if (metadata.patientName) {
        pdf.text(`Paciente: ${metadata.patientName}`, 15, yPosition);
        yPosition += 6;
      }
      if (metadata.professionalName) {
        pdf.text(`Profissional: ${metadata.professionalName}`, 15, yPosition);
        yPosition += 6;
      }
      if (metadata.councilNumber) {
        pdf.text(`Conselho: ${metadata.councilNumber}`, 15, yPosition);
        yPosition += 6;
      }
      if (metadata?.date) {
        pdf.text(`Data: ${metadata.date}`, 15, yPosition);
        yPosition += 6;
      }
    }

    yPosition += 5;

    // Gráfico (SVG como imagem)
    if (chartSVG && chartSVG.length > 0) {
      try {
        // Converter SVG para data URL
        const svgData = `data:image/svg+xml;base64,${Buffer.from(chartSVG).toString('base64')}`;
        pdf.addImage(svgData, 'PNG', 15, yPosition, pageWidth - 30, 80);
        yPosition += 85;
      } catch (error) {
        console.error('Erro ao adicionar gráfico:', error);
      }
    }

    // Conteúdo
    pdf.setFontSize(11);
    pdf.setTextColor(51, 51, 51);

    content.forEach((item) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 15;
      }

      pdf.setFont('', 'bold');
      pdf.text(`${item.label}:`, 15, yPosition);
      yPosition += 5;

      pdf.setFont('', 'normal');
      const splitValue = pdf.splitTextToSize(item.value, pageWidth - 30) as string[];
      pdf.text(splitValue, 15, yPosition);
      yPosition += splitValue.length * 5 + 5;
    });

    // Footer
    yPosition = pageHeight - 15;
    pdf.setFontSize(9);
    pdf.setTextColor(150, 150, 150);
    pdf.text('NeuroLaserMap - Sistema de Mapeamento de Neuromodulação', pageWidth / 2, yPosition, {
      align: 'center',
    } as any);

    return pdf;
  } catch (error) {
    console.error('Erro ao criar PDF:', error);
    return null;
  }
}

/**
 * Exportar PDF para arquivo
 */
export async function exportPDFToFile(
  pdf: jsPDF,
  filename: string
): Promise<boolean> {
  try {
    const pdfData = pdf.output('arraybuffer');
    const fileName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(
      filePath,
      Buffer.from(pdfData).toString('base64'),
      { encoding: FileSystem.EncodingType.Base64 }
    );

    // Compartilhar
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'application/pdf',
        dialogTitle: `Exportar Relatório - ${fileName}`,
      });

      setTimeout(() => {
        FileSystem.deleteAsync(filePath).catch(() => {});
      }, 5000);

      return true;
    } else {
      Alert.alert('Erro', 'Compartilhamento não disponível neste dispositivo');
      return false;
    }
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    Alert.alert('Erro', 'Não foi possível exportar o relatório.');
    return false;
  }
}
