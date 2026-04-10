import { describe, it, expect, beforeEach } from 'vitest';
import {
  savePatient,
  getPatients,
  updatePatient,
  saveSession,
  getSessions,
  savePlan,
  getPlansByPatient,
  type Patient,
  type Session,
} from '@/lib/local-storage';
import {
  saveScaleResponse,
  getPatientScaleResponses,
} from '@/lib/scale-storage';
import { ScaleType } from '@/lib/clinical-scales';
import type { ScaleResponse } from '@/lib/clinical-scales';

describe('End-to-End Flow - Complete Clinical Workflow', () => {
  const testPatientData = {
    fullName: 'Maria Santos',
    birthDate: '1990-05-15',
    diagnosis: 'Disfonia Funcional',
    phone: '11988888888',
    email: 'maria@example.com',
    status: 'active' as const,
  };

  beforeEach(async () => {
    localStorage.clear();
  });

  it('should create patient and verify data', async () => {
    const patient = await savePatient(testPatientData);
    expect(patient.id).toBeDefined();
    expect(patient.fullName).toBe('Maria Santos');
    expect(patient.status).toBe('active');

    const patients = await getPatients();
    expect(patients.length).toBeGreaterThan(0);

    const createdPatient = patients.find((p: Patient) => p.id === patient.id);
    expect(createdPatient).toBeDefined();
    expect(createdPatient?.diagnosis).toBe('Disfonia Funcional');
  });

  it('should apply clinical scale and record response', async () => {
    const patient = await savePatient(testPatientData);

    const scaleResponse: ScaleResponse = {
      id: `scale_${Date.now()}`,
      patientId: patient.id,
      patientName: 'Maria Santos',
      scaleType: 'doss' as ScaleType,
      scaleName: 'Escala do Comer (DOSS)',
      date: new Date().toISOString().split('T')[0],
      answers: {
        doss_1: 7,
        doss_2: 6,
        doss_3: 5,
      },
      totalScore: 18,
      interpretation: 'Disfagia leve',
      notes: 'Avaliação inicial',
    };

    const saved = await saveScaleResponse(scaleResponse);
    expect(saved).toBe(true);

    const responses = await getPatientScaleResponses(patient.id);
    expect(responses.length).toBeGreaterThan(0);
    expect(responses[0].totalScore).toBe(18);
  });

  it('should record session with stimulated points', async () => {
    const patient = await savePatient(testPatientData);
    const plan = await savePlan({
      patientId: patient.id,
      objective: 'Melhorar qualidade vocal',
      targetRegions: ['Laringe'],
      targetPoints: ['Fp1', 'Fp2'],
      frequency: 2,
      totalDuration: 30,
      isActive: true,
    });

    const session = await saveSession({
      patientId: patient.id,
      planId: plan.id,
      sessionDate: new Date().toISOString().split('T')[0],
      durationMinutes: 30,
      stimulatedPoints: ['Fp1', 'Fp2', 'F3', 'F4'],
      joules: 100,
      symptomScore: 7,
      observations: 'Sessão inicial com bons resultados',
    });

    expect(session.id).toBeDefined();
    expect(session.durationMinutes).toBe(30);
    expect(session.stimulatedPoints.length).toBe(4);

    const sessions = await getSessions();
    const savedSession = sessions.find((s: Session) => s.id === session.id);
    expect(savedSession).toBeDefined();
  });

  it('should complete full workflow: patient → plan → scale → session', async () => {
    // 1. Criar paciente
    const patient = await savePatient(testPatientData);
    expect(patient.id).toBeDefined();

    // 2. Criar plano terapêutico
    const plan = await savePlan({
      patientId: patient.id,
      objective: 'Melhora vocal',
      targetRegions: ['Laringe'],
      targetPoints: ['Fp1', 'Fp2'],
      frequency: 2,
      totalDuration: 30,
      isActive: true,
    });
    expect(plan.id).toBeDefined();

    // 3. Aplicar escala
    const scaleResponse: ScaleResponse = {
      id: `scale_${Date.now()}`,
      patientId: patient.id,
      patientName: 'Maria Santos',
      scaleType: 'doss' as ScaleType,
      scaleName: 'Escala do Comer (DOSS)',
      date: new Date().toISOString().split('T')[0],
      answers: {
        doss_1: 7,
      },
      totalScore: 7,
      interpretation: 'Normal',
      notes: 'Primeira avaliação',
    };

    const saved = await saveScaleResponse(scaleResponse);
    expect(saved).toBe(true);

    // 4. Registrar sessão
    const session = await saveSession({
      patientId: patient.id,
      planId: plan.id,
      sessionDate: new Date().toISOString().split('T')[0],
      durationMinutes: 30,
      stimulatedPoints: ['Fp1', 'Fp2'],
      joules: 100,
      symptomScore: 8,
      observations: 'Primeira sessão',
    });
    expect(session.id).toBeDefined();

    // 5. Verificar dados completos
    const patients = await getPatients();
    const patientData = patients.find((p: Patient) => p.id === patient.id);
    expect(patientData).toBeDefined();

    const responses = await getPatientScaleResponses(patient.id);
    expect(responses.length).toBeGreaterThan(0);

    const sessions = await getSessions();
    const sessionData = sessions.find((s: Session) => s.id === session.id);
    expect(sessionData).toBeDefined();

    // 6. Verificar plano
    const plans = await getPlansByPatient(patient.id);
    expect(plans.length).toBeGreaterThan(0);
  });

  it('should update patient status to completed', async () => {
    // 1. Criar paciente
    const patient = await savePatient(testPatientData);
    expect(patient.status).toBe('active');

    // 2. Marcar como concluído
    const updated = await updatePatient(patient.id, { status: 'completed' });
    expect(updated).toBeDefined();
    expect(updated?.status).toBe('completed');

    // 3. Verificar atualização
    const patients = await getPatients();
    const updatedPatient = patients.find((p: Patient) => p.id === patient.id);
    expect(updatedPatient?.status).toBe('completed');
  });

  it('should verify PDF export data structure', async () => {
    // 1. Criar paciente
    const patient = await savePatient(testPatientData);

    // 2. Aplicar escala
    const scaleResponse: ScaleResponse = {
      id: `scale_${Date.now()}`,
      patientId: patient.id,
      patientName: 'Maria Santos',
      scaleType: 'doss' as ScaleType,
      scaleName: 'Escala do Comer (DOSS)',
      date: new Date().toISOString().split('T')[0],
      answers: {
        doss_1: 7,
      },
      totalScore: 7,
      interpretation: 'Normal',
      notes: 'Avaliação',
    };

    await saveScaleResponse(scaleResponse);

    // 3. Verificar que dados estão prontos para PDF
    const patients = await getPatients();
    const patientData = patients.find((p: Patient) => p.id === patient.id);
    const responses = await getPatientScaleResponses(patient.id);

    // Verificar estrutura de dados para PDF
    expect(patientData).toBeDefined();
    expect(patientData?.fullName).toBeTruthy();
    expect(patientData?.diagnosis).toBeTruthy();
    expect(patientData?.birthDate).toBeTruthy();

    expect(responses.length).toBeGreaterThan(0);
    expect(responses[0].totalScore).toBe(7);
    expect(responses[0].scaleName).toBe('Escala do Comer (DOSS)');
  });
});
