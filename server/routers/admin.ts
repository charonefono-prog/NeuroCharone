import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { users, invitations, patients } from "../db/schema";
import { getDb } from "../db";
import { eq, ne } from "drizzle-orm";
import { randomBytes } from "crypto";

export const adminRouter = router({
  // Gerar novo convite para profissional
  generateInvite: protectedProcedure
    .input(
      z.object({
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Apenas administradores podem gerar convites",
        });
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Gerar código único
      const inviteCode = randomBytes(16).toString("hex");

      // Calcular data de expiração (30 dias)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      // Criar convite
      await db.insert(invitations).values({
        inviteCode,
        createdBy: ctx.user.id,
        email: input.email,
        status: "active",
        expiresAt,
      });

      return {
        inviteCode,
        inviteUrl: `${process.env.APP_URL || "http://localhost:3000"}/register?invite=${inviteCode}`,
        expiresAt,
      };
    }),

  // Listar todos os profissionais (apenas admin)
  listProfessionals: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Apenas administradores podem listar profissionais",
      });
    }

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const professionals = await db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        specialty: users.specialty,
        professionalId: users.professionalId,
        phone: users.phone,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
        approvedAt: users.approvedAt,
      })
      .from(users)
      .where(ne(users.id, ctx.user.id));

    return professionals;
  }),

  // Aprovar profissional
  approveProfessional: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Apenas administradores podem aprovar profissionais",
        });
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(users)
        .set({
          role: "user",
          approvedAt: new Date(),
          approvedBy: ctx.user.id,
        })
        .where(eq(users.id, input.userId));

      return { success: true };
    }),

  // Bloquear profissional
  blockProfessional: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Apenas administradores podem bloquear profissionais",
        });
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(users)
        .set({ isActive: false })
        .where(eq(users.id, input.userId));

      return { success: true };
    }),

  // Desbloquear profissional
  unblockProfessional: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Apenas administradores podem desbloquear profissionais",
        });
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(users)
        .set({ isActive: true })
        .where(eq(users.id, input.userId));

      return { success: true };
    }),

  // Rejeitar profissional
  rejectProfessional: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Apenas administradores podem rejeitar profissionais",
        });
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Deletar usuário rejeitado
      await db.delete(users).where(eq(users.id, input.userId));

      return { success: true };
    }),

  // Listar convites
  listInvites: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Apenas administradores podem listar convites",
      });
    }

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const invitesList = await db
      .select()
      .from(invitations)
      .where(eq(invitations.createdBy, ctx.user.id));

    return invitesList;
  }),

  // Validar e usar convite
  validateInvite: publicProcedure
    .input(z.object({ inviteCode: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const invite = await db
        .select()
        .from(invitations)
        .where(eq(invitations.inviteCode, input.inviteCode))
        .limit(1);

      if (!invite[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Convite não encontrado",
        });
      }

      if (invite[0].status !== "active") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Este convite não está mais ativo",
        });
      }

      if (new Date() > invite[0].expiresAt) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Este convite expirou",
        });
      }

      return { valid: true, email: invite[0].email };
    }),
});
