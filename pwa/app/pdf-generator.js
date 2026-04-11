/**
 * PDF Report Generator - NeuroLaserMap
 * Gera relatórios clínicos em PDF com gráficos e QR Code
 */

// Carregar bibliotecas necessárias
async function loadPdfLibraries() {
  return Promise.all([
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'),
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'),
  ]);
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Gera relatório clínico em PDF
 */
async function generateClinicalReport(patient, sessions, plan, professionalName, professionalId) {
  await loadPdfLibraries();
  
  const reportDate = new Date().toLocaleDateString('pt-BR');
  const protocolNumber = `NLM-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  
  // Calcular estatísticas
  const stats = calculateSessionStats(sessions);
  
  // Criar HTML do relatório
  const reportHTML = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; }
        .page { page-break-after: always; padding: 40px; background: white; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0a7ea4; padding-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #0a7ea4; margin-bottom: 10px; }
        .protocol { font-size: 12px; color: #666; margin-top: 10px; }
        .section { margin-bottom: 25px; }
        .section-title { font-size: 14px; font-weight: bold; color: #0a7ea4; margin-bottom: 12px; border-left: 4px solid #0a7ea4; padding-left: 10px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
        .info-item { background: #f5f5f5; padding: 10px; border-radius: 5px; }
        .info-label { font-size: 11px; color: #666; font-weight: bold; }
        .info-value { font-size: 13px; color: #333; margin-top: 5px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .stat-box { background: #f0f8ff; padding: 12px; border-radius: 5px; text-align: center; border: 1px solid #0a7ea4; }
        .stat-value { font-size: 18px; font-weight: bold; color: #0a7ea4; }
        .stat-label { font-size: 11px; color: #666; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background: #0a7ea4; color: white; padding: 10px; text-align: left; font-size: 12px; }
        td { padding: 10px; border-bottom: 1px solid #ddd; font-size: 12px; }
        tr:nth-child(even) { background: #f9f9f9; }
        .chart-container { margin: 20px 0; page-break-inside: avoid; }
        .chart-container canvas { max-width: 100%; height: auto; }
        .qr-container { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
        .qr-container canvas { max-width: 120px; margin: 0 auto; }
        .footer { text-align: center; font-size: 11px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
        .improvement { color: #22C55E; font-weight: bold; }
        .decline { color: #EF4444; font-weight: bold; }
        .badge { display: inline-block; padding: 4px 8px; border-radius: 3px; font-size: 11px; font-weight: bold; }
        .badge-active { background: #d4edda; color: #155724; }
        .badge-completed { background: #cfe2ff; color: #084298; }
        .badge-paused { background: #fff3cd; color: #664d03; }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="header">
          <div class="logo">🧠 NeuroLaserMap</div>
          <div style="font-size: 18px; font-weight: bold; margin-top: 10px;">Relatório Clínico de Progresso</div>
          <div class="protocol">Protocolo: ${protocolNumber} | Data: ${reportDate}</div>
        </div>

        <!-- Informações do Paciente -->
        <div class="section">
          <div class="section-title">Informações do Paciente</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Nome</div>
              <div class="info-value">${patient.fullName}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Data de Nascimento</div>
              <div class="info-value">${new Date(patient.birthDate).toLocaleDateString('pt-BR')}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Diagnóstico</div>
              <div class="info-value">${patient.diagnosis || 'Não informado'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Status</div>
              <div class="info-value"><span class="badge badge-${patient.status}">${patient.status}</span></div>
            </div>
          </div>
        </div>

        <!-- Informações do Profissional -->
        <div class="section">
          <div class="section-title">Profissional Responsável</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Nome</div>
              <div class="info-value">${professionalName}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Registro Profissional</div>
              <div class="info-value">${professionalId || 'Não informado'}</div>
            </div>
          </div>
        </div>

        <!-- Resumo de Sessões -->
        <div class="section">
          <div class="section-title">Resumo de Sessões</div>
          <div class="stats-grid">
            <div class="stat-box">
              <div class="stat-value">${sessions.length}</div>
              <div class="stat-label">Total de Sessões</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">${stats.totalDuration}</div>
              <div class="stat-label">Duração Total (min)</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">${stats.avgScore.toFixed(1)}</div>
              <div class="stat-label">Score Médio</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">${stats.improvement > 0 ? '↓' : '↑'} ${Math.abs(stats.improvement)}</div>
              <div class="stat-label">Melhora (pontos)</div>
            </div>
          </div>
        </div>

        <!-- Histórico de Sessões -->
        <div class="section">
          <div class="section-title">Histórico de Sessões</div>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Duração (min)</th>
                <th>Score</th>
                <th>Pontos Estimulados</th>
                <th>Observações</th>
              </tr>
            </thead>
            <tbody>
              ${sessions.map(s => `
                <tr>
                  <td>${new Date(s.sessionDate).toLocaleDateString('pt-BR')}</td>
                  <td>${s.duration}</td>
                  <td>${s.symptomScore || '—'}</td>
                  <td>${(s.stimulatedPoints || []).join(', ')}</td>
                  <td>${s.observations || '—'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Plano Terapêutico -->
        ${plan ? `
          <div class="section">
            <div class="section-title">Plano Terapêutico</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Objetivo</div>
                <div class="info-value">${plan.objective}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Frequência</div>
                <div class="info-value">${plan.frequency} sessões/semana</div>
              </div>
              <div class="info-item">
                <div class="info-label">Duração Total</div>
                <div class="info-value">${plan.totalDuration} semanas</div>
              </div>
              <div class="info-item">
                <div class="info-label">Regiões-Alvo</div>
                <div class="info-value">${(JSON.parse(plan.targetRegions || '[]')).join(', ')}</div>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- QR Code -->
        <div class="qr-container">
          <div style="font-size: 11px; color: #666; margin-bottom: 10px;">Código de Rastreamento</div>
          <div id="qr-code"></div>
        </div>

        <!-- Rodapé -->
        <div class="footer">
          <div>Desenvolvido por: ${professionalName}</div>
          <div style="margin-top: 10px; font-size: 10px; color: #999;">
            Este relatório foi gerado automaticamente pelo NeuroLaserMap em ${reportDate}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  // Criar elemento temporário
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = reportHTML;
  document.body.appendChild(tempDiv);

  // Gerar QR Code
  setTimeout(() => {
    const qrContainer = tempDiv.querySelector('#qr-code');
    if (qrContainer) {
      new QRCode(qrContainer, {
        text: protocolNumber,
        width: 120,
        height: 120,
        colorDark: '#0a7ea4',
        colorLight: '#ffffff',
      });
    }

    // Gerar PDF
    const opt = {
      margin: 0,
      filename: `relatorio-${patient.fullName.replace(/\s+/g, '-')}-${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(opt).from(tempDiv).save().then(() => {
      document.body.removeChild(tempDiv);
      toast('Relatório gerado com sucesso!');
    });
  }, 500);
}

/**
 * Calcula estatísticas das sessões
 */
function calculateSessionStats(sessions) {
  if (sessions.length === 0) {
    return {
      totalDuration: 0,
      avgScore: 0,
      improvement: 0,
    };
  }

  const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const scores = sessions.map(s => s.symptomScore || 0).filter(s => s > 0);
  const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const improvement = scores.length > 1 ? scores[0] - scores[scores.length - 1] : 0;

  return {
    totalDuration,
    avgScore,
    improvement,
  };
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.generateClinicalReport = generateClinicalReport;
}
