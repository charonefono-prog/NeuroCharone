import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

interface ProfessionalProfile {
  title: "Dr" | "Dra";
  firstName: string;
  lastName: string;
  registrationNumber: string;
  specialty: string;
  email: string;
  phone: string;
}

interface TherapeuticCycle {
  id: string;
  patientId: string;
  patientName: string;
  objectives: string;
  plannedSessions: number;
  estimatedDuration: number;
  frequency: string;
  intensity: string;
  status: "Planejado" | "Ativo" | "Concluído";
  startDate: string;
  endDate?: string;
}

/**
 * Gera um relatório em HTML que pode ser convertido para PDF
 */
export function generateProfessionalReportHTML(
  profile: ProfessionalProfile,
  cycles: TherapeuticCycle[]
): string {
  const fullName = `${profile.title}. ${profile.firstName} ${profile.lastName}`;
  const totalPatients = new Set(cycles.map((c) => c.patientId)).size;
  const activeCycles = cycles.filter((c) => c.status === "Ativo").length;
  const completedCycles = cycles.filter((c) => c.status === "Concluído").length;

  const cyclesHTML = cycles
    .map(
      (cycle) => `
    <tr>
      <td>${cycle.patientName}</td>
      <td>${cycle.objectives}</td>
      <td>${cycle.plannedSessions}</td>
      <td>${cycle.frequency}</td>
      <td>${cycle.intensity}</td>
      <td><span class="status status-${cycle.status.toLowerCase()}">${cycle.status}</span></td>
      <td>${new Date(cycle.startDate).toLocaleDateString("pt-BR")}</td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório Profissional - ${fullName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            line-height: 1.6;
            padding: 20px;
            background: #f5f5f5;
        }
        
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #667eea;
            padding-bottom: 20px;
        }
        
        .header h1 {
            color: #667eea;
            font-size: 2em;
            margin-bottom: 10px;
        }
        
        .header p {
            color: #666;
            font-size: 1.1em;
        }
        
        .professional-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #667eea;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .info-item {
            display: flex;
            flex-direction: column;
        }
        
        .info-label {
            font-weight: 600;
            color: #667eea;
            font-size: 0.9em;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        
        .info-value {
            color: #333;
            font-size: 1em;
        }
        
        .statistics {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .stat-label {
            font-size: 0.9em;
            opacity: 0.9;
        }
        
        .section {
            margin-bottom: 30px;
        }
        
        .section-title {
            color: #667eea;
            font-size: 1.5em;
            font-weight: 600;
            margin-bottom: 15px;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        
        table th {
            background: #667eea;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }
        
        table td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
        }
        
        table tr:nth-child(even) {
            background: #f9f9f9;
        }
        
        .status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 600;
        }
        
        .status-planejado {
            background: #e3f2fd;
            color: #1976d2;
        }
        
        .status-ativo {
            background: #e8f5e9;
            color: #388e3c;
        }
        
        .status-concluído {
            background: #f3e5f5;
            color: #7b1fa2;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #666;
            font-size: 0.9em;
        }
        
        .generated-date {
            color: #999;
            font-size: 0.85em;
            margin-top: 10px;
        }
        
        .no-data {
            text-align: center;
            color: #999;
            padding: 20px;
            font-style: italic;
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
            <h1>📋 NeuroLaserMap</h1>
            <p>Relatório Profissional</p>
        </div>
        
        <div class="professional-info">
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Nome Completo</span>
                    <span class="info-value">${fullName}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Registro Profissional</span>
                    <span class="info-value">${profile.registrationNumber || "Não informado"}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Especialidade</span>
                    <span class="info-value">${profile.specialty || "Não informada"}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Email</span>
                    <span class="info-value">${profile.email || "Não informado"}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Telefone</span>
                    <span class="info-value">${profile.phone || "Não informado"}</span>
                </div>
            </div>
        </div>
        
        <div class="statistics">
            <div class="stat-card">
                <div class="stat-number">${totalPatients}</div>
                <div class="stat-label">Pacientes</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${cycles.length}</div>
                <div class="stat-label">Ciclos Totais</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${activeCycles}</div>
                <div class="stat-label">Ciclos Ativos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${completedCycles}</div>
                <div class="stat-label">Ciclos Concluídos</div>
            </div>
        </div>
        
        <div class="section">
            <h2 class="section-title">📊 Ciclos Terapêuticos</h2>
            ${
              cycles.length > 0
                ? `
                <table>
                    <thead>
                        <tr>
                            <th>Paciente</th>
                            <th>Objetivos</th>
                            <th>Sessões</th>
                            <th>Frequência</th>
                            <th>Intensidade</th>
                            <th>Status</th>
                            <th>Início</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cyclesHTML}
                    </tbody>
                </table>
            `
                : '<p class="no-data">Nenhum ciclo terapêutico registrado</p>'
            }
        </div>
        
        <div class="footer">
            <p>© 2026 NeuroLaserMap - Sistema de Gerenciamento de Neuromodulação</p>
            <p class="generated-date">Relatório gerado em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}</p>
        </div>
    </div>
</body>
</html>
  `;
}

/**
 * Exporta o relatório como HTML para compartilhamento
 */
export async function exportProfessionalReportHTML(
  profile: ProfessionalProfile,
  cycles: TherapeuticCycle[]
): Promise<boolean> {
  try {
    const html = generateProfessionalReportHTML(profile, cycles);
    const fileName = `relatorio_${profile.firstName}_${profile.lastName}_${Date.now()}.html`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(filePath, html);

    if (Platform.OS !== "web" && (await Sharing.isAvailableAsync())) {
      await Sharing.shareAsync(filePath, {
        mimeType: "text/html",
        dialogTitle: "Compartilhar Relatório",
      });
      return true;
    }

    return true;
  } catch (error) {
    console.error("Erro ao exportar relatório:", error);
    return false;
  }
}

/**
 * Gera um resumo do relatório em texto
 */
export function generateProfessionalReportSummary(
  profile: ProfessionalProfile,
  cycles: TherapeuticCycle[]
): string {
  const fullName = `${profile.title}. ${profile.firstName} ${profile.lastName}`;
  const totalPatients = new Set(cycles.map((c) => c.patientId)).size;
  const activeCycles = cycles.filter((c) => c.status === "Ativo").length;
  const completedCycles = cycles.filter((c) => c.status === "Concluído").length;

  return `
RELATÓRIO PROFISSIONAL - NEUROLASERMAPP
========================================

PROFISSIONAL: ${fullName}
Registro: ${profile.registrationNumber || "Não informado"}
Especialidade: ${profile.specialty || "Não informada"}
Email: ${profile.email || "Não informado"}
Telefone: ${profile.phone || "Não informado"}

ESTATÍSTICAS
============
Total de Pacientes: ${totalPatients}
Total de Ciclos: ${cycles.length}
Ciclos Ativos: ${activeCycles}
Ciclos Concluídos: ${completedCycles}

CICLOS TERAPÊUTICOS
===================
${
  cycles.length > 0
    ? cycles
        .map(
          (c) =>
            `- ${c.patientName}: ${c.objectives} (${c.status}) - Início: ${new Date(c.startDate).toLocaleDateString("pt-BR")}`
        )
        .join("\n")
    : "Nenhum ciclo registrado"
}

Gerado em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}
  `;
}
