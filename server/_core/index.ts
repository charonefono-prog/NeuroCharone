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
import { pwaAuthRouter } from "../pwa-auth";

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

  // ============================================================
  // REMIX PWA - Serve the Remix/React Router app at /api/webapp/
  // In DEV: proxy to Remix dev server at port 3001
  // In PROD: use @react-router/express handler with pre-built assets
  // MUST be BEFORE CORS, body parsers, and express.static
  // ============================================================
  // PWA disabled - using standalone PWA in separate repository
  console.log(`[api] PWA serving from separate repository`);

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
  // PWA Auth routes
  // ============================================================
  app.use("/api/pwa-auth", pwaAuthRouter);

  // ============================================================
  // NEW PWA route - uncached path
  // ============================================================
  app.get("/api/neuromap", (_req, res) => {
    const pwaAppDir = path.join(PROJECT_ROOT, "pwa", "app");
    res.set("Cache-Control", "no-cache, no-store, must-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    res.set("ETag", `W/"${Date.now()}"`);
    res.sendFile(path.join(pwaAppDir, "index.html"));
  });
  app.get("/api/neuromap/", (_req, res) => {
    const pwaAppDir = path.join(PROJECT_ROOT, "pwa", "app");
    res.set("Cache-Control", "no-cache, no-store, must-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    res.set("ETag", `W/"${Date.now()}"`);
    res.sendFile(path.join(pwaAppDir, "index.html"));
  });
  // Serve static files for neuromap
  app.use("/api/neuromap", express.static(path.join(PROJECT_ROOT, "pwa", "app"), {
    index: false,
    fallthrough: true,
    setHeaders: (res) => {
      res.set("Cache-Control", "no-cache, no-store, must-revalidate");
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");
    }
  }));

  // ============================================================
  // PWA dynamic asset endpoints (bypass CDN cache)
  // ============================================================
  app.get("/api/pwa-dynamic/helmet-2d.js", (_req, res) => {
    const filePath = path.join(PROJECT_ROOT, "pwa", "app", "helmet-2d.js");
    res.set("Content-Type", "application/javascript");
    res.set("Cache-Control", "no-cache, no-store, must-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    res.set("ETag", `W/"${Date.now()}"`);
    res.sendFile(filePath);
  });
  app.get("/api/pwa-dynamic/helmet-10-20.webp", (_req, res) => {
    const filePath = path.join(PROJECT_ROOT, "pwa", "app", "helmet-10-20.webp");
    res.set("Content-Type", "image/webp");
    res.set("Cache-Control", "no-cache, no-store, must-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    res.set("ETag", `W/"${Date.now()}"`);
    res.sendFile(filePath);
  });

  // ============================================================
  // PWA static assets - dedicated routes for images/js/css
  // ============================================================
  const pwaDir = path.join(PROJECT_ROOT, "pwa");
  
  // Serve specific static files from pwa/app directory
  app.get("/api/pwa-assets/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(pwaDir, "app", filename);
    if (fs.existsSync(filePath)) {
      res.set("Cache-Control", "no-cache, no-store, must-revalidate");
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");
      res.sendFile(filePath);
    } else {
      res.status(404).send("Not found");
    }
  });

  // ============================================================
  // PWA ROUTES (old HTML version) - Under /api/pwa/
  // ============================================================
  if (fs.existsSync(pwaDir)) {
    app.use("/api/pwa", express.static(pwaDir, {
      index: "index.html",
      fallthrough: true,
    }));

    app.get("/api/pwa/app", (_req, res) => {
      res.set("Cache-Control", "no-cache, no-store, must-revalidate");
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");
      res.sendFile(path.join(pwaDir, "app", "index.html"));
    });
    app.get("/api/pwa/app/", (_req, res) => {
      res.set("Cache-Control", "no-cache, no-store, must-revalidate");
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");
      res.sendFile(path.join(pwaDir, "app", "index.html"));
    });
    // Serve static files from pwa/app with explicit static middleware
    app.use("/api/pwa/app", express.static(path.join(pwaDir, "app"), {
      index: false,
      fallthrough: true,
      setHeaders: (res) => {
        res.set("Cache-Control", "no-cache, no-store, must-revalidate");
        res.set("Pragma", "no-cache");
        res.set("Expires", "0");
      }
    }));
    // Catch-all for SPA routing (only for paths without file extensions)
    app.get("/api/pwa/app/*", (_req, res) => {
      res.set("Cache-Control", "no-cache, no-store, must-revalidate");
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");
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
    app.get("/pwa/app", (_req, res) => {
      res.set("Cache-Control", "no-cache, no-store, must-revalidate");
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");
      res.sendFile(path.join(pwaDir, "app", "index.html"));
    });
    app.get("/pwa/app/", (_req, res) => {
      res.set("Cache-Control", "no-cache, no-store, must-revalidate");
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");
      res.sendFile(path.join(pwaDir, "app", "index.html"));
    });
    app.get("/pwa/app/*", (_req, res) => res.sendFile(path.join(pwaDir, "app", "index.html")));
    app.get("/pwa/admin", (_req, res) => res.sendFile(path.join(pwaDir, "admin", "index.html")));
    app.get("/pwa/admin/", (_req, res) => res.sendFile(path.join(pwaDir, "admin", "index.html")));
    app.get("/pwa/admin/*", (_req, res) => res.sendFile(path.join(pwaDir, "admin", "index.html")));
  }

  // Debug endpoint
  app.get("/api/debug-pwa", (_req, res) => {
    const info: Record<string, unknown> = {
      projectRoot: PROJECT_ROOT,
      distWeb: DIST_WEB,
      cwd: process.cwd(),
      nodeEnv: process.env.NODE_ENV,
      distWebExists: fs.existsSync(DIST_WEB),
      distWebIndexExists: fs.existsSync(path.join(DIST_WEB, "index.html")),
      pwaAppExists: fs.existsSync(path.join(PROJECT_ROOT, "pwa", "app", "index.html")),
    };
    // Check registered routes
    try {
      const routes: string[] = [];
      app._router.stack.forEach((r: any) => {
        if (r.route) routes.push(`${Object.keys(r.route.methods).join(',')} ${r.route.path}`);
        else if (r.name === 'router' && r.regexp) routes.push(`ROUTER ${r.regexp}`);
      });
      info.registeredRoutes = routes;
    } catch(e: any) { info.routeError = e.message; }
    try {
      if (fs.existsSync(DIST_WEB)) {
        info.distWebContents = fs.readdirSync(DIST_WEB).slice(0, 30);
      }
      // Check specific _expo path
      const expoDir = path.join(DIST_WEB, "_expo");
      info.expoExists = fs.existsSync(expoDir);
      if (fs.existsSync(expoDir)) {
        info.expoContents = fs.readdirSync(expoDir);
        const jsDir = path.join(expoDir, "static", "js", "web");
        info.jsDirExists = fs.existsSync(jsDir);
        if (fs.existsSync(jsDir)) {
          info.jsFiles = fs.readdirSync(jsDir);
        }
      }
    } catch (e: any) { info.error = e.message; }
    res.json(info);
  });

  // Test endpoint to manually serve a specific file
  app.get("/api/debug-serve-js", (_req, res) => {
    try {
      const jsDir = path.join(DIST_WEB, "_expo", "static", "js", "web");
      if (fs.existsSync(jsDir)) {
        const files = fs.readdirSync(jsDir);
        const entryFile = files.find(f => f.startsWith("entry-") && f.endsWith(".js"));
        if (entryFile) {
          const fullPath = path.join(jsDir, entryFile);
          res.setHeader("Content-Type", "application/javascript");
          res.sendFile(fullPath);
          return;
        }
      }
      res.status(404).json({ error: "JS file not found", jsDir });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
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
