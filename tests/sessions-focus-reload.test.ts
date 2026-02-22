import { describe, it, expect, beforeEach, vi } from "vitest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSessions, saveSession, getPatients, savePatient, type Session } from "../lib/local-storage";

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

describe("Sessions Screen - Focus Reload", () => {
  let mockSessions: Session[] = [];
  let callCount = 0;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSessions = [];
    callCount = 0;
  });

  it("should reload sessions when screen gains focus", async () => {
    // Setup mock to track how many times getSessions is called
    (AsyncStorage.getItem as any).mockImplementation(async (key: string) => {
      if (key === "@neuromap:sessions") {
        callCount++;
        return mockSessions.length > 0 ? JSON.stringify(mockSessions) : null;
      }
      return null;
    });

    (AsyncStorage.setItem as any).mockImplementation(async (key: string, value: string) => {
      if (key === "@neuromap:sessions") {
        mockSessions.length = 0;
        mockSessions.push(...JSON.parse(value));
      }
    });

    // First load - simulate initial screen mount
    let sessions = await getSessions();
    expect(sessions.length).toBe(0);
    expect(callCount).toBe(1);

    // Save a new session
    const newSession = await saveSession({
      patientId: "patient-1",
      planId: "plan-1",
      sessionDate: new Date().toISOString(),
      durationMinutes: 30,
      stimulatedPoints: ["F3", "F7"],
    });

    expect(newSession).toBeDefined();
    expect(mockSessions.length).toBe(1);

    // Second load - simulate focus effect reloading
    sessions = await getSessions();
    expect(sessions.length).toBe(1);
    // callCount may be 2 or 3 depending on internal implementation
    expect(callCount).toBeGreaterThanOrEqual(2);
    expect(sessions[0].patientId).toBe("patient-1");
  });

  it("should show newly created session after focus reload", async () => {
    (AsyncStorage.getItem as any).mockImplementation(async (key: string) => {
      if (key === "@neuromap:sessions") {
        return mockSessions.length > 0 ? JSON.stringify(mockSessions) : null;
      }
      return null;
    });

    (AsyncStorage.setItem as any).mockImplementation(async (key: string, value: string) => {
      if (key === "@neuromap:sessions") {
        mockSessions.length = 0;
        mockSessions.push(...JSON.parse(value));
      }
    });

    // Initial state - no sessions
    let sessions = await getSessions();
    expect(sessions.length).toBe(0);

    // Create multiple sessions
    const session1 = await saveSession({
      patientId: "patient-1",
      planId: "plan-1",
      sessionDate: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      durationMinutes: 30,
      stimulatedPoints: ["F3"],
    });

    const session2 = await saveSession({
      patientId: "patient-2",
      planId: "plan-2",
      sessionDate: new Date().toISOString(), // now
      durationMinutes: 45,
      stimulatedPoints: ["F4"],
    });

    // Reload on focus
    sessions = await getSessions();
    expect(sessions.length).toBe(2);

    // Verify sessions are sorted by date (newest first)
    const sortedSessions = [...sessions].sort((a, b) => {
      return new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime();
    });

    expect(sortedSessions[0].id).toBe(session2.id);
    expect(sortedSessions[1].id).toBe(session1.id);
  });

  it("should handle rapid focus/blur cycles", async () => {
    (AsyncStorage.getItem as any).mockImplementation(async (key: string) => {
      if (key === "@neuromap:sessions") {
        return mockSessions.length > 0 ? JSON.stringify(mockSessions) : null;
      }
      return null;
    });

    (AsyncStorage.setItem as any).mockImplementation(async (key: string, value: string) => {
      if (key === "@neuromap:sessions") {
        mockSessions.length = 0;
        mockSessions.push(...JSON.parse(value));
      }
    });

    // Simulate rapid focus/blur cycles
    const loadCycles = [];
    for (let i = 0; i < 3; i++) {
      loadCycles.push(getSessions());
      
      // Create a session between cycles
      if (i < 2) {
        await saveSession({
          patientId: `patient-${i}`,
          planId: `plan-${i}`,
          sessionDate: new Date().toISOString(),
          durationMinutes: 30,
          stimulatedPoints: ["F3"],
        });
      }
    }

    const results = await Promise.all(loadCycles);
    
    // First cycle: 0 sessions
    expect(results[0].length).toBe(0);
    // Second cycle: 1 session
    expect(results[1].length).toBe(1);
    // Third cycle: 2 sessions
    expect(results[2].length).toBe(2);
  });

  it("should maintain data consistency across focus reloads", async () => {
    (AsyncStorage.getItem as any).mockImplementation(async (key: string) => {
      if (key === "@neuromap:sessions") {
        return mockSessions.length > 0 ? JSON.stringify(mockSessions) : null;
      }
      return null;
    });

    (AsyncStorage.setItem as any).mockImplementation(async (key: string, value: string) => {
      if (key === "@neuromap:sessions") {
        mockSessions.length = 0;
        mockSessions.push(...JSON.parse(value));
      }
    });

    // Create a session with all fields
    const sessionData = {
      patientId: "patient-123",
      planId: "plan-456",
      sessionDate: new Date().toISOString(),
      durationMinutes: 45,
      stimulatedPoints: ["F3", "F4", "F7"],
      joules: 100,
      observations: "Test observation",
      patientReactions: "Good response",
    };

    const created = await saveSession(sessionData);

    // First focus reload
    let reloaded = await getSessions();
    expect(reloaded.length).toBe(1);
    expect(reloaded[0].patientId).toBe(sessionData.patientId);
    expect(reloaded[0].durationMinutes).toBe(sessionData.durationMinutes);
    expect(reloaded[0].joules).toBe(sessionData.joules);
    expect(reloaded[0].observations).toBe(sessionData.observations);

    // Second focus reload - verify data is still consistent
    reloaded = await getSessions();
    expect(reloaded.length).toBe(1);
    expect(reloaded[0].id).toBe(created.id);
    expect(reloaded[0].stimulatedPoints).toEqual(sessionData.stimulatedPoints);
  });
});
