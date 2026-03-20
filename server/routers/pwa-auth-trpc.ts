import { router, publicProcedure } from "@/server/_core/trpc";
import { z } from "zod";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as fs from "fs";
import * as path from "path";

// Load users from JSON file
const usersFilePath = path.join(process.cwd(), "users.json");

function loadUsers(): Record<string, any> {
  try {
    if (fs.existsSync(usersFilePath)) {
      const data = fs.readFileSync(usersFilePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error loading users:", err);
  }
  return {};
}

function saveUsers(users: Record<string, any>) {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error("Error saving users:", err);
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export const pwaAuthRouter = router({
  // Register new user
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      const users = loadUsers();

      if (users[input.email]) {
        throw new Error("Email already registered");
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      users[input.email] = {
        id: Date.now().toString(),
        name: input.name,
        email: input.email,
        password: hashedPassword,
        status: "pending",
        createdAt: new Date().toISOString(),
        approvedAt: null,
      };

      saveUsers(users);

      return {
        success: true,
        message: "User registered successfully. Awaiting admin approval.",
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
      const users = loadUsers();
      const user = users[input.email];

      if (!user) {
        throw new Error("Invalid credentials");
      }

      const passwordMatch = await bcrypt.compare(input.password, user.password);
      if (!passwordMatch) {
        throw new Error("Invalid credentials");
      }

      if (user.status !== "active") {
        throw new Error(`Account is ${user.status}. Please wait for admin approval.`);
      }

      const token = jwt.sign(
        { email: user.email, name: user.name, id: user.id },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return {
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    }),

  // Logout (just a confirmation)
  logout: publicProcedure.mutation(() => {
    return {
      success: true,
      message: "Logged out successfully",
    };
  }),

  // Get pending users (admin only)
  getPendingUsers: publicProcedure.query(() => {
    const users = loadUsers();
    const pendingUsers = Object.values(users).filter(
      (u: any) => u.status === "pending"
    );
    return pendingUsers;
  }),

  // Approve user (admin only)
  approveUser: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(({ input }) => {
      const users = loadUsers();
      const user = users[input.email];

      if (!user) {
        throw new Error("User not found");
      }

      user.status = "active";
      user.approvedAt = new Date().toISOString();
      saveUsers(users);

      return {
        success: true,
        message: `User ${input.email} approved`,
      };
    }),

  // Reject user (admin only)
  rejectUser: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(({ input }) => {
      const users = loadUsers();
      const user = users[input.email];

      if (!user) {
        throw new Error("User not found");
      }

      user.status = "rejected";
      saveUsers(users);

      return {
        success: true,
        message: `User ${input.email} rejected`,
      };
    }),

  // Verify token
  verifyToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(({ input }) => {
      try {
        const decoded = jwt.verify(input.token, JWT_SECRET);
        return {
          valid: true,
          user: decoded,
        };
      } catch (err) {
        return {
          valid: false,
          error: "Invalid token",
        };
      }
    }),
});
