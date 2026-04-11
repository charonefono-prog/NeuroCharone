/**
 * Agendador de Ciclos de Tratamento - NeuroLaserMap
 * Planejamento de próximos ciclos com sugestão de datas baseada em efetividade
 */

/**
 * Calcula sugestão de data para próximo ciclo baseada em efetividade
 */
function suggestNextCycleDate(patientId, sessions, currentPlan) {
  if (!sessions || sessions.length === 0) {
    // Sugerir início imediato se não há sessões
    return new Date();
  }

  // Calcular efetividade do ciclo atual
  const planSessions = sessions.filter(s => s.planId === currentPlan?.id);
  if (planSessions.length === 0) return new Date();

  // Ordenar sessões por data
  const sortedSessions = [...planSessions].sort((a, b) => 
    new Date(a.sessionDate) - new Date(b.sessionDate)
  );

  const firstSession = new Date(sortedSessions[0].sessionDate);
  const lastSession = new Date(sortedSessions[sortedSessions.length - 1].sessionDate);
  const cycleLength = Math.ceil((lastSession - firstSession) / (1000 * 60 * 60 * 24));

  // Calcular melhora
  const firstScore = sortedSessions[0].symptomScore || 0;
  const lastScore = sortedSessions[sortedSessions.length - 1].symptomScore || 0;
  const improvement = firstScore - lastScore;
  const improvementPercent = firstScore > 0 ? (improvement / firstScore) * 100 : 0;

  // Determinar intervalo para próximo ciclo baseado em efetividade
  let intervalDays = 7; // Padrão: 1 semana

  if (improvementPercent >= 50) {
    // Excelente melhora: próximo ciclo em 1 semana
    intervalDays = 7;
  } else if (improvementPercent >= 30) {
    // Boa melhora: próximo ciclo em 2 semanas
    intervalDays = 14;
  } else if (improvementPercent >= 10) {
    // Melhora moderada: próximo ciclo em 3 semanas
    intervalDays = 21;
  } else if (improvementPercent > 0) {
    // Melhora leve: próximo ciclo em 4 semanas
    intervalDays = 28;
  } else {
    // Sem melhora: revisar plano em 2 semanas
    intervalDays = 14;
  }

  const nextDate = new Date(lastSession);
  nextDate.setDate(nextDate.getDate() + intervalDays);

  return {
    suggestedDate: nextDate,
    intervalDays: intervalDays,
    improvement: improvement,
    improvementPercent: improvementPercent.toFixed(1),
    cycleLength: cycleLength,
    recommendation: getRecommendation(improvementPercent)
  };
}

/**
 * Obtém recomendação baseada em efetividade
 */
function getRecommendation(improvementPercent) {
  if (improvementPercent >= 50) {
    return 'Excelente progresso! Continue com o próximo ciclo em breve.';
  } else if (improvementPercent >= 30) {
    return 'Bom progresso. Recomenda-se continuar o tratamento.';
  } else if (improvementPercent >= 10) {
    return 'Progresso moderado. Considere ajustar o plano terapêutico.';
  } else if (improvementPercent > 0) {
    return 'Progresso leve. Recomenda-se revisão do plano.';
  } else {
    return 'Sem melhora significativa. Revisar estratégia de tratamento.';
  }
}

/**
 * Renderiza interface de agendador de ciclos
 */
function renderTreatmentScheduler(patientId, containerId) {
  const K = { P: 'patients', S: 'sessions', CY: 'cycles' };
  const P = JSON.parse(localStorage.getItem(K.P) || '[]');
  const S = JSON.parse(localStorage.getItem(K.S) || '[]');
  const CY = JSON.parse(localStorage.getItem(K.CY) || '[]');

  const patient = P.find(p => p.id === patientId);
  const patientSessions = S.filter(s => s.patientId === patientId);
  const patientCycles = CY.filter(c => c.patientId === patientId);
  const activeCycle = patientCycles.find(c => c.status === 'active');

  const container = document.getElementById(containerId);
  if (!container) return;

  let suggestion = null;
  if (activeCycle) {
    suggestion = suggestNextCycleDate(patientId, patientSessions, activeCycle);
  }

  const html = `
    <div style="background:var(--surface);border-radius:12px;padding:16px">
      <h3 style="font-size:14px;font-weight:600;margin-bottom:12px">Agendador de Ciclos</h3>

      ${activeCycle ? `
        <div style="background:#f0f8ff;border-left:4px solid var(--primary);padding:12px;border-radius:8px;margin-bottom:16px">
          <div style="font-size:12px;color:var(--muted);margin-bottom:4px">Ciclo Atual</div>
          <div style="font-size:13px;font-weight:600;color:var(--foreground)">${activeCycle.objectives}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:4px">
            ${patientSessions.filter(s => s.planId === activeCycle.id).length}/${activeCycle.plannedSessions} sessões
          </div>
        </div>
      ` : `
        <div style="background:#fff3cd;border-left:4px solid #ffc107;padding:12px;border-radius:8px;margin-bottom:16px">
          <div style="font-size:12px;color:#664d03">Nenhum ciclo ativo. Crie um novo ciclo para começar.</div>
        </div>
      `}

      ${suggestion ? `
        <div style="background:var(--bg);padding:12px;border-radius:8px;margin-bottom:16px">
          <div style="font-size:12px;font-weight:600;color:var(--foreground);margin-bottom:8px">Sugestão para Próximo Ciclo</div>
          
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
            <div style="background:var(--surface);padding:8px;border-radius:6px">
              <div style="font-size:10px;color:var(--muted)">Melhora</div>
              <div style="font-size:14px;font-weight:bold;color:${suggestion.improvementPercent >= 30 ? '#22C55E' : '#FFA500'}">${suggestion.improvementPercent}%</div>
            </div>
            <div style="background:var(--surface);padding:8px;border-radius:6px">
              <div style="font-size:10px;color:var(--muted)">Data Sugerida</div>
              <div style="font-size:12px;font-weight:bold;color:var(--primary)">${suggestion.suggestedDate.toLocaleDateString('pt-BR')}</div>
            </div>
          </div>

          <div style="background:var(--surface);padding:8px;border-radius:6px;margin-bottom:12px">
            <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Recomendação</div>
            <div style="font-size:12px;color:var(--foreground)">${suggestion.recommendation}</div>
          </div>

          <button class="btn-s" style="width:100%;background:var(--primary);color:#fff" onclick="createNextCycle('${patientId}','${suggestion.suggestedDate.toISOString()}')">
            Agendar Próximo Ciclo
          </button>
        </div>
      ` : ''}

      <div style="border-top:1px solid var(--border);padding-top:12px">
        <h4 style="font-size:12px;font-weight:600;color:var(--foreground);margin-bottom:8px">Histórico de Ciclos</h4>
        ${patientCycles.length > 0 ? `
          <div style="display:flex;flex-direction:column;gap:8px;max-height:200px;overflow-y:auto">
            ${patientCycles.map(c => `
              <div style="background:var(--bg);padding:8px;border-radius:6px;border-left:3px solid ${c.status === 'active' ? '#0a7ea4' : c.status === 'completed' ? '#22C55E' : '#FFA500'}">
                <div style="font-size:11px;font-weight:600;color:var(--foreground)">${c.objectives}</div>
                <div style="font-size:10px;color:var(--muted);margin-top:2px">
                  ${new Date(c.startDate).toLocaleDateString('pt-BR')} • ${c.plannedSessions} sessões
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div style="font-size:11px;color:var(--muted);text-align:center;padding:12px">Nenhum ciclo registrado</div>
        `}
      </div>
    </div>
  `;

  container.innerHTML = html;
}

/**
 * Cria próximo ciclo de tratamento
 */
function createNextCycle(patientId, startDate) {
  const K = { P: 'patients', CY: 'cycles' };
  const P = JSON.parse(localStorage.getItem(K.P) || '[]');
  const CY = JSON.parse(localStorage.getItem(K.CY) || '[]');

  const patient = P.find(p => p.id === patientId);
  if (!patient) {
    toast('Paciente não encontrado');
    return;
  }

  // Marcar ciclo anterior como completo
  const activeCycle = CY.find(c => c.patientId === patientId && c.status === 'active');
  if (activeCycle) {
    activeCycle.status = 'completed';
    activeCycle.endDate = new Date().toISOString();
  }

  // Criar novo ciclo
  const newCycle = {
    id: Date.now().toString(),
    patientId: patientId,
    patientName: patient.fullName,
    objectives: 'Ciclo de Continuação - ' + new Date().toLocaleDateString('pt-BR'),
    plannedSessions: 10,
    estimatedDuration: 30,
    startDate: startDate || new Date().toISOString(),
    endDate: '',
    frequency: 2,
    intensity: 'moderate',
    status: 'active',
    createdAt: new Date().toISOString()
  };

  CY.push(newCycle);
  localStorage.setItem(K.CY, JSON.stringify(CY));

  toast('Próximo ciclo agendado com sucesso!');
  renderTreatmentScheduler(patientId, 'scheduler-container');
}

/**
 * Exporta plano de ciclos em PDF
 */
async function exportCyclePlan(patientId) {
  const K = { P: 'patients', CY: 'cycles', S: 'sessions' };
  const P = JSON.parse(localStorage.getItem(K.P) || '[]');
  const CY = JSON.parse(localStorage.getItem(K.CY) || '[]');
  const S = JSON.parse(localStorage.getItem(K.S) || '[]');

  const patient = P.find(p => p.id === patientId);
  const patientCycles = CY.filter(c => c.patientId === patientId);
  const patientSessions = S.filter(s => s.patientId === patientId);

  if (!patient) {
    toast('Paciente não encontrado');
    return;
  }

  // Criar HTML do plano
  const html = `
    <div style="font-family:Arial;padding:20px;background:white">
      <h1 style="text-align:center;color:#0a7ea4">Plano de Ciclos de Tratamento</h1>
      <p style="text-align:center;color:#666;margin-bottom:20px">${patient.fullName}</p>

      ${patientCycles.map((cycle, idx) => {
        const cycleSessions = patientSessions.filter(s => s.planId === cycle.id);
        const scores = cycleSessions.map(s => s.symptomScore || 0).filter(s => s > 0);
        const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b) / scores.length).toFixed(1) : '—';
        const improvement = scores.length > 1 ? (scores[0] - scores[scores.length - 1]).toFixed(1) : '—';

        return `
          <div style="page-break-inside:avoid;margin-bottom:20px;border:1px solid #ddd;padding:15px;border-radius:8px">
            <h3 style="color:#0a7ea4;margin-bottom:10px">Ciclo ${idx + 1}: ${cycle.objectives}</h3>
            <table style="width:100%;border-collapse:collapse">
              <tr style="background:#f0f8ff">
                <td style="padding:8px;border:1px solid #ddd"><strong>Data Início</strong></td>
                <td style="padding:8px;border:1px solid #ddd">${new Date(cycle.startDate).toLocaleDateString('pt-BR')}</td>
              </tr>
              <tr>
                <td style="padding:8px;border:1px solid #ddd"><strong>Sessões Planejadas</strong></td>
                <td style="padding:8px;border:1px solid #ddd">${cycle.plannedSessions}</td>
              </tr>
              <tr style="background:#f0f8ff">
                <td style="padding:8px;border:1px solid #ddd"><strong>Sessões Realizadas</strong></td>
                <td style="padding:8px;border:1px solid #ddd">${cycleSessions.length}</td>
              </tr>
              <tr>
                <td style="padding:8px;border:1px solid #ddd"><strong>Score Médio</strong></td>
                <td style="padding:8px;border:1px solid #ddd">${avgScore}</td>
              </tr>
              <tr style="background:#f0f8ff">
                <td style="padding:8px;border:1px solid #ddd"><strong>Melhora</strong></td>
                <td style="padding:8px;border:1px solid #ddd;color:${improvement > 0 ? '#22C55E' : '#FFA500'}">${improvement > 0 ? '↓' : '↑'} ${Math.abs(improvement)}</td>
              </tr>
              <tr>
                <td style="padding:8px;border:1px solid #ddd"><strong>Status</strong></td>
                <td style="padding:8px;border:1px solid #ddd;color:${cycle.status === 'active' ? '#0a7ea4' : cycle.status === 'completed' ? '#22C55E' : '#FFA500'}">${cycle.status}</td>
              </tr>
            </table>
          </div>
        `;
      }).join('')}

      <div style="margin-top:30px;text-align:center;color:#999;font-size:12px">
        <p>Relatório gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
      </div>
    </div>
  `;

  // Gerar PDF
  const element = document.createElement('div');
  element.innerHTML = html;
  document.body.appendChild(element);

  const opt = {
    margin: 10,
    filename: `plano-ciclos-${patient.fullName.replace(/\s+/g, '-')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
  };

  html2pdf().set(opt).from(element).save().then(() => {
    document.body.removeChild(element);
    toast('Plano de ciclos exportado com sucesso!');
  });
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.suggestNextCycleDate = suggestNextCycleDate;
  window.renderTreatmentScheduler = renderTreatmentScheduler;
  window.createNextCycle = createNextCycle;
  window.exportCyclePlan = exportCyclePlan;
}
