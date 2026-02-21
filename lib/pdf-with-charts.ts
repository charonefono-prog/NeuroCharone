/**
 * Serviço de Exportação PDF com Gráficos
 * Gera PDFs visuais com Chart.js e jsPDF (compatível com React Native)
 */

import jsPDF from 'jspdf';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Platform, Alert } from 'react-native';

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
  const maxValue = Math.max(...data, 100);
  const barWidth = width / (labels.length * 2);
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .chart-title { font-size: 16px; font-weight: bold; fill: #0a7ea4; }
      .chart-label { font-size: 12px; fill: #333; }
      .chart-value { font-size: 11px; fill: #666; font-weight: bold; }
    </style>
    <text x="${width / 2}" y="25" text-anchor="middle" class="chart-title">${title}</text>`;

  // Desenhar eixos
  svg += `<line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#333" stroke-width="2"/>`;
  svg += `<line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#333" stroke-width="2"/>`;

  // Desenhar barras
  data.forEach((value, index) => {
    const x = padding + (index * chartWidth) / labels.length + barWidth / 2;
    const barHeight = (value / maxValue) * chartHeight;
    const y = height - padding - barHeight;

    svg += `<rect x="${x - barWidth / 2}" y="${y}" width="${barWidth}" height="${barHeight}" fill="#0a7ea4" opacity="0.8"/>`;
    svg += `<text x="${x}" y="${height - padding + 20}" text-anchor="middle" class="chart-label">${labels[index]}</text>`;
    svg += `<text x="${x}" y="${y - 5}" text-anchor="middle" class="chart-value">${value.toFixed(1)}</text>`;
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
  const maxValue = Math.max(...data, 100);
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .chart-title { font-size: 16px; font-weight: bold; fill: #0a7ea4; }
      .chart-label { font-size: 12px; fill: #333; }
      .chart-value { font-size: 11px; fill: #666; font-weight: bold; }
    </style>
    <text x="${width / 2}" y="25" text-anchor="middle" class="chart-title">${title}</text>`;

  // Desenhar eixos
  svg += `<line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#333" stroke-width="2"/>`;
  svg += `<line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#333" stroke-width="2"/>`;

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
    svg += `<circle cx="${x}" cy="${y}" r="4" fill="#0a7ea4"/>`;
    svg += `<text x="${x}" y="${height - padding + 20}" text-anchor="middle" class="chart-label">${labels[index]}</text>`;
    svg += `<text x="${x}" y="${y - 10}" text-anchor="middle" class="chart-value">${value.toFixed(1)}</text>`;
  });

  svg += '</svg>';
  return svg;
}

/**
 * Gerar gráfico de pizza em SVG
 */
export function generatePieChartSVG(
  labels: string[],
  data: number[],
  title: string,
  width: number = 300,
  height: number = 300
): string {
  const total = data.reduce((a, b) => a + b, 0);
  const colors = ['#0a7ea4', '#00b4d8', '#0096c7', '#0077b6', '#03045e'];
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) / 3;

  let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .chart-title { font-size: 16px; font-weight: bold; fill: #0a7ea4; }
      .chart-label { font-size: 11px; fill: #333; }
    </style>
    <text x="${width / 2}" y="20" text-anchor="middle" class="chart-title">${title}</text>`;

  let currentAngle = -Math.PI / 2;

  data.forEach((value, index) => {
    const sliceAngle = (value / total) * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;

    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);

    const largeArc = sliceAngle > Math.PI ? 1 : 0;
    const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    svg += `<path d="${pathData}" fill="${colors[index % colors.length]}" opacity="0.8" stroke="white" stroke-width="2"/>`;

    // Label
    const labelAngle = startAngle + sliceAngle / 2;
    const labelRadius = radius * 0.7;
    const labelX = cx + labelRadius * Math.cos(labelAngle);
    const labelY = cy + labelRadius * Math.sin(labelAngle);
    const percentage = ((value / total) * 100).toFixed(1);

    svg += `<text x="${labelX}" y="${labelY}" text-anchor="middle" class="chart-label" fill="white" font-weight="bold">${percentage}%</text>`;

    currentAngle = endAngle;
  });

  // Legenda
  let legendY = height - 60;
  data.forEach((value, index) => {
    svg += `<rect x="20" y="${legendY + index * 15}" width="12" height="12" fill="${colors[index % colors.length]}" opacity="0.8"/>`;
    svg += `<text x="40" y="${legendY + index * 15 + 10}" class="chart-label">${labels[index]}: ${value}</text>`;
  });

  svg += '</svg>';
  return svg;
}

/**
 * Exportar HTML como PDF usando jsPDF com SVG
 */
export async function exportHTMLToPDF(
  htmlContent: string,
  filename: string,
  options?: {
    title?: string;
    orientation?: 'portrait' | 'landscape';
  }
): Promise<boolean> {
  try {
    const pdf = new jsPDF({
      orientation: options?.orientation || 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Converter HTML para PDF usando jsPDF
    // Nota: jsPDF tem suporte limitado a HTML, então usamos uma abordagem simplificada
    pdf.html(htmlContent, {
      callback: async (doc) => {
        try {
          // Salvar arquivo
          const pdfData = doc.output('arraybuffer');
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
          } else {
            Alert.alert('Erro', 'Compartilhamento não disponível neste dispositivo');
          }
        } catch (error) {
          console.error('Erro ao salvar PDF:', error);
          Alert.alert('Erro', 'Não foi possível salvar o relatório.');
        }
      },
      margin: [10, 10, 10, 10],
      width: options?.orientation === 'landscape' ? 297 : 210,
    });

    return true;
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    Alert.alert('Erro', 'Não foi possível gerar o relatório. Tente novamente.');
    return false;
  }
}

/**
 * Gerar HTML com gráfico SVG incorporado
 */
export function generateReportWithChart(
  title: string,
  chartSVG: string,
  content: string,
  metadata?: {
    date?: string;
    patientName?: string;
    professionalName?: string;
    councilNumber?: string;
  }
): string {
  const today = new Date().toLocaleDateString('pt-BR');

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
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
        .container {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          padding: 30px;
        }
        .header {
          border-bottom: 3px solid #0a7ea4;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #0a7ea4;
          font-size: 28px;
          margin-bottom: 10px;
        }
        .metadata {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 20px;
          font-size: 14px;
        }
        .metadata-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .metadata-label {
          font-weight: bold;
          color: #666;
        }
        .metadata-value {
          color: #333;
        }
        .chart-section {
          margin: 30px 0;
          padding: 20px;
          background: #f9f9f9;
          border-radius: 8px;
          border-left: 4px solid #0a7ea4;
        }
        .chart-section h2 {
          color: #0a7ea4;
          margin-bottom: 15px;
          font-size: 18px;
        }
        .chart-container {
          display: flex;
          justify-content: center;
          margin: 20px 0;
        }
        .chart-container svg {
          max-width: 100%;
          height: auto;
        }
        .content-section {
          margin: 30px 0;
        }
        .content-section h2 {
          color: #0a7ea4;
          margin-bottom: 15px;
          font-size: 18px;
        }
        .content-section p {
          margin-bottom: 10px;
          line-height: 1.8;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: #f5f5f5;
          font-weight: 600;
          color: #333;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${title}</h1>
          <p style="color: #666; margin-top: 5px;">Relatório Profissional</p>
        </div>

        ${metadata ? `
          <div class="metadata">
            ${metadata.patientName ? `
              <div class="metadata-item">
                <span class="metadata-label">Paciente:</span>
                <span class="metadata-value">${metadata.patientName}</span>
              </div>
            ` : ''}
            ${metadata.professionalName ? `
              <div class="metadata-item">
                <span class="metadata-label">Profissional:</span>
                <span class="metadata-value">${metadata.professionalName}</span>
              </div>
            ` : ''}
            ${metadata.councilNumber ? `
              <div class="metadata-item">
                <span class="metadata-label">Conselho:</span>
                <span class="metadata-value">${metadata.councilNumber}</span>
              </div>
            ` : ''}
            <div class="metadata-item">
              <span class="metadata-label">Data:</span>
              <span class="metadata-value">${metadata?.date || today}</span>
            </div>
          </div>
        ` : ''}

        <div class="chart-section">
          <h2>Visualização Gráfica</h2>
          <div class="chart-container">
            ${chartSVG}
          </div>
        </div>

        <div class="content-section">
          ${content}
        </div>

        <div class="footer">
          <p>NeuroLaserMap - Sistema de Mapeamento de Neuromodulação</p>
          <p>Gerado em: ${today}</p>
          <p>Este documento é confidencial e destinado apenas ao paciente e profissionais autorizados.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
