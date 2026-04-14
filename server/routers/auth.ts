import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

// Hash password using SHA-256
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Verify password
function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export const authRouter = router({
  // Register new user
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(2),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check if user already exists
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (existing.length > 0) {
        throw new Error("Email already registered");
      }

      // Create new user
      const passwordHash = hashPassword(input.password);
      const result = await db.insert(users).values({
        email: input.email,
        password: passwordHash,
        fullName: input.name,
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return {
        success: true,
        userId: (result as any).insertId || 0,
      };
    }),

  // Login user
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Find user by email
      const userList = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (userList.length === 0) {
        throw new Error("Invalid email or password");
      }

      const user = userList[0];

      // Verify password
      if (!user.password || !verifyPassword(input.password, user.password)) {
        throw new Error("Invalid email or password");
      }

      // Update last signed in
      await db
        .update(users)
        .set({ updatedAt: new Date() })
        .where(eq(users.id, user.id));

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role,
        },
      };
    }),

  // Get current user
  me: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      return null;
    }

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const userList = await db
      .select()
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .limit(1);

    if (userList.length === 0) {
      return null;
    }

      const user = userList[0];
      return {
        id: user.id,
        email: user.email,
        name: user.fullName,
        role: user.role,
      };
  }),
});
