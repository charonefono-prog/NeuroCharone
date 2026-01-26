/**
 * Gerador de Relatório de Efetividade em PDF
 * Cria relatórios completos com histórico de escalas, gráficos e evolução
 */

import { Share } from "react-native";
import { ScaleResponse } from "./clinical-scales";
import { Patient } from "./local-storage";
import { ProfessionalInfo } from "@/hooks/use-professional-info";

/**
 * Gera HTML para o relatório de efetividade
 */
export function generateEffectivenessReportHTML(
  patient: Patient,
  scaleResponses: ScaleResponse[],
  statistics: any,
  professional: ProfessionalInfo
): string {
  const evaluationDate = new Date().toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Agrupar escalas por tipo
  const scalesByType: Record<string, ScaleResponse[]> = {};
  scaleResponses.forEach((response) => {
    if (!scalesByType[response.scaleType]) {
      scalesByType[response.scaleType] = [];
    }
    scalesByType[response.scaleType].push(response);
  });

  // Gerar tabelas de escalas
  const scaleTablesHTML = Object.entries(scalesByType)
    .map(([scaleType, responses]) => {
      const sortedResponses = responses.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      return `
        <div class="section">
          <div class="section-title">${responses[0].scaleName}</div>
          
          <table class="scales-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Pontuação</th>
                <th>Interpretação</th>
              </tr>
            </thead>
            <tbody>
              ${sortedResponses
                .map(
                  (response) => `
                <tr>
                  <td>${new Date(response.date).toLocaleDateString("pt-BR")}</td>
                  <td style="font-weight: bold; color: #0a7ea4;">${response.totalScore}</td>
                  <td>${response.interpretation}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `;
    })
    .join("");

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Relatório de Efetividade - ${patient.fullName}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          background-color: #f5f5f5;
          padding: 20px;
        }
        
        .container {
          max-width: 900px;
          margin: 0 auto;
          background-color: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .header {
          border-bottom: 3px solid #0a7ea4;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .header-title {
          font-size: 28px;
          font-weight: bold;
          color: #0a7ea4;
          margin-bottom: 10px;
        }
        
        .header-subtitle {
          font-size: 14px;
          color: #666;
        }
        
        .professional-info {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
          font-size: 12px;
        }
        
        .professional-info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .professional-info-label {
          font-weight: bold;
          color: #333;
        }
        
        .professional-info-value {
          color: #666;
        }
        
        .patient-info {
          background-color: #f0f8ff;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
          border-left: 4px solid #0a7ea4;
        }
        
        .patient-info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 13px;
        }
        
        .patient-info-label {
          font-weight: bold;
          color: #333;
        }
        
        .patient-info-value {
          color: #666;
        }
        
        .summary {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 30px;
        }
        
        .summary-box {
          background-color: #f0f8ff;
          padding: 15px;
          border-radius: 4px;
          border-left: 4px solid #0a7ea4;
        }
        
        .summary-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }
        
        .summary-value {
          font-size: 24px;
          font-weight: bold;
          color: #0a7ea4;
        }
        
        .section {
          margin-bottom: 30px;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #0a7ea4;
          border-bottom: 2px solid #ddd;
          padding-bottom: 10px;
          margin-bottom: 15px;
        }
        
        .scales-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 13px;
        }
        
        .scales-table th {
          background-color: #0a7ea4;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: bold;
        }
        
        .scales-table td {
          padding: 12px;
          border-bottom: 1px solid #ddd;
        }
        
        .scales-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        
        .footer {
          border-top: 1px solid #ddd;
          padding-top: 15px;
          margin-top: 30px;
          font-size: 11px;
          color: #999;
          text-align: center;
        }
        
        .page-break {
          page-break-after: always;
        }
        
        @media print {
          body {
            background-color: white;
            padding: 0;
          }
          
          .container {
            box-shadow: none;
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="header-title">Relatório de Efetividade</div>
          <div class="header-subtitle">Avaliação Clínica - ${evaluationDate}</div>
        </div>
        
        <!-- Informações do Sistema -->
        <div class="professional-info">
          <div class="professional-info-row">
            <span class="professional-info-label">Sistema:</span>
            <span class="professional-info-value">NeuroLaserMaps - Desenvolvido por Carlos Charone</span>
          </div>
        </div>
        
        <!-- Informações do Paciente -->
        <div class="patient-info">
          <div class="patient-info-row">
            <span class="patient-info-label">Paciente:</span>
            <span class="patient-info-value">${patient.fullName}</span>
          </div>
          ${patient.birthDate ? `
          <div class="patient-info-row">
            <span class="patient-info-label">Data de Nascimento:</span>
            <span class="patient-info-value">${patient.birthDate}</span>
          </div>
          ` : ""}
          ${patient.diagnosis ? `
          <div class="patient-info-row">
            <span class="patient-info-label">Diagnóstico:</span>
            <span class="patient-info-value">${patient.diagnosis}</span>
          </div>
          ` : ""}
        </div>
        
        <!-- Resumo -->
        <div class="section">
          <div class="section-title">Resumo da Avaliação</div>
          <div class="summary">
            <div class="summary-box">
              <div class="summary-label">Total de Escalas Aplicadas</div>
              <div class="summary-value">${statistics?.totalApplications || 0}</div>
            </div>
            <div class="summary-box">
              <div class="summary-label">Escalas Diferentes</div>
              <div class="summary-value">${statistics?.uniqueScales || 0}</div>
            </div>
          </div>
        </div>
        
        <!-- Escalas Detalhadas -->
        ${scaleTablesHTML}
        
        <!-- Rodapé -->
        <div class="footer">
          <p>Este relatório foi gerado automaticamente pelo sistema de avaliação clínica.</p>
          <p>Data de geração: ${evaluationDate}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
}

/**
 * Exporta e compartilha o relatório de efetividade
 */
export async function exportAndShareEffectivenessReport(
  patient: Patient,
  scaleResponses: ScaleResponse[],
  statistics: any,
  professional: ProfessionalInfo
): Promise<boolean> {
  try {
    const htmlContent = generateEffectivenessReportHTML(
      patient,
      scaleResponses,
      statistics,
      professional
    );

    const message = `Relatório de Efetividade\n\nPaciente: ${patient.fullName}\nTotal de Escalas: ${statistics?.totalApplications || 0}\nEscalas Diferentes: ${statistics?.uniqueScales || 0}\n\nData: ${new Date().toLocaleDateString("pt-BR")}`;

    await Share.share({
      message,
      title: `Relatório de Efetividade - ${patient.fullName}`,
    });

    return true;
  } catch (error) {
    console.error("Erro ao exportar relatório:", error);
    return false;
  }
}
