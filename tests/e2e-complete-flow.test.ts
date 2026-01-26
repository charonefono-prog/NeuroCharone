import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  savePatient,
  getPatients,
  updatePatient,
  deletePatient,
  saveSession,
  getSessions,
  savePlan,
  getPlansByPatient,
  type Patient,
  type Session,
  type TherapeuticPlan,
} from '@/lib/local-storage';
import {
  saveScaleResponse,
  getPatientScaleResponses,
  getScaleStatistics,
} from '@/lib/scale-storage';
import type { ScaleResponse } from '@/lib/clinical-scales';
import { ScaleType } from '@/lib/clinical-scales';

describe('End-to-End Complete Clinical Flow', () => {
  const testPatientData = {
    fullName: 'João Silva',
    birthDate: '1985-03-20',
    diagnosis: 'Disfonia Funcional',
    phone: '11987654321',
    email: 'joao.silva@example.com',
    status: 'active' as const,
  };

  let patientId: string;
  let planId: string;

  beforeEach(async () => {
    localStorage.clear();
  });

  afterEach(async () => {
    if (patientId) {
      await deletePatient(patientId);
    }
  });

  describe('Phase 1: Patient Creation and Management', () => {
    it('should create a new patient with complete data', async () => {
      const patient = await savePatient(testPatientData);
      patientId = patient.id;

      expect(patient.id).toBeDefined();
      expect(patient.fullName).toBe('João Silva');
      expect(patient.birthDate).toBe('1985-03-20');
      expect(patient.diagnosis).toBe('Disfonia Funcional');
      expect(patient.status).toBe('active');
      expect(patient.createdAt).toBeDefined();
      expect(patient.updatedAt).toBeDefined();
    });

    it('should retrieve patient from database', async () => {
      const patient = await savePatient(testPatientData);
      patientId = patient.id;

      const patients = await getPatients();
      const retrievedPatient = patients.find((p: Patient) => p.id === patientId);

      expect(retrievedPatient).toBeDefined();
      expect(retrievedPatient?.fullName).toBe('João Silva');
      expect(retrievedPatient?.email).toBe('joao.silva@example.com');
    });

    it('should update patient status', async () => {
      const patient = await savePatient(testPatientData);
      patientId = patient.id;

      const updated = await updatePatient(patientId, { status: 'paused' });
      expect(updated?.status).toBe('paused');

      const patients = await getPatients();
      const updatedPatient = patients.find((p: Patient) => p.id === patientId);
      expect(updatedPatient?.status).toBe('paused');
    });
  });

  describe('Phase 2: Therapeutic Plan Creation', () => {
    it('should create therapeutic plan for patient', async () => {
      const patient = await savePatient(testPatientData);
      patientId = patient.id;

      const plan = await savePlan({
        patientId,
        objective: 'Restaurar qualidade vocal',
        targetRegions: ['Laringe', 'Faringe'],
        targetPoints: ['Fp1', 'Fp2', 'F3', 'F4'],
        frequency: 2,
        totalDuration: 60,
        isActive: true,
      });

      planId = plan.id;

      expect(plan.id).toBeDefined();
      expect(plan.patientId).toBe(patientId);
      expect(plan.objective).toBe('Restaurar qualidade vocal');
      expect(plan.targetPoints.length).toBe(4);
      expect(plan.frequency).toBe(2);
      expect(plan.isActive).toBe(true);
    });

    it('should retrieve plans by patient', async () => {
      const patient = await savePatient(testPatientData);
      patientId = patient.id;

      const plan = await savePlan({
        patientId,
        objective: 'Teste',
        targetRegions: ['Laringe'],
        targetPoints: ['Fp1', 'Fp2'],
        frequency: 2,
        totalDuration: 30,
        isActive: true,
      });

      planId = plan.id;

      const plans = await getPlansByPatient(patientId);
      expect(plans.length).toBeGreaterThan(0);
      expect(plans[0].patientId).toBe(patientId);
    });
  });

  describe('Phase 3: Clinical Scale Application', () => {
    it('should apply DOSS scale to patient', async () => {
      const patient = await savePatient(testPatientData);
      patientId = patient.id;

      const scaleResponse: ScaleResponse = {
        id: `scale_doss_${Date.now()}`,
        patientId,
        patientName: 'João Silva',
        scaleType: 'doss' as ScaleType,
        scaleName: 'Escala do Comer (DOSS)',
        date: new Date().toISOString().split('T')[0],
        answers: {
          doss_1: 7,
          doss_2: 6,
          doss_3: 5,
          doss_4: 4,
          doss_5: 3,
          doss_6: 2,
          doss_7: 1,
        },
        totalScore: 28,
        interpretation: 'Disfagia moderada',
        notes: 'Primeira avaliação - paciente apresenta dificuldade na deglutição',
      };

      const saved = await saveScaleResponse(scaleResponse);
      expect(saved).toBe(true);

      const responses = await getPatientScaleResponses(patientId);
      expect(responses.length).toBeGreaterThan(0);
      expect(responses[0].totalScore).toBe(28);
    });

    it('should apply multiple scales to same patient', async () => {
      const patient = await savePatient(testPatientData);
      patientId = patient.id;

      // Apply DOSS scale
      const dossResponse: ScaleResponse = {
        id: `scale_doss_${Date.now()}`,
        patientId,
        patientName: 'João Silva',
        scaleType: 'doss' as ScaleType,
        scaleName: 'Escala do Comer (DOSS)',
        date: new Date().toISOString().split('T')[0],
        answers: { doss_1: 7 },
        totalScore: 7,
        interpretation: 'Normal',
        notes: 'Avaliação DOSS',
      };

      // Apply PHQ9 scale
      const phq9Response: ScaleResponse = {
        id: `scale_phq9_${Date.now()}`,
        patientId,
        patientName: 'João Silva',
        scaleType: 'phq9' as ScaleType,
        scaleName: 'PHQ-9 (Depressão)',
        date: new Date().toISOString().split('T')[0],
        answers: { phq9_1: 2, phq9_2: 1 },
        totalScore: 3,
        interpretation: 'Sem depressão',
        notes: 'Avaliação PHQ9',
      };

      await saveScaleResponse(dossResponse);
      await saveScaleResponse(phq9Response);

      const responses = await getPatientScaleResponses(patientId);
      expect(responses.length).toBe(2);
      expect(responses.some((r: ScaleResponse) => r.scaleType === 'doss')).toBe(true);
      expect(responses.some((r: ScaleResponse) => r.scaleType === 'phq9')).toBe(true);
    });

    it('should track scale evolution over time', async () => {
      const patient = await savePatient(testPatientData);
      patientId = patient.id;

      // First application
      const response1: ScaleResponse = {
        id: `scale_${Date.now()}`,
        patientId,
        patientName: 'João Silva',
        scaleType: 'doss' as ScaleType,
        scaleName: 'Escala do Comer (DOSS)',
        date: '2026-01-20',
        answers: { doss_1: 3 },
        totalScore: 3,
        interpretation: 'Disfagia severa',
        notes: 'Primeira avaliação',
      };

      // Second application (after treatment)
      const response2: ScaleResponse = {
        id: `scale_${Date.now() + 1}`,
        patientId,
        patientName: 'João Silva',
        scaleType: 'doss' as ScaleType,
        scaleName: 'Escala do Comer (DOSS)',
        date: '2026-01-26',
        answers: { doss_1: 7 },
        totalScore: 7,
        interpretation: 'Normal',
        notes: 'Avaliação após tratamento',
      };

      await saveScaleResponse(response1);
      await saveScaleResponse(response2);

      const responses = await getPatientScaleResponses(patientId);
      expect(responses.length).toBe(2);
      expect(responses[0].totalScore).toBe(3);
      expect(responses[1].totalScore).toBe(7);

      // Verify improvement
      const improvement = responses[1].totalScore - responses[0].totalScore;
      expect(improvement).toBeGreaterThan(0);
    });
  });

  describe('Phase 4: Session Recording', () => {
    it('should record therapy session with stimulated points', async () => {
      const patient = await savePatient(testPatientData);
      patientId = patient.id;

      const plan = await savePlan({
        patientId,
        objective: 'Teste',
        targetRegions: ['Laringe'],
        targetPoints: ['Fp1', 'Fp2'],
        frequency: 2,
        totalDuration: 30,
        isActive: true,
      });

      planId = plan.id;

      const session = await saveSession({
        patientId,
        planId,
        sessionDate: new Date().toISOString().split('T')[0],
        durationMinutes: 30,
        stimulatedPoints: ['Fp1', 'Fp2', 'F3', 'F4'],
        joules: 150,
        symptomScore: 8,
        observations: 'Sessão bem tolerada, paciente relatou melhora',
        patientReactions: 'Sem reações adversas',
      });

      expect(session.id).toBeDefined();
      expect(session.durationMinutes).toBe(30);
      expect(session.stimulatedPoints.length).toBe(4);
      expect(session.joules).toBe(150);
    });

    it('should retrieve sessions by patient', async () => {
      const patient = await savePatient(testPatientData);
      patientId = patient.id;

      const plan = await savePlan({
        patientId,
        objective: 'Teste',
        targetRegions: ['Laringe'],
        targetPoints: ['Fp1', 'Fp2'],
        frequency: 2,
        totalDuration: 30,
        isActive: true,
      });

      planId = plan.id;

      await saveSession({
        patientId,
        planId,
        sessionDate: new Date().toISOString().split('T')[0],
        durationMinutes: 30,
        stimulatedPoints: ['Fp1', 'Fp2'],
        joules: 100,
        symptomScore: 7,
      });

      const sessions = await getSessions();
      const patientSessions = sessions.filter((s: Session) => s.patientId === patientId);
      expect(patientSessions.length).toBeGreaterThan(0);
    });
  });

  describe('Phase 5: Patient Status Management', () => {
    it('should mark patient as completed', async () => {
      const patient = await savePatient(testPatientData);
      patientId = patient.id;

      expect(patient.status).toBe('active');

      const updated = await updatePatient(patientId, { status: 'completed' });
      expect(updated?.status).toBe('completed');

      const patients = await getPatients();
      const completedPatient = patients.find((p: Patient) => p.id === patientId);
      expect(completedPatient?.status).toBe('completed');
    });

    it('should pause and reactivate patient', async () => {
      const patient = await savePatient(testPatientData);
      patientId = patient.id;

      // Pause
      let updated = await updatePatient(patientId, { status: 'paused' });
      expect(updated?.status).toBe('paused');

      // Reactivate
      updated = await updatePatient(patientId, { status: 'active' });
      expect(updated?.status).toBe('active');
    });
  });

  describe('Phase 6: Complete Workflow Integration', () => {
    it('should complete full end-to-end workflow', async () => {
      // 1. Create patient
      const patient = await savePatient(testPatientData);
      patientId = patient.id;
      expect(patient.id).toBeDefined();

      // 2. Create therapeutic plan
      const plan = await savePlan({
        patientId,
        objective: 'Restaurar qualidade vocal',
        targetRegions: ['Laringe'],
        targetPoints: ['Fp1', 'Fp2', 'F3', 'F4'],
        frequency: 2,
        totalDuration: 60,
        isActive: true,
      });
      planId = plan.id;
      expect(plan.id).toBeDefined();

      // 3. Apply initial scale
      const initialScale: ScaleResponse = {
        id: `scale_initial_${Date.now()}`,
        patientId,
        patientName: 'João Silva',
        scaleType: 'doss' as ScaleType,
        scaleName: 'Escala do Comer (DOSS)',
        date: '2026-01-20',
        answers: { doss_1: 3 },
        totalScore: 3,
        interpretation: 'Disfagia severa',
        notes: 'Avaliação inicial',
      };
      await saveScaleResponse(initialScale);

      // 4. Record sessions
      const session1 = await saveSession({
        patientId,
        planId,
        sessionDate: '2026-01-21',
        durationMinutes: 30,
        stimulatedPoints: ['Fp1', 'Fp2'],
        joules: 100,
        symptomScore: 7,
      });

      const session2 = await saveSession({
        patientId,
        planId,
        sessionDate: '2026-01-23',
        durationMinutes: 30,
        stimulatedPoints: ['Fp1', 'Fp2', 'F3', 'F4'],
        joules: 120,
        symptomScore: 8,
      });

      // 5. Apply final scale
      const finalScale: ScaleResponse = {
        id: `scale_final_${Date.now()}`,
        patientId,
        patientName: 'João Silva',
        scaleType: 'doss' as ScaleType,
        scaleName: 'Escala do Comer (DOSS)',
        date: '2026-01-26',
        answers: { doss_1: 7 },
        totalScore: 7,
        interpretation: 'Normal',
        notes: 'Avaliação final - melhora significativa',
      };
      await saveScaleResponse(finalScale);

      // 6. Mark patient as completed
      const completed = await updatePatient(patientId, { status: 'completed' });
      expect(completed?.status).toBe('completed');

      // 7. Verify all data is accessible
      const patients = await getPatients();
      const finalPatient = patients.find((p: Patient) => p.id === patientId);
      expect(finalPatient?.status).toBe('completed');

      const scales = await getPatientScaleResponses(patientId);
      expect(scales.length).toBe(2);

      const sessions = await getSessions();
      const patientSessions = sessions.filter((s: Session) => s.patientId === patientId);
      expect(patientSessions.length).toBe(2);

      const plans = await getPlansByPatient(patientId);
      expect(plans.length).toBeGreaterThan(0);

      // 8. Verify improvement metrics
      const improvement = finalScale.totalScore - initialScale.totalScore;
      expect(improvement).toBe(4);
      expect(improvement).toBeGreaterThan(0);
    });
  });

  describe('Phase 7: Data Integrity and Consistency', () => {
    it('should maintain data consistency across operations', async () => {
      const patient = await savePatient(testPatientData);
      patientId = patient.id;

      // Create multiple scales
      for (let i = 0; i < 3; i++) {
        const scale: ScaleResponse = {
          id: `scale_${Date.now()}_${i}`,
          patientId,
          patientName: 'João Silva',
          scaleType: 'doss' as ScaleType,
          scaleName: 'Escala do Comer (DOSS)',
          date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
          answers: { doss_1: 3 + i },
          totalScore: 3 + i,
          interpretation: `Score ${3 + i}`,
          notes: `Avaliação ${i + 1}`,
        };
        await saveScaleResponse(scale);
      }

      const scales = await getPatientScaleResponses(patientId);
      expect(scales.length).toBe(3);

      // Verify all scales belong to same patient
      scales.forEach((scale: ScaleResponse) => {
        expect(scale.patientId).toBe(patientId);
        expect(scale.patientName).toBe('João Silva');
      });

      // Verify scores are in order
      expect(scales[0].totalScore).toBeLessThanOrEqual(scales[1].totalScore);
      expect(scales[1].totalScore).toBeLessThanOrEqual(scales[2].totalScore);
    });
  });
});
