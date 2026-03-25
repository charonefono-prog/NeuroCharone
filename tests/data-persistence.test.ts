import { describe, it, expect, beforeEach, vi } from "vitest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getPatients,
  savePatient,
  updatePatient,
  deletePatient,
  getPlans,
  savePlan,
  getSessions,
  saveSession,
  Patient,
  TherapeuticPlan,
  Session,
} from "../lib/local-storage";

// Mock AsyncStorage
vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
}));

// Mock audit log
vi.mock("../lib/audit-log", () => ({
  addAuditLog: vi.fn(),
}));

describe("Data Persistence - AsyncStorage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Patient Persistence", () => {
    it("should save and retrieve patient data", async () => {
      const mockPatients: Patient[] = [];

      // Mock getItem to return empty array initially
      (AsyncStorage.getItem as any).mockResolvedValueOnce(null);

      // Mock setItem
      (AsyncStorage.setItem as any).mockImplementation(async (key: string, value: string) => {
        if (key === "@neuromap:patients") {
          mockPatients.push(...JSON.parse(value));
        }
      });

      // Save patient
      const newPatient = await savePatient({
        fullName: "Test Patient",
        birthDate: "1990-01-01",
        status: "active",
      });

      expect(newPatient).toBeDefined();
      expect(newPatient.id).toBeDefined();
      expect(newPatient.fullName).toBe("Test Patient");
      expect(newPatient.createdAt).toBeDefined();
      expect(newPatient.updatedAt).toBeDefined();
    });

    it("should persist patient data across multiple saves", async () => {
      const mockPatients: Patient[] = [];

      (AsyncStorage.getItem as any).mockImplementation(async (key: string) => {
        if (key === "@neuromap:patients") {
          return mockPatients.length > 0 ? JSON.stringify(mockPatients) : null;
        }
        return null;
      });

      (AsyncStorage.setItem as any).mockImplementation(async (key: string, value: string) => {
        if (key === "@neuromap:patients") {
          mockPatients.length = 0;
          mockPatients.push(...JSON.parse(value));
        }
      });

      // Save first patient
      const patient1 = await savePatient({
        fullName: "Patient 1",
        birthDate: "1990-01-01",
        status: "active",
      });

      // Save second patient
      const patient2 = await savePatient({
        fullName: "Patient 2",
        birthDate: "1991-01-01",
        status: "active",
      });

      // Verify both patients are saved
      expect(mockPatients.length).toBe(2);
      expect(mockPatients[0].fullName).toBe("Patient 1");
      expect(mockPatients[1].fullName).toBe("Patient 2");
    });

    it("should update patient data without losing other patients", async () => {
      const mockPatients: Patient[] = [
        {
          id: "1",
          fullName: "Patient 1",
          birthDate: "1990-01-01",
          status: "active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          fullName: "Patient 2",
          birthDate: "1991-01-01",
          status: "active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      (AsyncStorage.getItem as any).mockImplementation(async (key: string) => {
        if (key === "@neuromap:patients") {
          return JSON.stringify(mockPatients);
        }
        return null;
      });

      (AsyncStorage.setItem as any).mockImplementation(async (key: string, value: string) => {
        if (key === "@neuromap:patients") {
          mockPatients.length = 0;
          mockPatients.push(...JSON.parse(value));
        }
      });

      // Update patient 1
      const updated = await updatePatient("1", { status: "paused" });

      expect(updated).toBeDefined();
      expect(updated?.status).toBe("paused");
      expect(mockPatients.length).toBe(2);
      expect(mockPatients[0].status).toBe("paused");
      expect(mockPatients[1].status).toBe("active");
    });

    it("should delete patient without losing other patients", async () => {
      const mockPatients: Patient[] = [
        {
          id: "1",
          fullName: "Patient 1",
          birthDate: "1990-01-01",
          status: "active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          fullName: "Patient 2",
          birthDate: "1991-01-01",
          status: "active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      (AsyncStorage.getItem as any).mockImplementation(async (key: string) => {
        if (key === "@neuromap:patients") {
          return JSON.stringify(mockPatients);
        }
        return null;
      });

      (AsyncStorage.setItem as any).mockImplementation(async (key: string, value: string) => {
        if (key === "@neuromap:patients") {
          mockPatients.length = 0;
          mockPatients.push(...JSON.parse(value));
        }
      });

      // Delete patient 1
      const deleted = await deletePatient("1");

      expect(deleted).toBe(true);
      expect(mockPatients.length).toBe(1);
      expect(mockPatients[0].id).toBe("2");
    });
  });

  describe("Plan Persistence", () => {
    it("should save and retrieve therapeutic plans", async () => {
      const mockPlans: TherapeuticPlan[] = [];

      (AsyncStorage.getItem as any).mockResolvedValueOnce(null);

      (AsyncStorage.setItem as any).mockImplementation(async (key: string, value: string) => {
        if (key === "@neuromap:plans") {
          mockPlans.push(...JSON.parse(value));
        }
      });

      const newPlan = await savePlan({
        patientId: "patient-1",
        objective: "Test treatment",
        targetRegions: ["Frontal"],
        targetPoints: ["F3"],
        frequency: 3,
        totalDuration: 12,
        isActive: true,
      });

      expect(newPlan).toBeDefined();
      expect(newPlan.patientId).toBe("patient-1");
      expect(newPlan.objective).toBe("Test treatment");
    });
  });

  describe("Session Persistence", () => {
    it("should save and retrieve sessions", async () => {
      const mockSessions: Session[] = [];

      (AsyncStorage.getItem as any).mockResolvedValueOnce(null);

      (AsyncStorage.setItem as any).mockImplementation(async (key: string, value: string) => {
        if (key === "@neuromap:sessions") {
          mockSessions.push(...JSON.parse(value));
        }
      });

      const newSession = await saveSession({
        patientId: "patient-1",
        planId: "plan-1",
        sessionDate: new Date().toISOString(),
        durationMinutes: 30,
        stimulatedPoints: ["F3", "F7"],
      });

      expect(newSession).toBeDefined();
      expect(newSession.patientId).toBe("patient-1");
      expect(newSession.stimulatedPoints).toEqual(["F3", "F7"]);
    });
  });

  describe("Data Integrity", () => {
    it("should maintain data integrity after multiple operations", async () => {
      const mockPatients: Patient[] = [];
      const mockPlans: TherapeuticPlan[] = [];
      const mockSessions: Session[] = [];

      (AsyncStorage.getItem as any).mockImplementation(async (key: string) => {
        if (key === "@neuromap:patients") {
          return mockPatients.length > 0 ? JSON.stringify(mockPatients) : null;
        }
        if (key === "@neuromap:plans") {
          return mockPlans.length > 0 ? JSON.stringify(mockPlans) : null;
        }
        if (key === "@neuromap:sessions") {
          return mockSessions.length > 0 ? JSON.stringify(mockSessions) : null;
        }
        return null;
      });

      (AsyncStorage.setItem as any).mockImplementation(async (key: string, value: string) => {
        if (key === "@neuromap:patients") {
          mockPatients.length = 0;
          mockPatients.push(...JSON.parse(value));
        }
        if (key === "@neuromap:plans") {
          mockPlans.length = 0;
          mockPlans.push(...JSON.parse(value));
        }
        if (key === "@neuromap:sessions") {
          mockSessions.length = 0;
          mockSessions.push(...JSON.parse(value));
        }
      });

      // Create patient
      const patient = await savePatient({
        fullName: "Test Patient",
        birthDate: "1990-01-01",
        status: "active",
      });

      // Create plan
      const plan = await savePlan({
        patientId: patient.id,
        objective: "Test treatment",
        targetRegions: ["Frontal"],
        targetPoints: ["F3"],
        frequency: 3,
        totalDuration: 12,
        isActive: true,
      });

      // Create session
      const session = await saveSession({
        patientId: patient.id,
        planId: plan.id,
        sessionDate: new Date().toISOString(),
        durationMinutes: 30,
        stimulatedPoints: ["F3"],
      });

      // Verify all data is persisted
      expect(mockPatients.length).toBe(1);
      expect(mockPlans.length).toBe(1);
      expect(mockSessions.length).toBe(1);

      // Verify relationships
      expect(mockPlans[0].patientId).toBe(patient.id);
      expect(mockSessions[0].patientId).toBe(patient.id);
      expect(mockSessions[0].planId).toBe(plan.id);
    });

    it("should not lose data on concurrent operations", async () => {
      const mockPatients: Patient[] = [];

      (AsyncStorage.getItem as any).mockImplementation(async (key: string) => {
        if (key === "@neuromap:patients") {
          return mockPatients.length > 0 ? JSON.stringify(mockPatients) : null;
        }
        return null;
      });

      (AsyncStorage.setItem as any).mockImplementation(async (key: string, value: string) => {
        if (key === "@neuromap:patients") {
          mockPatients.length = 0;
          mockPatients.push(...JSON.parse(value));
        }
      });

      // Save multiple patients concurrently
      const promises = Array.from({ length: 5 }, (_, i) =>
        savePatient({
          fullName: `Patient ${i + 1}`,
          birthDate: "1990-01-01",
          status: "active",
        })
      );

      const results = await Promise.all(promises);

      expect(results.length).toBe(5);
      expect(mockPatients.length).toBe(5);
      results.forEach((result, i) => {
        expect(result.fullName).toBe(`Patient ${i + 1}`);
      });
    });
  });
});
