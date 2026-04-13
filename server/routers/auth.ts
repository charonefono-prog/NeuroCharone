import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { users, invitations } from "@/drizzle/schema";
import { eq, and, gt } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";

// Função para hash de senha (simples - em produção usar bcrypt)
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Função para verificar senha
function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export const authRouter = router({
  // Login
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Buscar usuário
      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (!user[0]) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Email ou senha inválidos",
        });
      }

      // Verificar senha
      if (!user[0].password || !verifyPassword(input.password, user[0].password)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Email ou senha inválidos",
        });
      }

      // Verificar se está aprovado
      if (!user[0].approvedAt) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Sua conta está aguardando aprovação do administrador",
        });
      }

      // Verificar se está ativo (não bloqueado)
      if (!user[0].isActive) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Sua conta foi bloqueada",
        });
      }

      return {
        id: user[0].id,
        email: user[0].email,
        name: user[0].name,
        role: user[0].role,
      };
    }),

  // Registro com validação de convite
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(3),
        specialty: z.string().optional(),
        professionalId: z.string().optional(),
        phone: z.string().optional(),
        inviteCode: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Validar convite
      const invite = await db
        .select()
        .from(invitations)
        .where(eq(invitations.code, input.inviteCode))
        .limit(1);

      if (!invite[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Convite não encontrado",
        });
      }

      if (invite[0].usedAt) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Este convite já foi utilizado",
        });
      }

      if (new Date() > invite[0].expiresAt) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Este convite expirou",
        });
      }

      // Verificar se email já existe
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (existingUser[0]) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Este email já está registrado",
        });
      }

      // Criar novo usuário
      const result = await db.insert(users).values({
        email: input.email,
        password: hashPassword(input.password),
        name: input.name,
        specialty: input.specialty,
        professionalId: input.professionalId,
        phone: input.phone,
        role: "user",
        isActive: true,
        loginMethod: "email",
      });

      // Buscar o novo usuário para obter o ID
      const newUserData = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (newUserData[0]) {
        // Marcar convite como usado
        await db
          .update(invitations)
          .set({
            usedBy: newUserData[0].id,
            usedAt: new Date(),
          })
          .where(eq(invitations.id, invite[0].id));
      }

      return {
        success: true,
        message: "Cadastro realizado! Aguarde aprovação do administrador.",
      };
    }),

  // Obter dados do usuário autenticado
  me: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .limit(1);

    if (!user[0]) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Usuário não encontrado",
      });
    }

    return {
      id: user[0].id,
      email: user[0].email,
      name: user[0].name,
      specialty: user[0].specialty,
      professionalId: user[0].professionalId,
      phone: user[0].phone,
      role: user[0].role,
      isActive: user[0].isActive,
      createdAt: user[0].createdAt,
    };
  }),

  // Logout (apenas limpa sessão no cliente)
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    return { success: true, message: "Desconectado com sucesso" };
  }),

  // Seed admin (apenas em desenvolvimento)
  seedAdmin: publicProcedure.mutation(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Verificar se admin já existe
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, "charonejr@gmail.com"))
      .limit(1);

    if (existingAdmin[0]) {
      return { success: true, message: "Admin já existe" };
    }

    // Inserir admin
    await db.insert(users).values({
      email: "charonejr@gmail.com",
      password: hashPassword("admin123"),
      name: "Admin",
      role: "admin",
      isActive: true,
      approvedAt: new Date(),
      approvedBy: "system",
      loginMethod: "email",
    });

    return { success: true, message: "Admin criado com sucesso" };
  }),

  // Atualizar perfil do usuário
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        specialty: z.string().optional(),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(users)
        .set({
          name: input.name,
          specialty: input.specialty,
          phone: input.phone,
          updatedAt: new Date(),
        })
        .where(eq(users.id, ctx.user.id));

      return { success: true, message: "Perfil atualizado com sucesso" };
    }),
});
