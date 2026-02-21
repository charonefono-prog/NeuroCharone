/**
 * Exportador de Escalas em PDF com Gráficos
 * Integra scale-pdf-generator com pdf-with-charts para gerar PDFs visuais
 */

import { ScaleResponse } from './clinical-scales';
import { generateScalePDFHTML } from './scale-pdf-generator';
import {
  generateBarChartSVG,
  generateLineChartSVG,
  generateReportWithChart,
  exportHTMLToPDF,
} from './pdf-with-charts';

interface ProfessionalInfo {
  title: "Dr" | "Dra";
  firstName: string;
  lastName: string;
  registrationNumber: string;
  councilNumber?: string;
  specialty: string;
  email?: string;
  phone?: string;
  electronicSignature?: string;
}

interface PatientInfo {
  id: string;
  fullName: string;
  dateOfBirth?: string;
  diagnosis?: string;
  phone?: string;
}

/**
 * Exportar escala como PDF visual com gráfico
 */
export async function exportScaleAsPDFWithChart(
  scaleResponse: ScaleResponse,
  professional: ProfessionalInfo,
  patient: PatientInfo,
  scaleHistory?: ScaleResponse[]
): Promise<boolean> {
  try {
    // Gerar HTML base
    const baseHTML = generateScalePDFHTML(scaleResponse, professional, patient);

    // Gerar gráfico baseado no tipo de escala
    let chartSVG = '';

    if (scaleHistory && scaleHistory.length > 1) {
      // Se houver histórico, gerar gráfico de evolução
      const labels = scaleHistory.map((_, i) => `Sessão ${i + 1}`);
      const data = scaleHistory.map((s) => s.totalScore);
      chartSVG = generateLineChartSVG(labels, data, 'Evolução da Escala', 500, 300);
    } else {
      // Gráfico simples com score atual
      const labels = ['Score Atual'];
      const data = [scaleResponse.totalScore];
      chartSVG = generateBarChartSVG(labels, data, scaleResponse.scaleName, 400, 250);
    }

    // Gerar HTML completo com gráfico
    const htmlContent = generateReportWithChart(
      scaleResponse.scaleName,
      chartSVG,
      `
        <h2>Resultado da Avaliação</h2>
        <p><strong>Score Total:</strong> ${scaleResponse.totalScore}</p>
        <p><strong>Interpretação:</strong> ${scaleResponse.interpretation}</p>
        ${scaleResponse.notes ? `<p><strong>Observações:</strong> ${scaleResponse.notes}</p>` : ''}
      `,
      {
        date: new Date(scaleResponse.date).toLocaleDateString('pt-BR'),
        patientName: patient.fullName,
        professionalName: `${professional.title} ${professional.firstName} ${professional.lastName}`,
        councilNumber: professional.councilNumber,
      }
    );

    // Exportar como PDF
    const filename = `Escala_${scaleResponse.scaleName.replace(/\s+/g, '_')}_${Date.now()}`;
    return await exportHTMLToPDF(htmlContent, filename, { orientation: 'portrait' });
  } catch (error) {
    console.error('Erro ao exportar escala como PDF:', error);
    return false;
  }
}

/**
 * Exportar múltiplas escalas como PDF com gráficos comparativos
 */
export async function exportMultipleScalesAsPDFWithCharts(
  scaleResponses: ScaleResponse[],
  professional: ProfessionalInfo,
  patient: PatientInfo
): Promise<boolean> {
  try {
    if (scaleResponses.length === 0) return false;

    // Gerar gráfico comparativo
    const labels = scaleResponses.map((s) => s.scaleName.substring(0, 15));
    const data = scaleResponses.map((s) => s.totalScore);
    const chartSVG = generateBarChartSVG(labels, data, 'Comparação de Escalas', 600, 350);

    // Gerar conteúdo das escalas
    let scalesContent = '<h2>Resultados das Avaliações</h2>';
    scalesContent += '<table>';
    scalesContent += '<tr><th>Escala</th><th>Score</th><th>Interpretação</th></tr>';

    scaleResponses.forEach((scale) => {
      scalesContent += `
        <tr>
          <td>${scale.scaleName}</td>
          <td>${scale.totalScore}</td>
          <td>${scale.interpretation}</td>
        </tr>
      `;
    });

    scalesContent += '</table>';

    // Gerar HTML completo
    const htmlContent = generateReportWithChart(
      'Relatório Comparativo de Escalas',
      chartSVG,
      scalesContent,
      {
        date: new Date().toLocaleDateString('pt-BR'),
        patientName: patient.fullName,
        professionalName: `${professional.title} ${professional.firstName} ${professional.lastName}`,
        councilNumber: professional.councilNumber,
      }
    );

    // Exportar como PDF
    const filename = `Escalas_Comparativo_${Date.now()}`;
    return await exportHTMLToPDF(htmlContent, filename, { orientation: 'landscape' });
  } catch (error) {
    console.error('Erro ao exportar escalas comparativas como PDF:', error);
    return false;
  }
}
