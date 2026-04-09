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
  const cwd = process.cwd();
  // Check for dist-web (Expo static export) as marker
  if (fs.existsSync(path.join(cwd, "dist-web")) || fs.existsSync(path.join(cwd, "pwa"))) {
    return cwd;
  }
  const parentDir = path.resolve(cwd, "..");
  if (fs.existsSync(path.join(parentDir, "dist-web")) || fs.existsSync(path.join(parentDir, "pwa"))) {
    return parentDir;
  }
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    for (let i = 1; i <= 3; i++) {
      const candidate = path.resolve(__dirname, ...Array(i).fill(".."));
      if (fs.existsSync(path.join(candidate, "dist-web")) || fs.existsSync(path.join(candidate, "pwa"))) {
        return candidate;
      }
    }
  } catch {}
  return cwd;
}

const PROJECT_ROOT = resolveProjectRoot();
const DIST_WEB = path.join(PROJECT_ROOT, "dist-web");

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

  // Enable CORS for all routes
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
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // ============================================================
  // OAuth routes
  // ============================================================
  registerOAuthRoutes(app);

  // ============================================================
  // Serve static HTML files from project root
  // ============================================================
  app.use(express.static(PROJECT_ROOT));

  // ============================================================
  // API routes - ALL under /api/ prefix so production gateway forwards them
  // ============================================================
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, timestamp: Date.now() });
  });

  // ============================================================
  // EXPO WEB APP (Static Export) - Served under /api/webapp/
  // This is the EXACT same app as the mobile version, exported as static HTML.
  // The production gateway only routes /api/* to Express.
  // ============================================================
  const distWebExists = fs.existsSync(DIST_WEB);
  
  if (distWebExists) {
    // Serve all static assets (JS bundles, CSS, images, manifest, service-worker, etc.)
    app.use("/api/webapp", express.static(DIST_WEB, {
      index: false, // We handle index.html manually below
      fallthrough: true,
    }));

    // Serve index.html for the root and all SPA routes
    app.get("/api/webapp", (_req, res) => {
      res.sendFile(path.join(DIST_WEB, "index.html"));
    });
    app.get("/api/webapp/", (_req, res) => {
      res.sendFile(path.join(DIST_WEB, "index.html"));
    });

    // For any sub-route, try the specific HTML file first, then fall back to index.html
    app.get("/api/webapp/*", (req, res) => {
      const subPath = (req.params as Record<string, string>)[0] || "";
      // Try exact HTML file (e.g., /api/webapp/patients -> dist-web/patients.html)
      const htmlFile = path.join(DIST_WEB, subPath + ".html");
      if (fs.existsSync(htmlFile)) {
        res.sendFile(htmlFile);
        return;
      }
      // Try as directory with index.html
      const dirIndex = path.join(DIST_WEB, subPath, "index.html");
      if (fs.existsSync(dirIndex)) {
        res.sendFile(dirIndex);
        return;
      }
      // Try exact file (for assets like .js, .css, .png)
      const exactFile = path.join(DIST_WEB, subPath);
      if (fs.existsSync(exactFile) && fs.statSync(exactFile).isFile()) {
        res.sendFile(exactFile);
        return;
      }
      // Fall back to index.html for SPA routing
      res.sendFile(path.join(DIST_WEB, "index.html"));
    });

    console.log(`[api] Expo web app (static export) available at /api/webapp/`);
  } else {
    console.log(`[api] WARNING: dist-web folder not found at ${DIST_WEB}`);
  }

  // ============================================================
  // PWA ROUTES (old HTML version) - Under /api/pwa/
  // ============================================================
  const pwaDir = path.join(PROJECT_ROOT, "pwa");
  if (fs.existsSync(pwaDir)) {
    app.use("/api/pwa", express.static(pwaDir, {
      index: "index.html",
      fallthrough: true,
    }));

    app.get("/api/pwa/app", (_req, res) => {
      res.sendFile(path.join(pwaDir, "app", "index.html"));
    });
    app.get("/api/pwa/app/", (_req, res) => {
      res.sendFile(path.join(pwaDir, "app", "index.html"));
    });
    app.get("/api/pwa/app/*", (_req, res) => {
      res.sendFile(path.join(pwaDir, "app", "index.html"));
    });

    app.get("/api/pwa/admin", (_req, res) => {
      res.sendFile(path.join(pwaDir, "admin", "index.html"));
    });
    app.get("/api/pwa/admin/", (_req, res) => {
      res.sendFile(path.join(pwaDir, "admin", "index.html"));
    });
    app.get("/api/pwa/admin/*", (_req, res) => {
      res.sendFile(path.join(pwaDir, "admin", "index.html"));
    });

    // Also keep /pwa/ routes for local dev
    app.use("/pwa", express.static(pwaDir, { index: "index.html", fallthrough: true }));
    app.get("/pwa/app", (_req, res) => res.sendFile(path.join(pwaDir, "app", "index.html")));
    app.get("/pwa/app/", (_req, res) => res.sendFile(path.join(pwaDir, "app", "index.html")));
    app.get("/pwa/app/*", (_req, res) => res.sendFile(path.join(pwaDir, "app", "index.html")));
    app.get("/pwa/admin", (_req, res) => res.sendFile(path.join(pwaDir, "admin", "index.html")));
    app.get("/pwa/admin/", (_req, res) => res.sendFile(path.join(pwaDir, "admin", "index.html")));
    app.get("/pwa/admin/*", (_req, res) => res.sendFile(path.join(pwaDir, "admin", "index.html")));
  }

  // Debug endpoint
  app.get("/api/debug-pwa", (_req, res) => {
    const info: Record<string, unknown> = {
      projectRoot: PROJECT_ROOT,
      cwd: process.cwd(),
      nodeEnv: process.env.NODE_ENV,
      distWebExists: fs.existsSync(DIST_WEB),
      distWebIndexExists: fs.existsSync(path.join(DIST_WEB, "index.html")),
      pwaAppExists: fs.existsSync(path.join(PROJECT_ROOT, "pwa", "app", "index.html")),
    };
    try {
      if (fs.existsSync(DIST_WEB)) {
        info.distWebContents = fs.readdirSync(DIST_WEB).slice(0, 20);
      }
    } catch (e: any) { info.distWebError = e.message; }
    res.json(info);
  });

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  // Serve index.html for root path
  app.get("/", (_req, res) => {
    res.sendFile(path.join(PROJECT_ROOT, "index.html"));
  });

  // Log info
  console.log(`[api] Project root: ${PROJECT_ROOT}`);
  console.log(`[api] dist-web exists: ${fs.existsSync(DIST_WEB)}`);
  console.log(`[api] PWA exists: ${fs.existsSync(path.join(PROJECT_ROOT, "pwa", "app", "index.html"))}`);

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
