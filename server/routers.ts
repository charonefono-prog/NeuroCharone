import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { patientsRouter } from "./routers/patients";
import { therapeuticPlansRouter } from "./routers/therapeutic-plans";
import { sessionsRouter } from "./routers/sessions";
import { accessControlRouter } from "./routers/access-control";
import { registrationRouter } from "./routers/registration";
import { usersRouter } from "./routers/users";
import { adminRouter } from "./routers/admin";
import { authRouter } from "./routers/auth";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,

  // Feature routers
  auth: authRouter,
  patients: patientsRouter,
  therapeuticPlans: therapeuticPlansRouter,
  sessions: sessionsRouter,
  accessControl: accessControlRouter,
  registration: registrationRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
