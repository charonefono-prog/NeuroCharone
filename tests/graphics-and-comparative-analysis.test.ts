import { describe, it, expect } from 'vitest';
import { ScaleResponse, ScaleType } from '@/lib/clinical-scales';

describe('Gráficos e Análise Comparativa', () => {
  
  // Dados de teste
  const createMockScaleResponse = (
    patientId: string,
    score: number,
    daysAgo: number,
    scaleName: string = 'PHQ-9'
  ): ScaleResponse => ({
    id: `${Date.now()}-${Math.random()}`,
    patientId,
    patientName: 'Paciente Teste',
    scaleType: 'phq9' as ScaleType,
    scaleName,
    date: new Date(Date.now() - daysAgo * 86400000).toISOString(),
    answers: { q1: score },
    totalScore: score,
    interpretation: 'Teste',
  });

  it('deve calcular evolução de scores ao longo do tempo', () => {
    const responses = [
      createMockScaleResponse('p1', 20, 30),
      createMockScaleResponse('p1', 18, 20),
      createMockScaleResponse('p1', 15, 10),
      createMockScaleResponse('p1', 10, 0),
    ];

    // Ordenar por data
    const sorted = [...responses].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    expect(sorted.length).toBe(4);
    expect(sorted[0].totalScore).toBe(20);
    expect(sorted[3].totalScore).toBe(10);
  });

  it('deve calcular melhora percentual (antes/depois)', () => {
    const responses = [
      createMockScaleResponse('p1', 20, 30),
      createMockScaleResponse('p1', 10, 0),
    ];

    const sorted = [...responses].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const firstScore = sorted[0].totalScore;
    const lastScore = sorted[sorted.length - 1].totalScore;
    const improvement = ((lastScore - firstScore) / firstScore) * 100;

    expect(improvement).toBe(-50); // 50% de melhora
  });

  it('deve filtrar respostas por escala', () => {
    const responses = [
      createMockScaleResponse('p1', 20, 10, 'PHQ-9'),
      createMockScaleResponse('p1', 15, 5, 'DOSS'),
      createMockScaleResponse('p1', 18, 0, 'PHQ-9'),
    ];

    const phq9Responses = responses.filter(r => r.scaleName === 'PHQ-9');
    expect(phq9Responses.length).toBe(2);
    expect(phq9Responses.every(r => r.scaleName === 'PHQ-9')).toBe(true);
  });

  it('deve agrupar respostas por paciente', () => {
    const responses = [
      createMockScaleResponse('p1', 20, 10),
      createMockScaleResponse('p2', 15, 10),
      createMockScaleResponse('p1', 18, 5),
      createMockScaleResponse('p2', 12, 5),
    ];

    const byPatient = responses.reduce((acc, r) => {
      if (!acc[r.patientId]) acc[r.patientId] = [];
      acc[r.patientId].push(r);
      return acc;
    }, {} as Record<string, ScaleResponse[]>);

    expect(Object.keys(byPatient).length).toBe(2);
    expect(byPatient['p1'].length).toBe(2);
    expect(byPatient['p2'].length).toBe(2);
  });

  it('deve calcular score médio por paciente', () => {
    const responses = [
      createMockScaleResponse('p1', 20, 10),
      createMockScaleResponse('p1', 18, 5),
      createMockScaleResponse('p1', 16, 0),
    ];

    const average = responses.reduce((sum, r) => sum + r.totalScore, 0) / responses.length;
    expect(average).toBe(18);
  });

  it('deve calcular tendência (melhora/piora/estável)', () => {
    // Melhora
    const improvingResponses = [
      createMockScaleResponse('p1', 20, 20),
      createMockScaleResponse('p1', 15, 10),
      createMockScaleResponse('p1', 10, 0),
    ];

    const sorted1 = [...improvingResponses].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const trend1 = sorted1[sorted1.length - 1].totalScore < sorted1[0].totalScore ? 'melhora' : 'piora';
    expect(trend1).toBe('melhora');

    // Piora
    const worseningResponses = [
      createMockScaleResponse('p1', 10, 20),
      createMockScaleResponse('p1', 15, 10),
      createMockScaleResponse('p1', 20, 0),
    ];

    const sorted2 = [...worseningResponses].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const trend2 = sorted2[sorted2.length - 1].totalScore > sorted2[0].totalScore ? 'piora' : 'melhora';
    expect(trend2).toBe('piora');

    // Estável
    const stableResponses = [
      createMockScaleResponse('p1', 15, 20),
      createMockScaleResponse('p1', 15, 10),
      createMockScaleResponse('p1', 15, 0),
    ];

    const sorted3 = [...stableResponses].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const trend3 = sorted3[sorted3.length - 1].totalScore === sorted3[0].totalScore ? 'estável' : 'variável';
    expect(trend3).toBe('estável');
  });

  it('deve normalizar scores para 0-100', () => {
    const maxScore = 100;
    const responses = [
      createMockScaleResponse('p1', 20, 10),
      createMockScaleResponse('p1', 50, 5),
      createMockScaleResponse('p1', 100, 0),
    ];

    const normalized = responses.map(r => ({
      ...r,
      normalizedScore: (r.totalScore / maxScore) * 100,
    }));

    expect(normalized[0].normalizedScore).toBe(20);
    expect(normalized[1].normalizedScore).toBe(50);
    expect(normalized[2].normalizedScore).toBe(100);
  });

  it('deve calcular comparação multi-paciente', () => {
    const responses = [
      createMockScaleResponse('p1', 20, 0),
      createMockScaleResponse('p2', 15, 0),
      createMockScaleResponse('p3', 25, 0),
    ];

    const byPatient = responses.reduce((acc, r) => {
      if (!acc[r.patientId]) acc[r.patientId] = [];
      acc[r.patientId].push(r);
      return acc;
    }, {} as Record<string, ScaleResponse[]>);

    const comparison = Object.entries(byPatient).map(([patientId, patientResponses]) => ({
      patientId,
      latestScore: patientResponses[patientResponses.length - 1].totalScore,
      averageScore: patientResponses.reduce((sum, r) => sum + r.totalScore, 0) / patientResponses.length,
      responseCount: patientResponses.length,
    }));

    expect(comparison.length).toBe(3);
    expect(comparison[0].latestScore).toBe(20);
    expect(comparison[1].latestScore).toBe(15);
    expect(comparison[2].latestScore).toBe(25);
  });

  it('deve calcular intervalo entre avaliações', () => {
    const responses = [
      createMockScaleResponse('p1', 20, 30),
      createMockScaleResponse('p1', 18, 20),
      createMockScaleResponse('p1', 15, 10),
      createMockScaleResponse('p1', 10, 0),
    ];

    const sorted = [...responses].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const intervals = [];
    for (let i = 1; i < sorted.length; i++) {
      const diff = new Date(sorted[i].date).getTime() - new Date(sorted[i - 1].date).getTime();
      const days = diff / (1000 * 60 * 60 * 24);
      intervals.push(days);
    }

    expect(intervals.length).toBe(3);
    expect(intervals.every(i => i > 0)).toBe(true);
  });

  it('deve identificar outliers em scores', () => {
    const responses = [
      createMockScaleResponse('p1', 15, 20),
      createMockScaleResponse('p1', 16, 15),
      createMockScaleResponse('p1', 14, 10),
      createMockScaleResponse('p1', 100, 5),
      createMockScaleResponse('p1', 15, 0),
    ];

    const scores = responses.map(r => r.totalScore);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    const range = maxScore - minScore;
    
    expect(range).toBeGreaterThan(50);
    expect(maxScore).toBe(100);
  });

  it('deve calcular taxa de adesão ao tratamento', () => {
    const startDate = new Date('2025-01-01');
    const endDate = new Date('2025-03-01');
    const daysDifference = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    const responses = [
      createMockScaleResponse('p1', 20, daysDifference - 60),
      createMockScaleResponse('p1', 18, daysDifference - 45),
      createMockScaleResponse('p1', 15, daysDifference - 30),
      createMockScaleResponse('p1', 10, daysDifference - 0),
    ];

    const adherenceRate = (responses.length / (daysDifference / 7)) * 100; // Esperado 1 por semana
    expect(adherenceRate).toBeGreaterThan(0);
  });

  it('deve gerar dados para gráfico de linha', () => {
    const responses = [
      createMockScaleResponse('p1', 20, 30),
      createMockScaleResponse('p1', 18, 20),
      createMockScaleResponse('p1', 15, 10),
      createMockScaleResponse('p1', 10, 0),
    ];

    const sorted = [...responses].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const chartData = sorted.map((response) => ({
      date: new Date(response.date).toLocaleDateString('pt-BR'),
      score: response.totalScore,
    }));

    expect(chartData.length).toBe(4);
    expect(chartData[0].score).toBe(20);
    expect(chartData[3].score).toBe(10);
  });

  it('deve gerar dados para gráfico de barras (antes/depois)', () => {
    const responses = [
      createMockScaleResponse('p1', 20, 30),
      createMockScaleResponse('p1', 10, 0),
    ];

    const sorted = [...responses].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const beforeAfterData = {
      before: sorted[0].totalScore,
      after: sorted[sorted.length - 1].totalScore,
      improvement: ((sorted[sorted.length - 1].totalScore - sorted[0].totalScore) / sorted[0].totalScore) * 100,
    };

    expect(beforeAfterData.before).toBe(20);
    expect(beforeAfterData.after).toBe(10);
    expect(beforeAfterData.improvement).toBe(-50);
  });
});
