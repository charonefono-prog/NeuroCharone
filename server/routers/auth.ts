import { z } from "zod";
import { publicProcedure, protectedProcedure, router, adminProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { users, invites, auditLog } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";
import { COOKIE_NAME } from "../../shared/const.js";
import { getSessionCookieOptions } from "../_core/cookies";
import { emailService } from "../_core/email";

/**
 * Hash de senha com salt
 */
function hashPassword(password: string): string {
  return crypto
    .createHash("sha256")
    .update(password + "neurolasermap_salt_2024")
    .digest("hex");
}

/**
 * Verificar senha
 */
function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

/**
 * Gerar código de convite único
 */
function generateInviteCode(): string {
  return crypto.randomBytes(16).toString("hex");
}

/**
 * Auth Router
 * Gerencia autenticação de usuários
 */
export const authRouter = router({
  /**
   * Registrar novo usuário com email e senha
   */
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        fullName: z.string().min(3),
        password: z.string().min(6),
        specialty: z.string().optional(),
        professionalId: z.string().optional(),
        inviteCode: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      // Verificar se email já existe
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (existingUser.length > 0) {
        throw new Error("Email already registered");
      }

      // Se houver código de convite, validar
      if (input.inviteCode) {
        const invite = await db
          .select()
          .from(invites)
          .where(
            and(
              eq(invites.code, input.inviteCode),
            )
          )
          .limit(1);

        if (invite.length === 0 || invite[0].usedAt !== null) {
          throw new Error("Invalid or expired invite code");
        }

        // Verificar expiração
        if (new Date(invite[0].expiresAt) < new Date()) {
          throw new Error("Invite code has expired");
        }
      }

      // Hash da senha
      const passwordHash = hashPassword(input.password);

      // Criar novo usuário (não aprovado por padrão)
      const newUser = await db.insert(users).values({
        email: input.email,
        fullName: input.fullName,
        passwordHash: passwordHash,
        specialty: input.specialty,
        professionalId: input.professionalId,
        role: "pending",
        isApproved: false,
      });

      // Obter o ID do usuário criado
      const createdUsers = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);
      const userId = createdUsers[0]?.id;

      // Se houver código de convite, marcar como usado
      if (input.inviteCode && userId) {
        const invite = await db
          .select()
          .from(invites)
          .where(eq(invites.code, input.inviteCode))
          .limit(1);

        if (invite.length > 0) {
          await db
            .update(invites)
            .set({
              usedAt: new Date(),
              usedBy: userId,
            })
            .where(eq(invites.id, invite[0].id));
        }
      }

      // Registrar no audit log
      if (userId) {
        await db.insert(auditLog).values({
          userId: userId,
          action: "user_registered",
          details: `User registered: ${input.email}`,
        });
      }

      // Enviar email de boas-vindas
      await emailService.sendWelcomeEmail(input.email, input.fullName);

      // Enviar email de notificação ao admin
      const adminEmail = process.env.ADMIN_EMAIL || "admin@neurolasermap.com";
      await emailService.sendAdminNotificationEmail(adminEmail, input.fullName, input.email);

      return {
        success: true,
        message: "Registration successful. Awaiting administrator approval.",
        email: input.email,
      };
    }),

  /**
   * Login com email e senha
   */
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      // Buscar usuário
      const userList = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (userList.length === 0) {
        return {
          success: false,
          reason: "Email not found",
        };
      }

      const user = userList[0];

      // Verificar senha
      if (!user.passwordHash || !verifyPassword(input.password, user.passwordHash)) {
        return {
          success: false,
          reason: "Invalid password",
        };
      }

      // Verificar se está bloqueado
      if (user.isBlocked) {
        return {
          success: false,
          reason: user.blockedReason || "Your access has been blocked.",
        };
      }

      // Verificar aprovação
      if (!user.isApproved) {
        return {
          success: false,
          reason: "Your access is pending approval.",
        };
      }

      // Criar sessão (cookie)
      const cookieOptions = getSessionCookieOptions(ctx.req);
      const sessionToken = crypto.randomBytes(32).toString("hex");
      
      ctx.res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      });

      // Registrar no audit log
      await db.insert(auditLog).values({
        userId: user.id,
        action: "user_login",
        details: `User logged in: ${input.email}`,
      });

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          specialty: user.specialty,
          professionalId: user.professionalId,
        },
      };
    }),

  /**
   * Obter usuário autenticado
   */
  me: publicProcedure.query(({ ctx }) => {
    if (!ctx.user) {
      return null;
    }

    return {
      id: ctx.user.id,
      email: ctx.user.email,
      fullName: ctx.user.fullName,
      role: ctx.user.role,
      specialty: ctx.user.specialty,
      professionalId: ctx.user.professionalId,
      photoUrl: ctx.user.photoUrl,
      isApproved: ctx.user.isApproved,
    };
  }),

  /**
   * Logout
   */
  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return {
      success: true,
    };
  }),

  /**
   * Listar usuários pendentes de aprovação (admin only)
   */
  getPendingUsers: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const pendingUsers = await db
      .select()
      .from(users)
      .where(eq(users.isApproved, false));

    return pendingUsers.map((u) => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      specialty: u.specialty,
      professionalId: u.professionalId,
      createdAt: u.createdAt,
      role: u.role,
    }));
  }),

  /**
   * Aprovar usuário (admin only)
   */
  approveUser: adminProcedure
    .input(
      z.object({
        userId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      await db
        .update(users)
        .set({
          isApproved: true,
          approvedAt: new Date(),
          approvedBy: ctx.user!.id,
          role: "user",
        })
        .where(eq(users.id, input.userId));

      // Buscar usuario para obter email
      const userList = await db
        .select()
        .from(users)
        .where(eq(users.id, input.userId))
        .limit(1);

      if (userList.length === 0) {
        throw new Error("User not found");
      }

      const user = userList[0];

      await db
        .update(users)
        .set({
          isApproved: true,
          approvedAt: new Date(),
          approvedBy: ctx.user!.id,
          role: "user",
        })
        .where(eq(users.id, input.userId));

      // Registrar no audit log
      await db.insert(auditLog).values({
        userId: ctx.user!.id,
        action: "user_approved",
        details: `User ${input.userId} approved by ${ctx.user!.email}`,
      });

      // Enviar email de aprovacao
      if (user.email && user.fullName) {
        await emailService.sendApprovalEmail(user.email, user.fullName);
      }

      return {
        success: true,
        message: "User approved successfully",
      };
    }),

  /**
   * Bloquear usuário (admin only)
   */
  blockUser: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        reason: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      await db
        .update(users)
        .set({
          isBlocked: true,
          blockedReason: input.reason,
        })
        .where(eq(users.id, input.userId));

      // Registrar no audit log
      await db.insert(auditLog).values({
        userId: ctx.user!.id,
        action: "user_blocked",
        details: `User ${input.userId} blocked: ${input.reason}`,
      });

      return {
        success: true,
        message: "User blocked successfully",
      };
    }),

  /**
   * Desbloquear usuário (admin only)
   */
  unblockUser: adminProcedure
    .input(
      z.object({
        userId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      await db
        .update(users)
        .set({
          isBlocked: false,
          blockedReason: null,
        })
        .where(eq(users.id, input.userId));

      // Registrar no audit log
      await db.insert(auditLog).values({
        userId: ctx.user!.id,
        action: "user_unblocked",
        details: `User ${input.userId} unblocked`,
      });

      return {
        success: true,
        message: "User unblocked successfully",
      };
    }),

  /**
   * Gerar código de convite (admin only)
   */
  generateInvite: adminProcedure
    .input(
      z.object({
        email: z.string().email().optional(),
        expiresInDays: z.number().default(30),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const code = generateInviteCode();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + input.expiresInDays);

      const result = await db.insert(invites).values({
        code: code,
        email: input.email,
        createdBy: ctx.user!.id,
        expiresAt: expiresAt,
      });

      return {
        success: true,
        code: code,
        expiresAt: expiresAt,
      };
    }),

  /**
   * Listar convites (admin only)
   */
  listInvites: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const inviteList = await db.select().from(invites);

    return inviteList.map((i) => ({
      id: i.id,
      code: i.code,
      email: i.email,
      createdAt: i.createdAt,
      usedAt: i.usedAt,
      expiresAt: i.expiresAt,
      isExpired: new Date(i.expiresAt) < new Date(),
      isUsed: i.usedAt !== null,
    }));
  }),
});
