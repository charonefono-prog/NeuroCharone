import { boolean, int, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Access Control Table
 * Whitelist de usuários autorizados a usar o sistema
 * 
 * Fluxo:
 * 1. Usuário tenta fazer login com OAuth
 * 2. Sistema verifica se email está na whitelist
 * 3. Se sim e aprovado=true → acesso liberado
 * 4. Se não ou aprovado=false → acesso bloqueado
 */
export const accessControl = mysqlTable("access_control", {
  id: int("id").autoincrement().primaryKey(),
  
  // Informações do usuário
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  
  // Status de aprovação
  isApproved: boolean("isApproved").notNull().default(false), // false = bloqueado, true = liberado
  
  // Informações do capacete
  helmetSerialNumber: varchar("helmetSerialNumber", { length: 100 }), // Número de série do capacete
  helmetModel: varchar("helmetModel", { length: 100 }), // Modelo do capacete
  
  // Informações de acesso
  accessLevel: varchar("accessLevel", { length: 50 }).notNull().default("user"), // user, professional, admin
  
  // Datas
  approvedAt: timestamp("approvedAt"), // Quando foi aprovado
  expiresAt: timestamp("expiresAt"), // Data de expiração (opcional)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  
  // Notas do administrador
  notes: text("notes"), // Notas sobre o usuário
  
  // Rastreamento
  approvedBy: varchar("approvedBy", { length: 255 }), // Email de quem aprovou
  denialReason: text("denialReason"), // Motivo da negação (se houver)
});

/**
 * Access Request Log
 * Registro de tentativas de acesso
 */
export const accessLog = mysqlTable("access_log", {
  id: int("id").autoincrement().primaryKey(),
  
  // Usuário que tentou acessar
  email: varchar("email", { length: 320 }).notNull(),
  name: varchar("name", { length: 255 }),
  
  // Status da tentativa
  status: varchar("status", { length: 50 }).notNull(), // approved, denied, pending
  reason: text("reason"), // Motivo da aprovação/negação
  
  // Informações técnicas
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  
  // Timestamps
  attemptedAt: timestamp("attemptedAt").defaultNow().notNull(),
  processedAt: timestamp("processedAt"),
});

/**
 * Relations
 */
export const accessControlRelations = relations(accessControl, ({ many }) => ({
  logs: many(accessLog),
}));

export const accessLogRelations = relations(accessLog, ({ one }) => ({
  accessControl: one(accessControl, {
    fields: [accessLog.email],
    references: [accessControl.email],
  }),
}));

/**
 * Types
 */
export type AccessControl = typeof accessControl.$inferSelect;
export type InsertAccessControl = typeof accessControl.$inferInsert;

export type AccessLog = typeof accessLog.$inferSelect;
export type InsertAccessLog = typeof accessLog.$inferInsert;

/**
 * Access Levels
 */
export const ACCESS_LEVELS = {
  USER: "user", // Usuário comum
  PROFESSIONAL: "professional", // Profissional de saúde
  ADMIN: "admin", // Administrador
} as const;

/**
 * Access Status
 */
export const ACCESS_STATUS = {
  APPROVED: "approved", // Aprovado
  DENIED: "denied", // Negado
  PENDING: "pending", // Pendente de revisão
} as const;
