/**
 * Captura de Screenshot do Mapeamento 3D - NeuroLaserMap
 * Integração de imagem do capacete com pontos selecionados ao histórico
 * Usa o visualizador 3D interativo existente
 */

// Referência global para o visualizador 3D
let globalHelmet3D = null;

/**
 * Define a referência do visualizador 3D global
 */
function setGlobalHelmet3D(helmet3dInstance) {
  globalHelmet3D = helmet3dInstance;
}

/**
 * Captura screenshot do canvas 3D do capacete
 */
function captureHelmetScreenshot(canvasId) {
  // Tentar encontrar o canvas do visualizador 3D
  let canvas = document.getElementById(canvasId);
  
  // Se não encontrar, procurar por canvas com classe ou ID específico
  if (!canvas) {
    canvas = document.querySelector('canvas[id*="helmet"]');
  }
  if (!canvas) {
    canvas = document.querySelector('canvas');
  }
  
  if (!canvas) {
    console.error('Canvas não encontrado');
    return null;
  }

  try {
    // Converter canvas para data URL (PNG)
    const imageData = canvas.toDataURL('image/png');
    return imageData;
  } catch (e) {
    console.error('Erro ao capturar screenshot:', e);
    return null;
  }
}

/**
 * Salva screenshot do mapeamento com sessão
 */
function saveHelmetScreenshotWithSession(sessionId, canvasId) {
  const screenshot = captureHelmetScreenshot(canvasId);
  if (!screenshot) {
    toast('Erro ao capturar screenshot do mapeamento');
    return false;
  }

  // Salvar no localStorage com chave específica
  const key = `helmet_screenshot_${sessionId}`;
  localStorage.setItem(key, screenshot);

  return true;
}

/**
 * Obtém screenshot de uma sessão
 */
function getSessionScreenshot(sessionId) {
  const key = `helmet_screenshot_${sessionId}`;
  return localStorage.getItem(key);
}

/**
 * Renderiza galeria de screenshots do histórico de evolução
 */
function renderEvolutionGallery(patientId, containerId) {
  const K = { S: 'sessions' };
  const S = JSON.parse(localStorage.getItem(K.S) || '[]');
  
  const patientSessions = S.filter(s => s.patientId === patientId)
    .sort((a, b) => new Date(a.sessionDate) - new Date(b.sessionDate));

  const container = document.getElementById(containerId);
  if (!container) return;

  if (patientSessions.length === 0) {
    container.innerHTML = '<div style="text-align:center;color:var(--muted);padding:20px">Nenhuma sessão registrada</div>';
    return;
  }

  const html = `
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px">
      ${patientSessions.map((session, idx) => {
        const screenshot = getSessionScreenshot(session.id);
        return `
          <div style="background:var(--surface);border-radius:8px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:all 0.2s" onclick="showSessionDetails('${session.id}')" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='transparent'">
            ${screenshot ? `
              <img src="${screenshot}" style="width:100%;height:120px;object-fit:cover;border-bottom:1px solid var(--border)">
            ` : `
              <div style="width:100%;height:120px;background:var(--bg);display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:12px">
                Sem imagem
              </div>
            `}
            <div style="padding:8px">
              <div style="font-size:11px;font-weight:600;color:var(--foreground)">Sessão ${idx + 1}</div>
              <div style="font-size:10px;color:var(--muted);margin-top:2px">${new Date(session.sessionDate).toLocaleDateString('pt-BR')}</div>
              <div style="font-size:10px;color:var(--muted)">Score: ${session.symptomScore || '—'}</div>
              <div style="font-size:9px;color:var(--muted);margin-top:2px">${(session.stimulatedPoints || []).length} pontos</div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  container.innerHTML = html;
}

/**
 * Exibe detalhes da sessão com screenshot
 */
function showSessionDetails(sessionId) {
  const K = { S: 'sessions', P: 'patients' };
  const S = JSON.parse(localStorage.getItem(K.S) || '[]');
  const P = JSON.parse(localStorage.getItem(K.P) || '[]');

  const session = S.find(s => s.id === sessionId);
  if (!session) return;

  const patient = P.find(p => p.id === session.patientId);
  const screenshot = getSessionScreenshot(sessionId);

  const detailsHtml = `
    <div style="text-align:center;margin-bottom:16px">
      <h3 style="font-size:14px;font-weight:600;margin-bottom:8px">Detalhes da Sessão</h3>
      <div style="font-size:12px;color:var(--muted)">${new Date(session.sessionDate).toLocaleDateString('pt-BR')} - ${patient?.fullName}</div>
    </div>

    ${screenshot ? `
      <div style="background:var(--surface);border-radius:8px;padding:12px;margin-bottom:16px;text-align:center">
        <img src="${screenshot}" style="max-width:100%;max-height:300px;border-radius:6px;border:1px solid var(--border)">
        <div style="font-size:11px;color:var(--muted);margin-top:8px">Mapeamento 3D da Sessão com Pontos Selecionados</div>
      </div>
    ` : ''}

    <div style="background:var(--surface);border-radius:8px;padding:12px;margin-bottom:16px">
      <h4 style="font-size:12px;font-weight:600;margin-bottom:8px">Informações da Sessão</h4>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11px">
        <div>
          <div style="color:var(--muted)">Duração</div>
          <div style="font-weight:600;color:var(--foreground)">${session.duration} min</div>
        </div>
        <div>
          <div style="color:var(--muted)">Score de Sintomas</div>
          <div style="font-weight:600;color:var(--foreground)">${session.symptomScore || '—'}/10</div>
        </div>
        <div>
          <div style="color:var(--muted)">Pontos Estimulados</div>
          <div style="font-weight:600;color:var(--foreground)">${(session.stimulatedPoints || []).length}</div>
        </div>
        <div>
          <div style="color:var(--muted)">Intensidade</div>
          <div style="font-weight:600;color:var(--foreground)">${session.intensity || '—'}</div>
        </div>
      </div>
    </div>

    <div style="background:var(--surface);border-radius:8px;padding:12px;margin-bottom:16px">
      <h4 style="font-size:12px;font-weight:600;margin-bottom:8px">Pontos Estimulados (Sistema 10-20)</h4>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        ${(session.stimulatedPoints || []).length > 0 ? (session.stimulatedPoints || []).map(point => `
          <span style="background:var(--primary);color:#fff;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">${point}</span>
        `).join('') : '<span style="color:var(--muted);font-size:11px">Nenhum ponto registrado</span>'}
      </div>
    </div>

    ${session.observations ? `
      <div style="background:var(--surface);border-radius:8px;padding:12px;margin-bottom:16px">
        <h4 style="font-size:12px;font-weight:600;margin-bottom:8px">Observações</h4>
        <div style="font-size:11px;color:var(--foreground);line-height:1.5">${session.observations}</div>
      </div>
    ` : ''}

    <button class="btn-s" style="width:100%;background:var(--primary);color:#fff" onclick="closeM('m-detail')">Fechar</button>
  `;

  document.getElementById('det-content').innerHTML = detailsHtml;
  openM('m-detail');
}

/**
 * Exporta evolução visual em PDF com screenshots
 */
async function exportVisualEvolution(patientId) {
  await loadPdfLibraries();
  
  const K = { P: 'patients', S: 'sessions' };
  const P = JSON.parse(localStorage.getItem(K.P) || '[]');
  const S = JSON.parse(localStorage.getItem(K.S) || '[]');

  const patient = P.find(p => p.id === patientId);
  const patientSessions = S.filter(s => s.patientId === patientId)
    .sort((a, b) => new Date(a.sessionDate) - new Date(b.sessionDate));

  if (!patient || patientSessions.length === 0) {
    toast('Nenhuma sessão para exportar');
    return;
  }

  // Criar HTML com imagens
  let html = `
    <div style="font-family:Arial;padding:20px;background:white">
      <h1 style="text-align:center;color:#0a7ea4;margin-bottom:5px">Evolução Visual do Tratamento</h1>
      <p style="text-align:center;color:#0a7ea4;font-size:14px;margin-bottom:30px">NeuroLaserMap - Mapeamento de Neuromodulação</p>
      <p style="text-align:center;color:#666;margin-bottom:30px">Paciente: <strong>${patient.fullName}</strong></p>
  `;

  // Adicionar screenshots de cada sessão
  patientSessions.forEach((session, idx) => {
    const screenshot = getSessionScreenshot(session.id);
    const pointsList = (session.stimulatedPoints || []).join(', ') || 'Nenhum ponto registrado';
    
    html += `
      <div style="page-break-inside:avoid;margin-bottom:30px;border:1px solid #ddd;padding:15px;border-radius:8px">
        <h3 style="color:#0a7ea4;margin-bottom:10px;border-bottom:2px solid #0a7ea4;padding-bottom:8px">Sessão ${idx + 1}</h3>
        
        ${screenshot ? `
          <div style="text-align:center;margin-bottom:15px">
            <img src="${screenshot}" style="width:100%;max-height:350px;border:1px solid #ddd;border-radius:6px">
            <div style="font-size:11px;color:#666;margin-top:8px;font-style:italic">Visualização 3D do Capacete EEG com Pontos Selecionados</div>
          </div>
        ` : `
          <div style="background:#f0f0f0;padding:40px;text-align:center;color:#999;margin-bottom:15px;border-radius:6px">
            Imagem não disponível
          </div>
        `}
        
        <table style="width:100%;border-collapse:collapse;font-size:12px">
          <tr style="background:#f0f8ff">
            <td style="padding:8px;border:1px solid #ddd;width:30%"><strong>Data</strong></td>
            <td style="padding:8px;border:1px solid #ddd">${new Date(session.sessionDate).toLocaleDateString('pt-BR')}</td>
          </tr>
          <tr>
            <td style="padding:8px;border:1px solid #ddd"><strong>Duração</strong></td>
            <td style="padding:8px;border:1px solid #ddd">${session.duration} minutos</td>
          </tr>
          <tr style="background:#f0f8ff">
            <td style="padding:8px;border:1px solid #ddd"><strong>Score de Sintomas</strong></td>
            <td style="padding:8px;border:1px solid #ddd">${session.symptomScore || '—'}/10</td>
          </tr>
          <tr>
            <td style="padding:8px;border:1px solid #ddd"><strong>Intensidade</strong></td>
            <td style="padding:8px;border:1px solid #ddd">${session.intensity || '—'}</td>
          </tr>
          <tr style="background:#f0f8ff">
            <td style="padding:8px;border:1px solid #ddd"><strong>Pontos Estimulados</strong></td>
            <td style="padding:8px;border:1px solid #ddd">${pointsList}</td>
          </tr>
          ${session.observations ? `
            <tr>
              <td style="padding:8px;border:1px solid #ddd"><strong>Observações</strong></td>
              <td style="padding:8px;border:1px solid #ddd">${session.observations}</td>
            </tr>
          ` : ''}
        </table>
      </div>
    `;
  });

  html += `
    <div style="margin-top:30px;text-align:center;color:#999;font-size:12px;border-top:1px solid #ddd;padding-top:20px">
      <p><strong>Relatório Gerado:</strong> ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
      <p style="font-size:10px">NeuroLaserMap - Sistema de Mapeamento de Neuromodulação</p>
    </div>
    </div>
  `;

  // Gerar PDF
  const element = document.createElement('div');
  element.innerHTML = html;
  document.body.appendChild(element);

  const opt = {
    margin: 10,
    filename: `evolucao-visual-${patient.fullName.replace(/\s+/g, '-')}-${Date.now()}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
  };

  html2pdf().set(opt).from(element).save().then(() => {
    document.body.removeChild(element);
    toast('Evolução visual exportada com sucesso!');
  });
}

/**
 * Função auxiliar para carregar bibliotecas PDF
 */
async function loadPdfLibraries() {
  return Promise.all([
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'),
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

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.setGlobalHelmet3D = setGlobalHelmet3D;
  window.captureHelmetScreenshot = captureHelmetScreenshot;
  window.saveHelmetScreenshotWithSession = saveHelmetScreenshotWithSession;
  window.getSessionScreenshot = getSessionScreenshot;
  window.renderEvolutionGallery = renderEvolutionGallery;
  window.showSessionDetails = showSessionDetails;
  window.exportVisualEvolution = exportVisualEvolution;
}
