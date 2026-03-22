import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import path from "path";
import { existsSync } from "fs";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Enable CORS for all routes - reflect the request origin to support credentials
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );
    res.header("Access-Control-Allow-Credentials", "true");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  registerOAuthRoutes(app);

  // PWA API Routes
  const pwaUsers: Record<string, any> = {};
  let userIdCounter = 1;

  // Initialize admin user
  pwaUsers['0'] = {
    id: '0',
    name: 'Admin',
    email: 'admin@example.com',
    password: 'admin123',
    status: 'approved',
    role: 'admin',
    createdAt: new Date().toISOString()
  };
  userIdCounter = 1;

  // Helper function to generate JWT token
  function generateToken(user: any) {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
    const payload = Buffer.from(JSON.stringify({ id: user.id, email: user.email, role: user.role, status: user.status })).toString('base64');
    const signature = Buffer.from('signature').toString('base64');
    return `${header}.${payload}.${signature}`;
  }

  // Helper function to verify token
  function verifyToken(token: string) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      return payload;
    } catch {
      return null;
    }
  }

  // Register
  app.post('/api/pwa/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }
    if (Object.values(pwaUsers).some((u: any) => u.email === email)) {
      return res.status(400).json({ error: 'Email já registrado' });
    }
    const user = {
      id: String(userIdCounter++),
      name,
      email,
      password, // In production, use bcrypt
      status: 'pending',
      role: 'user',
      createdAt: new Date().toISOString()
    };
    pwaUsers[user.id] = user;
    res.json({ message: 'Usuário registrado com sucesso. Aguarde aprovação.' });
  });

  // Login
  app.post('/api/pwa/login', (req, res) => {
    const { email, password } = req.body;
    const user = Object.values(pwaUsers).find((u: any) => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }
    if ((user as any).status === 'pending') {
      return res.status(403).json({ error: 'Sua conta está aguardando aprovação' });
    }
    if ((user as any).status === 'blocked') {
      return res.status(403).json({ error: 'Sua conta foi bloqueada' });
    }
    const token = generateToken(user);
    res.json({ token, user: { id: (user as any).id, name: (user as any).name, email: (user as any).email, role: (user as any).role, status: (user as any).status } });
  });

  // Get Users (Admin only)
  app.get('/api/pwa/users', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const payload = verifyToken(token || '');
    if (!payload || payload.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    const users = Object.values(pwaUsers).map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      status: u.status,
      createdAt: u.createdAt
    }));
    res.json(users);
  });

  // Approve User (Admin only)
  app.post('/api/pwa/approve', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const payload = verifyToken(token || '');
    if (!payload || payload.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    const { userId } = req.body;
    if (pwaUsers[userId]) {
      (pwaUsers[userId] as any).status = 'approved';
      res.json({ message: 'Usuário aprovado' });
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  });

  // Reject User (Admin only)
  app.post('/api/pwa/reject', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const payload = verifyToken(token || '');
    if (!payload || payload.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    const { userId } = req.body;
    if (pwaUsers[userId]) {
      (pwaUsers[userId] as any).status = 'blocked';
      res.json({ message: 'Usuário rejeitado' });
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  });

  // Serve PWA
  app.get('/pwa', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'pwa', 'index.html'));
  });

  // Serve static files from web-dist/ (Expo web export) first, then project root
  const webDistPath = path.join(process.cwd(), "web-dist");
  app.use(express.static(webDistPath));
  app.use(express.static(path.join(process.cwd())));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, timestamp: Date.now() });
  });

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  // SPA fallback: serve web-dist/index.html for any non-API, non-file route
  app.get("*", (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith("/api/")) return next();
    const fs = require("fs");
    const webDistIndex = path.join(webDistPath, "index.html");
    if (fs.existsSync(webDistIndex)) {
      res.sendFile(webDistIndex);
    } else {
      res.sendFile(path.join(process.cwd(), "index.html"));
    }
  });

  const port = parseInt(process.env.PORT || "3000");

  // Startup diagnostics
  console.log(`[api] cwd: ${process.cwd()}`);
  console.log(`[api] webDistPath: ${webDistPath}`);
  console.log(`[api] web-dist/index.html exists: ${existsSync(path.join(webDistPath, "index.html"))}`);

  server.listen(port, "0.0.0.0", () => {
    console.log(`[api] server listening on 0.0.0.0:${port}`);
  });
}

startServer().catch(console.error);
