import { ScaleResponse, ALL_SCALES } from "./clinical-scales";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

/**
 * Gera PDF com histórico completo de evolução do paciente
 */
export async function generatePatientHistoryPDF(
  patientName: string,
  patientId: string,
  scaleResponses: Record<string, ScaleResponse[]>,
  statistics: Record<string, any>
): Promise<string> {
  try {
    // Construir HTML do relatório
    const html = buildPatientHistoryHTML(patientName, patientId, scaleResponses, statistics);

    // Salvar como arquivo
    const fileName = `Historico_${patientName}_${new Date().toISOString().split("T")[0]}.html`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(filePath, html, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    return filePath;
  } catch (error) {
    console.error("Erro ao gerar PDF do histórico:", error);
    throw error;
  }
}

/**
 * Constrói HTML do relatório de histórico do paciente
 */
function buildPatientHistoryHTML(
  patientName: string,
  patientId: string,
  scaleResponses: Record<string, ScaleResponse[]>,
  statistics: Record<string, any>
): string {
  const currentDate = new Date().toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const scalesHTML = Object.entries(scaleResponses)
    .map(([scaleType, responses]) => {
      const scale = ALL_SCALES.find((s) => s.type === scaleType);
      const stats = statistics[scaleType];

      if (!scale || !stats) return "";

      const responsesHTML = responses
        .map(
          (response, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${new Date(response.date).toLocaleDateString("pt-BR")}</td>
          <td><strong>${response.totalScore}</strong></td>
          <td>${response.interpretation}</td>
          <td>${response.notes || "-"}</td>
        </tr>
      `
        )
        .join("");

      return `
      <div class="scale-section">
        <h3>${scale.name}</h3>
        
        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-label">Total de Avaliações</div>
            <div class="stat-value">${stats.totalApplications}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Melhor Score</div>
            <div class="stat-value">${stats.highestScore}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Pior Score</div>
            <div class="stat-value">${stats.lowestScore}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Média</div>
            <div class="stat-value">${stats.averageScore.toFixed(1)}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Tendência</div>
            <div class="stat-value trend-${stats.trend}">${getTrendLabel(stats.trend)}</div>
          </div>
        </div>

        <table class="responses-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Data</th>
              <th>Score</th>
              <th>Interpretação</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            ${responsesHTML}
          </tbody>
        </table>
      </div>
    `;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Histórico de Evolução - ${patientName}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          color: #333;
          line-height: 1.6;
          background: #f5f5f5;
          padding: 20px;
        }

        .container {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .header {
          border-bottom: 3px solid #0a7ea4;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }

        .header h1 {
          font-size: 28px;
          color: #0a7ea4;
          margin-bottom: 10px;
        }

        .patient-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #eee;
        }

        .info-item {
          font-size: 14px;
        }

        .info-label {
          font-weight: 600;
          color: #666;
          margin-bottom: 4px;
        }

        .info-value {
          font-size: 16px;
          color: #333;
        }

        .scale-section {
          margin-bottom: 40px;
          page-break-inside: avoid;
        }

        .scale-section h3 {
          font-size: 18px;
          color: #0a7ea4;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e0e0e0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }

        .stat-box {
          background: #f9f9f9;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          padding: 12px;
          text-align: center;
        }

        .stat-label {
          font-size: 12px;
          color: #999;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #0a7ea4;
        }

        .trend-improving {
          color: #22c55e;
        }

        .trend-declining {
          color: #ef4444;
        }

        .trend-stable {
          color: #f59e0b;
        }

        .responses-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
          font-size: 13px;
        }

        .responses-table thead {
          background: #f0f0f0;
        }

        .responses-table th {
          padding: 10px;
          text-align: left;
          font-weight: 600;
          color: #333;
          border-bottom: 2px solid #ddd;
        }

        .responses-table td {
          padding: 10px;
          border-bottom: 1px solid #eee;
        }

        .responses-table tbody tr:hover {
          background: #f9f9f9;
        }

        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          text-align: center;
          font-size: 12px;
          color: #999;
        }

        @media print {
          body {
            background: white;
            padding: 0;
          }
          .container {
            box-shadow: none;
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📊 Histórico de Evolução Clínica</h1>
          <div class="patient-info">
            <div class="info-item">
              <div class="info-label">Paciente</div>
              <div class="info-value">${patientName}</div>
            </div>
            <div class="info-item">
              <div class="info-label">ID</div>
              <div class="info-value">${patientId}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Data do Relatório</div>
              <div class="info-value">${currentDate}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Aplicativo</div>
              <div class="info-value">NeuroLaserMap v1.0</div>
            </div>
          </div>
        </div>

        ${scalesHTML}

        <div class="footer">
          <p>Este relatório foi gerado automaticamente pelo NeuroLaserMap</p>
          <p>Data e hora: ${new Date().toLocaleString("pt-BR")}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Obtém label da tendência
 */
function getTrendLabel(trend: string): string {
  const labels: Record<string, string> = {
    improving: "📈 Melhorando",
    declining: "📉 Piorando",
    stable: "➡️ Estável",
  };
  return labels[trend] || "Desconhecido";
}

/**
 * Compartilha o PDF gerado
 */
export async function sharePatientHistoryPDF(filePath: string, patientName: string): Promise<void> {
  try {
    if (!(await Sharing.isAvailableAsync())) {
      throw new Error("Compartilhamento não disponível neste dispositivo");
    }

    await Sharing.shareAsync(filePath, {
      mimeType: "application/pdf",
      dialogTitle: `Histórico de ${patientName}`,
      UTI: "com.adobe.pdf",
    });
  } catch (error) {
    console.error("Erro ao compartilhar PDF:", error);
    throw error;
  }
}
