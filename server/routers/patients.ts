import { z } from "zod";
import { and, desc, eq, like, or } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { patients } from "../../drizzle/schema";

export const patientsRouter = router({
  // Listar todos os pacientes do usuário logado
  list: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        status: z.enum(["all", "active", "paused", "completed"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.db) throw new Error("Database not available");
      const conditions = [eq(patients.userId, ctx.user.id)];

      if (input.search) {
        conditions.push(like(patients.fullName, `%${input.search}%`));
      }

      if (input.status && input.status !== "all") {
        conditions.push(eq(patients.status, input.status));
      }

      return await ctx.db
        .select()
        .from(patients)
        .where(and(...conditions))
        .orderBy(desc(patients.updatedAt));
    }),

  // Obter um paciente específico
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.db) throw new Error("Database not available");
      const [patient] = await ctx.db
        .select()
        .from(patients)
        .where(and(eq(patients.id, input.id), eq(patients.userId, ctx.user.id)));

      if (!patient) {
        throw new Error("Paciente não encontrado");
      }

      return patient;
    }),

  // Criar novo paciente
  create: protectedProcedure
    .input(
      z.object({
        fullName: z.string().min(1, "Nome é obrigatório"),
        birthDate: z.string(),
        cpf: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional().or(z.literal("")),
        address: z.string().optional(),
        diagnosis: z.string().optional(),
        medicalNotes: z.string().optional(),
        photoUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.db) throw new Error("Database not available");
      const [newPatient] = await ctx.db.insert(patients).values({
        userId: ctx.user.id,
        fullName: input.fullName,
        birthDate: new Date(input.birthDate),
        cpf: input.cpf,
        phone: input.phone,
        email: input.email || null,
        address: input.address,
        diagnosis: input.diagnosis,
        medicalNotes: input.medicalNotes,
        photoUrl: input.photoUrl,
        status: "active",
      });

      return newPatient;
    }),

  // Atualizar paciente
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        fullName: z.string().min(1, "Nome é obrigatório").optional(),
        birthDate: z.string().optional(),
        cpf: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional().or(z.literal("")),
        address: z.string().optional(),
        diagnosis: z.string().optional(),
        medicalNotes: z.string().optional(),
        status: z.enum(["active", "paused", "completed"]).optional(),
        photoUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.db) throw new Error("Database not available");
      const { id, ...updateData } = input;

      // Verificar se o paciente pertence ao usuário
      const [patient] = await ctx.db
        .select()
        .from(patients)
        .where(and(eq(patients.id, id), eq(patients.userId, ctx.user.id)));

      if (!patient) {
        throw new Error("Paciente não encontrado");
      }

      const dataToUpdate: any = {};
      if (updateData.fullName) dataToUpdate.fullName = updateData.fullName;
      if (updateData.birthDate) dataToUpdate.birthDate = new Date(updateData.birthDate);
      if (updateData.cpf !== undefined) dataToUpdate.cpf = updateData.cpf;
      if (updateData.phone !== undefined) dataToUpdate.phone = updateData.phone;
      if (updateData.email !== undefined) dataToUpdate.email = updateData.email || null;
      if (updateData.address !== undefined) dataToUpdate.address = updateData.address;
      if (updateData.diagnosis !== undefined) dataToUpdate.diagnosis = updateData.diagnosis;
      if (updateData.medicalNotes !== undefined) dataToUpdate.medicalNotes = updateData.medicalNotes;
      if (updateData.status) dataToUpdate.status = updateData.status;
      if (updateData.photoUrl !== undefined) dataToUpdate.photoUrl = updateData.photoUrl;

      await ctx.db.update(patients).set(dataToUpdate).where(eq(patients.id, id));

      return { success: true };
    }),

  // Excluir paciente
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.db) throw new Error("Database not available");
      // Verificar se o paciente pertence ao usuário
      const [patient] = await ctx.db
        .select()
        .from(patients)
        .where(and(eq(patients.id, input.id), eq(patients.userId, ctx.user.id)));

      if (!patient) {
        throw new Error("Paciente não encontrado");
      }

      await ctx.db.delete(patients).where(eq(patients.id, input.id));

      return { success: true };
    }),

  // Obter estatísticas
  getStats: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.db) throw new Error("Database not available");
    const allPatients = await ctx.db
      .select()
      .from(patients)
      .where(eq(patients.userId, ctx.user.id));

    const totalPatients = allPatients.length;
    const activePatients = allPatients.filter((p: any) => p.status === "active").length;
    const pausedPatients = allPatients.filter((p: any) => p.status === "paused").length;
    const completedPatients = allPatients.filter((p: any) => p.status === "completed").length;

    return {
      totalPatients,
      activePatients,
      pausedPatients,
      completedPatients,
    };
  }),
});
