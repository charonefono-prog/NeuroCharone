/**
 * Dashboard de Progresso - Gráficos de Evolução
 * Utiliza Chart.js para visualização de dados clínicos
 */

// Importar Chart.js dinamicamente
const loadChartJS = () => {
  return new Promise((resolve) => {
    if (typeof Chart !== 'undefined') {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
    script.onload = resolve;
    document.head.appendChild(script);
  });
};

/**
 * Cria gráfico de evolução de sintomas ao longo das sessões
 */
async function createSymptomProgressChart(canvasId, sessions, patientName) {
  await loadChartJS();
  
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  
  // Preparar dados
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(a.sessionDate) - new Date(b.sessionDate)
  );
  
  const labels = sortedSessions.map((s, i) => `Sessão ${i + 1}`);
  const scores = sortedSessions.map(s => s.symptomScore || 0);
  
  // Calcular linha de tendência
  const trend = calculateTrend(scores);
  
  // Destruir gráfico anterior se existir
  if (ctx.chart) {
    ctx.chart.destroy();
  }
  
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Score de Sintomas',
          data: scores,
          borderColor: '#0a7ea4',
          backgroundColor: 'rgba(10, 126, 164, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: '#0a7ea4',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        },
        {
          label: 'Tendência',
          data: trend,
          borderColor: '#FF6B6B',
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0,
          tension: 0.4,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: 'var(--fg)',
            font: { size: 12 }
          }
        },
        title: {
          display: true,
          text: `Evolução de Sintomas - ${patientName}`,
          color: 'var(--fg)',
          font: { size: 14, weight: 'bold' }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 10,
          ticks: {
            color: 'var(--muted)',
            stepSize: 2
          },
          grid: {
            color: 'var(--border)',
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: 'var(--muted)'
          },
          grid: {
            color: 'var(--border)',
            drawBorder: false
          }
        }
      }
    }
  });
  
  ctx.chart = chart;
  return chart;
}

/**
 * Cria gráfico de comparação Baseline vs. Atual
 */
async function createBaselineComparisonChart(canvasId, baselineScore, currentScore, patientName) {
  await loadChartJS();
  
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  
  const improvement = baselineScore - currentScore;
  const improvementPercent = ((improvement / baselineScore) * 100).toFixed(1);
  
  // Destruir gráfico anterior se existir
  if (ctx.chart) {
    ctx.chart.destroy();
  }
  
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Baseline (Inicial)', 'Atual'],
      datasets: [
        {
          label: 'Score de Sintomas',
          data: [baselineScore, currentScore],
          backgroundColor: [
            'rgba(255, 107, 107, 0.7)',
            improvement > 0 ? 'rgba(34, 197, 94, 0.7)' : 'rgba(255, 107, 107, 0.7)'
          ],
          borderColor: [
            '#FF6B6B',
            improvement > 0 ? '#22C55E' : '#FF6B6B'
          ],
          borderWidth: 2,
          borderRadius: 8
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: `Comparação: Baseline vs. Atual - ${patientName}`,
          color: 'var(--fg)',
          font: { size: 14, weight: 'bold' }
        },
        tooltip: {
          callbacks: {
            afterLabel: function(context) {
              if (context.dataIndex === 1) {
                return `Melhora: ${improvement > 0 ? '↓' : '↑'} ${Math.abs(improvement)} pontos (${improvementPercent}%)`;
              }
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 10,
          ticks: {
            color: 'var(--muted)',
            stepSize: 2
          },
          grid: {
            color: 'var(--border)',
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: 'var(--muted)'
          },
          grid: {
            color: 'var(--border)',
            drawBorder: false
          }
        }
      }
    }
  });
  
  ctx.chart = chart;
  return chart;
}

/**
 * Cria gráfico de distribuição de pontos estimulados
 */
async function createPointsDistributionChart(canvasId, sessions) {
  await loadChartJS();
  
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  
  // Contar frequência de cada ponto
  const pointCounts = {};
  sessions.forEach(s => {
    (s.stimulatedPoints || []).forEach(point => {
      pointCounts[point] = (pointCounts[point] || 0) + 1;
    });
  });
  
  const sortedPoints = Object.entries(pointCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10); // Top 10 pontos
  
  // Cores por região
  const regionColors = {
    'ref': '#999999',
    'fa': '#FF69B4',
    'fam': '#FFA500',
    'fm': '#FFFF00',
    'csm': '#00FF00',
    'temp': '#00BFFF',
    'par': '#8A2BE2',
    'oa': '#FF4500',
    'occ': '#DC143C'
  };
  
  const colors = sortedPoints.map(([point]) => {
    // Determinar região do ponto
    const region = getPointRegion(point);
    return regionColors[region] || '#999';
  });
  
  // Destruir gráfico anterior se existir
  if (ctx.chart) {
    ctx.chart.destroy();
  }
  
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sortedPoints.map(([point]) => point),
      datasets: [
        {
          label: 'Frequência de Estimulação',
          data: sortedPoints.map(([, count]) => count),
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1,
          borderRadius: 4
        }
      ]
    },
    options: {
      indexAxis: 'x',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Pontos Mais Estimulados',
          color: 'var(--fg)',
          font: { size: 14, weight: 'bold' }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: 'var(--muted)',
            stepSize: 1
          },
          grid: {
            color: 'var(--border)',
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: 'var(--muted)'
          },
          grid: {
            color: 'var(--border)',
            drawBorder: false
          }
        }
      }
    }
  });
  
  ctx.chart = chart;
  return chart;
}

/**
 * Calcula linha de tendência usando regressão linear
 */
function calculateTrend(data) {
  if (data.length < 2) return data;
  
  const n = data.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = data.reduce((a, b) => a + b, 0);
  const sumXY = data.reduce((sum, y, i) => sum + i * y, 0);
  const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  return data.map((_, i) => intercept + slope * i);
}

/**
 * Obtém a região de um ponto baseado no sistema 10-20
 */
function getPointRegion(pointId) {
  const regions = {
    'Nz': 'ref', 'Iz': 'ref',
    'Fp1': 'fa', 'Fp2': 'fa', 'Fpz': 'fa',
    'AF3': 'fam', 'AF4': 'fam', 'AFz': 'fam',
    'F3': 'fm', 'F4': 'fm', 'F7': 'fm', 'F8': 'fm', 'Fz': 'fm',
    'FC1': 'csm', 'FC2': 'csm', 'FC5': 'csm', 'FC6': 'csm',
    'C3': 'csm', 'C4': 'csm', 'Cz': 'csm',
    'CP1': 'csm', 'CP2': 'csm', 'CP5': 'csm', 'CP6': 'csm',
    'T3': 'temp', 'T4': 'temp', 'T5': 'temp', 'T6': 'temp',
    'P3': 'par', 'P4': 'par', 'Pz': 'par',
    'PO3': 'oa', 'POz': 'oa', 'PO4': 'oa',
    'O1': 'occ', 'O2': 'occ', 'Oz': 'occ'
  };
  return regions[pointId] || 'ref';
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.createSymptomProgressChart = createSymptomProgressChart;
  window.createBaselineComparisonChart = createBaselineComparisonChart;
  window.createPointsDistributionChart = createPointsDistributionChart;
}
