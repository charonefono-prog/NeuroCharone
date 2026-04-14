import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { therapeuticPlans, patients } from "../../drizzle/schema";

export const therapeuticPlansRouter = router({
  // Listar planos de um paciente
  listByPatient: protectedProcedure
    .input(z.object({ patientId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.db) throw new Error("Database not available");

      // Verificar se o paciente pertence ao usuário
      const [patient] = await ctx.db
        .select()
        .from(patients)
        .where(and(eq(patients.id, input.patientId), eq(patients.userId, ctx.user.id)));

      if (!patient) {
        throw new Error("Paciente não encontrado");
      }

      return await ctx.db
        .select()
        .from(therapeuticPlans)
        .where(eq(therapeuticPlans.patientId, input.patientId));
    }),

  // Obter plano específico
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.db) throw new Error("Database not available");

      const [plan] = await ctx.db
        .select()
        .from(therapeuticPlans)
        .where(eq(therapeuticPlans.id, input.id));

      if (!plan) {
        throw new Error("Plano não encontrado");
      }

      // Verificar permissão
      const [patient] = await ctx.db
        .select()
        .from(patients)
        .where(and(eq(patients.id, plan.patientId), eq(patients.userId, ctx.user.id)));

      if (!patient) {
        throw new Error("Acesso negado");
      }

      return plan;
    }),

  // Criar novo plano
  create: protectedProcedure
    .input(
      z.object({
        patientId: z.number(),
        objective: z.string().min(1),
        targetRegions: z.array(z.string()),
        targetPoints: z.array(z.string()),
        frequency: z.number().min(1),
        totalDuration: z.number().min(1),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.db) throw new Error("Database not available");

      // Verificar se o paciente pertence ao usuário
      const [patient] = await ctx.db
        .select()
        .from(patients)
        .where(and(eq(patients.id, input.patientId), eq(patients.userId, ctx.user.id)));

      if (!patient) {
        throw new Error("Paciente não encontrado");
      }

      await ctx.db.insert(therapeuticPlans).values({
        patientId: input.patientId,
        objective: input.objective,
        targetRegions: JSON.stringify(input.targetRegions),
        targetPoints: JSON.stringify(input.targetPoints),
        frequency: input.frequency,
        totalDuration: input.totalDuration,
        notes: input.notes,
        isActive: true,
      });

      return { success: true }
    }),

  // Atualizar plano
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        objective: z.string().optional(),
        targetRegions: z.array(z.string()).optional(),
        targetPoints: z.array(z.string()).optional(),
        frequency: z.number().optional(),
        totalDuration: z.number().optional(),
        notes: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.db) throw new Error("Database not available");

      const [plan] = await ctx.db
        .select()
        .from(therapeuticPlans)
        .where(eq(therapeuticPlans.id, input.id));

      if (!plan) {
        throw new Error("Plano não encontrado");
      }

      // Verificar permissão
      const [patient] = await ctx.db
        .select()
        .from(patients)
        .where(and(eq(patients.id, plan.patientId), eq(patients.userId, ctx.user.id)));

      if (!patient) {
        throw new Error("Acesso negado");
      }

      const updateData: any = {};
      if (input.objective) updateData.objective = input.objective;
      if (input.targetRegions) updateData.targetRegions = JSON.stringify(input.targetRegions);
      if (input.targetPoints) updateData.targetPoints = JSON.stringify(input.targetPoints);
      if (input.frequency) updateData.frequency = input.frequency;
      if (input.totalDuration) updateData.totalDuration = input.totalDuration;
      if (input.notes !== undefined) updateData.notes = input.notes;
      if (input.isActive !== undefined) updateData.isActive = input.isActive;

      await ctx.db.update(therapeuticPlans).set(updateData).where(eq(therapeuticPlans.id, input.id));

      return { success: true };
    }),

  // Deletar plano
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.db) throw new Error("Database not available");

      const [plan] = await ctx.db
        .select()
        .from(therapeuticPlans)
        .where(eq(therapeuticPlans.id, input.id));

      if (!plan) {
        throw new Error("Plano não encontrado");
      }

      // Verificar permissão
      const [patient] = await ctx.db
        .select()
        .from(patients)
        .where(and(eq(patients.id, plan.patientId), eq(patients.userId, ctx.user.id)));

      if (!patient) {
        throw new Error("Acesso negado");
      }

      await ctx.db.delete(therapeuticPlans).where(eq(therapeuticPlans.id, input.id));

      return { success: true };
    }),
});
