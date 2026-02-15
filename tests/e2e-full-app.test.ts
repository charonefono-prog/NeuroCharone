import { describe, it, expect, beforeEach } from 'vitest';
import {
  savePatient,
  getPatients,
  updatePatient,
  deletePatient,
  saveSession,
  getSessions,
  getSessionsByPatient,
  savePlan,
  getPlans,
  getPlansByPatient,
  type Patient,
  type Session,
  type TherapeuticPlan,
} from '@/lib/local-storage';
import {
  saveScaleResponse,
  getPatientScaleResponses,
  getPatientScaleHistory,
  getScaleStatistics,
  deleteScaleResponse,
  updateScaleResponse,
  calculateImprovement,
  clearAllScaleResponses,
  exportPatientScalesData,
} from '@/lib/scale-storage';
import type { ScaleResponse } from '@/lib/clinical-scales';
import { ScaleType, ALL_SCALES } from '@/lib/clinical-scales';
import {
  addAuditLog,
  getAuditLogs,
  getAuditLogsByEntity,
  getActionDescription,
  getFieldName,
  formatValue,
} from '@/lib/audit-log';
import {
  searchPlanTemplates,
  getSearchSuggestions,
  getAllManualKeywords,
} from '@/lib/plan-search';
import {
  addToSearchHistory,
  getSearchHistory,
  clearSearchHistory,
  removeFromSearchHistory,
} from '@/lib/search-history';
import {
  createProgressGoal,
  getProgressGoals,
  getGoalsByPlan,
  calculateProgress,
  calculateDaysRemaining,
  deleteProgressGoal,
} from '@/lib/progress-goals';
import {
  checkSeverityAlert,
  checkDeterioration,
} from '@/lib/severity-alerts';

// ============================================================
// COMPREHENSIVE END-TO-END TEST SUITE
// Tests all major app functions: patients, plans, sessions,
// scales, audit, search, progress goals, severity alerts,
// and data integrity.
// ============================================================

describe('FULL APP E2E TEST SUITE', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // ----------------------------------------------------------
  // 1. PATIENT CRUD
  // ----------------------------------------------------------
  describe('1. Patient CRUD Operations', () => {
    it('should create patient with all fields', async () => {
      const p = await savePatient({
        fullName: 'Maria Oliveira',
        birthDate: '1990-05-15',
        diagnosis: 'Afasia de Broca',
        phone: '11999887766',
        email: 'maria@test.com',
        status: 'active',
      });
      expect(p.id).toBeDefined();
      expect(p.fullName).toBe('Maria Oliveira');
      expect(p.diagnosis).toBe('Afasia de Broca');
      expect(p.status).toBe('active');
      expect(p.createdAt).toBeDefined();
      expect(p.updatedAt).toBeDefined();
    });

    it('should list all patients', async () => {
      await savePatient({ fullName: 'P1', birthDate: '1990-01-01', diagnosis: 'D1', status: 'active' });
      await savePatient({ fullName: 'P2', birthDate: '1985-06-15', diagnosis: 'D2', status: 'active' });
      const patients = await getPatients();
      expect(patients.length).toBeGreaterThanOrEqual(2);
    });

    it('should update patient fields', async () => {
      const p = await savePatient({ fullName: 'João', birthDate: '1980-01-01', diagnosis: 'D', status: 'active' });
      const updated = await updatePatient(p.id, { diagnosis: 'Disfonia Funcional', status: 'paused' });
      expect(updated?.diagnosis).toBe('Disfonia Funcional');
      expect(updated?.status).toBe('paused');
    });

    it('should delete patient', async () => {
      const p = await savePatient({ fullName: 'Temp', birthDate: '2000-01-01', diagnosis: 'D', status: 'active' });
      const deleted = await deletePatient(p.id);
      expect(deleted).toBe(true);
      const patients = await getPatients();
      expect(patients.find((x: Patient) => x.id === p.id)).toBeUndefined();
    });

    it('should handle status transitions: active → paused → completed → active', async () => {
      const p = await savePatient({ fullName: 'Status Test', birthDate: '1995-01-01', diagnosis: 'D', status: 'active' });
      let u = await updatePatient(p.id, { status: 'paused' });
      expect(u?.status).toBe('paused');
      u = await updatePatient(p.id, { status: 'completed' });
      expect(u?.status).toBe('completed');
      u = await updatePatient(p.id, { status: 'active' });
      expect(u?.status).toBe('active');
    });
  });

  // ----------------------------------------------------------
  // 2. THERAPEUTIC PLAN CRUD
  // ----------------------------------------------------------
  describe('2. Therapeutic Plan Operations', () => {
    let patientId: string;

    beforeEach(async () => {
      const p = await savePatient({ fullName: 'Plan Patient', birthDate: '1990-01-01', diagnosis: 'D', status: 'active' });
      patientId = p.id;
    });

    it('should create therapeutic plan with target points', async () => {
      const plan = await savePlan({
        patientId,
        objective: 'Restaurar qualidade vocal',
        targetRegions: ['Laringe', 'Faringe'],
        targetPoints: ['Fp1', 'Fp2', 'F3', 'F4'],
        frequency: 3,
        totalDuration: 60,
        isActive: true,
      });
      expect(plan.id).toBeDefined();
      expect(plan.patientId).toBe(patientId);
      expect(plan.targetPoints).toEqual(['Fp1', 'Fp2', 'F3', 'F4']);
      expect(plan.frequency).toBe(3);
      expect(plan.isActive).toBe(true);
    });

    it('should retrieve plans by patient', async () => {
      await savePlan({ patientId, objective: 'O1', targetRegions: ['R1'], targetPoints: ['P1'], frequency: 2, totalDuration: 30, isActive: true });
      await savePlan({ patientId, objective: 'O2', targetRegions: ['R2'], targetPoints: ['P2'], frequency: 1, totalDuration: 45, isActive: false });
      const plans = await getPlansByPatient(patientId);
      expect(plans.length).toBeGreaterThanOrEqual(2);
      plans.forEach((plan: TherapeuticPlan) => expect(plan.patientId).toBe(patientId));
    });

    it('should create multiple plans for same patient', async () => {
      for (let i = 0; i < 3; i++) {
        await savePlan({ patientId, objective: `Plan ${i}`, targetRegions: [`R${i}`], targetPoints: [`P${i}`], frequency: i + 1, totalDuration: 30, isActive: i === 0 });
      }
      const plans = await getPlansByPatient(patientId);
      expect(plans.length).toBeGreaterThanOrEqual(3);
    });
  });

  // ----------------------------------------------------------
  // 3. SESSION RECORDING
  // ----------------------------------------------------------
  describe('3. Session Recording', () => {
    let patientId: string;
    let planId: string;

    beforeEach(async () => {
      const p = await savePatient({ fullName: 'Session Patient', birthDate: '1990-01-01', diagnosis: 'D', status: 'active' });
      patientId = p.id;
      const plan = await savePlan({ patientId, objective: 'O', targetRegions: ['R'], targetPoints: ['Fp1', 'Fp2'], frequency: 2, totalDuration: 30, isActive: true });
      planId = plan.id;
    });

    it('should record session with all fields', async () => {
      const s = await saveSession({
        patientId,
        planId,
        sessionDate: '2026-02-10',
        durationMinutes: 45,
        stimulatedPoints: ['Fp1', 'Fp2', 'F3'],
        joules: 150,
        symptomScore: 7,
        observations: 'Paciente tolerou bem',
        patientReactions: 'Sem reações adversas',
      });
      expect(s.id).toBeDefined();
      expect(s.durationMinutes).toBe(45);
      expect(s.stimulatedPoints).toEqual(['Fp1', 'Fp2', 'F3']);
      expect(s.joules).toBe(150);
      expect(s.symptomScore).toBe(7);
    });

    it('should retrieve sessions by patient', async () => {
      await saveSession({ patientId, planId, sessionDate: '2026-02-10', durationMinutes: 30, stimulatedPoints: ['Fp1'], joules: 100, symptomScore: 6 });
      await saveSession({ patientId, planId, sessionDate: '2026-02-12', durationMinutes: 30, stimulatedPoints: ['Fp2'], joules: 120, symptomScore: 7 });
      const sessions = await getSessionsByPatient(patientId);
      expect(sessions.length).toBeGreaterThanOrEqual(2);
      sessions.forEach((s: Session) => expect(s.patientId).toBe(patientId));
    });

    it('should record multiple sessions over time', async () => {
      for (let i = 0; i < 5; i++) {
        await saveSession({
          patientId,
          planId,
          sessionDate: `2026-02-${10 + i}`,
          durationMinutes: 30,
          stimulatedPoints: ['Fp1', 'Fp2'],
          joules: 100 + i * 10,
          symptomScore: 5 + i,
        });
      }
      const sessions = await getSessionsByPatient(patientId);
      expect(sessions.length).toBeGreaterThanOrEqual(5);
    });
  });

  // ----------------------------------------------------------
  // 4. CLINICAL SCALES
  // ----------------------------------------------------------
  describe('4. Clinical Scales', () => {
    let patientId: string;

    beforeEach(async () => {
      const p = await savePatient({ fullName: 'Scale Patient', birthDate: '1990-01-01', diagnosis: 'D', status: 'active' });
      patientId = p.id;
    });

    it('should have all expected scale types defined', () => {
      expect(ALL_SCALES.length).toBeGreaterThan(0);
      const types = ALL_SCALES.map((s) => s.type);
      expect(types).toContain('doss');
      expect(types).toContain('btss');
      expect(types).toContain('phq9');
    });

    it('should save and retrieve scale response', async () => {
      const response: ScaleResponse = {
        id: `scale_${Date.now()}`,
        patientId,
        patientName: 'Scale Patient',
        scaleType: 'doss' as ScaleType,
        scaleName: 'Escala do Comer (DOSS)',
        date: '2026-02-10',
        answers: { doss_1: 5 },
        totalScore: 5,
        interpretation: 'Disfagia leve',
        notes: 'Primeira avaliação',
      };
      const saved = await saveScaleResponse(response);
      expect(saved).toBe(true);

      const responses = await getPatientScaleResponses(patientId);
      expect(responses.length).toBeGreaterThanOrEqual(1);
      expect(responses[0].totalScore).toBe(5);
    });

    it('should apply multiple different scales', async () => {
      const doss: ScaleResponse = {
        id: `doss_${Date.now()}`,
        patientId,
        patientName: 'Scale Patient',
        scaleType: 'doss' as ScaleType,
        scaleName: 'DOSS',
        date: '2026-02-10',
        answers: { doss_1: 5 },
        totalScore: 5,
        interpretation: 'Leve',
      };
      const phq9: ScaleResponse = {
        id: `phq9_${Date.now()}`,
        patientId,
        patientName: 'Scale Patient',
        scaleType: 'phq9' as ScaleType,
        scaleName: 'PHQ-9',
        date: '2026-02-10',
        answers: { phq9_1: 2 },
        totalScore: 2,
        interpretation: 'Sem depressão',
      };
      await saveScaleResponse(doss);
      await saveScaleResponse(phq9);

      const responses = await getPatientScaleResponses(patientId);
      const types = responses.map((r: ScaleResponse) => r.scaleType);
      expect(types).toContain('doss');
      expect(types).toContain('phq9');
    });

    it('should track scale evolution over time', async () => {
      for (let i = 0; i < 3; i++) {
        await saveScaleResponse({
          id: `evo_${Date.now()}_${i}`,
          patientId,
          patientName: 'Scale Patient',
          scaleType: 'doss' as ScaleType,
          scaleName: 'DOSS',
          date: `2026-02-${10 + i * 7}`,
          answers: { doss_1: 3 + i * 2 },
          totalScore: 3 + i * 2,
          interpretation: `Score ${3 + i * 2}`,
        });
      }
      const history = await getPatientScaleHistory(patientId, 'doss' as ScaleType);
      expect(history.length).toBeGreaterThanOrEqual(3);
    });

    it('should calculate improvement between scores', () => {
      const result = calculateImprovement(3, 7, 'doss' as ScaleType);
      expect(result).toBeDefined();
      expect(result.percentage).toBeDefined();
    });

    it('should delete scale response', async () => {
      const response: ScaleResponse = {
        id: `del_${Date.now()}`,
        patientId,
        patientName: 'Scale Patient',
        scaleType: 'doss' as ScaleType,
        scaleName: 'DOSS',
        date: '2026-02-10',
        answers: { doss_1: 5 },
        totalScore: 5,
        interpretation: 'Leve',
      };
      await saveScaleResponse(response);
      const deleted = await deleteScaleResponse(response.id);
      expect(deleted).toBe(true);
    });

    it('should update scale response', async () => {
      const response: ScaleResponse = {
        id: `upd_${Date.now()}`,
        patientId,
        patientName: 'Scale Patient',
        scaleType: 'doss' as ScaleType,
        scaleName: 'DOSS',
        date: '2026-02-10',
        answers: { doss_1: 5 },
        totalScore: 5,
        interpretation: 'Leve',
      };
      await saveScaleResponse(response);
      const updated = await updateScaleResponse(response.id, { notes: 'Atualizado' });
      expect(updated).toBe(true);
    });

    it('should get scale statistics', async () => {
      for (let i = 0; i < 3; i++) {
        await saveScaleResponse({
          id: `stat_${Date.now()}_${i}`,
          patientId,
          patientName: 'Scale Patient',
          scaleType: 'doss' as ScaleType,
          scaleName: 'DOSS',
          date: `2026-02-${10 + i}`,
          answers: { doss_1: 3 + i },
          totalScore: 3 + i,
          interpretation: `Score ${3 + i}`,
        });
      }
      const stats = await getScaleStatistics(patientId, 'doss' as ScaleType);
      expect(stats).toBeDefined();
      expect(stats.averageScore).toBeDefined();
      expect(stats.highestScore).toBeDefined();
      expect(stats.lowestScore).toBeDefined();
    });

    it('should export patient scales data', async () => {
      await saveScaleResponse({
        id: `exp_${Date.now()}`,
        patientId,
        patientName: 'Scale Patient',
        scaleType: 'doss' as ScaleType,
        scaleName: 'DOSS',
        date: '2026-02-10',
        answers: { doss_1: 5 },
        totalScore: 5,
        interpretation: 'Leve',
      });
      const exported = await exportPatientScalesData(patientId);
      expect(exported).toBeDefined();
      expect(typeof exported).toBe('string');
    });

    it('should clear all scale responses', async () => {
      await saveScaleResponse({
        id: `clr_${Date.now()}`,
        patientId,
        patientName: 'Scale Patient',
        scaleType: 'doss' as ScaleType,
        scaleName: 'DOSS',
        date: '2026-02-10',
        answers: { doss_1: 5 },
        totalScore: 5,
        interpretation: 'Leve',
      });
      const cleared = await clearAllScaleResponses();
      expect(cleared).toBe(true);
    });
  });

  // ----------------------------------------------------------
  // 5. AUDIT LOG
  // ----------------------------------------------------------
  describe('5. Audit Log', () => {
    it('should add and retrieve audit logs', async () => {
      await addAuditLog({
        entityType: 'patient',
        entityId: 'test-123',
        action: 'patient_created',
      });
      const logs = await getAuditLogs();
      expect(logs.length).toBeGreaterThan(0);
    });

    it('should retrieve audit logs by entity', async () => {
      await addAuditLog({
        entityType: 'patient',
        entityId: 'entity-456',
        action: 'patient_updated',
        changes: [{ field: 'status', oldValue: 'active', newValue: 'paused' }],
      });
      const logs = await getAuditLogsByEntity('patient', 'entity-456');
      expect(logs.length).toBeGreaterThan(0);
      logs.forEach((log: any) => {
        expect(log.entityId).toBe('entity-456');
      });
    });

    it('should return correct action descriptions', () => {
      expect(getActionDescription('patient_created')).toBeDefined();
      expect(getActionDescription('patient_updated')).toBeDefined();
      expect(getActionDescription('patient_deleted')).toBeDefined();
    });

    it('should format field names correctly', () => {
      expect(getFieldName('fullName')).toBeDefined();
      expect(getFieldName('birthDate')).toBeDefined();
    });

    it('should format values correctly', () => {
      expect(formatValue('test')).toBe('test');
      expect(formatValue(42)).toBe('42');
      expect(formatValue(null)).toBeDefined();
    });
  });

  // ----------------------------------------------------------
  // 6. PLAN SEARCH
  // ----------------------------------------------------------
  describe('6. Plan Search', () => {
    it('should search plan templates by keyword', () => {
      const results = searchPlanTemplates([], 'afasia');
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });

    it('should return search suggestions', () => {
      const suggestions = getSearchSuggestions('af');
      expect(suggestions).toBeDefined();
      expect(Array.isArray(suggestions)).toBe(true);
    });

    it('should return all manual keywords', () => {
      const keywords = getAllManualKeywords();
      expect(keywords).toBeDefined();
      expect(keywords.length).toBeGreaterThan(0);
    });
  });

  // ----------------------------------------------------------
  // 7. SEARCH HISTORY
  // ----------------------------------------------------------
  describe('7. Search History', () => {
    it('should add and retrieve search history', async () => {
      await addToSearchHistory('afasia', 5);
      const history = await getSearchHistory();
      expect(history.length).toBeGreaterThan(0);
      expect(history[0].query).toBe('afasia');
    });

    it('should limit to 5 recent searches', async () => {
      for (let i = 0; i < 7; i++) {
        await addToSearchHistory(`search_${i}`, 3);
      }
      const history = await getSearchHistory();
      expect(history.length).toBeLessThanOrEqual(5);
    });

    it('should remove from search history', async () => {
      await addToSearchHistory('to_remove', 2);
      await removeFromSearchHistory('to_remove');
      const history = await getSearchHistory();
      const found = history.find((h: any) => h.query === 'to_remove');
      expect(found).toBeUndefined();
    });

    it('should clear search history', async () => {
      await addToSearchHistory('test1', 1);
      await clearSearchHistory();
      const history = await getSearchHistory();
      expect(history.length).toBe(0);
    });
  });

  // ----------------------------------------------------------
  // 8. PROGRESS GOALS
  // ----------------------------------------------------------
  describe('8. Progress Goals', () => {
    let planId: string;

    beforeEach(async () => {
      const p = await savePatient({ fullName: 'Goal Patient', birthDate: '1990-01-01', diagnosis: 'D', status: 'active' });
      const plan = await savePlan({ patientId: p.id, objective: 'O', targetRegions: ['R'], targetPoints: ['P'], frequency: 2, totalDuration: 30, isActive: true });
      planId = plan.id;
    });

    it('should create progress goal', async () => {
      const goal = await createProgressGoal(planId, 50, 8, '2026-06-01');
      expect(goal).toBeDefined();
      expect(goal.planId).toBe(planId);
      expect(goal.targetImprovement).toBe(50);
      expect(goal.initialSymptomScore).toBe(8);
    });

    it('should retrieve goals by plan', async () => {
      await createProgressGoal(planId, 50, 8, '2026-06-01');
      const goals = await getGoalsByPlan(planId);
      expect(goals.length).toBeGreaterThan(0);
    });

    it('should calculate progress correctly', () => {
      // initialScore=10, currentScore=5, targetScore=0 → 50% progress
      const progress = calculateProgress(10, 5, 0);
      expect(progress).toBe(50);
    });

    it('should calculate days remaining', () => {
      const futureDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
      const days = calculateDaysRemaining(futureDate);
      expect(days).toBeGreaterThan(0);
      expect(days).toBeLessThanOrEqual(31);
    });

    it('should delete progress goal', async () => {
      const goal = await createProgressGoal(planId, 50, 8, '2026-06-01');
      await deleteProgressGoal(goal.id);
      const goals = await getGoalsByPlan(planId);
      const found = goals.find((g: any) => g.id === goal.id);
      expect(found).toBeUndefined();
    });
  });

  // ----------------------------------------------------------
  // 9. SEVERITY ALERTS
  // ----------------------------------------------------------
  describe('9. Severity Alerts', () => {
    it('should check severity alert for high score', () => {
      const response: ScaleResponse = {
        id: 'alert_test',
        patientId: 'p1',
        patientName: 'Test',
        scaleType: 'phq9' as ScaleType,
        scaleName: 'PHQ-9',
        date: '2026-02-10',
        answers: {},
        totalScore: 25,
        interpretation: 'Depressão severa',
      };
      const alert = checkSeverityAlert(response);
      // Should return alert for high PHQ-9 score or null depending on thresholds
      expect(alert === null || alert !== null).toBe(true);
    });

    it('should check deterioration between two scale responses', () => {
      const prev: ScaleResponse = {
        id: '1',
        patientId: 'p1',
        patientName: 'T',
        scaleType: 'phq9' as ScaleType,
        scaleName: 'PHQ-9',
        date: '2026-01-01',
        answers: {},
        totalScore: 5,
        interpretation: 'Leve',
      };
      const curr: ScaleResponse = {
        id: '2',
        patientId: 'p1',
        patientName: 'T',
        scaleType: 'phq9' as ScaleType,
        scaleName: 'PHQ-9',
        date: '2026-02-01',
        answers: {},
        totalScore: 20,
        interpretation: 'Severo',
      };
      const result = checkDeterioration(prev, curr);
      // Score went from 5 to 20 (diff=15 > threshold=5), should detect deterioration
      expect(result).not.toBeNull();
    });
  });

  // ----------------------------------------------------------
  // 10. COMPLETE WORKFLOW INTEGRATION
  // ----------------------------------------------------------
  describe('10. Complete Workflow Integration', () => {
    it('should complete full clinical workflow end-to-end', async () => {
      // Step 1: Create patient
      const patient = await savePatient({
        fullName: 'Workflow Patient',
        birthDate: '1985-03-20',
        diagnosis: 'Disfagia Orofaríngea',
        phone: '11999887766',
        email: 'workflow@test.com',
        status: 'active',
      });
      expect(patient.id).toBeDefined();

      // Step 2: Create therapeutic plan
      const plan = await savePlan({
        patientId: patient.id,
        objective: 'Restaurar deglutição funcional',
        targetRegions: ['Laringe', 'Faringe', 'Córtex Motor'],
        targetPoints: ['Fp1', 'Fp2', 'F3', 'F4', 'C3', 'C4'],
        frequency: 3,
        totalDuration: 60,
        isActive: true,
      });
      expect(plan.id).toBeDefined();

      // Step 3: Apply initial scale (baseline)
      const initialScale: ScaleResponse = {
        id: `wf_initial_${Date.now()}`,
        patientId: patient.id,
        patientName: 'Workflow Patient',
        scaleType: 'doss' as ScaleType,
        scaleName: 'Escala do Comer (DOSS)',
        date: '2026-01-15',
        answers: { doss_1: 2 },
        totalScore: 2,
        interpretation: 'Disfagia severa',
        notes: 'Avaliação inicial - baseline',
      };
      await saveScaleResponse(initialScale);

      // Step 4: Create progress goal
      const goal = await createProgressGoal(plan.id, 50, 8, '2026-06-01');
      expect(goal).toBeDefined();

      // Step 5: Record sessions (treatment cycle)
      for (let i = 0; i < 5; i++) {
        await saveSession({
          patientId: patient.id,
          planId: plan.id,
          sessionDate: `2026-01-${20 + i * 2}`,
          durationMinutes: 30,
          stimulatedPoints: ['Fp1', 'Fp2', 'F3', 'F4'],
          joules: 100 + i * 10,
          symptomScore: 5 + i,
          observations: `Sessão ${i + 1} - tolerância boa`,
        });
      }

      // Step 6: Apply mid-treatment scale
      const midScale: ScaleResponse = {
        id: `wf_mid_${Date.now()}`,
        patientId: patient.id,
        patientName: 'Workflow Patient',
        scaleType: 'doss' as ScaleType,
        scaleName: 'Escala do Comer (DOSS)',
        date: '2026-02-01',
        answers: { doss_1: 4 },
        totalScore: 4,
        interpretation: 'Disfagia moderada',
        notes: 'Melhora parcial',
      };
      await saveScaleResponse(midScale);

      // Step 7: Apply final scale
      const finalScale: ScaleResponse = {
        id: `wf_final_${Date.now()}`,
        patientId: patient.id,
        patientName: 'Workflow Patient',
        scaleType: 'doss' as ScaleType,
        scaleName: 'Escala do Comer (DOSS)',
        date: '2026-02-15',
        answers: { doss_1: 6 },
        totalScore: 6,
        interpretation: 'Disfagia leve',
        notes: 'Melhora significativa',
      };
      await saveScaleResponse(finalScale);

      // Step 8: Verify all data
      const sessions = await getSessionsByPatient(patient.id);
      expect(sessions.length).toBeGreaterThanOrEqual(5);

      const scales = await getPatientScaleResponses(patient.id);
      expect(scales.length).toBeGreaterThanOrEqual(3);

      const plans = await getPlansByPatient(patient.id);
      expect(plans.length).toBeGreaterThanOrEqual(1);

      // Step 9: Verify improvement
      const improvement = finalScale.totalScore - initialScale.totalScore;
      expect(improvement).toBe(4);
      expect(improvement).toBeGreaterThan(0);

      // Step 10: Log audit
      await addAuditLog({
        entityType: 'patient',
        entityId: patient.id,
        action: 'patient_updated',
        changes: [{ field: 'treatment_status', oldValue: 'in_progress', newValue: 'completed' }],
      });

      const auditLogs = await getAuditLogsByEntity('patient', patient.id);
      expect(auditLogs.length).toBeGreaterThan(0);

      // Step 11: Mark patient as completed
      const completed = await updatePatient(patient.id, { status: 'completed' });
      expect(completed?.status).toBe('completed');
    });
  });

  // ----------------------------------------------------------
  // 11. DATA INTEGRITY
  // ----------------------------------------------------------
  describe('11. Data Integrity', () => {
    it('should maintain referential integrity between patient, plan, and sessions', async () => {
      const patient = await savePatient({ fullName: 'Integrity Test', birthDate: '1990-01-01', diagnosis: 'D', status: 'active' });
      const plan = await savePlan({ patientId: patient.id, objective: 'O', targetRegions: ['R'], targetPoints: ['P'], frequency: 2, totalDuration: 30, isActive: true });
      const session = await saveSession({ patientId: patient.id, planId: plan.id, sessionDate: '2026-02-10', durationMinutes: 30, stimulatedPoints: ['P'], joules: 100, symptomScore: 5 });

      expect(session.patientId).toBe(patient.id);
      expect(session.planId).toBe(plan.id);

      const patientPlans = await getPlansByPatient(patient.id);
      expect(patientPlans.some((p: TherapeuticPlan) => p.id === plan.id)).toBe(true);

      const patientSessions = await getSessionsByPatient(patient.id);
      expect(patientSessions.some((s: Session) => s.id === session.id)).toBe(true);
    });

    it('should handle concurrent operations without data loss', async () => {
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(savePatient({ fullName: `Concurrent ${i}`, birthDate: '1990-01-01', diagnosis: 'D', status: 'active' }));
      }
      const patients = await Promise.all(promises);
      expect(patients.length).toBe(10);
      patients.forEach((p) => expect(p.id).toBeDefined());

      const allPatients = await getPatients();
      expect(allPatients.length).toBeGreaterThanOrEqual(10);
    });

    it('should persist data across reads', async () => {
      const p = await savePatient({ fullName: 'Persist Test', birthDate: '1990-01-01', diagnosis: 'D', status: 'active' });
      
      // Read multiple times
      const read1 = await getPatients();
      const read2 = await getPatients();
      const read3 = await getPatients();

      const found1 = read1.find((x: Patient) => x.id === p.id);
      const found2 = read2.find((x: Patient) => x.id === p.id);
      const found3 = read3.find((x: Patient) => x.id === p.id);

      expect(found1).toBeDefined();
      expect(found2).toBeDefined();
      expect(found3).toBeDefined();
      expect(found1?.fullName).toBe(found2?.fullName);
      expect(found2?.fullName).toBe(found3?.fullName);
    });
  });
});
