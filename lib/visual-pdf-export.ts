/**
 * Serviço de Exportação Visual em PDF
 * Exporta página completa com gráficos, formatação e cores
 */

import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Platform, Alert } from 'react-native';

/**
 * Exportar HTML visual como PDF (página completa com gráficos)
 */
export async function exportVisualPDF(
  htmlContent: string,
  filename: string
): Promise<boolean> {
  try {
    // Adicionar estilos CSS para impressão
    const styledHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
            padding: 20px;
          }
          @media print {
            body {
              padding: 0;
            }
          }
          .page-break {
            page-break-after: always;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #f5f5f5;
            font-weight: 600;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          h1, h2, h3 {
            margin: 20px 0 10px 0;
            color: #0a7ea4;
          }
          h1 {
            font-size: 24px;
            border-bottom: 2px solid #0a7ea4;
            padding-bottom: 10px;
          }
          h2 {
            font-size: 18px;
          }
          h3 {
            font-size: 14px;
          }
          .chart-container {
            margin: 30px 0;
            padding: 20px;
            background: #f9f9f9;
            border-radius: 8px;
            border-left: 4px solid #0a7ea4;
          }
          .chart-container svg {
            max-width: 100%;
            height: auto;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
          }
          .stat-card {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #0a7ea4;
          }
          .stat-label {
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
          }
          .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #0a7ea4;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
          .signature-section {
            margin-top: 40px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
          .signature-line {
            border-top: 1px solid #333;
            padding-top: 10px;
            text-align: center;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;

    // Salvar como arquivo HTML
    const fileName = filename.endsWith('.html') ? filename : `${filename}.html`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(filePath, styledHTML, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Compartilhar arquivo
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'text/html',
        dialogTitle: `Exportar Relatório - ${fileName}`,
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
    console.error('Erro ao exportar PDF visual:', error);
    Alert.alert('Erro', 'Não foi possível gerar o relatório. Tente novamente.');
    return false;
  }
}

/**
 * Gerar HTML com gráfico SVG incorporado
 */
export function generateHTMLWithChart(
  title: string,
  chartSVG: string,
  content: string,
  metadata?: {
    date?: string;
    patientName?: string;
    professionalName?: string;
    protocolNumber?: string;
  }
): string {
  return `
    <div class="report-container">
      ${metadata?.date ? `<div style="text-align: right; color: #666; font-size: 12px; margin-bottom: 20px;">Gerado em: ${metadata.date}</div>` : ''}
      
      <h1>${title}</h1>
      
      ${metadata?.patientName ? `<p><strong>Paciente:</strong> ${metadata.patientName}</p>` : ''}
      ${metadata?.professionalName ? `<p><strong>Profissional:</strong> ${metadata.professionalName}</p>` : ''}
      ${metadata?.protocolNumber ? `<p><strong>Protocolo:</strong> ${metadata.protocolNumber}</p>` : ''}
      
      <div class="chart-container">
        ${chartSVG}
      </div>
      
      <div class="content">
        ${content}
      </div>
      
      <div class="footer">
        <p>NeuroLaserMap - Sistema de Mapeamento de Neuromodulação</p>
        <p>Este documento é confidencial e destinado apenas ao paciente e profissionais autorizados.</p>
      </div>
    </div>
  `;
}

/**
 * Gerar HTML com múltiplos gráficos
 */
export function generateHTMLWithMultipleCharts(
  title: string,
  charts: Array<{ title: string; svg: string; description?: string }>,
  metadata?: {
    date?: string;
    patientName?: string;
    professionalName?: string;
    protocolNumber?: string;
  }
): string {
  const chartsHTML = charts
    .map(
      (chart) => `
    <div style="margin-bottom: 40px;">
      <h2>${chart.title}</h2>
      ${chart.description ? `<p style="color: #666; font-size: 14px; margin-bottom: 15px;">${chart.description}</p>` : ''}
      <div class="chart-container">
        ${chart.svg}
      </div>
    </div>
  `
    )
    .join('');

  return `
    <div class="report-container">
      ${metadata?.date ? `<div style="text-align: right; color: #666; font-size: 12px; margin-bottom: 20px;">Gerado em: ${metadata.date}</div>` : ''}
      
      <h1>${title}</h1>
      
      ${metadata?.patientName ? `<p><strong>Paciente:</strong> ${metadata.patientName}</p>` : ''}
      ${metadata?.professionalName ? `<p><strong>Profissional:</strong> ${metadata.professionalName}</p>` : ''}
      ${metadata?.protocolNumber ? `<p><strong>Protocolo:</strong> ${metadata.protocolNumber}</p>` : ''}
      
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
      
      ${chartsHTML}
      
      <div class="footer">
        <p>NeuroLaserMap - Sistema de Mapeamento de Neuromodulação</p>
        <p>Este documento é confidencial e destinado apenas ao paciente e profissionais autorizados.</p>
      </div>
    </div>
  `;
}
