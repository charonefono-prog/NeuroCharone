import AsyncStorage from "@react-native-async-storage/async-storage";

export type AuditAction =
  | "patient_created"
  | "patient_updated"
  | "patient_deleted"
  | "plan_created"
  | "plan_updated"
  | "plan_deleted"
  | "session_created"
  | "session_updated"
  | "session_deleted";

export interface AuditLog {
  id: string;
  entityType: "patient" | "plan" | "session";
  entityId: string;
  action: AuditAction;
  timestamp: number;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  metadata?: Record<string, any>;
}

const AUDIT_LOG_KEY = "@neurolasermap:audit_logs";

// Obter todos os logs de auditoria
export async function getAuditLogs(): Promise<AuditLog[]> {
  try {
    const data = await AsyncStorage.getItem(AUDIT_LOG_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Erro ao carregar logs de auditoria:", error);
    return [];
  }
}

// Obter logs de uma entidade específica
export async function getAuditLogsByEntity(
  entityType: "patient" | "plan" | "session",
  entityId: string
): Promise<AuditLog[]> {
  const logs = await getAuditLogs();
  return logs.filter((log) => log.entityType === entityType && log.entityId === entityId);
}

// Adicionar novo log de auditoria
export async function addAuditLog(log: Omit<AuditLog, "id" | "timestamp">): Promise<void> {
  try {
    const logs = await getAuditLogs();
    const newLog: AuditLog = {
      ...log,
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    logs.push(newLog);
    await AsyncStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error("Erro ao adicionar log de auditoria:", error);
  }
}

// Limpar logs antigos (manter apenas últimos 90 dias)
export async function cleanOldAuditLogs(): Promise<void> {
  try {
    const logs = await getAuditLogs();
    const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
    const filteredLogs = logs.filter((log) => log.timestamp > ninetyDaysAgo);
    await AsyncStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(filteredLogs));
  } catch (error) {
    console.error("Erro ao limpar logs antigos:", error);
  }
}

// Obter descrição legível da ação
export function getActionDescription(action: AuditAction): string {
  const descriptions: Record<AuditAction, string> = {
    patient_created: "Paciente criado",
    patient_updated: "Paciente atualizado",
    patient_deleted: "Paciente excluído",
    plan_created: "Plano terapêutico criado",
    plan_updated: "Plano terapêutico atualizado",
    plan_deleted: "Plano terapêutico excluído",
    session_created: "Sessão registrada",
    session_updated: "Sessão atualizada",
    session_deleted: "Sessão excluída",
  };
  return descriptions[action] || action;
}

// Obter nome legível do campo
export function getFieldName(field: string): string {
  const fieldNames: Record<string, string> = {
    fullName: "Nome completo",
    birthDate: "Data de nascimento",
    cpf: "CPF",
    phone: "Telefone",
    email: "Email",
    address: "Endereço",
    diagnosis: "Diagnóstico",
    status: "Status",
    objectives: "Objetivos",
    frequency: "Frequência",
    duration: "Duração",
    targetPoints: "Pontos alvo",
    sessionDate: "Data da sessão",
    durationMinutes: "Duração (minutos)",
    joules: "Joules",
    stimulatedPoints: "Pontos estimulados",
    observations: "Observações",
  };
  return fieldNames[field] || field;
}

// Formatar valor para exibição
export function formatValue(value: any): string {
  if (value === null || value === undefined) return "Vazio";
  if (typeof value === "boolean") return value ? "Sim" : "Não";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
