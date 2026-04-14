import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { accessControl } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

/**
 * Registration Router
 * Gerencia registro de novos usuários com aprovação
 */
export const registrationRouter = router({
  /**
   * Registrar novo usuário (não aprovado por padrão)
   */
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().min(3),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      // Verificar se email já existe
      const existing = await db
        .select()
        .from(accessControl)
        .where(eq(accessControl.email, input.email))
        .limit(1);

      if (existing.length > 0) {
        throw new Error("Email already registered");
      }

      // Hash da senha (simples - em produção use bcrypt)
      const passwordHash = crypto
        .createHash("sha256")
        .update(input.password + "neurolasermap_salt")
        .digest("hex");

      // Criar novo usuário (não aprovado)
      const result = await db.insert(accessControl).values({
        email: input.email,
        name: input.name,
        passwordHash: passwordHash,
        isApproved: false, // Padrão: não aprovado
        accessLevel: "user",
      });

      return {
        success: true,
        message: "Registration successful. Awaiting administrator approval.",
        email: input.email,
      };
    }),

  /**
   * Fazer login com email e senha (para usuários registrados)
   */
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      // Buscar usuário
      const user = await db
        .select()
        .from(accessControl)
        .where(eq(accessControl.email, input.email))
        .limit(1);

      if (user.length === 0) {
        return {
          success: false,
          reason: "Email not found",
        };
      }

      const userRecord = user[0];

      // Verificar senha
      const passwordHash = crypto
        .createHash("sha256")
        .update(input.password + "neurolasermap_salt")
        .digest("hex");

      if (userRecord.passwordHash !== passwordHash) {
        return {
          success: false,
          reason: "Invalid password",
        };
      }

      // Verificar aprovação
      if (!userRecord.isApproved) {
        return {
          success: false,
          reason: userRecord.denialReason || "Your access is pending approval.",
        };
      }

      // Verificar expiração
      if (userRecord.expiresAt && new Date(userRecord.expiresAt) < new Date()) {
        return {
          success: false,
          reason: "Your access has expired.",
        };
      }

      return {
        success: true,
        user: {
          email: userRecord.email,
          name: userRecord.name,
          accessLevel: userRecord.accessLevel,
        },
      };
    }),

  /**
   * Obter lista de usuários pendentes de aprovação
   */
  getPendingUsers: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const pending = await db
      .select()
      .from(accessControl)
      .where(eq(accessControl.isApproved, false));

    return pending.map((u) => ({
      email: u.email,
      name: u.name,
      createdAt: u.createdAt,
    }));
  }),
});
