import { getDb } from "../db";
import { patients, therapeuticPlans, sessions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Middleware de autorização para verificar se um profissional tem acesso a um paciente
 */
export async function authorizePatientAccess(
  professionalId: number,
  patientId: number
): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;

    // Buscar paciente e verificar se pertence ao profissional
    const patient = await db
      .select()
      .from(patients)
      .where(eq(patients.id, patientId))
      .limit(1);

    if (patient.length === 0) {
      return false;
    }

    // Verificar se o paciente foi criado pelo profissional
    return patient[0].userId === professionalId;
  } catch (error) {
    console.error("Authorization error:", error);
    return false;
  }
}

/**
 * Middleware de autorização para verificar se um profissional tem acesso a um plano terapêutico
 */
export async function authorizePlanAccess(
  professionalId: number,
  planId: number
): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;

    // Buscar plano e verificar se pertence ao profissional
    const plan = await db
      .select()
      .from(therapeuticPlans)
      .where(eq(therapeuticPlans.id, planId))
      .limit(1);

    if (plan.length === 0) {
      return false;
    }

    // Verificar se o paciente do plano pertence ao profissional
    const patient = await db
      .select()
      .from(patients)
      .where(eq(patients.id, plan[0].patientId))
      .limit(1);

    return patient.length > 0 && patient[0].userId === professionalId;
  } catch (error) {
    console.error("Authorization error:", error);
    return false;
  }
}

/**
 * Middleware de autorização para verificar se um profissional tem acesso a uma sessão
 */
export async function authorizeSessionAccess(
  professionalId: number,
  sessionId: number
): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;

    // Buscar sessão e verificar se pertence ao profissional
    const session = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .limit(1);

    if (session.length === 0) {
      return false;
    }

    // Verificar se o paciente da sessão pertence ao profissional
    const patient = await db
      .select()
      .from(patients)
      .where(eq(patients.id, session[0].patientId))
      .limit(1);

    return patient.length > 0 && patient[0].userId === professionalId;
  } catch (error) {
    console.error("Authorization error:", error);
    return false;
  }
}

/**
 * Filtrar pacientes do profissional
 */
export async function filterPatientsByProfessional(
  professionalId: number
): Promise<any[]> {
  try {
    const db = await getDb();
    if (!db) return [];

    // Retornar apenas pacientes do profissional
    const userPatients = await db
      .select()
      .from(patients)
      .where(eq(patients.userId, professionalId));

    return userPatients;
  } catch (error) {
    console.error("Filter error:", error);
    return [];
  }
}

/**
 * Filtrar planos terapêuticos do profissional
 */
export async function filterPlansByProfessional(
  professionalId: number
): Promise<any[]> {
  try {
    const db = await getDb();
    if (!db) return [];

    // Retornar apenas planos dos pacientes do profissional
    const userPatients = await db
      .select()
      .from(patients)
      .where(eq(patients.userId, professionalId));

    const patientIds = userPatients.map((p) => p.id);

    if (patientIds.length === 0) {
      return [];
    }

    const userPlans = await db
      .select()
      .from(therapeuticPlans)
      .where(eq(therapeuticPlans.patientId, patientIds[0]));

    return userPlans;
  } catch (error) {
    console.error("Filter error:", error);
    return [];
  }
}

/**
 * Filtrar sessões do profissional
 */
export async function filterSessionsByProfessional(
  professionalId: number
): Promise<any[]> {
  try {
    const db = await getDb();
    if (!db) return [];

    // Retornar apenas sessões dos pacientes do profissional
    const userPatients = await db
      .select()
      .from(patients)
      .where(eq(patients.userId, professionalId));

    const patientIds = userPatients.map((p) => p.id);

    if (patientIds.length === 0) {
      return [];
    }

    const userSessions = await db
      .select()
      .from(sessions)
      .where(eq(sessions.patientId, patientIds[0]));

    return userSessions;
  } catch (error) {
    console.error("Filter error:", error);
    return [];
  }
}
