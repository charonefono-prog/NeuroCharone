import { relations } from "drizzle-orm";
import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with professional health information.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  // Campos profissionais adicionais
  specialty: varchar("specialty", { length: 255 }),
  professionalId: varchar("professionalId", { length: 100 }), // CRM, CREFONO, etc
  phone: varchar("phone", { length: 50 }),
  photoUrl: text("photoUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

// Tabela de pacientes
export const patients = mysqlTable("patients", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull(), // Profissional responsável
  fullName: varchar("fullName", { length: 255 }).notNull(),
  birthDate: timestamp("birthDate").notNull(),
  cpf: varchar("cpf", { length: 14 }),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  address: text("address"),
  diagnosis: text("diagnosis"),
  medicalNotes: text("medicalNotes"),
  status: varchar("status", { length: 50 }).notNull().default("active"), // active, paused, completed
  photoUrl: text("photoUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Tabela de planos terapêuticos
export const therapeuticPlans = mysqlTable("therapeutic_plans", {
  id: int("id").primaryKey().autoincrement(),
  patientId: int("patientId").notNull(),
  objective: text("objective").notNull(), // Objetivo terapêutico
  targetRegions: text("targetRegions").notNull(), // JSON array de regiões alvo
  targetPoints: text("targetPoints").notNull(), // JSON array de pontos específicos
  frequency: int("frequency").notNull(), // Sessões por semana
  totalDuration: int("totalDuration").notNull(), // Duração total em semanas
  notes: text("notes"),
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Tabela de sessões de tratamento
export const sessions = mysqlTable("sessions", {
  id: int("id").primaryKey().autoincrement(),
  patientId: int("patientId").notNull(),
  planId: int("planId").notNull(),
  sessionDate: timestamp("sessionDate").notNull(),
  duration: int("duration").notNull(), // Duração em minutos
  stimulatedPoints: text("stimulatedPoints").notNull(), // JSON array de pontos estimulados
  intensity: varchar("intensity", { length: 100 }), // Intensidade aplicada
  observations: text("observations"),
  patientReactions: text("patientReactions"),
  nextSessionDate: timestamp("nextSessionDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Relações
export const usersRelations = relations(users, ({ many }) => ({
  patients: many(patients),
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
export type InsertUser = typeof users.$inferInsert;

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = typeof patients.$inferInsert;

export type TherapeuticPlan = typeof therapeuticPlans.$inferSelect;
export type InsertTherapeuticPlan = typeof therapeuticPlans.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;
