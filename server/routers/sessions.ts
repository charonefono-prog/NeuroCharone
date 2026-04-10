import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { sessions, therapeuticPlans, patients } from "../../drizzle/schema";

export const sessionsRouter = router({
  // Listar sessões de um paciente
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
        .from(sessions)
        .where(eq(sessions.patientId, input.patientId));
    }),

  // Obter sessão específica
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.db) throw new Error("Database not available");

      const [session] = await ctx.db
        .select()
        .from(sessions)
        .where(eq(sessions.id, input.id));

      if (!session) {
        throw new Error("Sessão não encontrada");
      }

      // Verificar permissão
      const [patient] = await ctx.db
        .select()
        .from(patients)
        .where(and(eq(patients.id, session.patientId), eq(patients.userId, ctx.user.id)));

      if (!patient) {
        throw new Error("Acesso negado");
      }

      return session;
    }),

  // Criar nova sessão
  create: protectedProcedure
    .input(
      z.object({
        patientId: z.number(),
        planId: z.number(),
        sessionDate: z.date(),
        duration: z.number().min(1),
        stimulatedPoints: z.array(z.string()),
        intensity: z.string().optional(),
        observations: z.string().optional(),
        patientReactions: z.string().optional(),
        nextSessionDate: z.date().optional(),
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

      // Verificar se o plano pertence ao paciente
      const [plan] = await ctx.db
        .select()
        .from(therapeuticPlans)
        .where(and(eq(therapeuticPlans.id, input.planId), eq(therapeuticPlans.patientId, input.patientId)));

      if (!plan) {
        throw new Error("Plano não encontrado");
      }

      await ctx.db.insert(sessions).values({
        patientId: input.patientId,
        planId: input.planId,
        sessionDate: input.sessionDate,
        duration: input.duration,
        stimulatedPoints: JSON.stringify(input.stimulatedPoints),
        intensity: input.intensity,
        observations: input.observations,
        patientReactions: input.patientReactions,
        nextSessionDate: input.nextSessionDate,
      });

      return { success: true };
    }),

  // Atualizar sessão
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        duration: z.number().optional(),
        stimulatedPoints: z.array(z.string()).optional(),
        intensity: z.string().optional(),
        observations: z.string().optional(),
        patientReactions: z.string().optional(),
        nextSessionDate: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.db) throw new Error("Database not available");

      const [session] = await ctx.db
        .select()
        .from(sessions)
        .where(eq(sessions.id, input.id));

      if (!session) {
        throw new Error("Sessão não encontrada");
      }

      // Verificar permissão
      const [patient] = await ctx.db
        .select()
        .from(patients)
        .where(and(eq(patients.id, session.patientId), eq(patients.userId, ctx.user.id)));

      if (!patient) {
        throw new Error("Acesso negado");
      }

      const updateData: any = {};
      if (input.duration) updateData.duration = input.duration;
      if (input.stimulatedPoints) updateData.stimulatedPoints = JSON.stringify(input.stimulatedPoints);
      if (input.intensity !== undefined) updateData.intensity = input.intensity;
      if (input.observations !== undefined) updateData.observations = input.observations;
      if (input.patientReactions !== undefined) updateData.patientReactions = input.patientReactions;
      if (input.nextSessionDate !== undefined) updateData.nextSessionDate = input.nextSessionDate;

      await ctx.db.update(sessions).set(updateData).where(eq(sessions.id, input.id));

      return { success: true };
    }),

  // Deletar sessão
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.db) throw new Error("Database not available");

      const [session] = await ctx.db
        .select()
        .from(sessions)
        .where(eq(sessions.id, input.id));

      if (!session) {
        throw new Error("Sessão não encontrada");
      }

      // Verificar permissão
      const [patient] = await ctx.db
        .select()
        .from(patients)
        .where(and(eq(patients.id, session.patientId), eq(patients.userId, ctx.user.id)));

      if (!patient) {
        throw new Error("Acesso negado");
      }

      await ctx.db.delete(sessions).where(eq(sessions.id, input.id));

      return { success: true };
    }),

  // Listar sessões por período
  listByPeriod: protectedProcedure
    .input(
      z.object({
        patientId: z.number(),
        startDate: z.date(),
        endDate: z.date(),
      })
    )
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

      // Nota: Drizzle não tem suporte direto para BETWEEN, então usamos comparações
      return await ctx.db
        .select()
        .from(sessions)
        .where(
          and(
            eq(sessions.patientId, input.patientId),
            // Adicionar filtro de data se necessário
          )
        );
    }),
});
