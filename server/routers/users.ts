import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { users, accessControl } from "../db/schema";
import { eq } from "drizzle-orm";

export const adminRouter = router({
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
        role: z.enum(["pending", "user", "admin", "rejected"]),
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

      // Fetch the updated user to get their email for accessControl table update
      const [userToUpdate] = await db.select().from(users).where(eq(users.id, userId));
      if (!userToUpdate) {
        throw new Error("User not found after update");
      }

      // Determine access control status based on the new role
      let isApprovedStatus: boolean;
      if (role === "approved" || role === "user" || role === "admin") {
        isApprovedStatus = true;
      } else {
        isApprovedStatus = false;
      }

      // Update access control status in the accessControl table
      await db.update(accessControl).set({ isApproved: isApprovedStatus }).where(eq(accessControl.email, userToUpdate.email));

      // The agent will handle notifications based on the result of this mutation.
      // No direct default_api.message calls here.

      return { success: true, userEmail: userToUpdate.email, newRole: role };
    }),
});
