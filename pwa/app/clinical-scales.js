/**
 * Escalas Clínicas Integradas - NeuroLaserMap
 * Escalas padronizadas em Português do Brasil
 */

const CLINICAL_SCALES = {
  // Escala do Comer (Eating Assessment Tool - EAT-10)
  comer: {
    id: 'comer',
    name: 'Escala do Comer (EAT-10)',
    description: 'Avaliação de dificuldades de deglutição',
    questions: [
      { id: 1, text: 'Meu peso tem diminuído sem que eu esteja tentando perder peso?' },
      { id: 2, text: 'Tenho dificuldade para engolir alimentos sólidos?' },
      { id: 3, text: 'Tenho dificuldade para engolir bebidas?' },
      { id: 4, text: 'Tenho dificuldade para engolir medicamentos?' },
      { id: 5, text: 'Sinto que os alimentos ficam presos na minha garganta?' },
      { id: 6, text: 'Tenho dor ao engolir?' },
      { id: 7, text: 'Tenho que fazer esforço extra para engolir?' },
      { id: 8, text: 'Engolir é prejudicial para mim?' },
      { id: 9, text: 'Tenho dificuldade para engolir saliva?' },
      { id: 10, text: 'Preciso beber água para ajudar a engolir alimentos?' }
    ],
    scale: 'Likert 0-4 (0=Não, 4=Sempre)',
    maxScore: 40,
    interpretation: {
      normal: { min: 0, max: 2, meaning: 'Sem risco de disfagia' },
      risk: { min: 3, max: 40, meaning: 'Risco de disfagia - Recomenda-se avaliação' }
    }
  },

  // Escala Breve de Zumbido (Tinnitus Handicap Inventory - THI)
  zumbido: {
    id: 'zumbido',
    name: 'Escala Breve de Zumbido (THI)',
    description: 'Avaliação do impacto do zumbido na qualidade de vida',
    questions: [
      { id: 1, text: 'O zumbido causa dificuldade de concentração?' },
      { id: 2, text: 'O zumbido causa dificuldade para dormir?' },
      { id: 3, text: 'O zumbido causa frustração?' },
      { id: 4, text: 'O zumbido causa dificuldade em atividades sociais?' },
      { id: 5, text: 'O zumbido afeta sua qualidade de vida?' },
      { id: 6, text: 'O zumbido causa ansiedade?' },
      { id: 7, text: 'O zumbido causa depressão?' },
      { id: 8, text: 'O zumbido causa irritabilidade?' },
      { id: 9, text: 'O zumbido causa dificuldade no trabalho?' },
      { id: 10, text: 'O zumbido causa sensação de desespero?' }
    ],
    scale: 'Likert 0-4 (0=Não, 4=Sim, sempre)',
    maxScore: 40,
    interpretation: {
      mild: { min: 0, max: 16, meaning: 'Zumbido leve' },
      moderate: { min: 17, max: 28, meaning: 'Zumbido moderado' },
      severe: { min: 29, max: 40, meaning: 'Zumbido severo' }
    }
  },

  // Escala de Boston (Boston Naming Test - BNT)
  boston: {
    id: 'boston',
    name: 'Escala de Boston (BNT)',
    description: 'Avaliação de nomeação de objetos e linguagem',
    questions: [
      { id: 1, text: 'Capacidade de nomear objetos comuns' },
      { id: 2, text: 'Capacidade de nomear objetos menos frequentes' },
      { id: 3, text: 'Capacidade de nomear partes de objetos' },
      { id: 4, text: 'Capacidade de nomear ações' },
      { id: 5, text: 'Compreensão de instruções verbais' },
      { id: 6, text: 'Compreensão de perguntas' },
      { id: 7, text: 'Capacidade de repetir palavras' },
      { id: 8, text: 'Capacidade de repetir frases' },
      { id: 9, text: 'Fluência verbal' },
      { id: 10, text: 'Clareza da fala' }
    ],
    scale: 'Likert 0-4 (0=Não consegue, 4=Perfeito)',
    maxScore: 40,
    interpretation: {
      normal: { min: 36, max: 40, meaning: 'Linguagem normal' },
      mild: { min: 28, max: 35, meaning: 'Déficit leve' },
      moderate: { min: 16, max: 27, meaning: 'Déficit moderado' },
      severe: { min: 0, max: 15, meaning: 'Déficit severo' }
    }
  },

  // Escala SARA (Scale for the Assessment and Rating of Ataxia)
  sara: {
    id: 'sara',
    name: 'Escala SARA',
    description: 'Avaliação de ataxia cerebelar',
    questions: [
      { id: 1, text: 'Marcha (0-8)' },
      { id: 2, text: 'Postura (0-4)' },
      { id: 3, text: 'Fala (0-6)' },
      { id: 4, text: 'Nistagmo (0-4)' },
      { id: 5, text: 'Movimento ocular (0-4)' },
      { id: 6, text: 'Dismetria de membros superiores (0-8)' },
      { id: 7, text: 'Dismetria de membros inferiores (0-4)' },
      { id: 8, text: 'Disartria (0-4)' }
    ],
    scale: 'Escala específica por item (0-40)',
    maxScore: 40,
    interpretation: {
      normal: { min: 0, max: 3, meaning: 'Sem ataxia' },
      mild: { min: 4, max: 12, meaning: 'Ataxia leve' },
      moderate: { min: 13, max: 24, meaning: 'Ataxia moderada' },
      severe: { min: 25, max: 40, meaning: 'Ataxia severa' }
    }
  },

  // Questionário de Comunicação Social (QCS)
  qcs: {
    id: 'qcs',
    name: 'Questionário de Comunicação Social (QCS)',
    description: 'Avaliação de habilidades de comunicação social',
    questions: [
      { id: 1, text: 'Dificuldade em iniciar conversas?' },
      { id: 2, text: 'Dificuldade em manter contato visual?' },
      { id: 3, text: 'Dificuldade em compreender expressões faciais?' },
      { id: 4, text: 'Dificuldade em reconhecer emoções alheias?' },
      { id: 5, text: 'Dificuldade em expressar emoções?' },
      { id: 6, text: 'Dificuldade em seguir regras de conversação?' },
      { id: 7, text: 'Dificuldade em compreender linguagem figurada?' },
      { id: 8, text: 'Dificuldade em fazer amizades?' },
      { id: 9, text: 'Dificuldade em manter amizades?' },
      { id: 10, text: 'Dificuldade em trabalhar em grupo?' }
    ],
    scale: 'Likert 0-4 (0=Não, 4=Sempre)',
    maxScore: 40,
    interpretation: {
      normal: { min: 0, max: 10, meaning: 'Comunicação social normal' },
      mild: { min: 11, max: 20, meaning: 'Dificuldade leve' },
      moderate: { min: 21, max: 30, meaning: 'Dificuldade moderada' },
      severe: { min: 31, max: 40, meaning: 'Dificuldade severa' }
    }
  }
};

/**
 * Renderiza formulário de escala clínica
 */
function renderClinicalScaleForm(scaleId, containerId) {
  const scale = CLINICAL_SCALES[scaleId];
  if (!scale) return;

  const container = document.getElementById(containerId);
  if (!container) return;

  const html = `
    <div style="background:var(--surface);border-radius:12px;padding:16px">
      <h3 style="font-size:14px;font-weight:600;margin-bottom:12px">${scale.name}</h3>
      <p style="font-size:12px;color:var(--muted);margin-bottom:16px">${scale.description}</p>
      
      <form id="scale-form-${scaleId}" style="display:flex;flex-direction:column;gap:12px">
        ${scale.questions.map((q, idx) => `
          <div style="background:var(--bg);padding:12px;border-radius:8px">
            <label style="font-size:12px;font-weight:600;color:var(--foreground);display:block;margin-bottom:8px">
              ${idx + 1}. ${q.text}
            </label>
            <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px">
              ${[0,1,2,3,4].map(val => `
                <label style="text-align:center;cursor:pointer">
                  <input type="radio" name="q${q.id}" value="${val}" style="margin-right:4px">
                  <span style="font-size:11px">${val}</span>
                </label>
              `).join('')}
            </div>
          </div>
        `).join('')}
        
        <button type="button" class="btn-p" onclick="submitClinicalScale('${scaleId}')" style="justify-content:center;margin-top:12px">
          Calcular Resultado
        </button>
      </form>
      
      <div id="scale-result-${scaleId}" style="margin-top:16px;display:none"></div>
    </div>
  `;

  container.innerHTML = html;
}

/**
 * Calcula resultado da escala clínica
 */
function submitClinicalScale(scaleId) {
  const scale = CLINICAL_SCALES[scaleId];
  if (!scale) return;

  const form = document.getElementById(`scale-form-${scaleId}`);
  if (!form) return;

  let totalScore = 0;
  let answeredCount = 0;

  scale.questions.forEach(q => {
    const input = form.querySelector(`input[name="q${q.id}"]:checked`);
    if (input) {
      totalScore += parseInt(input.value);
      answeredCount++;
    }
  });

  if (answeredCount !== scale.questions.length) {
    toast('Por favor, responda todas as questões');
    return;
  }

  // Encontrar interpretação
  let interpretation = 'Resultado não classificado';
  for (const [key, range] of Object.entries(scale.interpretation)) {
    if (totalScore >= range.min && totalScore <= range.max) {
      interpretation = range.meaning;
      break;
    }
  }

  const resultDiv = document.getElementById(`scale-result-${scaleId}`);
  resultDiv.innerHTML = `
    <div style="background:#f0f8ff;border-left:4px solid var(--primary);padding:12px;border-radius:8px">
      <div style="font-size:12px;color:var(--muted);margin-bottom:4px">Score Total</div>
      <div style="font-size:24px;font-weight:bold;color:var(--primary);margin-bottom:8px">${totalScore}/${scale.maxScore}</div>
      <div style="font-size:12px;color:var(--foreground)">${interpretation}</div>
      <button class="btn-s" style="width:100%;margin-top:12px;background:var(--primary);color:#fff" onclick="saveScaleResult('${scaleId}',${totalScore})">
        Salvar Resultado
      </button>
    </div>
  `;
  resultDiv.style.display = 'block';
}

/**
 * Salva resultado da escala
 */
async function saveScaleResult(scaleId, score) {
  const scale = CLINICAL_SCALES[scaleId];
  if (!scale) return;

  const result = {
    id: Date.now().toString(),
    scaleId,
    scaleName: scale.name,
    score,
    maxScore: scale.maxScore,
    date: new Date().toISOString(),
    timestamp: new Date().toLocaleDateString('pt-BR')
  };

  // Salvar no localStorage
  const K = { SR: 'scale_results' };
  const existingResults = JSON.parse(localStorage.getItem(K.SR) || '[]');
  existingResults.push(result);
  localStorage.setItem(K.SR, JSON.stringify(existingResults));

  toast(`Resultado da ${scale.name} salvo com sucesso!`);
  
  // Limpar formulário
  document.getElementById(`scale-form-${scaleId}`).reset();
  document.getElementById(`scale-result-${scaleId}`).style.display = 'none';
}

/**
 * Renderiza gráfico de evolução de escala
 */
async function renderScaleProgressChart(scaleId, canvasId) {
  await loadChartJS();

  const K = { SR: 'scale_results' };
  const results = JSON.parse(localStorage.getItem(K.SR) || '[]');
  const scaleResults = results.filter(r => r.scaleId === scaleId).sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );

  if (scaleResults.length === 0) {
    document.getElementById(canvasId).parentElement.innerHTML = 
      '<div style="text-align:center;color:var(--muted);padding:20px">Nenhum resultado registrado</div>';
    return;
  }

  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  const scale = CLINICAL_SCALES[scaleId];
  const labels = scaleResults.map(r => r.timestamp);
  const data = scaleResults.map(r => r.score);

  if (ctx.chart) {
    ctx.chart.destroy();
  }

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: scale.name,
          data: data,
          borderColor: '#0a7ea4',
          backgroundColor: 'rgba(10, 126, 164, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: '#0a7ea4',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          labels: { color: 'var(--fg)', font: { size: 12 } }
        },
        title: {
          display: true,
          text: `Evolução - ${scale.name}`,
          color: 'var(--fg)',
          font: { size: 14, weight: 'bold' }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: scale.maxScore,
          ticks: { color: 'var(--muted)', stepSize: Math.ceil(scale.maxScore / 5) },
          grid: { color: 'var(--border)', drawBorder: false }
        },
        x: {
          ticks: { color: 'var(--muted)' },
          grid: { color: 'var(--border)', drawBorder: false }
        }
      }
    }
  });

  ctx.chart = chart;
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.CLINICAL_SCALES = CLINICAL_SCALES;
  window.renderClinicalScaleForm = renderClinicalScaleForm;
  window.submitClinicalScale = submitClinicalScale;
  window.saveScaleResult = saveScaleResult;
  window.renderScaleProgressChart = renderScaleProgressChart;
}
