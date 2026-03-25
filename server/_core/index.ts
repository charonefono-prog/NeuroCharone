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
