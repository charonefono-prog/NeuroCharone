// Sincronização Bidirecional de Pontos e Filtro por Região Cerebral

class PointSynchronizer {
  constructor() {
    this.selectedPoints = new Set();
    this.visibleRegions = new Set(['fa', 'fam', 'fm', 'csm', 'temp', 'par', 'oa', 'occ', 'ref']);
    this.helmet2D = null;
    this.listeners = [];
  }

  // Registrar listener para mudanças de pontos
  onPointsChanged(callback) {
    this.listeners.push(callback);
  }

  // Notificar listeners sobre mudanças
  notifyListeners() {
    this.listeners.forEach(cb => cb(Array.from(this.selectedPoints)));
  }

  // Adicionar ponto à seleção
  addPoint(pointName) {
    this.selectedPoints.add(pointName);
    this.notifyListeners();
    this.updateGallery();
  }

  // Remover ponto da seleção
  removePoint(pointName) {
    this.selectedPoints.delete(pointName);
    this.notifyListeners();
    this.updateGallery();
  }

  // Toggle ponto (adicionar ou remover)
  togglePoint(pointName) {
    if (this.selectedPoints.has(pointName)) {
      this.removePoint(pointName);
    } else {
      this.addPoint(pointName);
    }
  }

  // Limpar seleção
  clearPoints() {
    this.selectedPoints.clear();
    this.notifyListeners();
    this.updateGallery();
  }

  // Obter pontos selecionados
  getSelectedPoints() {
    return Array.from(this.selectedPoints);
  }

  // Filtrar por região
  setVisibleRegions(regions) {
    this.visibleRegions = new Set(regions);
    if (this.helmet2D) {
      this.helmet2D.redraw();
    }
  }

  // Obter todas as regiões disponíveis
  getAllRegions() {
    return ['fa', 'fam', 'fm', 'csm', 'temp', 'par', 'oa', 'occ', 'ref'];
  }

  // Atualizar galeria de evolução com pontos selecionados
  updateGallery() {
    const galleryItems = document.querySelectorAll('[data-session-id]');
    galleryItems.forEach(item => {
      const sessionId = item.getAttribute('data-session-id');
      const sessionData = getSessData(sessionId);
      
      if (sessionData && sessionData.points) {
        // Destacar items que contêm pontos selecionados
        const hasSelectedPoints = sessionData.points.some(p => this.selectedPoints.has(p));
        
        if (hasSelectedPoints) {
          item.style.border = '3px solid var(--primary)';
          item.style.boxShadow = '0 0 10px var(--primary)';
        } else {
          item.style.border = '1px solid var(--border)';
          item.style.boxShadow = 'none';
        }
      }
    });
  }

  // Sincronizar com visualizador 2D
  setHelmet2D(helmet2D) {
    this.helmet2D = helmet2D;
  }

  // Renderizar controles de filtro por região
  renderRegionFilters() {
    const regions = [
      { id: 'fa', name: 'Frontal Anterior', color: '#E91E63' },
      { id: 'fam', name: 'Frontal Ant-Média', color: '#FF9800' },
      { id: 'fm', name: 'Frontal Média', color: '#FFD700' },
      { id: 'csm', name: 'Central/Sensório-Motor', color: '#00BCD4' },
      { id: 'temp', name: 'Temporal', color: '#4CAF50' },
      { id: 'par', name: 'Parietal', color: '#9C27B0' },
      { id: 'oa', name: 'Occipital Anterior', color: '#673AB7' },
      { id: 'occ', name: 'Occipital', color: '#F44336' }
    ];

    return `
      <div style="margin:12px 0;padding:12px;background:var(--surface);border-radius:8px">
        <strong>Filtrar por Região Cerebral:</strong>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px">
          ${regions.map(r => `
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;padding:6px;border-radius:4px;background:var(--bg)">
              <input type="checkbox" class="region-filter" value="${r.id}" checked onchange="onRegionFilterChange()">
              <span style="width:12px;height:12px;background:${r.color};border-radius:2px"></span>
              <small>${r.name}</small>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Obter regiões selecionadas no filtro
  getSelectedRegionFilters() {
    const checked = document.querySelectorAll('.region-filter:checked');
    return Array.from(checked).map(el => el.value);
  }
}

// Instância global
let pointSynchronizer = new PointSynchronizer();

// Callback para mudanças de filtro de região
function onRegionFilterChange() {
  const selectedRegions = pointSynchronizer.getSelectedRegionFilters();
  pointSynchronizer.setVisibleRegions(selectedRegions);
  
  // Atualizar visualizador 2D
  if (window.planHelmet2D) {
    window.planHelmet2D.visibleRegions = new Set(selectedRegions);
    window.planHelmet2D.redraw();
  }
}

// Renderizar dashboard de histórico de pontos
function renderPointsHistoryDashboard() {
  const sessions = getAllSessions();
  const pointStats = {};

  // Contar ocorrências de cada ponto
  sessions.forEach(session => {
    if (session.points && Array.isArray(session.points)) {
      session.points.forEach(point => {
        if (!pointStats[point]) {
          pointStats[point] = {
            name: point,
            count: 0,
            totalScore: 0,
            avgScore: 0,
            sessions: []
          };
        }
        pointStats[point].count++;
        pointStats[point].totalScore += (session.score || 0);
        pointStats[point].sessions.push(session);
      });
    }
  });

  // Calcular média e ordenar por frequência
  const topPoints = Object.values(pointStats)
    .map(p => ({
      ...p,
      avgScore: p.count > 0 ? (p.totalScore / p.count).toFixed(1) : 0,
      effectiveness: calculatePointEffectiveness(p)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Renderizar tabela
  return `
    <div style="margin:12px 0;padding:12px;background:var(--surface);border-radius:8px">
      <h3>📊 Top 10 Pontos Mais Estimulados</h3>
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead>
          <tr style="background:var(--bg);border-bottom:2px solid var(--border)">
            <th style="padding:8px;text-align:left">Ponto</th>
            <th style="padding:8px;text-align:center">Freq.</th>
            <th style="padding:8px;text-align:center">Score Médio</th>
            <th style="padding:8px;text-align:center">Efetividade</th>
          </tr>
        </thead>
        <tbody>
          ${topPoints.map((p, i) => `
            <tr style="border-bottom:1px solid var(--border);${i % 2 === 0 ? 'background:var(--bg)' : ''}">
              <td style="padding:8px"><strong>${p.name}</strong></td>
              <td style="padding:8px;text-align:center">${p.count}x</td>
              <td style="padding:8px;text-align:center">${p.avgScore}/10</td>
              <td style="padding:8px;text-align:center">
                <span style="background:${getEffectivenessColor(p.effectiveness)};color:white;padding:4px 8px;border-radius:4px;font-weight:bold">
                  ${p.effectiveness}%
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// Calcular efetividade de um ponto
function calculatePointEffectiveness(pointData) {
  if (pointData.count === 0) return 0;
  
  // Efetividade = (Score médio / 10) * 100 * (Frequência / Total de sessões)
  const totalSessions = getAllSessions().length;
  const frequencyFactor = (pointData.count / Math.max(totalSessions, 1)) * 100;
  const scoreFactor = (pointData.avgScore / 10) * 100;
  
  return Math.round((frequencyFactor + scoreFactor) / 2);
}

// Obter cor baseada em efetividade
function getEffectivenessColor(effectiveness) {
  if (effectiveness >= 80) return '#4CAF50'; // Verde
  if (effectiveness >= 60) return '#FFD700'; // Amarelo
  if (effectiveness >= 40) return '#FF9800'; // Laranja
  return '#F44336'; // Vermelho
}

// Renderizar gráfico de distribuição de pontos
function renderPointsDistributionChart() {
  const sessions = getAllSessions();
  const regionStats = {};

  // Contar por região
  sessions.forEach(session => {
    if (session.points && Array.isArray(session.points)) {
      session.points.forEach(point => {
        const pointInfo = HELMET_POINTS_2D[point];
        if (pointInfo) {
          const region = pointInfo.region;
          if (!regionStats[region]) {
            regionStats[region] = 0;
          }
          regionStats[region]++;
        }
      });
    }
  });

  // Renderizar gráfico
  const chartHTML = `
    <div style="margin:12px 0;padding:12px;background:var(--surface);border-radius:8px">
      <h3>🧠 Distribuição de Pontos por Região</h3>
      <canvas id="points-distribution-chart" width="400" height="200"></canvas>
    </div>
  `;

  // Renderizar depois de adicionar ao DOM
  setTimeout(() => {
    const ctx = document.getElementById('points-distribution-chart');
    if (ctx && window.Chart) {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(regionStats).map(r => getRegionName(r)),
          datasets: [{
            data: Object.values(regionStats),
            backgroundColor: [
              '#E91E63', '#FF9800', '#FFD700', '#00BCD4',
              '#4CAF50', '#9C27B0', '#673AB7', '#F44336'
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    }
  }, 100);

  return chartHTML;
}

// Obter nome da região
function getRegionName(regionId) {
  const names = {
    'fa': 'Frontal Anterior',
    'fam': 'Frontal Ant-Média',
    'fm': 'Frontal Média',
    'csm': 'Central/Sensório-Motor',
    'temp': 'Temporal',
    'par': 'Parietal',
    'oa': 'Occipital Anterior',
    'occ': 'Occipital',
    'ref': 'Referência'
  };
  return names[regionId] || regionId;
}

// Obter todas as sessões (função auxiliar)
function getAllSessions() {
  const data = localStorage.getItem('sessions');
  return data ? JSON.parse(data) : [];
}

// Obter dados de uma sessão específica
function getSessData(sessionId) {
  const sessions = getAllSessions();
  return sessions.find(s => s.id === sessionId);
}
