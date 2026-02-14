import { Platform, Alert } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import type { Patient, Session, TherapeuticPlan } from "./local-storage";

// Função para gerar PDF do relatório do paciente
export async function generatePatientPDFReport(
  patient: Patient,
  plan: TherapeuticPlan | null,
  sessions: Session[]
): Promise<void> {
  try {
    // Criar conteúdo HTML do relatório
    const htmlContent = generateReportHTML(patient, plan, sessions);

    // Nome do arquivo
    const htmlFileName = `relatorio_${patient.fullName.replace(/\s/g, "_")}_${Date.now()}.htm`;

    // Verificar se está rodando na web
    if (Platform.OS === "web") {
      // Download direto no navegador
      const blob = new Blob([htmlContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = htmlFileName.replace('.htm', '.htm');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      Alert.alert(
        "Sucesso",
        "Relatório baixado com sucesso!",
        [{ text: "OK" }]
      );
    } else {
      // Mobile: usar FileSystem e Sharing
      const htmlFilePath = `${FileSystem.documentDirectory}${htmlFileName}`;

      await FileSystem.writeAsStringAsync(htmlFilePath, htmlContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Verificar se o compartilhamento está disponível
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(htmlFilePath, {
          mimeType: "text/plain",
          dialogTitle: "Compartilhar Relatório",
          UTI: "public.text",
        });
      } else {
        Alert.alert(
          "Sucesso",
          `Relatório salvo em: ${htmlFilePath}`,
          [{ text: "OK" }]
        );
      }
    }
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Detalhes do erro:", errorMessage);
    Alert.alert(
      "Erro ao Gerar Relatório",
      `Não foi possível gerar o relatório. Detalhes: ${errorMessage}`
    );
    throw error;
  }
}

function generateReportHTML(
  patient: Patient,
  plan: TherapeuticPlan | null,
  sessions: Session[]
): string {
  const currentDate = new Date().toLocaleDateString("pt-BR");
  const patientAge = calculateAge(patient.birthDate);

  // Calcular estatísticas
  const totalSessions = sessions.length;
  const avgDuration = sessions.length > 0
    ? Math.round(sessions.reduce((sum, s) => sum + s.durationMinutes, 0) / sessions.length)
    : 0;
  const avgJoules = sessions.length > 0
    ? Math.round(sessions.reduce((sum, s) => sum + (s.joules || 0), 0) / sessions.length)
    : 0;

  // Contar pontos mais estimulados
  const pointsCount: Record<string, number> = {};
  sessions.forEach((session) => {
    session.stimulatedPoints.forEach((point) => {
      pointsCount[point] = (pointsCount[point] || 0) + 1;
    });
  });
  const topPoints = Object.entries(pointsCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([point, count]) => `${point} (${count}x)`)
    .join(", ");

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório de Tratamento - ${patient.fullName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #fff;
      padding: 40px;
      max-width: 210mm;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #2563EB;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #2563EB;
      font-size: 28px;
      margin-bottom: 10px;
    }
    .header p {
      color: #666;
      font-size: 14px;
    }
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    .section-title {
      background: #2563EB;
      color: white;
      padding: 10px 15px;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 15px;
      border-radius: 5px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 15px;
    }
    .info-item {
      padding: 12px;
      background: #F3F4F6;
      border-left: 4px solid #2563EB;
      border-radius: 4px;
    }
    .info-label {
      font-weight: bold;
      color: #2563EB;
      font-size: 12px;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .info-value {
      font-size: 16px;
      color: #333;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }
    .stat-card {
      background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    .stat-value {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .stat-label {
      font-size: 14px;
      opacity: 0.9;
    }
    .session-list {
      background: #F9FAFB;
      border-radius: 8px;
      padding: 15px;
    }
    .session-item {
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 10px;
    }
    .session-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #E5E7EB;
    }
    .session-date {
      font-weight: bold;
      color: #2563EB;
    }
    .session-details {
      font-size: 14px;
      color: #666;
      line-height: 1.8;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #E5E7EB;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    .signature {
      margin-top: 60px;
      text-align: center;
    }
    .signature-line {
      border-top: 2px solid #333;
      width: 300px;
      margin: 0 auto 10px;
    }
    .signature-name {
      font-weight: bold;
      color: #2563EB;
      font-size: 16px;
    }
    .signature-credential {
      color: #666;
      font-size: 14px;
    }
    @media print {
      body {
        padding: 20px;
      }
      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <!-- Cabeçalho -->
  <div class="header">
    <h1>NeuroLaserMap</h1>
    <p>Relatório de Tratamento de Neuromodulação</p>
    <p>Data de Emissão: ${currentDate}</p>
  </div>

  <!-- Dados do Paciente -->
  <div class="section">
    <div class="section-title">Dados do Paciente</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Nome Completo</div>
        <div class="info-value">${patient.fullName}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Idade</div>
        <div class="info-value">${patientAge} anos</div>
      </div>
      <div class="info-item">
        <div class="info-label">Data de Nascimento</div>
        <div class="info-value">${new Date(patient.birthDate).toLocaleDateString("pt-BR")}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Telefone</div>
        <div class="info-value">${patient.phone || "Não informado"}</div>
      </div>
      <div class="info-item" style="grid-column: 1 / -1;">
        <div class="info-label">Diagnóstico</div>
        <div class="info-value">${patient.diagnosis || "Não informado"}</div>
      </div>
    </div>
  </div>

  <!-- Plano Terapêutico -->
  ${plan ? `
  <div class="section">
    <div class="section-title">Plano Terapêutico</div>
    <div class="info-grid">
      <div class="info-item" style="grid-column: 1 / -1;">
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
      <div class="info-item" style="grid-column: 1 / -1;">
        <div class="info-label">Regiões Alvo</div>
        <div class="info-value">${plan.targetRegions.join(", ")}</div>
      </div>
      <div class="info-item" style="grid-column: 1 / -1;">
        <div class="info-label">Pontos de Estimulação</div>
        <div class="info-value">${plan.targetPoints.join(", ")}</div>
      </div>
    </div>
  </div>
  ` : ""}

  <!-- Estatísticas do Tratamento -->
  <div class="section">
    <div class="section-title">Estatísticas do Tratamento</div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${totalSessions}</div>
        <div class="stat-label">Sessões Realizadas</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${avgDuration}</div>
        <div class="stat-label">Duração Média (min)</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${avgJoules}</div>
        <div class="stat-label">Joules Médio</div>
      </div>
    </div>
    ${topPoints ? `
    <div class="info-item">
      <div class="info-label">Pontos Mais Estimulados</div>
      <div class="info-value">${topPoints}</div>
    </div>
    ` : ""}
  </div>

  <!-- Histórico de Sessões -->
  <div class="section">
    <div class="section-title">Histórico de Sessões</div>
    <div class="session-list">
      ${sessions.length > 0 ? sessions.map((session, index) => `
      <div class="session-item">
        <div class="session-header">
          <span class="session-date">Sessão ${index + 1} - ${new Date(session.sessionDate).toLocaleDateString("pt-BR")}</span>
        </div>
        <div class="session-details">
          <strong>Duração:</strong> ${session.durationMinutes} minutos<br>
          <strong>Joules:</strong> ${session.joules || "Não informado"}<br>
          <strong>Pontos Estimulados:</strong> ${session.stimulatedPoints.join(", ")}<br>
          ${session.observations ? `<strong>Observações:</strong> ${session.observations}<br>` : ""}
          ${session.patientReactions ? `<strong>Reações:</strong> ${session.patientReactions}` : ""}
        </div>
      </div>
      `).join("") : "<p style='text-align: center; color: #666;'>Nenhuma sessão registrada</p>"}
    </div>
  </div>



  <!-- Rodapé -->
  <div class="footer">
    <p>Este relatório foi gerado automaticamente pelo sistema NeuroLaserMap</p>
    <p>Documento confidencial - Uso exclusivo para fins terapêuticos</p>
  </div>
</body>
</html>
  `;
}

function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}
