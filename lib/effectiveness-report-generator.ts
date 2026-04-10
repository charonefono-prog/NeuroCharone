/**
 * Gerador de Relatórios de Efetividade em HTML
 * Cria documentos visuais com gráficos de progresso por protocolo e região
 */

import type { Session, TherapeuticPlan, Patient } from '@/lib/local-storage';

interface ProtocolStats {
  protocol: string;
  totalSessions: number;
  completedSessions: number;
  averageSymptomScore: number;
  improvementRate: number;
  targetRegions: string[];
  sessionDates: string[];
  symptomScores: number[];
}

interface RegionStats {
  region: string;
  sessionCount: number;
  averageSymptomScore: number;
  improvementRate: number;
}

export function generateEffectivenessReportHTML(
  patient: Patient,
  sessions: Session[],
  plans: TherapeuticPlan[]
): string {
  // Calcular estatísticas por protocolo
  const protocolStats = calculateProtocolStats(sessions, plans);
  const regionStats = calculateRegionStats(sessions, plans);
  const generalMetrics = calculateGeneralMetrics(sessions, plans);

  // Gerar gráficos em SVG
  const protocolCharts = protocolStats.map(stat => generateProtocolChart(stat));
  const regionChart = generateRegionChart(regionStats);
  const timelineChart = generateTimelineChart(protocolStats);

  return `
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
            font-family: 'Segoe UI', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #f5f7fa;
            padding: 40px 20px;
            line-height: 1.6;
            color: #2c3e50;
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            padding: 50px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
        }

        /* Header */
        .header {
            border-bottom: 3px solid #667eea;
            margin-bottom: 40px;
            padding-bottom: 30px;
        }

        .header h1 {
            color: #1a3a52;
            font-size: 32px;
            margin-bottom: 8px;
        }

        .header .subtitle {
            color: #7f8c8d;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .patient-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e8eef7;
        }

        .info-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .info-label {
            font-size: 11px;
            font-weight: 700;
            color: #667eea;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .info-value {
            font-size: 16px;
            color: #2c3e50;
            font-weight: 500;
        }

        /* Seções */
        .section {
            margin-bottom: 40px;
            page-break-inside: avoid;
        }

        .section h2 {
            color: #1a3a52;
            font-size: 20px;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 3px solid #667eea;
            font-weight: 700;
        }

        /* Métricas */
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 20px;
        }

        .metric-card {
            background: linear-gradient(135deg, #f8f9ff 0%, #f0f3ff 100%);
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            text-align: center;
        }

        .metric-label {
            font-size: 11px;
            font-weight: 700;
            color: #667eea;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }

        .metric-value {
            font-size: 28px;
            font-weight: 700;
            color: #1a3a52;
        }

        .metric-unit {
            font-size: 12px;
            color: #7f8c8d;
            font-weight: 500;
        }

        /* Gráficos */
        .chart-container {
            margin-bottom: 30px;
            padding: 20px;
            background: #f8f9ff;
            border-radius: 8px;
            overflow-x: auto;
        }

        .chart-title {
            font-size: 14px;
            font-weight: 700;
            color: #1a3a52;
            margin-bottom: 15px;
        }

        svg {
            max-width: 100%;
            height: auto;
        }

        /* Tabelas */
        .table-container {
            overflow-x: auto;
            margin-bottom: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }

        thead {
            background: #f0f3ff;
            border-bottom: 2px solid #667eea;
        }

        th {
            padding: 12px;
            text-align: left;
            font-weight: 700;
            color: #667eea;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.5px;
        }

        td {
            padding: 12px;
            border-bottom: 1px solid #e8eef7;
            color: #2c3e50;
        }

        tbody tr:hover {
            background: #f8f9ff;
        }

        /* Rodapé */
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e8eef7;
            text-align: center;
            color: #7f8c8d;
            font-size: 12px;
        }

        /* Impressão */
        @media print {
            body {
                background: white;
                padding: 0;
            }

            .container {
                box-shadow: none;
                padding: 40px;
                max-width: 100%;
            }

            .section {
                page-break-inside: avoid;
            }

            .chart-container {
                page-break-inside: avoid;
            }
        }

        @media (max-width: 768px) {
            .container {
                padding: 20px;
            }

            .patient-info {
                grid-template-columns: 1fr;
            }

            .metrics-grid {
                grid-template-columns: 1fr;
            }

            table {
                font-size: 12px;
            }

            th, td {
                padding: 8px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>Relatório de Efetividade</h1>
            <div class="subtitle">NeuroLaserMap - Sistema de Mapeamento de Neuromodulação</div>
            
            <div class="patient-info">
                <div class="info-item">
                    <div class="info-label">Paciente</div>
                    <div class="info-value">${patient.fullName}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Data do Relatório</div>
                    <div class="info-value">${new Date().toLocaleDateString('pt-BR')}</div>
                </div>
                ${patient.diagnosis ? `
                <div class="info-item">
                    <div class="info-label">Diagnóstico</div>
                    <div class="info-value">${patient.diagnosis}</div>
                </div>
                ` : ''}
                <div class="info-item">
                    <div class="info-label">Total de Sessões</div>
                    <div class="info-value">${sessions.length}</div>
                </div>
            </div>
        </div>

        <!-- Métricas Gerais -->
        <div class="section">
            <h2>Resumo Geral</h2>
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-label">Sessões Realizadas</div>
                    <div class="metric-value">${generalMetrics.completedSessions}</div>
                    <div class="metric-unit">de ${generalMetrics.totalSessions}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Taxa de Conclusão</div>
                    <div class="metric-value">${generalMetrics.completionRate}%</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Planos Ativos</div>
                    <div class="metric-value">${generalMetrics.activePlans}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Score Médio</div>
                    <div class="metric-value">${generalMetrics.averageScore.toFixed(1)}</div>
                    <div class="metric-unit">de 10</div>
                </div>
            </div>
        </div>

        <!-- Gráfico de Timeline -->
        ${timelineChart ? `
        <div class="section">
            <h2>Evolução Temporal</h2>
            <div class="chart-container">
                ${timelineChart}
            </div>
        </div>
        ` : ''}

        <!-- Efetividade por Protocolo -->
        ${protocolStats.length > 0 ? `
        <div class="section">
            <h2>Análise por Protocolo</h2>
            ${protocolStats.map((stat, idx) => `
            <div style="margin-bottom: 30px; page-break-inside: avoid;">
                <h3 style="font-size: 16px; color: #1a3a52; margin-bottom: 15px; font-weight: 600;">
                    ${stat.protocol}
                </h3>
                
                <div class="metrics-grid" style="margin-bottom: 20px;">
                    <div class="metric-card">
                        <div class="metric-label">Sessões</div>
                        <div class="metric-value">${stat.completedSessions}/${stat.totalSessions}</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Score Médio</div>
                        <div class="metric-value">${stat.averageSymptomScore.toFixed(1)}</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Taxa de Melhora</div>
                        <div class="metric-value" style="color: #27ae60;">${stat.improvementRate.toFixed(0)}%</div>
                    </div>
                </div>

                <div class="chart-container">
                    <div class="chart-title">Progresso de Sintomas</div>
                    ${protocolCharts[idx] || '<p>Sem dados disponíveis</p>'}
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Score</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${stat.sessionDates.map((date, i) => `
                            <tr>
                                <td>${new Date(date).toLocaleDateString('pt-BR')}</td>
                                <td>${stat.symptomScores[i]?.toFixed(1) || 'N/A'}</td>
                                <td>${stat.symptomScores[i] ? '✓ Registrado' : '○ Sem registro'}</td>
                            </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            `).join('')}
        </div>
        ` : ''}

        <!-- Análise por Região -->
        ${regionStats.length > 0 ? `
        <div class="section">
            <h2>Análise por Região Cerebral</h2>
            <div class="chart-container">
                ${regionChart}
            </div>
            
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Região</th>
                            <th>Sessões</th>
                            <th>Score Médio</th>
                            <th>Taxa de Melhora</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${regionStats.map(stat => `
                        <tr>
                            <td><strong>${stat.region}</strong></td>
                            <td>${stat.sessionCount}</td>
                            <td>${stat.averageSymptomScore.toFixed(1)}</td>
                            <td style="color: #27ae60; font-weight: 600;">${stat.improvementRate.toFixed(0)}%</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        ` : ''}

        <!-- Rodapé -->
        <div class="footer">
            <p>NeuroLaserMap - Relatório de Efetividade</p>
            <p style="margin-top: 8px; font-size: 11px;">Gerado em ${new Date().toLocaleString('pt-BR')}</p>
        </div>
    </div>
</body>
</html>
  `.trim();
}

function calculateProtocolStats(sessions: Session[], plans: TherapeuticPlan[]): ProtocolStats[] {
  const stats: Record<string, ProtocolStats> = {};

  plans.forEach(plan => {
    const planSessions = sessions.filter(s => s.planId === plan.id);
    const completedSessions = planSessions.filter(s => new Date(s.sessionDate) < new Date());

    const symptomScores = planSessions
      .filter(s => s.symptomScore !== undefined)
      .map(s => s.symptomScore || 0);

    const initialScore = Math.max(...symptomScores, 0);
    const finalScore = Math.min(...symptomScores, 10);
    const improvementRate = initialScore > 0 ? ((initialScore - finalScore) / initialScore) * 100 : 0;

    stats[plan.id] = {
      protocol: plan.objective,
      totalSessions: planSessions.length,
      completedSessions: completedSessions.length,
      averageSymptomScore: symptomScores.length > 0 ? symptomScores.reduce((a, b) => a + b) / symptomScores.length : 0,
      improvementRate: Math.max(0, improvementRate),
      targetRegions: plan.targetRegions,
      sessionDates: planSessions.map(s => s.sessionDate),
      symptomScores: planSessions.map(s => s.symptomScore || 0),
    };
  });

  return Object.values(stats).sort((a, b) => b.completedSessions - a.completedSessions);
}

function calculateRegionStats(sessions: Session[], plans: TherapeuticPlan[]): RegionStats[] {
  const stats: Record<string, RegionStats> = {};

  plans.forEach(plan => {
    plan.targetRegions.forEach(region => {
      if (!stats[region]) {
        stats[region] = {
          region,
          sessionCount: 0,
          averageSymptomScore: 0,
          improvementRate: 0,
        };
      }

      const planSessions = sessions.filter(s => s.planId === plan.id);
      stats[region].sessionCount += planSessions.length;

      const scores = planSessions.filter(s => s.symptomScore !== undefined).map(s => s.symptomScore || 0);
      if (scores.length > 0) {
        stats[region].averageSymptomScore = (stats[region].averageSymptomScore * (stats[region].sessionCount - planSessions.length) + scores.reduce((a, b) => a + b)) / stats[region].sessionCount;
      }
    });
  });

  return Object.values(stats).sort((a, b) => b.sessionCount - a.sessionCount);
}

function calculateGeneralMetrics(sessions: Session[], plans: TherapeuticPlan[]) {
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => new Date(s.sessionDate) < new Date()).length;
  const allScores = sessions.filter(s => s.symptomScore !== undefined).map(s => s.symptomScore || 0);
  const averageScore = allScores.length > 0 ? allScores.reduce((a, b) => a + b) / allScores.length : 0;
  const activePlans = plans.filter(p => p.isActive).length;

  return {
    totalSessions,
    completedSessions,
    averageScore,
    activePlans,
    completionRate: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0,
  };
}

function generateProtocolChart(stat: ProtocolStats): string {
  if (stat.symptomScores.length === 0) return '';

  const width = 600;
  const height = 300;
  const padding = 40;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  const maxScore = 10;
  const points = stat.symptomScores.map((score, i) => {
    const x = padding + (i / (stat.symptomScores.length - 1 || 1)) * chartWidth;
    const y = height - padding - (score / maxScore) * chartHeight;
    return `${x},${y}`;
  });

  const polyline = points.join(' ');

  return `
    <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Grid -->
      <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#e8eef7" stroke-width="2"/>
      <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#e8eef7" stroke-width="2"/>
      
      <!-- Y-axis labels -->
      ${[0, 2.5, 5, 7.5, 10].map(val => {
        const y = height - padding - (val / maxScore) * chartHeight;
        return `<text x="${padding - 10}" y="${y + 4}" text-anchor="end" font-size="11" fill="#7f8c8d">${val}</text>`;
      }).join('')}
      
      <!-- Line chart -->
      <polyline points="${polyline}" fill="none" stroke="#667eea" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      
      <!-- Points -->
      ${stat.symptomScores.map((score, i) => {
        const x = padding + (i / (stat.symptomScores.length - 1 || 1)) * chartWidth;
        const y = height - padding - (score / maxScore) * chartHeight;
        return `<circle cx="${x}" cy="${y}" r="5" fill="#667eea" stroke="white" stroke-width="2"/>`;
      }).join('')}
    </svg>
  `;
}

function generateRegionChart(regions: RegionStats[]): string {
  if (regions.length === 0) return '';

  const width = 600;
  const height = 300;
  const padding = 40;
  const barWidth = (width - 2 * padding) / regions.length - 10;

  return `
    <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Grid -->
      <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#e8eef7" stroke-width="2"/>
      <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#e8eef7" stroke-width="2"/>
      
      <!-- Bars -->
      ${regions.map((region, i) => {
        const x = padding + i * (barWidth + 10);
        const barHeight = (region.averageSymptomScore / 10) * (height - 2 * padding);
        const y = height - padding - barHeight;
        return `
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="#667eea" rx="4"/>
          <text x="${x + barWidth / 2}" y="${height - padding + 20}" text-anchor="middle" font-size="11" fill="#2c3e50">${region.region}</text>
          <text x="${x + barWidth / 2}" y="${y - 5}" text-anchor="middle" font-size="12" font-weight="bold" fill="#667eea">${region.averageSymptomScore.toFixed(1)}</text>
        `;
      }).join('')}
    </svg>
  `;
}

function generateTimelineChart(protocols: ProtocolStats[]): string {
  if (protocols.length === 0) return '';

  const width = 600;
  const height = 250;
  const padding = 40;

  return `
    <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Title -->
      <text x="${width / 2}" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="#1a3a52">Progresso Geral dos Protocolos</text>
      
      <!-- Grid -->
      <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#e8eef7" stroke-width="1"/>
      
      <!-- Bars -->
      ${protocols.slice(0, 5).map((protocol, i) => {
        const barWidth = (width - 2 * padding) / protocols.slice(0, 5).length - 5;
        const x = padding + i * (barWidth + 5);
        const barHeight = (protocol.improvementRate / 100) * (height - 2 * padding);
        const y = height - padding - barHeight;
        return `
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="#27ae60" rx="3"/>
          <text x="${x + barWidth / 2}" y="${height - padding + 15}" text-anchor="middle" font-size="10" fill="#2c3e50">${protocol.protocol.substring(0, 10)}</text>
          <text x="${x + barWidth / 2}" y="${y - 5}" text-anchor="middle" font-size="11" font-weight="bold" fill="#27ae60">${protocol.improvementRate.toFixed(0)}%</text>
        `;
      }).join('')}
    </svg>
  `;
}
