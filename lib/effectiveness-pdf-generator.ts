/**
 * Gerador de Relatório de Efetividade em PDF
 * Cria relatórios completos com histórico de escalas, gráficos e evolução
 */

import { Share } from "react-native";
import { ScaleResponse } from "./clinical-scales";
import { Patient } from "./local-storage";
import { ProfessionalInfo } from "@/hooks/use-professional-info";
import { generateQRCodeSVG } from "./qr-code-generator";

/**
 * Gera número de protocolo único
 */
function generateProtocolNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `NLM-${timestamp}-${random}`;
}

/**
 * Retorna logo em base64 (SVG simples)
 */
function getLogoBase64(): string {
  const svg = `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="30" r="18" fill="#0a7ea4"/>
    <path d="M40 52 C48 52 54 48 54 42 C54 36 48 32 40 32 C32 32 26 36 26 42 C26 48 32 52 40 52" fill="#0a7ea4"/>
  </svg>`;
  try {
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  } catch {
    return '';
  }
}

/**
 * Retorna QR code em base64
 */
function getQRCodeBase64(text: string, size: number = 100): string {
  const svg = generateQRCodeSVG(text, size);
  try {
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  } catch {
    return '';
  }
}

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
  
  const protocolNumber = generateProtocolNumber();
  const logoBase64 = getLogoBase64();
  const qrCodeBase64 = getQRCodeBase64(protocolNumber, 100);

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
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
        }
        
        .footer-section {
          text-align: center;
        }
        
        .footer-label {
          font-weight: bold;
          display: block;
          margin-bottom: 3px;
        }
        
        .header {
          display: flex;
          align-items: center;
          gap: 20px;
          border-bottom: 3px solid #0a7ea4;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .logo {
          width: 80px;
          height: 80px;
          flex-shrink: 0;
        }
        
        .logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        
        .header-content {
          flex: 1;
        }
        
        .protocol-number {
          font-size: 12px;
          color: #999;
          font-family: monospace;
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
          ${logoBase64 ? `<div class="logo"><img src="${logoBase64}" alt="NeuroLaserMaps" /></div>` : ''}
          <div class="header-content">
            <div class="header-title">Relatório de Efetividade</div>
            <div class="header-subtitle">Avaliação Clínica - ${evaluationDate}</div>
            <div class="protocol-number">Protocolo: ${protocolNumber}</div>
          </div>
        </div>
        
        <!-- Informações do Sistema -->
        <div class="professional-info">
          <div class="professional-info-row">
            <span class="professional-info-label">Sistema:</span>
            <span class="professional-info-value">NeuroLaserMaps</span>
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
        
        <!-- Rodapé com QR Code -->
        <div class="footer">
          <div class="footer-section">
            <span class="footer-label">Sistema</span>
            <span>NeuroLaserMaps</span>
          </div>
          <div class="footer-section">
            ${qrCodeBase64 ? `<img src="${qrCodeBase64}" alt="QR Code" style="width: 80px; height: 80px;" />` : ''}
          </div>
          <div class="footer-section">
            <span class="footer-label">Protocolo</span>
            <span>${protocolNumber}</span>
          </div>
          <div class="footer-section">
            <span class="footer-label">Data</span>
            <span>${evaluationDate}</span>
          </div>
          <div class="footer-section" style="text-align: center; margin-top: 12px; border-top: 1px solid #e0e0e0; padding-top: 12px;">
            <span style="font-size: 10px; color: #999;">NeuroLaserMaps</span>
          </div>
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
