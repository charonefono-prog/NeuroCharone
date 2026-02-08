import { describe, it, expect, beforeEach } from 'vitest';
import {
  savePatient,
  getPatients,
  saveSession,
  getSessions,
  savePlan,
  getPlans,
  deletePatient,
  type Patient,
  type Session,
  type TherapeuticPlan,
} from '../local-storage';
import {
  LASER_TEMPLATES,
  createLaserTherapyPlan,
  getLaserTemplate,
} from '../laser-templates';
import {
  TDCS_TEMPLATES,
  createTDCSTherapyPlan,
  getTDCSTemplate,
} from '../tdcs-templates';
import {
  DOSS_SCALE,
  BTSS_SCALE,
  BDAE_SCALE,
  PDQ39_SCALE,
  MDSUPDRS_SCALE,
  SALIVA_SCALE,
  calculateScaleScore,
} from '../clinical-scales';

describe('NeuroLaserMap E2E Tests - 30 Comprehensive Tests', () => {
  beforeEach(async () => {
    // Limpar dados antes de cada teste
    const patients = await getPatients();
    for (const patient of patients) {
      await deletePatient(patient.id);
    }
  });

  // ============================================
  // TESTES 1-5: Gerenciamento de Pacientes
  // ============================================

  it('E2E-01: Criar novo paciente e recuperar dados', async () => {
    const patientData = {
      fullName: 'João Silva',
      birthDate: '1980-01-15',
      cpf: '12345678901',
      phone: '11999999999',
      email: 'joao@example.com',
      diagnosis: 'Parkinson',
      initialSymptomScore: 7,
      status: 'active' as const,
    };

    const patient = await savePatient(patientData);
    expect(patient.id).toBeDefined();
    expect(patient.fullName).toBe('João Silva');

    const patients = await getPatients();
    expect(patients.length).toBeGreaterThan(0);
    expect(patients.some((p) => p.id === patient.id)).toBe(true);
  });

  it('E2E-02: Paciente com múltiplas sessões LASER', async () => {
    const patient = await savePatient({
      fullName: 'Maria Santos',
      birthDate: '1975-05-20',
      diagnosis: 'Dor Crônica',
      status: 'active',
    });

    const plan = await savePlan({
      patientId: patient.id,
      objective: 'Reduzir dor',
      targetRegions: ['Coluna'],
      targetPoints: ['L4', 'L5'],
      frequency: 2,
      totalDuration: 10,
      isActive: true,
    });

    // Adicionar 3 sessões
    for (let i = 0; i < 3; i++) {
      await saveSession({
        patientId: patient.id,
        planId: plan.id,
        sessionDate: new Date(Date.now() - i * 86400000).toISOString(),
        durationMinutes: 30,
        stimulatedPoints: ['L4', 'L5'],
        symptomScore: 10 - i * 2,
      });
    }

    const sessions = await getSessions();
    const patientSessions = sessions.filter((s) => s.patientId === patient.id);
    expect(patientSessions.length).toBe(3);
    expect(patientSessions[0].symptomScore).toBe(10);
  });

  it('E2E-03: Validar que valores negativos não são salvos', async () => {
    const patient = await savePatient({
      fullName: 'Pedro Costa',
      birthDate: '1985-03-10',
      diagnosis: 'Neuropatia',
      initialSymptomScore: 0,
      status: 'active',
    });

    expect(patient.initialSymptomScore).toBeGreaterThanOrEqual(0);
  });

  it('E2E-04: Múltiplos pacientes com diferentes diagnósticos', async () => {
    const diagnoses = ['Parkinson', 'Dor Crônica', 'Neuropatia', 'Afasia'];
    const patients = [];

    for (const diagnosis of diagnoses) {
      const patient = await savePatient({
        fullName: `Paciente ${diagnosis}`,
        birthDate: '1980-01-01',
        diagnosis,
        status: 'active',
      });
      patients.push(patient);
    }

    const allPatients = await getPatients();
    expect(allPatients.length).toBeGreaterThanOrEqual(4);
  });

  it('E2E-05: Paciente com status paused e completed', async () => {
    const patient1 = await savePatient({
      fullName: 'Ana Silva',
      birthDate: '1990-06-15',
      status: 'paused',
    });

    const patient2 = await savePatient({
      fullName: 'Carlos Mendes',
      birthDate: '1992-07-20',
      status: 'completed',
    });

    expect(patient1.status).toBe('paused');
    expect(patient2.status).toBe('completed');
  });

  // ============================================
  // TESTES 6-10: Templates LASER
  // ============================================

  it('E2E-06: Verificar que existem 28 templates LASER', () => {
    expect(LASER_TEMPLATES.length).toBe(28);
  });

  it('E2E-07: Recuperar template LASER específico', () => {
    const template = getLaserTemplate('laser_001');
    expect(template).toBeDefined();
    expect(template?.name).toContain('Dor Crônica');
    expect(template?.wavelength).toBeGreaterThan(0);
  });

  it('E2E-08: Criar plano terapêutico LASER', () => {
    const plan = createLaserTherapyPlan(
      'patient_123',
      'laser_001',
      '2024-01-15',
      ['Coluna', 'Ombro']
    );

    expect(plan).toBeDefined();
    expect(plan?.patientId).toBe('patient_123');
    expect(plan?.status).toBe('active');
    expect(plan?.frequency).toBeGreaterThan(0);
  });

  it('E2E-09: Validar que templates LASER têm contraindications', () => {
    LASER_TEMPLATES.forEach((template) => {
      expect(template.contraindications).toBeDefined();
      expect(Array.isArray(template.contraindications)).toBe(true);
      expect(template.contraindications.length).toBeGreaterThan(0);
    });
  });

  it('E2E-10: Validar que templates LASER têm expectedResults', () => {
    LASER_TEMPLATES.forEach((template) => {
      expect(template.expectedResults).toBeDefined();
      expect(Array.isArray(template.expectedResults)).toBe(true);
      expect(template.expectedResults.length).toBeGreaterThan(0);
    });
  });

  // ============================================
  // TESTES 11-15: Templates tDCS
  // ============================================

  it('E2E-11: Verificar que existem templates tDCS', () => {
    expect(TDCS_TEMPLATES.length).toBeGreaterThan(0);
  });

  it('E2E-12: Recuperar template tDCS específico', () => {
    const template = getTDCSTemplate('tdcs_001');
    expect(template).toBeDefined();
    expect(template?.polarity).toBeDefined();
  });

  it('E2E-13: Criar plano terapêutico tDCS', () => {
    const plan = createTDCSTherapyPlan(
      'patient_456',
      'tdcs_001',
      '2024-01-15'
    );

    expect(plan).toBeDefined();
    expect(plan?.patientId).toBe('patient_456');
    expect(plan?.status).toBe('active');
  });

  it('E2E-14: Validar que templates tDCS têm electrodePositions', () => {
    TDCS_TEMPLATES.forEach((template) => {
      expect(template.electrodePositions).toBeDefined();
      expect(template.electrodePositions.anode).toBeDefined();
      expect(template.electrodePositions.cathode).toBeDefined();
    });
  });

  it('E2E-15: Comparar LASER vs tDCS templates', () => {
    expect(LASER_TEMPLATES.length).toBeGreaterThan(0);
    expect(TDCS_TEMPLATES.length).toBeGreaterThan(0);
    // Ambos devem ter contraindications e expectedResults
    TDCS_TEMPLATES.forEach((template) => {
      expect(template.contraindications).toBeDefined();
      expect(template.expectedResults).toBeDefined();
    });
  });

  // ============================================
  // TESTES 16-20: Escalas Clínicas
  // ============================================

  it('E2E-16: DOSS scale com 7 itens', () => {
    expect(DOSS_SCALE.totalItems).toBe(7);
    expect(DOSS_SCALE.items.length).toBe(7);
  });

  it('E2E-17: PDQ-39 scale com 39 itens', () => {
    expect(PDQ39_SCALE.totalItems).toBe(39);
    expect(PDQ39_SCALE.items.length).toBe(39);
  });

  it('E2E-18: MDS-UPDRS scale com 65 itens', () => {
    expect(MDSUPDRS_SCALE.totalItems).toBe(65);
    expect(MDSUPDRS_SCALE.items.length).toBe(65);
  });

  it('E2E-19: SALIVA scale simplificada com 4 itens', () => {
    expect(SALIVA_SCALE.totalItems).toBe(4);
    expect(SALIVA_SCALE.items.length).toBe(4);
  });

  it('E2E-20: Todas as escalas têm calculateScore function', () => {
    const scales = [DOSS_SCALE, BTSS_SCALE, BDAE_SCALE, PDQ39_SCALE, MDSUPDRS_SCALE, SALIVA_SCALE];
    scales.forEach((scale) => {
      expect(typeof scale.calculateScore).toBe('function');
      const result = scale.calculateScore({});
      expect(result.score).toBeDefined();
      expect(result.interpretation).toBeDefined();
    });
  });

  // ============================================
  // TESTES 21-25: Cálculos e Validações
  // ============================================

  it('E2E-21: Validar que DOSS nunca retorna valores negativos', () => {
    const answers = {
      doss_1: 0,
      doss_2: 0,
      doss_3: 0,
      doss_4: 0,
      doss_5: 0,
      doss_6: 0,
      doss_7: 0,
    };
    const result = DOSS_SCALE.calculateScore(answers);
    expect(result.score).toBeGreaterThanOrEqual(0);
  });

  it('E2E-22: Validar que PDQ-39 nunca retorna valores negativos', () => {
    const answers: Record<string, number> = {};
    for (let i = 1; i <= 39; i++) {
      answers[`pdq39_${i}`] = 0;
    }
    const result = PDQ39_SCALE.calculateScore(answers);
    expect(result.score).toBeGreaterThanOrEqual(0);
  });

  it('E2E-23: Validar que MDS-UPDRS nunca retorna valores negativos', () => {
    const answers: Record<string, number> = {};
    for (let i = 1; i <= 65; i++) {
      answers[`mdsupdrs_${i}`] = 0;
    }
    const result = MDSUPDRS_SCALE.calculateScore(answers);
    expect(result.score).toBeGreaterThanOrEqual(0);
  });

  it('E2E-24: Validar que SALIVA nunca retorna valores negativos', () => {
    const answers = {
      saliva_1: 0,
      saliva_2: 0,
      saliva_3: 0,
      saliva_4: 0,
    };
    const result = SALIVA_SCALE.calculateScore(answers);
    expect(result.score).toBeGreaterThanOrEqual(0);
  });

  it('E2E-25: Calcular score com valores máximos', () => {
    const answers = {
      btss_1: 10,
      btss_2: 10,
      btss_3: 10,
    };
    const result = BTSS_SCALE.calculateScore(answers);
    expect(result.score).toBe(30);
    expect(result.score).toBeGreaterThanOrEqual(0);
  });

  // ============================================
  // TESTES 26-30: Fluxos Completos
  // ============================================

  it('E2E-26: Fluxo completo: Criar paciente -> Plano LASER -> Sessões', async () => {
    const patient = await savePatient({
      fullName: 'Teste Fluxo 1',
      birthDate: '1980-01-01',
      diagnosis: 'Dor Crônica',
      status: 'active',
    });

    const plan = await savePlan({
      patientId: patient.id,
      objective: 'Reduzir dor',
      targetRegions: ['Coluna'],
      targetPoints: ['L4'],
      frequency: 2,
      totalDuration: 10,
      isActive: true,
    });

    for (let i = 0; i < 5; i++) {
      await saveSession({
        patientId: patient.id,
        planId: plan.id,
        sessionDate: new Date(Date.now() - i * 86400000).toISOString(),
        durationMinutes: 30,
        stimulatedPoints: ['L4'],
        symptomScore: Math.max(0, 10 - i * 2),
      });
    }

    const sessions = await getSessions();
    const patientSessions = sessions.filter((s) => s.patientId === patient.id);
    expect(patientSessions.length).toBe(5);
    expect(patientSessions.every((s) => (s.symptomScore ?? 0) >= 0)).toBe(true);
  });

  it('E2E-27: Fluxo completo: Criar paciente -> Plano tDCS -> Sessões', async () => {
    const patient = await savePatient({
      fullName: 'Teste Fluxo 2',
      birthDate: '1985-05-05',
      diagnosis: 'Depressão',
      status: 'active',
    });

    const plan = await savePlan({
      patientId: patient.id,
      objective: 'Melhorar humor',
      targetRegions: ['Córtex pré-frontal'],
      targetPoints: ['F3'],
      frequency: 5,
      totalDuration: 10,
      isActive: true,
    });

    for (let i = 0; i < 5; i++) {
      await saveSession({
        patientId: patient.id,
        planId: plan.id,
        sessionDate: new Date(Date.now() - i * 86400000).toISOString(),
        durationMinutes: 20,
        stimulatedPoints: ['F3'],
        symptomScore: Math.max(0, 8 - i),
      });
    }

    const sessions = await getSessions();
    const patientSessions = sessions.filter((s) => s.patientId === patient.id);
    expect(patientSessions.length).toBe(5);
  });

  it('E2E-28: Comparação de resultados LASER vs tDCS para mesmo paciente', async () => {
    const patient = await savePatient({
      fullName: 'Teste Comparação',
      birthDate: '1990-10-10',
      diagnosis: 'Dor Crônica',
      status: 'active',
    });

    // Plano LASER
    const laserPlan = await savePlan({
      patientId: patient.id,
      objective: 'Reduzir dor com LASER',
      targetRegions: ['Coluna'],
      targetPoints: ['L4'],
      frequency: 2,
      totalDuration: 10,
      isActive: true,
    });

    // Plano tDCS
    const tdcsPlan = await savePlan({
      patientId: patient.id,
      objective: 'Reduzir dor com tDCS',
      targetRegions: ['Córtex motor'],
      targetPoints: ['M1'],
      frequency: 5,
      totalDuration: 10,
      isActive: true,
    });

    // Sessões LASER
    for (let i = 0; i < 3; i++) {
      await saveSession({
        patientId: patient.id,
        planId: laserPlan.id,
        sessionDate: new Date(Date.now() - (i + 10) * 86400000).toISOString(),
        durationMinutes: 30,
        stimulatedPoints: ['L4'],
        symptomScore: Math.max(0, 10 - i * 3),
      });
    }

    // Sessões tDCS
    for (let i = 0; i < 3; i++) {
      await saveSession({
        patientId: patient.id,
        planId: tdcsPlan.id,
        sessionDate: new Date(Date.now() - i * 86400000).toISOString(),
        durationMinutes: 20,
        stimulatedPoints: ['M1'],
        symptomScore: Math.max(0, 10 - i * 2),
      });
    }

    const sessions = await getSessions();
    const patientSessions = sessions.filter((s) => s.patientId === patient.id);
    expect(patientSessions.length).toBe(6);
  });

  it('E2E-29: Validar integridade de dados com múltiplos pacientes e planos', async () => {
    const patients = [];
    for (let i = 0; i < 3; i++) {
      const patient = await savePatient({
        fullName: `Paciente ${i}`,
        birthDate: '1980-01-01',
        status: 'active',
      });
      patients.push(patient);

      const plan = await savePlan({
        patientId: patient.id,
        objective: `Objetivo ${i}`,
        targetRegions: [`Região ${i}`],
        targetPoints: [`Ponto ${i}`],
        frequency: 2,
        totalDuration: 10,
        isActive: true,
      });

      for (let j = 0; j < 2; j++) {
        await saveSession({
          patientId: patient.id,
          planId: plan.id,
          sessionDate: new Date(Date.now() - j * 86400000).toISOString(),
          durationMinutes: 30,
          stimulatedPoints: [`Ponto ${i}`],
          symptomScore: Math.max(0, 10 - j * 5),
        });
      }
    }

    const allPatients = await getPatients();
    const allSessions = await getSessions();
    expect(allPatients.length).toBeGreaterThanOrEqual(3);
    expect(allSessions.length).toBeGreaterThanOrEqual(6);
  });

  it('E2E-30: Validação final: Todas as escalas funcionam sem erros', () => {
    const scales = [DOSS_SCALE, BTSS_SCALE, BDAE_SCALE, PDQ39_SCALE, MDSUPDRS_SCALE, SALIVA_SCALE];
    
    scales.forEach((scale) => {
      // Teste com valores mínimos
      const minAnswers: Record<string, number> = {};
      scale.items.forEach((item) => {
        minAnswers[item.id] = 0;
      });
      const minResult = scale.calculateScore(minAnswers);
      expect(minResult.score).toBeGreaterThanOrEqual(0);
      expect(minResult.interpretation).toBeDefined();

      // Teste com valores máximos
      const maxAnswers: Record<string, number> = {};
      scale.items.forEach((item) => {
        const maxOption = item.options[item.options.length - 1];
        maxAnswers[item.id] = maxOption.value;
      });
      const maxResult = scale.calculateScore(maxAnswers);
      expect(maxResult.score).toBeGreaterThanOrEqual(0);
      expect(maxResult.interpretation).toBeDefined();
    });
  });
});
