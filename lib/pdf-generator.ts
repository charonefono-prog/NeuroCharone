import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { type Patient, type TherapeuticPlan, type Session } from "./local-storage";

export interface ReportData {
  patient: Patient;
  plan: TherapeuticPlan | null;
  sessions: Session[];
}

export async function generatePatientReport(data: ReportData): Promise<void> {
  const { patient, plan, sessions } = data;

  // Calcular estatísticas
  const totalSessions = sessions.length;
  const durations = sessions.map((s) => s.durationMinutes);
  const avgDuration = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
  const maxDuration = durations.length > 0 ? Math.max(...durations) : 0;
  const minDuration = durations.length > 0 ? Math.min(...durations) : 0;

  // Pontos mais estimulados
  const pointsCount: Record<string, number> = {};
  sessions.forEach((session) => {
    session.stimulatedPoints.forEach((point) => {
      pointsCount[point] = (pointsCount[point] || 0) + 1;
    });
  });
  const topPoints = Object.entries(pointsCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Criar conteúdo HTML do relatório
  const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório de Neuromodulação - ${patient.fullName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #fff;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #0a7ea4;
    }
    .header h1 {
      color: #0a7ea4;
      font-size: 28px;
      margin-bottom: 10px;
    }
    .header p {
      color: #666;
      font-size: 14px;
    }
    .section {
      margin-bottom: 30px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #0a7ea4;
    }
    .section h2 {
      color: #0a7ea4;
      font-size: 20px;
      margin-bottom: 15px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }
    .info-item {
      background: #fff;
      padding: 12px;
      border-radius: 6px;
      border: 1px solid #e0e0e0;
    }
    .info-label {
      font-size: 12px;
      color: #666;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .info-value {
      font-size: 16px;
      color: #333;
      font-weight: 500;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-top: 15px;
    }
    .stat-card {
      background: #fff;
      padding: 15px;
      border-radius: 6px;
      text-align: center;
      border: 1px solid #e0e0e0;
    }
    .stat-label {
      font-size: 12px;
      color: #666;
      margin-bottom: 8px;
    }
    .stat-value {
      font-size: 24px;
      color: #0a7ea4;
      font-weight: bold;
    }
    .stat-unit {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    }
    .list {
      background: #fff;
      padding: 15px;
      border-radius: 6px;
      border: 1px solid #e0e0e0;
      margin-top: 15px;
    }
    .list-item {
      padding: 10px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .list-item:last-child {
      border-bottom: none;
    }
    .list-item-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }
    .list-item-date {
      font-size: 14px;
      color: #0a7ea4;
      font-weight: 600;
    }
    .list-item-duration {
      font-size: 14px;
      color: #666;
    }
    .list-item-points {
      font-size: 12px;
      color: #666;
      line-height: 1.4;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    .footer strong {
      color: #0a7ea4;
    }
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      margin-right: 4px;
      margin-bottom: 4px;
    }
    .badge-success {
      background: #d4edda;
      color: #155724;
    }
    .badge-warning {
      background: #fff3cd;
      color: #856404;
    }
    .badge-info {
      background: #d1ecf1;
      color: #0c5460;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Relatório de Neuromodulação</h1>
    <p>Gerado em ${new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</p>
  </div>

  <div class="section">
    <h2>Dados do Paciente</h2>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Nome Completo</div>
        <div class="info-value">${patient.fullName}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Data de Nascimento</div>
        <div class="info-value">${new Date(patient.birthDate).toLocaleDateString("pt-BR")}</div>
      </div>
      ${patient.phone ? `
      <div class="info-item">
        <div class="info-label">Telefone</div>
        <div class="info-value">${patient.phone}</div>
      </div>
      ` : ""}
      ${patient.email ? `
      <div class="info-item">
        <div class="info-label">Email</div>
        <div class="info-value">${patient.email}</div>
      </div>
      ` : ""}
      <div class="info-item">
        <div class="info-label">Status do Tratamento</div>
        <div class="info-value">
          <span class="badge ${patient.status === "active" ? "badge-success" : patient.status === "paused" ? "badge-warning" : "badge-info"}">
            ${patient.status === "active" ? "Ativo" : patient.status === "paused" ? "Pausado" : "Concluído"}
          </span>
        </div>
      </div>
    </div>
    ${patient.diagnosis ? `
    <div class="info-item" style="margin-top: 15px;">
      <div class="info-label">Diagnóstico</div>
      <div class="info-value">${patient.diagnosis}</div>
    </div>
    ` : ""}
  </div>

  ${plan ? `
  <div class="section">
    <h2>Plano Terapêutico Ativo</h2>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Objetivo</div>
        <div class="info-value">${plan.objective}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Frequência</div>
        <div class="info-value">${plan.frequency}x por semana</div>
      </div>
      <div class="info-item">
        <div class="info-label">Duração Total</div>
        <div class="info-value">${plan.totalDuration} semanas</div>
      </div>
      <div class="info-item">
        <div class="info-label">Regiões Alvo</div>
        <div class="info-value">${plan.targetRegions.join(", ")}</div>
      </div>
    </div>
    <div class="info-item" style="margin-top: 15px;">
      <div class="info-label">Pontos de Estimulação</div>
      <div class="info-value">
        ${plan.targetPoints.map(p => `<span class="badge badge-info">${p}</span>`).join("")}
      </div>
    </div>
  </div>
  ` : ""}

  <div class="section">
    <h2>Estatísticas do Tratamento</h2>
    <div class="stats">
      <div class="stat-card">
        <div class="stat-label">Total de Sessões</div>
        <div class="stat-value">${totalSessions}</div>
        <div class="stat-unit">realizadas</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Duração Média</div>
        <div class="stat-value">${avgDuration.toFixed(0)}</div>
        <div class="stat-unit">minutos</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Variação</div>
        <div class="stat-value">${minDuration}-${maxDuration}</div>
        <div class="stat-unit">minutos</div>
      </div>
    </div>

    ${topPoints.length > 0 ? `
    <div class="list">
      <div class="info-label" style="margin-bottom: 10px;">Pontos Mais Estimulados</div>
      ${topPoints.map(([point, count]) => `
        <div class="list-item">
          <div class="list-item-header">
            <span class="list-item-date">${point}</span>
            <span class="list-item-duration">${count}x (${((count / totalSessions) * 100).toFixed(0)}%)</span>
          </div>
        </div>
      `).join("")}
    </div>
    ` : ""}
  </div>

  ${sessions.length > 0 ? `
  <div class="section">
    <h2>Histórico de Sessões</h2>
    <div class="list">
      ${sessions.slice(-10).reverse().map((session) => `
        <div class="list-item">
          <div class="list-item-header">
            <span class="list-item-date">${new Date(session.sessionDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}</span>
            <span class="list-item-duration">${session.durationMinutes} minutos</span>
          </div>
          <div class="list-item-points">
            <strong>Pontos:</strong> ${session.stimulatedPoints.join(", ")}
          </div>
          ${session.observations ? `
          <div class="list-item-points" style="margin-top: 5px;">
            <strong>Observações:</strong> ${session.observations}
          </div>
          ` : ""}
        </div>
      `).join("")}
    </div>
    ${sessions.length > 10 ? `
    <p style="text-align: center; color: #666; font-size: 12px; margin-top: 10px;">
      Mostrando as 10 sessões mais recentes
    </p>
    ` : ""}
  </div>
  ` : ""}

  <div class="footer">
    <p><strong>NeuroLaserMap</strong> - Aplicativo de Mapeamento de Neuromodulação a Laser</p>

    <p style="margin-top: 8px;">Este relatório é confidencial e destinado exclusivamente ao uso profissional.</p>
  </div>
</body>
</html>
  `;

  try {
    // Salvar HTML temporariamente
    const fileName = `relatorio_${patient.fullName.replace(/\s+/g, "_")}_${Date.now()}.html`;
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;
    
    await FileSystem.writeAsStringAsync(fileUri, htmlContent, {
      encoding: "utf8",
    });

    // Compartilhar arquivo
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(fileUri, {
        mimeType: "text/html",
        dialogTitle: `Relatório - ${patient.fullName}`,
        UTI: "public.html",
      });
    } else {
      throw new Error("Compartilhamento não disponível neste dispositivo");
    }
  } catch (error) {
    console.error("Error generating report:", error);
    throw error;
  }
}
