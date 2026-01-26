/**
 * Gerador de PDF para Escalas Clínicas
 * Cria relatórios profissionais em PDF com dados das escalas
 */

import { ScaleResponse } from "./clinical-scales";
import { getScale } from "./clinical-scales";
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

interface ProfessionalInfo {
  title: "Dr" | "Dra";
  firstName: string;
  lastName: string;
  registrationNumber: string;
  specialty: string;
  email?: string;
  phone?: string;
}

interface PatientInfo {
  id: string;
  fullName: string;
  dateOfBirth?: string;
  diagnosis?: string;
  phone?: string;
}

/**
 * Gerar HTML para PDF de escala
 */
export function generateScalePDFHTML(
  scaleResponse: ScaleResponse,
  professional: ProfessionalInfo,
  patient: PatientInfo,
  statistics?: any
): string {
  const scale = getScale(scaleResponse.scaleType);
  if (!scale) return "";

  const evaluationDate = new Date(scaleResponse.date).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const protocolNumber = generateProtocolNumber();
  const logoBase64 = getLogoBase64();
  const qrCodeBase64 = getQRCodeBase64(protocolNumber, 100);

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${scale.name} - ${patient.fullName}</title>
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
          max-width: 800px;
          margin: 0 auto;
          background-color: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .header {
          border-bottom: 2px solid #0a7ea4;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .header-title {
          font-size: 24px;
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
        
        .section {
          margin-bottom: 30px;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #0a7ea4;
          border-bottom: 1px solid #ddd;
          padding-bottom: 10px;
          margin-bottom: 15px;
        }
        
        .scale-description {
          background-color: #f9f9f9;
          padding: 12px;
          border-radius: 4px;
          font-size: 12px;
          color: #666;
          margin-bottom: 15px;
          font-style: italic;
        }
        
        .results-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .result-box {
          background-color: #f0f8ff;
          padding: 15px;
          border-radius: 4px;
          border-left: 4px solid #0a7ea4;
        }
        
        .result-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }
        
        .result-value {
          font-size: 24px;
          font-weight: bold;
          color: #0a7ea4;
        }
        
        .interpretation {
          background-color: #e8f5e9;
          padding: 15px;
          border-radius: 4px;
          border-left: 4px solid #4caf50;
          margin-bottom: 20px;
        }
        
        .interpretation-title {
          font-weight: bold;
          color: #2e7d32;
          margin-bottom: 5px;
        }
        
        .interpretation-text {
          color: #555;
          font-size: 13px;
        }
        
        .answers-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 12px;
        }
        
        .answers-table th {
          background-color: #0a7ea4;
          color: white;
          padding: 10px;
          text-align: left;
          font-weight: bold;
        }
        
        .answers-table td {
          padding: 10px;
          border-bottom: 1px solid #ddd;
        }
        
        .answers-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        
        .notes {
          background-color: #fff3e0;
          padding: 15px;
          border-radius: 4px;
          border-left: 4px solid #ff9800;
          margin-bottom: 20px;
        }
        
        .notes-title {
          font-weight: bold;
          color: #e65100;
          margin-bottom: 5px;
        }
        
        .notes-text {
          color: #555;
          font-size: 13px;
          white-space: pre-wrap;
        }
        
        .statistics {
          background-color: #f3e5f5;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        
        .statistics-title {
          font-weight: bold;
          color: #6a1b9a;
          margin-bottom: 10px;
        }
        
        .statistics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        
        .stat-item {
          font-size: 12px;
        }
        
        .stat-label {
          color: #666;
        }
        
        .stat-value {
          font-weight: bold;
          color: #6a1b9a;
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
            <div class="header-title">${scale.name}</div>
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
          ${patient.dateOfBirth ? `
          <div class="patient-info-row">
            <span class="patient-info-label">Data de Nascimento:</span>
            <span class="patient-info-value">${patient.dateOfBirth}</span>
          </div>
          ` : ""}
          ${patient.diagnosis ? `
          <div class="patient-info-row">
            <span class="patient-info-label">Diagnóstico:</span>
            <span class="patient-info-value">${patient.diagnosis}</span>
          </div>
          ` : ""}
          ${patient.phone ? `
          <div class="patient-info-row">
            <span class="patient-info-label">Telefone:</span>
            <span class="patient-info-value">${patient.phone}</span>
          </div>
          ` : ""}
        </div>
        
        <!-- Descrição da Escala -->
        <div class="section">
          <div class="scale-description">
            ${scale.description}
          </div>
        </div>
        
        <!-- Resultados -->
        <div class="section">
          <div class="section-title">Resultados</div>
          
          <div class="results-grid">
            <div class="result-box">
              <div class="result-label">Pontuação Total</div>
              <div class="result-value">${scaleResponse.totalScore}</div>
            </div>
            <div class="result-box">
              <div class="result-label">Data da Avaliação</div>
              <div class="result-value" style="font-size: 14px;">${evaluationDate}</div>
            </div>
          </div>
          
          <div class="interpretation">
            <div class="interpretation-title">Interpretação</div>
            <div class="interpretation-text">${scaleResponse.interpretation}</div>
          </div>
        </div>
        
        <!-- Respostas Detalhadas -->
        <div class="section">
          <div class="section-title">Respostas Detalhadas</div>
          
          <table class="answers-table">
            <thead>
              <tr>
                <th>Questão</th>
                <th>Resposta</th>
              </tr>
            </thead>
            <tbody>
              ${scale.items
                .map((item) => {
                  const answer = scaleResponse.answers[item.id];
                  const option = item.options.find((o) => o.value === answer);
                  return `
                <tr>
                  <td>${item.question}</td>
                  <td>${option?.label || "Não respondido"}</td>
                </tr>
              `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
        
        <!-- Notas -->
        ${
          scaleResponse.notes
            ? `
        <div class="notes">
          <div class="notes-title">Observações</div>
          <div class="notes-text">${scaleResponse.notes}</div>
        </div>
        `
            : ""
        }
        
        <!-- Estatísticas (se disponível) -->
        ${
          statistics
            ? `
        <div class="statistics">
          <div class="statistics-title">Estatísticas Gerais</div>
          <div class="statistics-grid">
            <div class="stat-item">
              <span class="stat-label">Total de Avaliações:</span>
              <div class="stat-value">${statistics.totalApplications}</div>
            </div>
            <div class="stat-item">
              <span class="stat-label">Pontuação Média:</span>
              <div class="stat-value">${statistics.averageScore}</div>
            </div>
            <div class="stat-item">
              <span class="stat-label">Maior Pontuação:</span>
              <div class="stat-value">${statistics.highestScore}</div>
            </div>
            <div class="stat-item">
              <span class="stat-label">Menor Pontuação:</span>
              <div class="stat-value">${statistics.lowestScore}</div>
            </div>
            <div class="stat-item">
              <span class="stat-label">Tendência:</span>
              <div class="stat-value">${
                statistics.trend === "improving"
                  ? "Melhorando"
                  : statistics.trend === "declining"
                  ? "Piorando"
                  : "Estável"
              }</div>
            </div>
          </div>
        </div>
        `
            : ""
        }
        
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
            <span style="font-size: 11px; color: #666;">Desenvolvido por: Carlos Charone</span>
            <br />
            <span style="font-size: 10px; color: #999;">Desenvolvido por: Carlos Charone - NeuroLaserMaps</span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
}

/**
 * Gerar HTML para PDF com múltiplas escalas
 */
export function generateMultipleScalesPDFHTML(
  scaleResponses: ScaleResponse[],
  professional: ProfessionalInfo,
  patient: PatientInfo,
  statistics?: Record<string, any>
): string {
  const htmlPages = scaleResponses.map((response) => {
    const stats = statistics?.[response.scaleType];
    return generateScalePDFHTML(response, professional, patient, stats);
  });

  // Combinar múltiplas páginas
  const combinedHTML = htmlPages
    .map((html, index) => {
      if (index === 0) return html;
      // Adicionar quebra de página
      return html.replace("<body>", '<body><div class="page-break"></div>');
    })
    .join("");

  return combinedHTML;
}

/**
 * Exportar HTML como string (para salvar em arquivo ou compartilhar)
 */
export async function exportScaleAsHTML(
  scaleResponse: ScaleResponse,
  professional: ProfessionalInfo,
  patient: PatientInfo
): Promise<string> {
  return generateScalePDFHTML(scaleResponse, professional, patient);
}

/**
 * Criar um arquivo de dados JSON com a escala
 */
export function exportScaleAsJSON(
  scaleResponse: ScaleResponse,
  professional: ProfessionalInfo,
  patient: PatientInfo
): string {
  const data = {
    scale: scaleResponse,
    professional,
    patient,
    exportedAt: new Date().toISOString(),
  };

  return JSON.stringify(data, null, 2);
}
