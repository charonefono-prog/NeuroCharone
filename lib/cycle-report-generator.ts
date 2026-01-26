/**
 * Gerador de Relatório de Ciclo de Tratamento
 * Cria documentos HTML profissionais com cronograma, metas e recomendações
 */

import type { TherapeuticPlan, Patient } from './local-storage';

export interface TreatmentCycle {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  protocol: string;
  frequency: number;
  expectedSessions: number;
  notes: string;
  status: 'planned' | 'active' | 'completed';
}

export interface CycleReportData {
  patient: Patient;
  cycle: TreatmentCycle;
  plan: TherapeuticPlan | null;
  targetImprovement?: number;
  initialScore?: number;
}

/**
 * Gerar HTML do relatório de ciclo
 */
export function generateCycleReportHTML(data: CycleReportData): string {
  const { patient, cycle, plan, targetImprovement = 30, initialScore = 7 } = data;

  const startDate = new Date(cycle.startDate);
  const endDate = new Date(cycle.endDate);
  const daysTotal = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
  const weeksTotal = Math.ceil(daysTotal / 7);
  const targetScore = Math.max(0, initialScore - (initialScore * targetImprovement) / 100);

  // Gerar cronograma semanal
  const schedule: Array<{ week: number; startDate: string; endDate: string; sessions: number }> = [];
  for (let i = 0; i < weeksTotal; i++) {
    const weekStart = new Date(startDate);
    weekStart.setDate(weekStart.getDate() + i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    schedule.push({
      week: i + 1,
      startDate: weekStart.toLocaleDateString('pt-BR'),
      endDate: weekEnd.toLocaleDateString('pt-BR'),
      sessions: cycle.frequency,
    });
  }

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Plano de Ciclo - ${patient.fullName}</title>
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
      background: #f5f5f5;
    }
    
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #0a7ea4;
    }
    
    .header-left h1 {
      font-size: 28px;
      color: #0a7ea4;
      margin-bottom: 8px;
    }
    
    .header-left p {
      color: #666;
      font-size: 14px;
    }
    
    .header-right {
      text-align: right;
    }
    
    .header-right .label {
      font-size: 11px;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    
    .header-right .value {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
    
    .patient-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
      padding: 20px;
      background: #f9f9f9;
      border-radius: 8px;
      border-left: 4px solid #0a7ea4;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
    }
    
    .info-item label {
      font-size: 12px;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
      font-weight: 600;
    }
    
    .info-item value {
      font-size: 16px;
      color: #333;
      font-weight: 500;
    }
    
    .section {
      margin-bottom: 30px;
    }
    
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #0a7ea4;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e0e0e0;
    }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    }
    
    .metric-card {
      padding: 16px;
      background: #f0f7ff;
      border-radius: 8px;
      border-left: 4px solid #0a7ea4;
      text-align: center;
    }
    
    .metric-card .label {
      font-size: 11px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    
    .metric-card .value {
      font-size: 24px;
      font-weight: 700;
      color: #0a7ea4;
    }
    
    .metric-card .unit {
      font-size: 12px;
      color: #999;
      margin-top: 4px;
    }
    
    .targets-section {
      background: #f0fff4;
      border-left: 4px solid #22c55e;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    
    .targets-section h3 {
      font-size: 14px;
      color: #22c55e;
      margin-bottom: 12px;
      font-weight: 600;
    }
    
    .target-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e0f2e9;
    }
    
    .target-item:last-child {
      border-bottom: none;
    }
    
    .target-label {
      color: #333;
      font-weight: 500;
    }
    
    .target-value {
      color: #22c55e;
      font-weight: 600;
    }
    
    .schedule-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    
    .schedule-table thead {
      background: #0a7ea4;
      color: white;
    }
    
    .schedule-table th {
      padding: 12px;
      text-align: left;
      font-weight: 600;
      font-size: 13px;
    }
    
    .schedule-table td {
      padding: 12px;
      border-bottom: 1px solid #e0e0e0;
      font-size: 14px;
    }
    
    .schedule-table tbody tr:nth-child(even) {
      background: #f9f9f9;
    }
    
    .schedule-table tbody tr:hover {
      background: #f0f7ff;
    }
    
    .week-badge {
      display: inline-block;
      background: #0a7ea4;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 12px;
    }
    
    .regions-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }
    
    .region-badge {
      display: inline-block;
      background: #0a7ea415;
      color: #0a7ea4;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 13px;
      border: 1px solid #0a7ea4;
      font-weight: 500;
    }
    
    .recommendations {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    
    .recommendations h3 {
      font-size: 14px;
      color: #856404;
      margin-bottom: 12px;
      font-weight: 600;
    }
    
    .recommendations ul {
      list-style: none;
      padding-left: 0;
    }
    
    .recommendations li {
      padding: 8px 0;
      color: #856404;
      font-size: 14px;
      border-bottom: 1px solid #ffe69c;
    }
    
    .recommendations li:before {
      content: "✓ ";
      font-weight: 700;
      margin-right: 8px;
    }
    
    .recommendations li:last-child {
      border-bottom: none;
    }
    
    .notes-section {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      border-left: 4px solid #999;
      margin-bottom: 20px;
    }
    
    .notes-section h3 {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
      font-weight: 600;
    }
    
    .notes-section p {
      color: #555;
      font-size: 14px;
      line-height: 1.6;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      color: #999;
      font-size: 12px;
    }
    
    .footer-developer {
      margin-top: 12px;
      padding: 12px;
      background: #f9f9f9;
      border-radius: 6px;
      font-size: 11px;
      color: #666;
    }
    
    @media print {
      body {
        background: white;
      }
      
      .container {
        box-shadow: none;
        padding: 0;
      }
      
      .page-break {
        page-break-after: always;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="header-left">
        <h1>Plano de Ciclo de Tratamento</h1>
        <p>${cycle.name}</p>
      </div>
      <div class="header-right">
        <div class="label">Data de Geração</div>
        <div class="value">${new Date().toLocaleDateString('pt-BR')}</div>
      </div>
    </div>
    
    <!-- Patient Info -->
    <div class="patient-info">
      <div class="info-item">
        <label>Paciente</label>
        <value>${patient.fullName}</value>
      </div>
      <div class="info-item">
        <label>Data de Nascimento</label>
        <value>${new Date(patient.birthDate).toLocaleDateString('pt-BR')}</value>
      </div>
      <div class="info-item">
        <label>Protocolo</label>
        <value>${cycle.protocol}</value>
      </div>
      <div class="info-item">
        <label>Status</label>
        <value>${cycle.status === 'planned' ? 'Planejado' : cycle.status === 'active' ? 'Ativo' : 'Concluído'}</value>
      </div>
    </div>
    
    <!-- Cycle Overview -->
    <div class="section">
      <h2 class="section-title">Visão Geral do Ciclo</h2>
      
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="label">Duração</div>
          <div class="value">${weeksTotal}</div>
          <div class="unit">semanas</div>
        </div>
        <div class="metric-card">
          <div class="label">Frequência</div>
          <div class="value">${cycle.frequency}</div>
          <div class="unit">vezes/semana</div>
        </div>
        <div class="metric-card">
          <div class="label">Sessões Esperadas</div>
          <div class="value">${cycle.expectedSessions}</div>
          <div class="unit">total</div>
        </div>
        <div class="metric-card">
          <div class="label">Período</div>
          <div class="value" style="font-size: 14px;">${startDate.toLocaleDateString('pt-BR')}</div>
          <div class="unit">até ${endDate.toLocaleDateString('pt-BR')}</div>
        </div>
      </div>
    </div>
    
    <!-- Treatment Goals -->
    <div class="section">
      <h2 class="section-title">Metas de Tratamento</h2>
      
      <div class="targets-section">
        <h3>Objetivos de Melhora</h3>
        <div class="target-item">
          <span class="target-label">Score Inicial Esperado</span>
          <span class="target-value">${initialScore.toFixed(1)}</span>
        </div>
        <div class="target-item">
          <span class="target-label">Meta de Melhora</span>
          <span class="target-value">${targetImprovement}%</span>
        </div>
        <div class="target-item">
          <span class="target-label">Score Alvo Esperado</span>
          <span class="target-value">${targetScore.toFixed(1)}</span>
        </div>
      </div>
      
      ${plan && plan.targetRegions.length > 0 ? `
      <div style="margin-top: 16px;">
        <h3 style="font-size: 14px; color: #333; margin-bottom: 12px; font-weight: 600;">Regiões Cerebrais Alvo</h3>
        <div class="regions-list">
          ${plan.targetRegions.map(region => `<span class="region-badge">${region}</span>`).join('')}
        </div>
      </div>
      ` : ''}
    </div>
    
    <!-- Schedule -->
    <div class="section">
      <h2 class="section-title">Cronograma Semanal</h2>
      
      <table class="schedule-table">
        <thead>
          <tr>
            <th>Semana</th>
            <th>Período</th>
            <th>Sessões Planejadas</th>
            <th>Observações</th>
          </tr>
        </thead>
        <tbody>
          ${schedule.map((week, idx) => `
            <tr>
              <td><span class="week-badge">Sem. ${week.week}</span></td>
              <td>${week.startDate} a ${week.endDate}</td>
              <td style="text-align: center; font-weight: 600;">${week.sessions}</td>
              <td>${idx === 0 ? 'Início do ciclo' : idx === schedule.length - 1 ? 'Última semana' : 'Manutenção'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    
    <!-- Recommendations -->
    <div class="section">
      <h2 class="section-title">Recomendações</h2>
      
      <div class="recommendations">
        <h3>Orientações para o Ciclo</h3>
        <ul>
          <li>Manter consistência com a frequência de ${cycle.frequency} sessões por semana</li>
          <li>Registrar score de sintomas ao início e fim de cada semana</li>
          <li>Documentar qualquer reação ou efeito colateral observado</li>
          <li>Manter hidratação adequada durante o tratamento</li>
          <li>Evitar atividades extenuantes 2 horas após as sessões</li>
          <li>Agendar avaliação de progresso na metade do ciclo (semana ${Math.ceil(weeksTotal / 2)})</li>
          <li>Se atingir meta antes do prazo, considerar intensificação do protocolo</li>
        </ul>
      </div>
    </div>
    
    <!-- Notes -->
    ${cycle.notes ? `
    <div class="section">
      <h2 class="section-title">Notas Adicionais</h2>
      <div class="notes-section">
        <p>${cycle.notes}</p>
      </div>
    </div>
    ` : ''}
    
    <!-- Footer -->
    <div class="footer">
      <p>Este documento foi gerado automaticamente pelo NeuroLaserMap</p>

      <p style="margin-top: 12px;">Sistema de Mapeamento de Neuromodulação</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Gerar CSS para impressão
 */
export function getCyclePrintStyles(): string {
  return `
    @media print {
      body { margin: 0; padding: 0; }
      .container { box-shadow: none; }
    }
  `;
}
