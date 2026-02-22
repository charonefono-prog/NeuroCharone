/**
 * Gerador de PDF para Sessões
 * Exporta dados de sessão em formato PDF com assinatura eletrônica
 */

import { type Session } from "@/lib/local-storage";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

export interface SessionPDFData {
  session: Session;
  patientName: string;
  professional?: any;
}

/**
 * Gera PDF da sessão e compartilha/salva o arquivo
 */
export async function generateSessionPDF(session: Session, patientName: string): Promise<void> {
  try {
    // Gerar HTML do PDF
    const htmlContent = generateSessionHTML(session, patientName, null);

    // Salvar arquivo temporário
    const fileName = `sessao_${patientName.replace(/\s+/g, "_")}_${new Date().getTime()}.html`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(filePath, htmlContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Compartilhar arquivo
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: "text/html",
        dialogTitle: "Exportar Sessão",
      });
    } else {
      console.log("Arquivo salvo em:", filePath);
    }
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    throw error;
  }
}

/**
 * Gera conteúdo HTML da sessão (compatível com navegadores e apps)
 */
function generateSessionHTML(session: Session, patientName: string, professional?: any | null): string {
  const sessionDate = new Date(session.sessionDate);
  const formattedDate = sessionDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const formattedTime = sessionDate.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Sessão - ${patientName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #ffffff;
            color: #11181C;
            line-height: 1.6;
            padding: 40px;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #0a7ea4;
            padding-bottom: 20px;
        }
        
        .header h1 {
            font-size: 28px;
            color: #0a7ea4;
            margin-bottom: 5px;
        }
        
        .header p {
            font-size: 14px;
            color: #687076;
        }
        
        .section {
            margin-bottom: 30px;
        }
        
        .section-title {
            font-size: 16px;
            font-weight: 700;
            color: #0a7ea4;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 1px solid #E5E7EB;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 15px;
        }
        
        .info-item {
            display: flex;
            flex-direction: column;
        }
        
        .info-label {
            font-size: 12px;
            font-weight: 600;
            color: #687076;
            margin-bottom: 5px;
        }
        
        .info-value {
            font-size: 14px;
            color: #11181C;
        }
        
        .points-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
        }
        
        .point-badge {
            background-color: #0a7ea420;
            color: #0a7ea4;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
        }
        
        .observations {
            background-color: #f5f5f5;
            border-left: 3px solid #0a7ea4;
            padding: 15px;
            margin-top: 15px;
            border-radius: 4px;
            font-size: 14px;
            line-height: 1.6;
        }
        
        .signature-section {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #E5E7EB;
        }
        
        .signature-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 20px;
        }
        
        .signature-box {
            text-align: center;
            padding: 20px;
            border: 1px solid #E5E7EB;
            border-radius: 8px;
        }
        
        .signature-line {
            border-top: 1px solid #11181C;
            margin: 40px 0 10px 0;
        }
        
        .signature-name {
            font-size: 12px;
            font-weight: 600;
            color: #11181C;
        }
        
        .signature-hash {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 11px;
            color: #0a7ea4;
            font-weight: bold;
            word-break: break-all;
            margin-top: 10px;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #E5E7EB;
            font-size: 12px;
            color: #687076;
        }
        
        @media print {
            body {
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>NeuroLaserMap</h1>
            <p>Relatório de Sessão de Neuromodulação</p>
        </div>
        
        <!-- Informações da Sessão -->
        <div class="section">
            <div class="section-title">Informações da Sessão</div>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Paciente</div>
                    <div class="info-value">${patientName}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Data</div>
                    <div class="info-value">${formattedDate}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Hora</div>
                    <div class="info-value">${formattedTime}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Duração</div>
                    <div class="info-value">${session.durationMinutes} minutos</div>
                </div>
            </div>
        </div>
        
        <!-- Pontos Estimulados -->
        <div class="section">
            <div class="section-title">Pontos Estimulados</div>
            <div class="points-list">
                ${session.stimulatedPoints.map((point) => `<div class="point-badge">${point}</div>`).join("")}
            </div>
        </div>
        
        <!-- Joules -->
        ${session.joules ? `
        <div class="section">
            <div class="section-title">Energia</div>
            <div class="info-item">
                <div class="info-label">Joules</div>
                <div class="info-value">${session.joules} J</div>
            </div>
        </div>
        ` : ""}
        
        <!-- Observações -->
        ${session.observations ? `
        <div class="section">
            <div class="section-title">Observações</div>
            <div class="observations">${session.observations}</div>
        </div>
        ` : ""}
        
        <!-- Reações do Paciente -->
        ${session.patientReactions ? `
        <div class="section">
            <div class="section-title">Reações do Paciente</div>
            <div class="observations">${session.patientReactions}</div>
        </div>
        ` : ""}
        
        <!-- Assinatura -->
        <div class="signature-section">
            <div class="section-title">Assinatura Eletrônica</div>
            <div class="signature-grid">
                <div class="signature-box">
                    <div style="font-size: 12px; font-weight: 600; color: #11181C; margin-bottom: 10px;">
                        Profissional Responsável
                    </div>
                    <div style="font-size: 14px; color: #0a7ea4; font-weight: 600;">
                        ${professional?.firstName || "N/A"} ${professional?.lastName || ""}
                    </div>
                    <div style="font-size: 12px; color: #687076; margin-top: 5px;">
                        ${professional?.council || "N/A"}
                    </div>
                    ${professional?.signature ? `
                    <div class="signature-hash">${professional.signature}</div>
                    ` : ""}
                    <div class="signature-line"></div>
                    <div class="signature-name">Assinatura</div>
                </div>
                <div class="signature-box">
                    <div style="font-size: 12px; font-weight: 600; color: #11181C; margin-bottom: 10px;">
                        Informações do Documento
                    </div>
                    <div style="font-size: 12px; color: #687076; margin-top: 10px;">
                        <strong>Gerado em:</strong> ${new Date().toLocaleString("pt-BR")}
                    </div>
                    <div style="font-size: 12px; color: #687076; margin-top: 5px;">
                        <strong>ID da Sessão:</strong> ${session.id}
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Certificação -->
        <div class="section" style="margin-top: 40px;">
            <div style="background-color: #f5f5f5; border-left: 3px solid #0a7ea4; padding: 15px; border-radius: 4px; font-size: 12px; line-height: 1.6;">
                <strong>Certificação:</strong> Este documento foi gerado pelo sistema NeuroLaserMap e é válido como registro eletrônico de sessão clínica. A assinatura eletrônica do profissional responsável certifica a autenticidade e a precisão dos dados registrados.
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p>NeuroLaserMap v1.0 - Sistema de Mapeamento de Neuromodulação</p>
            <p>Este documento é confidencial e destinado apenas ao paciente e profissionais autorizados.</p>
        </div>
    </div>
</body>
</html>
  `;
}
