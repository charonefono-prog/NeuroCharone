import { relations } from "drizzle-orm";
import { boolean, int, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

// Tabela de usuários (profissionais de saúde)
export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  passwordHash: varchar("password_hash", { length: 255 }),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  specialty: varchar("specialty", { length: 255 }),
  professionalId: varchar("professional_id", { length: 100 }), // CRM, CREFONO, etc
  phone: varchar("phone", { length: 50 }),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  role: varchar("role", { length: 50, enum: ["pending", "user", "admin"] }).notNull().default("pending"),
  // Campos de autenticação
  isApproved: boolean("is_approved").notNull().default(false),
  approvedAt: timestamp("approved_at"),
  approvedBy: int("approved_by"),
  isBlocked: boolean("is_blocked").notNull().default(false),
  blockedReason: text("blocked_reason"),
});

// Tabela de convites
export const invites = mysqlTable("invites", {
  id: int("id").primaryKey().autoincrement(),
  code: varchar("code", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }),
  createdBy: int("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  usedAt: timestamp("used_at"),
  usedBy: int("used_by"),
  expiresAt: timestamp("expires_at").notNull(),
});

// Tabela de audit log
export const auditLog = mysqlTable("audit_log", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id"),
  action: varchar("action", { length: 255 }).notNull(),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabela de pacientes
export const patients = mysqlTable("patients", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(), // Profissional responsável
  fullName: varchar("full_name", { length: 255 }).notNull(),
  birthDate: timestamp("birth_date").notNull(),
  cpf: varchar("cpf", { length: 14 }),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  address: text("address"),
  diagnosis: text("diagnosis"),
  medicalNotes: text("medical_notes"),
  status: varchar("status", { length: 50 }).notNull().default("active"), // active, paused, completed
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Tabela de planos terapêuticos
export const therapeuticPlans = mysqlTable("therapeutic_plans", {
  id: int("id").primaryKey().autoincrement(),
  patientId: int("patient_id").notNull(),
  objective: text("objective").notNull(), // Objetivo terapêutico
  targetRegions: text("target_regions").notNull(), // JSON array de regiões alvo
  targetPoints: text("target_points").notNull(), // JSON array de pontos específicos
  frequency: int("frequency").notNull(), // Sessões por semana
  totalDuration: int("total_duration").notNull(), // Duração total em semanas
  notes: text("notes"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Tabela de sessões de tratamento
export const sessions = mysqlTable("sessions", {
  id: int("id").primaryKey().autoincrement(),
  patientId: int("patient_id").notNull(),
  planId: int("plan_id").notNull(),
  sessionDate: timestamp("session_date").notNull(),
  duration: int("duration").notNull(), // Duração em minutos
  stimulatedPoints: text("stimulated_points").notNull(), // JSON array de pontos estimulados
  intensity: varchar("intensity", { length: 100 }), // Intensidade aplicada
  observations: text("observations"),
  patientReactions: text("patient_reactions"),
  nextSessionDate: timestamp("next_session_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Tabela de controle de acesso
export const accessControl = mysqlTable("access_control", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull().unique(),
  status: varchar("status", { length: 50, enum: ["pending", "approved", "rejected"] }).notNull().default("pending"),
  requestedAt: timestamp("requested_at").defaultNow().notNull(),
  approvedAt: timestamp("approved_at"),
  approvedBy: int("approved_by"),
});

// Relações
export const usersRelations = relations(users, ({ many, one }) => ({
  patients: many(patients),
  invitesCreated: many(invites),
  auditLogs: many(auditLog),
  approver: one(users, {
    fields: [users.approvedBy],
    references: [users.id],
    relationName: "approver",
  }),
}));

export const invitesRelations = relations(invites, ({ one }) => ({
  creator: one(users, {
    fields: [invites.createdBy],
    references: [users.id],
  }),
  usedByUser: one(users, {
    fields: [invites.usedBy],
    references: [users.id],
  }),
}));

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  user: one(users, {
    fields: [auditLog.userId],
    references: [users.id],
  }),
}));

export const patientsRelations = relations(patients, ({ one, many }) => ({
  user: one(users, {
    fields: [patients.userId],
    references: [users.id],
  }),
  therapeuticPlans: many(therapeuticPlans),
  sessions: many(sessions),
}));

export const therapeuticPlansRelations = relations(therapeuticPlans, ({ one, many }) => ({
  patient: one(patients, {
    fields: [therapeuticPlans.patientId],
    references: [patients.id],
  }),
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  patient: one(patients, {
    fields: [sessions.patientId],
    references: [patients.id],
  }),
  plan: one(therapeuticPlans, {
    fields: [sessions.planId],
    references: [therapeuticPlans.id],
  }),
}));

export const accessControlRelations = relations(accessControl, ({ one }) => ({
  user: one(users, {
    fields: [accessControl.userId],
    references: [users.id],
  }),
  approver: one(users, {
    fields: [accessControl.approvedBy],
    references: [users.id],
    relationName: "approver",
  }),
}));

// Tipos TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Invite = typeof invites.$inferSelect;
export type NewInvite = typeof invites.$inferInsert;

export type AuditLog = typeof auditLog.$inferSelect;
export type NewAuditLog = typeof auditLog.$inferInsert;

export type Patient = typeof patients.$inferSelect;
export type NewPatient = typeof patients.$inferInsert;

export type TherapeuticPlan = typeof therapeuticPlans.$inferSelect;
export type NewTherapeuticPlan = typeof therapeuticPlans.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type AccessControl = typeof accessControl.$inferSelect;
export type NewAccessControl = typeof accessControl.$inferInsert;
