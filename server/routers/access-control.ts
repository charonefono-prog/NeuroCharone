import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { accessControl, accessLog } from "@/drizzle/schema";
import { eq } from "drizzle-orm";;

/**
 * Access Control Router
 * Gerencia whitelist de usuários autorizados
 */
export const accessControlRouter = router({
  /**
   * Verificar se usuário tem acesso
   * Chamado durante o login
   */
  checkAccess: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      // Buscar usuário na whitelist
      const user = await db
        .select()
        .from(accessControl)
        .where(eq(accessControl.email, input.email))
        .limit(1);

      const accessRecord = user[0];

      // Registrar tentativa de acesso
      await db.insert(accessLog).values({
        email: input.email,
        name: input.name,
        status: accessRecord?.isApproved ? "approved" : "denied",
        reason: accessRecord
          ? accessRecord.isApproved
            ? "User approved in whitelist"
            : `Access denied: ${accessRecord.denialReason || "Not approved"}`
          : "User not found in whitelist",
        ipAddress: ctx.req?.ip,
        userAgent: ctx.req?.headers["user-agent"],
      });

      if (!accessRecord) {
        return {
          allowed: false,
          reason: "Email not registered. Please contact the administrator.",
        };
      }

      if (!accessRecord.isApproved) {
        return {
          allowed: false,
          reason: accessRecord.denialReason || "Your access is pending approval.",
        };
      }

      // Verificar expiração
      if (accessRecord.expiresAt && new Date(accessRecord.expiresAt) < new Date()) {
        return {
          allowed: false,
          reason: "Your access has expired. Please contact the administrator.",
        };
      }

      return {
        allowed: true,
        accessLevel: accessRecord.accessLevel,
        helmetSerialNumber: accessRecord.helmetSerialNumber,
      };
    }),

  /**
   * Listar todos os usuários (apenas admin)
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    // Verificar se é admin
    if (ctx.user?.role !== "admin") {
      throw new Error("UNAUTHORIZED");
    }

    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    const users = await db.select().from(accessControl);
    return users;
  }),

  /**
   * Obter detalhes de um usuário
   */
  getByEmail: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("UNAUTHORIZED");
      }

      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      const user = await db
        .select()
        .from(accessControl)
        .where(eq(accessControl.email, input.email))
        .limit(1);

      return user[0];
    }),

  /**
   * Adicionar novo usuário à whitelist
   */
  addUser: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string(),
        helmetSerialNumber: z.string().optional(),
        helmetModel: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("UNAUTHORIZED");
      }

      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      // Verificar se já existe
      const existing = await db
        .select()
        .from(accessControl)
        .where(eq(accessControl.email, input.email))
        .limit(1);

      if (existing.length > 0) {
        throw new Error("User already exists in whitelist");
      }

      // Adicionar novo usuário
      const result = await db.insert(accessControl).values({
        email: input.email,
        name: input.name,
        helmetSerialNumber: input.helmetSerialNumber,
        helmetModel: input.helmetModel,
        notes: input.notes,
        isApproved: false, // Padrão: não aprovado
      });

      return {
        success: true,
        message: "User added to whitelist. Approval pending.",
      };
    }),

  /**
   * Aprovar usuário
   */
  approveUser: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        accessLevel: z.enum(["user", "professional", "admin"]).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("UNAUTHORIZED");
      }

      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const result = await db
        .update(accessControl)
        .set({
          isApproved: true,
          approvedAt: new Date(),
          approvedBy: ctx.user?.email,
          accessLevel: input.accessLevel || "user",
          denialReason: null,
        })
        .where(eq(accessControl.email, input.email));

      return {
        success: true,
        message: "User approved",
      };
    }),

  /**
   * Rejeitar usuário
   */
  denyUser: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        reason: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("UNAUTHORIZED");
      }

      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const result = await db
        .update(accessControl)
        .set({
          isApproved: false,
          denialReason: input.reason,
          approvedBy: ctx.user?.email,
        })
        .where(eq(accessControl.email, input.email));

      return {
        success: true,
        message: "User denied",
      };
    }),

  /**
   * Remover usuário da whitelist
   */
  removeUser: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("UNAUTHORIZED");
      }

      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      // Soft delete (não remover, apenas desaprovar)
      const result = await db
        .update(accessControl)
        .set({
          isApproved: false,
          denialReason: "User removed by admin",
        })
        .where(eq(accessControl.email, input.email));

      return {
        success: true,
        message: "User removed from whitelist",
      };
    }),

  /**
   * Atualizar informações do usuário
   */
  updateUser: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().optional(),
        helmetSerialNumber: z.string().optional(),
        helmetModel: z.string().optional(),
        notes: z.string().optional(),
        expiresAt: z.date().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("UNAUTHORIZED");
      }

      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const { email, ...updates } = input;

      const result = await db
        .update(accessControl)
        .set(updates)
        .where(eq(accessControl.email, email));

      return {
        success: true,
        message: "User updated",
      };
    }),

  /**
   * Obter log de acessos
   */
  getAccessLog: protectedProcedure
    .input(
      z.object({
        email: z.string().email().optional(),
        limit: z.number().default(100),
      })
    )
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("UNAUTHORIZED");
      }

      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const logs = await db.select().from(accessLog).limit(input.limit);
      return logs;
    }),

  /**
   * Estatísticas de acesso
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new Error("UNAUTHORIZED");
    }

    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    // Total de usuários
    const allUsers = await db.select().from(accessControl);

    // Usuários aprovados
    const approvedUsers = allUsers.filter((u) => u.isApproved);

    // Usuários pendentes
    const pendingUsers = allUsers.filter((u) => !u.isApproved && !u.denialReason);

    // Usuários negados
    const deniedUsers = allUsers.filter((u) => u.denialReason);

    return {
      totalUsers: allUsers.length,
      approvedUsers: approvedUsers.length,
      pendingUsers: pendingUsers.length,
      deniedUsers: deniedUsers.length,
    };
  }),
});
