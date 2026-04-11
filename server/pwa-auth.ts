import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { getDb } from "./db";
import { accessControl, accessLog } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const router = Router();

// JWT secret - use env or fallback
const JWT_SECRET = new TextEncoder().encode(
  process.env.PWA_JWT_SECRET || "neurolaser-pwa-secret-key-2024"
);
const TOKEN_EXPIRY = "7d";

// Admin email - the first registered user or env-configured
const ADMIN_EMAIL = process.env.PWA_ADMIN_EMAIL || "charonejr@gmail.com";

// ============================================================
// Helper: Create JWT
// ============================================================
async function createToken(payload: Record<string, unknown>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(TOKEN_EXPIRY)
    .setIssuedAt()
    .sign(JWT_SECRET);
}

// ============================================================
// Helper: Verify JWT
// ============================================================
async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

// ============================================================
// Middleware: Require Auth
// ============================================================
async function requireAuth(req: Request, res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token não fornecido" });
    return;
  }
  const token = authHeader.split(" ")[1];
  const payload = await verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: "Token inválido ou expirado" });
    return;
  }
  (req as any).user = payload;
  next();
}

// ============================================================
// Middleware: Require Admin
// ============================================================
async function requireAdmin(req: Request, res: Response, next: Function) {
  await requireAuth(req, res, () => {
    const user = (req as any).user;
    if (user?.accessLevel !== "admin") {
      res.status(403).json({ error: "Acesso restrito a administradores" });
      return;
    }
    next();
  });
}

// ============================================================
// POST /api/pwa-auth/register
// ============================================================
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      res.status(400).json({ error: "Email, nome e senha são obrigatórios" });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: "Senha deve ter no mínimo 6 caracteres" });
      return;
    }

    const db = await getDb();
    if (!db) {
      res.status(500).json({ error: "Banco de dados não disponível" });
      return;
    }

    // Check if email already exists
    const existing = await db
      .select()
      .from(accessControl)
      .where(eq(accessControl.email, email.toLowerCase()))
      .limit(1);

    if (existing.length > 0) {
      res.status(409).json({ error: "Este email já está registrado" });
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Determine if this is the admin
    const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    // Insert user
    await db.insert(accessControl).values({
      email: email.toLowerCase(),
      name,
      passwordHash,
      isApproved: isAdmin, // Admin is auto-approved
      accessLevel: isAdmin ? "admin" : "user",
      approvedAt: isAdmin ? new Date() : undefined,
    });

    // Log the registration
    await db.insert(accessLog).values({
      email: email.toLowerCase(),
      name,
      status: isAdmin ? "approved" : "pending",
      reason: isAdmin ? "Admin auto-aprovado" : "Registro pendente de aprovação",
      ipAddress: req.ip || "unknown",
      userAgent: req.headers["user-agent"] || "",
    });

    if (isAdmin) {
      // Auto-login for admin
      const token = await createToken({
        email: email.toLowerCase(),
        name,
        accessLevel: "admin",
        isApproved: true,
      });
      res.json({
        success: true,
        message: "Admin registrado e aprovado automaticamente",
        token,
        user: { email: email.toLowerCase(), name, accessLevel: "admin", isApproved: true },
      });
    } else {
      res.json({
        success: true,
        message: "Registro realizado! Aguarde aprovação do administrador.",
        pending: true,
        user: { email: email.toLowerCase(), name, accessLevel: "user", isApproved: false },
      });
    }
  } catch (error: any) {
    console.error("[pwa-auth] Register error:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// ============================================================
// POST /api/pwa-auth/login
// ============================================================
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email e senha são obrigatórios" });
      return;
    }

    const db = await getDb();
    if (!db) {
      res.status(500).json({ error: "Banco de dados não disponível" });
      return;
    }

    // Find user
    const users = await db
      .select()
      .from(accessControl)
      .where(eq(accessControl.email, email.toLowerCase()))
      .limit(1);

    if (users.length === 0) {
      // Log failed attempt
      await db.insert(accessLog).values({
        email: email.toLowerCase(),
        status: "denied",
        reason: "Email não encontrado",
        ipAddress: req.ip || "unknown",
        userAgent: req.headers["user-agent"] || "",
      });
      res.status(401).json({ error: "Email ou senha incorretos" });
      return;
    }

    const user = users[0];

    // Verify password
    if (!user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
      await db.insert(accessLog).values({
        email: email.toLowerCase(),
        status: "denied",
        reason: "Senha incorreta",
        ipAddress: req.ip || "unknown",
        userAgent: req.headers["user-agent"] || "",
      });
      res.status(401).json({ error: "Email ou senha incorretos" });
      return;
    }

    // Check if approved
    if (!user.isApproved) {
      await db.insert(accessLog).values({
        email: email.toLowerCase(),
        status: "pending",
        reason: "Usuário não aprovado",
        ipAddress: req.ip || "unknown",
        userAgent: req.headers["user-agent"] || "",
      });
      res.status(403).json({
        error: "Sua conta ainda não foi aprovada pelo administrador",
        pending: true,
      });
      return;
    }

    // Check expiry
    if (user.expiresAt && new Date(user.expiresAt) < new Date()) {
      res.status(403).json({ error: "Seu acesso expirou. Contate o administrador." });
      return;
    }

    // Create token
    const token = await createToken({
      email: user.email,
      name: user.name,
      accessLevel: user.accessLevel,
      isApproved: user.isApproved,
    });

    // Log success
    await db.insert(accessLog).values({
      email: email.toLowerCase(),
      status: "approved",
      reason: "Login bem-sucedido",
      ipAddress: req.ip || "unknown",
      userAgent: req.headers["user-agent"] || "",
    });

    res.json({
      success: true,
      token,
      user: {
        email: user.email,
        name: user.name,
        accessLevel: user.accessLevel,
        isApproved: user.isApproved,
        helmetSerialNumber: user.helmetSerialNumber,
        helmetModel: user.helmetModel,
      },
    });
  } catch (error: any) {
    console.error("[pwa-auth] Login error:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// ============================================================
// GET /api/pwa-auth/me - Verify token and get user info
// ============================================================
router.get("/me", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }
  const token = authHeader.split(" ")[1];
  const payload = await verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: "Token inválido" });
    return;
  }

  const db = await getDb();
  if (!db) {
    res.json({ user: payload });
    return;
  }

  // Get fresh user data from DB
  const users = await db
    .select()
    .from(accessControl)
    .where(eq(accessControl.email, (payload.email as string).toLowerCase()))
    .limit(1);

  if (users.length === 0) {
    res.status(401).json({ error: "Usuário não encontrado" });
    return;
  }

  const user = users[0];
  res.json({
    user: {
      email: user.email,
      name: user.name,
      accessLevel: user.accessLevel,
      isApproved: user.isApproved,
      helmetSerialNumber: user.helmetSerialNumber,
      helmetModel: user.helmetModel,
    },
  });
});

// ============================================================
// GET /api/pwa-auth/users - List all users (admin only)
// ============================================================
router.get("/users", requireAdmin as any, async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    if (!db) {
      res.status(500).json({ error: "Banco de dados não disponível" });
      return;
    }

    const allUsers = await db.select({
      id: accessControl.id,
      email: accessControl.email,
      name: accessControl.name,
      isApproved: accessControl.isApproved,
      accessLevel: accessControl.accessLevel,
      helmetSerialNumber: accessControl.helmetSerialNumber,
      helmetModel: accessControl.helmetModel,
      approvedAt: accessControl.approvedAt,
      expiresAt: accessControl.expiresAt,
      createdAt: accessControl.createdAt,
      notes: accessControl.notes,
      approvedBy: accessControl.approvedBy,
      denialReason: accessControl.denialReason,
    }).from(accessControl);

    res.json({ users: allUsers });
  } catch (error: any) {
    console.error("[pwa-auth] List users error:", error);
    res.status(500).json({ error: "Erro interno" });
  }
});

// ============================================================
// POST /api/pwa-auth/approve - Approve a user (admin only)
// ============================================================
router.post("/approve", requireAdmin as any, async (req: Request, res: Response) => {
  try {
    const { email, accessLevel, helmetSerialNumber, helmetModel, notes } = req.body;
    if (!email) {
      res.status(400).json({ error: "Email é obrigatório" });
      return;
    }

    const db = await getDb();
    if (!db) {
      res.status(500).json({ error: "Banco de dados não disponível" });
      return;
    }

    const adminUser = (req as any).user;

    await db
      .update(accessControl)
      .set({
        isApproved: true,
        accessLevel: accessLevel || "user",
        helmetSerialNumber: helmetSerialNumber || undefined,
        helmetModel: helmetModel || undefined,
        notes: notes || undefined,
        approvedAt: new Date(),
        approvedBy: adminUser.email,
        denialReason: null,
      })
      .where(eq(accessControl.email, email.toLowerCase()));

    // Log
    await db.insert(accessLog).values({
      email: email.toLowerCase(),
      status: "approved",
      reason: `Aprovado por ${adminUser.email}`,
      ipAddress: req.ip || "unknown",
      userAgent: req.headers["user-agent"] || "",
      processedAt: new Date(),
    });

    res.json({ success: true, message: "Usuário aprovado" });
  } catch (error: any) {
    console.error("[pwa-auth] Approve error:", error);
    res.status(500).json({ error: "Erro interno" });
  }
});

// ============================================================
// POST /api/pwa-auth/reject - Reject/revoke a user (admin only)
// ============================================================
router.post("/reject", requireAdmin as any, async (req: Request, res: Response) => {
  try {
    const { email, reason } = req.body;
    if (!email) {
      res.status(400).json({ error: "Email é obrigatório" });
      return;
    }

    const db = await getDb();
    if (!db) {
      res.status(500).json({ error: "Banco de dados não disponível" });
      return;
    }

    const adminUser = (req as any).user;

    await db
      .update(accessControl)
      .set({
        isApproved: false,
        denialReason: reason || "Acesso negado pelo administrador",
        approvedBy: adminUser.email,
      })
      .where(eq(accessControl.email, email.toLowerCase()));

    // Log
    await db.insert(accessLog).values({
      email: email.toLowerCase(),
      status: "denied",
      reason: reason || "Rejeitado pelo administrador",
      ipAddress: req.ip || "unknown",
      userAgent: req.headers["user-agent"] || "",
      processedAt: new Date(),
    });

    res.json({ success: true, message: "Acesso revogado" });
  } catch (error: any) {
    console.error("[pwa-auth] Reject error:", error);
    res.status(500).json({ error: "Erro interno" });
  }
});

// ============================================================
// DELETE /api/pwa-auth/user/:email - Delete a user (admin only)
// ============================================================
router.delete("/user/:email", requireAdmin as any, async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    if (!email) {
      res.status(400).json({ error: "Email é obrigatório" });
      return;
    }

    const db = await getDb();
    if (!db) {
      res.status(500).json({ error: "Banco de dados não disponível" });
      return;
    }

    await db.delete(accessControl).where(eq(accessControl.email, email.toLowerCase()));

    res.json({ success: true, message: "Usuário removido" });
  } catch (error: any) {
    console.error("[pwa-auth] Delete error:", error);
    res.status(500).json({ error: "Erro interno" });
  }
});

// ============================================================
// GET /api/pwa-auth/logs - Access logs (admin only)
// ============================================================
router.get("/logs", requireAdmin as any, async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    if (!db) {
      res.status(500).json({ error: "Banco de dados não disponível" });
      return;
    }

    const logs = await db.select().from(accessLog);
    res.json({ logs });
  } catch (error: any) {
    console.error("[pwa-auth] Logs error:", error);
    res.status(500).json({ error: "Erro interno" });
  }
});

export { router as pwaAuthRouter };
