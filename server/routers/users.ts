import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const usersRouter = router({
  getUsers: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Acesso negado. Apenas administradores podem visualizar usuários.");
    }
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }
    const allUsers = await db.select().from(users);
    return { users: allUsers };
  }),

  updateUserRole: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        role: z.enum(["pending", "user", "admin"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Acesso negado. Apenas administradores podem alterar funções de usuários.");
      }

      const { userId, role } = input;

      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      // Update user role in the users table
      await db.update(users).set({ role }).where(eq(users.id, userId));

      // Fetch the updated user to get their email
      const [userToUpdate] = await db.select().from(users).where(eq(users.id, userId));
      if (!userToUpdate) {
        throw new Error("User not found after update");
      }

      return { success: true, userEmail: userToUpdate.email, newRole: role };
    }),
});
