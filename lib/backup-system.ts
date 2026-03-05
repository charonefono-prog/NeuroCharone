import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Platform } from "react-native";

// ─── All AsyncStorage keys used in the app ───────────────────────────
const STORAGE_KEYS = {
  patients: "@neuromap:patients",
  plans: "@neuromap:plans",
  sessions: "@neuromap:sessions",
  scaleResponses: "clinical_scales_responses",
  professionalProfile: "professionalProfile",
  planTemplates: "@neurolasermap:plan_templates",
  therapeuticCycles: "therapeutic_cycles",
  auditLogs: "@neurolasermap:audit_logs",
  scheduledNotifications: "@neuromap:scheduled_notifications",
  notifications: "@neurolasermap:notifications",
  reminderAdvance: "@neurolasermap:reminder_advance",
  progressGoals: "@neuromap:progress_goals",
  progressAlerts: "@neuromap:progress_alerts",
  searchHistory: "@neurolasermap/search_history",
  patientAuth: "patient_auth",
  lastBackupDate: "lastBackupDate",
} as const;

// ─── Types ───────────────────────────────────────────────────────────
export interface BackupData {
  version: string;
  appName: string;
  timestamp: string;
  deviceInfo?: string;
  data: {
    patients: any[];
    plans: any[];
    sessions: any[];
    scaleResponses: any[];
    professionalProfile: any | null;
    planTemplates: any[];
    therapeuticCycles: any[];
    auditLogs: any[];
    scheduledNotifications: any[];
    notifications: any[];
    reminderAdvance: string | null;
    progressGoals: any[];
    progressAlerts: any[];
    searchHistory: any[];
  };
}

export interface BackupSummary {
  timestamp: string;
  patients: number;
  plans: number;
  sessions: number;
  scaleResponses: number;
  planTemplates: number;
  therapeuticCycles: number;
  auditLogs: number;
  progressGoals: number;
  hasProfessionalProfile: boolean;
}

export interface ConflictItem {
  type: "patient" | "plan" | "session" | "scaleResponse" | "template" | "cycle" | "goal";
  existingItem: any;
  incomingItem: any;
  label: string;
}

export type ConflictResolution = "overwrite" | "keep" | "overwrite_all" | "keep_all";

// ─── Export Functions ─────────────────────────────────────────────────

/**
 * Coleta TODOS os dados do app e gera o objeto de backup
 */
export async function collectAllData(): Promise<BackupData> {
  const readJson = async (key: string): Promise<any> => {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const readString = async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const patients = (await readJson(STORAGE_KEYS.patients)) || [];
  const plans = (await readJson(STORAGE_KEYS.plans)) || [];
  const sessions = (await readJson(STORAGE_KEYS.sessions)) || [];
  const scaleResponses = (await readJson(STORAGE_KEYS.scaleResponses)) || [];
  const professionalProfile = await readJson(STORAGE_KEYS.professionalProfile);
  const planTemplates = (await readJson(STORAGE_KEYS.planTemplates)) || [];
  const therapeuticCycles = (await readJson(STORAGE_KEYS.therapeuticCycles)) || [];
  const auditLogs = (await readJson(STORAGE_KEYS.auditLogs)) || [];
  const scheduledNotifications = (await readJson(STORAGE_KEYS.scheduledNotifications)) || [];
  const notifications = (await readJson(STORAGE_KEYS.notifications)) || [];
  const reminderAdvance = await readString(STORAGE_KEYS.reminderAdvance);
  const progressGoals = (await readJson(STORAGE_KEYS.progressGoals)) || [];
  const progressAlerts = (await readJson(STORAGE_KEYS.progressAlerts)) || [];
  const searchHistory = (await readJson(STORAGE_KEYS.searchHistory)) || [];

  return {
    version: "2.0.0",
    appName: "NeuroLaserMap",
    timestamp: new Date().toISOString(),
    deviceInfo: Platform.OS,
    data: {
      patients,
      plans,
      sessions,
      scaleResponses,
      professionalProfile,
      planTemplates,
      therapeuticCycles,
      auditLogs,
      scheduledNotifications,
      notifications,
      reminderAdvance,
      progressGoals,
      progressAlerts,
      searchHistory,
    },
  };
}

/**
 * Gera o resumo de um backup (para exibir ao usuário antes de importar)
 */
export function getBackupSummary(backup: BackupData): BackupSummary {
  return {
    timestamp: backup.timestamp,
    patients: backup.data.patients?.length || 0,
    plans: backup.data.plans?.length || 0,
    sessions: backup.data.sessions?.length || 0,
    scaleResponses: backup.data.scaleResponses?.length || 0,
    planTemplates: backup.data.planTemplates?.length || 0,
    therapeuticCycles: backup.data.therapeuticCycles?.length || 0,
    auditLogs: backup.data.auditLogs?.length || 0,
    progressGoals: backup.data.progressGoals?.length || 0,
    hasProfessionalProfile: !!backup.data.professionalProfile,
  };
}

/**
 * Exporta backup completo para arquivo JSON e compartilha
 */
export async function exportFullBackup(): Promise<boolean> {
  try {
    const backupData = await collectAllData();

    // Gerar nome do arquivo com data e hora
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}_${String(date.getHours()).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}`;
    const fileName = `NeuroLaserMap_Backup_${dateStr}.json`;

    if (Platform.OS === "web") {
      // Web: download direto
      const content = JSON.stringify(backupData, null, 2);
      const blob = new Blob([content], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // Mobile: salvar e compartilhar
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(backupData, null, 2));

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/json",
          dialogTitle: "Exportar Backup NeuroLaserMap",
          UTI: "public.json",
        });
      } else {
        Alert.alert("Erro", "Compartilhamento não disponível neste dispositivo.");
        return false;
      }
    }

    // Registrar data do backup
    await AsyncStorage.setItem(STORAGE_KEYS.lastBackupDate, new Date().toISOString());
    return true;
  } catch (error) {
    console.error("[BackupSystem] Erro ao exportar:", error);
    Alert.alert("Erro", "Não foi possível exportar o backup. Tente novamente.");
    return false;
  }
}

// ─── Import Functions ─────────────────────────────────────────────────

/**
 * Valida se o arquivo é um backup válido do NeuroLaserMap
 */
export function validateBackup(data: any): { valid: boolean; error?: string } {
  if (!data || typeof data !== "object") {
    return { valid: false, error: "Arquivo não é um JSON válido." };
  }

  // Suportar versão 1.x (backup antigo) e 2.x (novo)
  if (data.version?.startsWith("1.")) {
    // Backup antigo: tem patients, plans, sessions no nível raiz
    if (!Array.isArray(data.patients)) {
      return { valid: false, error: "Backup v1 inválido: campo 'patients' ausente." };
    }
    return { valid: true };
  }

  if (!data.version || !data.timestamp) {
    return { valid: false, error: "Arquivo não contém informações de versão ou data." };
  }

  if (!data.data || typeof data.data !== "object") {
    return { valid: false, error: "Arquivo não contém dados de backup." };
  }

  if (!Array.isArray(data.data.patients)) {
    return { valid: false, error: "Backup inválido: campo 'patients' ausente ou inválido." };
  }

  return { valid: true };
}

/**
 * Converte backup v1 para formato v2
 */
function migrateV1ToV2(data: any): BackupData {
  return {
    version: "2.0.0",
    appName: "NeuroLaserMap",
    timestamp: data.timestamp || new Date().toISOString(),
    data: {
      patients: data.patients || [],
      plans: data.plans || [],
      sessions: data.sessions || [],
      scaleResponses: [],
      professionalProfile: null,
      planTemplates: [],
      therapeuticCycles: [],
      auditLogs: [],
      scheduledNotifications: [],
      notifications: [],
      reminderAdvance: null,
      progressGoals: [],
      progressAlerts: [],
      searchHistory: [],
    },
  };
}

/**
 * Detecta conflitos entre dados existentes e dados do backup
 */
export async function detectConflicts(backupData: BackupData): Promise<ConflictItem[]> {
  const conflicts: ConflictItem[] = [];

  const readJson = async (key: string): Promise<any[]> => {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  // Verificar conflitos de pacientes (por ID)
  const existingPatients = await readJson(STORAGE_KEYS.patients);
  const existingPatientIds = new Set(existingPatients.map((p: any) => p.id));
  for (const patient of backupData.data.patients || []) {
    if (existingPatientIds.has(patient.id)) {
      const existing = existingPatients.find((p: any) => p.id === patient.id);
      conflicts.push({
        type: "patient",
        existingItem: existing,
        incomingItem: patient,
        label: `${patient.firstName || ""} ${patient.lastName || ""}`.trim() || patient.name || `Paciente ${patient.id}`,
      });
    }
  }

  // Verificar conflitos de planos (por ID)
  const existingPlans = await readJson(STORAGE_KEYS.plans);
  const existingPlanIds = new Set(existingPlans.map((p: any) => p.id));
  for (const plan of backupData.data.plans || []) {
    if (existingPlanIds.has(plan.id)) {
      const existing = existingPlans.find((p: any) => p.id === plan.id);
      conflicts.push({
        type: "plan",
        existingItem: existing,
        incomingItem: plan,
        label: plan.name || plan.title || `Plano ${plan.id}`,
      });
    }
  }

  // Verificar conflitos de sessões (por ID)
  const existingSessions = await readJson(STORAGE_KEYS.sessions);
  const existingSessionIds = new Set(existingSessions.map((s: any) => s.id));
  for (const session of backupData.data.sessions || []) {
    if (existingSessionIds.has(session.id)) {
      conflicts.push({
        type: "session",
        existingItem: existingSessions.find((s: any) => s.id === session.id),
        incomingItem: session,
        label: `Sessão ${session.sessionNumber || session.id} (${new Date(session.sessionDate || session.date).toLocaleDateString("pt-BR")})`,
      });
    }
  }

  return conflicts;
}

/**
 * Mescla arrays por ID, aplicando a resolução de conflitos
 */
function mergeArraysById(
  existing: any[],
  incoming: any[],
  resolution: ConflictResolution,
  conflictIds: Set<string>
): any[] {
  const result = [...existing];
  const existingIds = new Set(result.map((item) => item.id));

  for (const item of incoming) {
    if (existingIds.has(item.id)) {
      // Conflito
      if (resolution === "overwrite" || resolution === "overwrite_all") {
        const index = result.findIndex((r) => r.id === item.id);
        if (index >= 0) {
          result[index] = item;
        }
      }
      // Se "keep" ou "keep_all", não faz nada (mantém o existente)
    } else {
      // Novo item, sempre adicionar
      result.push(item);
    }
  }

  return result;
}

/**
 * Importa dados do backup com resolução de conflitos
 */
export async function importBackupData(
  backupData: BackupData,
  conflictResolution: ConflictResolution = "keep"
): Promise<{ success: boolean; summary: ImportSummary }> {
  const summary: ImportSummary = {
    patientsAdded: 0,
    patientsUpdated: 0,
    plansAdded: 0,
    plansUpdated: 0,
    sessionsAdded: 0,
    sessionsUpdated: 0,
    scaleResponsesAdded: 0,
    scaleResponsesUpdated: 0,
    planTemplatesAdded: 0,
    therapeuticCyclesAdded: 0,
    progressGoalsAdded: 0,
    profileRestored: false,
  };

  try {
    const readJson = async (key: string): Promise<any[]> => {
      try {
        const raw = await AsyncStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    };

    const shouldOverwrite = conflictResolution === "overwrite" || conflictResolution === "overwrite_all";

    // ─── Pacientes ───
    const existingPatients = await readJson(STORAGE_KEYS.patients);
    const existingPatientIds = new Set(existingPatients.map((p: any) => p.id));
    const mergedPatients = mergeArraysById(existingPatients, backupData.data.patients || [], conflictResolution, existingPatientIds);
    summary.patientsAdded = mergedPatients.length - existingPatients.length;
    if (shouldOverwrite) {
      summary.patientsUpdated = (backupData.data.patients || []).filter((p: any) => existingPatientIds.has(p.id)).length;
    }
    await AsyncStorage.setItem(STORAGE_KEYS.patients, JSON.stringify(mergedPatients));

    // ─── Planos ───
    const existingPlans = await readJson(STORAGE_KEYS.plans);
    const existingPlanIds = new Set(existingPlans.map((p: any) => p.id));
    const mergedPlans = mergeArraysById(existingPlans, backupData.data.plans || [], conflictResolution, existingPlanIds);
    summary.plansAdded = mergedPlans.length - existingPlans.length;
    if (shouldOverwrite) {
      summary.plansUpdated = (backupData.data.plans || []).filter((p: any) => existingPlanIds.has(p.id)).length;
    }
    await AsyncStorage.setItem(STORAGE_KEYS.plans, JSON.stringify(mergedPlans));

    // ─── Sessões ───
    const existingSessions = await readJson(STORAGE_KEYS.sessions);
    const existingSessionIds = new Set(existingSessions.map((s: any) => s.id));
    const mergedSessions = mergeArraysById(existingSessions, backupData.data.sessions || [], conflictResolution, existingSessionIds);
    summary.sessionsAdded = mergedSessions.length - existingSessions.length;
    if (shouldOverwrite) {
      summary.sessionsUpdated = (backupData.data.sessions || []).filter((s: any) => existingSessionIds.has(s.id)).length;
    }
    await AsyncStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(mergedSessions));

    // ─── Respostas de Escalas ───
    const existingScales = await readJson(STORAGE_KEYS.scaleResponses);
    const existingScaleIds = new Set(existingScales.map((s: any) => s.id));
    const mergedScales = mergeArraysById(existingScales, backupData.data.scaleResponses || [], conflictResolution, existingScaleIds);
    summary.scaleResponsesAdded = mergedScales.length - existingScales.length;
    if (shouldOverwrite) {
      summary.scaleResponsesUpdated = (backupData.data.scaleResponses || []).filter((s: any) => existingScaleIds.has(s.id)).length;
    }
    await AsyncStorage.setItem(STORAGE_KEYS.scaleResponses, JSON.stringify(mergedScales));

    // ─── Templates de Planos ───
    const existingTemplates = await readJson(STORAGE_KEYS.planTemplates);
    const existingTemplateIds = new Set(existingTemplates.map((t: any) => t.id));
    const mergedTemplates = mergeArraysById(existingTemplates, backupData.data.planTemplates || [], conflictResolution, existingTemplateIds);
    summary.planTemplatesAdded = mergedTemplates.length - existingTemplates.length;
    await AsyncStorage.setItem(STORAGE_KEYS.planTemplates, JSON.stringify(mergedTemplates));

    // ─── Ciclos Terapêuticos ───
    const existingCycles = await readJson(STORAGE_KEYS.therapeuticCycles);
    const existingCycleIds = new Set(existingCycles.map((c: any) => c.id));
    const mergedCycles = mergeArraysById(existingCycles, backupData.data.therapeuticCycles || [], conflictResolution, existingCycleIds);
    summary.therapeuticCyclesAdded = mergedCycles.length - existingCycles.length;
    await AsyncStorage.setItem(STORAGE_KEYS.therapeuticCycles, JSON.stringify(mergedCycles));

    // ─── Metas de Progresso ───
    const existingGoals = await readJson(STORAGE_KEYS.progressGoals);
    const existingGoalIds = new Set(existingGoals.map((g: any) => g.id));
    const mergedGoals = mergeArraysById(existingGoals, backupData.data.progressGoals || [], conflictResolution, existingGoalIds);
    summary.progressGoalsAdded = mergedGoals.length - existingGoals.length;
    await AsyncStorage.setItem(STORAGE_KEYS.progressGoals, JSON.stringify(mergedGoals));

    // ─── Alertas de Progresso ───
    const existingAlerts = await readJson(STORAGE_KEYS.progressAlerts);
    const existingAlertIds = new Set(existingAlerts.map((a: any) => a.id));
    const mergedAlerts = mergeArraysById(existingAlerts, backupData.data.progressAlerts || [], conflictResolution, existingAlertIds);
    await AsyncStorage.setItem(STORAGE_KEYS.progressAlerts, JSON.stringify(mergedAlerts));

    // ─── Logs de Auditoria (sempre adicionar, não conflitar) ───
    const existingLogs = await readJson(STORAGE_KEYS.auditLogs);
    const existingLogIds = new Set(existingLogs.map((l: any) => l.id || l.timestamp));
    const newLogs = (backupData.data.auditLogs || []).filter(
      (l: any) => !existingLogIds.has(l.id || l.timestamp)
    );
    const mergedLogs = [...existingLogs, ...newLogs];
    await AsyncStorage.setItem(STORAGE_KEYS.auditLogs, JSON.stringify(mergedLogs));

    // ─── Perfil Profissional (sobrescrever se backup tem e resolução permite) ───
    if (backupData.data.professionalProfile) {
      const existingProfile = await AsyncStorage.getItem(STORAGE_KEYS.professionalProfile);
      if (!existingProfile || shouldOverwrite) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.professionalProfile,
          JSON.stringify(backupData.data.professionalProfile)
        );
        summary.profileRestored = true;
      }
    }

    // ─── Configurações simples (reminder, notifications) ───
    if (backupData.data.reminderAdvance) {
      await AsyncStorage.setItem(STORAGE_KEYS.reminderAdvance, backupData.data.reminderAdvance);
    }

    // Notificações: mesclar sem duplicar
    if (backupData.data.notifications?.length) {
      const existingNotifs = await readJson(STORAGE_KEYS.notifications);
      const existingNotifIds = new Set(existingNotifs.map((n: any) => n.id));
      const newNotifs = backupData.data.notifications.filter(
        (n: any) => !existingNotifIds.has(n.id)
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.notifications,
        JSON.stringify([...existingNotifs, ...newNotifs])
      );
    }

    if (backupData.data.scheduledNotifications?.length) {
      const existingScheduled = await readJson(STORAGE_KEYS.scheduledNotifications);
      const existingScheduledIds = new Set(existingScheduled.map((n: any) => n.id));
      const newScheduled = backupData.data.scheduledNotifications.filter(
        (n: any) => !existingScheduledIds.has(n.id)
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.scheduledNotifications,
        JSON.stringify([...existingScheduled, ...newScheduled])
      );
    }

    return { success: true, summary };
  } catch (error) {
    console.error("[BackupSystem] Erro ao importar:", error);
    return {
      success: false,
      summary,
    };
  }
}

export interface ImportSummary {
  patientsAdded: number;
  patientsUpdated: number;
  plansAdded: number;
  plansUpdated: number;
  sessionsAdded: number;
  sessionsUpdated: number;
  scaleResponsesAdded: number;
  scaleResponsesUpdated: number;
  planTemplatesAdded: number;
  therapeuticCyclesAdded: number;
  progressGoalsAdded: number;
  profileRestored: boolean;
}

// ─── File Picker ──────────────────────────────────────────────────────

/**
 * Abre o seletor de arquivos e retorna o conteúdo do JSON selecionado
 */
export async function pickBackupFile(): Promise<BackupData | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/json",
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets?.[0]) {
      return null;
    }

    const asset = result.assets[0];
    let content: string;

    if (Platform.OS === "web") {
      // Web: ler via fetch
      const response = await fetch(asset.uri);
      content = await response.text();
    } else {
      // Mobile: ler via FileSystem
      content = await FileSystem.readAsStringAsync(asset.uri);
    }

    const parsed = JSON.parse(content);

    // Validar
    const validation = validateBackup(parsed);
    if (!validation.valid) {
      Alert.alert("Arquivo Inválido", validation.error || "O arquivo selecionado não é um backup válido do NeuroLaserMap.");
      return null;
    }

    // Migrar v1 se necessário
    if (parsed.version?.startsWith("1.")) {
      return migrateV1ToV2(parsed);
    }

    return parsed as BackupData;
  } catch (error) {
    console.error("[BackupSystem] Erro ao ler arquivo:", error);
    Alert.alert("Erro", "Não foi possível ler o arquivo selecionado. Verifique se é um arquivo JSON válido.");
    return null;
  }
}

// ─── Utility Functions ────────────────────────────────────────────────

/**
 * Verifica se há backup recente (últimos 7 dias)
 */
export async function hasRecentBackup(): Promise<boolean> {
  try {
    const lastBackupStr = await AsyncStorage.getItem(STORAGE_KEYS.lastBackupDate);
    if (!lastBackupStr) return false;

    const lastBackup = new Date(lastBackupStr);
    const now = new Date();
    const daysDiff = (now.getTime() - lastBackup.getTime()) / (1000 * 60 * 60 * 24);

    return daysDiff < 7;
  } catch {
    return false;
  }
}

/**
 * Retorna a data do último backup formatada
 */
export async function getLastBackupDate(): Promise<string | null> {
  try {
    const lastBackupStr = await AsyncStorage.getItem(STORAGE_KEYS.lastBackupDate);
    if (!lastBackupStr) return null;
    return new Date(lastBackupStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return null;
  }
}

/**
 * Formata o resumo de importação para exibição
 */
export function formatImportSummary(summary: ImportSummary): string {
  const lines: string[] = [];

  if (summary.patientsAdded > 0) lines.push(`${summary.patientsAdded} paciente(s) adicionado(s)`);
  if (summary.patientsUpdated > 0) lines.push(`${summary.patientsUpdated} paciente(s) atualizado(s)`);
  if (summary.plansAdded > 0) lines.push(`${summary.plansAdded} plano(s) adicionado(s)`);
  if (summary.plansUpdated > 0) lines.push(`${summary.plansUpdated} plano(s) atualizado(s)`);
  if (summary.sessionsAdded > 0) lines.push(`${summary.sessionsAdded} sessão(ões) adicionada(s)`);
  if (summary.sessionsUpdated > 0) lines.push(`${summary.sessionsUpdated} sessão(ões) atualizada(s)`);
  if (summary.scaleResponsesAdded > 0) lines.push(`${summary.scaleResponsesAdded} avaliação(ões) de escala adicionada(s)`);
  if (summary.scaleResponsesUpdated > 0) lines.push(`${summary.scaleResponsesUpdated} avaliação(ões) de escala atualizada(s)`);
  if (summary.planTemplatesAdded > 0) lines.push(`${summary.planTemplatesAdded} template(s) adicionado(s)`);
  if (summary.therapeuticCyclesAdded > 0) lines.push(`${summary.therapeuticCyclesAdded} ciclo(s) adicionado(s)`);
  if (summary.progressGoalsAdded > 0) lines.push(`${summary.progressGoalsAdded} meta(s) adicionada(s)`);
  if (summary.profileRestored) lines.push("Perfil profissional restaurado");

  if (lines.length === 0) {
    return "Nenhum dado novo foi importado. Todos os dados já existiam no app.";
  }

  return lines.join("\n");
}

/**
 * Formata o resumo do backup para exibição antes de importar
 */
export function formatBackupSummary(summary: BackupSummary): string {
  const lines: string[] = [];
  const date = new Date(summary.timestamp).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  lines.push(`Data do backup: ${date}`);
  lines.push("");
  lines.push("Conteúdo:");
  if (summary.patients > 0) lines.push(`  • ${summary.patients} paciente(s)`);
  if (summary.sessions > 0) lines.push(`  • ${summary.sessions} sessão(ões)`);
  if (summary.plans > 0) lines.push(`  • ${summary.plans} plano(s) terapêutico(s)`);
  if (summary.scaleResponses > 0) lines.push(`  • ${summary.scaleResponses} avaliação(ões) de escala`);
  if (summary.planTemplates > 0) lines.push(`  • ${summary.planTemplates} template(s)`);
  if (summary.therapeuticCycles > 0) lines.push(`  • ${summary.therapeuticCycles} ciclo(s) terapêutico(s)`);
  if (summary.progressGoals > 0) lines.push(`  • ${summary.progressGoals} meta(s) de progresso`);
  if (summary.auditLogs > 0) lines.push(`  • ${summary.auditLogs} registro(s) de auditoria`);
  if (summary.hasProfessionalProfile) lines.push(`  • Perfil profissional`);

  return lines.join("\n");
}
