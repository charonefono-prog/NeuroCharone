import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";

// Resolve project root reliably in both dev (tsx) and production (esbuild ESM)
function resolveProjectRoot(): string {
  // In production, dist/index.js runs from project root via `node dist/index.js`
  // process.cwd() should be the project root in both cases
  const cwd = process.cwd();
  // Check if pwa folder exists at cwd
  if (fs.existsSync(path.join(cwd, "pwa"))) {
    return cwd;
  }
  // Fallback: try one level up from dist/
  const parentDir = path.resolve(cwd, "..");
  if (fs.existsSync(path.join(parentDir, "pwa"))) {
    return parentDir;
  }
  // Fallback: try __dirname equivalent
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    // In dev: server/_core/index.ts -> go up 2 levels
    // In prod: dist/index.js -> go up 1 level
    for (let i = 1; i <= 3; i++) {
      const candidate = path.resolve(__dirname, ...Array(i).fill(".."));
      if (fs.existsSync(path.join(candidate, "pwa"))) {
        return candidate;
      }
    }
  } catch {}
  // Last resort
  return cwd;
}

const PROJECT_ROOT = resolveProjectRoot();

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

  // Serve static HTML files
  app.use(express.static(PROJECT_ROOT));

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

  // Serve PWA static files first (so CSS/JS/images are served directly)
  app.use("/pwa", express.static(path.join(PROJECT_ROOT, "pwa")));

  // Serve PWA Admin (SPA fallback)
  app.get("/pwa/admin", (_req, res) => {
    res.sendFile(path.join(PROJECT_ROOT, "pwa", "admin", "index.html"));
  });
  app.get("/pwa/admin/*", (_req, res) => {
    res.sendFile(path.join(PROJECT_ROOT, "pwa", "admin", "index.html"));
  });

  // Serve PWA App (SPA fallback)
  app.get("/pwa/app", (_req, res) => {
    res.sendFile(path.join(PROJECT_ROOT, "pwa", "app", "index.html"));
  });
  app.get("/pwa/app/*", (_req, res) => {
    res.sendFile(path.join(PROJECT_ROOT, "pwa", "app", "index.html"));
  });

  // Serve index.html for root path
  app.get("/", (_req, res) => {
    res.sendFile(path.join(PROJECT_ROOT, "index.html"));
  });

  // Log project root for debugging
  console.log(`[api] Project root: ${PROJECT_ROOT}`);
  console.log(`[api] PWA app exists: ${fs.existsSync(path.join(PROJECT_ROOT, "pwa", "app", "index.html"))}`);
  console.log(`[api] PWA admin exists: ${fs.existsSync(path.join(PROJECT_ROOT, "pwa", "admin", "index.html"))}`);

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`[api] server listening on port ${port}`);
  });
}

startServer().catch(console.error);
