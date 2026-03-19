import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { patientsRouter } from "./routers/patients";
import { therapeuticPlansRouter } from "./routers/therapeutic-plans";
import { sessionsRouter } from "./routers/sessions";
import { accessControlRouter } from "./routers/access-control";
import { registrationRouter } from "./routers/registration";
import { authRouter } from "./routers/auth";
import { pwaAuthRouter } from "./routers/pwa-auth";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: authRouter,
  pwaAuth: pwaAuthRouter, // PWA-only authentication (separate from iOS/Android)

  // Feature routers
  patients: patientsRouter,
  therapeuticPlans: therapeuticPlansRouter,
  sessions: sessionsRouter,
  accessControl: accessControlRouter,
  registration: registrationRouter,
  // pwaAuth is now handled by pwaAuthRouter above (PWA-only, separate from iOS/Android)
});

export type AppRouter = typeof appRouter;
