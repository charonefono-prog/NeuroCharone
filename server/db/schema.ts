import { relations } from "drizzle-orm";
import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

// Tabela de usuários (profissionais de saúde)
export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  specialty: varchar("specialty", { length: 255 }),
  professionalId: varchar("professional_id", { length: 100 }), // CRM, CREFONO, etc
  phone: varchar("phone", { length: 50 }),
  photoUrl: text("photo_url"),
  role: mysqlEnum("role", ["user", "admin"]).notNull().default("user"),
  // Status: pending (aguardando aprovação), active (aprovado), blocked (bloqueado)
  status: mysqlEnum("status", ["pending", "active", "blocked"]).notNull().default("pending"),
  approvedAt: timestamp("approved_at"), // Data de aprovação
  approvedBy: int("approved_by"), // ID do admin que aprovou
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
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

// Relações
export const usersRelations = relations(users, ({ many, one }) => ({
  patients: many(patients),
  approvalsGiven: many(users, {
    relationName: "approvals",
  }),
  approver: one(users, {
    fields: [users.approvedBy],
    references: [users.id],
    relationName: "approvals",
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

// Tipos TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Patient = typeof patients.$inferSelect;
export type NewPatient = typeof patients.$inferInsert;
export type TherapeuticPlan = typeof therapeuticPlans.$inferSelect;
export type NewTherapeuticPlan = typeof therapeuticPlans.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
