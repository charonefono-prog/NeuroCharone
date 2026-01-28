import AsyncStorage from "@react-native-async-storage/async-storage";
import { addAuditLog } from "./audit-log";
import { storageQueue } from "./storage-queue";

// Tipos de dados
export interface MediaItem {
  id: string;
  uri: string;
  type: "photo";
  caption?: string;
  createdAt: string;
}

export interface Patient {
  id: string;
  fullName: string;
  birthDate: string;
  cpf?: string;
  phone?: string;
  email?: string;
  address?: string;
  diagnosis?: string;
  medicalNotes?: string;
  initialSymptomScore?: number; // Avalia\u00e7\u00e3o inicial dos sintomas (0-10)
  media?: MediaItem[]; // Fotos do paciente
  status: "active" | "paused" | "completed";
  professionalId?: string; // ID do profissional responsável
  createdAt: string;
  updatedAt: string;
}

export interface TherapeuticPlan {
  id: string;
  patientId: string;
  objective: string;
  targetRegions: string[];
  targetPoints: string[];
  frequency: number;
  totalDuration: number;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  patientId: string;
  planId: string;
  sessionDate: string; // Data/hora em que a sess\u00e3o foi realizada
  scheduledDate?: string; // Data/hora agendada para a sess\u00e3o (se for futura)
  notificationId?: string; // ID da notifica\u00e7\u00e3o agendada
  durationMinutes: number; // Dura\u00e7\u00e3o em minutos
  stimulatedPoints: string[];
  joules?: number; // Energia aplicada em Joules
  symptomScore?: number; // Avalia\u00e7\u00e3o dos sintomas nesta sess\u00e3o (0-10)
  observations?: string;
  patientReactions?: string;
  nextSessionDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Chaves de armazenamento
const KEYS = {
  PATIENTS: "@neuromap:patients",
  PLANS: "@neuromap:plans",
  SESSIONS: "@neuromap:sessions",
};

// Funções de pacientes
export async function getPatients(): Promise<Patient[]> {
  return storageQueue.enqueue(async () => {
    try {
      const data = await AsyncStorage.getItem(KEYS.PATIENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting patients:", error);
      return [];
    }
  });
}

export async function savePatient(patient: Omit<Patient, "id" | "createdAt" | "updatedAt">): Promise<Patient> {
  return storageQueue.enqueue(async () => {
    try {
      const patients = await AsyncStorage.getItem(KEYS.PATIENTS);
      const patientsList = patients ? JSON.parse(patients) : [];
      const newPatient: Patient = {
        ...patient,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      patientsList.push(newPatient);
      await AsyncStorage.setItem(KEYS.PATIENTS, JSON.stringify(patientsList));
      
      // Log de auditoria
      await addAuditLog({
        entityType: "patient",
        entityId: newPatient.id,
        action: "patient_created",
        metadata: { patientName: newPatient.fullName },
      });
      
      return newPatient;
    } catch (error) {
      console.error("Error saving patient:", error);
      throw error;
    }
  });
}

export async function updatePatient(id: string, updates: Partial<Patient>): Promise<Patient | null> {
  return storageQueue.enqueue(async () => {
    try {
      const patientsData = await AsyncStorage.getItem(KEYS.PATIENTS);
      const patients = patientsData ? JSON.parse(patientsData) : [];
      const index = patients.findIndex((p: Patient) => p.id === id);
      if (index === -1) return null;

      const oldPatient = patients[index];
      patients[index] = {
        ...patients[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(KEYS.PATIENTS, JSON.stringify(patients));
      
      // Log de auditoria com mudanças
      const changes = Object.keys(updates)
        .filter((key) => key !== "updatedAt")
        .map((key) => ({
          field: key,
          oldValue: oldPatient[key as keyof Patient],
          newValue: updates[key as keyof Patient],
        }));
      
      if (changes.length > 0) {
        await addAuditLog({
          entityType: "patient",
          entityId: id,
          action: "patient_updated",
          changes,
          metadata: { patientName: patients[index].fullName },
        });
      }
      
      return patients[index];
    } catch (error) {
      console.error("Error updating patient:", error);
      throw error;
    }
  });
}

export async function deletePatient(id: string): Promise<boolean> {
  return storageQueue.enqueue(async () => {
    try {
      const patientsData = await AsyncStorage.getItem(KEYS.PATIENTS);
      const patients = patientsData ? JSON.parse(patientsData) : [];
      const patient = patients.find((p: Patient) => p.id === id);
      const filtered = patients.filter((p: Patient) => p.id !== id);
      await AsyncStorage.setItem(KEYS.PATIENTS, JSON.stringify(filtered));
      
      // Log de auditoria
      if (patient) {
        await addAuditLog({
          entityType: "patient",
          entityId: id,
          action: "patient_deleted",
          metadata: { patientName: patient.fullName },
        });
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting patient:", error);
      return false;
    }
  });
}

// Funções de planos terapêuticos
export async function getPlans(): Promise<TherapeuticPlan[]> {
  return storageQueue.enqueue(async () => {
    try {
      const data = await AsyncStorage.getItem(KEYS.PLANS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting plans:", error);
      return [];
    }
  });
}

export async function getPlansByPatient(patientId: string): Promise<TherapeuticPlan[]> {
  const plans = await getPlans();
  return plans.filter((p) => p.patientId === patientId);
}

export async function savePlan(plan: Omit<TherapeuticPlan, "id" | "createdAt" | "updatedAt">): Promise<TherapeuticPlan> {
  return storageQueue.enqueue(async () => {
    try {
      const plansData = await AsyncStorage.getItem(KEYS.PLANS);
      const plans = plansData ? JSON.parse(plansData) : [];
      const newPlan: TherapeuticPlan = {
        ...plan,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      plans.push(newPlan);
      await AsyncStorage.setItem(KEYS.PLANS, JSON.stringify(plans));
      
      // Log de auditoria
      await addAuditLog({
        entityType: "plan",
        entityId: newPlan.id,
        action: "plan_created",
        metadata: { 
          patientId: newPlan.patientId,
          objective: newPlan.objective,
        },
      });
      
      return newPlan;
    } catch (error) {
      console.error("Error saving plan:", error);
      throw error;
    }
  });
}

// Funções de sessões
export async function getSessions(): Promise<Session[]> {
  return storageQueue.enqueue(async () => {
    try {
      const data = await AsyncStorage.getItem(KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting sessions:", error);
      return [];
    }
  });
}

export async function getSessionsByPatient(patientId: string): Promise<Session[]> {
  const sessions = await getSessions();
  return sessions.filter((s) => s.patientId === patientId);
}

export async function saveSession(session: Omit<Session, "id" | "createdAt" | "updatedAt">): Promise<Session> {
  return storageQueue.enqueue(async () => {
    try {
      const sessionsData = await AsyncStorage.getItem(KEYS.SESSIONS);
      const sessions = sessionsData ? JSON.parse(sessionsData) : [];
      const newSession: Session = {
        ...session,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      sessions.push(newSession);
      await AsyncStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
      
      // Log de auditoria
      await addAuditLog({
        entityType: "session",
        entityId: newSession.id,
        action: "session_created",
        metadata: { 
          patientId: newSession.patientId,
          sessionDate: newSession.sessionDate,
          stimulatedPoints: newSession.stimulatedPoints,
        },
      });
      
      return newSession;
    } catch (error) {
      console.error("Error saving session:", error);
      throw error;
    }
  });
}

// Função para inicializar dados de exemplo
export async function initializeSampleData(): Promise<void> {
  const patients = await getPatients();
  if (patients.length > 0) return; // Já tem dados

  // Criar pacientes de exemplo
  const patient1 = await savePatient({
    fullName: "Maria Silva",
    birthDate: "1985-03-15",
    phone: "(11) 98765-4321",
    email: "maria.silva@email.com",
    diagnosis: "Depressão moderada",
    status: "active",
  });

  const patient2 = await savePatient({
    fullName: "João Santos",
    birthDate: "1978-07-22",
    phone: "(11) 97654-3210",
    diagnosis: "Ansiedade generalizada",
    status: "active",
  });

  // Criar planos terapêuticos
  await savePlan({
    patientId: patient1.id,
    objective: "Tratamento de depressão com estimulação do córtex pré-frontal dorsolateral esquerdo",
    targetRegions: ["Frontal Central"],
    targetPoints: ["F3", "F7"],
    frequency: 3,
    totalDuration: 12,
    isActive: true,
  });

  await savePlan({
    patientId: patient2.id,
    objective: "Redução de sintomas de ansiedade com estimulação bilateral",
    targetRegions: ["Frontal Central", "Temporal"],
    targetPoints: ["F4", "T3", "T4"],
    frequency: 2,
    totalDuration: 8,
    isActive: true,
  });

  // Criar sessões de exemplo
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  await saveSession({
    patientId: patient1.id,
    planId: "1",
    sessionDate: yesterday.toISOString(),
    durationMinutes: 30,
    stimulatedPoints: ["F3", "F7"],
    joules: 5,
    observations: "Paciente relatou leve melhora no humor",
    patientReactions: "Bem tolerado, sem efeitos adversos",
  });

  await saveSession({
    patientId: patient2.id,
    planId: "2",
    sessionDate: today.toISOString(),
    durationMinutes: 25,
    stimulatedPoints: ["F4", "T3", "T4"],
    joules: 3,
    observations: "Primeira sessão, paciente ansioso mas cooperativo",
    patientReactions: "Leve formigamento, sem desconforto",
  });
}
