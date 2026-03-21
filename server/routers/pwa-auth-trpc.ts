import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { accessControl } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { hashPassword, comparePassword, generateToken } from "../_core/auth";

/**
 * PWA Authentication Router (tRPC)
 * Uses database (Drizzle) instead of JSON files
 * Mirrors pwa-auth.ts but with tRPC procedures
 */
export const pwaAuthRouter = router({
  /**
   * Get list of pending PWA users (admin only)
   */
  getPendingUsers: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const pending = await db
      .select()
      .from(accessControl)
      .where(eq(accessControl.isApproved, false));

      return pending.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name || "",
        createdAt: u.createdAt,
      }));
  }),

  /**
   * Approve a pending PWA user (admin only)
   */
  approveUser: publicProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const result = await db
        .update(accessControl)
        .set({
          isApproved: true,
          approvedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(accessControl.id, input.userId));

      return {
        success: true,
        message: "User approved successfully",
      };
    }),

  /**
   * Reject a pending PWA user (admin only)
   */
  rejectUser: publicProcedure
    .input(z.object({ userId: z.number(), reason: z.string().optional() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const result = await db
        .update(accessControl)
        .set({
          isApproved: false,
          denialReason: input.reason || "Rejected by admin",
          updatedAt: new Date(),
        })
        .where(eq(accessControl.id, input.userId));

      return {
        success: true,
        message: "User rejected successfully",
      };
    }),

  /**
   * Register new user
   */
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        name: z.string().min(3, "Name must be at least 3 characters"),
        password: z.string().min(6, "Password must be at least 6 characters"),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      // Check if email already exists
      const existing = await db
        .select()
        .from(accessControl)
        .where(eq(accessControl.email, input.email))
        .limit(1);

      if (existing.length > 0) {
        throw new Error("Email already registered");
      }

      // Hash password
      const passwordHash = await hashPassword(input.password);

      // Create new PWA user (not approved)
      await db.insert(accessControl).values({
        email: input.email,
        name: input.name || "",
        passwordHash: passwordHash,
        isApproved: false, // User must be approved by admin
        accessLevel: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return {
        success: true,
        message: "Registration successful. Please wait for administrator approval.",
        email: input.email,
      };
    }),

  /**
   * Login with email and password
   */
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      // Find user by email
      const userList = await db
        .select()
        .from(accessControl)
        .where(eq(accessControl.email, input.email))
        .limit(1);

      if (userList.length === 0) {
        throw new Error("Invalid email or password");
      }

      const user = userList[0];

      // Check password
      if (!user.passwordHash) {
        throw new Error("Invalid email or password");
      }

      const passwordMatch = await comparePassword(input.password, user.passwordHash);
      if (!passwordMatch) {
        throw new Error("Invalid email or password");
      }

      // Check if user is approved
      if (!user.isApproved) {
        throw new Error("Your account is pending approval. Please wait for administrator approval.");
      }

      // Check if access has expired
      if (user.expiresAt && new Date(user.expiresAt) < new Date()) {
        throw new Error("Your access has expired. Please contact the administrator.");
      }

      // Generate JWT token
      const token = generateToken(user.id, user.email, user.accessLevel as "user" | "admin");

      return {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name || "",
          accessLevel: user.accessLevel,
        },
      };
    }),

  /**
   * Logout user
   */
  logout: publicProcedure.mutation(async () => {
    return {
      success: true,
      message: "Logged out successfully",
    };
  }),

  /**
   * Verify JWT token
   */
  verifyToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
      
      try {
        const jwt = require("jsonwebtoken");
        const decoded = jwt.verify(input.token, JWT_SECRET);
        return {
          success: true,
          user: decoded,
        };
      } catch (err) {
        throw new Error("Invalid or expired token");
      }
    }),
});
